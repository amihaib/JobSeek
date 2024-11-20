import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const authApiSlice = createApi({
  reducerPath: "auth",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api" }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/users/login",
        method: "post",
        body: data,
        credentials: "include",
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, password, confirmPassword }) => ({
        url: `/users/resetPassword/${token}`,
        method: "post",
        body: { password, confirmPassword },
      }),
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/users/forgotPassword",
        method: "post",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useResetPasswordMutation,
  useForgotPasswordMutation,
} = authApiSlice;
