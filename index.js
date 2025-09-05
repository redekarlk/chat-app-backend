// import express from "express";
// import connectDB from "./config/dB.js";
// import "dotenv/config";
// import cors from "cors"
// import cookieParser from "cookie-parser";

// import { Server } from "socket.io";
// import http from "http";



// import multer from "multer";
// import path from "path";


// // router 

// // import testRouter from "./routes/test-route.js";
// import userRouter from "./routes/user-route.js";

// // conversation router
// import convoRouter from "./routes/conversation-route.js";

// // message router 
// import msgRouter from "./routes/message-route.js";


// const app = express();


// const server = http.createServer(app);


// // port number 
// const port = 8001;

// // database connection calling
// connectDB();


// // json
// app.use(express.json());

// // cors
// // app.use(cors());
// app.use(cors({
//     origin: "http://localhost:3000", // frontend origin
//     credentials: true,               // allow cookies/auth headers
// }));
// app.use(cookieParser());

// const io = new Server(server, {
//   cors: {
//     origin: "*", // change to frontend URL later
//   },
// });


// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   // join room for conversation
//   socket.on("joinConversation", (conversationId) => {
//     socket.join(conversationId);
//     console.log(`User joined conversation: ${conversationId}`);
//   });

//   // send message
//   socket.on("sendMessage", (data) => {
//     const { conversationId, message } = data;

//     // emit message to users in that conversation
//     io.to(conversationId).emit("receiveMessage", message);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });




// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads/"); // save in uploads folder
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname)); // unique name
//     }
// });

// const upload = multer({ storage: storage });


// app.post("/upload", upload.single("image"), (req, res) => {
//     res.json({
//         message: "Image uploaded successfully",
//         // filePath: `http://localhost:5000/uploads/${req.file.filename}`
//         filePath: `http://localhost:${port}/uploads/${req.file.filename}`
//     });
// });


// app.use("/uploads", express.static("uploads"));





// // app.use("/test", testRouter);
// app.use("/api/user-auth", userRouter);
// app.use("/api/conversations", convoRouter);
// app.use("/api/messages", msgRouter);


// app.listen(port, () => {
//     console.log(`listening on port ${port}`)
// })




import express from "express";
import connectDB from "./config/dB.js";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "path";
import http from "http";
import { Server } from "socket.io";

// Routers
import userRouter from "./routes/user-route.js";
import convoRouter from "./routes/conversation-route.js";
import msgRouter from "./routes/message-route.js";
import messageModel from "./models/message-model.js";
import convoModel from "./models/conversation-model.js";

const app = express();
const server = http.createServer(app);

// Port number
const port = process.env.PORT || 8001;

// Database connection
connectDB();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // frontend origin
    credentials: true, // allow cookies/auth headers
  })
);
app.use(cookieParser());

// ================= SOCKET.IO =================
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // frontend
    methods: ["GET", "POST"],
  },
});

// io.on("connection", (socket) => {
//   console.log("🔌 User connected:", socket.id);

//   // Join a conversation (room)
//   socket.on("joinConversation", (conversationId) => {
//     socket.join(conversationId);
//     console.log(`✅ User joined conversation: ${conversationId}`);
//   });

//   // Send + broadcast message
//   socket.on("sendMessage", (data) => {
//     const { conversationId, message } = data;
//     console.log("📨 Message sent:", data);

//     // Send message to everyone in the room
//     io.to(conversationId).emit("receiveMessage", message);
//   });

//   socket.on("disconnect", () => {
//     console.log("❌ User disconnected:", socket.id);
//   });
// });





io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`✅ User joined conversation: ${conversationId}`);
  });

  socket.on("markSeen", async ({ conversationId, userId }) => {
  await Message.updateMany(
    { conversation: conversationId, seen: false },
    { $set: { seen: true } }
  );
});


  socket.on("sendMessage", async (data) => {
    const { conversationId, sender, text } = data;
    console.log("📨 Message sent:", data);

    try {
      // 1. Save message to DB
      const message = await messageModel.create({
        conversation: conversationId,
        sender,
        text,
      });

      // 2. Update lastMessage in conversation
      await convoModel.findByIdAndUpdate(conversationId, {
        lastMessage: message._id,
        updatedAt: new Date(),
      });

      // 3. Populate sender for frontend
      const populatedMsg = await message.populate("sender", "name email");

      // 4. Emit to everyone in the room
      io.to(conversationId).emit("receiveMessage", populatedMsg);
    } catch (err) {
      console.error("❌ Error saving message:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});






















// ================= MULTER (Image Upload) =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // save in uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique name
  },
});
const upload = multer({ storage });

app.post("/upload", upload.single("image"), (req, res) => {
  res.json({
    message: "Image uploaded successfully",
    filePath: `http://localhost:${port}/uploads/${req.file.filename}`,
  });
});

app.use("/uploads", express.static("uploads"));

// ================= ROUTES =================
app.use("/api/user-auth", userRouter);
app.use("/api/conversations", convoRouter);
app.use("/api/messages", msgRouter);

// ================= START SERVER =================
server.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
















