import { api } from "../../api";

const paymentTransactionApi = api
  .enhanceEndpoints({
    addTagTypes: [
      "Payment Transaction Histories",
      "Sales Transaction",
      "Sales Transaction For Payments",
    ],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAllSalesTransactionForPayments: builder.query({
        query: (params) => ({
          url: "/sales-transaction/payment",
          method: "GET",
          params,
        }),
        providesTags: ["Sales Transaction", "Sales Transaction For Payments"],
        transformResponse: (response) => response.value,
      }),

      getAllPaymentHistories: builder.query({
        query: (params) => ({
          url: "/payment-transaction/page",
          method: "GET",
          params,
        }),
        providesTags: ["Payment Transaction Histories"],
        transformResponse: (response) => response.value,
      }),

      createPaymentTransaction: builder.mutation({
        query: (body) => ({
          url: `/payment`,
          method: "POST",
          body,
        }),
        invalidatesTags: [
          "Sales Transaction",
          "Sales Transaction For Payments",
        ],
      }),

      clearPaymentTransaction: builder.mutation({
        query: (body) => ({
          url: "/clearing-payment/status",
          method: "PATCH",
          body,
        }),
        invalidatesTags: [
          "Sales Transaction",
          "Sales Transaction For Payments",
        ],
      }),

      voidPaymentTransaction: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/payment-transaction/${id}/void`,
          method: "PUT",
          body,
        }),
        invalidatesTags: [
          "Sales Transaction",
          "Sales Transaction For Payments",
          "",
        ],
      }),
    }),
  });

export const {
  useGetAllSalesTransactionForPaymentsQuery,
  useLazyGetAllSalesTransactionForPaymentsQuery,
  useLazyGetAllPaymentHistoriesQuery,
  useCreatePaymentTransactionMutation,
  useClearPaymentTransactionMutation,
  useVoidPaymentTransactionMutation,
} = paymentTransactionApi;
