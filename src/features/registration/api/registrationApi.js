import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { decryptString } from "../../../utils/CustomFunctions";

export const registrationApi = createApi({
  reducerPath: "registrationApi",
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
  tagTypes: ["Registration"],
  endpoints: (builder) => ({
    getAllClients: builder.query({
      query: (params) => ({
        params: params,
        url: "/Clients/GetAllClients",
        method: "GET",
      }),
      providesTags: ["Registration"],
      transformResponse: (response) => response.data,
      transformErrorResponse: (response) => response.data,
    }),

    getAllClientsForListingFee: builder.query({
      query: (params) => ({
        params: params,
        url: "/ListingFee/GetAllClientsInListingFee",
        method: "GET",
      }),
      providesTags: ["Registration"],
      transformResponse: (response) => response.data,
      transformErrorResponse: (response) => response.data,
    }),

    putRegisterClient: builder.mutation({
      query: ({ clientId, ...body }) => ({
        url: `/Registration/RegisterClient/${clientId}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Registration"],
    }),

    postDirectRegistration: builder.mutation({
      query: (body) => ({
        url: `/DirectRegistration/DirectRegistration`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Registration"],
    }),

    putAddAttachments: builder.mutation({
      query: ({ id, ...body }) => {
        console.log(body);
        return {
          url: `/Registration/AddAttachments/${id}`,
          method: "PUT",
          body: body?.formData,
          // body,
          // body: body?.masterFormData,
        };
      },
      invalidatesTags: ["Registration"],
    }),

    putAddTermsAndCondtions: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/Registration/AddTermsAndCondition/${id}`,
        method: "PUT",
        body: body?.termsAndConditions,
      }),
      invalidatesTags: ["Registration"],
    }),

    putApproveRegistration: builder.mutation({
      query: ({ id }) => ({
        url: `/RegularClients/ApproveForRegularRegistration/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Registration"],
    }),

    putRejectRegistration: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/RegularClients/RejectRegularRegistration/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Registration"],
    }),
  }),
});

export const {
  useGetAllClientsQuery,
  useGetAllClientsForListingFeeQuery,
  usePutRegisterClientMutation,
  usePutAddAttachmentsMutation,
  usePutAddTermsAndCondtionsMutation,
  usePostDirectRegistrationMutation,
  usePutApproveRegistrationMutation,
  usePutRejectRegistrationMutation,
} = registrationApi;
