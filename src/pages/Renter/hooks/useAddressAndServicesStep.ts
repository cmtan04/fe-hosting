import { Form } from "antd";
import { useCallback } from "react";
import type {
  LocationServiceSelectionDto,
  ServiceDto,
} from "@api/dtos/location.dto";
import type {
  AddressDraftPatch,
  AddressAndServicesStepSubmitValue,
} from "@common/types/renter";
import type { CreateLocationDraft } from "@features/locationCreation/types";
import { useMapAddressPicker } from "@features/mapAddress/useMapAddressPicker";
import { useAddressDraftController } from "@pages/Renter/hooks/useAddressDraftController";
import { useServiceManager } from "../steps/AddressAndServicesStep/hooks/useServiceManager";

interface UseAddressAndServicesStepProps {
  draft: CreateLocationDraft;
  services?: ServiceDto[];
  onNext: (value: AddressAndServicesStepSubmitValue) => void;
  onStepChange: (nextStep: number) => void;
  onAddressDraftChange: (patch: AddressDraftPatch) => void;
  onServicesDraftChange: (services: LocationServiceSelectionDto[]) => void;
}

/**
 * Hook điều phối chính cho Step 2: Địa chỉ và Dịch vụ
 * Kết hợp logic quản lý bản đồ, tìm kiếm địa chỉ và quản lý danh sách dịch vụ
 */
export const useAddressAndServicesStep = ({
  draft,
  services,
  onNext,
  onStepChange,
  onAddressDraftChange,
  onServicesDraftChange,
}: UseAddressAndServicesStepProps) => {
  const [form] = Form.useForm();

  // Hook quản lý dữ liệu bản nháp địa chỉ và đồng bộ với Form của AntD
  const {
    initialFormValues,
    handleMapAddressResolved,
    handleFormValuesChange,
    buildSubmitValue,
    mapData,
  } = useAddressDraftController({
    form,
    draftAddress: draft.address,
    onAddressDraftChange,
  });

  // Hook quản lý việc tìm kiếm và chọn vị trí trên bản đồ Leaflet
  const { resolveCoordinates, searchState } = useMapAddressPicker({
    initialAddress: draft.address,
    hasSearch: true,
    onAddressResolved: handleMapAddressResolved,
  });

  // Hook chuyên biệt để quản lý toàn bộ logic nghiệp vụ của phần Dịch vụ & Tiện ích
  const {
    selectedServices,
    serviceQuery,
    customService,
    serviceOptions,
    setServiceQuery,
    setCustomService,
    removeService,
    updateService,
    handleAddCustom: handleAddCustomRaw,
    handleSelectChange,
  } = useServiceManager({
    initialServices: draft.services,
    catalogServices: services,
    onServicesChange: onServicesDraftChange,
    form,
  });

  /**
   * Đồng bộ giá trị từ Form sang State của Custom Service và Địa chỉ
   */
  const handleFormValuesChangeInternal = useCallback(
    (allValues: any) => {
      // 1. Cập nhật địa chỉ (qua controller)
      handleFormValuesChange(allValues);

      // 2. Cập nhật thông tin dịch vụ đang soạn thảo nếu có thay đổi đơn giá hoặc đơn vị
      if (allValues.basePrice !== undefined || allValues.unit !== undefined) {
        setCustomService((prev) => ({
          ...prev,
          basePrice:
            allValues.basePrice !== undefined
              ? String(allValues.basePrice)
              : prev.basePrice,
          unit: allValues.unit !== undefined ? allValues.unit : prev.unit,
        }));
      }
    },
    [handleFormValuesChange, setCustomService],
  );

  /**
   * Thêm dịch vụ và reset các trường liên quan trong Form
   */
  const handleAddCustom = useCallback(() => {
    handleAddCustomRaw();
    form.setFieldsValue({
      basePrice: undefined,
      unit: undefined,
    });
  }, [form, handleAddCustomRaw]);

  /**
   * Lưu trạng thái hiện tại vào bản nháp và chuyển sang step khác
   */
  const handleStepChangeInternal = useCallback((nextStep: number) => {
    onAddressDraftChange(buildSubmitValue(form.getFieldsValue(true)));
    onServicesDraftChange(selectedServices);
    onStepChange(nextStep);
  }, [buildSubmitValue, form, onAddressDraftChange, onServicesDraftChange, onStepChange, selectedServices]);

  /**
   * Hoàn thành Step 2 và chuyển sang Step tiếp theo
   */
  const handleFinish = useCallback((values: any) => {
    onNext({
      ...buildSubmitValue(values),
      services: selectedServices,
    });
  }, [buildSubmitValue, onNext, selectedServices]);

  return {
    form,
    mapData,
    searchState,
    resolveCoordinates,
    initialFormValues,
    // Trạng thái dịch vụ
    selectedServices,
    serviceQuery,
    customService,
    serviceOptions,
    setServiceQuery,
    setCustomService,
    updateService,
    removeService,
    handleAddCustom,
    handleSelectChange,
    // Trạng thái form và điều hướng
    handleFormValuesChange: handleFormValuesChangeInternal,
    handleStepChange: handleStepChangeInternal,
    handleFinish,
  };
};


