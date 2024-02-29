import { api } from "../../api";

const advancePaymentApi = api
  .enhanceEndpoints({ addTagTypes: ["Advance Payment"] })
  .injectEndpoints({
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
