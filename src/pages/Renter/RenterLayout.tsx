import { useState } from "react";
import { RENTER_STEP } from "../../common/constants/constants";
import { PickLocationType } from "./pages/PickLocationType";
import "./renterLayout.scss";
import type { LocationDto } from "../../api/dtos/location.dto";
import { FillInformation } from "./pages/FillInformation";

export interface RenterProps {
  step: number;
  data: any;
  onSubmit: (e: any) => void;
  onCancel: () => void;
}

export const RenterLayout = () => {
  const [step, setStep] = useState<number>(RENTER_STEP.PICK_TYPE);
  const [data, setData] = useState<LocationDto>();

  if (step === RENTER_STEP.PICK_TYPE) {
    return (
      <div className="renter">
        <PickLocationType
          step={step}
          data={data}
          onSubmit={(value: string) => {
            setData(
              (prev) =>
                ({
                  ...prev,
                  typeCode: value,
                }) as LocationDto,
            );
            setStep(RENTER_STEP.FILL_INFORMATION);
          }}
          onCancel={() => {}}
        />
      </div>
    );
  } else if (step === RENTER_STEP.FILL_INFORMATION) {
    return (
      <div className="renter">
        <FillInformation
          step={step}
          data={data}
          onSubmit={(value: string) => {
            setData(
              (prev) =>
                ({
                  ...prev,
                  typeCode: value,
                }) as LocationDto,
            );
            setStep(RENTER_STEP.FILL_ADDRESS);
          }}
          onCancel={() => {
            setStep(RENTER_STEP.PICK_TYPE);
          }}
        />
      </div>
    );
  }
};
