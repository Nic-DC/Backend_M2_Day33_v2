import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import productsRouter from "./api/products/index.js";
import { badRequestHandler, genericErrorHandler } from "./errorHandlers.js";
import { Server } from "socket.io";
import { createServer } from "http"; // CORE MODULE
import { newConnectionHandler } from "./socket/index.js";

const expressServer = express();
const port = process.env.PORT || 3001;

// ************************************ SOCKET.IO ********************************
const httpServer = createServer(expressServer);
const io = new Server(httpServer);
// this constructor is expecting to receive an HTTP-SERVER as parameter not an EXPRESS SERVER!!!

io.on("connection", newConnectionHandler);
// "connection" is NOT a custom event! This is a socket.io event, triggered every time a new client connects!

// ************************************* MIDDLEWARES *******************************
expressServer.use(cors());
expressServer.use(express.json());

// *************************************** ENDPOINTS *******************************
expressServer.use("/products", productsRouter);

// ************************************ ERROR HANDLERS *****************************
expressServer.use(badRequestHandler);
expressServer.use(genericErrorHandler);

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  httpServer.listen(port, () => {
    // DO NOT FORGET TO LISTEN WITH HTTPSERVER HERE, NOT EXPRESS SERVER!!
    console.table(listEndpoints(expressServer));
    console.log(`Server is running on port ${port}`);
  });
});
