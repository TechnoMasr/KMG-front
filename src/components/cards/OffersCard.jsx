import UnavailableLayout from "../common/UnavailableLayout";

const OffersCard = ({ item, onOfferClick, currentOffer }) => {
  const isUnavailable = item.items_count === 0;
  const isCurrentOffer = item?.id === currentOffer?.id;

  const handleChooseOffer = () => {
    if (isUnavailable) return;
    onOfferClick(item);
  };

  return (
    <div
      key={item.id}
      onClick={handleChooseOffer}
      className={`relative overflow-hidden card w-[150px] flex flex-col items-center
      text-center gap-2 cursor-pointer hover:scale-102 duration-200
                ${isCurrentOffer ? "border-primary border-2" : ""}`}
    >
      {/* Overlay */}
      {isUnavailable && <UnavailableLayout />}

      <div className="w-full aspect-video rounded-md overflow-clip">
        <img
          loading="lazy"
          src={item.image}
          alt={item.title}
          className="w-full h-full object-contain"
        />
      </div>

      {item?.game_currency ? (
        <div>
          <p className="text-xl font-bold">{item.title}</p>
          <p className="text-sm">{item?.game_currency}</p>
        </div>
      ) : (
        <p className="text-sm">{item.title}</p>
      )}

      {/* <span className="font-semibold pt-1 border-t mt-auto w-full">
        {item.price} {item.currency}
      </span> */}

      {/* منطقة الأسعار */}
      <div className="pt-1 border-t mt-auto w-full flex flex-col items-center justify-center gap-0.5">
        {item.price_before && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-400 line-through">
              {item.price_before} {item.currency}
            </span>

            {item?.discount_percentage && (
              <span className="text-xs text-gray-400">
                ({item.discount_percentage}%)
              </span>
            )}
          </div>
        )}
        <span>
          {item.price} {item.currency}
        </span>
      </div>
    </div>
  );
};

export default OffersCard;
