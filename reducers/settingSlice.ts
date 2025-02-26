import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

export interface SettingState {
  theme: 'default' | 'light' | 'dark';
}

const initialState: SettingState = {
  theme: 'default',
};

export const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'default' | 'light' | 'dark'>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.theme = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setTheme} = settingSlice.actions;

export default settingSlice.reducer;
