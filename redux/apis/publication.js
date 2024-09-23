import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Config } from "../../environment/environment";

export const publicationApi = createApi({
  reducerPath: "publicationApi",
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
    getpublicationByCommerce: builder.query({
      query: (commerce) => `/publication/commerce/${commerce}`,
    }),
  }),
});

export const {
  useGetpublicationByCommerceQuery,
} = publicationApi;
