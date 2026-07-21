const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs-extra');
const database = require('./db/database');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
const versionsDir = path.join(__dirname, 'versions');
const exportsDir = path.join(__dirname, 'exports');

fs.ensureDirSync(uploadsDir);
fs.ensureDirSync(versionsDir);
fs.ensureDirSync(exportsDir);

// Import routes
const apiRoutes = require('./routes');

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'HumanForge AI API',
    version: '1.0.0',
    status: 'running'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', apiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// Start server
database.init().then(() => {
  app.listen(PORT, () => {
    console.log(`HumanForge AI Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
});

module.exports = app;
