import type { OwnerPackagePlanResponseDto } from "@api/dtos/payment.dto";

export const isFreePlan = (plan: OwnerPackagePlanResponseDto) =>
  Number(plan.price) <= 0;

export const getOwnerPackagePlanLabel = (planCode?: string) => {
  if (!planCode) return "Chưa có gói";
  if (planCode === "LONG_FREE") return "Nhận ưu đãi";
  if (planCode === "LONG_PLUS") return "Listing Plus";
  return planCode;
};
