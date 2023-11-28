import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { decryptString } from "../../../utils/CustomFunctions";

export const companyApi = createApi({
  reducerPath: "companyApi",
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
  tagTypes: ["Company"],
  endpoints: (builder) => ({
    postCompany: builder.mutation({
      query: (body) => ({
        url: "/Company/AddNewCompany",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Company"],
    }),
    getAllCompanies: builder.query({
      query: (params) => ({
        params: params,
        url: "/Company/GetAllCompanies",
        method: "GET",
      }),
      providesTags: ["Company"],
      transformResponse: (response) => response.value,
      transformErrorResponse: (response) => response.value,
    }),
    putCompany: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/Company/UpdateCompany/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Company"],
    }),
    patchCompanyStatus: builder.mutation({
      query: (id) => ({
        url: `/Company/UpdateCompanyStatus/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Company"],
    }),
  }),
});

export const {
  usePostCompanyMutation,
  useGetAllCompaniesQuery,
  usePutCompanyMutation,
  usePatchCompanyStatusMutation,
} = companyApi;
