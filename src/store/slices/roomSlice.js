import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://movie-ticket-backend-k4wm.onrender.com/api'; // Replace with your actual API URL

export const fetchRooms = createAsyncThunk(
  'room/fetchRooms',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/rooms`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addRoom = createAsyncThunk(
  'room/addRoom',
  async (roomData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/rooms`, roomData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateRoom = createAsyncThunk(
  'room/updateRoom',
  async ({ id, roomData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/rooms/${id}`, roomData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteRoom = createAsyncThunk(
  'room/deleteRoom',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/rooms/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  rooms: [],
  loading: false,
  error: null,
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Rooms
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch rooms';
      })
      // Add Room
      .addCase(addRoom.fulfilled, (state, action) => {
        state.rooms.push(action.payload);
      })
      // Update Room
      .addCase(updateRoom.fulfilled, (state, action) => {
        const index = state.rooms.findIndex(room => room.id === action.payload.id);
        if (index !== -1) {
          state.rooms[index] = action.payload;
        }
      })
      // Delete Room
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.rooms = state.rooms.filter(room => room.id !== action.payload);
      });
  },
});

export const { clearError } = roomSlice.actions;
export default roomSlice.reducer; 