import { api } from "../../api";

const productsApi = api
  .enhanceEndpoints({ addTagTypes: "Products" })
  .injectEndpoints({
    endpoints: (builder) => ({
      postProduct: builder.mutation({
        query: ({ body }) => ({
          url: "/Items/AddNewItem",
          method: "POST",
          body,
        }),
        invalidatesTags: ["Products"],
      }),
      getAllProducts: builder.query({
        query: (params) => ({
          params: params,
          url: "/Items/GetAllItems",
          method: "GET",
        }),
        providesTags: ["Products"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),
      putProduct: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/Items/UpdateItem/${id}`,
          method: "PUT",
          body: body,
        }),
        invalidatesTags: ["Products"],
      }),
      patchProductStatus: builder.mutation({
        query: (id) => ({
          url: `/Items/UpdateItemStatus/${id}`,
          method: "PATCH",
        }),
        invalidatesTags: ["Products"],
      }),
    }),
  });

export const {
  usePostProductMutation,
  useGetAllProductsQuery,
  useLazyGetAllProductsQuery,
  usePutProductMutation,
  usePatchProductStatusMutation,
} = productsApi;
