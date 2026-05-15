import "../home.scss";
import "./homePage.scss";
import { useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "@router/Route";
import { Col } from "antd";
import northImage from "@assets/images/home/north.jpg";
import centralImage from "@assets/images/home/central.jpg";
import southImage from "@assets/images/home/south.webp";
import { Banner } from "@/components/Banner/Banner";
import { HomeCTASection } from "./components/HomeCTASection";
import { HomeFeaturedSection } from "./components/HomeFeaturedSection";
import { HomeRegionSection } from "./components/HomeRegionSection";
import { useHomePage } from "./hooks/useHomePage";
import { REGION_FILTERS } from "./utils/homePage.constants";
import { buildLocationSearchUrl } from "./utils/homePage.utils";

export const HomePage = () => {
  const navigate = useNavigate();
  const { featuredSections } = useHomePage();
  const regionImages = {
    north: northImage,
    central: centralImage,
    south: southImage,
  } as const;

  const regionLinks = REGION_FILTERS.map((region) => ({
    ...region,
    imageUrl: regionImages[region.value as keyof typeof regionImages],
    href: buildLocationSearchUrl({
      page: 1,
      limit: 6,
      addressRegion: region.value,
    }),
  }));

  const handleSearch = (value: string) => {
    if (!value.trim()) {
      return;
    }
    navigate(ROUTER_PATH.LOCATIONS + `?q=${encodeURIComponent(value)}`);
  };

  return (
    <>
      <Banner onSearch={handleSearch} />
      <Col sm={24} lg={18} className="home_page">
        <HomeRegionSection
          regions={regionLinks}
          onRegionClick={(href) => navigate(href)}
        />

        {featuredSections.map((section) => (
          <HomeFeaturedSection
            key={section.key}
            title={section.title}
            description={section.description}
            ctaLabel={section.ctaLabel}
            isLoading={section.isLoading}
            isError={section.isError}
            locations={section.locations}
            renderType={section.renderType}
            onOpenAll={() =>
              navigate(
                buildLocationSearchUrl({
                  ...section.filter,
                  limit: 6,
                }),
              )
            }
            onLocationClick={(code) =>
              navigate(ROUTER_PATH.LOCATION_DETAIL.replace(":code", code))
            }
          />
        ))}

        <HomeCTASection onOpenAll={() => navigate(ROUTER_PATH.LOCATIONS)} />
      </Col>
    </>
  );
};
