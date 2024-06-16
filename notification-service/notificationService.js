const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const redis = require('redis');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ['Content-Type', "Access-Control-Allow-Origin"]
  }
});

const subscribeClient = redis.createClient();
const publishClient = redis.createClient();

(async () => {
  await subscribeClient.connect();
  await publishClient.connect();
})();

const CHANNEL = 'notifications';

subscribeClient.subscribe(CHANNEL, (message,channel) => {
  if (channel === CHANNEL) {
    const parsedMessage = JSON.parse(message);
    io.emit('notification', parsedMessage);
    console.log("Received and emitted message: ", parsedMessage);
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.post('/notify', async (req, res) => {
  const { userId, message } = req.body;
  await publishClient.publish(CHANNEL, JSON.stringify({ userId, message }));
  res.status(201).send({ userId, message });
});

const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
});
