import { Col, Row } from "antd";
import "../../renterLayout.scss";
import { formatMoney } from "../../../../common/contexts/format";

interface ServiceTagProps {
  icon: string;
  name: string;
  description: string;
  price: string;
  active: boolean;
}

export const ServiceTag = (props: ServiceTagProps) => {
  return (
    <Row
      gutter={[16, 16]}
      className={`renter__serviceTag ${props.active && "active"}`}
      title={props.description}
    >
      <Col span={8}>
        <img src={props.icon} alt="icon" className="renter__serviceTag-icon" />
      </Col>
      <Col span={16}>
        <p className="service-name">{props.name}</p>
        <p className="service-name">{formatMoney(props.price)}</p>
      </Col>
    </Row>
  );
};
