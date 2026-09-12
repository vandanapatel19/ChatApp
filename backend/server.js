import express from "express";
import cors from "cors";
import http from "http";
import "dotenv/config.js";
import { connectDB } from "./lib/db.js";
import UserRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

//create express app and http server
const app = express();
const server = http.createServer(app);

//initialize socket.io server
export const io = new Server(server, {
  cors: { origin: "*" }
})

//Store online users
export const userSocketMap = {}; // {userId: socketId}

//Socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log(`User connected: ${userId}`);

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  //Emit online users to all connected clients
  io.emit("onlineUsers", Object.keys(userSocketMap));

  //Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected", userId);
    delete userSocketMap[userId];
    io.emit("onlineUsers", Object.keys(userSocketMap));
  })
})

//middlewares
app.use(express.json({ limit: "4mb" }));
app.use(cors());

//routes
app.get('/', (req, res) =>  res.send("Server is Live!") )
app.use('/api/status', (req, res) => res.send("server is live"));
app.use('/api/auth', UserRouter);
app.use('/api/messages', messageRouter);

//Database connection
await connectDB();

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 7000;
  server.listen(PORT, () => console.log(`server is running on port ${PORT}`));
}

export default server;