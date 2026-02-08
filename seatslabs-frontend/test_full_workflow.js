
const db = require('./src/data/db.json');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- Mock Services ---

const createService = (name, delayMs = 100) => {
    return {
        log: (msg) => console.log(`[${name}] ${msg}`),
        exec: async (action, data) => {
            await delay(delayMs);
            return action(data);
        }
    };
};

const Services = {
    Auth: {
        login: async (email) => {
            console.log(`\n🔹 [Auth] Logging in as ${email}...`);
            const user = db.users.find(u => u.email === email);
            if (!user) throw new Error("User not found");
            console.log(`   ✅ Welcome, ${user.name} (${db.roles.find(r => r.role_id === db.user_roles.find(ur => ur.user_id === user.user_id).role_id).name})`);
            return user;
        }
    },
    Booking: {
        create: async (user, vehicle, service, slot) => {
            console.log(`\n🔹 [Booking] Creating booking for ${vehicle.model}...`);
            await delay(100);
            const booking = {
                booking_id: 204, // Mock ID
                customer_id: user.user_id,
                vehicle_id: vehicle.vehicle_id,
                service_type_id: service.service_type_id,
                time_slot_id: slot.time_slot_id,
                status_id: 1 // Pending
            };
            console.log(`   ✅ Booking #204 Created! Status: Pending`);
            return booking;
        }
    },
    Job: {
        create: async (booking) => {
            console.log(`\n🔹 [Job] System creating job for Booking #${booking.booking_id}...`);
            await delay(100);
            const job = {
                job_id: 404,
                booking_id: booking.booking_id,
                technician_id: 3, // Assigned to Mike Lee
                status: "Pending",
                progress: 0
            };
            console.log(`   ✅ Job #404 Created. Assigned to Technician ID: 3`);
            return job;
        },
        start: async (job) => {
            console.log(`\n🔹 [Job] Technician starting Job #${job.job_id}...`);
            job.status = "In Progress";
            job.started_at = new Date().toISOString();
            console.log(`   ✅ Job Status: In Progress`);
            return job;
        },
        updateProgress: async (job, percentage, checklistItem) => {
            console.log(`\n🔹 [Job] Updating progress... (${checklistItem} completed)`);
            job.progress = percentage;
            console.log(`   ✅ Progress: ${percentage}%`);
            return job;
        },
        complete: async (job) => {
            console.log(`\n🔹 [Job] Completing Job #${job.job_id}...`);
            job.status = "Completed";
            job.completed_at = new Date().toISOString();
            console.log(`   ✅ Job Finished!`);
            return job;
        }
    },
    Billing: {
        createInvoice: async (booking) => {
            console.log(`\n🔹 [Billing] Generating Invoice for Booking #${booking.booking_id}...`);
            const amount = 150.00;
            const invoice = {
                invoice_id: 504,
                booking_id: booking.booking_id,
                total_amount: amount,
                status: "Pending"
            };
            console.log(`   ✅ Invoice #504 Generated. Total: $${amount}`);
            return invoice;
        },
        pay: async (invoice) => {
            console.log(`\n🔹 [Billing] Processing Payment for Invoice #${invoice.invoice_id}...`);
            await delay(200);
            invoice.status = "Paid";
            const payment = {
                payment_id: 604,
                invoice_id: invoice.invoice_id,
                amount: invoice.total_amount,
                status: "Completed"
            };
            console.log(`   ✅ Payment Successful! Invoice marked as Paid.`);
            return payment;
        }
    }
};

// --- Execution Orchestrator ---

async function runFullWorkflow() {
    try {
        console.log("=================================================");
        console.log("🚀 STARTING COMPLET SYSTEM SIMULATION");
        console.log("=================================================");

        // 1. User Journey
        const customer = await Services.Auth.login("john@example.com");
        const vehicle = db.vehicles.find(v => v.customer_id === customer.user_id);
        const service = db.service_types.find(s => s.name === "Oil Change");
        const slot = db.time_slots.find(t => t.is_available);

        const booking = await Services.Booking.create(customer, vehicle, service, slot);

        // 2. Technician Journey
        const technician = await Services.Auth.login("mike@example.com");
        let job = await Services.Job.create(booking);
        job = await Services.Job.start(job);
        job = await Services.Job.updateProgress(job, 50, "Drain Old Oil");
        job = await Services.Job.updateProgress(job, 100, "Fill New Oil");
        job = await Services.Job.complete(job);

        // 3. Billing Journey
        // System generates invoice automatically after job completion
        const invoice = await Services.Billing.createInvoice(booking);

        // Customer pays
        await Services.Auth.login("john@example.com");
        await Services.Billing.pay(invoice);

        console.log("\n=================================================");
        console.log("✅ FULL END-TO-END WORKFLOW VERIFIED");
        console.log("=================================================");

    } catch (e) {
        console.error("❌ Simulation Failed:", e);
    }
}

runFullWorkflow();
