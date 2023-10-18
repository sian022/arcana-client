import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { decryptString } from "../../../utils/CustomFunctions";

export const storeTypeApi = createApi({
  reducerPath: "storeTypeApi",
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
  tagTypes: ["Store Type"],
  endpoints: (builder) => ({
    postStoreType: builder.mutation({
      query: (body) => ({
        url: "/StoreType/AddNewStoreType",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Store Type"],
    }),
    getAllStoreTypes: builder.query({
      query: (params) => ({
        params: params,
        url: "/StoreType/GetAllStoreTypes",
        method: "GET",
      }),
      providesTags: ["Store Type"],
      transformResponse: (response) => response.data,
      transformErrorResponse: (response) => response.data,
    }),
    putStoreType: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/StoreType/UpdateStoreType/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Store Type"],
    }),
    patchStoreTypeStatus: builder.mutation({
      query: (id) => ({
        url: `/StoreType/UpdateStoreTypeStatus/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Store Type"],
    }),
  }),
});

export const {
  usePostStoreTypeMutation,
  useGetAllStoreTypesQuery,
  usePutStoreTypeMutation,
  usePatchStoreTypeStatusMutation,
} = storeTypeApi;
