import type dayjs from "dayjs";
import type {
  LocationServiceSelectionDto,
} from "../../api/dtos/location.dto";

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
  price?: string;
  priceUnit?: string;
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
  price?: number;
  priceUnit: string;
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
  price?: number;
  priceUnit?: string;
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

export interface CustomServiceComposerState {
  serviceCode?: string;
  name: string;
  description: string;
  chargeType: "FREE" | "PAID";
  unit: string;
  basePrice: string;
}

