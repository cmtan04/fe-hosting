import type { OwnerPackagePlanResponseDto } from "@api/dtos/payment.dto";

export const isFreePlan = (plan: OwnerPackagePlanResponseDto) =>
  Number(plan.price) <= 0;

export const sortOwnerPackagePlans = (
  plans: OwnerPackagePlanResponseDto[],
) =>
  [...plans].sort((left, right) => Number(left.price) - Number(right.price));

export const getVisibleOwnerPackagePlans = (
  plans: OwnerPackagePlanResponseDto[],
  currentPlanCode?: string,
) => {
  const sortedPlans = sortOwnerPackagePlans(plans);

  if (!currentPlanCode) {
    return sortedPlans;
  }

  const currentPlanIndex = sortedPlans.findIndex(
    (plan) => plan.planCode === currentPlanCode,
  );

  if (currentPlanIndex < 0) {
    return sortedPlans;
  }

  return sortedPlans.slice(currentPlanIndex);
};

export const getOwnerPackageActionLabel = (
  plan: OwnerPackagePlanResponseDto,
  currentPlanCode?: string,
) => {
  if (currentPlanCode === plan.planCode) {
    return "Gói hiện tại của bạn";
  }

  if (currentPlanCode) {
    return "Nâng cấp gói";
  }

  if (isFreePlan(plan)) {
    return "Nhận ưu đãi";
  }

  return "Mua gói";
};

export const getOwnerPackagePlanLabel = (planCode?: string) => {
  if (!planCode) return "Chưa có gói";
  if (planCode === "LONG_FREE") return "Nhận ưu đãi";
  if (planCode === "LONG_PLUS") return "Listing Plus";
  return planCode;
};
