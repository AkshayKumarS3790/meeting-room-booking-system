import { API_VERSION } from "@/config/version";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000/api/v1",

  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    headers.set("X-API-Version", API_VERSION);

    return headers;
  },
});

// WRAP BASE QUERY (THIS IS THE KEY FIX)
const baseQueryWithAuth: typeof baseQuery = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // CHECK FOR 401 (TOKEN EXPIRED)
  if (result.error && result.error.status === 401) {
    console.log("Token expired → logging out");

    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return result;
    }

    const refreshResult = await baseQuery(
      {
        url: "/users/refresh",
        method: "POST",
        body: { refresh_token: refreshToken },
      },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      const newToken = (refreshResult.data as { access_token: string })
        .access_token;
      localStorage.setItem("token", newToken);
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Remove token
      localStorage.removeItem("token");

      // Refresh token
      localStorage.removeItem("refresh_token");

      // Redirect
      window.location.href = "/login";
    }
  }
  return result;
};

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

export type User = {
  user_id: number;
  user_name: string;
  email: string;
  role: string;
};

type CreateUserRequest = {
  user_name: string;
  email: string;
  password: string;
  role: string;
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

type ResetUserPasswordRequest = {
  user_id: number;
  new_password: string;
  confirm_password: string;
};

type UpdateUserRequest = {
  user_id: number;
  user_name: string;
  email: string;
  role: string;
};

export type UpdateProfileRequest = {
  user_name: string;
  email: string;
};

export type CurrentUser = {
  user_id: number;
  user_name: string;
  email: string;
  role: string;
  permissions: string[];
};

export type RoomResponse = Room[] | { message: string };

export type UsersResponse = {
  items: User[];
  total: number;
};

export const api = createApi({
  reducerPath: "api",

  baseQuery: baseQueryWithAuth,

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

    getVersion: builder.query<{ version: string }, void>({
      query: () => ({
        url: "/version",
      }),
    }),

    getBookings: builder.query<Booking[], { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 6 }) => ({
        url: "/bookings",
        params: { page, limit },
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

    createUser: builder.mutation<
      { message: string; user_id: number },
      CreateUserRequest
    >({
      query: (body) => ({
        url: "/users/register",
        method: "POST",
        body,
      }),
    }),

    getUsers: builder.query<
      UsersResponse,
      {
        page?: number;
        limit?: number;
      }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: "/users",
        params: {
          page,
          limit,
        },
      }),
    }),

    getCurrentUser: builder.query<CurrentUser, void>({
      query: () => ({
        url: "/users/me",
      }),
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

    updateUser: builder.mutation<{ message: string }, UpdateUserRequest>({
      query: ({ user_id, user_name, email, role }) => ({
        url: `/users/${user_id}`,
        method: "PUT",
        body: {
          user_name,
          email,
          role,
        },
      }),
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

    deleteUser: builder.mutation<{ message: string }, number>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
    }),

    resetUserPassword: builder.mutation<
      { message: string },
      ResetUserPasswordRequest
    >({
      query: ({ user_id, new_password, confirm_password }) => ({
        url: `/users/${user_id}/reset-password`,
        method: "POST",
        body: {
          new_password,
          confirm_password,
        },
      }),
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

    updateProfile: builder.mutation<{ message: string }, UpdateProfileRequest>({
      query: (body) => ({
        url: "/users/me",
        method: "PUT",
        body,
      }),
    }),

    deleteRoom: builder.mutation({
      query: (room_name: string) => ({
        url: `rooms/${room_name}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Rooms", id: "LIST" }],
    }),

    changePassword: builder.mutation<
      { message: string },
      {
        current_password: string;
        new_password: string;
        confirm_password: string;
      }
    >({
      query: (data) => ({
        url: "/users/change-password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetRoomsQuery,
  useGetCurrentUserQuery,
  useCreateBookingMutation,
  useGetUsersQuery,
  useGetBookingsQuery,
  useDeleteBookingMutation,
  useAddRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
  useUpdateBookingMutation,
  useGetVersionQuery,
  useChangePasswordMutation,
  useDeleteUserMutation,
  useResetUserPasswordMutation,
  useUpdateUserMutation,
  useUpdateProfileMutation,
  useCreateUserMutation,
} = api;
