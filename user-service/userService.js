const express = require('express');
const cors = require('cors')
const redis = require('redis');

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

app.post('/users', async (req, res) => {
    const { id, name } = req.body;
    await redisClient.hSet('users', id, JSON.stringify({ id, name }));
    res.status(201).send({ id, name });
});

app.get('/users/:id', async (req, res) => {
    const user = await redisClient.hGet('users', req.params.id);
    if (user) {
        res.status(200).send(JSON.parse(user));
    } else {
        res.status(404).send({ error: 'User not found' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
});
