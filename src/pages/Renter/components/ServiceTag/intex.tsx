import { Col, Row } from "antd";
import "../../renterLayout.scss";
import { formatMoney } from "../../../../common/contexts/format";

interface ServiceTagProps {
  icon: string;
  name: string;
  description: string;
  price: string | number;
  active: boolean;
}

export const ServiceTag = (props: ServiceTagProps) => {
  const normalizedPrice = Number(props.price ?? 0);

  return (
    <Row
      gutter={[16, 16]}
      className={`renter__serviceTag ${props.active && "active"}`}
      title={props.description}
    >
      <Col span={8}>
        {props.icon ? (
          <img src={props.icon} alt="icon" className="renter__serviceTag-icon" />
        ) : (
          <div className="renter__serviceTag-icon" />
        )}
      </Col>
      <Col span={16} title={props.name}>
        <p className="service-name">{props.name}</p>
        <p className="service-name">
          {normalizedPrice > 0 ? formatMoney(normalizedPrice) : "Mien phi"}
        </p>
      </Col>
    </Row>
  );
};
