import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  Movie as MovieIcon,
  AccessTime as AccessTimeIcon,
  MeetingRoom as RoomIcon,
  EventSeat as SeatIcon,
} from '@mui/icons-material';
import { fetchCinemas } from '../store/slices/cinemaSlice';
import { fetchShowtimes } from '../store/slices/showtimeSlice';
import { fetchRooms } from '../store/slices/roomSlice';
import { fetchSeats } from '../store/slices/seatSlice';

function Dashboard() {
  const dispatch = useDispatch();
  const { cinemas, loading: cinemasLoading } = useSelector((state) => state.cinema);
  const { showtimes, loading: showtimesLoading } = useSelector((state) => state.showtime);
  const { rooms, loading: roomsLoading } = useSelector((state) => state.room);
  const { seats, loading: seatsLoading } = useSelector((state) => state.seat);

  useEffect(() => {
    dispatch(fetchCinemas());
    dispatch(fetchShowtimes());
    dispatch(fetchRooms());
    if (rooms.length > 0) {
      dispatch(fetchSeats(rooms[0].id));
    }
  }, [dispatch, rooms.length]);

  const StatCard = ({ title, value, icon, loading }) => (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        height: 140,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {icon}
        <Typography variant="h6" component="div" sx={{ ml: 1 }}>
          {title}
        </Typography>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <Typography variant="h4" component="div">
          {value}
        </Typography>
      )}
    </Paper>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Cinemas"
            value={cinemas.length}
            icon={<MovieIcon color="primary" />}
            loading={cinemasLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Showtimes"
            value={showtimes.length}
            icon={<AccessTimeIcon color="primary" />}
            loading={showtimesLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Rooms"
            value={rooms.length}
            icon={<RoomIcon color="primary" />}
            loading={roomsLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Seats"
            value={seats.length}
            icon={<SeatIcon color="primary" />}
            loading={seatsLoading}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 