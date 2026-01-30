import { Button, Form, Select } from "antd";
import { FormInput } from "../../../components/FormInput/formInput";
import { FormNumber } from "../../../components/FormInputNumber/formInputNumer";
import { FormTextArea } from "../../../components/FormTextArea/formTextArea";
import "./Rent.scss";

const { Option } = Select;

export const Rent = () => {
    const [form] = Form.useForm();

    const onSubmit = (values: any) => {
        console.log("Listing values:", values);
        // Handle posting logic here
    };

    return (
        <div className="rent">
            <div className="rent__container">
                <h1 className="rent__title">Đăng tin cho thuê</h1>
                <Form form={form} onFinish={onSubmit} className="rent__form">
                    <div className="rent__form-row">
                        <Form.Item
                            label="Loại nhà"
                            name="type"
                            rules={[{ required: true, message: "Vui lòng chọn loại nhà." }]}
                        >
                            <Select placeholder="Chọn loại nhà">
                                <Option value="apartment">Căn hộ</Option>
                                <Option value="house">Nhà riêng</Option>
                                <Option value="room">Phòng trọ</Option>
                            </Select>
                        </Form.Item>
                        <FormInput
                            label="Địa điểm"
                            name="location"
                            placeholder="Nhập địa điểm"
                            formItemProps={{
                                rules: [{ required: true, message: "Vui lòng nhập địa điểm." }],
                            }}
                        />
                    </div>
                    <div className="rent__form-row">
                        <FormNumber
                            label="Giá thuê (VNĐ/tháng)"
                            name="price"
                            placeholder="Nhập giá thuê"
                            min={0}
                            formItemProps={{
                                rules: [{ required: true, message: "Vui lòng nhập giá thuê." }],
                            }}
                        />
                        <FormNumber
                            label="Diện tích (m²)"
                            name="area"
                            placeholder="Nhập diện tích"
                            min={0}
                            formItemProps={{
                                rules: [{ required: true, message: "Vui lòng nhập diện tích." }],
                            }}
                        />
                    </div>
                    <div className="rent__form-row">
                        <FormNumber
                            label="Số phòng ngủ"
                            name="bedrooms"
                            placeholder="Nhập số phòng ngủ"
                            min={0}
                        />
                        <FormNumber
                            label="Số phòng tắm"
                            name="bathrooms"
                            placeholder="Nhập số phòng tắm"
                            min={0}
                        />
                    </div>
                    <div className="rent__form-row">
                        <FormInput
                            label="Tên liên hệ"
                            name="contactName"
                            placeholder="Nhập tên liên hệ"
                            formItemProps={{
                                rules: [{ required: true, message: "Vui lòng nhập tên liên hệ." }],
                            }}
                        />
                        <FormInput
                            label="Số điện thoại"
                            name="contactPhone"
                            placeholder="Nhập số điện thoại"
                            formItemProps={{
                                rules: [{ required: true, message: "Vui lòng nhập số điện thoại." }],
                            }}
                        />
                    </div>
                    <div className="rent__form-row">
                        <FormTextArea
                            label="Mô tả chi tiết"
                            name="description"
                            placeholder="Nhập mô tả chi tiết về nhà cho thuê"
                            formItemProps={{
                                rules: [{ required: true, message: "Vui lòng nhập mô tả." }],
                            }}
                        />
                    </div>
                    <div className="rent__form-row">
                        <Button type="primary" htmlType="submit" className="rent__submit-btn">
                            Đăng tin
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};