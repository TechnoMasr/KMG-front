import { Button } from "@/components/ui/button";
import ServicesPaymentCards from "@/components/commonSections/ServicesPaymentCards";
import PaymentModal from "@/components/modals/PaymentModal";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import useRequireAuth from "@/hooks/useRequireAuth";
import UnavailableLayout from "@/components/common/UnavailableLayout";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { useSelector } from "react-redux";

const HeadSection = ({ data }) => {
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const { lang } = useSelector((state) => state.language);

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

      {/* ================== IMAGE SLIDER ================== */}
      <div className="w-full">
        {/* Main Slider */}
        <Swiper
          dir={lang === "ar" ? "rtl" : "ltr"}
          modules={[Navigation, Thumbs]}
          navigation
          thumbs={{ swiper: thumbsSwiper }}
          className="rounded-2xl overflow-hidden"
        >
          {data?.images?.map((img, index) => (
            <SwiperSlide key={index}>
              <div className="aspect-video bg-accent overflow-hidden group">
                <img
                  src={img}
                  alt={`${data?.title}-${index}`}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Thumbnails */}
        <Swiper
          dir={lang === "ar" ? "rtl" : "ltr"}
          onSwiper={setThumbsSwiper}
          spaceBetween={10}
          watchSlidesProgress
          breakpoints={{
            0: {
              slidesPerView:
                data?.images?.length > 3 ? 2.7 : data?.images?.length,
            },
            640: {
              slidesPerView:
                data?.images?.length > 4 ? 3.7 : data?.images?.length,
            },
            1280: {
              slidesPerView:
                data?.images?.length > 5 ? 4.7 : data?.images?.length,
            },
          }}
          className="mt-4 swiper-thumbs"
        >
          {data?.images?.map((img, index) => (
            <SwiperSlide key={index}>
              <div className="cursor-pointer rounded-xl overflow-hidden border-2 border-transparent transition-all duration-300">
                <img
                  src={img}
                  alt={`thumb-${index}`}
                  className="w-full h-20 object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ================== CONTENT ================== */}
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
