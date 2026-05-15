import { Col, Image, Row, Space, Typography } from "antd";
import type { PaymentUrlResponseDto } from "@api/dtos/payment.dto";
import { formatMoney } from "@common/contexts/format";

const { Text } = Typography;

interface OwnerPackagePaymentInfoCardProps {
  paymentInfo: PaymentUrlResponseDto;
  title?: string;
  note?: string;
}

export const OwnerPackagePaymentInfoCard = ({
  paymentInfo,
  title = "Thông tin thanh toán",
  note = "Chuyển khoản đúng nội dung bên dưới để hệ thống xác nhận gói.",
}: OwnerPackagePaymentInfoCardProps) => {
  return (
    <div>
      <div style={{ marginBottom: 12, fontWeight: 600 }}>{title}</div>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={10}>
          <Image
            src={paymentInfo.qrContent || paymentInfo.paymentUrl}
            alt="QR thanh toán"
            width="100%"
            preview={false}
          />
        </Col>
        <Col xs={24} md={14}>
          <Space vertical size={8}>
            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: "#eef6ff",
                color: "#1d4ed8",
              }}
            >
              {note}
            </div>
            <Text>
              Mã giao dịch: <strong>{paymentInfo.transactionCode}</strong>
            </Text>
            <Text>
              Số tiền: <strong>{formatMoney(paymentInfo.amount)} đ</strong>
            </Text>
            <Text>
              Nội dung: <strong>{paymentInfo.transferContent}</strong>
            </Text>
            <Text>Ngân hàng: {paymentInfo.bankCode || "N/A"}</Text>
            <Text>Số tài khoản: {paymentInfo.accountNumber || "N/A"}</Text>
            <Text>Chủ tài khoản: {paymentInfo.accountName || "N/A"}</Text>
          </Space>
        </Col>
      </Row>
    </div>
  );
};
