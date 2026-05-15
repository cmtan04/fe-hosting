import axiosClient from '../axiosClient';
import { BookingEndpoint } from '../endpoints/booking.endpoint';
import {
  type BookingListQuery,
  type BookingResponseDto,
  type CancelBookingResponseDto,
  type CreateBookingPayload,
  type CreateBookingResponseDto,
  type LocationLockStatusDto,
  type PaginatedBookingResponseDto,
  type RescheduleBookingPayload,
  type RescheduleBookingResponseDto,
} from '../dtos/booking.dto';

export const createBooking = async (
  payload: CreateBookingPayload,
): Promise<CreateBookingResponseDto> => {
  const { data } = await axiosClient.post<CreateBookingResponseDto>(
    BookingEndpoint.CREATE_BOOKING,
    payload,
  );
  return data;
};

export const getMyBookings = async (
  query: BookingListQuery,
): Promise<PaginatedBookingResponseDto> => {
  const { data } = await axiosClient.get<PaginatedBookingResponseDto>(
    BookingEndpoint.GET_MY_BOOKINGS,
    { params: query },
  );
  return data;
};

export const getOwnerBookings = async (
  query: BookingListQuery,
): Promise<PaginatedBookingResponseDto> => {
  const { data } = await axiosClient.get<PaginatedBookingResponseDto>(
    BookingEndpoint.GET_OWNER_BOOKINGS,
    { params: query },
  );
  return data;
};

export const getBookingDetail = async (
  bookingCode: string,
): Promise<BookingResponseDto> => {
  const { data } = await axiosClient.get<BookingResponseDto>(
    `${BookingEndpoint.GET_BOOKING_DETAIL}/${bookingCode}`,
  );
  return data;
};

export const cancelBooking = async (
  bookingCode: string,
): Promise<CancelBookingResponseDto> => {
  const { data } = await axiosClient.patch<CancelBookingResponseDto>(
    `${BookingEndpoint.CANCEL_BOOKING}/${bookingCode}/cancel`,
  );
  return data;
};

export const rescheduleBooking = async (
  bookingCode: string,
  payload: RescheduleBookingPayload,
): Promise<RescheduleBookingResponseDto> => {
  const { data } = await axiosClient.patch<RescheduleBookingResponseDto>(
    `${BookingEndpoint.RESCHEDULE_BOOKING}/${bookingCode}/reschedule`,
    payload,
  );
  return data;
};

export const checkLocationLockStatus = async (
  locationCode: string,
): Promise<LocationLockStatusDto> => {
  const { data } = await axiosClient.get<LocationLockStatusDto>(
    `${BookingEndpoint.CHECK_LOCATION_LOCK}/${locationCode}/status`,
  );
  return data;
};
