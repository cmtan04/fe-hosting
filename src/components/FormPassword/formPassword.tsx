import { Form } from "antd";
import { FormItemInputProps } from "antd/es/form/FormItemInput";
import Password from "antd/es/input/Password";
import { ReactNode } from "react";
import "./formPassword.scss";

interface IFormPassword {
  label: string;
  formItemProps?: FormItemInputProps;
  passwordProps?: any;
  name: string;
  vertical?: boolean;
  placeholder?: string;
  size?: "small" | "middle" | "large";
  prefix?: ReactNode;
  suffix?: ReactNode;
  disabled?: boolean;
  allowClear?: boolean;
  bordered?: boolean;
  status?: "error" | "warning";
  visibilityToggle?: boolean;
}

export const FormPassword = ({
  label,
  formItemProps,
  passwordProps,
  name,
  vertical = false,
  placeholder,
  size = "middle",
  prefix,
  suffix,
  disabled = false,
  allowClear = true,
  bordered = true,
  status,
  visibilityToggle = true,
}: IFormPassword) => {
  return (
    <Form.Item
      label={label}
      name={name}
      className={`form-input ${vertical ? "form-input--vertical" : ""}`}
      {...formItemProps}
      labelCol={vertical ? { span: 24 } : undefined}
    >
      <Password
        className="form-input__password"
        placeholder={placeholder}
        size={size}
        prefix={prefix}
        suffix={suffix}
        disabled={disabled}
        allowClear={allowClear}
        bordered={bordered}
        status={status}
        visibilityToggle={visibilityToggle}
        {...passwordProps}
      />
    </Form.Item>
  );
};
