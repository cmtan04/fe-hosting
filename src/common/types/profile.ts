export interface ProfileItem {
  key: number;
  icon: any;
  label: string;
  href: string;
}

export interface ProfileLocationFilter {
  locationName?: string;
  hasRent?: number;
  locationType?: number;
  renderName?: string;
  renderEmail?: string;
  fullAddress?: string;
}
