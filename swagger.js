const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require("swagger-ui-express");


const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Assignly - Portfolio Builder',
            version: '1.0.0',
            description: 'API Assignly user Swagger documentation. \nThis is an api server for a portfolio builer website',
        },
        components: {
            securitySchemes: {
              bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
              },
            },
          },
          security: [{ bearerAuth: [] }],
        servers: [
            {
                url: 'https://assignly-api.onrender.com',
                description: 'Prod server',
            },
            {
                url: 'http://localhost:3000',
                description: 'Local server',
            }
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);

module.exports = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
};
