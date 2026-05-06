import { Col, Row } from "antd";
import type { LocationDto } from "@/api/dtos/location.dto";
import pin from "@/assets/svg/home/pin.svg";
import "./style.scss";

interface LocationAddressProps {
  locationDetail?: LocationDto;
}

export const LocationAddress = ({ locationDetail }: LocationAddressProps) => {
  return (
    <Row gutter={[16, 16]} className="location-address">
      <Col span={24}>
        <p className="wrap-label">Vị trí</p>
        <p className="wrap-title">Địa chỉ cụ thể</p>
        <div className="wrap-content">
          {locationDetail?.address?.map((item, index) => (
            <div
              key={`${item.addressName}-${index}`}
              className="wrap-content-row"
            >
              <div className="wrap-content-row-info">
                <img src={pin} alt="" />
                <div className="content">
                  <p className="name">{item.addressName}</p>
                  <a
                    className="wrap-content-row-map-open note"
                    href={`https://www.google.com/maps/search/?api=1&query=${item.addressLat},${item.addressLong}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.fullAddress}
                  </a>
                </div>
              </div>

              <div className="wrap-content-row-map">
                <iframe
                  className="wrap-content-row-map-frame"
                  title={`map-${index}`}
                  frameBorder="0"
                  scrolling="no"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(item.addressLong) - 0.01}%2C${
                    Number(item.addressLat) - 0.01
                  }%2C${Number(item.addressLong) + 0.01}%2C${Number(item.addressLat) + 0.01}&layer=mapnik&marker=${item.addressLat}%2C${item.addressLong}`}
                  style={{ border: "none" }}
                />
              </div>
            </div>
          ))}
        </div>
      </Col>
    </Row>
  );
};
