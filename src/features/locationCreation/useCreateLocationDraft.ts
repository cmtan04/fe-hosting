import { useEffect, useMemo, useState } from "react";
import {
  createEmptyLocationDraft,
  type CreateLocationDraft,
} from "./types";

const STORAGE_KEY = "create_location_draft_v2";

const readDraft = (): CreateLocationDraft => {
  if (typeof window === "undefined") {
    return createEmptyLocationDraft();
  }

  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return createEmptyLocationDraft();
  }

  try {
    return {
      ...createEmptyLocationDraft(),
      ...JSON.parse(raw),
    } as CreateLocationDraft;
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return createEmptyLocationDraft();
  }
};

export const useCreateLocationDraft = () => {
  const [draft, setDraft] = useState<CreateLocationDraft>(readDraft);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [draft]);

  const actions = useMemo(
    () => ({
      updateBasicInfo: (value: Partial<CreateLocationDraft["basicInfo"]>) => {
        setDraft((prev) => ({
          ...prev,
          basicInfo: { ...prev.basicInfo, ...value },
        }));
      },
      updateAddress: (value: Partial<CreateLocationDraft["address"]>) => {
        setDraft((prev) => ({
          ...prev,
          address: { ...prev.address, ...value },
        }));
      },
      updateServiceCodes: (serviceCodes: string[]) => {
        setDraft((prev) => ({
          ...prev,
          serviceCodes,
        }));
      },
      reset: () => {
        const nextDraft = createEmptyLocationDraft();
        setDraft(nextDraft);
        if (typeof window !== "undefined") {
          sessionStorage.removeItem(STORAGE_KEY);
        }
      },
    }),
    [],
  );

  return {
    draft,
    ...actions,
  };
};
