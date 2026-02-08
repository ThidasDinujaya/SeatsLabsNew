const cron = require("node-cron");
const pool = require("../config/database");
const { sendEmail } = require("../utils/emailService");
const { sendSMS } = require("../utils/smsService");

// Run every hour
cron.schedule("0 * * * *", async () => {
  console.log("Running notification scheduler...");

  try {
    // Get bookings that need 24-hour reminders
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split("T")[0];

    // Get Booking Reminder Type ID
    const typeRes = await pool.query(
      'SELECT "notificationTypeId" FROM "NotificationTypes" WHERE "notificationTypeName" = $1',
      ["Booking Reminder"],
    );
    const notificationTypeId = typeRes.rows[0]?.notificationTypeId;

    if (!notificationTypeId) {
      console.error(
        'Notification Type "Booking Reminder" not found in database.',
      );
      return;
    }

    const bookings = await pool.query(
      `
            SELECT 
                b."bookingId",
                b."bookingReference",
                b."bookingScheduledDateTime",
                s."serviceName",
                u."userEmail",
                u."userPhoneNumber",
                u."userFirstName",
                CONCAT(vb."vehicleBrandName", ' ', vm."vehicleModelName") as vehicle
            FROM "Bookings" b
            JOIN "Customers" c ON b."customerId" = c."customerId"
            JOIN "Users" u ON c."userId" = u."userId"
            JOIN "Services" s ON b."serviceId" = s."serviceId"
            JOIN "Vehicles" v ON b."vehicleId" = v."vehicleId"
            JOIN "VehicleBrands" vb ON v."vehicleBrandId" = vb."vehicleBrandId"
            JOIN "VehicleModels" vm ON v."vehicleModelId" = vm."vehicleModelId"
            JOIN "BookingStatuses" bs ON b."bookingStatusId" = bs."bookingStatusId"
            WHERE DATE(b."bookingScheduledDateTime") = $1
            AND bs."bookingStatusName" = 'Approved'
            AND NOT EXISTS (
                SELECT 1 FROM "Notifications" n
                JOIN "NotificationTypes" nt ON n."notificationTypeId" = nt."notificationTypeId"
                WHERE n."bookingId" = b."bookingId"
                AND nt."notificationTypeName" = 'Booking Reminder'
            )
        `,
      [tomorrowDate],
    );

    for (const booking of bookings.rows) {
      // Send email reminder
      await sendEmail(
        booking.userEmail,
        "Reminder: Your Service Appointment Tomorrow",
        `
                <h2>Booking Reminder</h2>
                <p>Dear ${booking.userFirstName},</p>
                <p>This is a reminder that your service appointment is tomorrow:</p>
                <ul>
                    <li><strong>Reference:</strong> ${booking.bookingReference}</li>
                    <li><strong>Service:</strong> ${booking.serviceName}</li>
                    <li><strong>Time:</strong> ${new Date(booking.bookingScheduledDateTime).toLocaleString()}</li>
                    <li><strong>Vehicle:</strong> ${booking.vehicle}</li>
                </ul>
                <p>Please arrive 10 minutes before your scheduled time.</p>
                `,
      );

      // Send SMS reminder
      await sendSMS(
        booking.userPhoneNumber,
        `Reminder: Your SeatsLabs appointment ${booking.bookingReference} is tomorrow at ${new Date(booking.bookingScheduledDateTime).toLocaleTimeString()}. See you soon!`,
      );

      // Log notification
      // First get user_id from booking -> customer -> user
      const userIdResult = await pool.query(
        'SELECT "userId" FROM "Customers" WHERE "customerId" = (SELECT "customerId" FROM "Bookings" WHERE "bookingId" = $1)',
        [booking.bookingId],
      );
      const userId = userIdResult.rows[0]?.userId;

      if (userId) {
        await pool.query(
          `
                    INSERT INTO "Notifications"
                    ("userId", "bookingId", "notificationTypeId", "notificationTitle", "notificationMessage", "notificationIsRead", "notificationCreatedAt")
                    VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
                `,
          [
            userId,
            booking.bookingId,
            notificationTypeId, // Use the ID fetched earlier
            "Appointment Reminder",
            "Your service appointment is tomorrow",
            false,
          ],
        );
      }
    }

    console.log(`Sent ${bookings.rows.length} 24-hour reminders`);
  } catch (error) {
    console.error("Error in notification scheduler:", error);
  }
});

console.log("Notification scheduler started");

module.exports = {};
