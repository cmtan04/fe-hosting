import "../style.scss";
import tick from "../../../assets/svg/tick.svg";
import doubleTick from "../../../assets/svg/doubleTick.svg";
import { formatDateDDMMYYYY } from "../../../common/contexts/format";

export interface ChatLabelProps {
  isYour: boolean;
  isRead: boolean;
  timeLine: string;
  content: string;
  avartar: string;
}

export const ChatLabel = (props: ChatLabelProps) => {
  return (
    <div className={`chat__label ${props.isYour && "yours"}`}>
      <div className="chat__label-avatar">
        <img src={props.avartar} alt={props.avartar} />
      </div>
      <div className="chat__label-content">
        <div className="row-1">
          <p className="chat__label-content-text">{props.content}</p>
        </div>
        <div className="row-2">
          <p className="chat__label-timeLine">
            {formatDateDDMMYYYY(props.timeLine)}
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
