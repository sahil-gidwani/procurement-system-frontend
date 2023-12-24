import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jwt_decode from "jwt-decode";

const initialState = {
    tokens: localStorage.getItem('tokens') || null,
    user: null,
    loading: false,
    error: ''
}

export const login = createAsyncThunk(
    'auth/login',
    async (data, thunkAPI) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', data);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response ? error.response.data : 'Something went wrong');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setTokens: (state, action) => {
            state.tokens = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        logout: (state) => {
            localStorage.removeItem('tokens');
            Object.assign(state, initialState);
        }
    },
    extraReducers: builder => {
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = '';
        });
        builder.addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.tokens = action.payload;
            state.user = jwt_decode(action.payload);
            localStorage.setItem('tokens', action.payload);
        });
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
