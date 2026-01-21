import { Form } from "antd";
import { FormItemInputProps } from "antd/es/form/FormItemInput";
import Search from "antd/es/transfer/search";
import { ReactNode } from "react";
import "./formSearch.scss";

interface IFormSearch {
  label: string;
  formItemProps?: FormItemInputProps;
  searchProps?: any;
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
  onSearch?: (value: string) => void;
}

export const FormSearch = ({
  label,
  formItemProps,
  searchProps,
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
  onSearch,
}: IFormSearch) => {
  return (
    <Form.Item
      label={label}
      labelCol={vertical ? { span: 24 } : undefined}
      name={name}
      className={`form-input ${vertical ? "form-input--vertical" : ""}`}
      {...formItemProps}
    >
      <Search
        className="form-input__search"
        placeholder={placeholder}
        size={size}
        prefix={prefix}
        suffix={suffix}
        disabled={disabled}
        allowClear={allowClear}
        bordered={bordered}
        status={status}
        onSearch={onSearch}
        {...searchProps}
      />
    </Form.Item>
  );
};
