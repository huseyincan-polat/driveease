const swaggerUi = require('swagger-ui-express');

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'DriveEase API',
    version: '1.0.0',
    description: 'Car Rental Management System API Documentation'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local Server'
    }
  ],
  paths: {
    '/api/cars': {
      get: {
        summary: 'List all cars',
        responses: {
          200: {
            description: 'A list of cars'
          }
        }
      },
      post: {
        summary: 'Add a new car',
        responses: {
          201: {
            description: 'Car created'
          }
        }
      }
    }
  }
};

module.exports = {
  swaggerUi,
  swaggerDocs: swaggerDocument
};