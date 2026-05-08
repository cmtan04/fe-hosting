import type { CustomServiceComposerState } from "../types/renter";
import { DEFAULT_SERVICE_PRICING_TYPE } from "@/features/locationCreation/services";

export const STEP_ITEMS = [
  { title: "Thông tin cơ bản" },
  { title: "Địa chỉ & Tiện ích" },
  { title: "Xác nhận" },
];

export const DEFAULT_CUSTOM_SERVICE_STATE: CustomServiceComposerState = {
  name: "",
  description: "",
  chargeType: "FREE",
  unit: DEFAULT_SERVICE_PRICING_TYPE,
  basePrice: "",
};
