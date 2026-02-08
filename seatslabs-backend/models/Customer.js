const pool = require('../config/database');

class Customer {
  /**
   * Find customer by ID
   * @param {number} customerId 
   * @returns {Promise<Object|null>}
   */
  static async findById(customerId) {
    const query = `
      SELECT 
        c.*,
        u."userFirstName",
        u."userLastName",
        u."userEmail",
        u."userPhoneNumber"
      FROM "Customers" c
      INNER JOIN "Users" u ON c."userId" = u."userId"
      WHERE c."customerId" = $1
    `;
    const result = await pool.query(query, [customerId]);
    return result.rows[0] || null;
  }

  /**
   * Find customer by user ID
   * @param {number} userId 
   * @returns {Promise<Object|null>}
   */
  static async findByUserId(userId) {
    const query = `
      SELECT 
        c.*,
        u."userFirstName",
        u."userLastName",
        u."userEmail",
        u."userPhoneNumber"
      FROM "Customers" c
      INNER JOIN "Users" u ON c."userId" = u."userId"
      WHERE c."userId" = $1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0] || null;
  }

  /**
   * Create new customer
   * @param {Object} customerData 
   * @returns {Promise<Object>}
   */
  static async create(customerData) {
    const {
      userId,
      customerPreferredContactMethod = 'email',
      customerLoyaltyPoints = 0,
      customerTotalSpent = 0.00
    } = customerData;

    const query = `
      INSERT INTO "Customers" (
        "userId", "customerPreferredContactMethod", 
        "customerLoyaltyPoints", "customerTotalSpent"
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [userId, customerPreferredContactMethod, customerLoyaltyPoints, customerTotalSpent];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Update customer
   * @param {number} customerId 
   * @param {Object} updates 
   * @returns {Promise<Object>}
   */
  static async update(customerId, updates) {
    const allowedFields = ['customerPreferredContactMethod', 'customerLoyaltyPoints', 'customerTotalSpent'];
    
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

    values.push(customerId);

    const query = `
      UPDATE "Customers"
      SET ${fields.join(', ')}
      WHERE "customerId" = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Add loyalty points
   * @param {number} customerId 
   * @param {number} points 
   * @returns {Promise<Object>}
   */
  static async addLoyaltyPoints(customerId, points) {
    const query = `
      UPDATE "Customers"
      SET "customerLoyaltyPoints" = "customerLoyaltyPoints" + $1
      WHERE "customerId" = $2
      RETURNING *
    `;
    const result = await pool.query(query, [points, customerId]);
    return result.rows[0];
  }

  /**
   * Update total spent
   * @param {number} customerId 
   * @param {number} amount 
   * @returns {Promise<Object>}
   */
  static async updateTotalSpent(customerId, amount) {
    const query = `
      UPDATE "Customers"
      SET "customerTotalSpent" = "customerTotalSpent" + $1
      WHERE "customerId" = $2
      RETURNING *
    `;
    const result = await pool.query(query, [amount, customerId]);
    return result.rows[0];
  }

  /**
   * Get customer statistics
   * @param {number} customerId 
   * @returns {Promise<Object>}
   */
  static async getStatistics(customerId) {
    const query = `
      SELECT 
        c.*,
        COUNT(DISTINCT v."vehicleId") as "totalVehicles",
        COUNT(DISTINCT b."bookingId") as "totalBookings",
        COALESCE(SUM(p."paymentAmount"), 0) as "totalSpent"
      FROM "Customers" c
      LEFT JOIN "Vehicles" v ON c."customerId" = v."customerId"
      LEFT JOIN "Bookings" b ON c."customerId" = b."customerId"
      LEFT JOIN "Payments" p ON b."bookingId" = p."bookingId"
      WHERE c."customerId" = $1
      GROUP BY c."customerId"
    `;
    const result = await pool.query(query, [customerId]);
    return result.rows[0] || null;
  }

  /**
   * Get all customers with pagination
   * @param {Object} options 
   * @returns {Promise<Array>}
   */
  static async findAll(options = {}) {
    const { limit = 50, offset = 0 } = options;
    
    const query = `
      SELECT 
        c.*,
        u."userFirstName",
        u."userLastName",
        u."userEmail",
        u."userPhoneNumber",
        u."userIsActive"
      FROM "Customers" c
      INNER JOIN "Users" u ON c."userId" = u."userId"
      ORDER BY c."customerCreatedAt" DESC
      LIMIT $1 OFFSET $2
    `;
    
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }
}

module.exports = Customer;
