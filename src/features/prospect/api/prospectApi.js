import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { decryptString } from "../../../utils/CustomFunctions";

export const prospectApi = createApi({
  reducerPath: "prospectApi",
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
  tagTypes: ["Prospecting"],
  endpoints: (builder) => ({
    postProspect: builder.mutation({
      query: (body) => ({
        url: "/Prospecting/AddNewProspect",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Prospecting"],
    }),
    getAllApprovedProspects: builder.query({
      query: (params) => ({
        params: params,
        url: "/Prospecting/GetAllApprovedProspect",
        method: "GET",
      }),
      providesTags: ["Prospecting"],
      transformResponse: (response) => response.value,
      transformErrorResponse: (response) => response.value,
    }),
    // getAllRejectedProspects: builder.query({
    //   query: (params) => ({
    //     params: params,
    //     url: "/Prospecting/GetAllRejectProspect",
    //     method: "GET",
    //   }),
    //   providesTags: ["Prospecting"],
    //   transformResponse: (response) => response.data,
    //   transformErrorResponse: (response) => response.data,
    // }),
    getAllReleasedProspects: builder.query({
      query: (params) => ({
        params: params,
        url: "/Prospect/GetAllReleasedProspectingRequest",
        method: "GET",
      }),
      providesTags: ["Prospecting"],
      transformResponse: (response) => response.value,
      transformErrorResponse: (response) => response.value,
    }),
    getAllRequestedProspects: builder.query({
      query: (params) => ({
        params: params,
        url: "/Prospecting/GetAllRequestedProspect",
        method: "GET",
      }),
      providesTags: ["Prospecting"],
      transformResponse: (response) => response.value,
      transformErrorResponse: (response) => response.value,
    }),
    putProspect: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/Prospecting/UpdateProspectInformation/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Prospecting"],
    }),

    putReleaseProspect: builder.mutation({
      query: ({ id, body }) => {
        // const { ESignature, PhotoProof } = body;

        return {
          url: `/Prospecting/ReleasedProspectingRequest/${id}`,
          method: "PUT",
          body: body,
        };
      },
      invalidatesTags: ["Prospecting"],
    }),
    patchProspectStatus: builder.mutation({
      query: (id) => ({
        url: `/Prospecting/UpdateApprovedProspectStatus/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Prospecting"],
    }),

    postRequestFreebies: builder.mutation({
      query: ({ clientId, ...body }) => ({
        url: `/Freebies/RequestFreebies/${clientId}`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Prospecting"],
    }),

    putFreebiesInformation: builder.mutation({
      query: ({ id, params, ...body }) => ({
        url: `/Freebie/UpdateFreebieInformation/${id}`,
        method: "PUT",
        params: params,
        body: body,
      }),
      invalidatesTags: ["Prospecting"],
    }),

    putRejectFreebies: builder.mutation({
      query: (id) => ({
        url: `/Freebies/RejectFreebies/${id}`,
        method: "PUT",
        // params: params,
        // body: body,
      }),
      invalidatesTags: ["Prospecting"],
    }),

    patchVoidProspect: builder.mutation({
      query: (id) => ({
        url: `/Prospecting/VoidProspectingRequest/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Prospecting"],
    }),
  }),
});

export const {
  usePostProspectMutation,
  useGetAllApprovedProspectsQuery,
  useGetAllReleasedProspectsQuery,
  usePutProspectMutation,
  usePutReleaseProspectMutation,
  usePatchProspectStatusMutation,
  usePostRequestFreebiesMutation,
  usePutFreebiesInformationMutation,
  usePutRejectFreebiesMutation,
  usePatchVoidProspectMutation,
} = prospectApi;
