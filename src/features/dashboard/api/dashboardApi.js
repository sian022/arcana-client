import { api } from "../../api";

const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: (params) => ({
        url: "/dashboard",
        method: "GET",
        params,
      }),
    }),
  }),
});

export const { useGetDashboardDataQuery } = dashboardApi;
