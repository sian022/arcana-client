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
    putRegisterClient: builder.mutation({
      query: ({ clientId, ...body }) => ({
        url: `/Registration/RegisterClient/${clientId}`,
        method: "PUT",
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
  }),
});

export const {
  usePutRegisterClientMutation,
  usePutAddAttachmentsMutation,
  usePutAddTermsAndCondtionsMutation,
} = registrationApi;
