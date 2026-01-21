import { Form } from "antd";
import { FormItemInputProps } from "antd/es/form/FormItemInput";
import TextArea from "antd/es/input/TextArea";
import "./formTextArea.scss";

interface IFormTextArea {
  label: string;
  formItemProps?: FormItemInputProps;
  textAreaProps?: any;
  name: string;
  vertical?: boolean;
  placeholder?: string;
  rows?: number;
  showCount?: boolean;
  maxLength?: number;
  disabled?: boolean;
  readOnly?: boolean;
  bordered?: boolean;
  status?: "error" | "warning";
}

export const FormTextArea = ({
  label,
  formItemProps,
  textAreaProps,
  name,
  vertical = false,
  placeholder,
  rows = 4,
  showCount = false,
  maxLength,
  disabled = false,
  readOnly = false,
  bordered = true,
  status,
}: IFormTextArea) => {
  return (
    <Form.Item
      label={label}
      labelCol={vertical ? { span: 24 } : undefined}
      name={name}
      className={`form-input ${vertical ? "form-input--vertical" : ""}`}
      {...formItemProps}
    >
      <TextArea
        className="form-input__textarea"
        placeholder={placeholder}
        rows={rows}
        showCount={showCount}
        maxLength={maxLength}
        disabled={disabled}
        readOnly={readOnly}
        bordered={bordered}
        status={status}
        {...textAreaProps}
      />
    </Form.Item>
  );
};
