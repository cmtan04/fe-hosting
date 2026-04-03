import { Rate } from "antd";
import type { UserProfileResponseDto } from "../../../../api/dtos/user.dto";
import "../style.scss";
import { useState } from "react";
import { ChatInput } from "../../../../components/Chat/ChatInput";

interface CommentInputProps {
  data: UserProfileResponseDto;
  onSubmit?: (value: any) => void;
}

export const CommentInput = (props: CommentInputProps) => {
  const [rate, setRate] = useState<number>();
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
          <ChatInput />
        </div>
      </div>
    </div>
  );
};
