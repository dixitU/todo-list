import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
};

type Token = {
  accessToken: string;
  refreshToken: string;
};

export interface AuthState {
  token: Token
  profile: User;
}

const initialState: AuthState = {
  token: {
    accessToken: '',
    refreshToken: ''
  },
  profile: {
    _id: '',
    name: '',
    email: '',
    password: '',
  },
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<AuthState>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      const payload: AuthState = action.payload;
      state.token = payload.token;
      state.profile = payload.profile;
    },
    clearAuth: state => {
      state.token = initialState.token;
      state.profile = initialState.profile;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setAuth, clearAuth} = authSlice.actions;

export default authSlice.reducer;
