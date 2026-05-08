import type {
  LocationServiceSelectionDto,
  ServiceDto
} from "@api/dtos/location.dto";
import { DEFAULT_SERVICE_PRICING_TYPE } from "@features/locationCreation/services";
import type { CustomServiceComposerState } from "@common/types/renter";

export {
  resolveServiceUnit
} from "@features/locationCreation/services"


/**
 * Lấy mã định danh của dịch vụ.
 * Linh hoạt xử lý cả hai trường hợp field trả về từ API là serviceCode hoặc code.
 */
export const getCode = (service: ServiceDto): string =>
  service.serviceCode || (service as any).code || "";

/**
 * Lấy tên hiển thị của dịch vụ.
 */
export const getName = (service: ServiceDto): string =>
  service.serviceName || (service as any).name || "";

/**
 * Lọc danh sách dịch vụ gợi ý từ hệ thống.
 * Loại bỏ các dịch vụ đã nằm trong danh sách chọn để tránh trùng lặp.
 */
export const filterAvailableCatalogServices = (
  services: ServiceDto[] | undefined,
  selectedServices: LocationServiceSelectionDto[],
  query?: string,
): ServiceDto[] => {
  const normalizedQuery = (query ?? "").trim().toLowerCase();
  
  // Tạo tập hợp các mã dịch vụ đã chọn để tra cứu nhanh (O(1))
  const takenCodes = new Set(
    selectedServices
      .map((service) => service.serviceCode)
      .filter((value): value is string => Boolean(value)),
  );

  return (services ?? []).filter((service) => {
    const code = getCode(service);
    if (takenCodes.has(code)) {
      return false; // Đã chọn rồi thì không hiện lại trong gợi ý
    }

    if (!normalizedQuery) {
      return true; // Không tìm kiếm thì hiện tất cả
    }

    const serviceName = getName(service).toLowerCase();
    const serviceDescription = (service.serviceDescription || (service as any).description || "").toLowerCase();

    // Tìm kiếm theo tên hoặc mô tả
    return (
      serviceName.includes(normalizedQuery) ||
      serviceDescription.includes(normalizedQuery)
    );
  });
};

/**
 * Ánh xạ thông tin dịch vụ sang định dạng Option của component Select (Ant Design).
 */
export const mapServiceToOption = (service: ServiceDto) => ({
  value: getCode(service),
  label: getName(service),
});

/**
 * Khởi tạo dữ liệu dịch vụ khi chọn từ danh mục hệ thống (Catalog).
 */
export const createCatalogServiceSelection = (
  service: ServiceDto,
): LocationServiceSelectionDto => ({
  serviceCode: getCode(service),
  name: getName(service),
  description: service.serviceDescription || (service as any).description,
  isFree: service.isFree ?? true,
  basePrice: Number(service.basePrice ?? service.servicePrice ?? 0),
  unit: service.unit || DEFAULT_SERVICE_PRICING_TYPE,
  quantity: service.quantity ?? 1,
});

/**
 * Chuyển đổi trạng thái bản nháp (CustomServiceComposerState) 
 * sang định dạng chuẩn để lưu vào danh sách (LocationServiceSelectionDto).
 */
export const createCustomServiceSelection = (
  state: CustomServiceComposerState,
): LocationServiceSelectionDto => {
  // Chuyển chuỗi nhập liệu sang số
  const normalizedPrice = Number(state.basePrice || 0);
  
  // Xác định đơn giá thực tế (nếu Miễn phí thì luôn là 0)
  const resolvedPrice =
    state.chargeType === "PAID" && Number.isFinite(normalizedPrice)
      ? normalizedPrice
      : 0;

  return {
    serviceCode: state.serviceCode,
    name: state.name.trim(),
    description: state.description?.trim() || undefined,
    isFree: state.chargeType === "FREE",
    basePrice: resolvedPrice,
    unit: state.unit || DEFAULT_SERVICE_PRICING_TYPE
  };
};

/**
 * Quyết định giá hiển thị cho một lựa chọn dịch vụ.
 */
export const getServiceSelectionPrice = (
  service: LocationServiceSelectionDto,
  catalogService?: ServiceDto,
): number => {
  if (service.isFree) return 0;
  
  // Ưu tiên giá đã lưu trong selection, sau đó mới đến giá mặc định từ catalog
  if (service.basePrice !== undefined && service.basePrice !== null) {
    return Number(service.basePrice);
  }
  return Number(catalogService?.basePrice ?? catalogService?.servicePrice ?? 0);
};

/**
 * Chuẩn hóa số lượng dịch vụ.
 */
export const normalizeQuantity = (value: string | number): number => {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? Math.floor(num) : 1;
};

/**
 * Xác định tên hiển thị cuối cùng của dịch vụ.
 */
export const resolveServiceName = (
  service: LocationServiceSelectionDto,
  catalogService?: ServiceDto,
): string => {
  return service.name || (catalogService ? getName(catalogService) : "") || service.serviceCode || "Dịch vụ";
};


