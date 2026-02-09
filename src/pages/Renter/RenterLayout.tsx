import { useState } from "react";
import {
  DEFAULT_MESSAGE,
  NOTI_ERROR,
  NOTI_SUCCESS,
  RENTER_STEP,
} from "../../common/constants/constants";
import { PickLocationType } from "./pages/PickLocationType";
import "./renterLayout.scss";
import type { LocationDto } from "../../api/dtos/location.dto";
import { FillInformation } from "./pages/FillInformation";
import { FillAddress } from "./pages/FillAddress";
import { FillOwner } from "./pages/FillOwner";
import { ConfirmInformation } from "./pages/ConfirmInformation";
import { LocationCreateSucees } from "./pages/LocationCreateSuccess";
import { useMutation } from "@tanstack/react-query";
import { createLocation } from "../../api/configs/location.config";
import { useLoading } from "../../providers/loadingProvider";
import { useNotification } from "../../providers/notificationProvider";
import { isAxiosError } from "axios";

export interface RenterProps {
  step: number;
  data: LocationDto;
  onSubmit: (e: any) => void;
  onCancel: () => void;
}

export const RenterLayout = () => {
  const { setLoading } = useLoading();
  const { showNotification } = useNotification();
  const [step, setStep] = useState<number>(RENTER_STEP.PICK_TYPE);
  const [data, setData] = useState<LocationDto>({
    typeCode: "",
    locationLogo: "",
    serviceCode: [],
    locationAddress: [],
    locationName: "",
    locationPriceStart: 0,
    locationPriceEnd: 0,
    locationPriceAfterDeal: 0,
    locationStatus: 0,
  });

  const locationMutation = useMutation({
    mutationFn: (payload: LocationDto) => createLocation(payload),
    onSuccess: (data) => {
      setStep(RENTER_STEP.SUCCESS);
      showNotification(data.message, NOTI_SUCCESS);
    },
    onError: (error) => {
      let message = DEFAULT_MESSAGE;
      if (isAxiosError(error)) {
        const apiMessage = error.response?.data?.message;
        if (typeof apiMessage === "string") {
          message = apiMessage;
        } else if (Array.isArray(apiMessage) && apiMessage[0]) {
          message = apiMessage[0];
        }
      }
      showNotification(message, NOTI_ERROR);
    },
    onMutate: () => {
      setLoading(true);
    },
    onSettled: () => {
      setLoading(false);
    },
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
                  locationLogo: value.locationLogo,
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
                      addressPortal: value.addressPortal,
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
                  serviceCode: value,
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
            setData(value);
            locationMutation.mutate(value);
          }}
          onCancel={() => {
            setStep(RENTER_STEP.FILL_OWNER);
          }}
        />
      </div>
    );
  } else if (step === RENTER_STEP.SUCCESS) {
    return (
      <div className="renter">
        <LocationCreateSucees
          step={step}
          data={data}
          onSubmit={(value: any) => {}}
          onCancel={() => {
            setStep(RENTER_STEP.FILL_OWNER);
          }}
        />
      </div>
    );
  }
};
