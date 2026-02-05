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
      className={`relative overflow-hidden card w-[150px] flex flex-col items-center text-center gap-2 cursor-pointer duration-200
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

      <span className="font-semibold pt-1 border-t mt-auto w-full">
        {item.price} {item.currency}
      </span>
    </div>
  );
};

export default OffersCard;
