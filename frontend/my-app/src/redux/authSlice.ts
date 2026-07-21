import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CurrentUser } from "./api";

type AuthState = {
  user: CurrentUser | null;
};

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setUser: (state, action: PayloadAction<CurrentUser | null>) => {
      state.user = action.payload;
    },

    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;

export default authSlice.reducer;
