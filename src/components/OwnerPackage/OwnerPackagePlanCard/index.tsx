import { CreditCardOutlined } from "@ant-design/icons";
import { Button, Card, Space, Typography } from "antd";
import type { OwnerPackagePlanResponseDto } from "@api/dtos/payment.dto";
import { formatMoney } from "@common/contexts/format";
import { isFreePlan } from "../utils";

const { Text, Title } = Typography;

interface OwnerPackagePlanCardProps {
  plan: OwnerPackagePlanResponseDto;
  currentPlanCode?: string;
  onSelect: (planCode: string) => void;
  loading?: boolean;
  className?: string;
}

export const OwnerPackagePlanCard = ({
  plan,
  currentPlanCode,
  onSelect,
  loading = false,
  className,
}: OwnerPackagePlanCardProps) => {
  const isCurrentPlan = currentPlanCode === plan.planCode;
  let actionLabel = "Mua gói";

  if (isCurrentPlan) {
    actionLabel = "Gói hiện tại của bạn";
  } else if (isFreePlan(plan)) {
    actionLabel = "Nhận ưu đãi";
  }

  return (
    <Card className={className}>
      <Space vertical size={10} style={{ width: "100%" }}>
        <div
          style={{ display: "flex", justifyContent: "space-between", gap: 8 }}
        >
          <Title level={4} style={{ margin: 0 }}>
            {isFreePlan(plan) ? "Nhận ưu đãi" : plan.name}
          </Title>
          {isCurrentPlan && <Text type="secondary">Gói hiện tại</Text>}
        </div>

        <Text strong style={{ fontSize: 22, lineHeight: "30px" }}>
          {isFreePlan(plan) ? "Miễn phí" : `${formatMoney(plan.price)} đ`}
        </Text>

        <Text>
          Thời hạn:{" "}
          {plan.durationDays ? `${plan.durationDays} ngày` : "Không giới hạn"}
        </Text>

        <Text>Tối đa {plan.maxActiveListings} tin hiển thị</Text>

        <Button
          type="primary"
          icon={<CreditCardOutlined />}
          disabled={isCurrentPlan}
          block
          loading={loading}
          onClick={() => onSelect(plan.planCode)}
        >
          {actionLabel}
        </Button>
      </Space>
    </Card>
  );
};
