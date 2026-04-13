import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  imageUrl: string;
}

interface EventsState {
  upcomingEvents: Event[];
  pastCompetitions: Event[];
}

const initialState: EventsState = {
  upcomingEvents: [],
  pastCompetitions: [],
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setUpcomingEvents: (state, action: PayloadAction<Event[]>) => {
      state.upcomingEvents = action.payload;
    },
    setPastCompetitions: (state, action: PayloadAction<Event[]>) => {
      state.pastCompetitions = action.payload;
    },
  },
});

export const { setUpcomingEvents, setPastCompetitions } = eventsSlice.actions;
export default eventsSlice.reducer;