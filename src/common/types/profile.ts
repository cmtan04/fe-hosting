export interface ProfileItem {
  key: number;
  icon: any;
  label: string;
  href: string;
}

export interface ProfileLocationFilter {
  searchValue?: string;
  locationName?: string;
  ownerName?: string;
  ownerEmail?: string;
  hasRent?: number;
  renderName?: string;
  renderEmail?: string;
  locationRate?: number;
  locationType?: string;
  typeName?: string;
  addressLong?: string;
  addressLat?: string;
  fullAddress?: string;
  addressName?: string;
  addressWard?: string;
  addressDistrict?: string;
  addressCity?: string;
  addressProvince?: string;
  addressCountry?: string;
  addressRegion?: string;
  addressType?: string;
  page?: number;
  limit?: number;
}
