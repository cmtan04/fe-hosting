import { useState } from "react";
import { CommentLabel } from "../CommentLabel";
import up from "../../../../assets/svg/location/up.svg";
import more from "../../../../assets/svg/location/more.svg";
import "../style.scss";
interface LocationCommentProps {
  data: any;
}

export const LocationComment = (props: LocationCommentProps) => {
  const [showReply, setShowReply] = useState<number>();
  return (
    <div className="location__comment">
      <div className="location__comment-list">
        {props.data?.map((comment: any) => (
          <div className="list-wrap">
            <CommentLabel data={comment} />

            <div className="comment-reply">
              {showReply === comment.id ? (
                <div className={showReply === comment.id ? "show" : "hide"}>
                  {comment.replies?.map((reply: any) => (
                    <CommentLabel data={reply} />
                  ))}

                  <p
                    className="comment-reply-action"
                    onClick={() => setShowReply(undefined)}
                  >
                    <span>
                      <img src={up} alt="Less" />
                    </span>
                    Ẩn {comment.replies?.length || 0} trả lời
                  </p>
                </div>
              ) : (
                <p
                  className="comment-reply-action"
                  onClick={() => setShowReply(comment.id)}
                >
                  <span>
                    <img src={more} alt="More" />
                  </span>
                  Hiện {comment.replies?.length || 0} trả lời
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="location__comment-action"></div>
    </div>
  );
};
