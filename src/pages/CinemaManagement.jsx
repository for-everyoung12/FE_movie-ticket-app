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
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import {
  fetchCinemas,
  addCinema,
  updateCinema,
  deleteCinema,
  clearError,
} from '../store/slices/cinemaSlice';

function CinemaManagement() {
  const dispatch = useDispatch();
  const { cinemas, loading, error } = useSelector((state) => state.cinema);
  const [open, setOpen] = useState(false);
  const [editingCinema, setEditingCinema] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    total_rooms: '',
    location: {
      address: '',
      coordinates: {
        lat: '',
        lng: '',
      },
    },
  });

  useEffect(() => {
    dispatch(fetchCinemas());
  }, [dispatch]);

  const handleOpen = (cinema = null) => {
    if (cinema) {
      setEditingCinema(cinema);
      setFormData({
        name: cinema.name,
        total_rooms: cinema.total_rooms,
        location: {
          address: cinema.location.address,
          coordinates: {
            lat: cinema.location.coordinates.lat,
            lng: cinema.location.coordinates.lng,
          },
        },
      });
    } else {
      setEditingCinema(null);
      setFormData({
        name: '',
        total_rooms: '',
        location: {
          address: '',
          coordinates: {
            lat: '',
            lng: '',
          },
        },
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCinema(null);
    setFormData({
      name: '',
      total_rooms: '',
      location: {
        address: '',
        coordinates: {
          lat: '',
          lng: '',
        },
      },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else if (name.includes('coordinates.')) {
      const [, field] = name.split('coordinates.');
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          coordinates: {
            ...formData.location.coordinates,
            [field]: value,
          },
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingCinema) {
      await dispatch(updateCinema({ id: editingCinema._id, cinemaData: formData }));
    } else {
      await dispatch(addCinema(formData));
    }
    handleClose();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this cinema?')) {
      await dispatch(deleteCinema(id));
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Cinema Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Cinema
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
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Total Rooms</TableCell>
              <TableCell>Coordinates</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cinemas.map((cinema) => (
              <TableRow key={cinema._id}>
                <TableCell>{cinema.name}</TableCell>
                <TableCell>{cinema.location.address}</TableCell>
                <TableCell>{cinema.total_rooms}</TableCell>
                <TableCell>
                  {cinema.location.coordinates.lat}, {cinema.location.coordinates.lng}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(cinema)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(cinema._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCinema ? 'Edit Cinema' : 'Add New Cinema'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Total Rooms"
              name="total_rooms"
              type="number"
              value={formData.total_rooms}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Address"
              name="location.address"
              value={formData.location.address}
              onChange={handleChange}
              margin="normal"
              required
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Latitude"
                  name="coordinates.lat"
                  type="number"
                  value={formData.location.coordinates.lat}
                  onChange={handleChange}
                  margin="normal"
                  required
                  inputProps={{ step: "any" }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Longitude"
                  name="coordinates.lng"
                  type="number"
                  value={formData.location.coordinates.lng}
                  onChange={handleChange}
                  margin="normal"
                  required
                  inputProps={{ step: "any" }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingCinema ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CinemaManagement;

