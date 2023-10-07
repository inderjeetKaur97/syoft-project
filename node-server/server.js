const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const port = process.env.PORT || 3000;
const app = express();
const http = require("http");
const server = http.createServer(app);
const socketio = require("socket.io");
const messageFormat = require("../client/utils/messages");

const fs = require("fs");

const {
  userJoin,
  getCurrentUser,
  getRoomName,
  userLeave,
  users,
} = require("../client/utils/users");
const botName = "IG bot";
const io = socketio(server);

io.on("connection", (socket) => {

  socket.on("joinChat", ({ username, roomname, }) => {
    var user = userJoin(socket.id, username, roomname,);
    socket.join(user.roomname);

    //send userInfo based on the room to client
    io.to(user.roomname).emit("userJoined", {
      roomname: user.roomname,
      users: getRoomName(roomname),
    });

    //Welcome current user
    socket.emit(
      "message",
      messageFormat(botName, `Welcome to IG-ChatForm ${username}`)
    );

    //Broadcast when a new user joins
    socket.broadcast
      .to(user.roomname)
      .emit(
        "message",
        messageFormat(botName, `${username} has joined the chat`)
      );
  });

  //listens to message from client
  socket.on("chatMsgSend", (msg) => {
    var user = getCurrentUser(socket.id);
    // saveMsg(user, msg); //save message

    socket.emit(
      "message",
      messageFormat(user.username, msg, "right",)
    );
  });
  socket.on("chatMsgReceive", (msg) => {
    var user = getCurrentUser(socket.id);
    socket.broadcast
      .to(user.roomname)
      .emit("message", messageFormat(user.username, msg, "left",));
  });

  //Broadcast when a user disconnects
  socket.on("disconnect", () => {
    var user = userLeave(socket.id);
    if (user) {
      io.to(user.roomname).emit(
        "message",
        messageFormat(botName, `${user.username} has left the chat`)
      );
      io.to(user.roomname).emit("userJoined", {
        roomname: user.roomname,
        users: getRoomName(user.roomname),
      });
    }
  });
});

//setting up directories

//public folder for static files eg.css , js
const publicPath = path.join(__dirname, "../client/public");
app.use(express.static(publicPath));

// specifying views folder in client folder
app.set("views", path.join(__dirname, "../client/views"));

//set view engine as express handlebars
app.set("view engine", "hbs");
app.engine(
  "hbs",
  exphbs({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "../client/views/layouts"),
    partialsDir: path.join(__dirname, "../client/views/partials"),
  })
);

//calling routes from routes folder in node-server
app.use("/", require(path.join(__dirname, "routes/routes.js")));
app.use("/chat", require(path.join(__dirname, "routes/routes.js")));

server.listen(port, () => {
  console.log(`server is listening at port ${port}`);
});
