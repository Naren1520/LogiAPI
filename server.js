require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./src/config/db');
const { initSocket } = require('./src/sockets/socket');
const { logger } = require('./src/middleware/logger');
const swaggerDocs = require('./src/utils/swagger');

// Connect Database
connectDB();

const app = express();
const server = http.createServer(app);

// Init Socket.io
initSocket(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Swagger
swaggerDocs(app);

// Routes
app.use('/auth', require('./src/routes/authRoutes'));
app.use('/shipments', require('./src/routes/shipmentRoutes'));
app.use('/analytics', require('./src/routes/analyticsRoutes'));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
