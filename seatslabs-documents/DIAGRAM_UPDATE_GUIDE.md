# Diagram Update Guide - SeatsLabs

## Manual Updates Required in UseCase_Class_ER.drawio

This guide documents all changes needed to synchronize the diagrams with the new 3NF database schema.

---

## 1. Schema Mapping Diagram Updates

### Changes Required:

**Remove ALL `FK_` prefixes from foreign key columns**

#### Current → New Naming:

```
Users Table:
- FK_userTypeId → userTypeId

Managers Table:
- managerUserId → userId

Technicians Table:
- technicianUserId → userId

Customers Table:
- customerUserId → userId

Advertisers Table:
- advertiserUserId → userId

Vehicles Table:
- vehicleCustomerId → customerId
- vehicleVehicleBrandId → vehicleBrandId
- vehicleVehicleModelId → vehicleModelId
- vehicleVehicleBodyTypeId → vehicleBodyTypeId

Services Table:
- serviceServiceCategoryId → serviceCategoryId

Bookings Table:
- bookingCustomerId → customerId
- bookingVehicleId → vehicleId
- bookingServiceId → serviceId
- bookingTimeSlotId → timeSlotId
- bookingTechnicianId → technicianId
- bookingStatusId → bookingStatusId (NEW - add BookingStatuses lookup table)

Payments Table:
- paymentBookingId → bookingId
- paymentMethodId → paymentMethodId (NEW - add PaymentMethods lookup table)
- paymentStatusId → paymentStatusId (NEW - add PaymentStatuses lookup table)

AdCampaigns Table:
- adCampaignAdvertiserId → advertiserId
- adCampaignPricingPlanId → adPricingPlanId
- adCampaignStatusId → adCampaignStatusId (NEW - add AdCampaignStatuses lookup table)

Advertisements Table:
- advertisementAdCampaignId → adCampaignId

Notifications Table:
- notificationUserId → userId
- notificationTypeId → notificationTypeId (NEW - add NotificationTypes lookup table)

Complaints Table:
- complaintUserId → userId
- complaintStatusId → complaintStatusId (NEW - add ComplaintStatuses lookup table)
```

### New Lookup Tables to Add:

1. **PaymentStatuses** (paymentStatusId, paymentStatusName, paymentStatusDescription)
2. **PaymentMethods** (paymentMethodId, paymentMethodName, paymentMethodType)
3. **NotificationTypes** (notificationTypeId, notificationTypeName, notificationTypeDescription)
4. **ComplaintStatuses** (complaintStatusId, complaintStatusName, complaintStatusDescription)
5. **AdCampaignStatuses** (adCampaignStatusId, adCampaignStatusName, adCampaignStatusDescription)
6. **BookingStatusHistory** (bookingStatusHistoryId, bookingId, bookingStatusId, userId, notes, createdAt)
7. **Refunds** (refundId, paymentId, refundAmount, refundReason, refundStatus, refundProcessedBy)

---

## 2. ER Diagram Updates

### Add Cardinality Notations:

```
User ——1:1—— Manager
User ——1:1—— Technician
User ——1:1—— Customer
User ——1:1—— Advertiser
Customer ——1:N—— Vehicle
Customer ——1:N—— Booking
Vehicle ——1:N—— Booking
Service ——1:N—— Booking
TimeSlot ——1:N—— Booking
Technician ——1:N—— Booking
Booking ——1:1—— Payment
Booking ——1:1—— Feedback
Booking ——0:1—— Complaint
Advertiser ——1:N—— AdCampaign
AdCampaign ——1:N—— Advertisement
Advertisement ——1:N—— AdAnalytics
User ——1:N—— Notification
VehicleBrand ——1:N—— VehicleModel
VehicleModel ——1:N—— Vehicle
ServiceCategory ——1:N—— Service
```

### Update Entity Names (if needed):

- Ensure all 32 entities are present
- Check that attribute names match database exactly

---

## 3. Class Diagram Updates

### Add Multiplicity Notations:

```java
// User Management
User "1" ————— "1" UserType
User "1" ————— "0..1" Manager
User "1" ————— "0..1" Technician
User "1" ————— "0..1" Customer
User "1" ————— "0..1" Advertiser

// Vehicle Management
Customer "1" ————— "0..*" Vehicle
VehicleBrand "1" ————— "0..*" VehicleModel
VehicleModel "1" ————— "0..*" Vehicle
VehicleBodyType "1" ————— "0..*" Vehicle

// Service & Booking
ServiceCategory "1" ————— "0..*" Service
Service "1" ————— "0..*" Booking
Customer "1" ————— "0..*" Booking
Vehicle "1" ————— "0..*" Booking
TimeSlot "1" ————— "0..*" Booking
Technician "1" ————— "0..*" Booking
BookingStatus "1" ————— "0..*" Booking

// Payment
Booking "1" ————— "1" Payment
PaymentMethod "1" ————— "0..*" Payment
PaymentStatus "1" ————— "0..*" Payment
Payment "1" ————— "0..*" Refund

// Advertisement
Advertiser "1" ————— "0..*" AdCampaign
AdPricingPlan "1" ————— "0..*" AdCampaign
AdCampaignStatus "1" ————— "0..*" AdCampaign
AdCampaign "1" ————— "0..*" Advertisement
Advertisement "1" ————— "0..*" AdAnalytics

// Notification & Feedback
User "1" ————— "0..*" Notification
NotificationType "1" ————— "0..*" Notification
User "1" ————— "0..*" Feedback
Booking "1" ————— "0..1" Feedback
User "1" ————— "0..*" Complaint
ComplaintStatus "1" ————— "0..*" Complaint
```

### Add Relationship Types:

- **Association**: Regular line (most relationships)
- **Aggregation**: Hollow diamond ◇ (ServiceCategory ◇—— Service)
- **Composition**: Filled diamond ◆ (Booking ◆—— BookingStatusHistory)
- **Inheritance**: Hollow triangle △ (User △—— Customer, Manager, Technician, Advertiser)

---

## 4. Use Case Diagram - Expand to 100 Use Cases

### Customer Portal (48 Use Cases)

#### Authentication & Profile (8)

1. Register Account
2. Verify Email
3. Verify Phone Number
4. Log In
5. Log Out
6. Reset Password
7. Update Profile
8. Delete Account

#### Vehicle Management (10)

9. Add Vehicle
10. View My Vehicles
11. Update Vehicle Details
12. Delete Vehicle
13. Search Vehicle by Registration
14. View Vehicle Service History
15. Upload Vehicle Documents
16. Set Preferred Vehicle
17. Track Vehicle Mileage
18. Receive Maintenance Reminders

#### Service Booking (15)

19. Browse Services
20. Search Services by Category
21. View Service Details
22. Check Service Availability
23. Select Time Slot
24. Book Service
25. Reschedule Booking
26. Cancel Booking
27. View My Bookings
28. Track Booking Status
29. Receive Booking Notifications
30. Download Booking Confirmation
31. Add Special Instructions
32. Request Callback
33. View Estimated Cost
34. Apply Loyalty Points

#### Payment & Invoicing (8)

35. View Payment Options
36. Make Payment
37. Save Payment Method
38. View Payment History
39. Download Invoice
40. Request Refund
41. Track Refund Status
42. View Loyalty Points Balance

#### Feedback & Support (7)

43. Submit Feedback
44. Rate Service
45. Submit Complaint
46. Track Complaint Status
47. View FAQ
48. Contact Support
49. View Service Reviews

### Technician Portal (12 Use Cases)

50. View Assigned Bookings
51. Update Booking Status
52. Mark Service as Started
53. Mark Service as Completed
54. Add Service Notes
55. Upload Service Photos
56. Request Parts
57. View Daily Schedule
58. Update Availability Status
59. View Performance Metrics
60. Receive Task Notifications
61. Clock In/Out

### Manager Portal (20 Use Cases)

62. View Dashboard Analytics
63. Manage Users
64. Assign User Roles
65. Approve Advertiser Registration
66. Manage Service Categories
67. Add/Edit/Delete Services
68. Manage Time Slots
69. Assign Technicians to Bookings
70. View All Bookings
71. Approve Refund Requests
72. Generate Revenue Reports
73. Generate Booking Reports
74. Generate Technician Performance Reports
75. View Customer Analytics
76. Manage Advertisements
77. Approve/Reject Advertisements
78. Configure System Settings
79. Manage Notification Templates
80. View Complaint Dashboard
81. Resolve Complaints

### Advertiser Portal (10 Use Cases)

82. Create Ad Campaign
83. Upload Advertisement Content
84. Select Ad Pricing Plan
85. View Campaign Analytics
86. Pause/Resume Campaign
87. Edit Campaign Details
88. Make Ad Payment
89. View Ad Performance Metrics
90. Download Analytics Report
91. Receive Campaign Notifications

### System/External Actors (9 Use Cases)

92. Process Payment (Payment Gateway)
93. Send Email Notification (Email Service)
94. Send SMS Notification (SMS Service)
95. Send Push Notification (Push Service)
96. Generate Invoice PDF (PDF Service)
97. Backup Database (System)
98. Send Scheduled Reminders (Scheduler)
99. Log System Events (Audit System)
100.  Monitor System Health (Monitoring)

### Actor Associations:

**Customer** connects to: 1-49
**Technician** connects to: 50-61
**Manager** connects to: 62-81
**Advertiser** connects to: 82-91
**Payment Gateway** connects to: 92
**Email Service** connects to: 93
**SMS Service** connects to: 94
**Push Service** connects to: 95
**PDF Service** connects to: 96
**System** connects to: 97-100

---

## 5. Quick Reference: Naming Conventions

### Database (PostgreSQL)

- Tables: `"PascalCase"` with quotes
- Columns: `"camelCase"` with entity prefix
- PKs: Underlined in diagrams
- FKs: Clean names (no FK\_ prefix)

### Backend (Node.js)

- Models: `PascalCase + Model`
- Services: `PascalCase + Service`
- Controllers: `PascalCase + Controller`

### Frontend (React)

- Components: `PascalCase`
- Props: `camelCase`
- State: `camelCase`

### Diagrams

- Use Cases: `Title Case`
- Classes: `PascalCase`
- Entities: `PascalCase`
- Attributes: `camelCase`

---

## Implementation Priority

1. ✅ **Database Schema** - COMPLETED
2. 🔄 **Schema Mapping Diagram** - UPDATE MANUALLY (remove FK\_ prefixes)
3. 🔄 **ER Diagram** - ADD CARDINALITY (1:1, 1:N, M:N)
4. 🔄 **Class Diagram** - ADD MULTIPLICITY (1, _, 0..1, 0.._)
5. 🔄 **Use Case Diagram** - EXPAND TO 100 USE CASES
6. ⏳ **Backend Models** - NEXT STEP
7. ⏳ **Frontend Components** - AFTER BACKEND

---

**Status**: Database updated ✅ | Diagrams pending manual update 🔄
**Last Updated**: 2026-02-08
