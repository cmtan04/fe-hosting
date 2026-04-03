interface CommentLabelProps {
  data: any;
}

export const CommentLabel = (props: CommentLabelProps) => {
  return (
    <div className="comment-label">
      <span>{props.data?.label}</span>
    </div>
  );
};
