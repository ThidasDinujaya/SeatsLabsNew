require('dotenv').config();
const pool = require('./config/database');

async function checkUsers() {
    try {
        const result = await pool.query(`
            SELECT u."userId", u."userEmail", u."userFirstName", u."userLastName", ut."userTypeName", u."userIsActive"
            FROM "Users" u 
            JOIN "UserTypes" ut ON u."userTypeId" = ut."userTypeId" 
            ORDER BY u."userId"
        `);
        
        console.log('\n=== Users in Database ===\n');
        result.rows.forEach(user => {
            console.log(`${user.userId}. ${user.userEmail}`);
            console.log(`   Name: ${user.userFirstName} ${user.userLastName}`);
            console.log(`   Role: ${user.userTypeName}`);
            console.log(`   Active: ${user.userIsActive}`);
            console.log('');
        });
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

checkUsers();
