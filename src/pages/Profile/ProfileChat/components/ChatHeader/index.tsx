import { Avatar, Button, Dropdown, Input, Tooltip, Typography } from "antd";
import type { MenuProps } from "antd";
import {
  ArrowLeftOutlined,
  BellOutlined,
  DeleteOutlined,
  EyeInvisibleOutlined,
  MoreOutlined,
  PushpinOutlined,
  StopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MuteConversationPreset } from "@api/dtos/chat.dto";
import type { ChatConversationView } from "../../types";
import "./style.scss";

interface ChatHeaderProps {
  conversation?: ChatConversationView;
  isNicknameEditing: boolean;
  nicknameInput: string;
  mutePresetItems: Array<{
    key: string;
    preset: MuteConversationPreset;
    label: string;
  }>;
  onCommitNickname: () => void;
  onMute: (preset: MuteConversationPreset) => void;
  onNicknameChange: (value: string) => void;
  onStartNicknameEditing: () => void;
  onTogglePin: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

export const ChatHeader = ({
  conversation,
  isNicknameEditing,
  nicknameInput,
  mutePresetItems,
  onCommitNickname,
  onMute,
  onNicknameChange,
  onStartNicknameEditing,
  onTogglePin,
  onBack,
  showBackButton,
}: ChatHeaderProps) => {
  const menuItems: MenuProps["items"] = [
    {
      key: "nickname",
      label: "Đặt biệt danh",
      icon: <UserOutlined />,
    },
    {
      key: "profile",
      label: "Xem trang cá nhân",
      icon: <UserOutlined />,
    },
    {
      key: "pin",
      label: conversation?.isPinned
        ? "Bỏ ghim cuộc trò chuyện"
        : "Ghim cuộc trò chuyện",
      icon: conversation?.isPinned ? <StopOutlined /> : <PushpinOutlined />,
    },
    {
      key: "mute",
      label: "Tắt thông báo",
      icon: <BellOutlined />,
      children: mutePresetItems.map((item) => ({
        key: item.key,
        label: item.label,
      })),
    },
    {
      key: "hide",
      label: "Ẩn cuộc trò chuyện",
      icon: <EyeInvisibleOutlined />,
    },
    {
      key: "delete",
      label: "Xóa cuộc trò chuyện",
      icon: <DeleteOutlined />,
      danger: true,
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "nickname") {
      onStartNicknameEditing();
      return;
    }

    if (key === "pin") {
      onTogglePin();
      return;
    }

    const mutePreset = mutePresetItems.find((item) => item.key === key)?.preset;
    if (mutePreset) {
      onMute(mutePreset);
    }
  };

  if (!conversation) {
    return null;
  }

  return (
    <header className="chat-header">
      {showBackButton && (
        <Button
          type="text"
          shape="circle"
          className="chat-header__back"
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
          aria-label="Quay lai danh sach hoi thoai"
        />
      )}

      <Avatar size={52} shape="square" src={conversation.avatarUrl}>
        {conversation.displayName.charAt(0).toUpperCase()}
      </Avatar>

      <div className="chat-header__content">
        {isNicknameEditing ? (
          <Input
            autoFocus
            className="chat-header__nickname-input"
            value={nicknameInput}
            onChange={(event) => onNicknameChange(event.target.value)}
            onBlur={onCommitNickname}
            onPressEnter={onCommitNickname}
          />
        ) : (
          <Typography.Text className="chat-header__name" ellipsis strong>
            {conversation.displayName}
          </Typography.Text>
        )}
        <Typography.Text className="chat-header__email" ellipsis>
          {conversation.email || "Đang hoạt động trên hệ thống"}
        </Typography.Text>
      </div>

      <Dropdown
        menu={{
          items: menuItems,
          onClick: handleMenuClick,
        }}
        trigger={["click"]}
      >
        <Tooltip title="Tùy chọn">
          <Button
            type="text"
            shape="circle"
            icon={<MoreOutlined />}
            aria-label="Tùy chọn hội thoại"
          />
        </Tooltip>
      </Dropdown>
    </header>
  );
};
