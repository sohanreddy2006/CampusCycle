const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const config = require('./config/config');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const listingRoutes = require('./routes/listings');
const domainRoutes = require('./routes/domains');
const tagRoutes = require('./routes/tags');
const requestRoutes = require('./routes/requests');
const reservationRoutes = require('./routes/reservations');
const notificationRoutes = require('./routes/notifications');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CampusCycle API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/domains', domainRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(errorHandler);

const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
