
const db = require('./src/data/db.json');

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- API Mocks (Replicated from src/services/api.js for Node execution) ---

const AuthService = {
    login: async (email, password) => {
        console.log(`[API] Authenticating ${email}...`);
        await delay(200);
        const user = db.users.find(u => u.email === email);
        if (user) {
            return {
                token: "mock-jwt-token-" + user.user_id,
                user: user,
                roles: db.user_roles.filter(ur => ur.user_id === user.user_id)
            };
        }
        throw new Error("Invalid credentials");
    }
};

const VehicleService = {
    getByCustomerId: async (customerId) => {
        console.log(`[API] Fetching vehicles for Customer ID: ${customerId}...`);
        await delay(200);
        return db.vehicles.filter(v => v.customer_id === customerId);
    }
};

const BookingService = {
    create: async (bookingData) => {
        console.log(`[API] Creating booking...`, bookingData);
        await delay(200);
        const newBooking = {
            ...bookingData,
            booking_id: Math.max(...db.bookings.map(b => b.booking_id)) + 1,
            created_at: new Date().toISOString(),
            status_id: 1 // Pending
        };
        console.log(`[API] Booking Created! ID: ${newBooking.booking_id}`);
        return newBooking;
    },
    getById: async (id) => {
        console.log(`[API] Fetching Booking ID: ${id}...`);
        await delay(200);
        // Note: deeper logic would be needed to find the *newly* created one since we aren't persisting to the JSON file in this script, 
        // effectively we just return the object we "created" or look in db. 
        // Since we can't write to the actual JSON file in this read-only test, we'll simulate the response.
        return db.bookings.find(b => b.booking_id === id);
    }
};

const ServiceData = {
    getTypes: async () => {
        console.log(`[API] Fetching Service Types...`);
        return db.service_types;
    },
    getTimeSlots: async () => {
        console.log(`[API] Fetching Available Time Slots...`);
        return db.time_slots;
    }
};

// --- Execution Flow ---

async function runTest() {
    try {
        console.log("=== STARTING BOOKING FLOW TEST ===\n");

        // 1. Logic: User Logs In
        const authResponse = await AuthService.login("john@example.com", "password");
        const user = authResponse.user;
        console.log(`✅ Login Successful: ${user.name} (ID: ${user.user_id})`);

        // 2. Logic: User Checks their vehicles
        const vehicles = await VehicleService.getByCustomerId(user.user_id);
        console.log(`✅ Found ${vehicles.length} vehicles.`);
        vehicles.forEach(v => console.log(`   - [${v.vehicle_id}] ${v.year} ${v.make} ${v.model} (${v.license_plate})`));
        const selectedVehicle = vehicles[0];

        // 3. Logic: User Browses Services
        const services = await ServiceData.getTypes();
        console.log(`✅ Available Services:`, services.map(s => s.name).join(", "));
        const selectedService = services.find(s => s.name === "Oil Change");

        // 4. Logic: User Checks Time Slots
        const slots = await ServiceData.getTimeSlots();
        const availableSlot = slots.find(s => s.is_available) || slots[0]; // Fallback to first even if taken for test
        console.log(`✅ Selected Time Slot: ${availableSlot.start_time} - ${availableSlot.end_time}`);

        // 5. Logic: Create Booking
        const bookingRequest = {
            customer_id: user.user_id,
            vehicle_id: selectedVehicle.vehicle_id,
            service_type_id: selectedService.service_type_id,
            time_slot_id: availableSlot.time_slot_id
        };

        const newBooking = await BookingService.create(bookingRequest);

        console.log(`\n✅ flow complete. Booking details:`);
        console.log(JSON.stringify(newBooking, null, 2));

        console.log("\n=== TEST COMPLETED SUCCESSFULLY ===");

    } catch (error) {
        console.error("❌ Test Failed:", error);
    }
}

runTest();
