import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { decryptString } from "../../utils/CustomFunctions";

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
        url: `/Registration/RegisterClient/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Registration", "Prospecting"],
    }),
  }),
});

export const { usePutRegisterClientMutation } = registrationApi;
