import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { decryptString } from "../../../utils/CustomFunctions";

export const specialDiscountApi = createApi({
  reducerPath: "specialDiscountApi",
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
  tagTypes: ["Special Discount", "ApprovalHistoryById"],
  endpoints: (builder) => ({
    //Main CRUD
    createSpecialDiscount: builder.mutation({
      query: (body) => ({
        url: "/special-discount",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Special Discount"],
    }),

    getAllSpecialDiscount: builder.query({
      query: (params) => ({
        params: params,
        url: "/special-discount",
        method: "GET",
      }),
      providesTags: ["Special Discount"],
      transformResponse: (response) => response.value,
      transformErrorResponse: (response) => response.value,
    }),

    updateSpecialDiscount: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/special-discount/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Special Discount"],
    }),

    voidSpecialDiscount: builder.mutation({
      query: ({ id }) => ({
        url: `/special-discount/${id}/void`,
        method: "PATCH",
      }),
      invalidatesTags: ["Special Discount"],
    }),

    //Others
    getSpecialDiscountApprovalHistoryById: builder.query({
      query: ({ id }) => ({
        url: `/special-discount/${id}/approval-history`,
        method: "GET",
      }),
      providesTags: ["ApprovalHistoryById"],
      transformResponse: (response) => response.value,
      transformErrorResponse: (response) => response.value,
    }),
  }),
});

export const {
  useCreateSpecialDiscountMutation,
  useGetAllSpecialDiscountQuery,
  useUpdateSpecialDiscountMutation,
  useVoidSpecialDiscountMutation,
  useLazyGetSpecialDiscountApprovalHistoryByIdQuery,
} = specialDiscountApi;
