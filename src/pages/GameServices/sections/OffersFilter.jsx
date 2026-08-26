import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getCountries, getPlatforms } from "@/api/mainServices";

const OffersFilter = ({ filters, setFilters, game }) => {
  const { t } = useTranslation();

  const { data: platforms = [], isLoading: platformsLoading } = useQuery({
    queryKey: ["platforms", game?.id, game?.service],
    queryFn: () => getPlatforms({ game_id: game?.id, service: game?.service }),
    enabled: !!game,
  });

  const { data: countries = [], isLoading: countriesLoading } = useQuery({
    queryKey: ["countries", game?.id, game?.service],
    queryFn: () => getCountries({ game_id: game?.id, service: game?.service }),
    enabled: !!game,
  });

  const handleCountryChange = (id) => {
    setFilters((prev) => ({
      ...prev,
      country_id: prev.country_id === id ? "" : id, // النقر مجدداً يلغي التحديد
    }));
  };

  const handlePlatformChange = (id) => {
    setFilters((prev) => ({
      ...prev,
      platform_id: prev.platform_id === id ? "" : id, // النقر مجدداً يلغي التحديد
    }));
  };

  return (
    <div className="container space-y-6">
      {/* فلتر المنطقة / الدولة */}
      <div>
        <label className="block mb-3 text-sm font-semibold">
          {t("OffersFilter.country")} :
        </label>

        {countriesLoading ? (
          <div className="flex gap-2 animate-pulse">
            <div className="h-9 w-20 bg-muted rounded-full" />
            <div className="h-9 w-24 bg-muted rounded-full" />
            <div className="h-9 w-20 bg-muted rounded-full" />
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {/* زر الكل */}
            <button
              type="button"
              onClick={() => handleCountryChange("")}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors border ${
                !filters.country_id
                  ? "bg-primary text-white border-primary"
                  : "bg-background text-foreground border-border hover:bg-accent cursor-pointer"
              }`}
            >
              {t("OffersFilter.all")}
            </button>

            {/* أزرار الدول */}
            {countries.map((c) => {
              const countryIdStr = String(c.id);
              const isSelected = filters.country_id === countryIdStr;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleCountryChange(countryIdStr)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors border ${
                    isSelected
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-background text-foreground border-border hover:bg-accent cursor-pointer"
                  }`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* فلتر المنصة */}
      <div>
        <label className="block mb-3 text-sm font-semibold">
          {t("OffersFilter.platform")} :
        </label>

        {platformsLoading ? (
          <div className="flex gap-2 animate-pulse">
            <div className="h-9 w-20 bg-muted rounded-full" />
            <div className="h-9 w-24 bg-muted rounded-full" />
            <div className="h-9 w-20 bg-muted rounded-full" />
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {/* زر الكل */}
            <button
              type="button"
              onClick={() => handlePlatformChange("")}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors border ${
                !filters.platform_id
                  ? "bg-primary text-white border-primary"
                  : "bg-background text-foreground border-border hover:bg-accent cursor-pointer"
              }`}
            >
              {t("OffersFilter.all")}
            </button>

            {/* أزرار المنصات */}
            {platforms.map((p) => {
              const platformIdStr = String(p.id);
              const isSelected = filters.platform_id === platformIdStr;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePlatformChange(platformIdStr)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors border ${
                    isSelected
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-background text-foreground border-border hover:bg-accent cursor-pointer"
                  }`}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OffersFilter;
