import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor for Authentication
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// AuthService - User Management & Auth
const AuthService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

// UserService - Profile & Admin User Management
const UserService = {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.put('/users/profile', data),
    getAll: () => api.get('/users'),
    getCustomers: () => api.get('/users/customers'),
    getTechnicians: () => api.get('/users/technicians'),
    createTechnician: (data) => api.post('/users/technicians', data),
    updateTechnician: (id, data) => api.put(`/users/technicians/${id}`, data),
    deleteTechnician: (id) => api.delete(`/users/technicians/${id}`),
    getAdvertisers: () => api.get('/users/advertisers'),
    approveAdvertiser: (id) => api.put(`/users/advertisers/${id}/approve`),
    activateUser: (id) => api.put(`/users/users/${id}/activate`),
    deactivateUser: (id) => api.put(`/users/users/${id}/deactivate`),
};

// VehicleService - Vehicle, Brand, Model & Body Type Management
const VehicleService = {
    getMyVehicles: () => api.get('/vehicles/my-vehicles'),
    getAll: () => api.get('/vehicles'),
    getById: (id) => api.get(`/vehicles/${id}`),
    create: (data) => api.post('/vehicles', data),
    update: (id, data) => api.put(`/vehicles/${id}`, data),
    delete: (id) => api.delete(`/vehicles/${id}`),
    getBrands: () => api.get('/vehicles/brands'),
    createBrand: (data) => api.post('/vehicles/brands', data),
    getModelsByBrand: (brandId) => api.get(`/vehicles/brands/${brandId}/models`),
    createModel: (data) => api.post('/vehicles/models', data),
    getBodyTypes: () => api.get('/vehicles/body-types'),
    createBodyType: (data) => api.post('/vehicles/body-types', data),
};

// BookingService - Appointments & Scheduling
const BookingService = {
    getAll: () => api.get('/bookings'),
    getAvailableSlots: (date) => api.get(`/bookings/available-slots?date=${date}`),
    getMyBookings: () => api.get('/bookings/my-bookings'),
    getById: (id) => api.get(`/bookings/${id}`),
    create: (data) => api.post('/bookings', data),
    cancel: (id) => api.put(`/bookings/${id}/cancel`),
    reschedule: (id, data) => api.put(`/bookings/${id}/reschedule`, data),
    approve: (id) => api.put(`/bookings/${id}/approve`),
    reject: (id) => api.put(`/bookings/${id}/reject`),
    assignTechnician: (id, technicianId) => api.put(`/bookings/${id}/assign-technician`, { technicianId }),
    updateStatus: (id, status, notes = '') => api.put(`/bookings/${id}/status`, { status, notes }),
    getTechnicianJobs: () => api.get('/bookings/technician/my-jobs'),
    addNotes: (id, notes) => api.post(`/bookings/${id}/notes`, { notes }),
};

// ServiceService - Catalog & Categories
const ServiceService = {
    getAll: () => api.get('/services'),
    getCategories: () => api.get('/services/categories'),
    getById: (id) => api.get(`/services/${id}`),
    create: (data) => api.post('/services', data),
    update: (id, data) => api.put(`/services/${id}`, data),
    delete: (id) => api.delete(`/services/${id}`),
};

// PaymentService - Transactions & Methods
const PaymentService = {
    processBookingPayment: (bookingId, data) => api.post(`/payments/booking/${bookingId}`, data),
    getMyPayments: () => api.get('/payments/my-payments'),
    processAdPayment: (campaignId, data) => api.post(`/payments/advertisement/${campaignId}`, data),
    getAdvertiserPayments: () => api.get('/payments/advertisement/my-payments'),
    getAll: () => api.get('/payments'),
    getMethods: () => api.get('/payments/methods'),
    verify: (id) => api.put(`/payments/${id}/verify`),
    refund: (id) => api.post(`/payments/${id}/refund`),
};

// NotificationService - Alerts & Templates
const NotificationService = {
    getMyNotifications: () => api.get('/notifications'),
    markAsRead: (id) => api.put(`/notifications/${id}/mark-read`),
    markAllAsRead: () => api.put('/notifications/mark-all-read'),
    delete: (id) => api.delete(`/notifications/${id}`),
    send: (data) => api.post('/notifications/send', data),
    broadcast: (data) => api.post('/notifications/broadcast', data),
    getTemplates: () => api.get('/notifications/templates'),
    createTemplate: (data) => api.post('/notifications/templates', data),
};

// AdService - Marketing & Campaigns
const AdService = {
    getActiveAds: () => api.get('/advertisements/active'),
    getPricingPlans: () => api.get('/advertisements/pricing-plans'),
    getMyAds: () => api.get('/advertisements/my-ads'), // Using backend route for my ads
    createCampaign: (data) => api.post('/advertisements/campaigns', data),
    getMyCampaigns: () => api.get('/advertisements/campaigns'),
    createAd: (campaignId, data) => api.post(`/advertisements/campaigns/${campaignId}/ads`, data),
    getCampaignAnalytics: (campaignId) => api.get(`/advertisements/campaigns/${campaignId}/analytics`),
    pauseCampaign: (id) => api.put(`/advertisements/campaigns/${id}/pause`),
    resumeCampaign: (id) => api.put(`/advertisements/campaigns/${id}/resume`),
    getAllCampaigns: () => api.get('/advertisements/campaigns'),
    getAllAds: () => api.get('/advertisements/all-ads'),
    approveAd: (id) => api.put(`/advertisements/ads/${id}/approve`),
    rejectAd: (id) => api.put(`/advertisements/ads/${id}/reject`),
    trackImpression: (adId) => api.post(`/advertisements/ads/${adId}/impression`),
    trackClick: (adId) => api.post(`/advertisements/ads/${adId}/click`),
};

// FeedbackService - Reviews & Complaints
const FeedbackService = {
    getAll: () => api.get('/feedback'),
    getMyFeedback: () => api.get('/feedback/my-feedback'),
    submit: (data) => api.post('/feedback', data),
    getTemplates: () => api.get('/feedback/templates'), // If implemented
    submitComplaint: (data) => api.post('/feedback/complaints', data),
    getAllComplaints: () => api.get('/feedback/complaints'),
    resolveComplaint: (id, resolution) => api.put(`/feedback/complaints/${id}/resolve`, { resolution }),
};

// ReportService - Analytics & PDF Report Generation
const ReportService = {
    getDashboardStats: () => api.get('/analytics/dashboard'),
    getDailyBookingReport: (date) => api.get(`/reports/daily-booking?date=${date}`),
    getMonthlyRevenueReport: (month, year) => api.get(`/reports/monthly-revenue?month=${month}&year=${year}`),
    getTechnicianPerformanceReport: (start, end) => api.get(`/reports/technician-performance?startDate=${start}&endDate=${end}`),
    getCustomerSatisfactionReport: (month, year) => api.get(`/reports/customer-satisfaction?month=${month}&year=${year}`),
    getAdPerformanceReport: (start, end) => api.get(`/reports/advertisement-performance?startDate=${start}&endDate=${end}`),
};

const SeatsLabsAPI = {
    auth: AuthService,
    users: UserService,
    vehicles: VehicleService,
    bookings: BookingService,
    services: ServiceService,
    payments: PaymentService,
    notifications: NotificationService,
    ads: AdService,
    feedback: FeedbackService,
    reports: ReportService
};

export default SeatsLabsAPI;
