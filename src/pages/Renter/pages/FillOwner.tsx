import { Button, Col, Form, Row } from "antd";
import type { RenterProps } from "../RenterLayout";
import { FormInput } from "../../../components/FormInput/formInput";
import { UserEndpoint } from "../../../api/endpoints/user.endpoint";
import { useQuery } from "@tanstack/react-query";
import { getUserPRofile } from "../../../api/configs/user.config";
import { useEffect } from "react";
import { useLoading } from "../../../providers/loadingProvider";
import { ServiceEndpoint } from "../../../api/endpoints/service.endpoint";
import { getAllService } from "../../../api/configs/service.config";
import { ServiceTag } from "../components/ServiceTag/intex";

export const FillOwner = (props: RenterProps) => {
  const [form] = Form.useForm();
  const { setLoading } = useLoading();

  const { data: user, isLoading } = useQuery({
    queryKey: [UserEndpoint.GET_USER_INFORMATION],
    queryFn: () => getUserPRofile(),
  });

  const { data: service } = useQuery({
    queryKey: [ServiceEndpoint.GET_ALL_LOCATION_SERVICE],
    queryFn: () => getAllService(),
  });

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        userName: user.username,
        userEmail: user.email,
        userPhone: user.phone,
        userAdress: user.fullAddress,
      });
    }
  }, [user, form]);

  const onSubmit = () => {};
  return (
    <div className="renter__fillOwner">
      <div className="renter__fillOwner-header">
        <h1 className="header-title">Thông tin của bạn</h1>
        <p className="header-subTitle">
          Vui lòng cung cấp thông tin về bạn. Điều này giúp mọi người tìm kiếm
          không gian của bạn dễ dàng hơn.
        </p>
      </div>
      <div className="renter__fillOwner-body">
        <div className="body__section-1">
          <Row gutter={[16, 16]}>
            <h1 className="section-title">Thông tin cá nhân</h1>
          </Row>
          <Row gutter={[16, 16]} className="body__section-content">
            <Col span={8}>
              <img
                src={user?.avatarUrl}
                alt="Ảnh đại diện"
                className="section__user-avartar"
                onError={(e) => {
                  e.currentTarget.style.backgroundColor = "#e5e5e5";
                  e.currentTarget.style.objectFit = "contain";
                }}
              />
            </Col>
            <Col span={16}>
              <Form
                form={form}
                onFinish={onSubmit}
                className="renter__fillAdress-form"
              >
                <FormInput
                  label="Họ và tên"
                  name="userName"
                  placeholder=""
                  vertical={true}
                  disabled
                  formItemProps={{
                    rules: [
                      {
                        required: true,
                        message: "Trường này là trường bắt buộc.",
                      },
                    ],
                  }}
                />

                <FormInput
                  label="Địa chỉ Email"
                  name="userEmail"
                  placeholder=""
                  disabled
                  vertical={true}
                  formItemProps={{
                    rules: [
                      {
                        required: true,
                        message: "Trường này là trường bắt buộc.",
                      },
                    ],
                  }}
                />

                <FormInput
                  label="Số điện thoại"
                  name="userPhone"
                  placeholder=""
                  disabled
                  vertical={true}
                  formItemProps={{
                    rules: [
                      {
                        required: true,
                        message: "Trường này là trường bắt buộc.",
                      },
                    ],
                  }}
                />

                <FormInput
                  label="Địa chỉ"
                  name="userAdress"
                  placeholder=""
                  disabled
                  vertical={true}
                  formItemProps={{
                    rules: [
                      {
                        required: true,
                        message: "Trường này là trường bắt buộc.",
                      },
                    ],
                  }}
                />
              </Form>
            </Col>
          </Row>
        </div>
        <div className="body__section-2">
          <Row gutter={[16, 16]}>
            <h1 className="section-title">
              Các dịch vụ mà bạn có thể cung cấp
            </h1>
          </Row>
          <div className="wrapper">
            <h1 className="body__section-2-content-title">Dịch vụ miễn phí</h1>
            <Row gutter={[16, 16]} className="body__section-2-content">
              {service
                ?.filter((item) => Number(item.servicePrice) === 0)
                .map((item) => (
                  <div key={item.serviceCode}>
                    <ServiceTag
                      icon={item.serviceLogo}
                      name={item.serviceName}
                      price={item.servicePrice}
                      description={item.serviceDescription}
                      active
                    />
                  </div>
                ))}
            </Row>
          </div>

          <div className="wrapper">
            <h1 className="body__section-2-content-title">Dịch vụ mất phí</h1>
            <Row gutter={[16, 16]} className="body__section-2-content">
              {service
                ?.filter((item) => Number(item.servicePrice) > 0)
                .map((item) => (
                  <div key={item.serviceCode}>
                    <ServiceTag
                      icon={item.serviceLogo}
                      name={item.serviceName}
                      price={item.servicePrice}
                      description={item.serviceDescription}
                      active
                    />
                  </div>
                ))}
            </Row>
          </div>
        </div>
      </div>

      <div className="renter__fillOwner-footer">
        <Button
          htmlType="button"
          onClick={props.onCancel}
          className="button-cancel"
        >
          Hủy
        </Button>
        <Button
          htmlType="button"
          className="button-submit"
          onClick={() => onSubmit()}
        >
          Tiếp tục
        </Button>
      </div>
    </div>
  );
};
