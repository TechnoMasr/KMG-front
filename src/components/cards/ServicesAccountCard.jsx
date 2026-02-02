import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import UnavailableLayout from "../common/UnavailableLayout";

const ServicesAccountCard = ({ item }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isUnavailable = item.items_count === 0;

  const handleNavigate = () => {
    if (!isUnavailable) {
      navigate(`/games/accounts/details/${item.slug}`);
    }
  };

  return (
    <div
      onClick={handleNavigate}
      key={item.id}
      className={`relative overflow-hidden flex flex-col gap-4 card`}
    >
      {/* Overlay */}
      {isUnavailable && <UnavailableLayout />}

      <div className="grid grid-cols-2 gap-4">
        {item?.platforms[0] ? (
          <div className="flex items-center gap-2">
            <img
              loading="lazy"
              src={item?.platforms[0]?.icon}
              alt="game-icon"
              className="w-8 h-8 object-contain"
            />
            <p>{item?.platforms[0]?.name}</p>
          </div>
        ) : (
          <div></div>
        )}

        {item?.country_name ? (
          <div className="flex items-center gap-2 flex-row-reverse">
            <img
              loading="lazy"
              src={item.country_icon}
              alt="offer-image"
              className="w-8 h-8 object-contain"
            />
            <p>{item.country_name}</p>
          </div>
        ) : (
          <div></div>
        )}
      </div>

      <h3 className="font-semibold line-clamp-2">{item.title}</h3>

      <div className="flex flex-col gap-1 text-sm">
        <div className="flex items-center gap-2">
          <p className="text-lg font-bold">
            {item.price} {item.currency}
          </p>
        </div>

        {item.instant_delivery ? (
          <p className="py-1 px-4 bg-accent rounded-lg w-fit">
            {t("ServicesAccountCard.instantDelivery")}
          </p>
        ) : item.from_time && item.to_time ? (
          <p className="py-1 px-4 bg-accent rounded-lg w-fit">
            {item.from_time} - {item.to_time} {t("ServicesAccountCard.minutes")}
          </p>
        ) : null}
      </div>

      <Button
        className="w-full mt-auto"
        disabled={isUnavailable}
        variant={isUnavailable ? "secondary" : "default"}
      >
        {t("ServicesAccountCard.buyNow")}
      </Button>
    </div>
  );
};

export default ServicesAccountCard;
