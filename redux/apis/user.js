import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Config } from "../../environment/environment";

export const userApi = createApi({
  reducerPath: "userApi",
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
    postUserData: builder.mutation({
      query: (userData) => ({
        url: `/user`,
        method: 'POST',
        body: userData,
      }),       
    }),
    getUserData: builder.query({
      query: (userId) => `/user/${userId}`,
    }),
    getUserByEmail: builder.query({
      query: (email) => `/user/email/${email}`,
    }),
    updateUserData: builder.mutation({
      query: ({ userId, userData }) => ({
        url: `/user/${userId}`,
        method: 'PUT',
        body: userData,
      }),
    }),
  }),
});

export const {
  usePostUserDataMutation,
  useGetUserDataQuery,
  useGetUserByEmailQuery,
  useUpdateUserDataMutation,
} = userApi; 