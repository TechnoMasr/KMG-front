import RatingStars from "../common/RatingStars";

const TestimonialsCard = ({ item }) => {
  return (
    <div className="flex flex-col gap-4 card">
      <div className="flex items-center gap-2">
        <div className="w-12 h-12 overflow-hidden rounded-full">
          <img
            loading="lazy"
            src={item?.image_url}
            alt={item?.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <h2 className="text-lg font-bold">{item?.name}</h2>
          <div className="flex items-center gap-1">
            <RatingStars rating={item?.rating} />
          </div>
        </div>
      </div>

      <div
        className="text-sm rich_content"
        dangerouslySetInnerHTML={{ __html: item?.content }}
      />
    </div>
  );
};

export default TestimonialsCard;
