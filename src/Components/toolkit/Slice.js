import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: localStorage.getItem('user') || null,
  token: localStorage.getItem('token') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token; 
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', action.payload.user);
    },
    logout: (state) => {
      state.user = null;
      state.token = null; 
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
