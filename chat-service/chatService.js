const express = require('express');
const redis = require('redis');
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({
    origin:'http://127.0.0.1:5500',
    allowedHeaders: ['Content-Type'],
}))

const redisClient = redis.createClient();
(async()=>{
    await redisClient.connect();
})();

app.post('/messages', async (req, res) => {
    const { channelId, message } = req.body;
    await redisClient.lPush(`channel:${channelId}`, JSON.stringify(message));
    res.status(201).send(message);
});

app.get('/messages/:channelId', async (req, res) => {
    const messages = await redisClient.lRange(`channel:${req.params.channelId}`, 0, -1);
    res.status(200).send(messages.map(msg => JSON.parse(msg)));
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Chat Service running on port ${PORT}`);
});
