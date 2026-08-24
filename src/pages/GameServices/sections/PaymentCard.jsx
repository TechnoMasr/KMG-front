import { Button } from "@/components/ui/button";
import ServicesPaymentCards from "@/components/commonSections/ServicesPaymentCards";
import PaymentModal from "@/components/modals/PaymentModal";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import useRequireAuth from "@/hooks/useRequireAuth";

const PaymentCard = ({ currentOffer, game }) => {
  const { t } = useTranslation();
  const [openPaymentModal, setOpenPaymentModal] = useState(false);

  const navigate = useNavigate();
  const requireAuth = useRequireAuth();

  const handlePayment = (product) => {
    requireAuth(() => {
      if (game.service === "gift_cards") {
        navigate("/payment", {
          state: {
            product_id: product.id,
            product_price: product.price,
            currency: product.currency,
          },
        });
      } else {
        setOpenPaymentModal(true);
      }
    });
  };

  if (!currentOffer) return null;

  return (
    <div className="flex flex-col gap-4 card w-full md:min-w-xs md:max-w-sm h-fit">
      <div>
        <h2 className="text-xl font-bold mb-2 pb-2 border-b text-center">
          {game.name}
        </h2>

        <h3 className="text-lg font-bold mb-2">
          {currentOffer.title} {currentOffer.game_currency}
        </h3>

        <ul className="flex flex-col gap-2 text-sm">
          <li className="flex justify-between">
            <p>{t("paymentCard.region")}</p>
            <span>
              {currentOffer.country_name || t("paymentCard.notSpecified")}
            </span>
          </li>
          <li className="flex justify-between">
            <p>{t("paymentCard.platform")}</p>
            <span>
              {currentOffer.platforms.map((item) => item.name).join(", ") ||
                t("paymentCard.notSpecified")}
            </span>
          </li>
        </ul>
      </div>

      <div>
        {/* <h3 className="text-lg font-bold mb-2">
          {t("paymentCard.orderSummary")}
        </h3> */}
        <ul className="flex flex-col divide-y-2 text-sm">
          <li className="flex justify-between gap-2 py-1 text-muted-foreground">
            <p>{t("paymentCard.deliveryTime")}</p>{" "}
            {currentOffer.instant_delivery ? (
              <span>{t("ServicesAccountCard.instantDelivery")}</span>
            ) : currentOffer.from_time && currentOffer.to_time ? (
              <span>
                {currentOffer.from_time} - {currentOffer.to_time}{" "}
                {t("ServicesAccountCard.minutes")}
              </span>
            ) : null}
          </li>

          {currentOffer.price_before && (
            <li className="flex justify-between gap-2 py-1 text-muted-foreground">
              <p>{t("paymentCard.priceBefore")}</p>
              <span>
                {currentOffer.price_before} {currentOffer.currency}
              </span>
            </li>
          )}

          {currentOffer?.discount_percentage && (
            <li className="flex justify-between gap-2 py-1 text-muted-foreground">
              <p>{t("paymentCard.discountedPercentage")}</p>
              <span>{currentOffer.discount_percentage}%</span>
            </li>
          )}

          {currentOffer?.discount_percentage && (
            <span className="text-sm text-gray-400">
              ({currentOffer.discount_percentage}%)
            </span>
          )}

          <li className="flex justify-between gap-2 py-1 text-lg">
            <p>{t("paymentCard.totalPrice")}</p>{" "}
            <span>
              {currentOffer.price} {currentOffer.currency}
            </span>
          </li>
        </ul>
      </div>

      <Button onClick={() => handlePayment(currentOffer)}>
        {t("paymentCard.buyNow")}
      </Button>

      <ServicesPaymentCards />

      <PaymentModal
        open={openPaymentModal}
        onClose={() => setOpenPaymentModal(false)}
        product_id={currentOffer.id}
        product_price={currentOffer.price}
        currency={currentOffer?.currency}
      />
    </div>
  );
};

export default PaymentCard;
