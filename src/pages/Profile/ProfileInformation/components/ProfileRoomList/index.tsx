import { Col } from "antd";
import { LocationCard } from "../../../../Location/components/LocationCard";
import { useProfileRoomList } from "../../hooks/useProfileRoomList";
import { useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "../../../../../router/Route";
import "./style.scss";

interface ProfileRoomListProps {
  userCode?: string;
}

export const ProfileRoomList = ({ userCode }: ProfileRoomListProps) => {
  const { rooms, isLoading, isError, totalItems } = useProfileRoomList(userCode);
  const navigate = useNavigate();

  const handleCardClick = (code: string) => {
    const url = ROUTER_PATH.LOCATION_DETAIL.replace(":code", code);
    navigate(url, { state: { code } });
  };

  const handleEdit = (code: string) => {
    const url = ROUTER_PATH.PROFILE_LOCATION_DETAIL.replace(":code", code);
    navigate(url, { state: { code } });
  };

  return (
    <Col span={24} className="profile__room-list">
      <div className="room-list-header">
        <h2>Phòng của bạn ({totalItems})</h2>
      </div>

      <div className="room-list-content">
        {isLoading && (
          <p className="room-list-status">Đang tải danh sách phòng...</p>
        )}
        {isError && (
          <p className="room-list-status">Không thể tải danh sách phòng.</p>
        )}
        {!isLoading && !isError && rooms?.length === 0 && (
          <p className="room-list-empty">Bạn chưa có phòng nào.</p>
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
              price={room.locationPriceAfterDeal}
              image={room.locationLogo}
              isFavourite={false}
              showEdit={true}
              onEdit={handleEdit}
              onClick={handleCardClick}
            />
          ))}
      </div>
    </Col>

  );
};
