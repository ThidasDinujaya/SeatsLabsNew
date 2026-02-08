const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function resetPassword() {
  const email = 'manager@seatslabs.com';
  const newPassword = 'Password@123';
  
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    const res = await pool.query(
      'UPDATE "Users" SET "userPasswordHash" = $1 WHERE "userEmail" = $2 RETURNING *',
      [hashedPassword, email]
    );

    if (res.rowCount > 0) {
      console.log(`Password for ${email} successfully reset to: ${newPassword}`);
    } else {
      console.log(`User ${email} not found.`);
    }
  } catch (err) {
    console.error('Error resetting password:', err);
  } finally {
    await pool.end();
  }
}

resetPassword();
