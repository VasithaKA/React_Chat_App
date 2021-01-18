const io = require('socket.io')(5000, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on('connection', socket => {
  const clientId = socket.handshake.query.clientId
  socket.join(clientId)

  socket.on('send-message', ({ content, sentDate, conversationId, conversationName, members }) => {
    members.forEach(member => {
      socket.broadcast.to(member).emit('receive-message', {
        senderId: clientId, content, sentDate, conversationId, conversationName, members, isRead: false
      })
    })
  })

  socket.on('create-conversation', ({ conversationId, conversationName, members, createDateTime }) => {
    members.forEach(member => {
      socket.broadcast.to(member).emit('receive-conversation-details', {
        conversationId, conversationName, members, createDateTime
      })
    })
  })
})
