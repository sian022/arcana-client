import { api } from "../../api";

const salesTransactionApi = api
  .enhanceEndpoints({
    addTagTypes: [
      "Clients POS",
      "Sales Transaction",
      "Sales Transaction By Id",
    ],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAllClientsForPOS: builder.query({
        query: (params) => ({
          url: "/clients/pos",
          method: "GET",
          params,
        }),
        providesTags: ["Clients POS"],
        transformResponse: (response) => response.value,
      }),

      createSalesTransaction: builder.mutation({
        query: (body) => ({
          url: "/sales-transaction",
          method: "POST",
          body,
        }),
        invalidatesTags: ["Sales Transaction"],
      }),

      getAllSalesTransaction: builder.query({
        query: (params) => ({
          url: "/sales-transaction/page",
          method: "GET",
          params,
        }),
        providesTags: ["Sales Transaction"],
        transformResponse: (response) => response.value,
      }),

      getSalesTransactionById: builder.query({
        query: ({ id }) => ({
          url: `/sales-transaction/${id}`,
          method: "GET",
        }),
        providesTags: ["Sales Transaction By Id"],
        transformResponse: (response) => response.value,
      }),

      voidSalesTransaction: builder.mutation({
        query: ({ id }) => ({
          url: `/sales-transaction/${id}/void`,
          method: "PATCH",
        }),
        invalidatesTags: ["Sales Transaction"],
      }),

      uploadCiAttachment: builder.mutation({
        query: ({ id, formData }) => ({
          url: `/sales-transaction/${id}`,
          method: "PATCH",
          body: formData,
        }),
        invalidatesTags: ["Sales Transaction"],
      }),
    }),
  });

export const {
  useGetAllClientsForPOSQuery,
  useGetAllSalesTransactionQuery,
  useLazyGetAllSalesTransactionQuery,
  useVoidSalesTransactionMutation,
  useUploadCiAttachmentMutation,
  useCreateSalesTransactionMutation,
  useLazyGetSalesTransactionByIdQuery,
} = salesTransactionApi;
