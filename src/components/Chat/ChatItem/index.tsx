import {
  formatDateDDMMYYYY,
  formatLastMessageAt,
} from "../../../common/contexts/format";
import "../style.scss";

export interface ChatItemProps {
  icon?: string;
  name?: string;
  content?: string;
  time?: string;
  isRead?: boolean;
  focus?: boolean;
}

export const ChatItem = (props: ChatItemProps) => {
  return (
    <div className={`chat__item ${props.focus && "focus"}`}>
      <div className="chat__item-left">
        <img src={props.icon} alt={props.name} />
      </div>
      <div className="chat__item-right">
        <p className={`line-1 ${props.isRead && "read"}`}>
          {props.name} <span>{formatLastMessageAt(props.time as string)}</span>
        </p>
        <p className="line-2">{props.content}</p>
      </div>
    </div>
  );
};
