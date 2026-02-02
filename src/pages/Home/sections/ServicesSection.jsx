import ServicesSectionSkeleton from "@/components/Loading/SkeletonLoading/ServicesSectionSkeleton";
import { getGamesByService } from "@/services/homeServices";
import { useQuery } from "@tanstack/react-query";
import { HiChevronLeft } from "react-icons/hi";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

const ServicesSection = () => {
  const { t } = useTranslation();

  const { data: servicesData, isLoading } = useQuery({
    queryKey: ["services-games"],
    queryFn: getGamesByService,
  });

  if (isLoading) {
    return <ServicesSectionSkeleton />;
  }

  if (!servicesData) return null;

  const list = [
    {
      id: 1,
      title: t("servicesSection.accounts"),
      link: "accounts",
      items: servicesData?.accounts || [],
    },
    {
      id: 2,
      title: t("servicesSection.subscriptions"),
      link: "subscriptions",
      items: servicesData?.subscriptions || [],
    },
    {
      id: 3,
      title: t("servicesSection.topUp"),
      link: "top_up",
      items: servicesData?.top_up || [],
    },
    {
      id: 4,
      title: t("servicesSection.giftCards"),
      link: "gift_cards",
      items: servicesData?.gift_cards || [],
    },
    {
      id: 5,
      title: t("servicesSection.addGameToAccount"),
      link: "add_game_to_account",
      items: servicesData?.add_game_to_account || [],
    },
  ];

  return (
    <section className="container xl:max-w-7xl sectionPadding">
      <div className="grid grid-cols-1 gap-4 lg:gap-8">
        {list.map((item) => (
          <div key={item.id} className="flex flex-col gap-4 card">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold">{item.title}</h2>
              <Link
                to={`/games/${item.link}`}
                className="flex items-center gap-1 group hover:underline"
              >
                {t("servicesSection.seeMore")}
                <HiChevronLeft className="group-hover:-translate-x-1 ltr:group-hover:translate-x-1 transition-all ltr:rotate-180" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {item.items.map((i) => (
                <Link
                  to={`/games/${item.link}/${i.slug}`}
                  key={i.id}
                  className="flex items-center gap-2 hover:bg-accent rounded transition"
                >
                  <div className="w-16 h-16 overflow-hidden rounded">
                    <img
                      loading="lazy"
                      src={i.icon}
                      alt={i.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="font-bold line-clamp-1">{i.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
