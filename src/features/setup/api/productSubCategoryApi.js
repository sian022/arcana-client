import { api } from "../../api";

const productSubCategoryApi = api
  .enhanceEndpoints({ addTagTypes: ["Product Sub Category"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      postProductSubCategory: builder.mutation({
        query: (body) => ({
          url: "/ProductSubCategory/AddNewProductSubCategory",
          method: "POST",
          body: body,
        }),
        invalidatesTags: ["Product Sub Category"],
      }),
      getAllProductSubCategories: builder.query({
        query: (params) => ({
          params: params,
          url: "/ProductSubCategory/GetProductSubCategories",
          method: "GET",
        }),
        providesTags: ["Product Sub Category"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),
      putProductSubCategory: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/ProductSubCategory/UpdateProductSubCategory/${id}`,
          method: "PUT",
          body: body,
        }),
        invalidatesTags: ["Product Sub Category"],
      }),
      patchProductSubCategoryStatus: builder.mutation({
        query: (id) => ({
          url: `/ProductSubCategory/UpdateProductSubCategoryStatus/${id}`,
          method: "PATCH",
        }),
        invalidatesTags: ["Product Sub Category"],
      }),
    }),
  });

export const {
  useGetAllProductSubCategoriesQuery,
  usePostProductSubCategoryMutation,
  usePutProductSubCategoryMutation,
  usePatchProductSubCategoryStatusMutation,
} = productSubCategoryApi;
