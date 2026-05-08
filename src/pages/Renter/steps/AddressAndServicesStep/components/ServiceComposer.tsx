import { Button, Checkbox, Col, Row, Select } from "antd";
import type { CustomServiceComposerState } from "@common/types/renter";
import { FormNumber } from "@/components/FormInputNumber/formInputNumer";
import { FormInput } from "@/components/FormInput/formInput";

interface ServiceComposerProps {
  customService: CustomServiceComposerState;
  serviceQuery: string;
  serviceOptions: Array<{ value: string | number; label: string }>;
  onQueryChange: (query: string) => void;
  onCustomServiceChange: (patch: Partial<CustomServiceComposerState>) => void;
  onSelectChange: (value: string | number | null | undefined) => void;
  onAddCustom: () => void;
}

/**
 * Component soạn thảo dịch vụ (Service Composer)
 * Cho phép tìm kiếm dịch vụ từ danh mục hoặc tạo dịch vụ tùy chỉnh mới
 */
export const ServiceComposer = ({
  customService,
  serviceQuery,
  serviceOptions,
  onQueryChange,
  onCustomServiceChange,
  onSelectChange,
  onAddCustom,
}: ServiceComposerProps) => {
  return (
    <div className="body__section-2 renter-sectionBand">
      <div className="renter-sectionBand-header">
        <h2>Tiện ích và dịch vụ</h2>
      </div>

      <div className="composer-input-group">
        <label htmlFor="service-select" className="composer-label">
          Thêm dịch vụ
        </label>
        <Row gutter={[12, 12]}>
          <Col span={18}>
            {/* Ô tìm kiếm và chọn dịch vụ */}
            <Select
              id="service-select"
              showSearch
              filterOption={false}
              value={
                customService.serviceCode || customService.name || undefined
              }
              options={serviceOptions}
              placeholder="Tìm hoặc nhập tên dịch vụ"
              style={{ width: "100%" }}
              onSearch={onQueryChange}
              onChange={(value) => onSelectChange(value)}
              allowClear
              onClear={() => {
                onQueryChange("");
                onSelectChange(undefined);
              }}
            />
          </Col>

          <Col span={6}>
            {/* Checkbox đánh dấu dịch vụ miễn phí */}
            <Checkbox
              checked={customService.chargeType === "FREE"}
              onChange={(e) =>
                onCustomServiceChange({
                  chargeType: e.target.checked ? "FREE" : "PAID",
                })
              }
            >
              Miễn phí
            </Checkbox>
          </Col>

          {/* Hiển thị cấu hình giá nếu dịch vụ có phí */}
          {customService.chargeType === "PAID" && (
            <>
              <Col span={14}>
                <FormNumber
                  label="Đơn giá (VNĐ)"
                  name="basePrice"
                  placeholder="0"
                  vertical={true}
                  min={0}
                  formatter={(value: any) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                  }
                  parser={(value: any) => value!.replace(/\./g, "")}
                />
              </Col>
              <Col span={10}>
                <FormInput
                  label="Đơn vị tính"
                  name="unit"
                  placeholder="Để trống nếu là dịch vụ trọn gói"
                  vertical={true}
                />
              </Col>
            </>
          )}

          <Col span={24}>
            {/* Ô nhập mô tả ngắn cho dịch vụ */}
            <label htmlFor="service-description" className="composer-subLabel">
              Mô tả
            </label>
            <textarea
              id="service-description"
              className="renter-nativeTextarea"
              value={customService.description}
              onChange={(e) =>
                onCustomServiceChange({ description: e.target.value })
              }
              placeholder="Mô tả ngắn về dịch vụ"
              style={{ width: "100%" }}
            />
          </Col>
        </Row>
      </div>

      <div className="composer-action form-action">
        {/* Nút xác nhận thêm dịch vụ vào danh sách */}
        <Button
          type="primary"
          className="button-submit"
          onClick={onAddCustom}
          disabled={!customService.name.trim() && !serviceQuery.trim()}
        >
          Thêm dịch vụ
        </Button>
      </div>
    </div>
  );
};
