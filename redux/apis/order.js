import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Config } from "../../environment/environment";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: Config.API_URL,
  }),
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: '/order',
        method: 'POST',
        body: orderData,
      }),
    }),
    getUserOrders: builder.query({
      query: (userId) => `/order/user/${userId}`,
    }),
    getOrderStatus: builder.query({
      query: (orderId) => `/order/${orderId}`,
    }),
  }),
});

export const { 
  useCreateOrderMutation, 
  useGetUserOrdersQuery,
  useGetOrderStatusQuery 
} = orderApi; 