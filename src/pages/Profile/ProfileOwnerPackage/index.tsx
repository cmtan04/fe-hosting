import {
  Button,
  Card,
  Col,
  Empty,
  Row,
  Tag,
  Typography,
  message,
} from "antd";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  buyOwnerPackage,
  getMyOwnerPackage,
  getOwnerPackagePlans,
} from "@/api/configs/payment.config";
import type { PaymentUrlResponseDto } from "@/api/dtos/payment.dto";
import {
  getOwnerPackagePlanLabel,
  getVisibleOwnerPackagePlans,
  OwnerPackagePaymentInfoCard,
  OwnerPackagePlanCard,
} from "@components/OwnerPackage";
import "./style.scss";

const { Text, Title } = Typography;

export const ProfileOwnerPackage = () => {
  const [paymentInfo, setPaymentInfo] = useState<PaymentUrlResponseDto | null>(
    null,
  );

  const {
    data: subscription,
    isLoading: subscriptionLoading,
    refetch: refetchSubscription,
  } = useQuery({
    queryKey: ["owner-package-me"],
    queryFn: getMyOwnerPackage,
  });

  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ["owner-package-plans"],
    queryFn: getOwnerPackagePlans,
  });

  const visiblePlans = plans
    ? getVisibleOwnerPackagePlans(plans, subscription?.planCode)
    : [];

  const buyMutation = useMutation({
    mutationFn: buyOwnerPackage,
    onSuccess: (data) => {
      setPaymentInfo(data);
      message.success("Da tao thong tin thanh toan goi dang tin");
    },
    onError: (error: any) => {
      const apiMessage = error?.response?.data?.message;
      message.error(
        typeof apiMessage === "string"
          ? apiMessage
          : "Khong the tao thanh toan goi dang tin",
      );
    },
  });

  let packageStatusTag = <Tag>Chua co goi</Tag>;

  if (subscription?.planCode === "LONG_FREE") {
    packageStatusTag = (
      <Tag icon={<ClockCircleOutlined />} color="gold">
        Nhận ưu đãi
      </Tag>
    );
  } else if (subscription?.planCode) {
    packageStatusTag = (
      <Tag icon={<CheckCircleOutlined />} color="green">
        Dang kich hoat
      </Tag>
    );
  }

  let packagePlansContent = (
    <Row gutter={[16, 16]}>
      {visiblePlans.map((plan) => (
        <Col xs={12} md={6} key={plan.planCode}>
          <OwnerPackagePlanCard
            className="profile-owner-package__plan"
            plan={plan}
            currentPlanCode={subscription?.planCode}
            loading={
              buyMutation.isPending &&
              buyMutation.variables?.planCode === plan.planCode
            }
            onSelect={(planCode) => buyMutation.mutate({ planCode })}
          />
        </Col>
      ))}
    </Row>
  );

  if (plansLoading) {
    packagePlansContent = (
      <div className="profile-owner-package__loading">Dang tai...</div>
    );
  } else if (!visiblePlans.length) {
    packagePlansContent = <Empty description="Chua co goi dang tin" />;
  }

  return (
    <div className="profile-owner-package">
      <div className="profile-owner-package__header">
        <div>
          <Title level={3}>Gói đăng tin</Title>
          <Text>
            Chọn tùy chọn gói đăng tin phù hợp với nhu cầu của bạn để tiếp tục
            đăng tin cho thuê trên nền tảng.
          </Text>
        </div>
        <Button
          onClick={() => refetchSubscription()}
          loading={subscriptionLoading}
        >
          Làm mới
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Danh sách gói">{packagePlansContent}</Card>
        </Col>
      </Row>

      {paymentInfo && paymentInfo.amount !== 0 && (
        <Card
          className="profile-owner-package__payment"
          title="Thanh toán SePay"
        >
          <OwnerPackagePaymentInfoCard paymentInfo={paymentInfo} />
        </Card>
      )}
    </div>
  );
};
