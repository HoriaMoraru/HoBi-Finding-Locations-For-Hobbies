import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface AuthState {
    isAuthenticated: boolean;
    user: { email: string; } | null;
    loading: boolean;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    loading: true
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess(state, action: PayloadAction<{ email: string; }>) {
            state.isAuthenticated = true;
            state.user = action.payload;
            state.loading = false;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.user = null;
            state.loading = false;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
    },
});

export const { loginSuccess, logout, setLoading } = authSlice.actions;

export default authSlice.reducer;
