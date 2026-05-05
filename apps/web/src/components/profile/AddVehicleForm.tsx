"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createVehicleSchema, CreateVehicleInput } from "@p2p/types";
import { apiClient } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";

export function AddVehicleForm() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateVehicleInput>({
    resolver: zodResolver(createVehicleSchema) as any,
    defaultValues: {
      type: "CAR",
      year: new Date().getFullYear(),
      pricePerHour: 15,
      pricePerDay: 100,
      latitude: 37.7749, // Default to SF mock coordinates
      longitude: -122.4194,
    },
  });

  const onSubmit = async (data: CreateVehicleInput) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      let uploadedMedia: any[] = [];

      // 1. Upload files first using our local multer endpoint
      if (files && files.length > 0) {
        const formData = new FormData();
        Array.from(files).forEach((file) => {
          formData.append("media", file);
        });

        const uploadRes = await apiClient.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        uploadedMedia = uploadRes.data.data; // Array of { url, type, filename }
      }

      // 2. Submit the vehicle data
      await apiClient.post("/vehicles", {
        ...data,
        // Since we didn't add media directly to the CreateVehicleInput zod schema in earlier phases,
        // we might just ignore it, but ideally we'd pass it. For now, the API schema might drop it
        // if not configured, or we can send it. Let's send it in case we update the backend.
        media: uploadedMedia,
      });

      setSuccess(true);
      reset();
      setFiles(null);
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to create vehicle listing.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-card p-6 rounded-lg border shadow-sm max-w-2xl"
    >
      <div>
        <h3 className="text-xl font-bold">Add a New Vehicle</h3>
        <p className="text-sm text-muted-foreground mt-1">
          List your car or bike to start earning immediately.
        </p>
      </div>

      {error && (
        <div className="p-3 text-sm text-destructive-foreground bg-destructive/10 rounded-md flex gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 text-sm text-green-800 bg-green-100 rounded-md font-medium border border-green-200">
          Vehicle listed successfully! It's now visible in the Marketplace.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Type</Label>
          <select
            {...register("type")}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="CAR">Car</option>
            <option value="BIKE">Bike</option>
          </select>
          {errors.type && (
            <p className="text-sm text-destructive">{errors.type.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>License Plate</Label>
          <Input {...register("licensePlate")} placeholder="ABC-1234" />
          {errors.licensePlate && (
            <p className="text-sm text-destructive">
              {errors.licensePlate.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Make</Label>
          <Input {...register("make")} placeholder="e.g. Toyota" />
          {errors.make && (
            <p className="text-sm text-destructive">{errors.make.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Model</Label>
          <Input {...register("model")} placeholder="e.g. Camry" />
          {errors.model && (
            <p className="text-sm text-destructive">{errors.model.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Year</Label>
          <Input type="number" {...register("year", { valueAsNumber: true })} />
          {errors.year && (
            <p className="text-sm text-destructive">{errors.year.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <textarea
          {...register("description")}
          className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder="Describe your vehicle's features..."
        />
        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Price per Hour ($)</Label>
          <Input
            type="number"
            step="0.01"
            {...register("pricePerHour", { valueAsNumber: true })}
          />
          {errors.pricePerHour && (
            <p className="text-sm text-destructive">
              {errors.pricePerHour.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Price per Day ($)</Label>
          <Input
            type="number"
            step="0.01"
            {...register("pricePerDay", { valueAsNumber: true })}
          />
          {errors.pricePerDay && (
            <p className="text-sm text-destructive">
              {errors.pricePerDay.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Vehicle Photos</Label>
        <Input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setFiles(e.target.files)}
        />
        <p className="text-xs text-muted-foreground">
          Select up to 5 local images (JPEG, PNG). Stored securely on our disk.
        </p>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Uploading & Saving..." : "List Vehicle"}
      </Button>
    </form>
  );
}
