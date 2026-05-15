import type {
  CreateLocationRequestDto,
  LocationDto,
  LocationServiceSelectionDto,
} from "../../api/dtos/location.dto";
import {
  DEFAULT_LOCATION_LATITUDE,
  DEFAULT_LOCATION_LONGITUDE,
} from "../mapAddress/locationDefaults";
import {
  mapLocationMediaToEditable,
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
    price?: number;
    priceUnit: string;
    hasTimeLimit: boolean;
    availableFrom?: string;
    availableTo?: string;
    cancellationFeePercent?: number;
    rescheduleFeePercent?: number;
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
    price: undefined,
    priceUnit: "tháng",
    hasTimeLimit: false,
    availableFrom: undefined,
    availableTo: undefined,
    cancellationFeePercent: 0,
    rescheduleFeePercent: 0,
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
  cancellationFeePercent: draft.basicInfo.cancellationFeePercent,
  rescheduleFeePercent: draft.basicInfo.rescheduleFeePercent,
  pricing: {
    price: Number(draft.basicInfo.price ?? 0),
    priceUnit: draft.basicInfo.priceUnit,
    priceAfterDeal: Number(draft.basicInfo.price ?? 0),
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
          isFree: service.isFree ?? Number(service.basePrice ?? 0) <= 0,
          basePrice: Number(service.basePrice ?? 0),
          unit: service.unit ?? "Trọn gói",
          quantity: Number(service.quantity ?? 1),
        }
      : {
          name: service.name,
          description: service.description,
          isFree: service.isFree ?? Number(service.basePrice ?? 0) <= 0,
          basePrice: Number(service.basePrice ?? 0),
          unit: service.unit ?? "Trọn gói",
          quantity: Number(service.quantity ?? 1),
        },
  ),
  media: mapEditableMediaToRequest(draft.basicInfo.media),
});

export const mapDraftToCreateLocationRequest = (
  draft: CreateLocationDraft,
): CreateLocationRequestDto => createCreateLocationRequestFromDraft(draft);

export const mapLocationToDraft = (location: LocationDto): CreateLocationDraft => {
  const primaryAddress = location.address?.[0];

  return {
    basicInfo: {
      typeCode: location.typeCode,
      locationName: location.locationName,
      description: location.locationDescription ?? "",
      note: location.locationNote ?? "",
      area: location.locationArea ?? undefined,
      price: Number(location.locationPrice ?? 0),
      priceUnit: location.locationPriceUnit || "tháng",
      hasTimeLimit: Boolean(location.minTime || location.maxTime),
      availableFrom: location.minTime,
      availableTo: location.maxTime,
      cancellationFeePercent: location.cancellationFeePercent ?? 0,
      rescheduleFeePercent: location.rescheduleFeePercent ?? 0,
      media: mapLocationMediaToEditable(
        location.media,
        location.locationLogo || undefined,
      ),
    },
    address: {
      addressDetail: primaryAddress?.addressName ?? "",
      fullAddress: primaryAddress?.fullAddress ?? "",
      ward: primaryAddress?.addressWard ?? "",
      city: primaryAddress?.addressCity || primaryAddress?.addressProvince || "",
      country: primaryAddress?.addressCountry ?? "",
      region: primaryAddress?.addressRegion ?? "",
      latitude: Number(primaryAddress?.addressLat ?? DEFAULT_LOCATION_LATITUDE),
      longitude: Number(primaryAddress?.addressLong ?? DEFAULT_LOCATION_LONGITUDE),
      description: primaryAddress?.addressDescription ?? "",
      note: primaryAddress?.addressNote ?? "",
    },
    services:
      location.services?.map((service) => {
        const basePrice = Number(service.basePrice ?? service.servicePrice ?? 0);

        return {
          serviceCode: service.serviceCode,
          name: service.serviceName || service.name,
          description: service.description || service.serviceDescription,
          isFree: service.isFree ?? basePrice <= 0,
          basePrice,
          unit: service.unit ?? "Trọn gói",
          quantity: Number(service.quantity ?? 1),
        };
      }) ?? [],
  };
};
