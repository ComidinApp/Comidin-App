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
      keepUnusedDataFor: 0,
      forceRefetch: ({ currentArg, previousArg }) => {
        return true;
      },
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

// Invalidar el caché al montar la aplicación
export const invalidateAddressCache = () => {
  return addressApi.util.invalidateTags(['Address']);
};
