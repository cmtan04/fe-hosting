import "../style.scss";
import tick from "../../../assets/svg/tick.svg";
import doubleTick from "../../../assets/svg/doubleTick.svg";
import {
  formatDateDDMMYYYY,
  formatLastMessageAt,
} from "../../../common/contexts/format";
import { MessageType } from "../../../common/constants/constants";

export interface ChatLabelProps {
  isYour: boolean;
  isRead: boolean;
  timeLine: string;
  content: string;
  avartar: string;
  type?: string;
}

export const ChatLabel = (props: ChatLabelProps) => {
  return (
    <div className={`chat__label ${props.isYour && "yours"}`}>
      <div className="chat__label-avatar">
        <img src={props.avartar} alt={props.avartar} />
      </div>
      <div className="chat__label-content">
        <div className="row-1">
          {props.type === MessageType.SYSTEM ? (
            <p
              className="chat__label-content-text"
              dangerouslySetInnerHTML={{ __html: props.content as string }}
            />
          ) : (
            <p className="chat__label-content-text">{props.content}</p>
          )}
        </div>
        <div className="row-2">
          <p className="chat__label-timeLine">
            {formatLastMessageAt(props.timeLine)}
            <span>
              {props.isRead ? (
                <img src={doubleTick} alt={"read"} />
              ) : (
                <img src={tick} alt={"unread"} />
              )}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
