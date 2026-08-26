import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaRegUser } from "react-icons/fa6";
import { FiShoppingCart } from "react-icons/fi";
import { IoIosLogOut } from "react-icons/io";
import UserAvatar from "@/components/common/UserAvatar";
import { Link, useNavigate } from "react-router";
import { openModal } from "@/store/modals/modalsSlice";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";

const ProfileSide = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { lang } = useSelector((state) => state.language);
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <UserAvatar
              name={user?.name}
              image={user?.image}
              className="cursor-pointer"
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            dir={lang === "ar" ? "rtl" : "ltr"}
            className={`w-52`}
          >
            <DropdownMenuLabel className="flex items-center gap-2">
              <UserAvatar name={user?.name} image={user?.image} />
              <h3 className="font-semibold">{user?.name}</h3>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => navigate("/profile")}
              className="justify-start"
            >
              <FaRegUser />
              {t("profileSide.profile")}
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => navigate("/profile/orders")}>
              <FiShoppingCart />
              {t("profileSide.orders")}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                dispatch(openModal("logoutModal"));
              }}
              className="bg-red-800/50 hover:bg-red-800/30!"
            >
              <IoIosLogOut />
              {t("profileSide.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link to="/login">
          <Button>{t("profileSide.login")}</Button>
        </Link>
      )}
    </>
  );
};

export default ProfileSide;
