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
    }),
  });

export const { usePostLoginMutation } = loginApi;
