"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface CancellationDialogProps {
  bookingId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
}

export const CancellationDialog: React.FC<CancellationDialogProps> = ({
  bookingId: _bookingId,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [reason, setReason] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError("Please provide a reason for cancellation");
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(reason);
      setReason("");
      setError("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel booking");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Cancel Booking</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Reason for Cancellation
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please explain why you want to cancel this booking..."
              className="w-full px-3 py-2 border rounded-md text-sm min-h-24"
              disabled={isLoading}
            />
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> Canceling this booking may result in a
              partial or full refund depending on the cancellation policy.
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !reason.trim()}
              className="bg-red-500 hover:bg-red-600 text-white flex-1"
            >
              {isLoading ? "Cancelling..." : "Confirm Cancellation"}
            </Button>
            <Button
              onClick={onClose}
              disabled={isLoading}
              variant="outline"
              className="flex-1"
            >
              Keep Booking
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
