import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NavigationState {
  isMobileMenuOpen: boolean;
}

const initialState: NavigationState = {
  isMobileMenuOpen: false,
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileMenuOpen = action.payload;
    },
  },
});

export const { toggleMobileMenu, setMobileMenuOpen } = navigationSlice.actions;
export default navigationSlice.reducer;