import { useMutation, useQuery } from "@tanstack/react-query";
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
import reply from "../../../../assets/svg/location/reply.svg";
import { createNewComment } from "../../../../api/configs/location.config";
import {
  DEFAULT_MESSAGE,
  NOTI_ERROR,
  NOTI_SUCCESS,
} from "../../../../common/constants/constants";
import { isAxiosError } from "axios";
import { useNotification } from "../../../../providers/notificationProvider";
import remove from "../../../../assets/svg/remove.svg";
interface LocationCommentProps {
  locationCode: string;
  data: any;
  onRefetch?: () => void;
  onShowMore?: (value: number) => void;
}

export const LocationComment = (props: LocationCommentProps) => {
  const { setLoading } = useLoading();
  const { showNotification } = useNotification();
  const [showReply, setShowReply] = useState<number>();
  const [commentId, setCommentId] = useState<number>();

  const { data: userData, isLoading: locationLoading } = useQuery({
    queryKey: [UserEndpoint.GET_USER_INFORMATION],
    queryFn: () => getUserPRofile(),
  });

  const handleShowMore = () => {
    const nextPage = Number(props?.data?.meta?.page) + 1;
    props.onShowMore?.(nextPage);
  };

  const createNewCommentMutate = useMutation({
    mutationFn: (payload: LocationCommentPayloadDto) =>
      createNewComment(payload),
    onSuccess: (data) => {
      props.onRefetch();
      setCommentId(null);
      showNotification(data.message, NOTI_SUCCESS);
    },
    onError: (error) => {
      let message = DEFAULT_MESSAGE;
      if (isAxiosError(error)) {
        const apiMessage = error.response?.data?.message;
        if (typeof apiMessage === "string") {
          message = apiMessage;
        } else if (Array.isArray(apiMessage) && apiMessage[0]) {
          message = apiMessage[0];
        }
      }
      showNotification(message, NOTI_ERROR);
    },
    onMutate: () => {
      setLoading(true);
    },
    onSettled: () => {
      setLoading(false);
    },
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
    createNewCommentMutate.mutate(payload);
  };

  return (
    <div className="location__comment">
      <div className="location__comment-list">
        {props?.data?.data?.length === 0 ? (
          <p className="no__comment">Chưa có bình luận nào</p>
        ) : (
          <>
            {props?.data?.data?.length > 10 && (
              <p className="show__more" onClick={handleShowMore}>
                Hiện thêm bình luận
              </p>
            )}
            {props?.data?.data?.map((comment: any) => (
              <div className="list-wrap">
                <CommentLabel
                  data={comment}
                  onReply={() => setCommentId(comment.id)}
                />

                <div className="comment-reply">
                  {showReply === comment.id ? (
                    <div className={showReply === comment.id ? "show" : "hide"}>
                      {comment.replies?.map((reply: any) => {
                        return (
                          <CommentLabel
                            data={reply}
                            onReply={() => setCommentId(comment.id)}
                          />
                        );
                      })}

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
          </>
        )}
      </div>

      <div className="location__comment-action">
        {commentId && (
          <div className="comment__reply-label">
            <img src={reply} alt="" />
            <p className="comment__reply-content">
              {
                props?.data?.data?.find((item: any) => item.id === commentId)
                  ?.content
              }
              <span>-</span>
              <span>
                {
                  props?.data?.data?.find((item: any) => item.id === commentId)
                    ?.user?.name
                }
              </span>
            </p>
            <img
              className="remove"
              src={remove}
              onClick={() => setCommentId(null)}
            />
          </div>
        )}
        <CommentInput
          data={userData}
          onSubmit={(value) => handleComment(value)}
        />
      </div>
    </div>
  );
};
