import icnClear from "@assets/svg/icn-clear.svg";

interface StepHeaderProps {
  title: string;
  onCancel: () => void;
}

export const StepHeader = ({ title, onCancel }: StepHeaderProps) => {
  return (
    <div className="renter-step-header">
      <h1 className="header-title">{title}</h1>
      <button
        className="header-close"
        onClick={onCancel}
        type="button"
        aria-label="Close"
      >
        <img src={icnClear} alt="X" />
      </button>
    </div>
  );
};
