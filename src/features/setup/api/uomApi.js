import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { decryptString } from "../../../utils/CustomFunctions";

export const uomApi = createApi({
  reducerPath: "uomApi",
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
    postUom: builder.mutation({
      query: (body) => ({
        url: "/Uom/AddNewUom",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Meat Type"],
    }),
    getAllUoms: builder.query({
      query: (params) => ({
        params: params,
        url: "/Uom/GetUom",
        method: "GET",
      }),
      providesTags: ["Meat Type"],
      transformResponse: (response) => response.data,
      transformErrorResponse: (response) => response.data,
    }),
    putUom: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/Uom/UpdateUom/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Meat Type"],
    }),
    patchUomStatus: builder.mutation({
      query: (id) => ({
        url: `/Uom/UpdateUomStatus/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Meat Type"],
    }),
  }),
});

export const {
  usePostUomMutation,
  useGetAllUomsQuery,
  usePutUomMutation,
  usePatchUomStatusMutation,
} = uomApi;
