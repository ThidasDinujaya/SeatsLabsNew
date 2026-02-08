-- SeatsLabs Database Schema (3NF Normalized)
-- All foreign keys without FK_ prefix for clean schema design

DROP DATABASE IF EXISTS "SeatsLabsDB";
CREATE DATABASE "SeatsLabsDB";

\c "SeatsLabsDB";

-- ============================================
-- LOOKUP & REFERENCE TABLES (3NF)
-- ============================================

-- User Type Lookup
CREATE TABLE "UserTypes" (
    "userTypeId" SERIAL PRIMARY KEY,
    "userTypeName" VARCHAR(50) UNIQUE NOT NULL,
    "userTypeDescription" TEXT,
    "userTypeCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vehicle Brand Lookup
CREATE TABLE "VehicleBrands" (
    "vehicleBrandId" SERIAL PRIMARY KEY,
    "vehicleBrandName" VARCHAR(100) UNIQUE NOT NULL,
    "vehicleBrandCountry" VARCHAR(100),
    "vehicleBrandLogoUrl" VARCHAR(500),
    "vehicleBrandCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vehicle Model Lookup
CREATE TABLE "VehicleModels" (
    "vehicleModelId" SERIAL PRIMARY KEY,
    "vehicleBrandId" INTEGER NOT NULL REFERENCES "VehicleBrands"("vehicleBrandId") ON DELETE CASCADE,
    "vehicleModelName" VARCHAR(100) NOT NULL,
    "vehicleModelYearIntroduced" INTEGER,
    "vehicleModelYearDiscontinued" INTEGER,
    "vehicleModelCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("vehicleBrandId", "vehicleModelName")
);

-- Vehicle Body Type Lookup
CREATE TABLE "VehicleBodyTypes" (
    "vehicleBodyTypeId" SERIAL PRIMARY KEY,
    "vehicleBodyTypeName" VARCHAR(50) UNIQUE NOT NULL,
    "vehicleBodyTypeDescription" TEXT,
    "vehicleBodyTypeCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Service Category Lookup
CREATE TABLE "ServiceCategories" (
    "serviceCategoryId" SERIAL PRIMARY KEY,
    "serviceCategoryName" VARCHAR(100) UNIQUE NOT NULL,
    "serviceCategoryDescription" TEXT,
    "serviceCategoryIcon" VARCHAR(255),
    "serviceCategoryIsActive" BOOLEAN DEFAULT true,
    "serviceCategoryCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Booking Status Lookup
CREATE TABLE "BookingStatuses" (
    "bookingStatusId" SERIAL PRIMARY KEY,
    "bookingStatusName" VARCHAR(50) UNIQUE NOT NULL,
    "bookingStatusDescription" TEXT,
    "bookingStatusColor" VARCHAR(20),
    "bookingStatusCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment Method Lookup
CREATE TABLE "PaymentMethods" (
    "paymentMethodId" SERIAL PRIMARY KEY,
    "paymentMethodName" VARCHAR(50) UNIQUE NOT NULL,
    "paymentMethodType" VARCHAR(50) NOT NULL,
    "paymentMethodIsActive" BOOLEAN DEFAULT true,
    "paymentMethodCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment Status Lookup
CREATE TABLE "PaymentStatuses" (
    "paymentStatusId" SERIAL PRIMARY KEY,
    "paymentStatusName" VARCHAR(50) UNIQUE NOT NULL,
    "paymentStatusDescription" TEXT,
    "paymentStatusCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ad Pricing Plan Lookup
CREATE TABLE "AdPricingPlans" (
    "adPricingPlanId" SERIAL PRIMARY KEY,
    "adPricingPlanName" VARCHAR(100) UNIQUE NOT NULL,
    "adPricingPlanType" VARCHAR(50) NOT NULL,
    "adPricingPlanPricePerDay" DECIMAL(10,2) NOT NULL,
    "adPricingPlanMaxImpressions" INTEGER,
    "adPricingPlanFeatures" JSONB,
    "adPricingPlanIsActive" BOOLEAN DEFAULT true,
    "adPricingPlanCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notification Type Lookup
CREATE TABLE "NotificationTypes" (
    "notificationTypeId" SERIAL PRIMARY KEY,
    "notificationTypeName" VARCHAR(50) UNIQUE NOT NULL,
    "notificationTypeDescription" TEXT,
    "notificationTypeCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Complaint Status Lookup
CREATE TABLE "ComplaintStatuses" (
    "complaintStatusId" SERIAL PRIMARY KEY,
    "complaintStatusName" VARCHAR(50) UNIQUE NOT NULL,
    "complaintStatusDescription" TEXT,
    "complaintStatusCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ad Campaign Status Lookup
CREATE TABLE "AdCampaignStatuses" (
    "adCampaignStatusId" SERIAL PRIMARY KEY,
    "adCampaignStatusName" VARCHAR(50) UNIQUE NOT NULL,
    "adCampaignStatusDescription" TEXT,
    "adCampaignStatusCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- USER MANAGEMENT TABLES
-- ============================================

CREATE TABLE "Users" (
    "userId" SERIAL PRIMARY KEY,
    "userTypeId" INTEGER NOT NULL REFERENCES "UserTypes"("userTypeId"),
    "userFirstName" VARCHAR(100) NOT NULL,
    "userMiddleName" VARCHAR(100),
    "userLastName" VARCHAR(100) NOT NULL,
    "userDob" DATE,
    "userEmail" VARCHAR(255) UNIQUE NOT NULL,
    "userPasswordHash" VARCHAR(255) NOT NULL,
    "userPhoneNumber" VARCHAR(20) UNIQUE NOT NULL,
    "userProfilePictureUrl" VARCHAR(500),
    "userIsActive" BOOLEAN DEFAULT true,
    "userIsEmailVerified" BOOLEAN DEFAULT false,
    "userIsPhoneVerified" BOOLEAN DEFAULT false,
    "userLastLoginAt" TIMESTAMP,
    "userCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "userUpdatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Managers" (
    "managerId" SERIAL PRIMARY KEY,
    "userId" INTEGER UNIQUE NOT NULL REFERENCES "Users"("userId") ON DELETE CASCADE,
    "managerDepartment" VARCHAR(100),
    "managerJoinDate" DATE DEFAULT CURRENT_DATE,
    "managerEmployeeId" VARCHAR(50) UNIQUE,
    "managerCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Technicians" (
    "technicianId" SERIAL PRIMARY KEY,
    "userId" INTEGER UNIQUE NOT NULL REFERENCES "Users"("userId") ON DELETE CASCADE,
    "technicianSpecialization" VARCHAR(100),
    "technicianSkillLevel" VARCHAR(50),
    "technicianIsAvailable" BOOLEAN DEFAULT true,
    "technicianPerformanceRating" DECIMAL(3,2) DEFAULT 0.00,
    "technicianEmployeeId" VARCHAR(50) UNIQUE,
    "technicianCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Customers" (
    "customerId" SERIAL PRIMARY KEY,
    "userId" INTEGER UNIQUE NOT NULL REFERENCES "Users"("userId") ON DELETE CASCADE,
    "customerPreferredContactMethod" VARCHAR(20) DEFAULT 'email',
    "customerLoyaltyPoints" INTEGER DEFAULT 0,
    "customerTotalSpent" DECIMAL(12,2) DEFAULT 0.00,
    "customerCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Advertisers" (
    "advertiserId" SERIAL PRIMARY KEY,
    "userId" INTEGER UNIQUE NOT NULL REFERENCES "Users"("userId") ON DELETE CASCADE,
    "advertiserBusinessName" VARCHAR(255) NOT NULL,
    "advertiserBusinessType" VARCHAR(100),
    "advertiserTaxId" VARCHAR(50) UNIQUE,
    "advertiserContactPerson" VARCHAR(255),
    "advertiserIsApproved" BOOLEAN DEFAULT false,
    "advertiserApprovedAt" TIMESTAMP,
    "advertiserApprovedBy" INTEGER REFERENCES "Managers"("managerId"),
    "advertiserCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- VEHICLE MANAGEMENT TABLES
-- ============================================

CREATE TABLE "Vehicles" (
    "vehicleId" SERIAL PRIMARY KEY,
    "customerId" INTEGER NOT NULL REFERENCES "Customers"("customerId") ON DELETE CASCADE,
    "vehicleBrandId" INTEGER NOT NULL REFERENCES "VehicleBrands"("vehicleBrandId"),
    "vehicleModelId" INTEGER NOT NULL REFERENCES "VehicleModels"("vehicleModelId"),
    "vehicleBodyTypeId" INTEGER REFERENCES "VehicleBodyTypes"("vehicleBodyTypeId"),
    "vehicleRegistrationNumber" VARCHAR(20) UNIQUE NOT NULL,
    "vehicleManufactureYear" INTEGER NOT NULL,
    "vehicleColor" VARCHAR(50),
    "vehicleMileage" INTEGER DEFAULT 0,
    "vehicleVin" VARCHAR(17) UNIQUE,
    "vehicleIsActive" BOOLEAN DEFAULT true,
    "vehicleCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "vehicleUpdatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- SERVICE MANAGEMENT TABLES
-- ============================================

CREATE TABLE "Services" (
    "serviceId" SERIAL PRIMARY KEY,
    "serviceCategoryId" INTEGER NOT NULL REFERENCES "ServiceCategories"("serviceCategoryId"),
    "serviceName" VARCHAR(255) UNIQUE NOT NULL,
    "serviceDescription" TEXT,
    "serviceDurationMinutes" INTEGER NOT NULL,
    "serviceBasePrice" DECIMAL(10,2) NOT NULL,
    "serviceRequirements" TEXT,
    "serviceIsActive" BOOLEAN DEFAULT true,
    "serviceCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "serviceUpdatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- BOOKING MANAGEMENT TABLES
-- ============================================

CREATE TABLE "TimeSlots" (
    "timeSlotId" SERIAL PRIMARY KEY,
    "timeSlotDate" DATE NOT NULL,
    "timeSlotStartTime" TIME NOT NULL,
    "timeSlotEndTime" TIME NOT NULL,
    "timeSlotIsAvailable" BOOLEAN DEFAULT true,
    "timeSlotMaxCapacity" INTEGER DEFAULT 5,
    "timeSlotCurrentBookings" INTEGER DEFAULT 0,
    "timeSlotCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("timeSlotDate", "timeSlotStartTime")
);

CREATE TABLE "Bookings" (
    "bookingId" SERIAL PRIMARY KEY,
    "customerId" INTEGER NOT NULL REFERENCES "Customers"("customerId"),
    "vehicleId" INTEGER NOT NULL REFERENCES "Vehicles"("vehicleId"),
    "serviceId" INTEGER NOT NULL REFERENCES "Services"("serviceId"),
    "timeSlotId" INTEGER NOT NULL REFERENCES "TimeSlots"("timeSlotId"),
    "technicianId" INTEGER REFERENCES "Technicians"("technicianId"),
    "bookingStatusId" INTEGER NOT NULL REFERENCES "BookingStatuses"("bookingStatusId"),
    "bookingReference" VARCHAR(20) UNIQUE NOT NULL,
    "bookingScheduledDateTime" TIMESTAMP NOT NULL,
    "bookingActualStartTime" TIMESTAMP,
    "bookingActualEndTime" TIMESTAMP,
    "bookingSpecialNotes" TEXT,
    "bookingEstimatedPrice" DECIMAL(10,2) NOT NULL,
    "bookingActualPrice" DECIMAL(10,2),
    "bookingCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "bookingUpdatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "BookingStatusHistory" (
    "bookingStatusHistoryId" SERIAL PRIMARY KEY,
    "bookingId" INTEGER NOT NULL REFERENCES "Bookings"("bookingId") ON DELETE CASCADE,
    "bookingStatusId" INTEGER NOT NULL REFERENCES "BookingStatuses"("bookingStatusId"),
    "userId" INTEGER REFERENCES "Users"("userId"),
    "bookingStatusHistoryNotes" TEXT,
    "bookingStatusHistoryCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PAYMENT MANAGEMENT TABLES
-- ============================================

CREATE TABLE "Payments" (
    "paymentId" SERIAL PRIMARY KEY,
    "bookingId" INTEGER UNIQUE NOT NULL REFERENCES "Bookings"("bookingId"),
    "paymentMethodId" INTEGER NOT NULL REFERENCES "PaymentMethods"("paymentMethodId"),
    "paymentStatusId" INTEGER NOT NULL REFERENCES "PaymentStatuses"("paymentStatusId"),
    "paymentAmount" DECIMAL(10,2) NOT NULL,
    "paymentTransactionId" VARCHAR(255) UNIQUE,
    "paymentDateTime" TIMESTAMP,
    "paymentGatewayResponse" JSONB,
    "paymentCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Refunds" (
    "refundId" SERIAL PRIMARY KEY,
    "paymentId" INTEGER NOT NULL REFERENCES "Payments"("paymentId"),
    "refundAmount" DECIMAL(10,2) NOT NULL,
    "refundReason" TEXT NOT NULL,
    "refundStatus" VARCHAR(50) NOT NULL,
    "refundProcessedBy" INTEGER REFERENCES "Managers"("managerId"),
    "refundTransactionId" VARCHAR(255),
    "refundCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "refundProcessedAt" TIMESTAMP
);

-- ============================================
-- ADVERTISEMENT MANAGEMENT TABLES
-- ============================================

CREATE TABLE "AdCampaigns" (
    "adCampaignId" SERIAL PRIMARY KEY,
    "advertiserId" INTEGER NOT NULL REFERENCES "Advertisers"("advertiserId"),
    "adPricingPlanId" INTEGER NOT NULL REFERENCES "AdPricingPlans"("adPricingPlanId"),
    "adCampaignStatusId" INTEGER NOT NULL REFERENCES "AdCampaignStatuses"("adCampaignStatusId"),
    "adCampaignName" VARCHAR(255) NOT NULL,
    "adCampaignType" VARCHAR(50) NOT NULL,
    "adCampaignStartDate" DATE NOT NULL,
    "adCampaignEndDate" DATE NOT NULL,
    "adCampaignBudget" DECIMAL(12,2) NOT NULL,
    "adCampaignTargetAudience" JSONB,
    "adCampaignCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "adCampaignUpdatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Advertisements" (
    "advertisementId" SERIAL PRIMARY KEY,
    "adCampaignId" INTEGER NOT NULL REFERENCES "AdCampaigns"("adCampaignId") ON DELETE CASCADE,
    "advertisementTitle" VARCHAR(255) NOT NULL,
    "advertisementContent" TEXT,
    "advertisementMediaType" VARCHAR(50),
    "advertisementMediaUrl" VARCHAR(500),
    "advertisementClickUrl" VARCHAR(500),
    "advertisementIsApproved" BOOLEAN DEFAULT false,
    "advertisementApprovedBy" INTEGER REFERENCES "Managers"("managerId"),
    "advertisementApprovedAt" TIMESTAMP,
    "advertisementCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "AdAnalytics" (
    "adAnalyticsId" SERIAL PRIMARY KEY,
    "advertisementId" INTEGER NOT NULL REFERENCES "Advertisements"("advertisementId") ON DELETE CASCADE,
    "adAnalyticsDate" DATE NOT NULL,
    "adAnalyticsImpressions" INTEGER DEFAULT 0,
    "adAnalyticsClicks" INTEGER DEFAULT 0,
    "adAnalyticsCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("advertisementId", "adAnalyticsDate")
);

CREATE TABLE "AdPayments" (
    "adPaymentId" SERIAL PRIMARY KEY,
    "adCampaignId" INTEGER NOT NULL REFERENCES "AdCampaigns"("adCampaignId"),
    "adPaymentAmount" DECIMAL(12,2) NOT NULL,
    "adPaymentStatus" VARCHAR(50) NOT NULL,
    "adPaymentTransactionId" VARCHAR(255) UNIQUE,
    "adPaymentDateTime" TIMESTAMP,
    "adPaymentCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- NOTIFICATION MANAGEMENT TABLES
-- ============================================

CREATE TABLE "NotificationTemplates" (
    "notificationTemplateId" SERIAL PRIMARY KEY,
    "notificationTypeId" INTEGER NOT NULL REFERENCES "NotificationTypes"("notificationTypeId"),
    "notificationTemplateName" VARCHAR(100) UNIQUE NOT NULL,
    "notificationTemplateSubject" VARCHAR(255),
    "notificationTemplateMessageBody" TEXT NOT NULL,
    "notificationTemplateVariables" JSONB,
    "notificationTemplateCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "notificationTemplateUpdatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Notifications" (
    "notificationId" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES "Users"("userId") ON DELETE CASCADE,
    "notificationTemplateId" INTEGER REFERENCES "NotificationTemplates"("notificationTemplateId"),
    "notificationTypeId" INTEGER NOT NULL REFERENCES "NotificationTypes"("notificationTypeId"),
    "bookingId" INTEGER REFERENCES "Bookings"("bookingId"),
    "notificationTitle" VARCHAR(255) NOT NULL,
    "notificationMessage" TEXT NOT NULL,
    "notificationIsRead" BOOLEAN DEFAULT false,
    "notificationScheduledTime" TIMESTAMP,
    "notificationSentTime" TIMESTAMP,
    "notificationDeliveryStatus" VARCHAR(50),
    "notificationCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- FEEDBACK & COMPLAINT MANAGEMENT TABLES
-- ============================================

CREATE TABLE "Feedbacks" (
    "feedbackId" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES "Users"("userId"),
    "bookingId" INTEGER REFERENCES "Bookings"("bookingId"),
    "feedbackRating" INTEGER NOT NULL CHECK ("feedbackRating" BETWEEN 1 AND 5),
    "feedbackComment" TEXT,
    "feedbackIsPublic" BOOLEAN DEFAULT false,
    "feedbackCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Complaints" (
    "complaintId" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES "Users"("userId"),
    "bookingId" INTEGER REFERENCES "Bookings"("bookingId"),
    "complaintStatusId" INTEGER NOT NULL REFERENCES "ComplaintStatuses"("complaintStatusId"),
    "complaintTitle" VARCHAR(255) NOT NULL,
    "complaintDescription" TEXT NOT NULL,
    "complaintAdminNotes" TEXT,
    "complaintResolvedBy" INTEGER REFERENCES "Managers"("managerId"),
    "complaintCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "complaintUpdatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "complaintResolvedAt" TIMESTAMP
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_users_email ON "Users"("userEmail");
CREATE INDEX idx_users_phone ON "Users"("userPhoneNumber");
CREATE INDEX idx_users_type ON "Users"("userTypeId");
CREATE INDEX idx_bookings_customer ON "Bookings"("customerId");
CREATE INDEX idx_bookings_status ON "Bookings"("bookingStatusId");
CREATE INDEX idx_bookings_date ON "Bookings"("bookingScheduledDateTime");
CREATE INDEX idx_vehicles_customer ON "Vehicles"("customerId");
CREATE INDEX idx_notifications_user ON "Notifications"("userId");
CREATE INDEX idx_notifications_read ON "Notifications"("notificationIsRead");
CREATE INDEX idx_adcampaigns_advertiser ON "AdCampaigns"("advertiserId");
CREATE INDEX idx_adanalytics_date ON "AdAnalytics"("adAnalyticsDate");
