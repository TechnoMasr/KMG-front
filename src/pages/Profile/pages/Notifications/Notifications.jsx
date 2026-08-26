import NotificationCard from "@/components/cards/NotificationCard";
import EmptyDataSection from "@/components/commonSections/EmptyDataSection";
import NotificationsSkeleton from "@/components/Loading/SkeletonLoading/NotificationsSkeleton";
import { Button } from "@/components/ui/button";

import {
  getNotifications,
  readAllNotifications,
} from "@/api/notificationsServices";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

const Notifications = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  const { mutate: markAllAsRead, isPending } = useMutation({
    mutationFn: readAllNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("notifications.title")}</h2>
          <p className="text-muted-foreground text-sm">
            {t("notifications.subtitle")}
          </p>
        </div>

        {notifications?.items?.length > 0 && (
          <Button onClick={() => markAllAsRead()} disabled={isPending}>
            {isPending
              ? t("notifications.loading")
              : t("notifications.markAllRead")}
          </Button>
        )}
      </div>

      {isLoading ? (
        <NotificationsSkeleton />
      ) : notifications?.items?.length === 0 ? (
        <EmptyDataSection msg={t("notifications.empty")} />
      ) : (
        <div className="flex flex-col gap-4">
          {notifications?.items?.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
