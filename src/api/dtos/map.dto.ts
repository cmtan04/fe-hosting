import {
  buildAddressDetailFromNominatim,
  createEmptyMapAddress,
  createFullAddressFromNominatim,
  createMapAddressFromNominatim,
} from "../../features/mapAddress/address";

export interface MapAddressDto {
  lat: number;
  long: number;
  addressDetail: string;
  fullAddress: string;
  addressWard: string;
  addressCity: string;
  addressCountry: string;
  addressLat: string;
  addressLong: string;
  addressRegion: string;
}

export interface CreateMapAddressDto {
  lat: number;
  long: number;
  addressDetail?: string;
  fullAddress: string;
  addressWard?: string;
  addressDistrict?: string;
  addressCity?: string;
  addressProvince?: string;
  addressCountry?: string;
  addressPostal?: string;
  addressRegion?: string;
}

export interface NominatimResponseDto {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    tourism?: string;
    office?: string;
    residential?: string;
    amenity?: string;
    shop?: string;
    building?: string;
    house_number?: string;
    road?: string;
    pedestrian?: string;
    hamlet?: string;
    suburb?: string;
    neighbourhood?: string;
    quarter?: string;
    village?: string;
    city_district?: string;
    county?: string;
    city?: string;
    town?: string;
    state?: string;
    province?: string;
    region?: string;
    state_district?: string;
    country?: string;
    postcode?: string;
  };
  [key: string]: any;
}

export class MapAddressMapper {
  private static buildAddressDetail(data: NominatimResponseDto): string {
    return buildAddressDetailFromNominatim(data);
  }

  private static buildFullAddress(data: NominatimResponseDto): string {
    return createFullAddressFromNominatim(data);
  }

  static fromNominatim(
    data: NominatimResponseDto,
    lat: number,
    lng: number,
  ): MapAddressDto {
    return createMapAddressFromNominatim(data, lat, lng);
  }

  static createEmpty(lat: number, lng: number): MapAddressDto {
    return createEmptyMapAddress(lat, lng);
  }

  static toDisplayString(address: MapAddressDto): string {
    const parts = [
      address.addressDetail,
      address.addressWard,
      address.addressCity,
      address.addressCountry,
    ].filter(Boolean);

    return parts.join(", ") || address.fullAddress;
  }

  static isValid(address: Partial<MapAddressDto>): boolean {
    return !!(
      address.lat &&
      address.long &&
      (address.fullAddress || address.addressCity)
    );
  }
}

export const AddressFieldLabels = {
  fullAddress: "Địa chỉ đầy đủ",
  addressWard: "Phường/Xã",
  addressDistrict: "Quận/Huyện",
  addressCity: "Tỉnh/Thành phố",
  addressCountry: "Quốc gia",
  addressPostal: "Mã bưu điện",
  addressLat: "Vĩ độ",
  addressLong: "Kinh độ",
  addressRegion: "Khu vực",
} as const;

export type AddressFieldKey = keyof typeof AddressFieldLabels;
