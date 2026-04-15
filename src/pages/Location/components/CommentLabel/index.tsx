import { Rate } from "antd";
import { formatLastMessageAt } from "../../../../common/contexts/format";
import "../style.scss";
import type { MetaDataDto } from "../../../../api/dtos/common.dto";

interface CommentLabelProps {
  data: any;
  onReply?: () => void;
}

export const CommentLabel = (props: CommentLabelProps) => {
  const metaData = JSON.parse(props?.data?.metaData || "[]") as MetaDataDto[];

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
        {metaData.length > 0 && (
          <figure className="image_container">
            {metaData.map((item, index) => (
              <div key={index} className="image_container-item">
                <img
                  src={item.url}
                  alt={`image-${index}`}
                  className="image_container-item"
                />
              </div>
            ))}
          </figure>
        )}
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
