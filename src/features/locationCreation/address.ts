import type { MapAddressDto } from "../../api/dtos/map.dto";
import type {
  AddressDto,
  LocationAddressDto,
} from "../../api/dtos/location.dto";
import type { CreateLocationDraft } from "./types";
import {
  createDraftAddressFromMapResult,
  createEmptyResolvedMapAddress,
  createMapViewDataFromDraftAddress,
  mapResolvedAddressToLocationAddress,
} from "../mapAddress/address";

//Tạo địa chỉ rỗng khi người dùng mới truy cập trang
export const createEmptyLocationAddress =
  (): CreateLocationDraft["address"] => ({
    ...createEmptyResolvedMapAddress(),
    description: "",
    note: "",
  });

//Tạo địa chỉ chính rỗng 
export const createEmptyPrimaryAddress = (): LocationAddressDto =>
  mapResolvedAddressToLocationAddress(createEmptyResolvedMapAddress());

//Map địa chỉ từ draft sang map data
export const mapDraftAddressToMapData = (
  address: Partial<CreateLocationDraft["address"]>,
): MapAddressDto => createMapViewDataFromDraftAddress(address);

//Map địa chỉ từ map data sang draft
export const mapMapAddressToDraftAddress = (
  value: MapAddressDto,
  current?: Partial<CreateLocationDraft["address"]>,
): CreateLocationDraft["address"] =>
  createDraftAddressFromMapResult(value, current);

//Kiểm tra địa chỉ có phải là địa chỉ cũ không
export const isLegacyAddress = (
  address: AddressDto | LocationAddressDto,
): address is AddressDto => "addressName" in address;

//Map địa chỉ chính sang map data
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
