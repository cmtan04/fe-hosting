export enum PaymentPurpose {
  OWNER_PACKAGE = "OWNER_PACKAGE",
  BOOKING_DEPOSIT = "BOOKING_DEPOSIT",
}

export interface OwnerPackagePlanResponseDto {
  planCode: string;
  name: string;
  price: number;
  durationDays: number | null;
  maxActiveListings: number;
}

export interface OwnerPackageSubscriptionResponseDto {
  planCode: string;
  rentalClass: string;
  maxActiveListings: number;
  activeListings: number;
  remainingListings: number;
  expiresAt: string | null;
}

export interface BuyOwnerPackagePayloadDto {
  planCode: string;
}

export interface PaymentUrlResponseDto {
  transactionCode: string;
  purpose: PaymentPurpose;
  amount: number;
  paymentUrl: string;
  qrContent?: string;
  qrMessage?: string;
  transferContent?: string;
  bankCode?: string;
  accountNumber?: string;
  accountName?: string;
}
