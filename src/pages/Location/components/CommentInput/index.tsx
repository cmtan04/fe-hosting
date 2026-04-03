import { Rate } from "antd";
import { useState } from "react";
import type { ChatAndCommentDto } from "../../../../api/dtos/common.dto";
import type { UserProfileResponseDto } from "../../../../api/dtos/user.dto";
import { ChatInput } from "../../../../components/Chat/ChatInput";
import "../style.scss";

interface CommentInputProps {
  data: UserProfileResponseDto;
  onSubmit: (value: ChatAndCommentDto) => void;
}

export const CommentInput = (props: CommentInputProps) => {
  const [rate, setRate] = useState<number>();

  const handleSubmitComment = (value: ChatAndCommentDto) => {
    const payload: ChatAndCommentDto = {
      content: value.content,
      ratevalue: rate,
      metaData: value.metaData,
    };

    props?.onSubmit(payload);
  };
  return (
    <div className="comment__input">
      <div className="comment__input-left">
        <img
          src={props?.data?.avatarUrl}
          alt=""
          className="comment__user-avatar"
        />

        <p className="comment__user-name">{props?.data?.username}</p>
      </div>
      <div className="comment__input-right">
        <div className="row-1">
          <p className="row-1-title">Đánh giá</p>
          <Rate onChange={(value) => setRate(value)} />
        </div>

        <div className="row-2">
          <ChatInput
            onSubmit={(value: ChatAndCommentDto) => handleSubmitComment(value)}
          />
        </div>
      </div>
    </div>
  );
};
