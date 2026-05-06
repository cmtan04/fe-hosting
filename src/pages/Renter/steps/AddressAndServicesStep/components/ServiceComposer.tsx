import { Button, Checkbox, Col, Row, Select } from "antd";
import type { CustomServiceComposerState } from "@common/types/renter";

interface ServiceComposerProps {
  customService: CustomServiceComposerState;
  serviceQuery: string;
  serviceOptions: Array<{ value: string | number; label: string }>;
  setServiceQuery: (query: string) => void;
  setCustomService: React.Dispatch<React.SetStateAction<CustomServiceComposerState>>;
  handleCreateNewService: () => void;
  handleServiceSelectChange: (value: string | number) => void;
  addCustomService: () => void;
}

export const ServiceComposer = ({
  customService,
  serviceQuery,
  serviceOptions,
  setServiceQuery,
  setCustomService,
  handleCreateNewService,
  handleServiceSelectChange,
  addCustomService,
}: ServiceComposerProps) => {
  return (
    <div className="body__section-2 renter-sectionBand">
      <div className="renter-sectionBand-header">
        <h2>Tiện ích và dịch vụ</h2>
      </div>

      <div>
        <label htmlFor="service-select" className="composer-label">
          Thêm dịch vụ mới
        </label>
      </div>
      <Row gutter={[12, 12]}>
        <Col span={18}>
          <Select
            id="service-select"
            showSearch
            filterOption={false}
            value={customService.name || undefined}
            options={serviceOptions}
            placeholder=" Thêm dịch vụ"
            style={{ width: "100%" }}
            onSearch={(value) => setServiceQuery(value)}
            notFoundContent={
              serviceQuery.trim() ? (
                <div
                  onClick={handleCreateNewService}
                  style={{ padding: "8px 12px", cursor: "pointer" }}
                >
                  Tạo mới: {serviceQuery}
                </div>
              ) : null
            }
            onChange={handleServiceSelectChange}
          />
        </Col>
        <Col span={6}>
          <Checkbox
            checked={customService.chargeType === "FREE"}
            onChange={(event) =>
              setCustomService((prev) => ({
                ...prev,
                chargeType: event.target.checked ? "FREE" : "PAID",
              }))
            }
          >
            {" "}
            Miễn phí
          </Checkbox>
        </Col>
        {customService.chargeType === "PAID" && (
          <>
            <Col span={10}>
              <label htmlFor="pricing-type" className="composer-subLabel">
                Kiểu tính giá
              </label>
              <Select
                id="pricing-type"
                value={customService.unit}
                onChange={(value) =>
                  setCustomService((prev) => ({
                    ...prev,
                    unit: value,
                  }))
                }
                options={[
                  { value: "FULL", label: "Trọn gói" },
                  { value: "DAILY", label: "Theo ngày" },
                ]}
              />
            </Col>
            <Col span={14}>
              <label htmlFor="base-price" className="composer-subLabel">
                Giá áp dụng(vnđ)
              </label>
              <input
                id="base-price"
                className="renter-nativeInput"
                value={customService.basePrice}
                onChange={(event) =>
                  setCustomService((prev) => ({
                    ...prev,
                    basePrice: event.target.value,
                  }))
                }
                placeholder="0"
              />
            </Col>
          </>
        )}
        <Col span={23}>
          <label htmlFor="service-description" className="composer-subLabel">
            Mô tả
          </label>
          <textarea
            id="service-description"
            className="renter-nativeTextarea"
            value={customService.description}
            onChange={(event) =>
              setCustomService((prev) => ({
                ...prev,
                description: event.target.value,
              }))
            }
            placeholder="Mô tả ngắn về dịch vụ"
            style={{ width: "100%" }}
          />
        </Col>
      </Row>
      <div className="composer-action form-action">
        <Button
          htmlType="button"
          className="button-submit"
          onClick={addCustomService}
        >
          Thêm dịch vụ mới
        </Button>
      </div>
    </div>
  );
};
