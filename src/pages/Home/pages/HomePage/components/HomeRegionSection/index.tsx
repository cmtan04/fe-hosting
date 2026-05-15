

interface RegionLink {
  label: string;
  href: string;
  imageUrl: string;
}

interface HomeRegionSectionProps {
  regions: RegionLink[];
  onRegionClick: (href: string) => void;
}

export const HomeRegionSection = ({
  regions,
  onRegionClick,
}: HomeRegionSectionProps) => {
  return (
    <section className="home_page__section home_page__section--regions">
      <div className="home_page__section-header">
        <div>
          <h2 className="home_page__section-title">Khám phá theo khu vực</h2>
        </div>
      </div>

      <div className="home_page__regions-grid">
        {regions.map((region) => (
          <button
            key={region.href}
            type="button"
            className="home_page__region-card"
            onClick={() => onRegionClick(region.href)}
            style={{ backgroundImage: `url(${region.imageUrl})` }}
          >
            <span className="home_page__region-card-overlay" />
            <span className="home_page__region-card-content">
              <span className="home_page__region-card-title">
                {region.label}
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};
