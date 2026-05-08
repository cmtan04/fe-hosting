interface ConfirmDataSectionProps {
  label: string;
  items: Array<{ label: string; value: string }>;
}

export const ConfirmDataSection = ({ label, items }: ConfirmDataSectionProps) => {
  return (
    <div className="renter__confirm-section">
      <h1 className="renter__confirm-section-title">{label}</h1>
      <div className="renter-kvTable">
        {items.map((item, index) => (
          <div className="row" key={index}>
            <span>{item.label}: </span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};
