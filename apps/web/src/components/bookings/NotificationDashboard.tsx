"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  relatedId?: string;
}

interface NotificationDashboardProps {
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => Promise<void>;
  onDismiss: (notificationId: string) => void;
}

export const NotificationDashboard: React.FC<NotificationDashboardProps> = ({
  notifications,
  onMarkAsRead,
  onDismiss,
}) => {
  const [filter, setFilter] = useState<"all" | "unread">("unread");
  const [isLoading, setIsLoading] = useState(false);

  const filteredNotifications =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const handleMarkAsRead = async (notificationId: string) => {
    setIsLoading(true);
    try {
      await onMarkAsRead(notificationId);
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "BOOKING_CONFIRMED":
        return "✅";
      case "BOOKING_CANCELLED":
        return "❌";
      case "PICKUP_REMINDER":
        return "📍";
      case "RETURN_DUE":
        return "🔄";
      case "DAMAGE_REPORTED":
        return "⚠️";
      case "DISPUTE_OPENED":
        return "⚡";
      case "DISPUTE_RESOLVED":
        return "✓";
      case "PAYMENT_RELEASED":
        return "💳";
      case "REVIEW_REQUEST":
        return "⭐";
      case "MESSAGE":
        return "💬";
      default:
        return "🔔";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Notifications</h2>
        <div className="space-x-2">
          <Button
            onClick={() => setFilter("unread")}
            className={`text-sm ${
              filter === "unread"
                ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            Unread ({notifications.filter((n) => !n.read).length})
          </Button>
          <Button
            onClick={() => setFilter("all")}
            className={`text-sm ${
              filter === "all"
                ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            All
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
            {filter === "unread"
              ? "You're all caught up! No unread notifications."
              : "No notifications yet."}
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border rounded-lg transition-colors ${
                notification.read
                  ? "bg-white border-gray-200"
                  : "bg-yellow-50 border-yellow-200"
              }`}
            >
              <div className="flex gap-3">
                {/* Icon */}
                <div className="text-2xl flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3
                        className={`font-semibold text-sm ${
                          notification.read ? "text-gray-900" : "text-gray-900"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="ml-2 flex-shrink-0">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      {formatDate(notification.createdAt)}
                    </span>
                    <div className="space-x-2">
                      {!notification.read && (
                        <Button
                          onClick={() => handleMarkAsRead(notification.id)}
                          disabled={isLoading}
                          variant="outline"
                          className="text-xs h-7 px-2"
                        >
                          Mark as Read
                        </Button>
                      )}
                      <Button
                        onClick={() => onDismiss(notification.id)}
                        variant="outline"
                        className="text-xs h-7 px-2 text-gray-600"
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
