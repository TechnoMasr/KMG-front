import logoutIcon from "@/assets/icons/logout-icon.png";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { closeModal } from "@/store/modals/modalsSlice";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "@/api/authServices";
import { logout } from "@/store/auth/authSlice";

const LogOutModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { logoutModal } = useSelector((state) => state.modals);

  const onClose = () => {
    dispatch(closeModal("logoutModal"));
  };

  const { mutate: logoutMutate, isPending } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      dispatch(logout());
      onClose();
    },
    onError: (err) => {
      console.log("Logout Error:", err);
      dispatch(logout());
      onClose();
    },
  });

  const handleLogout = () => {
    logoutMutate();
  };

  return (
    <Dialog open={logoutModal} onOpenChange={onClose}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <DialogDescription>
            <img
              loading="lazy"
              src={logoutIcon}
              alt="logout"
              className="mx-auto"
            />
          </DialogDescription>
          <DialogTitle className="text-center">
            {t("logOutModal.logoutConfirm")}
          </DialogTitle>
        </DialogHeader>

        <DialogFooter>
          <Button
            className="flex-1 flex items-center justify-center gap-2"
            disabled={isPending}
            onClick={handleLogout}
          >
            {isPending && (
              <AiOutlineLoading3Quarters className="w-4 h-4 animate-spin" />
            )}
            {t("logOutModal.logout")}
          </Button>

          <Button
            variant="outline"
            className="flex-1 rounded-full"
            disabled={isPending}
            onClick={onClose}
          >
            {t("logOutModal.cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogOutModal;
