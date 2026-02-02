import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const SwiperNavigation = ({ name }) => {
  return (
    <div className="flex items-center justify-center gap-2 mt-4 lg:mt-8">
      <button className={`swiper-btn ${name}-next`}>
        <FaChevronRight className="ltr:rotate-180" />
      </button>

      <button className={`swiper-btn ${name}-prev`}>
        <FaChevronLeft className="ltr:rotate-180" />
      </button>
    </div>
  );
};

export default SwiperNavigation;
