import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

let storedTokens = null;

if (localStorage) {
  storedTokens = JSON.parse(localStorage.getItem("tokens"));
}

const initialState = {
  tokens: storedTokens || null,
  user: storedTokens ? jwtDecode(storedTokens.access) : null,
  loading: false,
  error: "",
};

const baseURL = process.env.REACT_APP_API_URL;

export const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  try {
    const response = await axios.post(`${baseURL}/accounts/token/`, data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response ? error.response.data : "Something went wrong",
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTokens: (state, action) => {
      state.tokens = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      localStorage.removeItem("tokens");
      state.tokens = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.tokens = action.payload;
      state.user = jwtDecode(action.payload.access);
      localStorage.setItem("tokens", JSON.stringify(action.payload));
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { setTokens, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
