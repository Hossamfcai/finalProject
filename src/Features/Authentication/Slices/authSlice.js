import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getUserDataService,
  loginService,
  logoutService,
  registerService,
} from "../Services/authServices";
import { removeLocalStorageItem } from "../../../utils/localStorage";

export const loginUser = createAsyncThunk("auth/login", async (body) => {
  const data = await loginService(body);
  return data;
});

export const registerUser = createAsyncThunk("auth/register", async (body) => {
  const data = await registerService(body);
  return data;
});

export const getuserData = createAsyncThunk(
  "auth/userData",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUserDataService();

      return data;
    } catch (error) {
      // expired / invalid token -> drop the stale session
      if (error?.response?.status === 401) {
        removeLocalStorageItem("token");
        removeLocalStorageItem("role");
      }
      return rejectWithValue({
        status: error?.response?.status ?? null,
        message: error.message,
      });
    }
  },
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await logoutService();
});
const initialState = {
  user: {},
  isAuthenticated: false,
  loading: false,
  error: null,
  sessionExpired: false,
  //register
  registerLoading: false,
  registerError: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: () => initialState,
    clearError: (state) => {
      state.error = null;
    },
  },
  // login //
  extraReducers: (builder) => {
    // login //
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message.includes("Network Error")
          ? "Unreachable to to the server."
          : "Invalid email or password";
      })

      // register //
      .addCase(registerUser.pending, (state) => {
        state.registerLoading = true;
        state.registerError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registerLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerLoading = false;
        state.registerError = action.error.message.includes("Network Error")
          ? "Unreachable to the server."
          : "This Email is Already exist.";
      })

      //get user data
      .addCase(getuserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getuserData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        // the service resolves {} when there is no stored token
        state.isAuthenticated = Boolean(action.payload?.id);
      })
      .addCase(getuserData.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.sessionExpired = action.payload?.status === 401;
        // only surface connectivity issues; the login form shows `error`
        state.error = action.payload?.message?.includes("Network Error")
          ? "Unreachable to to the server."
          : null;
      })

      //logout
      .addCase(logoutUser.fulfilled, () => initialState);
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
