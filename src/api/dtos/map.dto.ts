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
    house_number?: string;
    road?: string;
    pedestrian?: string;
    amenity?: string;
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
    const address = data.address || {};
    const primaryLine = [address.house_number, address.road || address.pedestrian]
      .filter(Boolean)
      .join(" ")
      .trim();

    return (
      primaryLine ||
      address.amenity ||
      address.hamlet ||
      ""
    );
  }

  private static buildFullAddress(data: NominatimResponseDto): string {
    const address = data.address || {};
    const parts = [
      MapAddressMapper.buildAddressDetail(data),
      address.amenity,
      address.hamlet,
      address.suburb || address.neighbourhood || address.quarter,
      address.city_district || address.county,
      address.city || address.town || address.village,
      address.state || address.province,
      address.country,
    ]
      .map((part) => part?.trim())
      .filter(Boolean) as string[];

    const uniqueParts = parts.filter(
      (part, index) => parts.findIndex((value) => value === part) === index,
    );

    return uniqueParts.join(", ") || data.display_name || "";
  }

  static fromNominatim(
    data: NominatimResponseDto,
    lat: number,
    lng: number,
  ): MapAddressDto {
    console.log("nominatim data", data);
    const address = data.address || {};

    return {
      lat,
      long: lng,
      addressDetail: MapAddressMapper.buildAddressDetail(data),
      fullAddress: MapAddressMapper.buildFullAddress(data),
      addressWard:
        address.suburb ||
        address.neighbourhood ||
        address.quarter ||
        address.city_district ||
        address.county ||
        "",
      addressCity:
        address.city ||
        address.town ||
        address.village ||
        address.state ||
        address.province ||
        "",
      addressCountry: address.country || "",
      addressLat: lat.toString(),
      addressLong: lng.toString(),
      addressRegion:
        address.city ||
        address.town ||
        address.village ||
        address.state ||
        address.province ||
        "",
    };
  }

  static createEmpty(lat: number, lng: number): MapAddressDto {
    return {
      lat,
      long: lng,
      addressDetail: "",
      fullAddress: "",
      addressWard: "",
      addressCity: "",
      addressCountry: "",
      addressLat: lat.toString(),
      addressLong: lng.toString(),
      addressRegion: "",
    };
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
  addressCity: "Thành phố",
  addressProvince: "Tỉnh/Thành",
  addressCountry: "Quốc gia",
  addressPostal: "Mã bưu điện",
  addressLat: "Vĩ độ",
  addressLong: "Kinh độ",
  addressRegion: "Khu vực",
} as const;

export type AddressFieldKey = keyof typeof AddressFieldLabels;
