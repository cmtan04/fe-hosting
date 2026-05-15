import { Button } from "antd";
import type { LocationDto } from "@api/dtos/location.dto";
import { FormSearch } from "@/components/FormSearch/formSearch";
import { QUICK_FILTERS, HOME_STATS } from "../../utils/homePage.constants";
import { HomeHeroPreviewCard } from "../HomeHeroPreviewCard";

interface HomeHeroSectionProps {
  locations: LocationDto[];
  isLoading: boolean;
  onSearch: (value: string) => void;
  onQuickFilter: (filter: (typeof QUICK_FILTERS)[number]["filter"]) => void;
  onLocationClick: (code: string) => void;
}

export const HomeHeroSection = ({
  locations,
  isLoading,
  onSearch,
  onQuickFilter,
  onLocationClick,
}: HomeHeroSectionProps) => {
  const heroPrimaryLocation = locations[0];
  const heroSecondaryLocations = locations.slice(1, 3);

  return (
    <section className="home_page__hero">
      <div className="home_page__hero-copy">
        <h1>Tìm phòng theo cách sang hơn, trực quan hơn, ít bước hơn.</h1>
        <p>
          Một homepage đặt trải nghiệm tìm phòng lên trước: search nhanh, lọc
          gọn, và các lựa chọn nổi bật được trình bày như một marketplace cao
          cấp.
        </p>

        <FormSearch
          label=""
          onSearch={onSearch}
          placeholder="Tìm theo khu vực"
          name="home_search"
          size="large"
        />

        <div className="home_page__hero-chips">
          {QUICK_FILTERS.map((item) => (
            <Button
              key={item.label}
              className="home_page__chip"
              onClick={() => onQuickFilter(item.filter)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};
