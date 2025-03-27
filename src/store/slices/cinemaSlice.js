import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://movie-ticket-backend-k4wm.onrender.com/api'; // Replace with your actual API URL

export const fetchCinemas = createAsyncThunk(
  'cinema/fetchCinemas',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/cinemas`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addCinema = createAsyncThunk(
  'cinema/addCinema',
  async (cinemaData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/cinemas`, cinemaData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateCinema = createAsyncThunk(
  'cinema/updateCinema',
  async ({ id, cinemaData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/cinemas/${id}`, cinemaData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteCinema = createAsyncThunk(
  'cinema/deleteCinema',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/cinemas/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  cinemas: [],
  loading: false,
  error: null,
};

const cinemaSlice = createSlice({
  name: 'cinema',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cinemas
      .addCase(fetchCinemas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCinemas.fulfilled, (state, action) => {
        state.loading = false;
        state.cinemas = action.payload;
      })
      .addCase(fetchCinemas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch cinemas';
      })
      // Add Cinema
      .addCase(addCinema.fulfilled, (state, action) => {
        state.cinemas.push(action.payload);
      })
      // Update Cinema
      .addCase(updateCinema.fulfilled, (state, action) => {
        const index = state.cinemas.findIndex(cinema => cinema.id === action.payload.id);
        if (index !== -1) {
          state.cinemas[index] = action.payload;
        }
      })
      // Delete Cinema
      .addCase(deleteCinema.fulfilled, (state, action) => {
        state.cinemas = state.cinemas.filter(cinema => cinema.id !== action.payload);
      });
  },
});

export const { clearError } = cinemaSlice.actions;
export default cinemaSlice.reducer; 