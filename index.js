require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { closeConnection } = require('./mikrotik.js');
const userRoutes = require('./router.js');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', userRoutes);

// Error handling middleware
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
})
app.use((error, req, res, next) => {
  console.error('❌ Error:', error.message);
  res.status(500).json({ error: 'Internal Server Error' });
})

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('👋 Server shutting down...');
  closeConnection();
  process.exit();
});

process.on('SIGTERM', () => {
  console.log('👋 Server shutting down...');
  closeConnection();
  process.exit();
});

// Start the server
app.listen(PORT, async () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
