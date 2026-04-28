import { CheckOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Select } from "antd";
import type {
  LocationServiceSelectionDto,
  ServiceDto,
  ServicePricingType,
} from "@/api/dtos/location.dto";
import {
  DEFAULT_SERVICE_PRICING_TYPE,
  getServiceDraftPrice,
  isServicePaid,
} from "@features/locationCreation/services";
import { ServiceTag } from "./ServiceTag";
import "../renterLayout.scss";

export type serviceList = {
  selectedServices: LocationServiceSelectionDto[];
  services?: ServiceDto[];
  updateSelectedService: (index: number, updatedService: any) => void;
  removeSelectedService: (index: number) => void;
};

export const ServiceList = (props: serviceList) => {
  const {
    selectedServices,
    services,
    updateSelectedService,
    removeSelectedService,
  } = props;
  

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
        const resolvePaidPrice = () => {
          const currentPrice = Number(service.customPrice ?? 0);
          const catalogPrice = Number(catalogService?.servicePrice ?? 0);

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
                <span>Dịch vụ này đang</span>
                <span className="renter-inlineControl renter-inlineControl--status">
                  <Select
                    size="small"
                    value={service.customPrice === 0 ? "FREE" : "PAID"}
                    onChange={(value) =>
                      updateSelectedService(index, {
                        customPrice:
                          value === "FREE"
                            ? 0
                            : resolvePaidPrice(),
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
                    <span>, tính giá</span>
                    <span className="renter-inlineControl renter-inlineControl--type">
                      <Select
                        size="small"
                        value={
                          service.pricingType ?? DEFAULT_SERVICE_PRICING_TYPE
                        }
                        onChange={(value) =>
                          updateSelectedService(index, {
                            pricingType: value as ServicePricingType,
                          })
                        }
                        options={[
                          { value: "FULL", label: "trọn gói" },
                          { value: "DAILY", label: "theo ngày" },
                        ]}
                      />
                    </span>
                    <span>, giá áp dụng là</span>
                    <span className="renter-inlineControl renter-inlineControl--price">
                      <input
                        className="renter-nativeInput renter-inlinePriceInput"
                        value={String(servicePrice)}
                        disabled={!paid}
                        onChange={(event) =>
                          updateSelectedService(index, {
                            customPrice: Number(event.target.value || 0),
                          })
                        }
                        placeholder="0"
                        inputMode="numeric"
                      />
                    </span>
                    <span>vnđ.</span>
                  </>
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
