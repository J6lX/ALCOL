// import http from "http";
// import SocketIO from "socket.io";
// import express from "express";

const app = require('express')();
const cors = require('cors')

// app.set("view engine", "js");
// app.set("views", __dirname + "/components/battle/ContinuousBattlePage.js");
// app.use("/public", express.static(__dirname + "/public"));
// app.get("/", (_, res) => res.render("home"));
// app.get("/*", (_, res) => res.redirect("/"));

const httpServer = require('http').createServer(app);
const wsServer = require('socket.io')(httpServer, {
  cors : {
    origin: "*",
    credentials: true
  }
});
const port = process.env.PORT || 5000;

wsServer.on("connection", (socket) => {
  socket.on("join_room", (roomName, done) => {
    socket.join(roomName);
    socket.to(roomName).emit("welcome");
    done();
  });
  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer);
  });
  socket.on("answer", (answer, roomName) => {
    socket.to(roomName).emit("answer", answer);
  });
  socket.on("ice", (ice, roomName) => {
    socket.to(roomName).emit("ice", ice);
  });
});

const handleListen = () => console.log(`Listening on http://localhost:5000`);
httpServer.listen(5000, handleListen);