import { Button } from "@/components/ui/button";
import ServicesPaymentCards from "@/components/commonSections/ServicesPaymentCards";
import PaymentModal from "@/components/modals/PaymentModal";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import useRequireAuth from "@/hooks/useRequireAuth";
import UnavailableLayout from "@/components/common/UnavailableLayout";

const HeadSection = ({ data }) => {
  const [openPaymentModal, setOpenPaymentModal] = useState(false);

  const isUnavailable = data.items_count === 0;

  const navigate = useNavigate();
  const { t } = useTranslation();

  const requireAuth = useRequireAuth();

  const handlePayment = (product) => {
    if (isUnavailable) return;

    requireAuth(() => {
      navigate("/payment", {
        state: {
          product_id: product.id,
          product_price: product.price,
          currency: product.currency,
        },
      });
    });
  };

  return (
    <div className="card lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 relative overflow-hidden">
      {/* Overlay */}
      {isUnavailable && <UnavailableLayout />}

      <div className="aspect-video bg-accent overflow-hidden rounded-2xl">
        <img
          loading="lazy"
          src={data?.offer_image}
          alt={data?.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col gap-4 lg:gap-6">
        <h2 className="text-lg lg:text-2xl font-bold">{data?.title}</h2>

        <div className="flex gap-2 flex-wrap">
          {data?.platforms?.map((platform) => (
            <p
              key={platform.id}
              className="text-sm border rounded-full w-fit px-4 py-2"
            >
              {platform.name}
            </p>
          ))}

          {data?.duration_minutes && (
            <p className="text-sm border rounded-full w-fit px-4 py-2">
              {data.duration_minutes}
            </p>
          )}

          {data?.instant_delivery ? (
            <p className="text-sm border rounded-full w-fit px-4 py-2">
              {t("ServicesAccountCard.instantDelivery")}
            </p>
          ) : data?.from_time && data?.to_time ? (
            <p className="text-sm border rounded-full w-fit px-4 py-2">
              {data?.from_time} - {data?.to_time}{" "}
              {t("ServicesAccountCard.minutes")}
            </p>
          ) : null}

          {data?.country_name && (
            <p className="text-sm border rounded-full w-fit px-4 py-2">
              {data.country_name}
            </p>
          )}
        </div>

        <div className="p-4 bg-accent rounded-2xl">
          <div className="flex items-center flex-wrap gap-2 mb-4">
            <p className="text-4xl font-bold">
              {data.price} {data.currency}
            </p>
          </div>

          <Button onClick={() => handlePayment(data)} className="w-full">
            {t("ServicesAccountCard.buyNow")}
          </Button>
        </div>

        <ServicesPaymentCards grid={2} />
      </div>

      <PaymentModal
        open={openPaymentModal}
        onClose={() => setOpenPaymentModal(false)}
        product_id={data?.id}
        product_price={data?.price}
        currency={data?.currency}
      />
    </div>
  );
};

export default HeadSection;
