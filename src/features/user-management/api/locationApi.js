import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { decryptString } from "../../../utils/CustomFunctions";

export const locationApi = createApi({
  reducerPath: "locationApi",
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
  tagTypes: ["Location"],
  endpoints: (builder) => ({
    postLocation: builder.mutation({
      query: (body) => ({
        url: "/Location/AddNewLocation",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Location"],
    }),
    getAllLocations: builder.query({
      query: (params) => ({
        params: params,
        url: "/Location/GetAllLocations",
        method: "GET",
      }),
      providesTags: ["Location"],
      transformResponse: (response) => response.value,
      transformErrorResponse: (response) => response.value,
    }),
    putLocation: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/Location/UpdateLocation/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Location"],
    }),
    patchLocationStatus: builder.mutation({
      query: (id) => ({
        url: `/Location/UpdateLocationStatus/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Location"],
    }),
  }),
});

export const {
  usePostLocationMutation,
  useGetAllLocationsQuery,
  usePutLocationMutation,
  usePatchLocationStatusMutation,
} = locationApi;
