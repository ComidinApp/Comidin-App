import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Config } from "../../environment/environment";

export const commerceApi = createApi({
  reducerPath: "commerceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: Config.API_URL,
  }),
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");

    return headers;
  },
  endpoints: (builder) => ({
    // Query: obtener datos
    // Mutation: enviar datos/hacer acciones
    getCommerces: builder.query({
      query: () => "/commerce",
    }),
    getCommerceCategory: builder.query({
      query: (category) => `/commerceCategory/${category}`,
    }),
    getAllCommerceCategory: builder.query({
      query: () => "/commerceCategory",
    }),
    getAllCommerceByCategoryId: builder.query({
      query: (category) => `/commerce/category/${category}`,
    }),
  }),
});

export const {
  useGetCommercesQuery,
  useGetCommerceCategoryQuery,
  useGetAllCommerceCategoryQuery,
  useGetAllCommerceByCategoryIdQuery
} = commerceApi;
