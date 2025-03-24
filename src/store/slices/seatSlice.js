import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://movie-ticket-backend-k4wm.onrender.com/api';

export const fetchSeats = createAsyncThunk(
  'seats/fetchSeats',
  async (roomId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/seats/${roomId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch seats');
    }
  }
);

export const addSeats = createAsyncThunk(
  'seats/addSeats',
  async (seatsData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/seats`, seatsData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add seats');
    }
  }
);

export const updateSeat = createAsyncThunk(
  'seats/updateSeat',
  async ({ id, seatData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/seats/${id}`, seatData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update seat');
    }
  }
);

export const deleteSeat = createAsyncThunk(
  'seats/deleteSeat',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/seats/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete seat');
    }
  }
);

const seatSlice = createSlice({
  name: 'seats',
  initialState: {
    seats: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch seats
      .addCase(fetchSeats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeats.fulfilled, (state, action) => {
        state.loading = false;
        state.seats = action.payload;
      })
      .addCase(fetchSeats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add seats
      .addCase(addSeats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSeats.fulfilled, (state, action) => {
        state.loading = false;
        state.seats = [...state.seats, ...action.payload];
      })
      .addCase(addSeats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update seat
      .addCase(updateSeat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSeat.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.seats.findIndex((seat) => seat._id === action.payload._id);
        if (index !== -1) {
          state.seats[index] = action.payload;
        }
      })
      .addCase(updateSeat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete seat
      .addCase(deleteSeat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSeat.fulfilled, (state, action) => {
        state.loading = false;
        state.seats = state.seats.filter((seat) => seat._id !== action.payload);
      })
      .addCase(deleteSeat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = seatSlice.actions;
export default seatSlice.reducer; 