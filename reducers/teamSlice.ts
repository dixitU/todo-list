import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

type Team = {
  name: string;
  url: string;
};

export interface TeamState {
  urls: string[];
  pokemons: Team[];
}

const initialState: TeamState = {
  urls: [],
  pokemons: [],
};

export const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    addToTeam: (state, action: PayloadAction<Team>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      if (!state.urls.includes(action.payload.url)) {
        state.urls.push(action.payload.url);
        state.pokemons.push(action.payload);
      }
    },
    removeFromTeam: (state, action: PayloadAction<Team>) => {
      if (state.urls.includes(action.payload.url)) {
        state.urls = state.urls.filter((e: string) => e !== action.payload.url);
        state.pokemons = state.pokemons.filter((e: Team) => e.url !== action.payload.url);
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const {addToTeam, removeFromTeam} = teamSlice.actions;

export default teamSlice.reducer;
