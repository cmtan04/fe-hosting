import type { CreateLocationRequestDto } from "../../api/dtos/location.dto";

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
    logoUrl: string;
  };
  address: {
    name: string;
    fullAddress: string;
    ward: string;
    district: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;
    region: string;
    latitude: number;
    longitude: number;
    description: string;
    note: string;
  };
  serviceCodes: string[];
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
    logoUrl: "",
  },
  address: {
    name: "",
    fullAddress: "",
    ward: "",
    district: "",
    city: "",
    province: "",
    country: "",
    postalCode: "",
    region: "",
    latitude: 21.0285,
    longitude: 105.8542,
    description: "",
    note: "",
  },
  serviceCodes: [],
});

export const mapDraftToCreateLocationRequest = (
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
    name: draft.address.name,
    fullAddress: draft.address.fullAddress,
    ward: draft.address.ward,
    district: draft.address.district,
    city: draft.address.city,
    province: draft.address.province,
    country: draft.address.country,
    postalCode: draft.address.postalCode,
    region: draft.address.region,
    latitude: draft.address.latitude,
    longitude: draft.address.longitude,
    description: draft.address.description || undefined,
    note: draft.address.note || undefined,
  },
  serviceCodes: draft.serviceCodes,
  media: draft.basicInfo.logoUrl
    ? [
        {
          url: draft.basicInfo.logoUrl,
          type: "IMAGE",
          displayOrder: 1,
          isLogo: true,
        },
      ]
    : [],
});
