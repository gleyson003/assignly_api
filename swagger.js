const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require("swagger-ui-express");


const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Assignly',
            version: '1.0.0',
            description: 'API Assignly user Swagger documentation',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local server',
            },
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);

module.exports = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
};
