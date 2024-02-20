import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_SEDAR_BASE_URL;

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
      query: (body) => ({
        url: "/post_message",
        method: "POST",
        body: { system: "Arcana", ...body },
      }),
    }),
  }),
});

export const { useSendMessageMutation } = rdfSmsApi;
