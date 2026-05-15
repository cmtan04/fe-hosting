import { Button, Col, Row, Image, Spin } from "antd";
import fallbackAvatar from "@assets/images/profile/icn_profile.svg";
import fallbackCover from "@assets/images/home/home-background2.jpg";
import type { UserProfileResponseDto } from "@api/dtos/user.dto";
import "./style.scss";

interface ProfileHeaderProps {
  user?: UserProfileResponseDto | null;
  url: string;
  coverUrl: string;
  isUploadingAvatar: boolean;
  isUploadingCover: boolean;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  roomViewActionLabel?: string;
  onRoomViewAction?: () => void;
}

export const ProfileHeader = ({
  user,
  url,
  coverUrl,
  isUploadingAvatar,
  isUploadingCover,
  onAvatarChange,
  onCoverChange,
  roomViewActionLabel,
  onRoomViewAction,
}: ProfileHeaderProps) => {
  const headerCover = coverUrl || user?.coverUrl || fallbackCover;
  const headerAvatar = url || user?.avatarUrl || fallbackAvatar;
  const headerName = user?.fullName || "Người dùng";
  const headerSub = user?.username || "";

  return (
    <Col md={24} className="profile__information-header">
      <div className="profile__information-cover">
        <Image
          rootClassName="image-background"
          src={headerCover}
          alt="Ảnh bìa hồ sơ"
          preview={{ mask: "Xem to" }}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {isUploadingCover && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "rgba(255,255,255,0.4)",
              zIndex: 11,
            }}
          >
            <Spin size="large" />
          </div>
        )}
        <div className="blur-blender"></div>
        <label
          htmlFor="upload-cover"
          className="profile__information-cover-upload"
          aria-label="Tải lên ảnh bìa"
          title="Tải lên ảnh bìa"
        >
          <input
            id="upload-cover"
            type="file"
            accept="image/*"
            onChange={onCoverChange}
          />
        </label>
      </div>

      <Row >
        <Col lg={6} md={24} xs={24}>
          <div className="avatar-container">
            <Image
              rootClassName="avatar-img"
              src={headerAvatar}
              alt="Ảnh đại diện"
              preview={{ mask: "Xem to" }}
              style={{
                width: "100%",
                aspectRatio: 1,
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
            {isUploadingAvatar && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "rgba(255,255,255,0.5)",
                  borderRadius: "50%",
                  zIndex: 11,
                }}
              >
                <Spin size="large" />
              </div>
            )}
            <label
              htmlFor="upload"
              className="avatar-upload"
              title="Tải lên ảnh đại diện"
              aria-label="Tải lên ảnh đại diện"
            >
              <input
                id="upload"
                type="file"
                accept="image/*"
                onChange={onAvatarChange}
              />
            </label>
          </div>
        </Col>

        <Col
          lg={18}
          md={24}
          xs={24}
          className="profile__information-header-content"
        >
          <div className="content__info">
            <div className="content__info-head">
              <p className="content__info-text name">{headerName}</p>
              <Button
                type="primary"
                onClick={onRoomViewAction}
              >
                {roomViewActionLabel}
              </Button>
            </div>
            <p className="content__info-text subtitle">@{headerSub}</p>
          </div>
        </Col>
      </Row>
    </Col>
  );
};
