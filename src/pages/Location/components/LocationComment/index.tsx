import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import more from "../../../../assets/svg/location/more.svg";
import up from "../../../../assets/svg/location/up.svg";
import { CommentLabel } from "../CommentLabel";
import "../style.scss";
import { useLoading } from "../../../../providers/loadingProvider";
import { UserEndpoint } from "../../../../api/endpoints/user.endpoint";
import { getLocationByFilter } from "../../../../api/configs/location.config";
import { getUserPRofile } from "../../../../api/configs/user.config";
import { CommentInput } from "../CommentInput";
interface LocationCommentProps {
  data: any;
}

export const LocationComment = (props: LocationCommentProps) => {
  const { setLoading } = useLoading();
  const [showReply, setShowReply] = useState<number>();

  const { data: userData, isLoading: locationLoading } = useQuery({
    queryKey: [UserEndpoint.GET_USER_INFORMATION],
    queryFn: () => getUserPRofile(),
  });

  useEffect(() => {
    setLoading(locationLoading);
  }, [locationLoading]);

  console.log(userData);
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
        <CommentInput data={userData} />
      </div>
    </div>
  );
};
