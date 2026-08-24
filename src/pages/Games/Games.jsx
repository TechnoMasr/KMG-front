import { FaSearch } from "react-icons/fa";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { getAllGamesByService } from "@/services/serviceServices";
import { useQuery } from "@tanstack/react-query";
import GamesNav from "@/components/commonSections/GamesNav";
import { useEffect, useState } from "react";
import EmptyDataSection from "@/components/commonSections/EmptyDataSection";
import GamesSkeleton from "@/components/Loading/SkeletonLoading/GamesSkeleton";
import MainPagination from "@/components/common/MainPagination";
import { useTranslation } from "react-i18next";

const Games = () => {
  const { t } = useTranslation();
  const { service } = useParams();
  const activeService = service || "accounts";
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page") || 1);
  const initialSearch = searchParams.get("search") || "";

  // تعيين الحالة الابتدائية من الـ URL مباشرة
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);

  useEffect(() => {
    if (!service) {
      navigate("/games/accounts", { replace: true });
    }
  }, [service, navigate]);

  // تحديث الـ URL والـ Debounce فقط عند تغيير قيمة مدخل البحث
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);

      // تحديث الـ URL فقط إذا كانت قيمة البحث ختلفة عن القيمة الموجودة في الـ URL
      if (search !== initialSearch) {
        const newParams = new URLSearchParams(searchParams);

        if (search.trim()) {
          newParams.set("search", search);
        } else {
          newParams.delete("search");
        }

        // إرجاع الصفحة إلى 1 عند البحث ومسح البرامتر لتنظيف الـ URL
        newParams.delete("page");

        setSearchParams(newParams, { replace: true });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search, initialSearch, searchParams, setSearchParams]);

  const { data: gamesData, isLoading } = useQuery({
    queryKey: ["games", activeService, debouncedSearch, currentPage],
    queryFn: () =>
      getAllGamesByService(activeService, debouncedSearch, currentPage),
    enabled: !!activeService,
  });

  const links = [
    { id: 1, title: t("Games.list.accounts"), link: `/games/accounts` },
    {
      id: 2,
      title: t("Games.list.subscriptions"),
      link: "/games/subscriptions",
    },
    { id: 3, title: t("Games.list.topUp"), link: "/games/top_up" },
    { id: 4, title: t("Games.list.giftCards"), link: "/games/gift_cards" },
    {
      id: 5,
      title: t("Games.list.addGameToAccount"),
      link: "/games/add_game_to_account",
    },
  ];

  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);

    if (page === 1) {
      newParams.delete("page");
    } else {
      newParams.set("page", page.toString());
    }

    setSearchParams(newParams); // بدون replace لإبقاء التصفح في الـ History
  };

  return (
    <article>
      <GamesNav links={links} />

      <section className="container py-6 lg:py-10 space-y-6 lg:space-y-10">
        <div className="w-full flex items-center gap-2 bg-input py-2 px-4 rounded-full">
          <button type="button">
            <FaSearch />
          </button>

          <input
            type="search"
            placeholder={t("Games.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 outline-none border-none bg-transparent"
          />
        </div>

        {isLoading ? (
          <GamesSkeleton />
        ) : gamesData?.items?.length === 0 ? (
          <EmptyDataSection msg={t("Games.noGames")} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8">
            {gamesData?.items?.map((item) => (
              <Link
                to={`/games/${item.service}/${item.slug}`}
                key={item.id}
                className="flex flex-col gap-2 card"
              >
                <div className="w-full aspect-square bg-accent overflow-hidden rounded-lg">
                  <img
                    loading="lazy"
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h2 className="text-lg font-bold text-center">{item.name}</h2>
              </Link>
            ))}
          </div>
        )}

        <MainPagination
          totalPages={gamesData?.meta?.last_page || 1}
          // totalPages={5}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </section>
    </article>
  );
};

export default Games;
