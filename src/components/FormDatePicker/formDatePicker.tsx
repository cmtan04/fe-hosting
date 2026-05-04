import type { FormItemProps } from "antd/es/form";
import "./formDatePicker.scss";
import { DatePicker, Form } from "antd";
import type { DatePickerProps } from "antd";

interface IFormDatePicker {
  label: string;
  formItemProps?: FormItemProps;
  datePickerProps?: DatePickerProps;
  name: string;
  vertical?: boolean;
}

export const FormDatePicker = ({
  label,
  formItemProps,
  datePickerProps,
  name,
  vertical = false,
}: IFormDatePicker) => {
  return (
    <Form.Item
      label={label}
      name={name}
      className={`form-date-picker ${vertical ? "form-date-picker--vertical" : ""}`}
      {...formItemProps}
      labelCol={vertical ? { span: 24 } : undefined}
    >
      <DatePicker
        className="form-date-picker__picker"
        {...datePickerProps}
      />
    </Form.Item>
  );
};
