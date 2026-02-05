import { useState } from "react";
import { RENTER_STEP } from "../../common/constants/constants";
import { PickLocationType } from "./pages/PickLocationType";
import "./renterLayout.scss";

export interface RenterProps {
  step: number;
  data: any;
  onSubmit: (e: any) => void;
  onCancel: () => void;
}

export const RenterLayout = () => {
  const [step, setStep] = useState<number>(RENTER_STEP.PICK_TYPE);
  const [data, setData] = useState<any>();

  if (step === RENTER_STEP.PICK_TYPE) {
    return (
      <div className="renter">
        <PickLocationType
          step={step}
          data={data}
          onSubmit={(value: string) => {
            console.log("value:", value);
          }}
          onCancel={() => {}}
        />
      </div>
    );
  }
};
