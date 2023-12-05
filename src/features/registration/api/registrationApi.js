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
      transformResponse: (response) => response.value,
      transformErrorResponse: (response) => response.value,
    }),

    getAllClientsForListingFee: builder.query({
      query: (params) => ({
        params: params,
        url: "/ListingFee/GetAllClientsInListingFee",
        method: "GET",
      }),
      providesTags: ["Registration"],
      transformResponse: (response) => response.value,
      transformErrorResponse: (response) => response.value,
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

    putUpdateClientInformation: builder.mutation({
      query: ({ clientId, ...body }) => ({
        url: `/Client/UpdateClientInformation/${clientId}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Registration"],
    }),

    putAddAttachments: builder.mutation({
      query: ({ id, ...body }) => {
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

    putAddAttachmentsForDirect: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/RegularRegistration/AddAttachmentsForDirectClient/${id}`,
        method: "PUT",
        body: body?.formData,
      }),
      invalidatesTags: ["Registration"],
    }),

    putUpdateClientAttachments: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/Client/UpdateClientAttachments/${id}`,
        method: "PUT",
        body: body?.formData,
      }),
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

    // putApproveRegistration: builder.mutation({
    //   query: ({ id }) => ({
    //     url: `/RegularClients/ApproveForRegularRegistration/${id}`,
    //     method: "PUT",
    //   }),
    //   invalidatesTags: ["Registration"],
    // }),

    putApproveClient: builder.mutation({
      query: ({ id }) => ({
        url: `/RegularClients/ApproveClientRegistration/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Registration"],
    }),

    // putRejectRegistration: builder.mutation({
    //   query: ({ id, ...body }) => ({
    //     url: `/RegularClients/RejectRegularRegistration/${id}`,
    //     method: "PUT",
    //     body: body,
    //   }),
    //   invalidatesTags: ["Registration"],
    // }),

    putRejectClient: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/Clients/RejectClientRegistration/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Registration"],
    }),

    patchUpdateRegistrationStatus: builder.mutation({
      query: (id) => ({
        url: `/DirectRegistration/UpdateDirectRegisteredClientStatus/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Registration"],
    }),

    putVoidClientRegistration: builder.mutation({
      query: (id) => ({
        url: `/Clients/VoidClientRegistration/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Registration"],
    }),

    putReleaseFreebies: builder.mutation({
      query: ({ id, body }) => ({
        url: `/Freebies/ReleaseFreebies/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Registration"],
    }),

    postValidateClient: builder.mutation({
      query: (body) => ({
        url: `/Validation/ValidateClient`,
        method: "POST",
        body: body,
      }),
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
  // usePutApproveRegistrationMutation,
  // usePutRejectRegistrationMutation,
  usePutRejectClientMutation,
  usePutApproveClientMutation,
  usePutAddAttachmentsForDirectMutation,
  usePutUpdateClientInformationMutation,
  usePatchUpdateRegistrationStatusMutation,
  usePutVoidClientRegistrationMutation,
  usePutUpdateClientAttachmentsMutation,
  usePutReleaseFreebiesMutation,
  usePostValidateClientMutation,
} = registrationApi;
