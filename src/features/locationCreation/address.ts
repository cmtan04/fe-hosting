import type { MapAddressDto } from "../../api/dtos/map.dto";
import type {
  AddressDto,
  LocationAddressDto,
} from "../../api/dtos/location.dto";
import type { CreateLocationDraft } from "./types";
import {
  buildLocationFullAddress,
  createDraftAddressFromMapResult,
  createEmptyResolvedMapAddress,
  createMapViewDataFromDraftAddress,
  getRegionByCity,
  mapResolvedAddressToLocationAddress,
  normalizeLocationAddress,
} from "../mapAddress/address";
import {
  DEFAULT_LOCATION_LATITUDE,
  DEFAULT_LOCATION_LONGITUDE,
} from "../mapAddress/locationDefaults";

export {
  buildLocationFullAddress,
  getRegionByCity,
  normalizeLocationAddress,
} from "../mapAddress/address";
export {
  DEFAULT_LOCATION_LATITUDE,
  DEFAULT_LOCATION_LONGITUDE,
} from "../mapAddress/locationDefaults";

export const createEmptyLocationAddress = (): CreateLocationDraft["address"] => ({
  ...createEmptyResolvedMapAddress(),
  description: "",
  note: "",
});

export const createEmptyPrimaryAddress = (): LocationAddressDto =>
  mapResolvedAddressToLocationAddress(createEmptyResolvedMapAddress());

export const mapDraftAddressToMapData = (
  address: Partial<CreateLocationDraft["address"]>,
): MapAddressDto => createMapViewDataFromDraftAddress(address);

export const mapMapAddressToDraftAddress = (
  value: MapAddressDto,
  current?: Partial<CreateLocationDraft["address"]>,
): CreateLocationDraft["address"] => createDraftAddressFromMapResult(value, current);

export const isLegacyAddress = (
  address: AddressDto | LocationAddressDto,
): address is AddressDto => "addressName" in address;

export const mapPrimaryAddressToMapData = (
  address: LocationAddressDto,
): MapAddressDto =>
  createMapViewDataFromDraftAddress({
    addressDetail: address.addressDetail ?? "",
    fullAddress: address.fullAddress,
    ward: address.ward,
    city: address.city,
    country: address.country,
    region: address.region,
    latitude: Number(address.latitude),
    longitude: Number(address.longitude),
  });
