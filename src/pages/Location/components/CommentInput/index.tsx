import { Button, Input, Rate } from "antd";
import { useState } from "react";
import type { ChatAndCommentDto } from "../../../../api/dtos/common.dto";
import type { UserProfileResponseDto } from "../../../../api/dtos/user.dto";
import "../style.scss";

interface CommentInputProps {
  data: UserProfileResponseDto;
  onSubmit: (value: ChatAndCommentDto) => void;
}

export const CommentInput = (props: CommentInputProps) => {
  const [rate, setRate] = useState<number>();
  const [content, setContent] = useState("");

  const handleSubmitComment = () => {
    const trimmedContent = content.trim();
    if (!trimmedContent) return;

    const payload: ChatAndCommentDto = {
      content: trimmedContent,
      ratevalue: rate,
      metaData: [],
    };

    props?.onSubmit(payload);

    setContent("");
    setRate(undefined);
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
          <Rate value={rate} onChange={(value) => setRate(value)} />
        </div>

        <div className="row-2">
          <Input.TextArea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            onPressEnter={(event) => {
              if (!event.shiftKey) {
                event.preventDefault();
                handleSubmitComment();
              }
            }}
            rows={4}
          />
          <Button type="primary" onClick={handleSubmitComment}>
            Gui
          </Button>
        </div>
      </div>
    </div>
  );
};
