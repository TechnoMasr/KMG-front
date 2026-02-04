import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getCountries, getPlatforms } from "@/services/mainServices";

const OffersFilter = ({ filters, setFilters, game }) => {
  const { t } = useTranslation();

  const { data: platforms = [], isLoading: platformsLoading } = useQuery({
    queryKey: ["platforms" + game?.id + game?.service],
    queryFn: () => getPlatforms({ game_id: game?.id, service: game?.service }),
    enabled: !!game,
  });

  const { data: countries = [], isLoading: countriesLoading } = useQuery({
    queryKey: ["countries" + game?.id + game?.service],
    queryFn: () => getCountries({ game_id: game?.id, service: game?.service }),
    enabled: !!game,
  });

  const ALL_VALUE = "__all__";

  return (
    <div className="container">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* المنطقة */}
        <div>
          <label className="block mb-2 text-sm font-medium">
            {t("OffersFilter.country")} :
          </label>
          <Select
            value={filters.country_id || ALL_VALUE}
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                country_id: value === ALL_VALUE ? "" : value,
              }))
            }
            disabled={platformsLoading}
          >
            <SelectTrigger className="rounded-full bg-input w-full cursor-pointer">
              <SelectValue
                placeholder={
                  countriesLoading ? t("loading") : t("OffersFilter.country")
                }
              />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value={ALL_VALUE}>{t("OffersFilter.all")}</SelectItem>

              {countries?.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* المنصة */}
        <div>
          <label className="block mb-2 text-sm font-medium">
            {t("OffersFilter.platform")} :
          </label>

          <Select
            value={filters.platform_id || ALL_VALUE}
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                platform_id: value === ALL_VALUE ? "" : value,
              }))
            }
            disabled={platformsLoading}
          >
            <SelectTrigger className="rounded-full bg-input w-full cursor-pointer">
              <SelectValue
                placeholder={
                  platformsLoading ? t("loading") : t("OffersFilter.platform")
                }
              />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value={ALL_VALUE}>{t("OffersFilter.all")}</SelectItem>

              {platforms.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default OffersFilter;
