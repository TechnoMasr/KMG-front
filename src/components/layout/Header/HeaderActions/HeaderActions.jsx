import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "./LanguageSwitcher";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getUnreadCount } from "@/services/mainServices";
import NotificationsPopUp from "./NotificationsPopUp";
import NotificationsBadge from "@/components/common/NotificationsBadge";
import ProfileSide from "./ProfileSide";
import HeaderSearch from "./HeaderSearch";
import useRequireAuth from "@/hooks/useRequireAuth";
import { BsChatLeftText } from "react-icons/bs";

const HeaderActions = () => {
  const navigate = useNavigate();
  const requireAuth = useRequireAuth();

  const { profile } = useSelector((state) => state.profile);

  const { data: unreadChats = 0 } = useQuery({
    queryKey: ["unread-count", "chat"],
    queryFn: () => getUnreadCount("chat"),
    enabled: !!profile,
    refetchInterval: 20000,
    refetchIntervalInBackground: true,
  });

  const handleGoToChat = () => {
    requireAuth(() => {
      navigate("/chat");
    });
  };

  return (
    <div className="flex items-center justify-end gap-2 flex-1">
      <HeaderSearch />

      {profile && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full relative"
            onClick={handleGoToChat}
          >
            <BsChatLeftText />

            <NotificationsBadge count={unreadChats} />
          </Button>

          <NotificationsPopUp />
        </>
      )}

      <LanguageSwitcher />
      <ProfileSide />
    </div>
  );
};

export default HeaderActions;
