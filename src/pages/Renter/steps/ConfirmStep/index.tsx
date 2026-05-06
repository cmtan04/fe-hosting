import { Button, Col, Row, Steps } from "antd";
import { useMemo } from "react";
import icnClear from "../../../../assets/svg/icn-clear.svg";
import { STEP_ITEMS } from "../../../../common/constants/renter";
import { formatCurrencyVND } from "../../../../common/contexts/format";
import type { LocationTypeDto, ServiceDto } from "../../../../api/dtos/location.dto";
import type { CreateLocationDraft } from "../../../../features/locationCreation/types";
import {
  calculateSelectedServicesTotal,
  getServiceDraftPrice,
} from "../../../../features/locationCreation/services";
import { LocationMediaEditor } from "@/components/LocationMediaEditor";
import { ServiceTag } from "../../components/ServiceTag";
import { SummaryPanel } from "../../components/SummaryPanel";
import "./confirmStep.scss";

interface ConfirmStepProps {
  draft: CreateLocationDraft;
  typeList?: LocationTypeDto[];
  services?: ServiceDto[];
  currentStep: number;
  onBack: () => void;
  onCancel: () => void;
  onSubmit: () => void;
  onStepChange: (nextStep: number) => void;
  isSubmitting: boolean;
  isUploading: boolean;
  onUpload: (files: FileList) => void;
  onRemoveMedia: (id: string) => void;
  onSetAvatar: (id: string) => void;
}

export const ConfirmStep = ({
  draft,
  typeList,
  services,
  currentStep,
  onBack,
  onSubmit,
  onCancel,
  onStepChange,
  isSubmitting,
  isUploading,
  onUpload,
  onRemoveMedia,
  onSetAvatar,
}: ConfirmStepProps) => {
  const selectedType = typeList?.find(
    (item) => item.typeCode === draft.basicInfo.typeCode,
  );

  const selectedServices = draft.services.map((selected) => {
    const catalogService = services?.find(
      (item) => item.serviceCode === selected.serviceCode,
    );

    return {
      ...selected,
      serviceCode: selected.serviceCode ?? catalogService?.serviceCode ?? "",
      serviceName: selected.name ?? catalogService?.serviceName ?? "Dich vu",
      serviceDescription:
        selected.description ?? catalogService?.serviceDescription ?? "",
      serviceLogo: catalogService?.serviceLogo ?? "",
      servicePrice: getServiceDraftPrice(
        selected,
        catalogService?.basePrice ?? catalogService?.servicePrice,
      ),
      unit: selected.unit ?? catalogService?.unit ?? "FULL",
      isFree: selected.isFree ?? Number(selected.basePrice ?? 0) <= 0,
      basePrice: Number(selected.basePrice ?? catalogService?.basePrice ?? 0),
      quantity: Number(selected.quantity ?? catalogService?.quantity ?? 1),
    };
  });

  const totalServicePrice = useMemo(
    () => calculateSelectedServicesTotal(selectedServices),
    [selectedServices],
  );

  const basicData = {
    label: "Thong tin co ban",
    value: [
      { label: "Loai", value: selectedType?.typeName || "-" },
      { label: "Ten phong", value: draft.basicInfo.locationName || "-" },
      {
        label: "Dien tich",
        value: draft.basicInfo.area ? `${draft.basicInfo.area} m2` : "-",
      },
      {
        label: "Gia cho thue",
        value: formatCurrencyVND(draft.basicInfo.finalPrice ?? 0),
      },
      { label: "Mo ta", value: draft.basicInfo.description || "-" },
      { label: "Ghi chu", value: draft.basicInfo.note || "-" },
    ],
  };

  const addressData = {
    label: "Dia chi",
    value: [
      {
        label: "Thong tin chi tiet",
        value: draft.address.addressDetail || "-",
      },
      { label: "Dia chi day du", value: draft.address.fullAddress || "-" },
      { label: "Phuong / Xa", value: draft.address.ward || "-" },
      { label: "Tinh / Thanh pho", value: draft.address.city || "-" },
      { label: "Khu vuc", value: draft.address.region || "-" },
    ],
  };

  return (
    <div className="renter">
      <div className="renter__confirm-header">
        <h1 className="header-title">Xac nhan thong tin</h1>
        <button
          className="header-close"
          onClick={onCancel}
          type="button"
          aria-label="Close"
        >
          <img
            src={icnClear}
            alt="X"
          />
        </button>
      </div>
      <Steps
        current={currentStep}
        items={STEP_ITEMS}
        className="renter-steps"
        onChange={onStepChange}
      />
      <Row gutter={[16, 16]} className="renter-confirmGrid">
        <Col span={16}>
          <div className="renter__confirm-section row-1">
            <h1 className="renter__confirm-section-title">{basicData.label}</h1>
            <div className="renter-kvTable">
              {basicData.value.map((item, index) => (
                <div className="row" key={index}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
          <div className="renter__confirm-section row-2">
            <h1 className="renter__confirm-section-title">
              {addressData.label}
            </h1>
            <div className="renter-kvTable">
              {addressData.value.map((item, index) => (
                <div className="row" key={index}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div className="renter-sectionBand">
            <div className="renter-sectionBand-header">
              <h2>Tập đính kèm</h2>
            </div>
            <LocationMediaEditor
              media={draft.basicInfo.media}
              isUploading={isUploading}
              inputId="upload-basic-media"
              emptyLabel="Chưa tải lên tập đính kèm nào"
              onUpload={onUpload}
              onRemove={onRemoveMedia}
              onSetAvatar={onSetAvatar}
            />
          </div>
          <SummaryPanel
            title="Chi phi va dich vu"
            rows={[
              {
                label: "So dich vu da chon",
                value: String(selectedServices.length),
              },
              {
                label: "Tong phi dich vu",
                value: formatCurrencyVND(totalServicePrice),
              },
              {
                label: "Gia cho thue",
                value: formatCurrencyVND(draft.basicInfo.finalPrice ?? 0),
              },
            ]}
          />
          <div className="renter__confirm-section row-3">
            <h1 className="renter__confirm-section-title">Dich vu da chon</h1>
            <div className="wrapper__content">
              {selectedServices.map((item) => (
                <ServiceTag
                  key={`${item.serviceCode}-${item.serviceName}`}
                  icon={item.serviceLogo}
                  name={`${item.serviceName}${item.unit === "DAILY" ? " - Theo ngay" : " - Tron goi"} x${item.quantity}`}
                  price={item.servicePrice}
                  description={item.serviceDescription}
                  active={true}
                />
              ))}
            </div>
          </div>
        </Col>
      </Row>
      <div className="renter__confirm-section row-5">
        <Button htmlType="button" onClick={onBack} className="button-cancel">
          Quay lai
        </Button>
        <Button
          htmlType="button"
          className="button-submit"
          onClick={onSubmit}
          loading={isSubmitting}
        >
          Dang phong
        </Button>
      </div>
    </div>
  );
};
