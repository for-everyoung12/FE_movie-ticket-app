import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://movie-ticket-backend-k4wm.onrender.com/api'; // Replace with your actual API URL

export const fetchShowtimes = createAsyncThunk(
  'showtime/fetchShowtimes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/showtimes`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addShowtime = createAsyncThunk(
  'showtime/addShowtime',
  async (showtimeData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/showtimes`, showtimeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateShowtime = createAsyncThunk(
  'showtime/updateShowtime',
  async ({ id, showtimeData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/showtimes/${id}`, showtimeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteShowtime = createAsyncThunk(
  'showtime/deleteShowtime',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/showtimes/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  showtimes: [],
  loading: false,
  error: null,
};

const showtimeSlice = createSlice({
  name: 'showtime',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Showtimes
      .addCase(fetchShowtimes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShowtimes.fulfilled, (state, action) => {
        state.loading = false;
        state.showtimes = action.payload.showtimes; // Sửa lại để lấy dữ liệu từ key "showtimes"
      })
      .addCase(fetchShowtimes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch showtimes';
      })
      // Add Showtime
      .addCase(addShowtime.fulfilled, (state, action) => {
        state.showtimes.push(action.payload);
      })
      // Update Showtime
      .addCase(updateShowtime.fulfilled, (state, action) => {
        const index = state.showtimes.findIndex(showtime => showtime.id === action.payload.id);
        if (index !== -1) {
          state.showtimes[index] = action.payload;
        }
      })
      // Delete Showtime
      .addCase(deleteShowtime.fulfilled, (state, action) => {
        state.showtimes = state.showtimes.filter(showtime => showtime.id !== action.payload);
      });
  },
});

export const { clearError } = showtimeSlice.actions;
export default showtimeSlice.reducer;