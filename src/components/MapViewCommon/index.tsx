interface MapViewCommonData {
  lat: number;
  long: number;
  fullAddressText?: string;
}

interface MapViewCommonProps {
  data: MapViewCommonData;
  hasInputSearch?: boolean;
  onMapClick: (e: MapViewCommonData) => void;
}

export const MapViewCommon = () => {
  return <div className="map__view"></div>;
};
