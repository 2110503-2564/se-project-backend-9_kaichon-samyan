const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db.js');
const cloudinary = require('cloudinary').v2;
const path = require('path');

const authRoute = require('./routes/auth.route.js');
const hotelRoute = require('./routes/hotel.route.js');
const sessionRoute = require('./routes/session.route.js');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const cors = require('cors')

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

const PORT=process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('Server running in ', process.env.NODE_ENV, ' mode on port ', {PORT});
});

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
        url: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api/v1` : `http://localhost:${PORT}/api/v1`,
        description: process.env.VERCEL_URL ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'User full name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            tel: {
              type: 'string',
              description: 'User phone number in format XXX-XXX-XXXX'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'User role'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'User password (min 6 characters)'
            }
          }
        },
        Hotel: {
          type: 'object',
          properties: {
            hotelName: {
              type: 'string',
              description: 'Name of the hotel'
            },
            address: {
              type: 'string',
              description: 'Hotel physical address'
            },
            website: {
              type: 'string',
              format: 'uri',
              description: 'Hotel website URL'
            },
            description: {
              type: 'string',
              description: 'Hotel description'
            },
            tel: {
              type: 'string',
              description: 'Hotel contact number'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Auth',
        description: 'Authentication endpoints'
      },
      {
        name: 'Hotels',
        description: 'Hotel management endpoints'
      }
    ],
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Serve Swagger UI from a specific path
app.use('/api-docs', swaggerUI.serve);
app.get('/api-docs', swaggerUI.setup(swaggerDocs, {
  explorer: true,
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css'
}));

// Add basic route for API root
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Hotel Booking API',
    documentation: '/api-docs'
  });
});

process.on('unhandledRejection', (err, Promise) => {
  console.log(`Error: ${err.message}`);
  
  server.close(() => process.exit(1));
})