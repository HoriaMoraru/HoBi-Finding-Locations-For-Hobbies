import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import mapReducer from "./mapSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        map: mapReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
