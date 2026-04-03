import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getConversationMessages } from "../../../api/configs/chat.config";
import type { ConversationResponseDto } from "../../../api/dtos/chat.dto";
import { ConverationEndpoint } from "../../../api/endpoints/chat.endpoint";
import { ChatInput } from "../ChatInput";
import { ChatLabel } from "../ChatLabel";
import deleteIcn from "../../../assets/svg/profile/delete.svg";
import penIcn from "../../../assets/svg/profile/pen.svg";
import bioIcn from "../../../assets/svg/profile/bio.svg";
import bellOffIcn from "../../../assets/svg/profile/bellOff.svg";
import hideIcn from "../../../assets/svg/profile/hide.svg";
import threeDotIcn from "../../../assets/svg/three-dots.svg";
import { Dropdown, Space } from "antd";
export interface ChatPanelProps {
  data?: ConversationResponseDto;
}

interface Conversation {
  id: number;
  page: number;
  size: number;
}

const chatMenuAction = [
  {
    key: 1,
    label: "Biệt danh",
    icon: <img src={penIcn} alt="pen" />,
  },
  {
    key: 2,
    label: "Xem trang cá nhân",
    icon: <img src={bioIcn} alt="bio" />,
  },
  {
    key: 3,
    label: "Tắt thông báo",
    icon: <img src={bellOffIcn} alt="bell-off" />,
  },
  {
    key: 4,
    label: "Ẩn trò chuyện",
    icon: <img src={hideIcn} alt="hide" />,
  },
  {
    key: 5,
    label: "Xóa trò chuyện",
    icon: <img src={deleteIcn} alt="delete" />,
  },
];

export const ChatPanel = (props: ChatPanelProps) => {
  const [conversation, setConversation] = useState<Conversation>({
    id: props?.data?.conversationId || 0,
    page: 1,
    size: 20,
  });

  useEffect(() => {
    if (props?.data?.conversationId) {
      setConversation((prev) => ({
        ...prev,
        id: props.data.conversationId as number,
      }));
    }
  }, [props?.data?.conversationId]);

  const { data: message } = useQuery({
    queryKey: [ConverationEndpoint.GET_CHAT_CONVERSATION_MESSAGE, conversation],
    queryFn: () =>
      getConversationMessages(conversation.id, {
        page: conversation.page,
        size: conversation.size,
      }),

    enabled: !!props.data?.conversationId,
  });

  const handleMenuClick = (e: any) => {
    if (e.key === "1") {
      const nameLabel = document.querySelector(".name-label");
      nameLabel?.classList.remove("show");
      nameLabel?.classList.add("hide");

      const input = document.querySelector(".name-input");
      input?.classList.remove("hide");
      input?.classList.add("show");
    }
  };

  const handleUpdateNickname = (e: any) => {
    e.preventDefault();
    const nameLabel = document.querySelector(".name-label");
    nameLabel?.classList.remove("hide");
    nameLabel?.classList.add("show");
    const input = document.querySelector(".name-input");
    input?.classList.remove("show");
    input?.classList.add("hide");
  };

  return (
    <>
      {props.data && (
        <div className="chat__panel">
          <div className="chat__panel-header">
            <div className="chat__panel-header-left">
              <img
                src={props.data?.toUser?.avatarUrl}
                alt={props.data?.toUser?.avatarUrl}
              />
            </div>
            <div className="chat__panel-header-right">
              <div className="row-left">
                <p className={`line-1 name-label show`}>
                  {props.data?.toUser?.username}
                </p>
                <input
                  className="name-input hide"
                  id="name-input"
                  name="name"
                  defaultValue={props.data?.toUser?.username}
                  type="text"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUpdateNickname(e);
                    }
                  }}
                  onBlur={(e) => {
                    handleUpdateNickname(e);
                  }}
                />
                <p className="line-2">{props.data?.toUser?.email}</p>
              </div>

              <div className="row-right">
                <Dropdown
                  menu={{
                    items: chatMenuAction,
                    onClick: handleMenuClick,
                  }}
                  trigger={["click"]}
                >
                  <img
                    src={threeDotIcn}
                    alt="three-dot"
                    onClick={(e) => e.preventDefault()}
                  />
                </Dropdown>
              </div>
            </div>
          </div>
          <div className="chat__panel-body">
            {message ? (
              <>
                {message
                  .sort(
                    (a, b) =>
                      new Date(a.createdAt).getTime() -
                      new Date(b.createdAt).getTime(),
                  )
                  .map((item) => (
                    <ChatLabel
                      isYour={props.data?.toUser?.id !== item.senderId}
                      isRead={item.isRead}
                      timeLine={item.createdAt}
                      content={item.content}
                      avartar={item.avartarUrl}
                      type={item.type}
                    />
                  ))}
              </>
            ) : (
              <ChatLabel
                isYour={true}
                isRead={false}
                timeLine={props.data.conversationCreatedAt}
                content={props.data.lastMessage || "Không có tin nhắn nào"}
                avartar={props.data.toUser?.avatarUrl || ""}
              />
            )}
          </div>
          <div className="chat__panel-footer">
            <ChatInput />
          </div>
        </div>
      )}
    </>
  );
};
