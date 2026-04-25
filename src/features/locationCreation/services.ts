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
  if (service.customPrice !== undefined && service.customPrice !== null) {
    return Number(service.customPrice);
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
  query: string,
) => {
  const normalizedQuery = query.trim().toLowerCase();
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
      service.serviceName.toLowerCase().includes(normalizedQuery) ||
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
  pricingType: DEFAULT_SERVICE_PRICING_TYPE,
  customPrice: 0,
});

export const createCustomServiceSelection = (
  payload: {
    name: string;
    description?: string;
    chargeType: "FREE" | "PAID";
    pricingType?: ServicePricingType;
    price?: number | string;
  },
): LocationServiceSelectionDto => {
  const normalizedPrice = Number(payload.price || 0);
  const resolvedPrice =
    payload.chargeType === "PAID" && Number.isFinite(normalizedPrice)
      ? normalizedPrice
      : 0;

  return {
    name: payload.name.trim(),
    description: payload.description?.trim() || undefined,
    pricingType: payload.pricingType ?? DEFAULT_SERVICE_PRICING_TYPE,
    customPrice: resolvedPrice,
  };
};

export const calculateSelectedServicesTotal = (
  services: Array<{
    servicePrice?: number | string;
    customPrice?: number | string;
  }>,
) =>
  services.reduce(
    (total, item) =>
      total +
      Number(
        item.customPrice !== undefined ? item.customPrice : item.servicePrice ?? 0,
      ),
    0,
  );
