const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const http = require("http");
const {Server} = require("socket.io");
const connectDB = require("./config/db.js");


const doctorRoute = require("./routes/doctorRoutes");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute.js");
const appointmentRoute = require("./routes/appointmentRoute.js");
const notificationRoute = require("./routes/notificationRoute.js");
const chatRoute = require("./routes/chatRoute.js");
const Appointment = require("./models/Appointment.js");
const aiRoutes = require("./routes/aiRoutes.js");
const Chat = require("./models/Chat.js");
const startChatTimer = require("./utils/setTimer.js");

const app  = express();
const server = http.createServer(app);
connectDB();
// Middlewares  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174",
       "https://surinder.vercel.app","https://doc-connect-pz1doe7v2-surinders-projects-ccf2e427.vercel.app"
    ],
    credentials: true,
  })
);

app.use("/api/doctor",doctorRoute);
app.use("/api/auth",authRoute);
app.use("/api/users",userRoute);
app.use("/api/appointment",appointmentRoute);
app.use("/api/notifications",notificationRoute);
app.use("/api/chat",chatRoute);
app.use("/api/ai", aiRoutes);

app.use((req,res,next)=>{
  // console.log("Incoming request:", req.method, req.path);
  next();
})

const io = new Server(server,{
  cors:{
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  }
})

//socket auth  middleware 
io.use((socket,next)=>{
  try{
    // const token = socket.handshake.auth?.token;
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    const token = cookies.token;
    if(!token) return next(new Error("Unauthorized"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; // { id, role }
    next();
  }catch(err){
    console.error("Socket Auth Failed:",err.message);
    next(new Error("Unauthorized"));
  }
})
app.set("io",io);
startChatTimer(io);

io.on("connection", (socket) => {
  // console.log("User connected:", socket.id, socket.user);

  // Join appointment room
  socket.on("join-room", async ({ appointmentId }) => {
    try {
      if (!appointmentId) return;

      const appt = await Appointment.findById(appointmentId);
      if (!appt) return;

      // Only appointment participants allowed
      const userId = socket.user.id;
      const isAllowed =
        appt.user.toString() === userId ||
        appt.doctor.toString() === userId;

      if (!isAllowed) return;

      socket.join(appointmentId);
      // console.log(`User ${userId} joined room ${appointmentId}`);
    } catch (err) {
      console.error("join-room error:", err.message);
    }
  });

  // // Send message
  // socket.on("send-message", async ({ appointmentId, message }) => {
  //   try {
  //     if (!appointmentId || !message?.trim()) return;

  //     const userId = socket.user.id;
  //     const role = socket.user.role; // "user" | "doctor"

  //     const appt = await Appointment.findById(appointmentId);
  //     if (!appt) return;

  //     const isAllowed =
  //       appt.user.toString() === userId ||
  //       appt.doctor.toString() === userId;

  //     if (!isAllowed) return;

  //     const receiver =
  //       role === "user" ? appt.doctor : appt.user;

  //     const chat = await Chat.create({
  //       appointment: appointmentId,
  //       sender: userId,
  //       senderModel: role === "user" ? "User" : "Doctor",
  //       receiver,
  //       message: message.trim(),
  //       type: "text",
  //     });

  //     io.to(appointmentId).emit("receive-message", {
  //       _id: chat._id,
  //       appointment: appointmentId,
  //       sender: userId,
  //       senderModel: chat.senderModel,
  //       receiver,
  //       message: chat.message,
  //       createdAt: chat.createdAt,
  //     });
  //   } catch (err) {
  //     console.error("send-message error:", err.message);
  //   }
  // });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ------------------ Start Server ------------------
const PORT = process.env.PORT || 4000;
server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);