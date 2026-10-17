import "reflect-metadata";
import cookieParser from "cookie-parser";
import compression from "compression";
import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import publicDirectoryPath from "express-ejs-layouts";
import router from "./src/router";
import { errorMiddleware } from "./src/middlewares";
// import ejs from "ejs";
import path from "path";
import * as dotenv from "dotenv";
import { swaggerDocs } from "./src/swagger";
dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(publicDirectoryPath);
app.set("layout", "layouts/layout");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(
  cors({
    credentials: true,
  }),
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

const server = http.createServer(app);

server.listen(process.env.PORT, () => {
  console.log(`now app listen in port ${process.env.PORT}`);
});

app.use("/api", router());
swaggerDocs(app, process.env.PORT);

app.use((req, res, next) => {
  res.status(404).json({
    status: 404,
    message: "API Not Found",
  });
});

app.use(errorMiddleware);
// mongoose.set("strictQuery", false);
