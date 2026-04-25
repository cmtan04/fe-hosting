import {
  MapAddressMapper,
  type MapAddressDto,
} from "../../api/dtos/map.dto";
import type {
  AddressDto,
  LocationAddressDto,
} from "../../api/dtos/location.dto";
import type { CreateLocationDraft } from "./types";

export const DEFAULT_LOCATION_LATITUDE = 21.0285;
export const DEFAULT_LOCATION_LONGITUDE = 105.8542;

export const createEmptyLocationAddress = (): CreateLocationDraft["address"] => ({
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
});

export const createEmptyPrimaryAddress = (): LocationAddressDto => ({
  ...createEmptyLocationAddress(),
});

export const mapDraftAddressToMapData = (
  address: Partial<CreateLocationDraft["address"]>,
): MapAddressDto => ({
  ...MapAddressMapper.createEmpty(
    Number(address.latitude ?? DEFAULT_LOCATION_LATITUDE),
    Number(address.longitude ?? DEFAULT_LOCATION_LONGITUDE),
  ),
  addressDetail: address.addressDetail ?? "",
  fullAddress: address.fullAddress ?? "",
  addressWard: address.ward ?? "",
  addressCity: address.city ?? "",
  addressCountry: address.country ?? "",
  addressRegion: address.region ?? "",
});

export const buildLocationFullAddress = (value: {
  addressDetail?: string;
  ward?: string;
  city?: string;
  country?: string;
}) =>
  [
    value.addressDetail?.trim(),
    value.ward?.trim(),
    value.city?.trim(),
    value.country?.trim(),
  ]
    .filter(Boolean)
    .join(", ");

export const mapMapAddressToDraftAddress = (
  value: MapAddressDto,
  current?: Partial<CreateLocationDraft["address"]>,
): CreateLocationDraft["address"] => {
  const addressDetail = value.addressDetail.trim();

  return {
    ...createEmptyLocationAddress(),
    ...current,
    addressDetail,
    fullAddress: buildLocationFullAddress({
      addressDetail,
      ward: value.addressWard,
      city: value.addressCity,
      country: value.addressCountry,
    }),
    ward: value.addressWard,
    city: value.addressCity,
    country: value.addressCountry,
    region: value.addressCity,
    latitude: Number(value.lat ?? value.addressLat ?? DEFAULT_LOCATION_LATITUDE),
    longitude: Number(
      value.long ?? value.addressLong ?? DEFAULT_LOCATION_LONGITUDE,
    ),
  };
};

export const isLegacyAddress = (
  address: AddressDto | LocationAddressDto,
): address is AddressDto => "addressName" in address;

export const normalizeLocationAddress = (
  address?: AddressDto | LocationAddressDto | null,
): LocationAddressDto => {
  if (!address) {
    return createEmptyPrimaryAddress();
  }

  if (isLegacyAddress(address)) {
    return {
      addressCode: address.addressCode,
      addressDetail: "",
      name: address.addressName ?? "",
      fullAddress: address.fullAddress ?? "",
      ward: address.addressWard ?? "",
      district: address.addressDistrict ?? "",
      city: address.addressCity || address.addressProvince || "",
      province: address.addressProvince ?? "",
      country: address.addressCountry ?? "",
      postalCode: address.addressPortal ?? "",
      region: address.addressRegion || address.addressCity || "",
      latitude: Number(address.addressLat ?? DEFAULT_LOCATION_LATITUDE),
      longitude: Number(address.addressLong ?? DEFAULT_LOCATION_LONGITUDE),
      description: address.addressDescription ?? "",
      note: address.addressNote ?? "",
    };
  }

  return {
    addressCode: address.addressCode,
    addressDetail: address.addressDetail ?? "",
    name: address.name ?? address.addressDetail ?? "",
    fullAddress: address.fullAddress ?? "",
    ward: address.ward ?? "",
    district: address.district ?? address.ward ?? "",
    city: address.city ?? "",
    province: address.province ?? address.city ?? "",
    country: address.country ?? "",
    postalCode: address.postalCode ?? "",
    region: address.region ?? address.city ?? "",
    latitude: Number(address.latitude ?? DEFAULT_LOCATION_LATITUDE),
    longitude: Number(address.longitude ?? DEFAULT_LOCATION_LONGITUDE),
    description: address.description ?? "",
    note: address.note ?? "",
  };
};

export const mapPrimaryAddressToMapData = (
  address: LocationAddressDto,
): MapAddressDto => ({
  lat: Number(address.latitude),
  long: Number(address.longitude),
  addressLat: String(address.latitude),
  addressLong: String(address.longitude),
  addressDetail: address.addressDetail ?? "",
  fullAddress: address.fullAddress,
  addressWard: address.ward,
  addressCity: address.city,
  addressCountry: address.country,
  addressRegion: address.region,
});
