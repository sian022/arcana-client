import { api } from "../../api";

const companyApi = api
  .enhanceEndpoints({ addTagTypes: ["Company"] })
  .injectEndpoints({
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
