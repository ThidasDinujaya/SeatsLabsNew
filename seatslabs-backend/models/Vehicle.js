const pool = require('../config/database');

class Vehicle {
  /**
   * Find vehicle by ID with full details
   * @param {number} vehicleId 
   * @returns {Promise<Object|null>}
   */
  static async findById(vehicleId) {
    const query = `
      SELECT 
        v.*,
        vb."vehicleBrandName",
        vb."vehicleBrandCountry",
        vm."vehicleModelName",
        vbt."vehicleBodyTypeName",
        c."customerId",
        u."userFirstName" || ' ' || u."userLastName" as "ownerName",
        u."userEmail" as "ownerEmail",
        u."userPhoneNumber" as "ownerPhone"
      FROM "Vehicles" v
      INNER JOIN "VehicleBrands" vb ON v."vehicleBrandId" = vb."vehicleBrandId"
      INNER JOIN "VehicleModels" vm ON v."vehicleModelId" = vm."vehicleModelId"
      LEFT JOIN "VehicleBodyTypes" vbt ON v."vehicleBodyTypeId" = vbt."vehicleBodyTypeId"
      INNER JOIN "Customers" c ON v."customerId" = c."customerId"
      INNER JOIN "Users" u ON c."userId" = u."userId"
      WHERE v."vehicleId" = $1
    `;
    const result = await pool.query(query, [vehicleId]);
    return result.rows[0] || null;
  }

  /**
   * Find vehicle by registration number
   * @param {string} registrationNumber 
   * @returns {Promise<Object|null>}
   */
  static async findByRegistration(registrationNumber) {
    const query = `
      SELECT 
        v.*,
        vb."vehicleBrandName",
        vm."vehicleModelName",
        vbt."vehicleBodyTypeName"
      FROM "Vehicles" v
      INNER JOIN "VehicleBrands" vb ON v."vehicleBrandId" = vb."vehicleBrandId"
      INNER JOIN "VehicleModels" vm ON v."vehicleModelId" = vm."vehicleModelId"
      LEFT JOIN "VehicleBodyTypes" vbt ON v."vehicleBodyTypeId" = vbt."vehicleBodyTypeId"
      WHERE v."vehicleRegistrationNumber" = $1
    `;
    const result = await pool.query(query, [registrationNumber]);
    return result.rows[0] || null;
  }

  /**
   * Get all vehicles for a customer
   * @param {number} customerId 
   * @param {Object} options 
   * @returns {Promise<Array>}
   */
  static async findByCustomer(customerId, options = {}) {
    const { includeInactive = false } = options;
    
    let query = `
      SELECT 
        v.*,
        vb."vehicleBrandName",
        vm."vehicleModelName",
        vbt."vehicleBodyTypeName",
        COUNT(b."bookingId") as "totalBookings"
      FROM "Vehicles" v
      INNER JOIN "VehicleBrands" vb ON v."vehicleBrandId" = vb."vehicleBrandId"
      INNER JOIN "VehicleModels" vm ON v."vehicleModelId" = vm."vehicleModelId"
      LEFT JOIN "VehicleBodyTypes" vbt ON v."vehicleBodyTypeId" = vbt."vehicleBodyTypeId"
      LEFT JOIN "Bookings" b ON v."vehicleId" = b."vehicleId"
      WHERE v."customerId" = $1
    `;

    if (!includeInactive) {
      query += ` AND v."vehicleIsActive" = true`;
    }

    query += `
      GROUP BY v."vehicleId", vb."vehicleBrandName", vm."vehicleModelName", vbt."vehicleBodyTypeName"
      ORDER BY v."vehicleCreatedAt" DESC
    `;

    const result = await pool.query(query, [customerId]);
    return result.rows;
  }

  /**
   * Create new vehicle
   * @param {Object} vehicleData 
   * @returns {Promise<Object>}
   */
  static async create(vehicleData) {
    const {
      customerId,
      vehicleBrandId,
      vehicleModelId,
      vehicleBodyTypeId,
      vehicleRegistrationNumber,
      vehicleManufactureYear,
      vehicleColor,
      vehicleMileage,
      vehicleVin
    } = vehicleData;

    const query = `
      INSERT INTO "Vehicles" (
        "customerId", "vehicleBrandId", "vehicleModelId", "vehicleBodyTypeId",
        "vehicleRegistrationNumber", "vehicleManufactureYear", "vehicleColor",
        "vehicleMileage", "vehicleVin"
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      customerId,
      vehicleBrandId,
      vehicleModelId,
      vehicleBodyTypeId || null,
      vehicleRegistrationNumber.toUpperCase(),
      vehicleManufactureYear,
      vehicleColor || null,
      vehicleMileage || 0,
      vehicleVin || null
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Update vehicle
   * @param {number} vehicleId 
   * @param {Object} updates 
   * @returns {Promise<Object>}
   */
  static async update(vehicleId, updates) {
    const allowedFields = [
      'vehicleColor', 'vehicleMileage', 'vehicleIsActive'
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

    fields.push(`"vehicleUpdatedAt" = CURRENT_TIMESTAMP`);
    values.push(vehicleId);

    const query = `
      UPDATE "Vehicles"
      SET ${fields.join(', ')}
      WHERE "vehicleId" = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Update vehicle mileage
   * @param {number} vehicleId 
   * @param {number} mileage 
   * @returns {Promise<Object>}
   */
  static async updateMileage(vehicleId, mileage) {
    const query = `
      UPDATE "Vehicles"
      SET "vehicleMileage" = $1, "vehicleUpdatedAt" = CURRENT_TIMESTAMP
      WHERE "vehicleId" = $2
      RETURNING *
    `;
    const result = await pool.query(query, [mileage, vehicleId]);
    return result.rows[0];
  }

  /**
   * Soft delete vehicle
   * @param {number} vehicleId 
   * @returns {Promise<boolean>}
   */
  static async delete(vehicleId) {
    const query = `
      UPDATE "Vehicles"
      SET "vehicleIsActive" = false, "vehicleUpdatedAt" = CURRENT_TIMESTAMP
      WHERE "vehicleId" = $1
      RETURNING "vehicleId"
    `;
    const result = await pool.query(query, [vehicleId]);
    return result.rowCount > 0;
  }

  /**
   * Get vehicle service history
   * @param {number} vehicleId 
   * @param {Object} options 
   * @returns {Promise<Array>}
   */
  static async getServiceHistory(vehicleId, options = {}) {
    const { limit = 50, offset = 0 } = options;
    
    const query = `
      SELECT 
        b.*,
        s."serviceName",
        s."serviceDescription",
        sc."serviceCategoryName",
        bs."bookingStatusName",
        t."technicianId",
        tu."userFirstName" || ' ' || tu."userLastName" as "technicianName",
        p."paymentAmount",
        ps."paymentStatusName"
      FROM "Bookings" b
      INNER JOIN "Services" s ON b."serviceId" = s."serviceId"
      INNER JOIN "ServiceCategories" sc ON s."serviceCategoryId" = sc."serviceCategoryId"
      INNER JOIN "BookingStatuses" bs ON b."bookingStatusId" = bs."bookingStatusId"
      LEFT JOIN "Technicians" t ON b."technicianId" = t."technicianId"
      LEFT JOIN "Users" tu ON t."userId" = tu."userId"
      LEFT JOIN "Payments" p ON b."bookingId" = p."bookingId"
      LEFT JOIN "PaymentStatuses" ps ON p."paymentStatusId" = ps."paymentStatusId"
      WHERE b."vehicleId" = $1
      ORDER BY b."bookingScheduledDateTime" DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await pool.query(query, [vehicleId, limit, offset]);
    return result.rows;
  }

  /**
   * Get vehicle statistics
   * @param {number} vehicleId 
   * @returns {Promise<Object>}
   */
  static async getStatistics(vehicleId) {
    const query = `
      SELECT 
        v.*,
        COUNT(b."bookingId") as "totalServices",
        COALESCE(SUM(p."paymentAmount"), 0) as "totalSpent",
        MAX(b."bookingScheduledDateTime") as "lastServiceDate"
      FROM "Vehicles" v
      LEFT JOIN "Bookings" b ON v."vehicleId" = b."vehicleId"
      LEFT JOIN "Payments" p ON b."bookingId" = p."bookingId"
      WHERE v."vehicleId" = $1
      GROUP BY v."vehicleId"
    `;
    const result = await pool.query(query, [vehicleId]);
    return result.rows[0] || null;
  }

  /**
   * Search vehicles
   * @param {Object} filters 
   * @returns {Promise<Array>}
   */
  static async search(filters = {}) {
    const { brandId, modelId, bodyTypeId, year, limit = 50, offset = 0 } = filters;
    
    let query = `
      SELECT 
        v.*,
        vb."vehicleBrandName",
        vm."vehicleModelName",
        vbt."vehicleBodyTypeName"
      FROM "Vehicles" v
      INNER JOIN "VehicleBrands" vb ON v."vehicleBrandId" = vb."vehicleBrandId"
      INNER JOIN "VehicleModels" vm ON v."vehicleModelId" = vm."vehicleModelId"
      LEFT JOIN "VehicleBodyTypes" vbt ON v."vehicleBodyTypeId" = vbt."vehicleBodyTypeId"
      WHERE v."vehicleIsActive" = true
    `;

    const values = [];
    let paramCount = 1;

    if (brandId) {
      query += ` AND v."vehicleBrandId" = $${paramCount}`;
      values.push(brandId);
      paramCount++;
    }

    if (modelId) {
      query += ` AND v."vehicleModelId" = $${paramCount}`;
      values.push(modelId);
      paramCount++;
    }

    if (bodyTypeId) {
      query += ` AND v."vehicleBodyTypeId" = $${paramCount}`;
      values.push(bodyTypeId);
      paramCount++;
    }

    if (year) {
      query += ` AND v."vehicleManufactureYear" = $${paramCount}`;
      values.push(year);
      paramCount++;
    }

    query += ` ORDER BY v."vehicleCreatedAt" DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }
}

module.exports = Vehicle;
