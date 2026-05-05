"use client";

import { useEffect, useState, Suspense } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddVehicleForm } from "@/components/profile/AddVehicleForm";
import { BookingList } from "@/components/profile/BookingList";
import { Car, Calendar, User, Shield } from "lucide-react";

function ProfileContent() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.push("/login?redirect=/profile");
    }
  }, [isAuthenticated, router]);

  if (!mounted || !isAuthenticated) return null;

  const defaultTab = searchParams.get("tab") || "info";

  return (
    <div className="container py-10 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your identity, trips, and vehicles.
          </p>
        </div>
      </div>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
          <TabsTrigger value="info" className="flex items-center gap-2">
            <User className="w-4 h-4" /> Info
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Bookings
          </TabsTrigger>
          {user?.verificationStatus === "VERIFIED" && (
            <TabsTrigger value="vehicles" className="flex items-center gap-2">
              <Car className="w-4 h-4" /> Host
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <div className="bg-card border rounded-lg p-6 max-w-2xl">
            <h3 className="text-xl font-bold mb-4">Personal Information</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              <div>
                <p className="text-sm text-muted-foreground">First Name</p>
                <p className="font-medium">{user?.firstName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Name</p>
                <p className="font-medium">{user?.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Verification Status
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {user?.verificationStatus === "VERIFIED" ? (
                    <span className="inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded font-bold">
                      <Shield className="w-3 h-3 mr-1" /> VERIFIED
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded font-bold">
                      {user?.verificationStatus || "UNVERIFIED"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {user?.verificationStatus !== "VERIFIED" && (
              <div className="mt-8 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <h4 className="font-semibold flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" /> Get Verified
                </h4>
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  You must verify your identity before you can host a vehicle or
                  book premium rides.
                </p>
                {/* Upload Verification UI would go here, deferred for brevity */}
                <button className="text-sm font-medium text-primary hover:underline">
                  Submit Verification Documents &rarr;
                </button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="bookings">
          <BookingList />
        </TabsContent>

        <TabsContent value="vehicles">
          {user?.verificationStatus === "VERIFIED" ? (
            <AddVehicleForm />
          ) : (
            <div className="text-center py-10 bg-muted rounded-lg border">
              <p>You must be verified to list vehicles.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="container py-10">Loading...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
