import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { decryptString } from "../../../utils/CustomFunctions";

export const phLocationsApi = createApi({
  reducerPath: "phLocationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://ph-locations-api.buonzz.com/v1",
    // prepareHeaders: (headers) => {
    //   headers.set("Accept", "application/json");
    //   headers.set(
    //     "Authorization",
    //     `Bearer ${decryptString(sessionStorage.getItem("token"))}`
    //   );
    // },
  }),

  tagTypes: ["PH Locations"],
  endpoints: (builder) => ({
    getAllBarangays: builder.query({
      query: (params) => ({
        params: params,
        url: "/barangays",
        method: "GET",
      }),
      providesTags: ["PH Locations"],
      transformResponse: (response) => response.data,
      transformErrorResponse: (response) => response.data,
    }),

    getAllCities: builder.query({
      query: (params) => ({
        params: params,
        url: "/cities",
        method: "GET",
      }),
      providesTags: ["PH Locations"],
      transformResponse: (response) => response.data,
      transformErrorResponse: (response) => response.data,
    }),

    getAllProvinces: builder.query({
      query: (params) => ({
        params: params,
        url: "/provinces",
        method: "GET",
      }),
      providesTags: ["PH Locations"],
      transformResponse: (response) => response.data,
      transformErrorResponse: (response) => response.data,
    }),

    getAllRegions: builder.query({
      query: (params) => ({
        params: params,
        url: "/regions",
        method: "GET",
      }),
      providesTags: ["PH Locations"],
      transformResponse: (response) => response.data,
      transformErrorResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetAllBarangaysQuery,
  useGetAllCitiesQuery,
  useGetAllProvincesQuery,
  useGetAllRegionsQuery,
} = phLocationsApi;
