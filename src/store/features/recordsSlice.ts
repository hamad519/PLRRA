import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Record {
  id: string;
  title: string;
  description: string;
  year: number;
}

interface RecordsState {
  nationalRecords: Record[];
  ftrRanking: Record[];
  fOpenRanking: Record[];
  awardNationalColor: Record[];
}

const initialState: RecordsState = {
  nationalRecords: [],
  ftrRanking: [],
  fOpenRanking: [],
  awardNationalColor: [],
};

const recordsSlice = createSlice({
  name: 'records',
  initialState,
  reducers: {
    setNationalRecords: (state, action: PayloadAction<Record[]>) => {
      state.nationalRecords = action.payload;
    },
    setFtrRanking: (state, action: PayloadAction<Record[]>) => {
      state.ftrRanking = action.payload;
    },
    setFOpenRanking: (state, action: PayloadAction<Record[]>) => {
      state.fOpenRanking = action.payload;
    },
    setAwardNationalColor: (state, action: PayloadAction<Record[]>) => {
      state.awardNationalColor = action.payload;
    },
  },
});

export const { setNationalRecords, setFtrRanking, setFOpenRanking, setAwardNationalColor } = recordsSlice.actions;
export default recordsSlice.reducer;