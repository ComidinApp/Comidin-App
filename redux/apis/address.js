import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Config } from "../../environment/environment";

export const addressApi = createApi({
  reducerPath: 'addressApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: Config.API_URL,
  }),
  endpoints: (builder) => ({
    getAddressByUserId: builder.query({
      query: (userId) => `/address/user/${userId}`,
    }),
    postAddress: builder.mutation({
      query: (address) => ({
        url: '/address',
        method: 'POST',
        body: address,
      }),
    }),
  }),
});

export const {
  useGetAddressByUserIdQuery,
  usePostAddressMutation,
} = addressApi;
