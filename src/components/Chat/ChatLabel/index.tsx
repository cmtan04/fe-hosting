import "../style.scss";
import tick from "../../../assets/svg/tick.svg";
import doubleTick from "../../../assets/svg/doubleTick.svg";
import { formatLastMessageAt } from "../../../common/contexts/format";
import { MessageType } from "../../../common/constants/constants";

export interface ChatLabelProps {
  isYour: boolean;
  timeLine: string;
  content: string;
  avartar: string;
  type?: string;
  messageStatus?: "SENT" | "DELIVERED" | "READ";
  showStatus?: boolean;
}

export const ChatLabel = (props: ChatLabelProps) => {
  const statusLabel =
    props.messageStatus === "READ"
      ? "Đã đọc"
      : props.messageStatus === "DELIVERED"
        ? "Đã nhận"
        : props.messageStatus === "SENT"
          ? "Đã gửi"
          : "";

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
            {props.showStatus && props.messageStatus && (
              <>
                <span>
                  {props.messageStatus === "SENT" ? (
                    <img src={tick} alt={"sent"} />
                  ) : (
                    <img
                      src={doubleTick}
                      alt={props.messageStatus.toLowerCase()}
                    />
                  )}
                </span>
                <span>{statusLabel}</span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
