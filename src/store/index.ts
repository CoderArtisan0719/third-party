// store.ts
import { configureStore } from '@reduxjs/toolkit';

import requestReducer from './slices/requestSlice';
import routerReducer from './slices/routerSlice';

const store = configureStore({
  reducer: {
    request: requestReducer,
    router: routerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
