import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { decryptString } from "../../../utils/CustomFunctions";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASEURL,
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      headers.set(
        "Authorization",
        `Bearer ${decryptString(sessionStorage.getItem("token"))}`
      );
    },
  }),
  tagTypes: ["Notification"],
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: (params) => ({
        url: "/Notification/Notification",
        method: "GET",
        params,
      }),
      providesTags: ["Notification"],
      transformResponse: (response) => response.value,
      transformErrorResponse: (response) => response.value,
    }),

    patchReadNotification: builder.mutation({
      query: (params) => ({
        url: "/Notification",
        method: "PATCH",
        params,
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const { useGetNotificationsQuery, usePatchReadNotificationMutation } =
  notificationApi;
