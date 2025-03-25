const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db.js');

const authRoute = require('./routes/auth.route.js');
const companyRoute = require('./routes/companies.route.js');
const sessionRoute = require('./routes/session.route.js');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const cors = require('cors')

dotenv.config({path: './config/config.env'});

connectDB();

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(cors());

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/companies", companyRoute);
app.use("/api/v1/session",sessionRoute);

const PORT=process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('Server running in ', process.env.NODE_ENV, ' mode on port ', {PORT});
});

const swaggerOptions={
  swaggerDefinition:{
    openapi: '3.0.0',
    info: {
        title: 'Library API',
        version: '1.0.0',
        description: 'API for Job Fair'
    },
    servers: [
      {
        url:  process.env.HOST + ':' + PORT + '/api/v1'
      }
    ],
  },
  apis:['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

process.on('unhandledRejection', (err, Promise) => {
  console.log(`Error: ${err.message}`);
  
  server.close(() => process.exit(1));
})