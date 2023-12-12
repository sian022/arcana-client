import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { decryptString } from "../../../utils/CustomFunctions";

export const meatTypeApi = createApi({
  reducerPath: "meatTypeApi",
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
  tagTypes: ["Meat Type"],
  endpoints: (builder) => ({
    postMeatType: builder.mutation({
      query: (body) => ({
        url: "/MeatType/AddNewMeatType",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Meat Type"],
    }),
    getAllMeatTypes: builder.query({
      query: (params) => ({
        params: params,
        url: "/MeatType/GetMeatType",
        method: "GET",
      }),
      providesTags: ["Meat Type"],
      transformResponse: (response) => response.value,
      transformErrorResponse: (response) => response.value,
    }),
    putMeatType: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/UpdateMeatType/UpdateMeatType/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Meat Type"],
    }),
    patchMeatTypeStatus: builder.mutation({
      query: (id) => ({
        url: `/UpdateMeatTypeStatus/UpdateMeatTypeStatus/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Meat Type"],
    }),
  }),
});

export const {
  useGetAllMeatTypesQuery,
  usePostMeatTypeMutation,
  usePutMeatTypeMutation,
  usePatchMeatTypeStatusMutation,
} = meatTypeApi;
