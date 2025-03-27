import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cinemaReducer from './slices/cinemaSlice';
import showtimeReducer from './slices/showtimeSlice';
import roomReducer from './slices/roomSlice';
import seatReducer from './slices/seatSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cinema: cinemaReducer,
    showtime: showtimeReducer,
    room: roomReducer,
    seat: seatReducer,
  },
}); 