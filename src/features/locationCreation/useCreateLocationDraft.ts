import { useEffect, useMemo, useState } from "react";
import {
  createEmptyLocationDraft,
  type CreateLocationDraft,
} from "./types";
import {
  mapLocationMediaToEditable,
  type EditableLocationMediaItem,
} from "./media";

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
    const parsed = JSON.parse(raw) as CreateLocationDraft & {
      basicInfo?: CreateLocationDraft["basicInfo"] & {
        logoUrl?: string;
        media?: EditableLocationMediaItem[];
      };
    };

    return {
      ...createEmptyLocationDraft(),
      ...parsed,
      basicInfo: {
        ...createEmptyLocationDraft().basicInfo,
        ...parsed.basicInfo,
        media: mapLocationMediaToEditable(
          parsed.basicInfo?.media,
          parsed.basicInfo?.logoUrl,
        ),
      },
      address: {
        ...createEmptyLocationDraft().address,
        ...parsed.address,
      },
      services: parsed.services ?? [],
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
      updateServices: (services: CreateLocationDraft["services"]) => {
        setDraft((prev) => ({
          ...prev,
          services,
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
