﻿# microservicesNodeApp implementing Redis pub/sub, web sockets(socket.io) and microservices architecture through API Gateway.

Detailed Explanation of the Flow:
Client Sends Message:

The client sends a POST request to the Chat Service (http://localhost:3002/messages) with the message data.
Example request body: { channelId: 'general', message: 'Hello, World!' }
Chat Service Processes Request:

The Chat Service receives the request and extracts the message data.
It then stores the message in an array (in a real-world application, this would be stored in a database).
The Chat Service publishes the message to the Redis channel named messages using the redisClient.publish method.
Redis Pub/Sub:

Redis acts as a message broker. The message is published to the messages channel.
Any service subscribed to the messages channel will receive this message.
Notification Service Receives and Emits Message:

The Notification Service (integrated into the main server) has a Redis subscriber listening to the messages channel.
When a message is published to this channel, the Notification Service receives it.
The Notification Service then uses Socket.IO to emit the received message to all connected WebSocket clients.
Client Receives Real-Time Notification:

Clients connected to the WebSocket receive the emitted message and can display it in the user interface in real-time.
This setup ensures that messages sent by any client are immediately broadcast to all connected clients, providing real-time chat functionality using Redis pub/sub and WebSocket.
