import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { NotificationItem } from "./NotificationItem";
import { Bell } from "lucide-react";

interface RecentNotificationsProps {
  notifications: any[];
}

export const RecentNotifications = ({ notifications }: RecentNotificationsProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Recent Notifications</CardTitle>
      <CardDescription>Stay updated with your activity</CardDescription>
    </CardHeader>
    <CardContent>
      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map(notification => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No notifications yet</h3>
          <p className="text-gray-600 mt-1">
            When you have new activity, it will appear here.
          </p>
        </div>
      )}
    </CardContent>
  </Card>
);