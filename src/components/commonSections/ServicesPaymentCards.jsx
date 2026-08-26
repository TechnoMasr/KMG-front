import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { FaHeadset } from "react-icons/fa6";
import { BiShieldAlt2 } from "react-icons/bi";
import { CiCreditCard2 } from "react-icons/ci";
import { BsCurrencyDollar } from "react-icons/bs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const ServicesPaymentCards = ({ grid = 1 }) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const { setting } = useSelector((state) => state.setting);
  const [currentService, setCurrentService] = useState("support");
  const featureDescription = setting?.features?.find(
    (f) => f.type === currentService,
  )?.description;

  const list = [
    {
      id: 1,
      title: t("ServicesPaymentCards.items.support.title"),
      desc: t("ServicesPaymentCards.items.support.desc"),
      icon: <FaHeadset />,
      type: "support",
    },
    {
      id: 2,
      title: t("ServicesPaymentCards.items.security.title"),
      desc: t("ServicesPaymentCards.items.security.desc"),
      icon: <BiShieldAlt2 />,
      type: "security",
    },
    {
      id: 3,
      title: t("ServicesPaymentCards.items.fastPayment.title"),
      desc: t("ServicesPaymentCards.items.fastPayment.desc"),
      icon: <CiCreditCard2 />,
      type: "payment",
    },
    {
      id: 4,
      title: t("ServicesPaymentCards.items.refund.title"),
      desc: t("ServicesPaymentCards.items.refund.desc"),
      icon: <BsCurrencyDollar />,
      type: "refund",
    },
  ];

  return (
    <>
      <div
        className={`grid grid-cols-1 gap-2 ${
          grid === 2 ? "sm:grid-cols-2 md:gap-4" : ""
        }`}
      >
        {list.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setCurrentService(item.type);
              setShowModal(true);
            }}
            className="cursor-pointer"
          >
            <div className="p-2 bg-accent rounded-2xl flex items-center gap-2 text-start">
              <span className="bg-card rounded-lg p-2">{item.icon}</span>
              <div>
                <p className="font-bold text-sm">{item.title}</p>
                <p className="text-xs">{item.desc}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <Dialog open={!!showModal} onOpenChange={() => setShowModal(false)}>
        <DialogContent>
          <VisuallyHidden>
            <DialogTitle></DialogTitle>
          </VisuallyHidden>

          <DialogDescription asChild>
            <div
              className="text-sm pt-4 text-white rich_content"
              dangerouslySetInnerHTML={{
                __html: featureDescription,
              }}
            />
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ServicesPaymentCards;
