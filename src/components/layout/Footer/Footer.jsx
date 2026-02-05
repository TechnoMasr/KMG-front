import logo from "@/assets/images/logo.png";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";

import { Link, useNavigate } from "react-router";
import { getFooter } from "@/services/mainServices";
import { useQuery } from "@tanstack/react-query";
import FooterSkeleton from "@/components/Loading/SkeletonLoading/FooterSkeleton";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { openModal } from "@/store/modals/modalsSlice";

const Footer = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: footerData, isLoading } = useQuery({
    queryKey: ["footer"],
    queryFn: getFooter,
  });

  if (isLoading) {
    return <FooterSkeleton />;
  }

  const links = [
    {
      id: 1,
      name: t("footer.joinPartner"),
      action: () => navigate("/join-as-partner"),
    },
    {
      id: 2,
      name: t("footer.refundPolicy"),
      action: () => navigate("/refund-policy"),
    },
    {
      id: 3,
      name: t("footer.contactUs"),
      action: () => dispatch(openModal("contactUsModal")),
    },
  ];

  const socials = [
    {
      id: 1,
      name: "youtube",
      link: footerData?.youtube,
      icon: <FaYoutube />,
    },
    {
      id: 2,
      name: "x",
      link: footerData?.x,
      icon: <FaXTwitter />,
    },
    {
      id: 3,
      name: "linkedin",
      link: footerData?.linkedin,
      icon: <FaLinkedinIn />,
    },
    {
      id: 4,
      name: "instagram",
      link: footerData?.instagram,
      icon: <FaInstagram />,
    },
    {
      id: 5,
      name: "facebook",
      link: footerData?.facebook,
      icon: <FaFacebookF />,
    },
    {
      id: 6,
      name: "tiktok",
      link: footerData?.tiktok,
      icon: <FaTiktok />,
    },
    {
      id: 7,
      name: "telegram",
      link: `https://t.me/${footerData?.telegram.replace("@", "")}`,
      icon: <FaTelegramPlane />,
    },
    {
      id: 8,
      name: "whatsapp",
      link: `https://wa.me/${footerData?.whatsapp.replace(/[^\d]/g, "")}`,
      icon: <FaWhatsapp />,
    },
  ];

  return (
    <footer className="bg-background container">
      <section className="flex flex-col items-center gap-6 py-4">
        <div className="flex items-center justify-center flex-wrap gap-4">
          {footerData?.payment_platforms.map((item, index) => (
            <div
              key={index}
              className="w-12 aspect-video overflow-hidden rounded"
            >
              <img
                loading="lazy"
                src={item.image}
                alt={index + 1}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="w-32 h-16 overflow-hidden">
          <img
            loading="lazy"
            src={footerData?.footer_logo || logo}
            alt="footer-logo"
            className="w-full h-full object-contain"
          />
        </div>

        {footerData?.footer_text && (
          <p className="text-center text-sm max-w-3xl">
            {footerData?.footer_text}
          </p>
        )}

        <div className="flex items-center gap-4">
          {links.map((item) => (
            <button
              key={item.id}
              onClick={item.action}
              className="text-sm underline hover:text-primary transition cursor-pointer"
            >
              {item.name}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center flex-wrap gap-4">
          {socials
            .filter((item) => item.link)
            .map((item) => (
              <Link
                target="_blank"
                rel="noopener noreferrer"
                to={item.link}
                key={item.id}
                className="hover:text-primary hover:scale-110 transition text-xl"
              >
                {item.icon}
              </Link>
            ))}
        </div>
      </section>

      <div className="py-4 border-t">
        <p></p>
      </div>
    </footer>
  );
};

export default Footer;
