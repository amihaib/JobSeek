import { configureStore } from "@reduxjs/toolkit";
import { userApiSlice } from "./slices/userApiSlice";
import { employerApiSlice } from "./slices/employerApiSlice";
import { jobApiSlice } from "./slices/jobApiSlice";
import { optApiSlice } from "./slices/optApiSlice";
import { authApiSlice } from "./slices/authApiSlice";

const store = configureStore({
  reducer: {
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    [employerApiSlice.reducerPath]: employerApiSlice.reducer,
    [jobApiSlice.reducerPath]: jobApiSlice.reducer,
    [optApiSlice.reducerPath]: optApiSlice.reducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApiSlice.middleware)
      .concat(employerApiSlice.middleware)
      .concat(jobApiSlice.middleware)
      .concat(optApiSlice.middleware)
      .concat(authApiSlice.middleware),
  devTools: true,
});

export default store;
