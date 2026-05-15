import { useProfileInformation } from "./hooks/useProfileInformation";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileForm } from "./components/ProfileForm";
import { AddressModal } from "./components/AddressModal";
import { Col, Row } from "antd";
import { ProfileColumn } from "./components/ProfileColumn";
import { ProfileRoomList } from "./components/ProfileRoomList";
import { useProfileRoomList } from "./hooks/useProfileRoomList";
import { useFavoriteRoomList } from "./hooks/useFavoriteRoomList";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "@router/Route";
import { isFavoriteLocation } from "@common/utils/favoriteLocations";
import "./style.scss";

export const ProfileInformation = () => {
  const [activeRoomView, setActiveRoomView] = useState<"owned" | "favorite">(
    "owned",
  );
  const navigate = useNavigate();
  const {
    form,
    user,
    url,
    coverUrl,
    showModal,
    setShowModal,
    mapData,
    resolveCoordinates,
    searchState,
    isUploadingAvatar,
    isUploadingCover,
    handleFileChange,
    handleCoverFileChange,
    onSubmit,
    isEditing,
    setIsEditing,
  } = useProfileInformation();

  const ownedRoomList = useProfileRoomList(user?.userCode);
  const favoriteRoomList = useFavoriteRoomList();

  const handleCardClick = (code: string) => {
    const url = ROUTER_PATH.LOCATION_DETAIL.replace(":code", code);
    navigate(url, { state: { code } });
  };

  const handleEdit = (code: string) => {
    navigate(ROUTER_PATH.PROFILE_LOCATION_DETAIL, {
      state: { locationCode: code },
    });
  };

  const handleToggleRoomView = () => {
    setActiveRoomView((currentView) =>
      currentView === "owned" ? "favorite" : "owned",
    );
  };

  const handleCloseFavoriteView = () => {
    setActiveRoomView("owned");
  };

  let roomContent;

  if (isEditing) {
    roomContent = (
      <ProfileForm
        form={form}
        onFinish={() => {
          onSubmit();
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
        onOpenAddressModal={() => setShowModal(true)}
      />
    );
  } else {
    roomContent =
      activeRoomView === "owned" ? (
        <ProfileRoomList
          title="Phòng của bạn"
          rooms={ownedRoomList.rooms}
          isLoading={ownedRoomList.isLoading}
          isError={ownedRoomList.isError}
          totalItems={ownedRoomList.totalItems}
          loadingText="Đang tải danh sách phòng..."
          errorText="Không thể tải danh sách phòng."
          emptyText="Bạn chưa có phòng nào."
          onCardClick={handleCardClick}
          isFavourite={(room) => isFavoriteLocation(room.locationCode)}
          showEdit
          onEdit={handleEdit}
        />
      ) : (
        <ProfileRoomList
          title="Phòng đã thích"
          rooms={favoriteRoomList.rooms}
          isLoading={favoriteRoomList.isLoading}
          isError={favoriteRoomList.isError}
          totalItems={favoriteRoomList.totalItems}
          loadingText="Đang tải danh sách đã thích..."
          errorText="Không thể tải danh sách đã thích."
          emptyText="Bạn chưa lưu phòng nào vào danh sách yêu thích."
          onCardClick={handleCardClick}
          onFavouriteToggle={favoriteRoomList.handleRemoveFavorite}
          getPrice={(room) => room.locationPrice || room.locationPriceAfterDeal}
          isFavourite={() => true}
          showEdit
          canEdit={(room) => room.ownerCode === user?.userCode}
          onEdit={handleEdit}
          onClose={handleCloseFavoriteView}
        />
      );
  }

  return (
    <div className="profile__information">
      <ProfileHeader
        user={user}
        url={url}
        coverUrl={coverUrl}
        isUploadingAvatar={isUploadingAvatar}
        isUploadingCover={isUploadingCover}
        onAvatarChange={handleFileChange}
        onCoverChange={handleCoverFileChange}
        roomViewActionLabel={"Xem phòng đã thích"}
        onRoomViewAction={handleToggleRoomView}
      />

      <Row gutter={[16, 16]} className="profile__information-body">
        <Col xs={24} lg={8}>
          <ProfileColumn user={user} onClick={() => setIsEditing(true)} />
        </Col>
        <Col xs={24} lg={16}>
          {roomContent}
          <AddressModal
            open={showModal}
            onCancel={() => setShowModal(false)}
            mapData={{
              lat: mapData.lat,
              long: mapData.long,
            }}
            searchState={searchState}
            onCoordinateSelect={resolveCoordinates}
          />
        </Col>
      </Row>
    </div>
  );
};
