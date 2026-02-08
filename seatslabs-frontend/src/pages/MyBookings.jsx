import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/MyBookings.css';

function MyBookings({ currentUser }) {
    const [myBookings, setMyBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [feedback, setFeedback] = useState({
        serviceRating: 5,
        technicianRating: 5,
        comments: ''
    });

    const fetchMyBookings = async () => {
        try {
            setLoading(true);
            const response = await api.bookings.getMyBookings();
            setMyBookings(response.data.data);
        } catch (error) {
            console.error("Failed to fetch bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchMyBookings();
        }
    }, [currentUser]);

    const getStatusClass = (status) => {
        const statusClasses = {
            'Pending': 'status-pending',
            'Approved': 'status-confirmed',
            'In Progress': 'status-progress',
            'Completed': 'status-completed',
            'Cancelled': 'status-cancelled'
        };
        return statusClasses[status] || '';
    };

    const handleCancel = async (bookingId) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                await api.bookings.updateStatus(bookingId, 'Cancelled', 'Cancelled by user');
                fetchMyBookings();
            } catch (error) {
                alert('Failed to cancel: ' + (error.response?.data?.error || error.message));
            }
        }
    };

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.feedback.submit({
                bookingId: selectedBooking.booking_id,
                technicianId: selectedBooking.technician_id,
                ...feedback
            });
            alert('Thank you for your feedback!');
            setShowFeedbackModal(false);
            setFeedback({ serviceRating: 5, technicianRating: 5, comments: '' });
        } catch (error) {
            alert('Error: ' + (error.response?.data?.error || error.message));
        }
    };

    if (loading) return <div className="loading">Loading bookings...</div>;

    return (
        <div className="my-bookings-page">
            <div className="page-header">
                <h1>My Service History</h1>
                <p>Track statuses and provide feedback on your visits</p>
            </div>

            <div className="bookings-list-container">
                {myBookings.length > 0 ? (
                    <div className="bookings-grid">
                        {myBookings.map(booking => (
                            <div key={booking.booking_id} className="booking-card glass-panel">
                                <div className="booking-header">
                                    <span className="booking-ref">{booking.booking_reference}</span>
                                    <span className={`status-badge ${getStatusClass(booking.booking_status)}`}>
                                        {booking.booking_status}
                                    </span>
                                </div>

                                <div className="booking-details">
                                    <div className="detail-row">
                                        <span className="label">Service:</span>
                                        <span className="value">{booking.service_name}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Vehicle:</span>
                                        <span className="value">{booking.registration_number}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Date:</span>
                                        <span className="value">{new Date(booking.scheduled_date_time).toLocaleDateString()}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Technician:</span>
                                        <span className="value">{booking.tech_first_name ? `${booking.tech_first_name} ${booking.tech_last_name}` : 'Pending Assignment'}</span>
                                    </div>
                                </div>

                                <div className="booking-actions">
                                    {booking.booking_status === 'Pending' && (
                                        <button className="btn-cancel" onClick={() => handleCancel(booking.booking_id)}>
                                            Cancel
                                        </button>
                                    )}
                                    {booking.booking_status === 'Completed' && (
                                        <button className="btn-feedback" onClick={() => {
                                            setSelectedBooking(booking);
                                            setShowFeedbackModal(true);
                                        }}>
                                            Rate Service
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-bookings-state">
                        <span className="icon">📅</span>
                        <h3>No Bookings Found</h3>
                        <Link to="/booking" className="btn btn-primary">Book Now</Link>
                    </div>
                )}
            </div>

            {showFeedbackModal && (
                <div className="modal-overlay">
                    <div className="modal-content glass-panel">
                        <h2>Service Feedback</h2>
                        <form onSubmit={handleFeedbackSubmit}>
                            <div className="form-group">
                                <label>Service Quality (1-5)</label>
                                <input type="number" min="1" max="5" value={feedback.serviceRating} onChange={e => setFeedback({ ...feedback, serviceRating: parseInt(e.target.value) })} />
                            </div>
                            <div className="form-group">
                                <label>Technician Service (1-5)</label>
                                <input type="number" min="1" max="5" value={feedback.technicianRating} onChange={e => setFeedback({ ...feedback, technicianRating: parseInt(e.target.value) })} />
                            </div>
                            <div className="form-group">
                                <label>Comments</label>
                                <textarea value={feedback.comments} onChange={e => setFeedback({ ...feedback, comments: e.target.value })} placeholder="How was your experience?" />
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowFeedbackModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Submit Feedback</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyBookings;
