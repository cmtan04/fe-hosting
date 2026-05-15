import axiosClient from "../axiosClient";
import type {
  BuyOwnerPackagePayloadDto,
  OwnerPackagePlanResponseDto,
  OwnerPackageSubscriptionResponseDto,
  PaymentUrlResponseDto,
} from "../dtos/payment.dto";

export const getOwnerPackagePlans = async (): Promise<
  OwnerPackagePlanResponseDto[]
> => {
  const { data } = await axiosClient.get<OwnerPackagePlanResponseDto[]>(
    "/owner-packages/plans",
  );
  return data;
};

export const getMyOwnerPackage =
  async (): Promise<OwnerPackageSubscriptionResponseDto> => {
    const { data } =
      await axiosClient.get<OwnerPackageSubscriptionResponseDto>(
        "/owner-packages/me",
      );
    return data;
  };

export const buyOwnerPackage = async (
  payload: BuyOwnerPackagePayloadDto,
): Promise<PaymentUrlResponseDto> => {
  if (payload.planCode === "LONG_FREE") {
    const { data } = await axiosClient.post<PaymentUrlResponseDto>(
      "/owner-packages/select",
      payload,
    );
    return data;
  }
  const { data } = await axiosClient.post<PaymentUrlResponseDto>(
    "/owner-packages/pay",
    payload,
  );
  return data;
};
