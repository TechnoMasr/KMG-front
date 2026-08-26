import { useDispatch, useSelector } from "react-redux";
import { openModal } from "@/store/modals/modalsSlice";

const useRequireAuth = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const requireAuth = (onSuccess) => {
    if (!user) {
      dispatch(openModal("requiredLoginModal"));
      return;
    }

    if (!user.is_verified) {
      dispatch(openModal("requiredVerifyEmailModal"));
      return;
    }

    onSuccess();
  };

  return requireAuth;
};

export default useRequireAuth;
