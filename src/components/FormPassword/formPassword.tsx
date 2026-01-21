import { Form, type FormItemProps } from "antd";
import Password from "antd/es/input/Password";
import type { ReactNode } from "react";
import "./formPassword.scss";

interface IFormPassword {
  label: string;
  subLabel?: string;
  formItemProps?: FormItemProps;
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
  subLabel,
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
      name={name}
      className={`form-input ${vertical ? "form-input--vertical" : ""}`}
      {...formItemProps}
      labelCol={vertical ? { span: 24 } : undefined}
    >
      <div className="label">
        <span className="label__right">{label}</span>
        <span className="label__left">{subLabel}</span>
      </div>
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
