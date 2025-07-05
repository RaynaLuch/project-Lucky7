
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Recipe App API',
      version: '1.0.0',
      description: 'API documentation for the Recipe App',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
      },
      {
        url: 'https://project-lucky7.onrender.com/api-docs',
      },
    ],
  },
  apis: ['./routers/*.js', './controllers/*.js', './validation/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
