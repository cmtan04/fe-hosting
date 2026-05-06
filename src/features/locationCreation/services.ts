import type {
  LocationServiceSelectionDto,
  ServiceDto,
  ServicePricingType,
} from "../../api/dtos/location.dto";

export const DEFAULT_SERVICE_PRICING_TYPE: ServicePricingType = "FULL";

export const getServiceDraftPrice = (
  service: Partial<LocationServiceSelectionDto>,
  fallbackPrice?: number | string,
) => {
  if (service.isFree === true) {
    return 0;
  }

  if (service.basePrice !== undefined && service.basePrice !== null) {
    return Number(service.basePrice);
  }

  if (fallbackPrice !== undefined && fallbackPrice !== null) {
    return Number(fallbackPrice);
  }

  return 0;
};

export const isServicePaid = (
  service: Partial<LocationServiceSelectionDto>,
  fallbackPrice?: number | string,
) => getServiceDraftPrice(service, fallbackPrice) > 0;

export const isCatalogServiceSelection = (
  service: Partial<LocationServiceSelectionDto>,
) => Boolean(service.serviceCode);

export const filterAvailableCatalogServices = (
  services: ServiceDto[] | undefined,
  selectedServices: LocationServiceSelectionDto[],
  query?: string,
) => {
  const normalizedQuery = (query ?? "").trim().toLowerCase();
  const takenCodes = new Set(
    selectedServices
      .map((service) => service.serviceCode)
      .filter((value): value is string => Boolean(value)),
  );

  return (services ?? []).filter((service) => {
    if (takenCodes.has(service.serviceCode)) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return (
      (service.serviceName ?? "").toLowerCase().includes(normalizedQuery) ||
      (service.serviceDescription ?? "").toLowerCase().includes(normalizedQuery)
    );
  });
};

export const createCatalogServiceSelection = (
  service: ServiceDto,
): LocationServiceSelectionDto => ({
  serviceCode: service.serviceCode,
  name: service.serviceName,
  description: service.serviceDescription,
  isFree: service.isFree ?? true,
  basePrice: Number(service.basePrice ?? service.servicePrice ?? 0),
  unit: service.unit ?? DEFAULT_SERVICE_PRICING_TYPE,
  quantity: service.quantity ?? 1,
});

export const createCustomServiceSelection = (
  payload: {
    name: string;
    description?: string;
    chargeType: "FREE" | "PAID";
    unit?: ServicePricingType;
    basePrice?: number | string;
    quantity?: number | string;
  },
): LocationServiceSelectionDto => {
  const normalizedPrice = Number(payload.basePrice || 0);
  const resolvedPrice =
    payload.chargeType === "PAID" && Number.isFinite(normalizedPrice)
      ? normalizedPrice
      : 0;
  const normalizedQuantity = Number(payload.quantity || 1);

  return {
    name: payload.name.trim(),
    description: payload.description?.trim() || undefined,
    isFree: payload.chargeType === "FREE",
    basePrice: resolvedPrice,
    unit: payload.unit ?? DEFAULT_SERVICE_PRICING_TYPE,
    quantity:
      Number.isFinite(normalizedQuantity) && normalizedQuantity > 0
        ? normalizedQuantity
        : 1,
  };
};

export const calculateSelectedServicesTotal = (
  services: Array<{
    servicePrice?: number | string;
    basePrice?: number | string;
    isFree?: boolean;
  }>,
) =>
  services.reduce(
    (total, item) =>
      total +
      (item.isFree
        ? 0
        : Number(item.basePrice ?? item.servicePrice ?? 0) *
          Number((item as { quantity?: number | string }).quantity ?? 1)),
    0,
  );
