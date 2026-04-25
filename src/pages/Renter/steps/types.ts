import type dayjs from "dayjs";
import type {
  LocationServiceSelectionDto,
  LocationTypeDto,
  ServiceDto,
  ServicePricingType,
} from "../../../api/dtos/location.dto";
import type { CreateLocationDraft } from "../../../features/locationCreation/types";

export interface SummaryPanelRow {
  label: string;
  value: string;
}

export interface BasicInfoStepFormValues {
  typeCode: string;
  locationName: string;
  description?: string;
  note?: string;
  area?: string;
  basePrice?: string;
  finalPrice?: string;
  hasTimeLimit?: boolean;
  availableFrom?: dayjs.Dayjs;
  availableTo?: dayjs.Dayjs;
}

export interface BasicInfoStepSubmitValue {
  typeCode: string;
  locationName: string;
  description?: string;
  note?: string;
  area?: number;
  basePrice?: number;
  finalPrice?: number;
  hasTimeLimit: boolean;
  availableFrom?: string;
  availableTo?: string;
}

export interface BasicInfoDraftPatch {
  typeCode?: string;
  locationName?: string;
  description?: string;
  note?: string;
  area?: number;
  basePrice?: number;
  finalPrice?: number;
  hasTimeLimit?: boolean;
  availableFrom?: string;
  availableTo?: string;
}

export interface AddressDraftPatch {
  addressDetail?: string;
  fullAddress?: string;
  ward?: string;
  city?: string;
  country?: string;
  region?: string;
  description?: string;
  note?: string;
  latitude?: number;
  longitude?: number;
}

export interface ServicesDraftPatch {
  services: LocationServiceSelectionDto[];
}

export interface AddressAndServicesStepSubmitValue {
  addressDetail: string;
  fullAddress: string;
  ward?: string;
  city?: string;
  country?: string;
  region?: string;
  description?: string;
  note?: string;
  latitude: number;
  longitude: number;
  services: LocationServiceSelectionDto[];
}

export interface BasicInfoStepProps {
  draft: CreateLocationDraft;
  typeList?: LocationTypeDto[];
  isUploading: boolean;
  currentStep: number;
  onNext: (value: BasicInfoStepSubmitValue) => void;
  onStepChange: (nextStep: number) => void;
  onDraftChange: (patch: BasicInfoDraftPatch) => void;
  onCancel: () => void;
  onUpload: (files: FileList) => void;
  onRemoveMedia: (id: string) => void;
  onSetAvatar: (id: string) => void;
}

export interface AddressAndServicesStepProps {
  draft: CreateLocationDraft;
  services?: ServiceDto[];
  currentStep: number;
  onBack: () => void;
  onCancel: () => void;
  onNext: (value: AddressAndServicesStepSubmitValue) => void;
  onStepChange: (nextStep: number) => void;
  onDraftChange: (
    patch: AddressDraftPatch,
    services: ServicesDraftPatch["services"],
  ) => void;
}

export interface ConfirmStepProps {
  draft: CreateLocationDraft;
  typeList?: LocationTypeDto[];
  services?: ServiceDto[];
  currentStep: number;
  onBack: () => void;
  onCancel: () => void;
  onSubmit: () => void;
  onStepChange: (nextStep: number) => void;
  isSubmitting: boolean;
}

export interface CustomServiceComposerState {
  name: string;
  description: string;
  chargeType: "FREE" | "PAID";
  pricingType: ServicePricingType;
  price: string;
}
