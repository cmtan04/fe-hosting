import { Rate } from "antd";
import { formatLastMessageAt } from "../../../../common/contexts/format";
import "../style.scss";

interface CommentLabelProps {
  data: any;
  onReply?: () => void;
}

export const CommentLabel = (props: CommentLabelProps) => {
  return (
    <div className="comment">
      <div className="comment-left">
        <img
          className="comment-user-avartar"
          src={props?.data?.user?.avatar}
          alt={props?.data?.user?.name}
        />
      </div>
      <div className="comment-right">
        <p className="comment-user-name">{props?.data?.user?.name}</p>
        <p className="comment-rate">
          {props?.data?.rate && (
            <Rate disabled defaultValue={props?.data?.rate} />
          )}
        </p>
        <p className="comment-content">{props?.data?.content}</p>
        <p className="comment-type">
          <span className="comment-type-label" onClick={() => props?.onReply()}>
            Trả lời
          </span>
          <span>-</span>
          <span className="comment-type-time">
            {formatLastMessageAt(props?.data?.createdAt)}
          </span>
        </p>
      </div>
    </div>
  );
};
