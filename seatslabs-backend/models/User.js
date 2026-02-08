const pool = require('../config/database');

class User {
  /**
   * Find user by ID
   * @param {number} userId 
   * @returns {Promise<Object|null>}
   */
  static async findById(userId) {
    const query = `
      SELECT 
        u.*,
        ut."userTypeName"
      FROM "Users" u
      LEFT JOIN "UserTypes" ut ON u."userTypeId" = ut."userTypeId"
      WHERE u."userId" = $1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0] || null;
  }

  /**
   * Find user by email
   * @param {string} email 
   * @returns {Promise<Object|null>}
   */
  static async findByEmail(email) {
    const query = `
      SELECT 
        u.*,
        ut."userTypeName"
      FROM "Users" u
      LEFT JOIN "UserTypes" ut ON u."userTypeId" = ut."userTypeId"
      WHERE u."userEmail" = $1
    `;
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  /**
   * Create new user
   * @param {Object} userData 
   * @returns {Promise<Object>}
   */
  static async create(userData) {
    const {
      userTypeId,
      userFirstName,
      userMiddleName,
      userLastName,
      userDob,
      userEmail,
      userPasswordHash,
      userPhoneNumber,
      userProfilePictureUrl
    } = userData;

    const query = `
      INSERT INTO "Users" (
        "userTypeId", "userFirstName", "userMiddleName", "userLastName",
        "userDob", "userEmail", "userPasswordHash", "userPhoneNumber",
        "userProfilePictureUrl"
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      userTypeId,
      userFirstName,
      userMiddleName || null,
      userLastName,
      userDob || null,
      userEmail,
      userPasswordHash,
      userPhoneNumber,
      userProfilePictureUrl || null
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Update user
   * @param {number} userId 
   * @param {Object} updates 
   * @returns {Promise<Object>}
   */
  static async update(userId, updates) {
    const allowedFields = [
      'userFirstName', 'userMiddleName', 'userLastName', 'userDob',
      'userEmail', 'userPhoneNumber', 'userProfilePictureUrl', 'userIsActive'
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

    fields.push(`"userUpdatedAt" = CURRENT_TIMESTAMP`);
    values.push(userId);

    const query = `
      UPDATE "Users"
      SET ${fields.join(', ')}
      WHERE "userId" = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Delete user (soft delete)
   * @param {number} userId 
   * @returns {Promise<boolean>}
   */
  static async delete(userId) {
    const query = `
      UPDATE "Users"
      SET "userIsActive" = false, "userUpdatedAt" = CURRENT_TIMESTAMP
      WHERE "userId" = $1
      RETURNING "userId"
    `;
    const result = await pool.query(query, [userId]);
    return result.rowCount > 0;
  }

  /**
   * Get all users with optional filters
   * @param {Object} filters 
   * @returns {Promise<Array>}
   */
  static async findAll(filters = {}) {
    let query = `
      SELECT 
        u.*,
        ut."userTypeName"
      FROM "Users" u
      LEFT JOIN "UserTypes" ut ON u."userTypeId" = ut."userTypeId"
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.userTypeId) {
      query += ` AND u."userTypeId" = $${paramCount}`;
      values.push(filters.userTypeId);
      paramCount++;
    }

    if (filters.userIsActive !== undefined) {
      query += ` AND u."userIsActive" = $${paramCount}`;
      values.push(filters.userIsActive);
      paramCount++;
    }

    query += ` ORDER BY u."userCreatedAt" DESC`;

    if (filters.limit) {
      query += ` LIMIT $${paramCount}`;
      values.push(filters.limit);
      paramCount++;
    }

    if (filters.offset) {
      query += ` OFFSET $${paramCount}`;
      values.push(filters.offset);
    }

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Update last login timestamp
   * @param {number} userId 
   * @returns {Promise<boolean>}
   */
  static async updateLastLogin(userId) {
    const query = `
      UPDATE "Users"
      SET "userLastLoginAt" = CURRENT_TIMESTAMP
      WHERE "userId" = $1
    `;
    const result = await pool.query(query, [userId]);
    return result.rowCount > 0;
  }

  /**
   * Verify email
   * @param {number} userId 
   * @returns {Promise<boolean>}
   */
  static async verifyEmail(userId) {
    const query = `
      UPDATE "Users"
      SET "userIsEmailVerified" = true, "userUpdatedAt" = CURRENT_TIMESTAMP
      WHERE "userId" = $1
    `;
    const result = await pool.query(query, [userId]);
    return result.rowCount > 0;
  }

  /**
   * Verify phone
   * @param {number} userId 
   * @returns {Promise<boolean>}
   */
  static async verifyPhone(userId) {
    const query = `
      UPDATE "Users"
      SET "userIsPhoneVerified" = true, "userUpdatedAt" = CURRENT_TIMESTAMP
      WHERE "userId" = $1
    `;
    const result = await pool.query(query, [userId]);
    return result.rowCount > 0;
  }
}

module.exports = User;
