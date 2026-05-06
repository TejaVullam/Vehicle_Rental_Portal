"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface BookingSearchFilterProps {
  onSearch: (filters: {
    status?: string;
    startDate?: string;
    endDate?: string;
    vehicleType?: string;
  }) => void;
}

export const BookingSearchFilter: React.FC<BookingSearchFilterProps> = ({
  onSearch,
}) => {
  const [status, setStatus] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [vehicleType, setVehicleType] = useState<string>("");

  const handleSearch = () => {
    onSearch({
      status: status || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      vehicleType: vehicleType || undefined,
    });
  };

  const handleReset = () => {
    setStatus("");
    setStartDate("");
    setEndDate("");
    setVehicleType("");
    onSearch({});
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Vehicle Type Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Vehicle Type</label>
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm"
          >
            <option value="">All Types</option>
            <option value="BIKE">Bike</option>
            <option value="CAR">Car</option>
            <option value="SCOOTER">Scooter</option>
          </select>
        </div>

        {/* Start Date Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Start Date From
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
        </div>

        {/* End Date Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">End Date To</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4">
        <Button
          onClick={handleSearch}
          className="bg-yellow-500 hover:bg-yellow-600 text-black"
        >
          Search
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          className="text-gray-700"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};
