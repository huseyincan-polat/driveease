const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express'); 
require('dotenv').config();

const app = express();

app.use(express.json());

// Complete Swagger JSON Definition
const swaggerDocumentJson = {
  openapi: '3.0.0',
  info: {
    title: 'DriveEase API',
    version: '1.0.0',
    description: 'Corporate Car Rental System API Documentation'
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      }
    },
    schemas: {
      Category: {
        type: 'object',
        properties: {
          id: { type: 'integer', description: 'Unique identifier for the category' },
          name: { type: 'string', description: 'Name of the category (e.g., Sedan, SUV, Hatchback)' }
        }
      },
      Car: {
        type: 'object',
        required: ['category_id', 'branch_id', 'brand', 'model', 'year', 'price_per_day', 'fuel_type', 'transmission_type', 'km', 'status'],
        properties: {
          id: { type: 'integer', description: 'Unique identifier for the car' },
          category_id: { type: 'integer', description: 'Category ID linking to the vehicle type' },
          branch_id: { type: 'integer', description: 'Branch ID where the car belongs' },
          brand: { type: 'string', description: 'Car manufacturer brand' },
          model: { type: 'string', description: 'Specific model name' },
          year: { type: 'integer', description: 'Manufacturing year' },
          price_per_day: { type: 'number', description: 'Daily rental cost in TL' },
          fuel_type: { type: 'string', description: 'Engine fuel source (Gasoline, Diesel, Electric)' },
          transmission_type: { type: 'string', description: 'Gear transmission mechanism (Automatic, Manual)' },
          km: { type: 'integer', description: 'Total odometer mileage' },
          status: { type: 'string', description: 'Current operational state (available, rented, maintenance)' }
        }
      }
    }
  },
  paths: {
    '/api/categories': {
      get: {
        summary: 'Lists all available car categories',
        tags: ['Categories'],
        responses: {
          '200': {
            description: 'Categories listed successfully',
            content: {
              'application/json': {
                schema: { 
                  type: 'array', 
                  items: { $ref: '#/components/schemas/Category' } 
                }
              }
            }
          }
        }
      }
    },
    '/api/cars': {
      get: {
        summary: 'Lists all cars with optional filters',
        tags: ['Cars'],
        parameters: [
          { in: 'query', name: 'fuel_type', schema: { type: 'string' }, description: 'Filter by fuel type' },
          { in: 'query', name: 'transmission_type', schema: { type: 'string' }, description: 'Filter by transmission type (Automatic, Manual)' },
          { in: 'query', name: 'status', schema: { type: 'string' }, description: 'Filter by availability status' },
          { in: 'query', name: 'branch_id', schema: { type: 'integer' }, description: 'Filter by branch ID' }
        ],
        responses: {
          '200': {
            description: 'Cars listed successfully',
            content: {
              'application/json': {
                schema: { 
                  type: 'array', 
                  items: { $ref: '#/components/schemas/Car' } 
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Adds a new car (Admin Only)',
        tags: ['Cars'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Car' }
            }
          }
        },
        responses: {
          '201': { description: 'Car successfully added to the database' },
          '401': { description: 'Unauthorized access (Missing or invalid token)' }
        }
      }
    },
    '/api/cars/{id}': {
      get: {
        summary: 'Get a specific car by ID',
        tags: ['Cars'],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'integer' }, description: 'The ID of the car to fetch' }
        ],
        responses: {
          '200': {
            description: 'Car details fetched successfully',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Car' } } }
          },
          '404': { description: 'Car not found' }
        }
      },
      put: {
        summary: 'Update an existing car (Admin Only)',
        tags: ['Cars'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'integer' }, description: 'The ID of the car to update' }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Car' }
            }
          }
        },
        responses: {
          '200': { description: 'Car updated successfully' },
          '404': { description: 'Car not found' }
        }
      },
      delete: {
        summary: 'Delete a car from the system (Admin Only)',
        tags: ['Cars'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'integer' }, description: 'The ID of the car to delete' }
        ],
        responses: {
          '200': { description: 'Car deleted successfully' },
          '404': { description: 'Car not found' }
        }
      }
    }
  }
};

// Bind Swagger UI Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocumentJson));

// API Routes
app.use('/api/cars', require('./backend/routes/carRoutes'));
app.use('/api/users', require('./backend/routes/userRoutes')); 
app.use('/api/rentals', require('./backend/routes/rentalRoutes'));  
app.use('/api/branches', require('./backend/routes/branchRoutes'));  
app.use('/api/categories', require('./backend/routes/categoryRoutes'));  

// Static Frontend Directory
app.use(express.static(path.join(__dirname, 'frontend')));

// Root Route serving frontend index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Swagger API Docs available at http://localhost:${PORT}/api-docs`);
    console.log(`===================================================`);
});