const { Socket } = require("socket.io");

/**
 *
 * @param {Socket} socket
 */
module.exports = (socket) => {
  console.log(`User conected with id: ${socket.id}`);

  socket.on("join_room", (data) => {
    console.log(`User joined room ${data.room}`);

    const room = data.room;

    socket.join(room);

    socket.emit("message", "Server: Hello Welcome");
  });

  socket.on("message", (data) => {
    const room = data.room;
    const message = data.message;

    socket.to(room).emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected with id: ${socket.id}`);
  });
};
