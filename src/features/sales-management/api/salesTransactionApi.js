import { api } from "../../api";

const salesTransactionApi = api
  .enhanceEndpoints({ addTagTypes: ["Clients POS", "Sales Transaction"] })
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
          url: "/sales-transaction",
          method: "GET",
          params,
        }),
        providesTags: ["Sales Transaction"],
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
          url: `/sales-transaction/${id}/upload`,
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
  useVoidSalesTransactionMutation,
  useUploadCiAttachmentMutation,
  useCreateSalesTransactionMutation,
} = salesTransactionApi;
