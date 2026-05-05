import { useProfileInformation } from "./hooks/useProfileInformation";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileForm } from "./components/ProfileForm";
import { AddressModal } from "./components/AddressModal";
import { Row, Col } from "antd";
import { ProfileColumn } from "./components/ProfileColumn";

export const ProfileInformation = () => {
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

  return (
    <div>
      <ProfileHeader
        user={user}
        url={url}
        coverUrl={coverUrl}
        isUploadingAvatar={isUploadingAvatar}
        isUploadingCover={isUploadingCover}
        onAvatarChange={handleFileChange}
        onCoverChange={handleCoverFileChange}
      />

      <Row gutter={[16, 16]}>
        <Col span={8}>
          <ProfileColumn user={user} onClick={() => setIsEditing(true)} />
        </Col>
        <Col span={16}>
          {isEditing && (
            <ProfileForm
              form={form}
              onFinish={() => {
                onSubmit();
                setIsEditing(false);
              }}
              onOpenAddressModal={() => setShowModal(true)}
            />
          )}
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
