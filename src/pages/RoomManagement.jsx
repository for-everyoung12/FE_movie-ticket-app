import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import {
  fetchRooms,
  addRoom,
  updateRoom,
  deleteRoom,
  clearError,
} from '../store/slices/roomSlice';
import { fetchCinemas } from '../store/slices/cinemaSlice';

function RoomManagement() {
  const dispatch = useDispatch();
  const { rooms, loading, error } = useSelector((state) => state.room);
  const { cinemas } = useSelector((state) => state.cinema);
  const [open, setOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    cinema_id: '',
    hall_number: '',
    total_seats: '',
  });

  useEffect(() => {
    dispatch(fetchRooms());
    dispatch(fetchCinemas());
  }, [dispatch]);

  const handleOpen = (room = null) => {
    if (room) {
      setEditingRoom(room);
      setFormData({
        cinema_id: room.cinema_id,
        hall_number: room.hall_number,
        total_seats: room.total_seats,
      });
    } else {
      setEditingRoom(null);
      setFormData({
        cinema_id: '',
        hall_number: '',
        total_seats: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingRoom(null);
    setFormData({
      cinema_id: '',
      hall_number: '',
      total_seats: '',
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingRoom) {
      await dispatch(updateRoom({ id: editingRoom._id, roomData: formData }));
    } else {
      await dispatch(addRoom(formData));
    }
    handleClose();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      await dispatch(deleteRoom(id));
    }
  };

  const getCinemaName = (cinemaId) => {
    const cinema = cinemas.find((c) => c._id === cinemaId);
    return cinema ? cinema.name : 'Unknown';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Room Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Room
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Hall Number</TableCell>
              <TableCell>Cinema</TableCell>
              <TableCell>Total Seats</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room._id}>
                <TableCell>{room.hall_number}</TableCell>
                <TableCell>{getCinemaName(room.cinema_id)}</TableCell>
                <TableCell>{room.total_seats}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(room)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(room._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingRoom ? 'Edit Room' : 'Add New Room'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              select
              label="Cinema"
              name="cinema_id"
              value={formData.cinema_id}
              onChange={handleChange}
              margin="normal"
              required
            >
              {cinemas.map((cinema) => (
                <MenuItem key={cinema._id} value={cinema._id}>
                  {cinema.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Hall Number"
              name="hall_number"
              type="number"
              value={formData.hall_number}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Total Seats"
              name="total_seats"
              type="number"
              value={formData.total_seats}
              onChange={handleChange}
              margin="normal"
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingRoom ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default RoomManagement; 