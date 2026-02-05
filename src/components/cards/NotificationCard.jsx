import { readNotification } from "@/services/notificationsServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaRegBell } from "react-icons/fa";

const NotificationCard = ({ notification }) => {
  const queryClient = useQueryClient();

  const { mutate: markAsRead } = useMutation({
    mutationFn: readNotification,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  const handleRead = (notification) => {
    if (!notification.read_at) {
      markAsRead(notification.id);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div
      key={notification.id}
      onClick={() => handleRead(notification)}
      className={`flex gap-2 py-2 px-4 card cursor-pointer transition
              ${
                notification.read_at
                  ? "bg-muted/30 opacity-70"
                  : "bg-primary/10 border border-primary/30"
              }
            `}
    >
      <div
        className={`flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full text-2xl
                ${
                  notification.read_at
                    ? "bg-white text-muted-foreground"
                    : "bg-primary text-white"
                }
              `}
      >
        <FaRegBell />
      </div>

      <div className="flex flex-col gap-1 flex-1">
        <p className="font-bold text-xs lg:text-sm">{notification.title}</p>
        <p className="text-xs text-muted-foreground">{notification.message}</p>
        <p className="text-xs text-muted-foreground">
          {formatDate(notification.notification_date)}
        </p>
      </div>
    </div>
  );
};

export default NotificationCard;
