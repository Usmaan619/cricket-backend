const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");

const PORT = process.env.PORT || 7000;

// HTTP Server
const server = http.createServer(app);

// WebSocket Setup
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    socket.on("skill", (data) => {
        socket.emit("skill", { back: "Testing websocket" });
    });
    socket.emit("skill", { back: "Testing websocket" });
});

// Start Server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
