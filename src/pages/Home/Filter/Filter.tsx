import { Button, Form, Select } from "antd";
import React from "react";
import { FormNumber } from "../../../components/FormInputNumber/formInputNumer";
import "./Filter.scss";

const { Option } = Select;

export const Filter = () => {
  const [form] = Form.useForm();
  const [appearFilter, setAppearFilter] = React.useState(false);

  const onSubmit = (values: any) => {
    // Logic filter
    alert("Filter values:" + JSON.stringify(values));
  };
  const handleFilterTable = () => {
    setAppearFilter(!appearFilter);
  };

  return (
    <div className="filter">
      <h1 className="filter__title">
        Bộ lọc tìm kiếm{" "}
        <span onClick={() => handleFilterTable()} style={{ cursor: "pointer" }}>
          ICON
        </span>
      </h1>
      {appearFilter && (
        <Form form={form} onFinish={onSubmit} className="filter__form">
          <div className="filter__row">
            <Form.Item
              label="Khu vực"
              name="region"
              labelCol={{ span: 24 }}
              className="form-item"
            >
              <Select placeholder="Chọn khu vực">
                <Option value="north">Miền Bắc</Option>
                <Option value="central">Miền Trung</Option>
                <Option value="south">Miền Nam</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Loại bất động sản"
              name="type"
              labelCol={{ span: 24 }}
              className="form-item"
            >
              <Select placeholder="Chọn loại">
                <Option value="motel">Phòng trọ</Option>
                <Option value="apartment">Căn hộ</Option>
                <Option value="office">Văn phòng</Option>
                <Option value="full-house">Nhà nguyên căn</Option>
                <Option value="venue">Địa điểm tổ chức</Option>
              </Select>
            </Form.Item>
          </div>
          <div className="filter__row">
            <FormNumber
              label="Giá tối thiểu"
              name="minPrice"
              placeholder="Giá tối thiểu"
              vertical={true}
            />
            <FormNumber
              label="Giá tối đa"
              name="maxPrice"
              placeholder="Giá tối đa"
              vertical={true}
            />
          </div>
          <div className="filter__row">
            <FormNumber
              label="Số phòng ngủ"
              name="bedrooms"
              placeholder="Số phòng ngủ"
              vertical={true}
            />
            <FormNumber
              label="Số phòng tắm"
              name="bathrooms"
              placeholder="Số phòng tắm"
              vertical={true}
            />
          </div>
          <div className="filter__actions">
            <Button type="primary" htmlType="submit">
              Áp dụng bộ lọc
            </Button>
            <Button onClick={() => form.resetFields()}>Đặt lại</Button>
          </div>
        </Form>
      )}
    </div>
  );
};
