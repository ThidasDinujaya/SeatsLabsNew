const pool = require('../config/database');

class Service {
  /**
   * Find service by ID
   * @param {number} serviceId 
   * @returns {Promise<Object|null>}
   */
  static async findById(serviceId) {
    const query = `
      SELECT 
        s.*,
        sc."serviceCategoryName",
        sc."serviceCategoryDescription",
        sc."serviceCategoryIcon"
      FROM "Services" s
      INNER JOIN "ServiceCategories" sc ON s."serviceCategoryId" = sc."serviceCategoryId"
      WHERE s."serviceId" = $1
    `;
    const result = await pool.query(query, [serviceId]);
    return result.rows[0] || null;
  }

  /**
   * Get all services with optional filters
   * @param {Object} filters 
   * @returns {Promise<Array>}
   */
  static async findAll(filters = {}) {
    const { categoryId, isActive = true, limit = 100, offset = 0 } = filters;
    
    let query = `
      SELECT 
        s.*,
        sc."serviceCategoryName",
        sc."serviceCategoryIcon"
      FROM "Services" s
      INNER JOIN "ServiceCategories" sc ON s."serviceCategoryId" = sc."serviceCategoryId"
      WHERE 1=1
    `;

    const values = [];
    let paramCount = 1;

    if (categoryId) {
      query += ` AND s."serviceCategoryId" = $${paramCount}`;
      values.push(categoryId);
      paramCount++;
    }

    if (isActive !== undefined) {
      query += ` AND s."serviceIsActive" = $${paramCount}`;
      values.push(isActive);
      paramCount++;
    }

    query += ` ORDER BY sc."serviceCategoryName", s."serviceName" LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get services by category
   * @param {number} categoryId 
   * @returns {Promise<Array>}
   */
  static async findByCategory(categoryId) {
    const query = `
      SELECT *
      FROM "Services"
      WHERE "serviceCategoryId" = $1 AND "serviceIsActive" = true
      ORDER BY "serviceName"
    `;
    const result = await pool.query(query, [categoryId]);
    return result.rows;
  }

  /**
   * Create new service
   * @param {Object} serviceData 
   * @returns {Promise<Object>}
   */
  static async create(serviceData) {
    const {
      serviceCategoryId,
      serviceName,
      serviceDescription,
      serviceDurationMinutes,
      serviceBasePrice,
      serviceRequirements
    } = serviceData;

    const query = `
      INSERT INTO "Services" (
        "serviceCategoryId", "serviceName", "serviceDescription",
        "serviceDurationMinutes", "serviceBasePrice", "serviceRequirements"
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [
      serviceCategoryId,
      serviceName,
      serviceDescription || null,
      serviceDurationMinutes,
      serviceBasePrice,
      serviceRequirements || null
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Update service
   * @param {number} serviceId 
   * @param {Object} updates 
   * @returns {Promise<Object>}
   */
  static async update(serviceId, updates) {
    const allowedFields = [
      'serviceName', 'serviceDescription', 'serviceDurationMinutes',
      'serviceBasePrice', 'serviceRequirements', 'serviceIsActive'
    ];

    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        fields.push(`"${key}" = $${paramCount}`);
        values.push(updates[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }

    fields.push(`"serviceUpdatedAt" = CURRENT_TIMESTAMP`);
    values.push(serviceId);

    const query = `
      UPDATE "Services"
      SET ${fields.join(', ')}
      WHERE "serviceId" = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Delete service (soft delete)
   * @param {number} serviceId 
   * @returns {Promise<boolean>}
   */
  static async delete(serviceId) {
    const query = `
      UPDATE "Services"
      SET "serviceIsActive" = false, "serviceUpdatedAt" = CURRENT_TIMESTAMP
      WHERE "serviceId" = $1
      RETURNING "serviceId"
    `;
    const result = await pool.query(query, [serviceId]);
    return result.rowCount > 0;
  }

  /**
   * Search services by name
   * @param {string} searchTerm 
   * @returns {Promise<Array>}
   */
  static async search(searchTerm) {
    const query = `
      SELECT 
        s.*,
        sc."serviceCategoryName"
      FROM "Services" s
      INNER JOIN "ServiceCategories" sc ON s."serviceCategoryId" = sc."serviceCategoryId"
      WHERE s."serviceIsActive" = true
        AND (
          s."serviceName" ILIKE $1
          OR s."serviceDescription" ILIKE $1
          OR sc."serviceCategoryName" ILIKE $1
        )
      ORDER BY s."serviceName"
      LIMIT 20
    `;
    const result = await pool.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }

  /**
   * Get service statistics
   * @param {number} serviceId 
   * @returns {Promise<Object>}
   */
  static async getStatistics(serviceId) {
    const query = `
      SELECT 
        s.*,
        COUNT(b."bookingId") as "totalBookings",
        COUNT(CASE WHEN bs."bookingStatusName" = 'Completed' THEN 1 END) as "completedBookings",
        COALESCE(AVG(f."feedbackRating"), 0) as "averageRating",
        COALESCE(SUM(p."paymentAmount"), 0) as "totalRevenue"
      FROM "Services" s
      LEFT JOIN "Bookings" b ON s."serviceId" = b."serviceId"
      LEFT JOIN "BookingStatuses" bs ON b."bookingStatusId" = bs."bookingStatusId"
      LEFT JOIN "Feedbacks" f ON b."bookingId" = f."bookingId"
      LEFT JOIN "Payments" p ON b."bookingId" = p."bookingId"
      WHERE s."serviceId" = $1
      GROUP BY s."serviceId"
    `;
    const result = await pool.query(query, [serviceId]);
    return result.rows[0] || null;
  }

  /**
   * Get popular services
   * @param {number} limit 
   * @returns {Promise<Array>}
   */
  static async getPopular(limit = 10) {
    const query = `
      SELECT 
        s.*,
        sc."serviceCategoryName",
        COUNT(b."bookingId") as "bookingCount",
        COALESCE(AVG(f."feedbackRating"), 0) as "averageRating"
      FROM "Services" s
      INNER JOIN "ServiceCategories" sc ON s."serviceCategoryId" = sc."serviceCategoryId"
      LEFT JOIN "Bookings" b ON s."serviceId" = b."serviceId"
      LEFT JOIN "Feedbacks" f ON b."bookingId" = f."bookingId"
      WHERE s."serviceIsActive" = true
      GROUP BY s."serviceId", sc."serviceCategoryName"
      ORDER BY "bookingCount" DESC, "averageRating" DESC
      LIMIT $1
    `;
    const result = await pool.query(query, [limit]);
    return result.rows;
  }
}

module.exports = Service;
