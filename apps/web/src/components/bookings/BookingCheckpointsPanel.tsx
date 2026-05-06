"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface Checkpoint {
  id: string;
  type: "PICKUP" | "RETURN";
  notes?: string;
  timestamp: string;
}

interface BookingCheckpointsPanelProps {
  bookingId: string;
  checkpoints: Checkpoint[];
  isOwner: boolean;
  onAddCheckpoint: (type: "PICKUP" | "RETURN", notes: string) => Promise<void>;
}

export const BookingCheckpointsPanel: React.FC<
  BookingCheckpointsPanelProps
> = ({ bookingId: _bookingId, checkpoints, isOwner, onAddCheckpoint }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [checkpointType, setCheckpointType] = useState<"PICKUP" | "RETURN">(
    "PICKUP",
  );
  const [notes, setNotes] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleAddCheckpoint = async () => {
    setIsLoading(true);
    try {
      await onAddCheckpoint(checkpointType, notes);
      setNotes("");
      setCheckpointType("PICKUP");
      setIsAdding(false);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add checkpoint");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Booking Checkpoints</h3>
        {isOwner && !isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-black text-sm"
          >
            Add Checkpoint
          </Button>
        )}
      </div>

      {/* Add Checkpoint Form */}
      {isAdding && isOwner && (
        <div className="mb-4 p-3 border rounded-lg bg-gray-50 space-y-3">
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <select
              value={checkpointType}
              onChange={(e) =>
                setCheckpointType(e.target.value as "PICKUP" | "RETURN")
              }
              className="w-full px-3 py-2 border rounded-md text-sm"
              disabled={isLoading}
            >
              <option value="PICKUP">Pickup</option>
              <option value="RETURN">Return</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this checkpoint..."
              className="w-full px-3 py-2 border rounded-md text-sm min-h-16"
              disabled={isLoading}
            />
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <div className="flex gap-2">
            <Button
              onClick={handleAddCheckpoint}
              disabled={isLoading}
              className="bg-yellow-500 hover:bg-yellow-600 text-black flex-1"
            >
              {isLoading ? "Adding..." : "Add"}
            </Button>
            <Button
              onClick={() => {
                setIsAdding(false);
                setNotes("");
                setError("");
              }}
              disabled={isLoading}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Timeline of Checkpoints */}
      <div className="space-y-3">
        {checkpoints.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No checkpoints yet
          </div>
        ) : (
          <div className="relative">
            {checkpoints.map((checkpoint, index) => (
              <div key={checkpoint.id} className="flex gap-4 pb-4">
                {/* Timeline marker */}
                <div className="relative flex flex-col items-center">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      checkpoint.type === "PICKUP"
                        ? "bg-blue-500 border-blue-500"
                        : "bg-green-500 border-green-500"
                    }`}
                  />
                  {index !== checkpoints.length - 1 && (
                    <div className="w-0.5 h-12 bg-gray-300 mt-1" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="font-semibold text-sm">
                    {checkpoint.type === "PICKUP" ? "📍 Pickup" : "🔄 Return"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(checkpoint.timestamp)}
                  </div>
                  {checkpoint.notes && (
                    <div className="text-sm text-gray-700 mt-1">
                      {checkpoint.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
