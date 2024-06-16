const express = require('express');
const axios = require('axios');
const cors = require('cors')
const app = express();
app.use(express.json());
app.use(cors({
    origin:'http://127.0.0.1:5500',
    allowedHeaders: ['Content-Type'],
}))

const userServiceUrl = 'http://localhost:3001';
const chatServiceUrl = 'http://localhost:3002';
const notificationServiceUrl = 'http://localhost:3003';

app.post('/users', async (req, res) => {
    const response = await axios.post(`${userServiceUrl}/users`, req.body);
    res.status(response.status).send(response.data);
});

app.get('/users/:id', async (req, res) => {
    const response = await axios.get(`${userServiceUrl}/users/${req.params.id}`);
    res.status(response.status).send(response.data);
});

app.post('/messages', async (req, res) => {
    const response = await axios.post(`${chatServiceUrl}/messages`, req.body);
    res.status(response.status).send(response.data);
});

app.get('/messages/:channelId', async (req, res) => {
    const response = await axios.get(`${chatServiceUrl}/messages/${req.params.channelId}`);
    res.status(response.status).send(response.data);
});

app.post('/notify', async (req, res) => {
    const response = await axios.post(`${notificationServiceUrl}/notify`, req.body);
    res.status(response.status).send(response.data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
