import { api } from "../../api";

const uomApi = api.enhanceEndpoints({ addTagTypes: ["UOM"] }).injectEndpoints({
  endpoints: (builder) => ({
    postUom: builder.mutation({
      query: (body) => ({
        url: "/Uom/AddNewUom",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["UOM"],
    }),
    getAllUoms: builder.query({
      query: (params) => ({
        params: params,
        url: "/Uom/GetUom",
        method: "GET",
      }),
      providesTags: ["UOM"],
      transformResponse: (response) => response.value,
      transformErrorResponse: (response) => response.value,
    }),
    putUom: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/Uom/UpdateUom/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["UOM"],
    }),
    patchUomStatus: builder.mutation({
      query: (id) => ({
        url: `/Uom/UpdateUomStatus/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["UOM"],
    }),
  }),
});

export const {
  usePostUomMutation,
  useGetAllUomsQuery,
  usePutUomMutation,
  usePatchUomStatusMutation,
} = uomApi;
