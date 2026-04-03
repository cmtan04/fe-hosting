import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getUserPRofile } from "../../../../api/configs/user.config";
import { UserEndpoint } from "../../../../api/endpoints/user.endpoint";
import more from "../../../../assets/svg/location/more.svg";
import up from "../../../../assets/svg/location/up.svg";
import { useLoading } from "../../../../providers/loadingProvider";
import { CommentInput } from "../CommentInput";
import { CommentLabel } from "../CommentLabel";
import "../style.scss";
import type { ChatAndCommentDto } from "../../../../api/dtos/common.dto";
import type { LocationCommentPayloadDto } from "../../../../api/dtos/location.dto";
interface LocationCommentProps {
  locationCode: string;
  data: any;
}

export const LocationComment = (props: LocationCommentProps) => {
  const { setLoading } = useLoading();
  const [showReply, setShowReply] = useState<number>();
  const [commentId, setCommentId] = useState<number>();

  const { data: userData, isLoading: locationLoading } = useQuery({
    queryKey: [UserEndpoint.GET_USER_INFORMATION],
    queryFn: () => getUserPRofile(),
  });

  useEffect(() => {
    setLoading(locationLoading);
  }, [locationLoading]);

  const handleComment = (value: ChatAndCommentDto) => {
    const payload: LocationCommentPayloadDto = {
      locationCode: props.locationCode,
      commentId: commentId,
      content: value,
    };

    console.log("comment", payload);
  };
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

      <div className="location__comment-action">
        <CommentInput
          data={userData}
          onSubmit={(value) => handleComment(value)}
        />
      </div>
    </div>
  );
};
