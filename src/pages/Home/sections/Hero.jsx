import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import { useSelector } from "react-redux";
import HeroSkeleton from "@/components/Loading/SkeletonLoading/HeroSkeleton";
import { Link } from "react-router";

const Hero = ({ data = [], isLoading }) => {
  const { lang } = useSelector((state) => state.language);

  if (isLoading) {
    return <HeroSkeleton />;
  }

  if (!data || data.length === 0) return null;

  return (
    <section className="container py-6 lg:py-10">
      <div className="w-full xl:max-w-6xl mx-auto aspect-video rounded-xl md:rounded-3xl overflow-hidden relative">
        <Swiper
          dir={lang === "ar" ? "rtl" : "ltr"}
          modules={[Pagination, Autoplay]}
          loop
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="h-full hero-swiper"
        >
          {data?.map((slide) => {
            const hasLink = Boolean(slide?.link);

            const Wrapper = hasLink ? Link : "div";

            const wrapperProps = hasLink
              ? {
                  to: slide.link,
                  className: "w-full h-full block cursor-pointer",
                }
              : {
                  className: "w-full h-full",
                };

            return (
              <SwiperSlide key={slide.id}>
                <Wrapper {...wrapperProps}>
                  <img
                    loading="lazy"
                    src={slide.web_image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </Wrapper>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Scoped Styles */}
        <style>
          {`
            .hero-swiper .swiper-pagination-bullet {
              background: rgba(255, 255, 255, 0.6);
              opacity: 1;
              width: 10px;
              height: 10px;
              transition: all 0.3s ease;
            }

            .hero-swiper .swiper-pagination-bullet-active {
              background: #fff;
              width: 16px;
              height: 16px;
              transform: translateY(3px);
            }
          `}
        </style>
      </div>
    </section>
  );
};

export default Hero;
