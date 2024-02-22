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
  tagTypes: [
    "Registration",
    "Clients For Listing",
    "TermsById",
    "AttachmentsById",
    "FreebiesById",
    "ListingFeeById",
    "OtherExpensesById",
    "ApprovalHistoryById",
  ],
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
      providesTags: ["Clients For Listing"],
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
      transformResponse: (response) => response.value,
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
        url: `/Client/VoidClientRegistration/${id}`,
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

    //View Tabs
    getTermsByClientId: builder.query({
      query: ({ id }) => ({
        url: `/terms/${id}`,
        method: "GET",
      }),
      transformResponse: (response) => response.value,
      transformErrorResponse: (response) => response.value,
      providesTags: ["TermsById"],
    }),

    getAttachmentsByClientId: builder.query({
      query: ({ id }) => ({
        url: `/attachments/${id}`,
        method: "GET",
      }),
      providesTags: ["AttachmentsById"],
      transformResponse: (response) => response.value,
      transformErrorResponse: (response) => response.value,
    }),

    getFreebiesByClientId: builder.query({
      query: ({ id }) => ({
        url: `/freebies/${id}`,
        method: "GET",
      }),
      providesTags: ["FreebiesById"],
      transformResponse: (response) => response.value,
      transformErrorResponse: (response) => response.value,
    }),

    getListingFeeByClientId: builder.query({
      query: ({ id }) => ({
        url: `/listingfee/${id}`,
        method: "GET",
      }),
      providesTags: ["ListingFeeById"],
      transformResponse: (response) => response.value,
      transformErrorResponse: (response) => response.value,
    }),

    getOtherExpensesByClientId: builder.query({
      query: ({ id }) => ({
        url: `/other-expenses/${id}`,
        method: "GET",
      }),
      providesTags: ["OtherExpensesById"],
      transformResponse: (response) => response.value,
      transformErrorResponse: (response) => response.value,
    }),

    getClientApprovalHistoryById: builder.query({
      query: ({ id }) => ({
        url: `/client/${id}/approval-history`,
        method: "GET",
      }),
      providesTags: ["ApprovalHistoryById"],
      transformResponse: (response) => response.value,
      transformErrorResponse: (response) => response.value,
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

  //View Tabs
  useGetTermsByClientIdQuery,
  useLazyGetTermsByClientIdQuery,
  useGetAttachmentsByClientIdQuery,
  useLazyGetAttachmentsByClientIdQuery,
  useGetFreebiesByClientIdQuery,
  useGetListingFeeByClientIdQuery,
  useGetOtherExpensesByClientIdQuery,

  //Approval History
  useLazyGetClientApprovalHistoryByIdQuery,
} = registrationApi;
