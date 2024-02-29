import { api } from "../../api";

const productCategoryApi = api
  .enhanceEndpoints({ addTagTypes: ["Product Category"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      postProductCategory: builder.mutation({
        query: (body) => ({
          url: "/ProductCategory/AddNewProductCategory",
          method: "POST",
          body: body,
        }),
        invalidatesTags: ["Product Category"],
      }),
      getAllProductCategory: builder.query({
        query: (params) => ({
          params: params,
          url: "/ProductCategory/GetProductCategory",
          method: "GET",
        }),
        providesTags: ["Product Category"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),
      putProductCategory: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/ProductCategory/UpdateProductCategory/${id}`,
          method: "PUT",
          body: body,
        }),
        invalidatesTags: ["Product Category"],
      }),
      patchProductCategoryStatus: builder.mutation({
        query: (id) => ({
          url: `/ProductCategory/UpdateProductCategoryStatus/${id}`,
          method: "PATCH",
        }),
        invalidatesTags: ["Product Category"],
      }),
    }),
  });

export const {
  useGetAllProductCategoryQuery,
  usePostProductCategoryMutation,
  usePutProductCategoryMutation,
  usePatchProductCategoryStatusMutation,
} = productCategoryApi;
