const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db.js');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const swaggerUiDist = require('swagger-ui-dist');
const cors = require('cors');

const authRoute = require('./routes/auth.route.js');
const hotelRoute = require('./routes/hotel.route.js');
const sessionRoute = require('./routes/session.route.js');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const cors = require('cors');

dotenv.config({path: './config/config.env'});

connectDB();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();

app.use(express.json({limit: "5mb"}));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/hotels", hotelRoute);
app.use("/api/v1/sessions", sessionRoute);

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Hotel Booking API',
      version: '1.0.0',
      description: 'API documentation for the Hotel Booking application',
      contact: {
        name: 'API Support',
        email: 'support@hotelbooking.com'
      }
    },
    servers: [
      {
        url: process.env.VERCEL_URL ? `https://be-se.vercel.app/api/v1` : `http://localhost:${PORT}/api/v1`,
        description: process.env.VERCEL_URL ? 'Production server' : 'Development server'
      }
    ]
  },
  apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

if (process.env.NODE_ENV !== 'test') {
  // start the server only in non-test environment
  const server = app.listen(process.env.PORT || 5000, () => {
    console.log('Server running on port', process.env.PORT || 5000);
  });
}

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  if (process.env.NODE_ENV !== 'test') {
    server.close(() => process.exit(1));
  }
});

module.exports = app;  // Export the app for testing
