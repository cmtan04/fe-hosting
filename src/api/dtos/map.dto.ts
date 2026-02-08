export interface MapAddressDto {
  lat: number;
  long: number;
  fullAddress: string;
  addressWard: string;
  addressDistrict: string;
  addressCity: string;
  addressProvince: string;
  addressCountry: string;
  addressPostal: string;
  addressLat: string;
  addressLong: string;
  addressRegion: string;
}

export interface CreateMapAddressDto {
  lat: number;
  long: number;
  fullAddress?: string;
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
  static fromNominatim(
    data: NominatimResponseDto,
    lat: number,
    lng: number,
  ): MapAddressDto {
    const address = data.address || {};

    return {
      lat,
      long: lng,
      fullAddress: data.display_name || "",
      addressWard:
        address.suburb || address.neighbourhood || address.quarter || "",
      addressDistrict: address.city_district || address.county || "",
      addressCity: address.city || address.town || address.village || "",
      addressProvince: address.state || address.province || "",
      addressCountry: address.country || "",
      addressPostal: address.postcode || "",
      addressLat: lat.toString(),
      addressLong: lng.toString(),
      addressRegion: address.region || address.state_district || "",
    };
  }

  static createEmpty(lat: number, lng: number): MapAddressDto {
    return {
      lat,
      long: lng,
      fullAddress: "",
      addressWard: "",
      addressDistrict: "",
      addressCity: "",
      addressProvince: "",
      addressCountry: "",
      addressPostal: "",
      addressLat: lat.toString(),
      addressLong: lng.toString(),
      addressRegion: "",
    };
  }

  static toDisplayString(address: MapAddressDto): string {
    const parts = [
      address.addressWard,
      address.addressDistrict,
      address.addressCity,
      address.addressProvince,
      address.addressCountry,
    ].filter(Boolean);

    return parts.join(", ") || address.fullAddress;
  }

  static isValid(address: Partial<MapAddressDto>): boolean {
    return !!(
      address.lat &&
      address.long &&
      (address.fullAddress || address.addressCity || address.addressProvince)
    );
  }
}

export const AddressFieldLabels = {
  fullAddress: "Địa chỉ đầy đủ",
  addressWard: "Phường/Xã",
  addressDistrict: "Quận/Huyện",
  addressCity: "Thành phố",
  addressProvince: "Tỉnh/Thành",
  addressCountry: "Quốc gia",
  addressPostal: "Mã bưu điện",
  addressLat: "Vĩ độ",
  addressLong: "Kinh độ",
  addressRegion: "Khu vực",
} as const;

export type AddressFieldKey = keyof typeof AddressFieldLabels;
