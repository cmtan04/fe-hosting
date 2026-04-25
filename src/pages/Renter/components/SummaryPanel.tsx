import type { SummaryPanelRow } from "../steps/types";

export const SummaryPanel = ({
  title,
  rows,
}: {
  title: string;
  rows: SummaryPanelRow[];
}) => (
  <div className="renter-summaryPanel">
    <p className="renter-summaryPanel-title">{title}</p>
    <div className="renter-summaryPanel-body">
      {rows.map((row) => (
        <div key={row.label} className="renter-summaryPanel-row">
          <span className="label">{row.label}</span>
          <span className="value">{row.value}</span>
        </div>
      ))}
    </div>
  </div>
);
