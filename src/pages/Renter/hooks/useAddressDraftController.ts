import { useCallback, useMemo, useState } from "react";
import type { FormInstance } from "antd";
import type { MapAddressDto } from "../../../api/dtos/map.dto";
import {
  createAddressFormValuesFromDraft,
  createDraftAddressFromFormValues,
  createDraftAddressFromMapResult,
  createMapViewDataFromDraftAddress,
} from "../../../features/mapAddress/address";
import type { CreateLocationDraft } from "../../../features/locationCreation/types";

export const useAddressDraftController = ({
  form,
  draftAddress,
  onAddressDraftChange,
}: {
  form: FormInstance;
  draftAddress: CreateLocationDraft["address"];
  onAddressDraftChange: (value: CreateLocationDraft["address"]) => void;
}) => {
  const [resolvedAddress, setResolvedAddress] = useState(() => draftAddress);

  const syncFormValues = useCallback(
    (nextAddress: CreateLocationDraft["address"]) => {
      form.setFieldsValue(createAddressFormValuesFromDraft(nextAddress));
    },
    [form],
  );

  const syncAddress = useCallback(
    (nextAddress: CreateLocationDraft["address"]) => {
      setResolvedAddress(nextAddress);
      syncFormValues(nextAddress);
      onAddressDraftChange(nextAddress);
    },
    [onAddressDraftChange, syncFormValues],
  );

  const handleMapAddressResolved = useCallback(
    (value: MapAddressDto) => {
      const nextAddress = createDraftAddressFromMapResult(value, {
        ...resolvedAddress,
        addressDetail:
          form.getFieldValue("addressDetail") ?? resolvedAddress.addressDetail,
        description:
          form.getFieldValue("description") ?? resolvedAddress.description,
        note: form.getFieldValue("note") ?? resolvedAddress.note,
      });
      syncAddress(nextAddress);
    },
    [form, resolvedAddress, syncAddress],
  );

  const handleFormValuesChange = useCallback(
    (allValues: Partial<CreateLocationDraft["address"]>) => {
      const nextAddress = createDraftAddressFromFormValues(allValues, resolvedAddress);
      syncAddress(nextAddress);
    },
    [resolvedAddress, syncAddress],
  );

  const buildSubmitValue = useCallback(
    (formValues: Partial<CreateLocationDraft["address"]>) =>
      createDraftAddressFromFormValues(formValues, resolvedAddress),
    [resolvedAddress],
  );

  const mapData = useMemo(
    () => createMapViewDataFromDraftAddress(resolvedAddress),
    [resolvedAddress],
  );

  return {
    mapData,
    resolvedAddress,
    initialFormValues: createAddressFormValuesFromDraft(draftAddress),
    handleMapAddressResolved,
    handleFormValuesChange,
    buildSubmitValue,
  };
};
