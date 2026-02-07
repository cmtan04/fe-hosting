import { useState } from "react";
import { RENTER_STEP } from "../../common/constants/constants";
import { PickLocationType } from "./pages/PickLocationType";
import "./renterLayout.scss";
import type { LocationDto } from "../../api/dtos/location.dto";
import { FillInformation } from "./pages/FillInformation";
import { FillAddress } from "./pages/FillAddress";
import { FillOwner } from "./pages/FillOwner";
import { ConfirmInformation } from "./pages/ConfirmInformation";

export interface RenterProps {
  step: number;
  data: LocationDto;
  onSubmit: (e: any) => void;
  onCancel: () => void;
}

export const RenterLayout = () => {
  const [step, setStep] = useState<number>(RENTER_STEP.CONFIRM);
  const [data, setData] = useState<LocationDto>({
    typeCode: "",
    serviceCode: [],
    locationAddress: [],
    locationName: "",
    locationPriceStart: 0,
    locationPriceEnd: 0,
    locationPriceAfterDeal: 0,
    locationStatus: 0,
  });

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
          onSubmit={(value: any) => {
            setData(
              (prev) =>
                ({
                  ...prev,
                  locationName: value.locationName,
                  minTimeLimit: value.minTimeLimit,
                  maxTimeLimit: value.maxTimeLimit,
                  locationDescription: value.locationDescription,
                  locationNote: value.locationNote,
                  locationPriceStart: value.locationPriceStart,
                  locationPriceEnd: value.locationPriceEnd,
                  locationPriceAfterDeal: value.locationPriceAfterDeal,
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
  } else if (step === RENTER_STEP.FILL_ADDRESS) {
    return (
      <div className="renter">
        <FillAddress
          step={step}
          data={data}
          onSubmit={(value: any) => {
            setData(
              (prev) =>
                ({
                  ...prev,
                  locationAddress: [
                    {
                      addressName: value.addressName,
                      fullAddress: value.fullAddress,
                      addressWard: value.addressWard,
                      addressDistrict: value.addressDistrict,
                      addressCity: value.addressCity,
                      addressProvince: value.addressProvince,
                      addressCountry: value.addressCountry,
                      addRessPortal: value.addRessPortal,
                      addressLat: value.addressLat,
                      addressLong: value.addressLong,
                      addressRegion: value.addressRegion,
                      addressDescription: value.addressDescription,
                      addressNote: value.addressNote,
                    },
                  ],
                }) as LocationDto,
            );
            setStep(RENTER_STEP.FILL_OWNER);
          }}
          onCancel={() => {
            setStep(RENTER_STEP.FILL_INFORMATION);
          }}
        />
      </div>
    );
  } else if (step === RENTER_STEP.FILL_OWNER) {
    return (
      <div className="renter">
        <FillOwner
          step={step}
          data={data}
          onSubmit={(value: any) => {
            setData(
              (prev) =>
                ({
                  ...prev,
                  locationAddress: [{}],
                }) as LocationDto,
            );
            setStep(RENTER_STEP.CONFIRM);
          }}
          onCancel={() => {
            setStep(RENTER_STEP.FILL_ADDRESS);
          }}
        />
      </div>
    );
  } else if (step === RENTER_STEP.CONFIRM) {
    return (
      <div className="renter">
        <ConfirmInformation
          step={step}
          data={data}
          onSubmit={(value: any) => {
            setData(
              (prev) =>
                ({
                  ...prev,
                  locationAddress: [{}],
                }) as LocationDto,
            );
            setStep(RENTER_STEP.CONFIRM);
          }}
          onCancel={() => {
            setStep(RENTER_STEP.FILL_ADDRESS);
          }}
        />
      </div>
    );
  }
};
