const pool = require('../config/database');

const feedbackController = {
    submitFeedback: async (req, res) => {
        try {
            const { bookingId, serviceRating, feedbackComments } = req.body;
            const result = await pool.query(
                'INSERT INTO "Feedbacks" ("bookingId", "userId", "feedbackRating", "feedbackComment") VALUES ($1, $2, $3, $4) RETURNING *',
                [bookingId, req.user.userId, serviceRating, feedbackComments]
            );
            res.status(201).json({ success: true, data: result.rows[0] });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    getCustomerFeedback: async (req, res) => {
        try {
            const result = await pool.query('SELECT * FROM "Feedbacks" WHERE "userId" = $1', [req.user.userId]);
            res.json({ success: true, data: result.rows });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getAllFeedback: async (req, res) => {
        try {
            const result = await pool.query('SELECT * FROM "Feedbacks"');
            res.json({ success: true, data: result.rows });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getFeedbackByService: async (req, res) => {
        try {
            const { serviceId } = req.params;
            const result = await pool.query('SELECT f.* FROM "Feedbacks" f JOIN "Bookings" b ON f."bookingId" = b."bookingId" WHERE b."serviceId" = $1', [serviceId]);
            res.json({ success: true, data: result.rows });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getFeedbackByTechnician: async (req, res) => {
        try {
            const { technicianId } = req.params;
            const result = await pool.query('SELECT f.* FROM "Feedbacks" f JOIN "Bookings" b ON f."bookingId" = b."bookingId" WHERE b."technicianId" = $1', [technicianId]);
            res.json({ success: true, data: result.rows });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    submitComplaint: async (req, res) => {
        try {
            const { bookingId, complaintTitle, feedbackDescription } = req.body;
            const result = await pool.query(
                `INSERT INTO "Complaints" ("bookingId", "userId", "complaintStatusId", "complaintTitle", "complaintDescription") 
                 VALUES ($1, $2, (SELECT "complaintStatusId" FROM "ComplaintStatuses" WHERE "complaintStatusName" = 'New'), $3, $4) RETURNING *`,
                [bookingId, req.user.userId, complaintTitle, feedbackDescription]
            );
            res.status(201).json({ success: true, data: result.rows[0] });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    getAllComplaints: async (req, res) => {
        try {
            const result = await pool.query('SELECT * FROM "Complaints"');
            res.json({ success: true, data: result.rows });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    resolveComplaint: async (req, res) => {
        try {
            const { complaintId } = req.params;
            const { complaintAdminNotes } = req.body;
            await pool.query(
                "UPDATE \"Complaints\" SET \"complaintAdminNotes\" = $1, \"complaintStatusId\" = (SELECT \"complaintStatusId\" FROM \"ComplaintStatuses\" WHERE \"complaintStatusName\" = 'Resolved'), \"complaintResolvedBy\" = $2 WHERE \"complaintId\" = $3",
                [complaintAdminNotes, req.user.managerId, complaintId]
            );
            res.json({ success: true, message: 'Complaint resolved' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

module.exports = feedbackController;
