import { useState, useCallback, useMemo } from "react";
import type {
  LocationServiceSelectionDto,
  ServiceDto,
} from "@api/dtos/location.dto";
import { DEFAULT_CUSTOM_SERVICE_STATE } from "@common/constants/renter";
import type { CustomServiceComposerState } from "@common/types/renter";
import { useCreateService } from "@features/locationCreation/useCreateService";
import {
  filterAvailableCatalogServices,
  mapServiceToOption,
  createCatalogServiceSelection,
  createCustomServiceSelection,
  getCode,
  getName,
} from "../utils/service.utils";

import type { FormInstance } from "antd";
import { DEFAULT_SERVICE_PRICING_TYPE } from "@/features/locationCreation/services";

interface UseServiceManagerProps {
  initialServices: LocationServiceSelectionDto[];
  catalogServices?: ServiceDto[];
  onServicesChange: (services: LocationServiceSelectionDto[]) => void;
  form?: FormInstance;
}

/**
 * Hook quản lý logic nghiệp vụ cho phần dịch vụ và tiện ích.
 * Phụ trách: 
 * 1. Quản lý danh sách dịch vụ đã chọn (selectedServices).
 * 2. Tìm kiếm và gợi ý dịch vụ từ danh mục hệ thống (catalogServices).
 * 3. Quản lý trạng thái bản nháp (customService) khi người dùng đang nhập thông tin dịch vụ mới.
 */
export const useServiceManager = ({
  initialServices,
  catalogServices,
  onServicesChange,
  form,
}: UseServiceManagerProps) => {
  // 1. DANH SÁCH ĐÃ CHỌN: Lưu trữ các dịch vụ người dùng đã quyết định thêm vào địa điểm
  const [selectedServices, setSelectedServices] = useState<
    LocationServiceSelectionDto[]
  >(initialServices);

  // 2. TỪ KHÓA TÌM KIẾM: Chuỗi ký tự người dùng nhập vào ô Select để tìm dịch vụ
  const [serviceQuery, setServiceQuery] = useState("");

  // 3. TRẠNG THÁI SOẠN THẢO: Chứa dữ liệu của dịch vụ hiện tại đang được "soạn" trong form thêm mới
  const [customService, setCustomService] =
    useState<CustomServiceComposerState>(DEFAULT_CUSTOM_SERVICE_STATE);

  // Hook gọi API để tạo một loại dịch vụ mới hoàn toàn trong hệ thống (nếu chưa tồn tại trong danh mục)
  const { mutate: createService } = useCreateService();

  // 4. LOGIC GỢI Ý (OPTIONS): Tính toán các lựa chọn hiển thị trong dropdown Select
  const serviceOptions = useMemo(() => {
    // Lọc các dịch vụ từ danh mục hệ thống (bỏ qua những cái đã chọn) dựa trên từ khóa tìm kiếm
    const filtered = filterAvailableCatalogServices(
      catalogServices,
      selectedServices,
      serviceQuery,
    );

    // Chuyển đổi sang định dạng { label, value } cho component Select
    const options = filtered.map(mapServiceToOption);

    // Nếu người dùng nhập tên dịch vụ mới (không có trong danh mục), hiện tùy chọn "Tạo mới"
    if (serviceQuery.trim()) {
      const exactMatch = options.find(opt => opt.label.toLowerCase() === serviceQuery.trim().toLowerCase());
      if (!exactMatch) {
        options.push({
          value: `create_new:${serviceQuery.trim()}`,
          label: `Tạo dịch vụ mới: ${serviceQuery.trim()}`,
        });
      }
    }

    // Đảm bảo dịch vụ đang chọn hiện tại luôn có trong options để Select không bị trống label
    const currentVal = customService.serviceCode || customService.name;
    if (currentVal && !options.find(opt => opt.value === currentVal)) {
      options.push({
        value: currentVal,
        label: customService.name
      });
    }

    return options;
  }, [catalogServices, selectedServices, serviceQuery, customService.serviceCode, customService.name]);


  /**
   * Cập nhật danh sách dịch vụ lên cấp cha (Step Draft) để lưu trữ vào bản nháp lớn
   */
  const updateParent = useCallback(
    (nextServices: LocationServiceSelectionDto[]) => {
      setSelectedServices(nextServices);
      onServicesChange(nextServices);
    },
    [onServicesChange],
  );

  /**
   * Thêm một dịch vụ đã chuẩn hóa vào danh sách chính thức
   */
  const addService = useCallback(
    (service: LocationServiceSelectionDto) => {
      const nextServices = [...selectedServices, service];
      updateParent(nextServices);
    },
    [selectedServices, updateParent],
  );

  /**
   * Xóa dịch vụ dựa trên vị trí trong danh sách
   */
  const removeService = useCallback(
    (index: number) => {
      const nextServices = selectedServices.filter((_, i) => i !== index);
      updateParent(nextServices);
    },
    [selectedServices, updateParent],
  );

  /**
   * Cập nhật thông tin chi tiết của một dịch vụ đã nằm trong danh sách chọn (Ví dụ: sửa giá sau khi đã thêm)
   * Lưu ý: Hiện tại FE đã chuyển sang chế độ read-only cho danh sách, nên hàm này ít được dùng trực tiếp từ UI.
   */
  const updateService = useCallback(
    (index: number, patch: Partial<LocationServiceSelectionDto>) => {
      const nextServices = selectedServices.map((s, i) =>
        i === index ? { ...s, ...patch } : s,
      );
      updateParent(nextServices);
    },
    [selectedServices, updateParent],
  );

  /**
   * XỬ LÝ KHI CHỌN TỪ SELECT:
   * Khi người dùng click vào một gợi ý trong dropdown.
   */
  const handleSelectChange = useCallback(
    (value: string | number | null | undefined) => {
      // Nếu xóa trắng ô nhập
      if (!value) {
        setServiceQuery("");
        setCustomService(DEFAULT_CUSTOM_SERVICE_STATE);
        return;
      }

      const stringVal = String(value);

      // A. Trường hợp người dùng chọn "Tạo dịch vụ mới: ..."
      if (stringVal.startsWith("create_new:")) {
        const newName = stringVal.replace("create_new:", "");
        setCustomService((prev) => ({
          ...prev,
          serviceCode: undefined, // Chưa có mã vì chưa gọi API tạo
          name: newName,
        }));
        // Reset form nhập giá/đơn vị về mặc định cho dịch vụ mới
        form?.setFieldsValue({
          basePrice: undefined,
          unit: undefined,
        });
        setServiceQuery("");
      } 
      // B. Trường hợp chọn một dịch vụ đã tồn tại trong danh mục hệ thống
      else {
        const catalogService = catalogServices?.find(
          (s) => getCode(s) === stringVal,
        );

        if (catalogService) {
          // Lấy thông tin mặc định từ hệ thống để điền vào form
          const basePrice = String(
            catalogService.basePrice || catalogService.servicePrice || 0,
          );
          const unit = catalogService.unit || DEFAULT_SERVICE_PRICING_TYPE;

          setCustomService((prev) => ({
            ...prev,
            serviceCode: getCode(catalogService),
            name: getName(catalogService),
            basePrice,
            unit,
            chargeType: (catalogService.isFree ?? true) ? "FREE" : "PAID",
          }));

          // Đồng bộ thông tin mặc định vào UI Form (ô nhập giá và đơn vị)
          form?.setFieldsValue({
            basePrice: (catalogService.isFree ?? true) ? undefined : Number(basePrice),
            unit,
          });

          setServiceQuery("");
        } else {
          // Trường hợp chọn lại chính cái tên đang soạn thảo
          setCustomService((prev) => ({
            ...prev,
            name: stringVal,
          }));
          setServiceQuery("");
        }
      }
    },
    [catalogServices, form],
  );



  /**
   * XỬ LÝ KHI NHẤN NÚT "THÊM DỊCH VỤ":
   * Chốt thông tin từ form soạn thảo và đưa vào danh sách chính thức.
   */
  const handleAddCustom = useCallback(() => {
    const nameToUse = customService.name.trim() || serviceQuery.trim();
    if (!nameToUse) return;

    /**
     * LUỒNG 1: Dịch vụ đã có sẵn trong danh mục (đã có serviceCode)
     * Chỉ cần map dữ liệu người dùng vừa nhập và thêm vào danh sách.
     */
    if (customService.serviceCode) {
      addService(createCustomServiceSelection({ ...customService, name: nameToUse }));
      setServiceQuery("");
      setCustomService(DEFAULT_CUSTOM_SERVICE_STATE);
      // Xóa trắng form để nhập cái tiếp theo
      form?.setFieldsValue({ basePrice: undefined, unit: undefined });
      return;
    }

    /**
     * LUỒNG 2: Dịch vụ mới hoàn toàn (Custom Service)
     * 1. Gọi API createService để đăng ký tên dịch vụ mới vào hệ thống.
     * 2. API trả về thông tin dịch vụ (kèm mã code mới tạo).
     * 3. Kết hợp mã code đó với Đơn giá/Đơn vị mà người dùng vừa nhập ở Form.
     * 4. Thêm kết quả cuối cùng vào danh sách chọn.
     */
    createService(
      { name: nameToUse, category: "GENERAL" },
      {
        onSuccess: (newService) => {
          // Lấy cấu trúc cơ bản từ dịch vụ mới tạo
          const selection = createCatalogServiceSelection(newService);
          
          // Ghi đè các giá trị Đơn giá/Đơn vị mà người dùng đã nhập ở FE 
          // (Vì API createService chỉ nhận name, không nhận giá cụ thể cho location này)
          addService({
            ...selection,
            isFree: customService.chargeType === "FREE",
            basePrice: Number(customService.basePrice || 0),
            unit: customService.unit || DEFAULT_SERVICE_PRICING_TYPE,
          });
          
          // Dọn dẹp trạng thái sau khi thêm thành công
          setServiceQuery("");
          setCustomService(DEFAULT_CUSTOM_SERVICE_STATE);
          form?.setFieldsValue({
            basePrice: undefined,
            unit: undefined,
          });
        },
      },
    );
  }, [addService, createService, customService, serviceQuery, form]);

  return {
    selectedServices,
    serviceQuery,
    customService,
    serviceOptions,
    setServiceQuery,
    setCustomService,
    addService,
    removeService,
    updateService,
    handleAddCustom,
    handleSelectChange,
  };
};
