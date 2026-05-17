import type {
  UserAddressDto,
  UserProfileResponseDto,
} from "../../api/dtos/user.dto";
import type {
  MapAddressDto,
  NominatimResponseDto,
} from "../../api/dtos/map.dto";
import type {
  AddressDto,
  LocationAddressDto,
} from "../../api/dtos/location.dto";
import type { CreateLocationDraft } from "../locationCreation/types";
import {
  DEFAULT_LOCATION_LATITUDE,
  DEFAULT_LOCATION_LONGITUDE,
} from "./locationDefaults";

export interface ResolvedMapAddress {
  addressDetail: string;
  fullAddress: string;
  ward: string;
  city: string;
  country: string;
  region: string;
  latitude: number;
  longitude: number;
}

const trimText = (value?: string | null) => value?.trim() ?? "";

const coerceCoordinate = (
  value: number | string | undefined | null,
  fallback: number,
) => {
  const parsed =
    typeof value === "number" ? value : Number.parseFloat(String(value ?? ""));

  return Number.isFinite(parsed) ? parsed : fallback;
};

const uniqueParts = (parts: Array<string | undefined>) =>
  parts
    .map((part) => trimText(part))
    .filter(Boolean)
    .filter(
      (part, index, values) =>
        values.findIndex((value) => value === part) === index,
    );

export const buildLocationFullAddress = (value: {
  addressDetail?: string;
  ward?: string;
  city?: string;
  country?: string;
}) =>
  uniqueParts([
    value.addressDetail,
    value.ward,
    value.city,
    value.country,
  ]).join(", ");

const normalizeCityName = (value?: string): string =>
  trimText(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^(thanh\s*pho|tp\.?|tinh)\s+/i, "")
    .replace(/\s+/g, " ");

const CITY_TO_REGION = [
  {
    label: "Miền Bắc",
    cities: [
      "Hà Nội",
      "Hải Phòng",
      "Tuyên Quang",
      "Lào Cai",
      "Thái Nguyên",
      "Phú Thọ",
      "Bắc Ninh",
      "Hưng Yên",
      "Ninh Bình",
      "Lai Châu",
      "Điện Biên",
      "Sơn La",
      "Lạng Sơn",
      "Quảng Ninh",
      "Cao Bằng",
    ],
  },
  {
    label: "Miền Trung",
    cities: [
      "Huế",
      "Đà Nẵng",
      "Thanh Hóa",
      "Nghệ An",
      "Hà Tĩnh",
      "Quảng Trị",
      "Quảng Ngãi",
      "Gia Lai",
      "Khánh Hòa",
      "Lâm Đồng",
      "Đắk Lắk",
    ],
  },
  {
    label: "Miền Nam",
    cities: [
      "Thành Phố Hồ Chí Minh",
      "Cần Thơ",
      "Đồng Nai",
      "Tây Ninh",
      "Vĩnh Long",
      "An Giang",
      "Đồng Tháp",
      "Cà Mau",
      "Thành Phố Thủ Đức",
    ],
  },
] as const;

export const getRegionByCity = (city?: string): string => {
  const normalizedCity = normalizeCityName(city);

  if (!normalizedCity) {
    return "";
  }

  const matchedRegion = CITY_TO_REGION.find((region) =>
    region.cities.some((cityName) => {
      const normalizedCandidate = normalizeCityName(cityName);

      return (
        normalizedCandidate === normalizedCity ||
        normalizedCandidate.includes(normalizedCity) ||
        normalizedCity.includes(normalizedCandidate)
      );
    }),
  );

  return matchedRegion?.label ?? "";
};

export const createEmptyResolvedMapAddress = (
  overrides?: Partial<ResolvedMapAddress>,
): ResolvedMapAddress => ({
  addressDetail: "",
  fullAddress: "",
  ward: "",
  city: "",
  country: "",
  region: "",
  latitude: DEFAULT_LOCATION_LATITUDE,
  longitude: DEFAULT_LOCATION_LONGITUDE,
  ...overrides,
});

export const createEmptyMapAddress = (
  lat = DEFAULT_LOCATION_LATITUDE,
  lng = DEFAULT_LOCATION_LONGITUDE,
): MapAddressDto => ({
  lat,
  long: lng,
  addressDetail: "",
  fullAddress: "",
  addressWard: "",
  addressCity: "",
  addressCountry: "",
  addressLat: String(lat),
  addressLong: String(lng),
  addressRegion: "",
});

export const buildAddressDetailFromNominatim = (
  data: NominatimResponseDto,
): string => {
  const address = data.address || {};
  const primaryLine = [
    address.tourism ||
    address.office ||
      address.amenity ||
      address.residential ||
      address.shop ||
      address.building,
    address.house_number ? `số ${address.house_number}` : undefined,
    address.road || address.pedestrian,
  ]
    .filter(Boolean)
    .join(", ")
    .trim();

  return primaryLine || " ";
};

export const createFullAddressFromNominatim = (
  data: NominatimResponseDto,
): string => {
  const address = data.address || {};

  return (
    uniqueParts([
      buildAddressDetailFromNominatim(data),
      address.suburb || address.neighbourhood || address.quarter,
      address.city_district || address.county,
      address.city || address.town || address.village,
      address.state || address.province,
      address.country,
    ]).join(", ") || trimText(data.display_name)
  );
};

export const createMapAddressFromNominatim = (
  data: NominatimResponseDto,
  lat: number,
  lng: number,
): MapAddressDto => {
  const address = data.address || {};
  const city = address.city || address.state || address.province || "";

  return {
    lat,
    long: lng,
    addressDetail: buildAddressDetailFromNominatim(data),
    fullAddress: createFullAddressFromNominatim(data),
    addressWard:
      address.suburb ||
      address.neighbourhood ||
      address.quarter ||
      address.city_district ||
      address.county ||
      address.village ||
      "",
    addressCity: city,
    addressCountry: address.country || "",
    addressLat: String(lat),
    addressLong: String(lng),
    addressRegion: address.region || getRegionByCity(city),
  };
};

export const createResolvedAddressFromMapResult = (
  value: MapAddressDto,
  current?: Partial<ResolvedMapAddress>,
): ResolvedMapAddress => {
  const addressDetail =
    trimText(value.addressDetail) || trimText(current?.addressDetail);
  const ward = trimText(value.addressWard) || trimText(current?.ward);
  const city = trimText(value.addressCity) || trimText(current?.city);
  const country = trimText(value.addressCountry) || trimText(current?.country);
  const fullAddress =
    trimText(value.fullAddress) ||
    buildLocationFullAddress({ addressDetail, ward, city, country }) ||
    trimText(current?.fullAddress);

  return createEmptyResolvedMapAddress({
    ...current,
    addressDetail,
    fullAddress,
    ward,
    city,
    country,
    region:
      trimText(value.addressRegion) ||
      getRegionByCity(city) ||
      trimText(current?.region),
    latitude: coerceCoordinate(
      value.lat ?? value.addressLat,
      current?.latitude ?? DEFAULT_LOCATION_LATITUDE,
    ),
    longitude: coerceCoordinate(
      value.long ?? value.addressLong,
      current?.longitude ?? DEFAULT_LOCATION_LONGITUDE,
    ),
  });
};

export const createResolvedAddressFromDraft = (
  address?: Partial<CreateLocationDraft["address"]> | null,
): ResolvedMapAddress =>
  createEmptyResolvedMapAddress({
    addressDetail: trimText(address?.addressDetail),
    fullAddress: trimText(address?.fullAddress),
    ward: trimText(address?.ward),
    city: trimText(address?.city),
    country: trimText(address?.country),
    region: trimText(address?.region) || getRegionByCity(address?.city),
    latitude: coerceCoordinate(address?.latitude, DEFAULT_LOCATION_LATITUDE),
    longitude: coerceCoordinate(address?.longitude, DEFAULT_LOCATION_LONGITUDE),
  });

export const createResolvedAddressFromFormValues = (
  value: Partial<CreateLocationDraft["address"]>,
  current?: Partial<ResolvedMapAddress>,
): ResolvedMapAddress => {
  const nextAddress = createEmptyResolvedMapAddress({
    ...current,
    addressDetail:
      trimText(value.addressDetail) || trimText(current?.addressDetail),
    ward: trimText(value.ward) || trimText(current?.ward),
    city: trimText(value.city) || trimText(current?.city),
    country: trimText(value.country) || trimText(current?.country),
  });

  return {
    ...nextAddress,
    fullAddress:
      trimText(value.fullAddress) ||
      buildLocationFullAddress(nextAddress) ||
      trimText(current?.fullAddress),
    region:
      trimText(value.region) ||
      getRegionByCity(value.city || current?.city) ||
      trimText(current?.region),
    latitude: coerceCoordinate(
      value.latitude,
      current?.latitude ?? DEFAULT_LOCATION_LATITUDE,
    ),
    longitude: coerceCoordinate(
      value.longitude,
      current?.longitude ?? DEFAULT_LOCATION_LONGITUDE,
    ),
  };
};

export const createDraftAddressFromResolved = (
  address: ResolvedMapAddress,
  current?: Partial<CreateLocationDraft["address"]>,
): CreateLocationDraft["address"] => ({
  addressDetail: address.addressDetail,
  fullAddress: address.fullAddress,
  ward: address.ward,
  city: address.city,
  country: address.country,
  region: address.region || getRegionByCity(address.city),
  latitude: address.latitude,
  longitude: address.longitude,
  description: trimText(current?.description),
  note: trimText(current?.note),
});

export const createDraftAddressFromMapResult = (
  value: MapAddressDto,
  current?: Partial<CreateLocationDraft["address"]>,
): CreateLocationDraft["address"] =>
  createDraftAddressFromResolved(
    createResolvedAddressFromMapResult(value, current),
    current,
  );

export const createDraftAddressFromFormValues = (
  value: Partial<CreateLocationDraft["address"]>,
  current?: Partial<CreateLocationDraft["address"]>,
): CreateLocationDraft["address"] => {
  const resolved = createResolvedAddressFromFormValues(value, current);

  return {
    ...createDraftAddressFromResolved(resolved, current),
    description: trimText(value.description) || trimText(current?.description),
    note: trimText(value.note) || trimText(current?.note),
  };
};

export const createAddressFormValuesFromDraft = (
  address?: Partial<CreateLocationDraft["address"]> | null,
) => {
  const resolved = createResolvedAddressFromDraft(address);

  return {
    addressDetail: resolved.addressDetail,
    fullAddress: resolved.fullAddress,
    ward: resolved.ward,
    city: resolved.city,
    country: resolved.country,
    region: resolved.region,
    description: trimText(address?.description),
    note: trimText(address?.note),
  };
};

export const createMapViewDataFromDraftAddress = (
  address?: Partial<CreateLocationDraft["address"]> | null,
): MapAddressDto => {
  const resolved = createResolvedAddressFromDraft(address);

  return {
    lat: resolved.latitude,
    long: resolved.longitude,
    addressLat: String(resolved.latitude),
    addressLong: String(resolved.longitude),
    addressDetail: resolved.addressDetail,
    fullAddress: resolved.fullAddress,
    addressWard: resolved.ward,
    addressCity: resolved.city,
    addressCountry: resolved.country,
    addressRegion: resolved.region,
  };
};

export const mapResolvedAddressToLocationAddress = (
  address: ResolvedMapAddress,
  current?: Partial<LocationAddressDto>,
): LocationAddressDto => ({
  ...current,
  addressCode: current?.addressCode,
  addressDetail: address.addressDetail,
  fullAddress: address.fullAddress,
  ward: address.ward,
  city: address.city,
  country: address.country,
  region: address.region,
  latitude: address.latitude,
  longitude: address.longitude,
  description: current?.description,
  note: current?.note,
  name: current?.name ?? address.addressDetail,
  district: current?.district ?? address.ward,
  province: current?.province ?? address.city,
  postalCode: current?.postalCode ?? "",
});

export const mapDraftAddressToUserAddress = (
  address: CreateLocationDraft["address"],
): UserAddressDto => ({
  fullAddress: address.fullAddress,
  userWard: address.ward,
  userDistrict: address.ward,
  userCity: address.city,
  userProvince: address.city,
  userCountry: address.country,
  userPortal: "",
  userLat: String(address.latitude),
  userLong: String(address.longitude),
});

export const createDraftAddressFromUserAddress = (
  address?: UserAddressDto & UserProfileResponseDto | null,
): CreateLocationDraft["address"] => ({
  addressDetail: "",
  fullAddress: trimText(address?.fullAddress),
  ward: trimText(address?.userWard),
  city: trimText(address?.userCity || address?.userProvince),
  country: trimText(address?.userCountry),
  region: getRegionByCity(address?.userCity || address?.userProvince),
  latitude: coerceCoordinate(address?.userLat, DEFAULT_LOCATION_LATITUDE),
  longitude: coerceCoordinate(address?.userLong, DEFAULT_LOCATION_LONGITUDE),
  description: trimText(address?.userDescription),
  note: trimText(address?.userNote),
});

export const isLegacyAddress = (
  address: AddressDto | LocationAddressDto,
): address is AddressDto => "addressName" in address;

export const normalizeLocationAddress = (
  address?: AddressDto | LocationAddressDto | null,
): LocationAddressDto => {
  if (!address) {
    return mapResolvedAddressToLocationAddress(createEmptyResolvedMapAddress());
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
      region:
        address.addressRegion ||
        getRegionByCity(address.addressCity || address.addressProvince),
      latitude: coerceCoordinate(address.addressLat, DEFAULT_LOCATION_LATITUDE),
      longitude: coerceCoordinate(
        address.addressLong,
        DEFAULT_LOCATION_LONGITUDE,
      ),
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
    region: address.region ?? getRegionByCity(address.city),
    latitude: coerceCoordinate(address.latitude, DEFAULT_LOCATION_LATITUDE),
    longitude: coerceCoordinate(address.longitude, DEFAULT_LOCATION_LONGITUDE),
    description: address.description ?? "",
    note: address.note ?? "",
  };
};
