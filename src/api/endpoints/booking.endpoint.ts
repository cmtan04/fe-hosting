export const BookingEndpoint = {
  CREATE_BOOKING: '/bookings',
  GET_MY_BOOKINGS: '/bookings/my',
  GET_OWNER_BOOKINGS: '/bookings/owner',
  GET_BOOKING_DETAIL: '/bookings',
  CANCEL_BOOKING: '/bookings', // PATCH /bookings/:code/cancel
  RESCHEDULE_BOOKING: '/bookings', // PATCH /bookings/:code/reschedule
  CHECK_LOCATION_LOCK: '/bookings/location', // GET /bookings/location/:code/status
};
