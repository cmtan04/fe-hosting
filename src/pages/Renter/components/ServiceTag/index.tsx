import { Col, Row } from "antd";
import "../../renterLayout.scss";
import { formatMoney } from "../../../../common/contexts/format";
import { icon } from "leaflet";

interface ServiceTagProps {
  icon: any;
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
      <Col span={24} title={props.name}>
        <p className="service-name">{props.name}</p>
      </Col>
    </Row>
  );
};
