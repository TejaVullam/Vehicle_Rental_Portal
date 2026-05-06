"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

interface DamageReportDialogProps {
  bookingId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    description: string;
    severity: string;
    estimatedCost: number;
    mediaFiles?: File[];
  }) => Promise<void>;
}

export const DamageReportDialog: React.FC<DamageReportDialogProps> = ({
  bookingId: _bookingId,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [description, setDescription] = useState<string>("");
  const [severity, setSeverity] = useState<string>("MINOR");
  const [estimatedCost, setEstimatedCost] = useState<string>("");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMediaFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError("Please describe the damage");
      return;
    }

    if (!estimatedCost || Number(estimatedCost) <= 0) {
      setError("Please provide a valid estimated cost");
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit({
        description,
        severity,
        estimatedCost: Number(estimatedCost),
        mediaFiles: mediaFiles.length > 0 ? mediaFiles : undefined,
      });

      // Reset form
      setDescription("");
      setSeverity("MINOR");
      setEstimatedCost("");
      setMediaFiles([]);
      setError("");
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit damage report",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Report Damage</h2>

        <div className="space-y-4">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Damage Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the damage in detail..."
              className="w-full px-3 py-2 border rounded-md text-sm min-h-20"
              disabled={isLoading}
            />
          </div>

          {/* Severity */}
          <div>
            <label className="block text-sm font-medium mb-2">Severity</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm"
              disabled={isLoading}
            >
              <option value="MINOR">Minor</option>
              <option value="MODERATE">Moderate</option>
              <option value="MAJOR">Major</option>
            </select>
          </div>

          {/* Estimated Cost */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Estimated Cost (₹) *
            </label>
            <input
              type="number"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 border rounded-md text-sm"
              disabled={isLoading}
              min="0"
              step="0.01"
            />
          </div>

          {/* Media Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Upload Photos (Optional)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isLoading}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full text-left"
              disabled={isLoading}
            >
              {mediaFiles.length > 0
                ? `${mediaFiles.length} file(s) selected`
                : "Choose photos..."}
            </Button>
            {mediaFiles.length > 0 && (
              <div className="mt-2 text-xs text-gray-600">
                {mediaFiles.map((f) => (
                  <div key={f.name}>{f.name}</div>
                ))}
              </div>
            )}
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-yellow-500 hover:bg-yellow-600 text-black flex-1"
            >
              {isLoading ? "Submitting..." : "Submit Report"}
            </Button>
            <Button
              onClick={onClose}
              disabled={isLoading}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
