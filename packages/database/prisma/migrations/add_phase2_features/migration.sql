-- CreateEnum
CREATE TYPE "DisputeStatus" AS ENUM ('OPEN', 'RESOLVED', 'REFUNDED', 'REJECTED');

-- CreateEnum
CREATE TYPE "CancellationReason" AS ENUM ('OWNER_REQUEST', 'RENTER_REQUEST', 'BOOKING_EXPIRED', 'PAYMENT_FAILED');

-- CreateEnum
CREATE TYPE "CheckpointType" AS ENUM ('PICKUP_REQUESTED', 'PICKUP_CONFIRMED', 'PICKUP_COMPLETED', 'RETURN_REQUESTED', 'RETURN_COMPLETED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('BOOKING_CONFIRMED', 'BOOKING_CANCELLED', 'PICKUP_REMINDER', 'RETURN_DUE', 'DAMAGE_REPORTED', 'DISPUTE_OPENED', 'DISPUTE_RESOLVED', 'PAYMENT_RELEASED', 'REVIEW_REQUEST', 'MESSAGE');

-- AlterTable - Update Dispute table
ALTER TABLE "Dispute" ADD COLUMN "description" TEXT,
ADD COLUMN "resolution" TEXT,
ALTER COLUMN "status" SET DATA TYPE "DisputeStatus" USING 'OPEN'::"DisputeStatus",
ALTER COLUMN "status" SET DEFAULT 'OPEN';

-- CreateTable CancellationPolicy
CREATE TABLE "CancellationPolicy" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "bookingId" UUID NOT NULL,
    "reason" "CancellationReason" NOT NULL,
    "refundAmount" DOUBLE PRECISION NOT NULL,
    "refundPercentage" DOUBLE PRECISION NOT NULL,
    "cancellationTime" TIMESTAMP(3) NOT NULL,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CancellationPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable BookingCheckpoint
CREATE TABLE "BookingCheckpoint" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "bookingId" UUID NOT NULL,
    "type" "CheckpointType" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingCheckpoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable DamageReport
CREATE TABLE "DamageReport" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "bookingId" UUID NOT NULL,
    "vehicleId" UUID NOT NULL,
    "reportedBy" UUID NOT NULL,
    "disputeId" UUID,
    "description" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "estimatedCost" DOUBLE PRECISION,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DamageReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable DamageMedia
CREATE TABLE "DamageMedia" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "damageReportId" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DamageMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable Notification
CREATE TABLE "Notification" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "relatedId" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CancellationPolicy_bookingId_key" ON "CancellationPolicy"("bookingId");

-- CreateIndex
CREATE INDEX "BookingCheckpoint_bookingId_idx" ON "BookingCheckpoint"("bookingId");

-- CreateIndex
CREATE INDEX "Notification_userId_read_idx" ON "Notification"("userId", "read");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- AddForeignKey
ALTER TABLE "CancellationPolicy" ADD CONSTRAINT "CancellationPolicy_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingCheckpoint" ADD CONSTRAINT "BookingCheckpoint_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DamageReport" ADD CONSTRAINT "DamageReport_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DamageReport" ADD CONSTRAINT "DamageReport_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DamageReport" ADD CONSTRAINT "DamageReport_reportedBy_fkey" FOREIGN KEY ("reportedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DamageReport" ADD CONSTRAINT "DamageReport_disputeId_fkey" FOREIGN KEY ("disputeId") REFERENCES "Dispute"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DamageMedia" ADD CONSTRAINT "DamageMedia_damageReportId_fkey" FOREIGN KEY ("damageReportId") REFERENCES "DamageReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
