import { api } from "../../api";

const priceModeItemsApi = api
  .enhanceEndpoints({ addTagTypes: ["Price Mode Items", "Products"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      postItemsToPriceMode: builder.mutation({
        query: (body) => ({
          url: "/price-mode-items",
          method: "POST",
          body: body,
        }),
        invalidatesTags: ["Price Mode Items", "Products"],
      }),

      getAllItemsByPriceModeId: builder.query({
        query: (params) => ({
          params: params,
          url: `/price-mode-items`,
          method: "GET",
        }),
        providesTags: ["Price Mode Items"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),

      exportPrices: builder.query({
        query: (params) => ({
          params: params,
          url: "/price/export",
          method: "GET",
        }),
      }),

      updatePriceModeItemStatus: builder.mutation({
        query: ({ id }) => ({
          url: `/price-change-items/${id}/archive`,
          method: "PATCH",
        }),
        invalidatesTags: ["Price Mode Items"],
      }),

      deletePriceModeItem: builder.mutation({
        query: ({ id }) => ({
          url: `/price-mode-items/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Price Mode Items", "Products"],
      }),

      postPriceChange: builder.mutation({
        query: (body) => ({
          url: "/PriceChange/AddNewPriceChange",
          method: "POST",
          body: body,
        }),
        invalidatesTags: ["Price Mode Items"],
      }),

      postAddPriceChange: builder.mutation({
        query: (body) => ({
          url: "/PriceChange/AddNewPriceChange",
          method: "POST",
          body: body,
        }),
        invalidatesTags: ["Price Change"],
      }),

      getPriceChangeByPriceModeItemId: builder.query({
        query: (params) => ({
          url: "/item-price-change/",
          method: "GET",
          params: params,
        }),
        providesTags: ["Price Change"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),

      deletePriceChange: builder.mutation({
        query: ({ id }) => ({
          url: `/PriceChange/DeletePriceChange/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Price Change"],
      }),
    }),
  });

export const {
  usePostItemsToPriceModeMutation,
  useGetAllItemsByPriceModeIdQuery,
  useLazyGetAllItemsByPriceModeIdQuery,
  useUpdatePriceModeItemStatusMutation,
  useDeletePriceModeItemMutation,
  useLazyGetPriceChangeByPriceModeItemIdQuery,
  usePostPriceChangeMutation,
  usePostAddPriceChangeMutation,
  useDeletePriceChangeMutation,
  useLazyExportPricesQuery,
} = priceModeItemsApi;
