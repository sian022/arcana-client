import { api } from "../../api";

const loginApi = api
  .enhanceEndpoints({
    addTagTypes: [
      "Prospecting",

      //Registration Tag Types
      "Registration",
      "Clients For Listing",
      "TermsById",
      "AttachmentsById",
      "FreebiesById",
      "ListingFeeById",
      "OtherExpensesById",
      "ApprovalHistoryById",

      //Others
      "Listing Fee",
      "Cluster",
      "Special Discount",
      "Notification",
    ],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      postLogin: builder.mutation({
        query: (payload) => ({
          url: "/Authenticate/Authenticate",
          method: "POST",
          headers: { Accept: "application/json" },
          body: payload,
        }),
        invalidatesTags: [
          "Prospecting",
          "Registration",
          "Clients For Listing",
          "TermsById",
          "AttachmentsById",
          "FreebiesById",
          "ListingFeeById",
          "OtherExpensesById",
          "ApprovalHistoryById",
          "Listing Fee",
          "Cluster",
          "Special Discount",
          "Notification",
        ],
      }),

      patchInitialChangePassword: builder.mutation({
        query: ({ id, token, ...body }) => ({
          url: `/User/ChangeUserPassword/${id}`,
          method: "PATCH",
          body: body,
          headers: { Authorization: `Bearer ${token}` },
        }),
      }),
    }),
  });

export const { usePostLoginMutation, usePatchInitialChangePasswordMutation } =
  loginApi;
