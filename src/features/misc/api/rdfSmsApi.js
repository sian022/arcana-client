import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_RDF_SMS_BASE_URL;

export const rdfSmsApi = createApi({
  reducerPath: "rdfSmsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      headers.set(
        "Authorization",
        `Bearer ${import.meta.env.VITE_RDF_SMS_TOKEN}`
      );
      return headers;
    },
  }),
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: ({ message, mobile_number }) => ({
        url: "/post_message",
        method: "POST",
        body: {
          system_name: "Arcana",
          message: `${message} \n\n-Arcana System SMS`,
          mobile_number,
        },
      }),

      transformErrorResponse: (response) => ({
        function: "sendMessage",
        ...response,
      }),
    }),
  }),
});

export const { useSendMessageMutation } = rdfSmsApi;
