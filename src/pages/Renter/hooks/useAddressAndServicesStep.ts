import { Form } from "antd";
import { useMemo, useState, useCallback } from "react";
import type {
  LocationServiceSelectionDto,
  ServiceDto,
  ServicePricingType,
} from "@api/dtos/location.dto";
import { DEFAULT_CUSTOM_SERVICE_STATE } from "@common/constants/renter";
import type {
  AddressDraftPatch,
  AddressAndServicesStepSubmitValue,
  CustomServiceComposerState,
} from "@common/types/renter";
import type { CreateLocationDraft } from "@features/locationCreation/types";
import {
  createCatalogServiceSelection,
  createCustomServiceSelection,
  filterAvailableCatalogServices,
} from "@features/locationCreation/services";
import { useCreateService } from "@features/locationCreation/useCreateService";
import { useMapAddressPicker } from "@features/mapAddress/useMapAddressPicker";
import { useAddressDraftController } from "@pages/Renter/hooks/useAddressDraftController";

interface UseAddressAndServicesStepProps {
  draft: CreateLocationDraft;
  services?: ServiceDto[];
  onNext: (value: AddressAndServicesStepSubmitValue) => void;
  onStepChange: (nextStep: number) => void;
  onAddressDraftChange: (patch: AddressDraftPatch) => void;
  onServicesDraftChange: (services: LocationServiceSelectionDto[]) => void;
}

export const useAddressAndServicesStep = ({
  draft,
  services,
  onNext,
  onStepChange,
  onAddressDraftChange,
  onServicesDraftChange,
}: UseAddressAndServicesStepProps) => {
  const [form] = Form.useForm();
  const { mutate: createService } = useCreateService();

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

  const { resolveCoordinates, searchState } = useMapAddressPicker({
    initialAddress: draft.address,
    hasSearch: true,
    onAddressResolved: handleMapAddressResolved,
  });

  const [selectedServices, setSelectedServices] = useState<
    LocationServiceSelectionDto[]
  >(draft.services);
  const [serviceQuery, setServiceQuery] = useState("");
  const [customService, setCustomService] =
    useState<CustomServiceComposerState>(DEFAULT_CUSTOM_SERVICE_STATE);

  const filteredCatalog = useMemo(
    () =>
      filterAvailableCatalogServices(services, selectedServices, serviceQuery),
    [selectedServices, serviceQuery, services],
  );

  const serviceOptions = useMemo(() => {
    if (filteredCatalog.length > 0) {
      return filteredCatalog.map((service: ServiceDto) => ({
        value: service.serviceCode,
        label: `${service.serviceName || (service as any).name}`,
      }));
    }

    if (serviceQuery.trim()) {
      return [
        {
          value: "__create_new__",
          label: `Tạo mới: ${serviceQuery}`,
        },
      ];
    }

    return [];
  }, [filteredCatalog, serviceQuery]);

  const updateSelectedService = useCallback((
    index: number,
    value: Partial<LocationServiceSelectionDto>,
  ) => {
    const nextServices = selectedServices.map((service, serviceIndex) =>
      serviceIndex === index ? { ...service, ...value } : service,
    );
    setSelectedServices(nextServices);
    onServicesDraftChange(nextServices);
  }, [onServicesDraftChange, selectedServices]);

  const removeSelectedService = useCallback((index: number) => {
    const nextServices = selectedServices.filter(
      (_, serviceIndex) => serviceIndex !== index,
    );
    setSelectedServices(nextServices);
    onServicesDraftChange(nextServices);
  }, [onServicesDraftChange, selectedServices]);

  const addCustomService = useCallback(() => {
    if (!customService.name.trim()) {
      return;
    }

    const nextServices = [
      ...selectedServices,
      createCustomServiceSelection({
        name: customService.name,
        description: customService.description,
        chargeType: customService.chargeType,
        unit: customService.unit,
        basePrice: customService.basePrice,
        quantity: customService.quantity,
      }),
    ];
    setSelectedServices(nextServices);
    onServicesDraftChange(nextServices);
    setCustomService(DEFAULT_CUSTOM_SERVICE_STATE);
  }, [customService, onServicesDraftChange, selectedServices]);

  const handleCreateNewService = useCallback(() => {
    if (!serviceQuery.trim()) return;

    createService(
      { name: serviceQuery, category: "GENERAL" },
      {
        onSuccess: (newService) => {
          const nextServices = [
            ...selectedServices,
            createCatalogServiceSelection(newService),
          ];
          setSelectedServices(nextServices);
          onServicesDraftChange(nextServices);
          setServiceQuery("");
          setCustomService(DEFAULT_CUSTOM_SERVICE_STATE);
        },
      },
    );
  }, [createService, onServicesDraftChange, selectedServices, serviceQuery]);

  const handleServiceSelectChange = useCallback((value: string | number) => {
    if (value === "__create_new__") {
      handleCreateNewService();
    } else {
      const selectedService = services?.find(
        (service) => service.serviceCode === value,
      );

      setCustomService((prev) => ({
        ...prev,
        name: selectedService?.serviceName || (selectedService as any)?.name || String(value),
      }));
    }
  }, [handleCreateNewService, services]);

  const handleStepChangeInternal = useCallback((nextStep: number) => {
    onAddressDraftChange(buildSubmitValue(form.getFieldsValue(true)));
    onServicesDraftChange(selectedServices);
    onStepChange(nextStep);
  }, [buildSubmitValue, form, onAddressDraftChange, onServicesDraftChange, onStepChange, selectedServices]);

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
    selectedServices,
    serviceQuery,
    customService,
    serviceOptions,
    setServiceQuery,
    setCustomService,
    updateSelectedService,
    removeSelectedService,
    addCustomService,
    handleServiceSelectChange,
    handleCreateNewService,
    handleFormValuesChange,
    handleStepChange: handleStepChangeInternal,
    handleFinish,
  };
};
