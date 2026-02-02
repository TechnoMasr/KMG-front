import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { NavLink } from "react-router";
import { FaRegBell, FaRegUser } from "react-icons/fa6";
import { FiShoppingCart } from "react-icons/fi";
import { IoIosLogOut } from "react-icons/io";
import { HiOutlineBars3 } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import logo from "@/assets/images/logo.png";

import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { openModal } from "@/store/modals/modalsSlice";

const ProfileSideBar = () => {
  const { t } = useTranslation();
  const [openSideBar, setOpenSideBar] = useState(false);
  const { lang } = useSelector((state) => state.language);
  const { setting } = useSelector((state) => state.setting);

  const dispatch = useDispatch();

  const sideContent = (
    <div className="flex flex-col gap-2">
      <NavLink
        to={"/profile"}
        end
        className="sideBarLink"
        onClick={() => setOpenSideBar(false)}
      >
        <FaRegUser />
        {t("ProfileSideBar.profile")}
      </NavLink>

      <NavLink
        to={"/profile/orders"}
        end
        className="sideBarLink"
        onClick={() => setOpenSideBar(false)}
      >
        <FiShoppingCart />
        {t("ProfileSideBar.orders")}
      </NavLink>

      <NavLink
        to={"/profile/notifications"}
        end
        className="sideBarLink"
        onClick={() => setOpenSideBar(false)}
      >
        <FaRegBell />
        {t("ProfileSideBar.notifications")}
      </NavLink>

      <button
        onClick={() => dispatch(openModal("logoutModal"))}
        className="rounded-full sideBarLink"
      >
        <IoIosLogOut />
        {t("ProfileSideBar.logout")}
      </button>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block bg-card w-xs p-6 border-e">
        <div className="sticky top-28">{sideContent}</div>
      </aside>

      <Sheet open={openSideBar} onOpenChange={setOpenSideBar}>
        <SheetTrigger asChild className="lg:hidden w-fit mt-4 ms-4">
          <Button>
            <HiOutlineBars3 />
            {t("ProfileSideBar.menu")}
          </Button>
        </SheetTrigger>

        <SheetContent side={lang === "ar" ? "right" : "left"}>
          <SheetTitle className="flex items-center justify-center">
            <div className="w-20 h-12 overflow-hidden mt-4">
              <img
                loading="lazy"
                src={setting?.header_logo || logo}
                alt="logo"
                className="w-full h-full object-contain"
              />
            </div>
          </SheetTitle>

          <VisuallyHidden>
            <SheetDescription>
              {t("ProfileSideBar.sheetDescription")}
            </SheetDescription>
          </VisuallyHidden>

          <div className="p-4">{sideContent}</div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ProfileSideBar;
