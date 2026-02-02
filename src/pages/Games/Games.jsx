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
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page") || 1);

  useEffect(() => {
    if (!service) {
      navigate("/games/accounts", { replace: true });
    }
  }, [service, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setSearchParams({ page: 1, search });
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

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
    setSearchParams({ page, search: debouncedSearch });
  };

  return (
    <article>
      <GamesNav links={links} />

      <section className="container py-6 lg:py-10 space-y-6 lg:space-y-10">
        <div className="w-full flex items-center gap-2 bg-input py-2 px-4 rounded-full">
          <button>
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
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </section>
    </article>
  );
};

export default Games;
