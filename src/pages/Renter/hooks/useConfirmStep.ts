import { useMemo } from "react";
import { formatCurrencyVND } from "@common/contexts/format";
import type { LocationTypeDto, ServiceDto } from "@api/dtos/location.dto";
import type { CreateLocationDraft } from "@features/locationCreation/types";
import {
  calculateSelectedServicesTotal,
  getServiceDraftPrice,
} from "@features/locationCreation/services";

interface UseConfirmStepProps {
  draft: CreateLocationDraft;
  typeList?: LocationTypeDto[];
  services?: ServiceDto[];
}

export const useConfirmStep = ({
  draft,
  typeList,
  services,
}: UseConfirmStepProps) => {
  const selectedType = useMemo(
    () => typeList?.find((item) => item.typeCode === draft.basicInfo.typeCode),
    [draft.basicInfo.typeCode, typeList],
  );

  const selectedServices = useMemo(() => {
    return draft.services.map((selected) => {
      const catalogService = services?.find(
        (item) => item.serviceCode === selected.serviceCode,
      );

      return {
        ...selected,
        serviceCode: selected.serviceCode ?? catalogService?.serviceCode ?? "",
        serviceName:
          selected.name ||
          catalogService?.serviceName ||
          (catalogService as any)?.name ||
          "Dịch vụ",
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
  }, [draft.services, services]);

  const totalServicePrice = useMemo(
    () => calculateSelectedServicesTotal(selectedServices),
    [selectedServices],
  );

  const basicData = useMemo(() => ({
    label: "Thông tin cơ bản",
    value: [
      { label: "Loại", value: selectedType?.typeName || "-" },
      { label: "Tên phòng", value: draft.basicInfo.locationName || "-" },
      {
        label: "Diện tích",
        value: draft.basicInfo.area ? `${draft.basicInfo.area} m2` : "-",
      },
      {
        label: "Giá cho thuê",
        value: `${formatCurrencyVND(draft.basicInfo.price ?? 0)} ${draft.basicInfo.priceUnit}`,
      },
      { label: "Mô tả", value: draft.basicInfo.description || "-" },
      { label: "Ghi chú", value: draft.basicInfo.note || "-" },
    ],
  }), [draft.basicInfo, selectedType]);

  const addressData = useMemo(() => ({
    label: "Địa chỉ",
    value: [
      {
        label: "Thông tin chi tiết",
        value: draft.address.addressDetail || "-",
      },
      { label: "Địa chỉ đầy đủ", value: draft.address.fullAddress || "-" },
      { label: "Phường / Xã", value: draft.address.ward || "-" },
      { label: "Tỉnh / Thành phố", value: draft.address.city || "-" },
      { label: "Khu vực", value: draft.address.region || "-" },
    ],
  }), [draft.address]);

  const summaryRows = useMemo(() => [
    {
      label: "Số dịch vụ đã chọn",
      value: String(selectedServices.length),
    },
    {
      label: "Tổng phí dịch vụ",
      value: formatCurrencyVND(totalServicePrice),
    },
    {
      label: "Giá cho thuê",
      value: `${formatCurrencyVND(draft.basicInfo.price ?? 0)} ${draft.basicInfo.priceUnit}`,
    },
  ], [selectedServices.length, totalServicePrice, draft.basicInfo.price, draft.basicInfo.priceUnit]);

  return {
    selectedServices,
    totalServicePrice,
    basicData,
    addressData,
    summaryRows,
  };
};
