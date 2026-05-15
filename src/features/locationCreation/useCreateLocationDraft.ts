import { useEffect, useMemo, useState } from "react";
import {
  createEmptyLocationDraft,
  type CreateLocationDraft,
} from "./types";
import {
  mapLocationMediaToEditable,
  type EditableLocationMediaItem,
} from "./media";

const DEFAULT_STORAGE_KEY = "create_location_draft_v2";

const readDraft = (storageKey: string): CreateLocationDraft => {
  if (!globalThis.window) {
    return createEmptyLocationDraft();
  }

  const raw = sessionStorage.getItem(storageKey);
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
    sessionStorage.removeItem(storageKey);
    return createEmptyLocationDraft();
  }
};

export const useCreateLocationDraft = (storageKey = DEFAULT_STORAGE_KEY) => {
  const [draft, setDraft] = useState<CreateLocationDraft>(() =>
    readDraft(storageKey),
  );

  useEffect(() => {
    if (!globalThis.window) {
      return;
    }

    sessionStorage.setItem(storageKey, JSON.stringify(draft));
  }, [draft, storageKey]);

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
        if (globalThis.window) {
          sessionStorage.removeItem(storageKey);
        }
      },
      initialize: (value: CreateLocationDraft) => {
        setDraft(value);
        if (globalThis.window) {
          sessionStorage.setItem(storageKey, JSON.stringify(value));
        }
      },
    }),
    [storageKey],
  );

  return {
    draft,
    ...actions,
  };
};
