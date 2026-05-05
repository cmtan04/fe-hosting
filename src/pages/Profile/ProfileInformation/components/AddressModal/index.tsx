import { Modal } from "antd";
import { MapViewCommon } from "@components/MapViewCommon";
import "./style.scss";

interface AddressModalProps {
  open: boolean;
  onCancel: () => void;
  mapData: { lat: number; long: number };
  searchState: any;
  onCoordinateSelect: (value: any) => Promise<void>;
}

export const AddressModal = ({
  open,
  onCancel,
  mapData,
  searchState,
  onCoordinateSelect,
}: AddressModalProps) => {
  return (
    <Modal
      open={open}
      footer={false}
      onCancel={onCancel}
      afterOpenChange={(visible) => {
        if (visible) {
          setTimeout(() => {
            globalThis.dispatchEvent(new Event("resize"));
          }, 0);
        }
      }}
      className="profile__information-modal"
    >
      <div className="profile__information-modal-body">
        <MapViewCommon
          center={{
            lat: mapData.lat,
            lng: mapData.long,
          }}
          searchState={searchState}
          onCoordinateSelect={onCoordinateSelect}
        />
      </div>
    </Modal>
  );
};
