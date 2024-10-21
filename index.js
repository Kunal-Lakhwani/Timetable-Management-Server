const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const authenticateJWT = require('./Middleware/authMiddleware'); // Import middleware
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Hello my name rutvik

// Importing Routes
const authRoutes = require('./routes/userRoutes');
const professorRoutes = require('./routes/professorRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const groupRoutes = require('./routes/groupRoutes');
const labRoutes = require('./routes/labRoutes');
const labScheduleRoutes = require('./routes/labScheduleRoutes');

// Routes
app.use('/api', authRoutes); // Public routes (like login and register)

// Protect the routes using the middleware
app.use('/api/professors', professorRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/timetables', timetableRoutes);
app.use('/api/department', departmentRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/lab', labRoutes);
app.use('/api/labsch', labScheduleRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB', err);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});