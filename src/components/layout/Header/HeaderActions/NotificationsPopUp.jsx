import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaBell } from "react-icons/fa";
import NotificationsSkeleton from "@/components/Loading/SkeletonLoading/NotificationsSkeleton";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/services/notificationsServices";
import { getUnreadCount } from "@/services/mainServices";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import NotificationsBadge from "@/components/common/NotificationsBadge";
import { Link } from "react-router";
import NotificationCard from "@/components/cards/NotificationCard";

const NotificationsPopUp = () => {
  const [openNotifications, setOpenNotifications] = useState(false);
  const { profile } = useSelector((state) => state.profile);
  const { t } = useTranslation();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    enabled: openNotifications,
  });

  const { data: unreadNotifications = 0 } = useQuery({
    queryKey: ["unread-count", "notification"],
    queryFn: () => getUnreadCount("notification"),
    enabled: !!profile,
  });

  return (
    <Popover open={openNotifications} onOpenChange={setOpenNotifications}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full relative">
          <FaBell className="w-4 h-4" />
          <NotificationsBadge count={unreadNotifications} />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="md:w-[500px]">
        {isLoading ? (
          <NotificationsSkeleton />
        ) : notifications?.items?.length ? (
          <div className="flex flex-col gap-2">
            {notifications.items.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                header
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground py-6">
            {t("notificationsPopUp.noNotifications")}
          </p>
        )}

        <div className="block mt-4">
          <Link
            to="/profile/notifications"
            onClick={() => setOpenNotifications(false)}
          >
            <Button className="w-full">
              {t("notificationsPopUp.moreNotifications")}
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPopUp;
