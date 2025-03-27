import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  fetchShowtimes,
  addShowtime,
  updateShowtime,
  deleteShowtime,
  clearError,
} from "../store/slices/showtimeSlice";

function ShowtimeManagement() {
  const dispatch = useDispatch();
  const {
    showtimes = [],
    loading,
    error,
  } = useSelector((state) => state.showtime);
  const [open, setOpen] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState(null);
  const [formData, setFormData] = useState({
    movie_id: "",
    room_id: "",
    showtime: "",
    available_seats: "",
    price: "",
  });

  useEffect(() => {
    dispatch(fetchShowtimes());
  }, [dispatch]);

  console.log(showtimes); // Thêm log để kiểm tra dữ liệu showtimes

  const handleOpen = (showtime = null) => {
    if (showtime) {
      setEditingShowtime(showtime);
      setFormData({
        movie_id: showtime.movie_id._id,
        room_id: showtime.room_id?._id || "",
        showtime: showtime.showtime.slice(0, 16), // Format for datetime-local input
        available_seats: showtime.available_seats,
        price: showtime.price,
      });
    } else {
      setEditingShowtime(null);
      setFormData({
        movie_id: "",
        room_id: "",
        showtime: "",
        available_seats: "",
        price: "",
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingShowtime(null);
    setFormData({
      movie_id: "",
      room_id: "",
      showtime: "",
      available_seats: "",
      price: "",
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
    if (editingShowtime) {
      await dispatch(
        updateShowtime({ id: editingShowtime._id, showtimeData: formData })
      );
    } else {
      await dispatch(addShowtime(formData));
    }
    handleClose();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this showtime?")) {
      await dispatch(deleteShowtime(id));
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Showtime Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Showtime
        </Button>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => dispatch(clearError())}
        >
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Movie Title</TableCell>
              <TableCell>Showtime</TableCell>
              <TableCell>Available Seats</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(showtimes) && showtimes.length > 0 ? (
              showtimes.map((showtime) => (
                <TableRow key={showtime._id}>
                  <TableCell>{showtime.movie_id?.title || "N/A"}</TableCell>
                  <TableCell>
                    {new Date(showtime.showtime).toLocaleString()}
                  </TableCell>
                  <TableCell>{showtime.available_seats}</TableCell>
                  <TableCell>${showtime.price}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(showtime)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(showtime._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No showtimes found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingShowtime ? "Edit Showtime" : "Add New Showtime"}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Movie Title"
              name="movie_id"
              value={formData.movie_id}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Room ID"
              name="room_id"
              value={formData.room_id}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Showtime"
              name="showtime"
              type="datetime-local"
              value={formData.showtime}
              onChange={handleChange}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Available Seats"
              name="available_seats"
              type="number"
              value={formData.available_seats}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              margin="normal"
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingShowtime ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ShowtimeManagement;
