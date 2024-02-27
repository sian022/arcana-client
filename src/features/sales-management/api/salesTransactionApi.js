import { api } from "../../api";

const salesTransactionApi = api.injectEndpoints({
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

    //Payment
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
  useGetAllClientsForPOSQuery,
  useGetAllSalesTransactionQuery,
  useVoidSalesTransactionMutation,
  useUploadCiAttachmentMutation,
  useClearSalesTransactionMutation,
} = salesTransactionApi;
