import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Pollex API",
      version: "1.0.0",
      description: "API documentation for Pollex task management system",
      contact: {
        name: "Pollex Support",
        url: "https://example.com",
      },
    },
    servers: [
      {
        url: "https://localhost:8443",
        description: "Development server",
      },
      /*
      {
        url: 'https://api.example.com',
        description: 'Production server',
      }, 
      */
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "https",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/*.js", "./controllers/*.js"],
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUiExpress };
