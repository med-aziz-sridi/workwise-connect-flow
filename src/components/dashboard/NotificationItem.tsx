import { Bell } from "lucide-react";

interface NotificationItemProps {
  notification: {
    id: string;
    message: string;
    read: boolean;
    createdAt: string;
  };
}

export const NotificationItem = ({ notification }: NotificationItemProps) => (
  <div className={`p-3 rounded-lg border ${notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'}`}>
    <div className="flex items-start gap-3">
      <Bell className={`h-5 w-5 ${notification.read ? 'text-gray-400' : 'text-blue-500'}`} />
      <div>
        <p className="text-sm text-gray-800">{notification.message}</p>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(notification.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  </div>
);