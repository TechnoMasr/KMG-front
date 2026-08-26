import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getSearch } from "@/api/mainServices";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { IoSearchOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";

// ============ Hooks ============

const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
};

const useHeaderSearch = (onNavigate) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const navigate = useNavigate();

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["search", debouncedSearch],
    queryFn: () => getSearch(debouncedSearch),
    enabled: debouncedSearch.length > 0,
    staleTime: 30000,
  });

  const clearSearch = () => setSearchTerm("");

  const goTo = (path) => {
    navigate(path);
    clearSearch();
    onNavigate?.();
  };

  const handleGameClick = (game) => goTo(`/games/accounts/${game.slug}`);

  const handleProductClick = (pro) =>
    goTo(
      pro.service === "accounts"
        ? `/games/accounts/details/${pro.slug}`
        : `/games/${pro.service}/${pro.game_slug}`,
    );

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearch,
    isLoading,
    searchResults,
    clearSearch,
    handleGameClick,
    handleProductClick,
  };
};

// ============ Helpers ============

// بتقسم النص وتلوّن الجزء اللي مطابق لكلمة البحث
const HighlightText = ({ text, highlight }) => {
  if (!highlight?.trim()) return <>{text}</>;

  const escaped = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i}>{part}</span>
        ) : (
          <span key={i} className="text-muted-foreground">
            {part}
          </span>
        ),
      )}
    </>
  );
};

// ============ Sub Components ============

const SearchInput = ({ value, onChange, onClear, placeholder, autoFocus }) => (
  <div className="relative">
    <IoSearchOutline className="text-gray-500 absolute top-1/2 start-3 -translate-y-1/2" />
    <input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-input py-2 px-8 rounded-full outline-none border-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/50 transition-all duration-200"
      autoFocus={autoFocus}
    />
    {value && (
      <button
        onClick={onClear}
        className="text-gray-500 absolute top-1/2 end-3 -translate-y-1/2"
      >
        <IoMdClose />
      </button>
    )}
  </div>
);

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

  const wrapperClass = `p-4 text-center text-gray-500 ${mobile ? "" : "card"}`;

  if (isLoading) {
    return <div className={wrapperClass}>{t("headerSearch.searching")}</div>;
  }

  const hasNoResults =
    !searchResults ||
    (searchResults?.games?.length === 0 &&
      searchResults?.products?.length === 0);

  if (hasNoResults) {
    return <div className={wrapperClass}>{t("headerSearch.noResults")}</div>;
  }

  return (
    <div
      className={`mt-2 max-h-96 overflow-y-auto space-y-2 custom_scrollbar ${
        mobile ? "" : "card"
      }`}
    >
      {searchResults?.games?.map((game) => (
        <ResultItem
          key={game.id}
          image={game.image}
          title={game.name}
          highlight={debouncedSearch}
          onClick={() => handleGameClick(game)}
        />
      ))}
      {searchResults?.products?.map((product) => (
        <ResultItem
          key={product.id}
          image={product.offer_image || product.image}
          title={product.title}
          highlight={debouncedSearch}
          onClick={() => handleProductClick(product)}
        />
      ))}
    </div>
  );
};

const ResultItem = ({ image, title, highlight, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 p-2 bg-muted rounded-md hover:brightness-90 transition-colors cursor-pointer"
  >
    <div className="w-16 h-16 rounded overflow-hidden border">
      {image && (
        <img
          loading="lazy"
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      )}
    </div>

    <div className="flex-1 text-start space-y-1">
      <h3 className="font-semibold line-clamp-2">
        <HighlightText text={title} highlight={highlight} />
      </h3>
    </div>
  </button>
);

// ============ Main Component ============

const HeaderSearch = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const desktopSearchRef = useRef(null);

  const {
    searchTerm,
    setSearchTerm,
    debouncedSearch,
    isLoading,
    searchResults,
    clearSearch,
    handleGameClick,
    handleProductClick,
  } = useHeaderSearch(() => setIsModalOpen(false));

  // قفل نتائج البحث في الشاشة الكبيرة لو دوس المستخدم برا الصندوق
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(e.target)
      ) {
        clearSearch();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [clearSearch]);

  return (
    <>
      <div className="lg:flex-1">
        {/* Mobile trigger button */}
        <Button
          variant="outline"
          size="icon"
          className="rounded-full lg:hidden"
          onClick={() => setIsModalOpen(true)}
        >
          <IoSearchOutline />
        </Button>

        {/* Desktop search */}
        <div ref={desktopSearchRef} className="hidden lg:block relative px-8">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={clearSearch}
            placeholder={t("headerSearch.placeholder")}
          />
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

      {/* Mobile search modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="fixed top-4 left-1/2 -translate-x-1/2 translate-y-0 max-w-[calc(100%-2rem)]! rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-center" />
          </DialogHeader>
          <div className="space-y-4">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              onClear={clearSearch}
              placeholder={t("headerSearch.placeholder")}
              autoFocus
            />
            <SearchResults
              mobile
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
