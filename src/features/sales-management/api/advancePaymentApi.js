import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { decryptString } from "../../../utils/CustomFunctions";

export const advancePaymentApi = createApi({
  reducerPath: "advancePaymentApi",
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
  tagTypes: ["Advance Payment"],

  endpoints: (builder) => ({
    createAdvancePayment: builder.mutation({
      query: (body) => ({
        url: "/advance-payment",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Advance Payment"],
    }),

    getAllAdvancePayments: builder.query({
      query: (params) => ({
        url: "/advance-payment",
        method: "GET",
        params,
      }),
      providesTags: ["Advance Payment"],
      transformResponse: (response) => response.value,
      transformErrorResponse: (response) => response.value,
    }),

    updateAdvancePayment: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/advance-payment/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Advance Payment"],
    }),

    cancelAdvancePayment: builder.mutation({
      query: ({ id }) => ({
        url: `/advance-payment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Advance Payment"],
    }),
  }),
});

export const {
  useCreateAdvancePaymentMutation,
  useGetAllAdvancePaymentsQuery,
  useUpdateAdvancePaymentMutation,
  useCancelAdvancePaymentMutation,
} = advancePaymentApi;
