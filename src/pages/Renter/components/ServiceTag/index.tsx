import { Col, Row } from "antd";
import { formatMoney, formatCurrencyVND } from "@common/contexts/format";
import "./styles.scss";

interface ServiceTagProps {
  icon: any;
  name: string;
  description: string;
  price: string | number;
  active: boolean;
  unit?: string;
  isFree?: boolean;
}

export const ServiceTag = (props: ServiceTagProps) => {
  const normalizedPrice = Number(props.price ?? 0);
  
  return (
    <Row
      gutter={[12, 12]}
      className={`renter__serviceTag ${props.active && "active"}`}
      title={props.description}
      align="middle"
    >
      <Col span={24} title={props.name}>
        <div className="service-tag-content">
          <p className="service-name">{props.name}</p>
          <div className="service-tag-info">
            {props.isFree ? (
              <span className="service-type free">Miễn phí</span>
            ) : (
              <span className="service-type paid">
                {formatCurrencyVND(normalizedPrice)}
                {props.unit && ` / ${props.unit}`}
              </span>
            )}
          </div>
        </div>
      </Col>
    </Row>
  );
};
