import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getSearch } from "@/services/mainServices";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { IoSearchOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";

const HeaderSearch = () => {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const navigate = useNavigate();

  // Debounce effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // React Query for search
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["search", debouncedSearch],
    queryFn: () => getSearch(debouncedSearch),
    enabled: debouncedSearch.length > 0,
    staleTime: 30000,
  });

  const handleGameClick = (game) => {
    navigate(`/games/accounts/${game.slug}`);
    setIsModalOpen(false);
    clearSearch();
  };

  const handleProductClick = (pro) => {
    if (pro.service === "accounts") {
      navigate(`/games/accounts/details/${pro.slug}`);
    } else {
      navigate(`/games/${pro.service}/${pro.game_slug}`);
    }
    setIsModalOpen(false);
    clearSearch();
  };

  const clearSearch = () => {
    setSearchTerm("");
    setDebouncedSearch("");
  };

  return (
    <>
      <div className="lg:flex-1">
        {/* Mobile Search Button */}
        <Button
          variant="outline"
          size="icon"
          className="rounded-full lg:hidden"
          onClick={() => setIsModalOpen(true)}
        >
          <IoSearchOutline />
        </Button>

        {/* Desktop Search */}
        <div className="hidden lg:block relative px-8">
          <div className="w-full flex items-center gap-2 bg-input py-2 px-4 rounded-full">
            <IoSearchOutline className="text-gray-500" />
            <input
              placeholder={t("headerSearch.placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none border-none bg-transparent"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="text-gray-500 hover:text-gray-700"
              >
                <IoMdClose />
              </button>
            )}
          </div>
          {searchTerm && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50">
              <SearchResults
                handleGameClick={handleGameClick}
                handleProductClick={handleProductClick}
                debouncedSearch={debouncedSearch}
                isLoading={isLoading}
                searchResults={searchResults}
                t={t}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="fixed top-4 left-1/2 -translate-x-1/2 translate-y-0 max-w-[calc(100%-2rem)]! rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-center"></DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2 bg-input py-2 px-4 rounded-full">
              <IoSearchOutline className="text-gray-500" />
              <input
                placeholder={t("headerSearch.placeholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 outline-none border-none bg-transparent"
                autoFocus
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <IoMdClose />
                </button>
              )}
            </div>
            <SearchResults
              mobile={true}
              handleGameClick={handleGameClick}
              handleProductClick={handleProductClick}
              debouncedSearch={debouncedSearch}
              isLoading={isLoading}
              searchResults={searchResults}
              t={t}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HeaderSearch;

const SearchResults = ({
  mobile = false,
  handleGameClick,
  handleProductClick,
  debouncedSearch,
  isLoading,
  searchResults,
  t,
}) => {
  if (!debouncedSearch) return null;

  if (isLoading) {
    return (
      <div className={`p-4 text-center text-gray-500 ${mobile ? "" : "card"}`}>
        {t("headerSearch.searching")}
      </div>
    );
  }

  if (
    !searchResults ||
    (searchResults?.games?.length === 0 &&
      searchResults?.products?.length === 0)
  ) {
    return (
      <div className={`p-4 text-center text-gray-500 ${mobile ? "" : "card"}`}>
        {t("headerSearch.noResults")}
      </div>
    );
  }

  return (
    <div
      className={`mt-2 max-h-96 overflow-y-auto space-y-2 custom_scrollbar ${mobile ? "" : "card"}`}
    >
      {searchResults?.games?.map((game) => (
        <button
          key={game.id}
          onClick={() => handleGameClick(game)}
          className={`w-full flex items-center gap-3 p-2 bg-muted rounded-md hover:brightness-90 transition-colors cursor-pointer`}
        >
          <img
            loading="lazy"
            src={game.image}
            alt={game.name}
            className="w-16 h-16 rounded object-cover"
          />

          <div className="flex-1 text-start space-y-1">
            <h3 className="font-semibold line-clamp-2">{game.name}</h3>
          </div>
        </button>
      ))}
      {searchResults?.products?.map((product) => (
        <button
          key={product.id}
          onClick={() => handleProductClick(product)}
          className={`w-full flex items-center gap-3 p-2 bg-muted rounded-md hover:brightness-90 transition-colors cursor-pointer`}
        >
          <img
            loading="lazy"
            src={product.offer_image || product.image}
            alt={product.title}
            className="w-16 h-16 rounded object-cover"
          />

          <div className="flex-1 text-start space-y-1">
            <h3 className="font-semibold line-clamp-2">{product.title}</h3>
          </div>
        </button>
      ))}
    </div>
  );
};
