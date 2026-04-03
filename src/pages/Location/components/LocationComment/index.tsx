import { formatLastMessageAt } from "../../../../common/contexts/format";

interface LocationCommentProps {
  data: any;
}

export const LocationComment = (props: LocationCommentProps) => {
  return (
    <div className="location__comment">
      <div className="location__comment-wrapper">
        <div className="location__comment-list">
          {props.data?.map((comment: any) => (
            <div className="list-wrap">
              <div key={comment.id} className="comment-item">
                <div className="comment-left">
                  <img
                    className="comment-user-avartar"
                    src={comment.user?.avatar}
                    alt={comment.user?.name}
                  />
                </div>
                <div className="comment-right">
                  <p className="comment-user-name">{comment.user?.name}</p>
                  <p className="comment-rate">({comment.content})</p>
                  <p className="comment-content">{comment.content}</p>
                  <p className="comment-type">
                    <span>{comment.type}</span>
                    <span>-</span>
                    <span>{formatLastMessageAt(comment.createdAt)}</span>
                  </p>
                </div>
              </div>

              <div className="comment-reply">
                {comment.replies?.map((reply: any) => (
                  <div key={reply.id} className="comment-reply-item"></div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="location__comment-content-action"></div>
      </div>
    </div>
  );
};
