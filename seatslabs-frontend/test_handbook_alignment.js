
const db = require('./src/data/db.json');

// Mock API functions for specific handbook use cases
const API = {
    // Usecase: createUser()
    createUser: (name, email, phone) => {
        console.log(`\nTesting createUser()...`);
        const newUser = {
            user_id: 999,
            name,
            email,
            phone,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        console.log("Expected Properties (Handbook): user_id, name, email, phone");
        console.log("Actual Object:", JSON.stringify(newUser, null, 2));
        return newUser;
    },

    // Usecase: createBooking()
    createBooking: (customerId, vehicleId, serviceTypeId, timeSlotId) => {
        console.log(`\nTesting createBooking()...`);
        const newBooking = {
            booking_id: 888,
            customer_id: customerId,
            vehicle_id: vehicleId,
            status_id: 1, // 'Pending'
            time_slot_id: timeSlotId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        console.log("Expected Properties (Handbook): booking_id, customer_id, vehicle_id, status_id, time_slot_id");
        console.log("Actual Object:", JSON.stringify(newBooking, null, 2));
        return newBooking;
    }
};

// Execute
console.log("=== HANDBOOK PROPERTY ALIGNMENT CHECK ===");

// 1. Register User
API.createUser("Alice Wonderland", "alice@example.com", "555-9876");

// 2. Create Booking
API.createBooking(999, 101, 2, 4);

console.log("\n=== CHECK COMPLETE ===");
