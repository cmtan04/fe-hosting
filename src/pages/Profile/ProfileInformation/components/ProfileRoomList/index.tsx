import { Col } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { LocationCard } from "../../../../Location/components/LocationCard";
import type { LocationDto } from "@api/dtos/location.dto";
import "./style.scss";

interface ProfileRoomListProps {
  title: string;
  rooms: LocationDto[];
  isLoading: boolean;
  isError: boolean;
  totalItems: number;
  loadingText: string;
  errorText: string;
  emptyText: string;
  onCardClick: (code: string) => void;
  onFavouriteToggle?: (code: string) => void;
  onEdit?: (code: string) => void;
  isFavourite?: (room: LocationDto) => boolean;
  canEdit?: (room: LocationDto) => boolean;
  getPrice?: (room: LocationDto) => number | undefined;
  showEdit?: boolean;
  onClose?: () => void;
}

export const ProfileRoomList = ({
  title,
  rooms,
  isLoading,
  isError,
  totalItems,
  loadingText,
  errorText,
  emptyText,
  onCardClick,
  onFavouriteToggle,
  onEdit,
  isFavourite,
  canEdit,
  getPrice,
  showEdit,
  onClose,
}: ProfileRoomListProps) => {
  const resolvePrice = (room: LocationDto) =>
    getPrice ? getPrice(room) : room.locationPriceAfterDeal;

  const resolveFavouriteState = (room: LocationDto) =>
    isFavourite ? isFavourite(room) : false;

  const resolveShowEdit = (room: LocationDto) =>
    Boolean(showEdit && (canEdit ? canEdit(room) : true));

  return (
    <Col span={24} className="profile__room-list">
      <div className="room-list-header">
        <h2>
          {title} ({totalItems})
        </h2>
        {onClose && (
          <button
            type="button"
            className="room-list-close"
            onClick={onClose}
            aria-label="Đóng danh sách phòng đã thích"
          >
            <CloseOutlined />
          </button>
        )}
      </div>

      <div className="room-list-content">
        {isLoading && <p className="room-list-status">{loadingText}</p>}
        {isError && <p className="room-list-status">{errorText}</p>}
        {!isLoading && !isError && rooms?.length === 0 && (
          <p className="room-list-empty">{emptyText}</p>
        )}
        {!isLoading &&
          !isError &&
          rooms?.map((room) => (
            <LocationCard
              key={room.locationCode}
              code={room.locationCode}
              typeName={room.typeName}
              name={room.locationName}
              description={room.locationDescription}
              address={room.address?.[0]?.fullAddress}
              rate={room.locationRate}
              price={resolvePrice(room)}
              image={room.locationLogo}
              isFavourite={resolveFavouriteState(room)}
              showEdit={resolveShowEdit(room)}
              onFavouriteToggle={onFavouriteToggle}
              onEdit={onEdit}
              onClick={onCardClick}
            />
          ))}
      </div>
    </Col>
  );
};
