import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type Room = {
  room_name: string;
  capacity: number;
  location: string;
};

type BookingInput = {
  user_id: number;
  room_name: string;
  purpose: string;
  start_date_time: string;
  end_date_time: string;
  required_capacity: number;
};

type BookingResponse = Booking[] | { message: string };

type User = {
  user_id: number;
  user_name: string;
};

export type Booking = {
  booking_id: number;
  user_id: number;
  booked_by: string;
  room_name: string;
  purpose: string;
  start_date_time: string;
  end_date_time: string;
  required_capacity: number;
};

type AddRoomInput = {
  room_name: string;
  capacity: number;
  location: string;
};

type AddRoomResponse = {
  message: string;
};

type UpdateRoomInput = {
  room_name: string;
  capacity: number;
  location: string;
};

export type RoomResponse = Room[] | { message: string };

export const api = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/",
  }),

  tagTypes: ["Rooms", "Bookings"],

  endpoints: (builder) => ({
    getRooms: builder.query<RoomResponse, void>({
      query: () => "rooms/",
      providesTags: ["Rooms"],
    }),
    getBookings: builder.query<Booking[], void>({
      query: () => "/bookings/",
      providesTags: ["Bookings"],
    }),
    getUsers: builder.query<User[], void>({
      query: () => "users/",
    }),

    createBooking: builder.mutation<BookingResponse, BookingInput>({
      query: (data) => ({
        url: "bookings/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Bookings"],
    }),

    updateBooking: builder.mutation({
      query: ({ booking_id, ...body }) => ({
        url: `bookings/${booking_id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Bookings"],
    }),

    deleteBooking: builder.mutation({
      query: (id: number) => ({
        url: `/bookings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Bookings"],
    }),

    addRoom: builder.mutation<AddRoomResponse, AddRoomInput>({
      query: (data) => ({
        url: "rooms/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Rooms"],
    }),

    updateRoom: builder.mutation({
      query: (data: UpdateRoomInput) => ({
        url: `/rooms/${data.room_name}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Rooms"],
    }),

    deleteRoom: builder.mutation({
      query: (room_name: string) => ({
        url: `rooms/${room_name}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Rooms", "Bookings"],
    }),
  }),
});

export const {
  useGetRoomsQuery,
  useCreateBookingMutation,
  useGetUsersQuery,
  useGetBookingsQuery,
  useDeleteBookingMutation,
  useAddRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
  useUpdateBookingMutation,
} = api;
