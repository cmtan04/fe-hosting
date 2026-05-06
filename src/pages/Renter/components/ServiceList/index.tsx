import { CheckOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Select } from "antd";
import type {
  LocationServiceSelectionDto,
  ServiceDto,
} from "@/api/dtos/location.dto";
import {
  DEFAULT_SERVICE_PRICING_TYPE,
  getServiceDraftPrice,
  isServicePaid,
} from "@features/locationCreation/services";
import { ServiceTag } from "../ServiceTag";
import "./styles.scss";

interface ServiceListProps {
  selectedServices: LocationServiceSelectionDto[];
  services?: ServiceDto[];
  updateSelectedService: (index: number, updatedService: any) => void;
  removeSelectedService: (index: number) => void;
}

export const ServiceList = ({
  selectedServices,
  services,
  updateSelectedService,
  removeSelectedService,
}: ServiceListProps) => {
  return (
    <div className="renter-selectedServices">
      {selectedServices.map((service, index) => {
        const catalogService = services?.find(
          (item) => item.serviceCode === service.serviceCode,
        );
        const serviceName =
          service.name ||
          catalogService?.serviceName ||
          service.serviceCode ||
          "Dịch vụ";
        const serviceDescription =
          service.description || catalogService?.serviceDescription;
        const servicePrice = getServiceDraftPrice(
          service,
          catalogService?.servicePrice,
        );
        const paid = isServicePaid(service, catalogService?.servicePrice);
        const quantity = Number(service.quantity ?? 1);
        const isCustomService = !service.serviceCode;
        const resolvePaidPrice = () => {
          const currentPrice = Number(service.basePrice ?? 0);
          const catalogPrice = Number(
            catalogService?.basePrice ?? catalogService?.servicePrice ?? 0,
          );

          if (currentPrice > 0) {
            return currentPrice;
          }

          if (catalogPrice > 0) {
            return catalogPrice;
          }

          return 1;
        };

        return (
          <div
            key={`${service.serviceCode ?? service.name}-${index}`}
            className="renter-selectedServiceRow"
          >
            <div className="renter-selectedServiceRow__tag">
              <ServiceTag
                icon={<CheckOutlined style={{ color: "green" }} />}
                name={serviceName}
                price={String(servicePrice)}
                description={serviceDescription ?? ""}
                active={true}
              />
            </div>

            <div className="renter-selectedServiceRow__content">
              <div className="renter-selectedServiceText">
                <span className="renter-inlineControl renter-inlineControl--status">
                  <Select
                    size="small"
                    value={paid ? "PAID" : "FREE"}
                    onChange={(value) =>
                      updateSelectedService(index, {
                        isFree: value === "FREE",
                        basePrice: value === "FREE" ? 0 : resolvePaidPrice(),
                      })
                    }
                    options={[
                      { value: "FREE", label: "miễn phí" },
                      { value: "PAID", label: "mất phí" },
                    ]}
                  />
                </span>
                {paid && (
                  <>
                  <span>, Đơn giá:</span>
                <span className="renter-inlineControl renter-inlineControl--price">
                  <input
                    className="renter-nativeInput renter-inlinePriceInput"
                    value={String(servicePrice)}
                    disabled={!paid}
                    onChange={(event) =>
                      updateSelectedService(index, {
                        basePrice: Number(event.target.value || 0),
                        isFree: Number(event.target.value || 0) <= 0,
                      })
                    }
                    placeholder="0"
                    inputMode="numeric"
                  />
                </span>
                <span>, số lượng</span>
                <span className="renter-inlineControl renter-inlineControl--quantity">
                  <input
                    className="renter-nativeInput renter-inlineQuantityInput"
                    value={String(quantity)}
                    onChange={(event) => {
                      const nextQuantity = Number(event.target.value || 1);
                      updateSelectedService(index, {
                        quantity:
                          Number.isFinite(nextQuantity) && nextQuantity > 0
                            ? nextQuantity
                            : 1,
                      });
                    }}
                    placeholder="1"
                    inputMode="numeric"
                  />
                </span>
                <span>.</span>
                  </>
                )}
                
                {serviceDescription && !isCustomService && (
                  <span className="renter-selectedServiceDescription">
                    {serviceDescription}
                  </span>
                )}
                {isCustomService && (
                  <textarea
                    className="renter-nativeTextarea renter-inlineDescriptionInput"
                    value={service.description ?? ""}
                    onChange={(event) =>
                      updateSelectedService(index, {
                        description: event.target.value,
                      })
                    }
                    placeholder="Mô tả ngắn về dịch vụ"
                  />
                )}
              </div>

              <div className="renter-selectedServiceActions">
                <Button
                  htmlType="button"
                  className="renter-inlineDanger"
                  onClick={() => removeSelectedService(index)}
                  aria-label={`Xóa ${serviceName}`}
                >
                  <DeleteOutlined />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
