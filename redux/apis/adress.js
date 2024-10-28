import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Config } from "../../environment/environment";

export const adressApi = createApi({
  reducerPath: "adressApi",
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
    postAdress: builder.mutation({
      query: (adress) => ({
        url: `/adress`,
        method: 'POST',
        body: adress,
      }),       
    }),
  }),
});

export const {
  usePostAdressMutation,
} = adressApi;
