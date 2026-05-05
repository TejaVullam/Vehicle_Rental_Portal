"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Car, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 md:pt-32 pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
                Your Next Adventure <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
                  Starts Here.
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-[700px] text-lg md:text-xl text-muted-foreground"
            >
              Rent unique cars and bikes from local hosts. Experience the
              freedom of the open road with RideConnect's premium P2P
              marketplace.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Button
                size="lg"
                className="w-full sm:w-auto h-12 px-8 text-base"
                asChild
              >
                <Link href="/vehicles">Find a Ride</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-12 px-8 text-base"
                asChild
              >
                <Link href="/register">Become a Host</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div
              whileHover={{ y: -5 }}
              className="flex flex-col items-center text-center space-y-4 p-6 bg-background rounded-2xl shadow-sm border"
            >
              <div className="p-4 bg-primary/10 rounded-full">
                <Car className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Endless Options</h3>
              <p className="text-muted-foreground">
                From luxury convertibles to mountain bikes, find the perfect
                ride for any occasion.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="flex flex-col items-center text-center space-y-4 p-6 bg-background rounded-2xl shadow-sm border"
            >
              <div className="p-4 bg-primary/10 rounded-full">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Fully Insured</h3>
              <p className="text-muted-foreground">
                Every trip is covered by our comprehensive insurance policy for
                total peace of mind.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="flex flex-col items-center text-center space-y-4 p-6 bg-background rounded-2xl shadow-sm border"
            >
              <div className="p-4 bg-primary/10 rounded-full">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Instant Booking</h3>
              <p className="text-muted-foreground">
                Skip the rental counter. Book instantly and hit the road in
                minutes.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
