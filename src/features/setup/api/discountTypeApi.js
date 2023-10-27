import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { decryptString } from "../../../utils/CustomFunctions";

export const discountTypeApi = createApi({
  reducerPath: "discountTypeApi",
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
  tagTypes: ["Discount Type"],
  endpoints: (builder) => ({
    postDiscountType: builder.mutation({
      query: (body) => ({
        url: "/Discount/AddNewVariableDiscount",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Discount Type"],
    }),
    getAllDiscountTypes: builder.query({
      query: (params) => ({
        params: params,
        url: "/Discount/GetVariableDiscount",
        method: "GET",
      }),
      providesTags: ["Discount Type"],
      transformResponse: (response) => response.data,
      transformErrorResponse: (response) => response.data,
    }),
    putDiscountType: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/Discount/UpdateVariableDiscount/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Discount Type"],
    }),
    patchDiscountTypeStatus: builder.mutation({
      query: (id) => ({
        url: `/Discount/UpdateVariableDiscountStatus/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Discount Type"],
    }),
  }),
});

export const {
  usePostDiscountTypeMutation,
  useGetAllDiscountTypesQuery,
  usePutDiscountTypeMutation,
  usePatchDiscountTypeStatusMutation,
} = discountTypeApi;
