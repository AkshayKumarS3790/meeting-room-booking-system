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
  is_active?: boolean;
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

type RoomFilterParams = {
  search?: string;
  location?: string;
  required_capacity?: number;
  room_name?: string;
  start_date_time?: string;
  end_date_time?: string;
};

type BookingFilterParams = {
  search?: string;
  room_name?: string;
  user_id?: number;
  start_date_time?: string;
  end_date_time?: string;
  only_active?: boolean;
};

export type RoomResponse = Room[] | { message: string };

export const api = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/",
  }),

  tagTypes: ["Rooms", "Bookings"],

  endpoints: (builder) => ({
    getRooms: builder.query<
      Room[],
      RoomFilterParams & { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 6, ...params }) => ({
        url: "/rooms/filter/",
        params: { ...params, page, limit },
      }),
      providesTags: [{ type: "Rooms", id: "LIST" }],
    }),

    getBookings: builder.query<
      Booking[],
      BookingFilterParams & { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 6, ...params }) => ({
        url: "/bookings/filter",
        params: {
          ...params,
          page,
          limit,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ booking_id }) => ({
                type: "Bookings" as const,
                id: booking_id,
              })),
              { type: "Bookings", id: "LIST" },
            ]
          : [{ type: "Bookings", id: "LIST" }],
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
      invalidatesTags: [
        { type: "Bookings", id: "LIST" },
        { type: "Rooms", id: "LIST" },
      ],
    }),

    updateBooking: builder.mutation({
      query: ({ booking_id, ...body }) => ({
        url: `bookings/${booking_id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [
        { type: "Bookings", id: "LIST" },
        { type: "Rooms", id: "LIST" },
      ],
    }),

    deleteBooking: builder.mutation({
      query: (id: number) => ({
        url: `/bookings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Bookings", id },
        { type: "Bookings", id: "LIST" },
        { type: "Rooms", id: "LIST" },
      ],
    }),

    addRoom: builder.mutation<AddRoomResponse, AddRoomInput>({
      query: (data) => ({
        url: "rooms/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Rooms", id: "LIST" }],
    }),

    updateRoom: builder.mutation({
      query: (data: UpdateRoomInput) => ({
        url: `/rooms/${data.room_name}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "Rooms", id: "LIST" }],
    }),

    deleteRoom: builder.mutation({
      query: (room_name: string) => ({
        url: `rooms/${room_name}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Rooms", id: "LIST" }],
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
