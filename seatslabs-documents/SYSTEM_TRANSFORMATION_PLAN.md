# SeatsLabs System Transformation Plan

## Complete Synchronization: Diagrams ↔ Database ↔ Backend ↔ Frontend

**Objective**: Create a theoretically perfect, elegant, and practical automotive workshop management system with complete synchronization across all artifacts.

**Targets**:

- ✅ **90+ Use Cases** (Currently: ~30)
- ✅ **30+ Classes** (Currently: ~20)
- ✅ **25+ Entities** (Currently: 26, will refine)
- ✅ **3NF Database Schema** with no FK\_ prefixes
- ✅ **Complete Synchronization** across all layers

---

## Phase 1: Database Schema (3NF Normalization)

### New Lookup Tables Added

1. **PaymentStatuses** - Pending, Completed, Failed, Refunded
2. **NotificationTypes** - Email, SMS, Push, In-App
3. **ComplaintStatuses** - Open, In Progress, Resolved, Closed
4. **AdCampaignStatuses** - Draft, Active, Paused, Completed, Cancelled
5. **BookingStatusHistory** - Track all status changes with timestamps

### Naming Convention Changes

- ❌ **OLD**: `FK_userTypeId`, `FK_customerId`
- ✅ **NEW**: `userTypeId`, `customerId`

All foreign keys now use clean names without prefixes.

### Enhanced Entities (26 Total)

1. Users
2. UserTypes
3. Managers
4. Technicians
5. Customers
6. Advertisers
7. Vehicles
8. VehicleBrands
9. VehicleModels
10. VehicleBodyTypes
11. Services
12. ServiceCategories
13. Bookings
14. BookingStatuses
15. BookingStatusHistory (NEW)
16. TimeSlots
17. Payments
18. PaymentMethods
19. PaymentStatuses (NEW)
20. Refunds (NEW)
21. AdCampaigns
22. AdCampaignStatuses (NEW)
23. Advertisements
24. AdPricingPlans
25. AdAnalytics
26. AdPayments
27. Notifications
28. NotificationTypes (NEW)
29. NotificationTemplates
30. Feedbacks
31. Complaints
32. ComplaintStatuses (NEW)

**Total: 32 Entities** (Exceeds target of 25+)

---

## Phase 2: Use Case Expansion (90+ Use Cases)

### Customer Portal (Inspired by AutoDoc.co.uk)

#### Authentication & Profile (8 Use Cases)

1. Register Account
2. Verify Email
3. Verify Phone Number
4. Log In
5. Log Out
6. Reset Password
7. Update Profile
8. Delete Account

#### Vehicle Management (10 Use Cases)

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

#### Service Booking (15 Use Cases)

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

#### Payment & Invoicing (8 Use Cases)

35. View Payment Options
36. Make Payment
37. Save Payment Method
38. View Payment History
39. Download Invoice
40. Request Refund
41. Track Refund Status
42. View Loyalty Points Balance

#### Feedback & Support (6 Use Cases)

43. Submit Feedback
44. Rate Service
45. Submit Complaint
46. Track Complaint Status
47. View FAQ
48. Contact Support

### Technician Portal (12 Use Cases)

49. View Assigned Bookings
50. Update Booking Status
51. Mark Service as Started
52. Mark Service as Completed
53. Add Service Notes
54. Upload Service Photos
55. Request Parts
56. View Daily Schedule
57. Update Availability Status
58. View Performance Metrics
59. Receive Task Notifications
60. Clock In/Out

### Manager Portal (20 Use Cases)

61. View Dashboard Analytics
62. Manage Users
63. Assign User Roles
64. Approve Advertiser Registration
65. Manage Service Categories
66. Add/Edit/Delete Services
67. Manage Time Slots
68. Assign Technicians to Bookings
69. View All Bookings
70. Approve Refund Requests
71. Generate Revenue Reports
72. Generate Booking Reports
73. Generate Technician Performance Reports
74. View Customer Analytics
75. Manage Advertisements
76. Approve/Reject Advertisements
77. Configure System Settings
78. Manage Notification Templates
79. View Complaint Dashboard
80. Resolve Complaints

### Advertiser Portal (10 Use Cases)

81. Create Ad Campaign
82. Upload Advertisement Content
83. Select Ad Pricing Plan
84. View Campaign Analytics
85. Pause/Resume Campaign
86. Edit Campaign Details
87. Make Ad Payment
88. View Ad Performance Metrics
89. Download Analytics Report
90. Receive Campaign Notifications

### System/External Actors (10 Use Cases)

91. Process Payment (Payment Gateway)
92. Send Email Notification (Email Service)
93. Send SMS Notification (SMS Service)
94. Send Push Notification (Push Service)
95. Generate Invoice PDF (PDF Service)
96. Backup Database (System)
97. Send Scheduled Reminders (Scheduler)
98. Log System Events (Audit System)
99. Monitor System Health (Monitoring)
100.  Sync Analytics Data (Analytics Engine)

**Total: 100 Use Cases** ✅

---

## Phase 3: Class Diagram (30+ Classes)

### Domain Model Classes

#### User Management (6 Classes)

1. **User** - Base user entity
2. **UserType** - User role definition
3. **Manager** - Manager-specific data
4. **Technician** - Technician-specific data
5. **Customer** - Customer-specific data
6. **Advertiser** - Advertiser-specific data

#### Vehicle Management (4 Classes)

7. **Vehicle** - Customer vehicle
8. **VehicleBrand** - Vehicle manufacturer
9. **VehicleModel** - Specific model
10. **VehicleBodyType** - Sedan, SUV, etc.

#### Service Management (3 Classes)

11. **Service** - Service offering
12. **ServiceCategory** - Service grouping
13. **TimeSlot** - Available booking slots

#### Booking Management (3 Classes)

14. **Booking** - Service booking
15. **BookingStatus** - Status lookup
16. **BookingStatusHistory** - Status change tracking

#### Payment Management (4 Classes)

17. **Payment** - Payment transaction
18. **PaymentMethod** - Payment type
19. **PaymentStatus** - Payment state
20. **Refund** - Refund request

#### Advertisement Management (6 Classes)

21. **AdCampaign** - Advertisement campaign
22. **Advertisement** - Individual ad
23. **AdPricingPlan** - Pricing tiers
24. **AdAnalytics** - Performance metrics
25. **AdPayment** - Ad payment transaction
26. **AdCampaignStatus** - Campaign state

#### Notification Management (3 Classes)

27. **Notification** - User notification
28. **NotificationTemplate** - Reusable templates
29. **NotificationType** - Notification channel

#### Feedback Management (3 Classes)

30. **Feedback** - Service feedback
31. **Complaint** - Customer complaint
32. **ComplaintStatus** - Complaint state

#### Service Classes (5 Classes)

33. **AuthService** - Authentication logic
34. **BookingService** - Booking business logic
35. **PaymentService** - Payment processing
36. **NotificationService** - Notification dispatch
37. **ReportService** - Report generation

**Total: 37 Classes** ✅

---

## Phase 4: ER Diagram Enhancements

### Cardinality Notation

- User → Manager: **1:1**
- User → Customer: **1:1**
- User → Technician: **1:1**
- User → Advertiser: **1:1**
- Customer → Vehicle: **1:N**
- Customer → Booking: **1:N**
- Booking → Payment: **1:1**
- Booking → Feedback: **1:1**
- AdCampaign → Advertisement: **1:N**
- Advertisement → AdAnalytics: **1:N**

### Relationship Diamonds

All relationships properly represented with diamond connectors showing:

- Relationship name
- Cardinality on both ends
- Participation constraints (total/partial)

---

## Phase 5: Class Diagram Enhancements

### Multiplicity Notation

```
User "1" ---- "1" Manager
User "1" ---- "0..*" Notification
Customer "1" ---- "0..*" Vehicle
Customer "1" ---- "0..*" Booking
Booking "1" ---- "1" Payment
Booking "1" ---- "0..1" Feedback
Service "1" ---- "0..*" Booking
```

### Relationships

- **Association**: Regular lines with multiplicity
- **Aggregation**: Hollow diamond (e.g., ServiceCategory ◇—— Service)
- **Composition**: Filled diamond (e.g., Booking ◆—— BookingStatusHistory)
- **Inheritance**: Hollow triangle (e.g., User △—— Customer)

---

## Phase 6: Synchronization Matrix

| Entity/Class | Database Table | Backend Model     | Frontend Component     | Use Cases    |
| ------------ | -------------- | ----------------- | ---------------------- | ------------ |
| User         | Users          | UserModel         | UserProfile.jsx        | 1-8, 61-63   |
| Customer     | Customers      | CustomerModel     | CustomerDashboard.jsx  | 9-48         |
| Technician   | Technicians    | TechnicianModel   | TechnicianPortal.jsx   | 49-60        |
| Manager      | Managers       | ManagerModel      | ManagerDashboard.jsx   | 61-80        |
| Advertiser   | Advertisers    | AdvertiserModel   | AdvertiserPortal.jsx   | 81-90        |
| Vehicle      | Vehicles       | VehicleModel      | VehicleList.jsx        | 9-18         |
| Service      | Services       | ServiceModel      | ServiceCatalog.jsx     | 19-34        |
| Booking      | Bookings       | BookingModel      | BookingForm.jsx        | 19-33, 49-52 |
| Payment      | Payments       | PaymentModel      | PaymentGateway.jsx     | 35-42, 91    |
| Notification | Notifications  | NotificationModel | NotificationCenter.jsx | 92-95, 97    |
| AdCampaign   | AdCampaigns    | AdCampaignModel   | CampaignManager.jsx    | 81-90        |
| Feedback     | Feedbacks      | FeedbackModel     | FeedbackForm.jsx       | 43-44        |
| Complaint    | Complaints     | ComplaintModel    | ComplaintForm.jsx      | 45-48, 79-80 |

---

## Phase 7: Implementation Checklist

### Database

- [x] Create 3NF normalized schema
- [ ] Remove all FK\_ prefixes
- [ ] Add missing lookup tables
- [ ] Create indexes for performance
- [ ] Add proper constraints
- [ ] Create migration scripts

### Backend

- [ ] Update all models to match database
- [ ] Remove FK\_ references in code
- [ ] Create service layer classes
- [ ] Implement all business logic
- [ ] Add proper validation
- [ ] Create API endpoints for all use cases

### Frontend

- [ ] Create components for all use cases
- [ ] Implement customer portal (AutoDoc-inspired)
- [ ] Implement technician portal
- [ ] Implement manager portal
- [ ] Implement advertiser portal
- [ ] Add proper routing
- [ ] Implement state management

### Diagrams

- [ ] Update ER diagram with cardinality
- [ ] Update Class diagram with multiplicity
- [ ] Expand Use Case diagram to 100+ use cases
- [ ] Add all actors and associations
- [ ] Ensure all names match code

### Documentation

- [ ] Create API documentation
- [ ] Create user manuals
- [ ] Create deployment guide
- [ ] Create database schema documentation

---

## Naming Conventions (STRICT)

### Database

- Tables: PascalCase (e.g., `Users`, `Bookings`)
- Columns: camelCase with entity prefix (e.g., `userId`, `bookingReference`)
- No FK\_ prefixes
- Timestamps: `createdAt`, `updatedAt`

### Backend (Node.js/Express)

- Models: PascalCase + "Model" (e.g., `UserModel`, `BookingModel`)
- Services: PascalCase + "Service" (e.g., `AuthService`, `BookingService`)
- Controllers: PascalCase + "Controller" (e.g., `UserController`)
- Routes: kebab-case (e.g., `/api/bookings`, `/api/users`)

### Frontend (React)

- Components: PascalCase (e.g., `UserProfile`, `BookingForm`)
- Props: camelCase (e.g., `userId`, `onSubmit`)
- State variables: camelCase (e.g., `isLoading`, `bookingData`)
- CSS classes: kebab-case (e.g., `booking-card`, `user-profile`)

### Diagrams

- Use Cases: Title Case (e.g., "Book Service", "Make Payment")
- Classes: PascalCase (e.g., "User", "Booking")
- Entities: PascalCase (e.g., "User", "Vehicle")
- Attributes: camelCase (e.g., "userId", "bookingDate")

---

## Next Steps

1. **Execute database migration** to new 3NF schema
2. **Update all backend models** to remove FK\_ prefixes
3. **Expand Use Case diagram** with all 100 use cases
4. **Update Class diagram** with multiplicity and relationships
5. **Update ER diagram** with cardinality notation
6. **Synchronize frontend components** with new naming
7. **Remove redundant files** and restructure project
8. **Test all synchronization** points

---

**Status**: Ready for implementation
**Last Updated**: 2026-02-08
**Version**: 1.0
