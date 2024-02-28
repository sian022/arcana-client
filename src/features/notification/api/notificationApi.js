import { api } from "../../api";

export const notificationApi = api
  .enhanceEndpoints({ addTagTypes: ["Notification"] })
  .injectEndpoints({
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
