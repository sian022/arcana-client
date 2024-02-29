import { api } from "../../api";

const userConfigApi = api.injectEndpoints({
  endpoints: (builder) => ({
    patchUserPassword: builder.mutation({
      query: (payload) => ({
        url: "/User/ChangePassword",
        method: "PATCH",
        headers: { Accept: "application/json" },
        body: payload,
      }),
    }),
  }),
});

export const { usePatchUserPasswordMutation } = userConfigApi;
