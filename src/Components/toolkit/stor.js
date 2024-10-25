import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../toolkit/Slice';

const store = configureStore({
  reducer: {
    authReducer: authReducer,
  },
});

export default store;
