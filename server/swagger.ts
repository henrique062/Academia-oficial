import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Aplicação Fullstack',
      version: '1.0.0',
      description: 'Documentação da API para a aplicação fullstack',
      contact: {
        name: 'Equipe de Desenvolvimento',
        email: 'dev@exemplo.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor de Desenvolvimento',
      },
      {
        url: 'https://api.exemplo.com',
        description: 'Servidor de Produção',
      },
    ],
    components: {
      securitySchemes: {
        sessionAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'connect.sid',
        },
      },
    },
    security: [
      {
        sessionAuth: [],
      },
    ],
  },
  apis: ['./server/*.ts', './server/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Express) {
  // Rota para a documentação da API
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

  // Endpoint para o JSON do Swagger
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('Documentação da API disponível em /api-docs');
} 