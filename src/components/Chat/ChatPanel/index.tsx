import { useQuery } from "@tanstack/react-query";
import { getUserPRofile } from "../../../api/configs/user.config";
import { UserEndpoint } from "../../../api/endpoints/user.endpoint";
import { ChatInput } from "../ChatInput";
import { ChatLabel } from "../ChatLabel";

export interface ChatPanelProps {
  data?: any;
}

export const fakeMessages = [
  {
    id: 1,
    isYour: true,
    isRead: true,
    timeLine: "2026-02-22T09:00:00",
    content: "Chào bạn 👋",
    avartar: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 2,
    isYour: false,
    isRead: true,
    timeLine: "2026-02-22T09:02:00",
    content: "Chào bạn, mình có thể giúp gì?",
    avartar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 3,
    isYour: true,
    isRead: false,
    timeLine: "2026-02-22T09:05:00",
    content: "Mình đang test giao diện chat 😄",
    avartar: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 2,
    isYour: false,
    isRead: true,
    timeLine: "2026-02-22T09:02:00",
    content: "Chào bạn, mình có thể giúp gì?",
    avartar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 3,
    isYour: true,
    isRead: false,
    timeLine: "2026-02-22T09:05:00",
    content: "Mình đang test giao diện chat 😄",
    avartar: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 2,
    isYour: false,
    isRead: true,
    timeLine: "2026-02-22T09:02:00",
    content: "Chào bạn, mình có thể giúp gì?",
    avartar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 3,
    isYour: true,
    isRead: false,
    timeLine: "2026-02-22T09:05:00",
    content: "Mình đang test giao diện chat 😄",
    avartar: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 2,
    isYour: false,
    isRead: true,
    timeLine: "2026-02-22T09:02:00",
    content: "Chào bạn, mình có thể giúp gì?",
    avartar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 3,
    isYour: true,
    isRead: false,
    timeLine: "2026-02-22T09:05:00",
    content: "Mình đang test giao diện chat 😄",
    avartar: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 2,
    isYour: false,
    isRead: true,
    timeLine: "2026-02-22T09:02:00",
    content: "Chào bạn, mình có thể giúp gì?",
    avartar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 3,
    isYour: true,
    isRead: false,
    timeLine: "2026-02-22T09:05:00",
    content: "Mình đang test giao diện chat 😄",
    avartar: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 2,
    isYour: false,
    isRead: true,
    timeLine: "2026-02-22T09:02:00",
    content: "Chào bạn, mình có thể giúp gì?",
    avartar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 3,
    isYour: true,
    isRead: false,
    timeLine: "2026-02-22T09:05:00",
    content: "Mình đang test giao diện chat 😄",
    avartar: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 2,
    isYour: false,
    isRead: true,
    timeLine: "2026-02-22T09:02:00",
    content: "Chào bạn, mình có thể giúp gì?",
    avartar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 3,
    isYour: true,
    isRead: false,
    timeLine: "2026-02-22T09:05:00",
    content: "Mình đang test giao diện chat 😄",
    avartar: "https://i.pravatar.cc/150?img=3",
  },
];

export const ChatPanel = (props: ChatPanelProps) => {
  const { data: user } = useQuery({
    queryKey: [UserEndpoint.GET_USER_INFORMATION],
    queryFn: () => getUserPRofile(),
  });
  return (
    <div className="chat__panel">
      <div className="chat__panel-header">
        <div className="chat__panel-header-left">
          <img src={user?.avatarUrl} alt={user?.avatarUrl} />
        </div>
        <div className="chat__panel-header-right">
          <p className={`line-1`}>{user?.fullName}</p>
          <p className="line-2">{user?.email}</p>
        </div>
      </div>
      <div className="chat__panel-body">
        {fakeMessages.map((item) => (
          <ChatLabel
            isYour={item.isYour}
            isRead={item.isRead}
            timeLine={item.timeLine}
            content={item.content}
            avartar={item.avartar}
          />
        ))}
      </div>
      <div className="chat__panel-footer">
        <ChatInput />
      </div>
    </div>
  );
};
