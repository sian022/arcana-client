import { api } from "../../api";

const paymentTransactionApi = api
  .enhanceEndpoints({ addTagTypes: ["Sales Transaction For Payments"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAllSalesTransactionForPayments: builder.query({
        query: (params) => ({
          url: "/sales-transaction/payment",
          method: "GET",
          params,
        }),
        providesTags: ["Sales Transaction For Payments"],
        transformResponse: (response) => response.value,
      }),

      createPaymentTransaction: builder.mutation({
        query: (body) => ({
          url: `/payment`,
          method: "POST",
          body,
        }),
      }),

      clearSalesTransaction: builder.mutation({
        query: (body) => ({
          url: "/sales-transaction/clear",
          method: "PUT",
          body,
        }),
        invalidatesTags: ["Sales Transaction"],
      }),
    }),
  });

export const {
  useGetAllSalesTransactionForPaymentsQuery,
  useLazyGetAllSalesTransactionForPaymentsQuery,
  useCreatePaymentTransactionMutation,
  useClearSalesTransactionMutation,
} = paymentTransactionApi;
