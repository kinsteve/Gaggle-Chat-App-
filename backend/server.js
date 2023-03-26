require('dotenv').config()
const express = require("express");
const { chats } = require("./data/data");
const colors = require("colors");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require('path');
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
app.use(cors());
app.use(express.json());    //To accept json data
app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use("/api/message", messageRoutes);
app.use(notFound);
app.use(errorHandler);

app.get("/test", (req, res) => {
   res.send("API IS RUNNING");
});

const PORT = process.env.PORT || 5000;

const start = async () => {
   try {
      await connectDB(process.env.MONGO_URI)
      const server = app.listen(PORT, () => {
         console.log(`Server started on port ${PORT}`.yellow.bold);
         console.log("MongoDB Connected".green.bold);
         const io = require('socket.io')(server, {
            pingTime: 60000,
            cors: {
               origin: " http://localhost:3000",
            },
         });

         io.on("connection", (socket) => {
            console.log("connected to socket.io");
            socket.on('setup', (userData) => {         // here we are setting up socket where our frontend will send some data to join the room
               socket.join(userData._id);
               //  console.log(userData._id)
               socket.emit('connected');
            });
            socket.on('join chat', (room) => {       // this will take the room id from the frontend
               socket.join(room);
               console.log('User joined room:' + room)
            });
            socket.on('typing', (room) => socket.in(room).emit("typing"));
            socket.on('stop typing', (room) => socket.in(room).emit("stop typing"));

            socket.on('new message', (newMessageReceived) => {
               var chat = newMessageReceived.chat;

               if (!chat.users) return console.log('chat.users not defined');

               chat.users.forEach(user => {
                  if (user._id == newMessageReceived.sender._id) return      //  chacking if this message is send by us . because the message we send should be send to all other users in the chat except us

                  socket.in(user._id).emit("message received", newMessageReceived)
               });
            });
            socket.off("setup", () => {                     //clean up to reduce bandwidth
               console.log("USER DISCONNECTED");
               socket.leave(userData._id);
            });
         });
      });
   } catch (error) {
      console.log(`Error:${error.message}`.red.bold);
   }
}
start()


