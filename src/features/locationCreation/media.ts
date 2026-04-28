import type { LocationMediaDto } from "@api/dtos/location.dto";

export interface EditableLocationMediaItem {
  id: string;
  url: string;
  fileName?: string;
  type: "IMAGE" | "VIDEO";
  isLogo: boolean;
  displayOrder: number;
}

const createMediaId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

type EditableMediaSource = Partial<EditableLocationMediaItem> & {
  mediaCode?: string;
};

export const normalizeEditableMedia = (
  media: EditableMediaSource[] = [],
): EditableLocationMediaItem[] => {
  const normalized = media.map((item, index) => ({
    id: item.id || createMediaId(),
    url: item.url || "",
    fileName: item.fileName?.trim() || "",
    type: item.type,
    isLogo: Boolean(item.isLogo),
    displayOrder: index + 1,
  }));

  const logoIndex = normalized.findIndex((item) => item.isLogo);

  return normalized.map((item, index) => ({
    ...item,
    isLogo: logoIndex === -1 ? index === 0 : index === logoIndex,
    displayOrder: index + 1,
  }));
};

export const appendEditableMedia = (
  current: EditableLocationMediaItem[],
  items: Array<Omit<EditableLocationMediaItem, "displayOrder">>,
) =>
  normalizeEditableMedia([
    ...current,
    ...items.map((item) => ({
      ...item,
      isLogo: item.isLogo ?? false,
    })),
  ]);

export const removeEditableMediaById = (
  current: EditableLocationMediaItem[],
  id: string,
) => normalizeEditableMedia(current.filter((item) => item.id !== id));

export const markEditableMediaAsLogo = (
  current: EditableLocationMediaItem[],
  id: string,
) =>
  normalizeEditableMedia(
    current.map((item) => ({
      ...item,
      isLogo: item.id === id,
    })),
  );

export const mapEditableMediaToRequest = (
  media: EditableLocationMediaItem[],
): LocationMediaDto[] =>
  normalizeEditableMedia(media).map((item) => ({
    url: item.url,
    type: item.type,
    isLogo: item.isLogo,
    displayOrder: item.displayOrder,
  }));

export const mapLocationMediaToEditable = (
  media: Array<LocationMediaDto | EditableMediaSource> | undefined,
  fallbackLogoUrl?: string,
): EditableLocationMediaItem[] => {
  const source =
    media && media.length > 0
      ? media.map((item, index) => ({
          id:
            ("id" in item && typeof item.id === "string" && item.id) ||
            ("mediaCode" in item &&
              typeof item.mediaCode === "string" &&
              item.mediaCode) ||
            createMediaId(),
          url: item.url,
          fileName:
            "fileName" in item && typeof item.fileName === "string"
              ? item.fileName
              : "",
          type: item.type,
          isLogo: Boolean(item.isLogo),
          displayOrder: item.displayOrder ?? index + 1,
        }))
      : fallbackLogoUrl
      ? [
          {
            id: createMediaId(),
            url: fallbackLogoUrl,
            fileName: "",
            type: "IMAGE" as const,
            isLogo: true,
            displayOrder: 1,
          },
        ]
      : [];

  return normalizeEditableMedia(source);
};

export const createEditableMediaFromUpload = (
  url: string,
  mimeType: string,
  fileName?: string,
): Omit<EditableLocationMediaItem, "displayOrder"> => ({
  id: createMediaId(),
  url,
  fileName: fileName?.trim() || "",
  type: mimeType.startsWith("video/") ? "VIDEO" : "IMAGE",
  isLogo: false,
});
