import type {
  CreateLocationRequestDto,
  LocationServiceSelectionDto,
} from "../../api/dtos/location.dto";
import {
  DEFAULT_LOCATION_LATITUDE,
  DEFAULT_LOCATION_LONGITUDE,
} from "../mapAddress/locationDefaults";
import {
  mapEditableMediaToRequest,
  type EditableLocationMediaItem,
} from "./media";

export interface CreateLocationDraft {
  basicInfo: {
    typeCode: string;
    locationName: string;
    description: string;
    note: string;
    area?: number;
    basePrice?: number;
    finalPrice?: number;
    hasTimeLimit: boolean;
    availableFrom?: string;
    availableTo?: string;
    media: EditableLocationMediaItem[];
  };
  address: {
    addressDetail: string;
    fullAddress: string;
    ward: string;
    city: string;
    country: string;
    region: string;
    latitude: number;
    longitude: number;
    description: string;
    note: string;
  };
  services: LocationServiceSelectionDto[];
}

export const createEmptyLocationDraft = (): CreateLocationDraft => ({
  basicInfo: {
    typeCode: "",
    locationName: "",
    description: "",
    note: "",
    area: undefined,
    basePrice: undefined,
    finalPrice: undefined,
    hasTimeLimit: false,
    availableFrom: undefined,
    availableTo: undefined,
    media: [],
  },
  address: {
    addressDetail: "",
    fullAddress: "",
    ward: "",
    city: "",
    country: "",
    region: "",
    latitude: DEFAULT_LOCATION_LATITUDE,
    longitude: DEFAULT_LOCATION_LONGITUDE,
    description: "",
    note: "",
  },
  services: [],
});

export const createCreateLocationRequestFromDraft = (
  draft: CreateLocationDraft,
): CreateLocationRequestDto => ({
  typeCode: draft.basicInfo.typeCode,
  name: draft.basicInfo.locationName,
  description: draft.basicInfo.description || undefined,
  note: draft.basicInfo.note || undefined,
  area: draft.basicInfo.area,
  pricing: {
    priceStart: Number(draft.basicInfo.basePrice ?? 0),
    priceEnd: Number(draft.basicInfo.finalPrice ?? draft.basicInfo.basePrice ?? 0),
    priceAfterDeal: Number(draft.basicInfo.finalPrice ?? 0),
  },
  availability: draft.basicInfo.hasTimeLimit
    ? {
        hasTimeLimit: true,
        availableFrom: draft.basicInfo.availableFrom,
        availableTo: draft.basicInfo.availableTo,
        isRented: false,
      }
    : {
        hasTimeLimit: false,
        isRented: false,
  },
  primaryAddress: {
    addressDetail: draft.address.addressDetail,
    fullAddress: draft.address.fullAddress,
    ward: draft.address.ward,
    city: draft.address.city,
    country: draft.address.country,
    region: draft.address.region,
    latitude: draft.address.latitude,
    longitude: draft.address.longitude,
    description: draft.address.description || undefined,
    note: draft.address.note || undefined,
  },
  services: draft.services.map((service) =>
    service.serviceCode
      ? {
          serviceCode: service.serviceCode,
          name: service.name,
          description: service.description,
          pricingType: service.pricingType ?? "FULL",
          customPrice: Number(service.customPrice ?? 0),
        }
      : {
          ...service,
          pricingType: service.pricingType ?? "FULL",
          customPrice: Number(service.customPrice ?? 0),
        },
  ),
  media: mapEditableMediaToRequest(draft.basicInfo.media),
});

export const mapDraftToCreateLocationRequest = (
  draft: CreateLocationDraft,
): CreateLocationRequestDto => createCreateLocationRequestFromDraft(draft);
