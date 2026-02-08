const pool = require('../config/database');

class Booking {
  /**
   * Find booking by ID with full details
   * @param {number} bookingId 
   * @returns {Promise<Object|null>}
   */
  static async findById(bookingId) {
    const query = `
      SELECT 
        b.*,
        c."customerId",
        u."userFirstName" || ' ' || u."userLastName" as "customerName",
        u."userEmail" as "customerEmail",
        u."userPhoneNumber" as "customerPhone",
        v."vehicleRegistrationNumber",
        v."vehicleManufactureYear",
        vb."vehicleBrandName",
        vm."vehicleModelName",
        s."serviceName",
        s."serviceDescription",
        s."serviceBasePrice",
        s."serviceDurationMinutes",
        sc."serviceCategoryName",
        bs."bookingStatusName",
        bs."bookingStatusColor",
        ts."timeSlotDate",
        ts."timeSlotStartTime",
        ts."timeSlotEndTime",
        t."technicianId",
        tu."userFirstName" || ' ' || tu."userLastName" as "technicianName"
      FROM "Bookings" b
      INNER JOIN "Customers" c ON b."customerId" = c."customerId"
      INNER JOIN "Users" u ON c."userId" = u."userId"
      INNER JOIN "Vehicles" v ON b."vehicleId" = v."vehicleId"
      INNER JOIN "VehicleBrands" vb ON v."vehicleBrandId" = vb."vehicleBrandId"
      INNER JOIN "VehicleModels" vm ON v."vehicleModelId" = vm."vehicleModelId"
      INNER JOIN "Services" s ON b."serviceId" = s."serviceId"
      INNER JOIN "ServiceCategories" sc ON s."serviceCategoryId" = sc."serviceCategoryId"
      INNER JOIN "BookingStatuses" bs ON b."bookingStatusId" = bs."bookingStatusId"
      INNER JOIN "TimeSlots" ts ON b."timeSlotId" = ts."timeSlotId"
      LEFT JOIN "Technicians" t ON b."technicianId" = t."technicianId"
      LEFT JOIN "Users" tu ON t."userId" = tu."userId"
      WHERE b."bookingId" = $1
    `;
    const result = await pool.query(query, [bookingId]);
    return result.rows[0] || null;
  }

  /**
   * Create new booking
   * @param {Object} bookingData 
   * @returns {Promise<Object>}
   */
  static async create(bookingData) {
    const {
      customerId,
      vehicleId,
      serviceId,
      timeSlotId,
      technicianId,
      bookingStatusId,
      bookingReference,
      bookingScheduledDateTime,
      bookingSpecialNotes,
      bookingEstimatedPrice
    } = bookingData;

    const query = `
      INSERT INTO "Bookings" (
        "customerId", "vehicleId", "serviceId", "timeSlotId", 
        "technicianId", "bookingStatusId", "bookingReference",
        "bookingScheduledDateTime", "bookingSpecialNotes", "bookingEstimatedPrice"
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      customerId,
      vehicleId,
      serviceId,
      timeSlotId,
      technicianId || null,
      bookingStatusId,
      bookingReference,
      bookingScheduledDateTime,
      bookingSpecialNotes || null,
      bookingEstimatedPrice
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Update booking status
   * @param {number} bookingId 
   * @param {number} bookingStatusId 
   * @param {number} userId - User making the change
   * @param {string} notes 
   * @returns {Promise<Object>}
   */
  static async updateStatus(bookingId, bookingStatusId, userId, notes = null) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Update booking status
      const updateQuery = `
        UPDATE "Bookings"
        SET "bookingStatusId" = $1, "bookingUpdatedAt" = CURRENT_TIMESTAMP
        WHERE "bookingId" = $2
        RETURNING *
      `;
      const updateResult = await client.query(updateQuery, [bookingStatusId, bookingId]);

      // Record status history
      const historyQuery = `
        INSERT INTO "BookingStatusHistory" (
          "bookingId", "bookingStatusId", "userId", "bookingStatusHistoryNotes"
        )
        VALUES ($1, $2, $3, $4)
      `;
      await client.query(historyQuery, [bookingId, bookingStatusId, userId, notes]);

      await client.query('COMMIT');
      return updateResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Assign technician to booking
   * @param {number} bookingId 
   * @param {number} technicianId 
   * @returns {Promise<Object>}
   */
  static async assignTechnician(bookingId, technicianId) {
    const query = `
      UPDATE "Bookings"
      SET "technicianId" = $1, "bookingUpdatedAt" = CURRENT_TIMESTAMP
      WHERE "bookingId" = $2
      RETURNING *
    `;
    const result = await pool.query(query, [technicianId, bookingId]);
    return result.rows[0];
  }

  /**
   * Get bookings by customer
   * @param {number} customerId 
   * @param {Object} options 
   * @returns {Promise<Array>}
   */
  static async findByCustomer(customerId, options = {}) {
    const { limit = 50, offset = 0, statusId = null } = options;
    
    let query = `
      SELECT 
        b.*,
        s."serviceName",
        bs."bookingStatusName",
        bs."bookingStatusColor",
        v."vehicleRegistrationNumber",
        vb."vehicleBrandName",
        vm."vehicleModelName"
      FROM "Bookings" b
      INNER JOIN "Services" s ON b."serviceId" = s."serviceId"
      INNER JOIN "BookingStatuses" bs ON b."bookingStatusId" = bs."bookingStatusId"
      INNER JOIN "Vehicles" v ON b."vehicleId" = v."vehicleId"
      INNER JOIN "VehicleBrands" vb ON v."vehicleBrandId" = vb."vehicleBrandId"
      INNER JOIN "VehicleModels" vm ON v."vehicleModelId" = vm."vehicleModelId"
      WHERE b."customerId" = $1
    `;
    
    const values = [customerId];
    let paramCount = 2;

    if (statusId) {
      query += ` AND b."bookingStatusId" = $${paramCount}`;
      values.push(statusId);
      paramCount++;
    }

    query += ` ORDER BY b."bookingScheduledDateTime" DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get bookings by technician
   * @param {number} technicianId 
   * @param {Object} options 
   * @returns {Promise<Array>}
   */
  static async findByTechnician(technicianId, options = {}) {
    const { limit = 50, offset = 0, date = null } = options;
    
    let query = `
      SELECT 
        b.*,
        s."serviceName",
        s."serviceDurationMinutes",
        bs."bookingStatusName",
        c."customerId",
        u."userFirstName" || ' ' || u."userLastName" as "customerName",
        u."userPhoneNumber" as "customerPhone",
        v."vehicleRegistrationNumber",
        vb."vehicleBrandName",
        vm."vehicleModelName"
      FROM "Bookings" b
      INNER JOIN "Services" s ON b."serviceId" = s."serviceId"
      INNER JOIN "BookingStatuses" bs ON b."bookingStatusId" = bs."bookingStatusId"
      INNER JOIN "Customers" c ON b."customerId" = c."customerId"
      INNER JOIN "Users" u ON c."userId" = u."userId"
      INNER JOIN "Vehicles" v ON b."vehicleId" = v."vehicleId"
      INNER JOIN "VehicleBrands" vb ON v."vehicleBrandId" = vb."vehicleBrandId"
      INNER JOIN "VehicleModels" vm ON v."vehicleModelId" = vm."vehicleModelId"
      WHERE b."technicianId" = $1
    `;
    
    const values = [technicianId];
    let paramCount = 2;

    if (date) {
      query += ` AND DATE(b."bookingScheduledDateTime") = $${paramCount}`;
      values.push(date);
      paramCount++;
    }

    query += ` ORDER BY b."bookingScheduledDateTime" ASC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Generate unique booking reference
   * @returns {Promise<string>}
   */
  static async generateReference() {
    const prefix = 'BK';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  }

  /**
   * Get booking statistics
   * @param {Object} filters 
   * @returns {Promise<Object>}
   */
  static async getStatistics(filters = {}) {
    const { startDate, endDate, customerId, technicianId } = filters;
    
    let query = `
      SELECT 
        COUNT(*) as "totalBookings",
        COUNT(CASE WHEN bs."bookingStatusName" = 'Completed' THEN 1 END) as "completedBookings",
        COUNT(CASE WHEN bs."bookingStatusName" = 'Cancelled' THEN 1 END) as "cancelledBookings",
        COUNT(CASE WHEN bs."bookingStatusName" = 'Pending' THEN 1 END) as "pendingBookings",
        COALESCE(SUM(b."bookingActualPrice"), 0) as "totalRevenue"
      FROM "Bookings" b
      INNER JOIN "BookingStatuses" bs ON b."bookingStatusId" = bs."bookingStatusId"
      WHERE 1=1
    `;
    
    const values = [];
    let paramCount = 1;

    if (startDate) {
      query += ` AND b."bookingScheduledDateTime" >= $${paramCount}`;
      values.push(startDate);
      paramCount++;
    }

    if (endDate) {
      query += ` AND b."bookingScheduledDateTime" <= $${paramCount}`;
      values.push(endDate);
      paramCount++;
    }

    if (customerId) {
      query += ` AND b."customerId" = $${paramCount}`;
      values.push(customerId);
      paramCount++;
    }

    if (technicianId) {
      query += ` AND b."technicianId" = $${paramCount}`;
      values.push(technicianId);
    }

    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

module.exports = Booking;
