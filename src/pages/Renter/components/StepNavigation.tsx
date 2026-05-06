import { Button } from "antd";

interface StepNavigationProps {
  onBack?: () => void;
  backText?: string;
  nextText?: string;
  isSubmitting?: boolean;
  submitHtmlType?: "submit" | "button";
  onNext?: (e?: any) => void;
}

export const StepNavigation = ({
  onBack,
  backText = "Quay lại",
  nextText = "Tiếp tục",
  isSubmitting = false,
  submitHtmlType = "submit",
  onNext,
}: StepNavigationProps) => {
  return (
    <div className="form-action">
      {onBack && (
        <Button
          htmlType="button"
          onClick={onBack}
          className="button-cancel"
        >
          {backText}
        </Button>
      )}
      <Button
        htmlType={submitHtmlType}
        className="button-submit"
        loading={isSubmitting}
        onClick={onNext}
      >
        {nextText}
      </Button>
    </div>
  );
};
