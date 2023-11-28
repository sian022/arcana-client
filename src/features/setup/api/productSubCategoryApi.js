import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { decryptString } from "../../../utils/CustomFunctions";

export const productSubCategoryApi = createApi({
  reducerPath: "productSubCategoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASEURL,
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      headers.set(
        "Authorization",
        `Bearer ${decryptString(sessionStorage.getItem("token"))}`
      );
    },
  }),
  tagTypes: ["Product Sub Category"],
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
