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
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import {
  fetchSeats,
  addSeats,
  updateSeat,
  deleteSeat,
  clearError,
} from '../store/slices/seatSlice';
import { fetchRooms } from '../store/slices/roomSlice';

function SeatManagement() {
  const dispatch = useDispatch();
  const { seats = [], loading, error } = useSelector((state) => state.seat);
  const { rooms } = useSelector((state) => state.room);
  const [open, setOpen] = useState(false);
  const [editingSeat, setEditingSeat] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [formData, setFormData] = useState({
    room_id: '',
    seat_number: '',
    status: 'available',
    showtime_id: '',
  });

  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);

  useEffect(() => {
    if (selectedRoom) {
      dispatch(fetchSeats(selectedRoom));
    }
  }, [dispatch, selectedRoom]);

  const handleOpen = (seat = null) => {
    if (seat) {
      setEditingSeat(seat);
      setFormData({
        room_id: seat.room_id,
        seat_number: seat.seat_number,
        status: seat.status,
        showtime_id: seat.showtime_id || '',
      });
    } else {
      setEditingSeat(null);
      setFormData({
        room_id: selectedRoom,
        seat_number: '',
        status: 'available',
        showtime_id: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingSeat(null);
    setFormData({
      room_id: selectedRoom,
      seat_number: '',
      status: 'available',
      showtime_id: '',
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
    if (editingSeat) {
      await dispatch(updateSeat({ id: editingSeat._id, seatData: formData }));
    } else {
      await dispatch(addSeats([formData]));
    }
    handleClose();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this seat?')) {
      await dispatch(deleteSeat(id));
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Seat Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          disabled={!selectedRoom}
        >
          Add Seat
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <TextField
          select
          label="Select Room"
          value={selectedRoom}
          onChange={(e) => setSelectedRoom(e.target.value)}
          sx={{ minWidth: 200 }}
          required
        >
          {rooms.map((room) => (
            <MenuItem key={room._id} value={room._id}>
              Hall {room.hall_number}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {selectedRoom && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Seat Number</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Showtime ID</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(seats) && seats.length > 0 ? (
                seats.map((seat) => (
                  <TableRow key={seat._id}>
                    <TableCell>{seat.seat_number}</TableCell>
                    <TableCell>
                      <Chip
                        label={seat.status}
                        color={seat.status === 'available' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{seat.showtime_id || 'N/A'}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpen(seat)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(seat._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No seats found for this room
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingSeat ? 'Edit Seat' : 'Add New Seat'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Seat Number"
              name="seat_number"
              value={formData.seat_number}
              onChange={handleChange}
              margin="normal"
              required
              placeholder="e.g., A1, B2"
            />
            <TextField
              fullWidth
              select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              margin="normal"
              required
            >
              <MenuItem value="available">Available</MenuItem>
              <MenuItem value="booked">Booked</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Showtime ID"
              name="showtime_id"
              value={formData.showtime_id}
              onChange={handleChange}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingSeat ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SeatManagement; 