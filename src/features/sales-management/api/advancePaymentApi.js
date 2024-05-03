import { api } from "../../api";

const advancePaymentApi = api
  .enhanceEndpoints({
    addTagTypes: [
      "Advance Payment",
      "Advance Payment Balance",
      "Advance Payment Balances",
    ],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      createAdvancePayment: builder.mutation({
        query: (body) => ({
          url: "/advance-payment/cash",
          method: "POST",
          body,
        }),
        invalidatesTags: ["Advance Payment"],
      }),

      getAllAdvancePayments: builder.query({
        query: (params) => ({
          url: "/advance-payment/page",
          method: "GET",
          params,
        }),
        providesTags: ["Advance Payment"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),

      getAllAdvancePaymentBalances: builder.query({
        query: (params) => ({
          url: "/advance-payment/balances",
          method: "GET",
          params,
        }),
        providesTags: ["Advance Payment Balances"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),

      getAdvancePaymentBalance: builder.query({
        query: ({ id }) => ({
          url: `/advance-payment/${id}/remaining-balance`,
          method: "GET",
        }),
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
        providesTags: ["Advance Payment Balance"],
      }),

      updateAdvancePayment: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/advance-payment/${id}`,
          method: "PUT",
          body,
        }),
        invalidatesTags: ["Advance Payment"],
      }),

      voidAdvancePayment: builder.mutation({
        query: ({ id }) => ({
          url: `/advance-payment/${id}`,
          method: "PATCH",
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
  useLazyGetAllAdvancePaymentBalancesQuery,
  useLazyGetAdvancePaymentBalanceQuery,
  useUpdateAdvancePaymentMutation,
  useVoidAdvancePaymentMutation,
  useCancelAdvancePaymentMutation,
} = advancePaymentApi;
