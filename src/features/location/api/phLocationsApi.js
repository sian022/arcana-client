import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { decryptString } from "../../../utils/CustomFunctions";

export const phLocationsApi = createApi({
  reducerPath: "phLocationsApi",
  baseQuery: fetchBaseQuery({
    // baseUrl: "https://ph-locations-api.buonzz.com/v1",
    baseUrl: "https://psgc.gitlab.io/api",
    // baseUrl: "https://psgc.vercel.app/api",
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      //   headers.set(
      //     "Authorization",
      //     `Bearer ${decryptString(sessionStorage.getItem("token"))}`
      //   );
      // },
      // headers.set("Accept", "text/html");
    },
  }),

  tagTypes: ["PH Locations"],
  endpoints: (builder) => ({
    getAllProvinces: builder.query({
      query: () => ({
        // params: params,
        url: "/provinces",
        method: "GET",
      }),
      // providesTags: ["PH Locations"],
      invalidatesTags: ["PH Location"],
    }),

    getMunicipalitiesByProvince: builder.query({
      query: ({ provinceCode }) => ({
        // params: params,
        url: `/provinces/${provinceCode}/cities-municipalities`,
        method: "GET",
      }),
      providesTags: ["PH Locations"],
    }),

    getBarangaysByMunicipality: builder.query({
      query: ({ municipalityCode }) => ({
        // params: params,
        url: `/cities-municipalities/${municipalityCode}/barangays`,
        method: "GET",
      }),
      // providesTags: ["PH Locations"],
    }),
  }),
});

export const {
  useGetAllProvincesQuery,
  useGetMunicipalitiesByProvinceQuery,
  useGetBarangaysByMunicipalityQuery,
} = phLocationsApi;
