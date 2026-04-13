import { configureStore } from '@reduxjs/toolkit';
import navigationReducer from './features/navigationSlice';
import eventsReducer from './features/eventsSlice';
import recordsReducer from './features/recordsSlice';

export const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    events: eventsReducer,
    records: recordsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;