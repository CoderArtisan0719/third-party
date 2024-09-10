/* eslint-disable no-param-reassign */
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

type RouterType = {
  intendedDo: string;
};

const initialState: RouterType = {
  intendedDo: '',
};

const routerSlice = createSlice({
  name: 'router',

  initialState,

  reducers: {
    setIntendedDo: (state, action: PayloadAction<string>) => {
      state.intendedDo = action.payload;
    },
  },
});

export const { setIntendedDo } = routerSlice.actions;

export default routerSlice.reducer;
