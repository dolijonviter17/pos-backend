import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import * as dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation (Jonviter Simbolon)",
      version: "1.0.0",
      description: "Dokumentasi API Node.js (TypeScript)",
    },
    servers: [
      {
        url: `http://192.168.1.12:${process.env.PORT}/api`,
        description: "Local development server",
      },
      {
        url: "https://api.example.com",
        description: "Production server",
      },
    ],
  },
  apis: ["./src/router/*.ts"], // lokasi file routes TS
};

export const swaggerSpec = swaggerJsdoc(options);

export function swaggerDocs(app: Express, port: any) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  console.log(`📘 Swagger Docs: http://localhost:${port}/api-docs`);
}
