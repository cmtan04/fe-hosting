export enum BookingStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
  PARTIAL_REFUND = 'PARTIAL_REFUND',
}

export interface BookingLocationSummaryDto {
  locationCode: string;
  name: string;
  logo?: string;
  typeCode?: string;
  typeName?: string;
  fullAddress?: string;
  price: number;
  priceUnit?: string;
  cancellationFeePercent?: number;
  rescheduleFeePercent?: number;
}

export interface BookingUserSummaryDto {
  userCode: string;
  username: string;
  email?: string;
  avatarUrl?: string | null;
  phone?: string | null;
}

export interface BookingResponseDto {
  bookingCode: string;
  location: BookingLocationSummaryDto;
  guest: BookingUserSummaryDto;
  owner: BookingUserSummaryDto;
  checkInDate: string | null;
  checkOutDate: string | null;
  totalPrice: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  cancellationFee: number | null;
  rescheduleFee: number | null;
  note: string | null;
  createdAt: Date | string;
}

export interface CreateBookingPayload {
  locationCode: string;
  checkInDate?: string;
  checkOutDate?: string;
  note?: string;
}

export interface CreateBookingResponseDto {
  bookingCode: string;
}

export interface RescheduleBookingPayload {
  checkInDate: string;
  checkOutDate: string;
}

export interface LocationLockStatusDto {
  isLocked: boolean;
  lockedUntil?: Date | string | null;
}

export interface PaginatedBookingResponseDto {
  data: BookingResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CancelBookingResponseDto {
  message: string;
  cancellationFee: number;
  refundAmount: number;
  booking: BookingResponseDto;
}

export interface RescheduleBookingResponseDto {
  message: string;
  rescheduleFee: number;
  booking: BookingResponseDto;
}

export interface BookingListQuery {
  page?: number;
  limit?: number;
  status?: BookingStatus;
}
