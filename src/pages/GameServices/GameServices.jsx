import { getProductsByGameAndService } from "@/api/serviceServices";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router";
import GamesNav from "@/components/commonSections/GamesNav";
import Accounts from "./pages/Accounts/Accounts";
import ProductsPage from "./pages/ProductsPage/ProductsPage";
import OffersFilter from "./sections/OffersFilter";
import { useState, useMemo } from "react";
import AccountsSkeleton from "@/components/Loading/SkeletonLoading/AccountsSkeleton";
import { useTranslation } from "react-i18next";
import SeoManager from "@/utils/SeoManager";
import OffersSkeleton from "@/components/Loading/SkeletonLoading/OffersSkeleton";

const GameServicesContent = () => {
  const { service, id } = useParams();
  const { t } = useTranslation();

  const defaultFilters = useMemo(
    () => ({
      country_id: "",
      platform_id: "",
    }),
    [],
  );

  const [filters, setFilters] = useState(defaultFilters);
  const [searchParams, setSearchParams] = useSearchParams();

  // قراءة رقم الصفحة الحالي (افتراضياً 1 إذا لم يكن موجوداً)
  const currentPage = Number(searchParams.get("page") || 1);

  const { data: gameServicesData, isLoading } = useQuery({
    queryKey: ["game-services", service, id, filters, currentPage],
    queryFn: () =>
      getProductsByGameAndService({
        service,
        game_slug: id,
        page: currentPage,
        ...filters,
      }),
    enabled: !!service,
  });

  // إعادة ضبط الصفحة إلى 1 فقط عند تغيير الفلاتر (وباستخدام replace: true)
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    if (searchParams.get("page")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("page");
      setSearchParams(newParams, { replace: true });
    }
  };

  const game = gameServicesData?.extra?.game || null;
  const products = gameServicesData?.items || [];
  const gameServicesToShow = gameServicesData?.extra?.game?.items_count || {};

  const links = [
    {
      id: 1,
      key: "accounts",
      title: t("Games.list.accounts"),
      link: `/games/accounts/${id}`,
    },
    {
      id: 2,
      key: "subscriptions",
      title: t("Games.list.subscriptions"),
      link: `/games/subscriptions/${id}`,
    },
    {
      id: 3,
      key: "top_up",
      title: t("Games.list.topUp"),
      link: `/games/top_up/${id}`,
    },
    {
      id: 4,
      key: "gift_cards",
      title: t("Games.list.giftCards"),
      link: `/games/gift_cards/${id}`,
    },
    {
      id: 5,
      key: "add_game_to_account",
      title: t("Games.list.addGameToAccount"),
      link: `/games/add_game_to_account/${id}`,
    },
  ];

  const filteredLinks = links.filter(
    (item) => gameServicesToShow[item.key] > 0,
  );

  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    if (page === 1) {
      newParams.delete("page");
    } else {
      newParams.set("page", page);
    }
    setSearchParams(newParams); // بدون replace: true
  };

  return (
    <>
      <SeoManager
        title={game?.seo?.meta_title}
        description={game?.seo?.meta_description}
        keywords={game?.seo?.keywords}
        canonical={game?.seo?.canonical_url}
        ogImage={game?.seo?.og_image}
      />

      <article className="space-y-6 lg:space-y-10 pb-6 lg:pb-10">
        <GamesNav links={filteredLinks} game={game} isLoading={isLoading} />

        <OffersFilter
          filters={filters}
          setFilters={handleFilterChange}
          game={game}
        />

        {isLoading ? (
          service === "accounts" ? (
            <AccountsSkeleton />
          ) : (
            <OffersSkeleton />
          )
        ) : game?.service === "accounts" ? (
          <Accounts
            products={products}
            meta={gameServicesData?.meta}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        ) : (
          <ProductsPage
            game={game}
            products={products}
            meta={gameServicesData?.meta}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </article>
    </>
  );
};

const GameServices = () => {
  const { service } = useParams();
  return <GameServicesContent key={service} />;
};

export default GameServices;
