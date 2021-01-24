const io = require('socket.io')(5000, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on('connection', socket => {
  const clientId = socket.handshake.query.clientId
  let contacts = []
  socket.join(clientId)

  socket.on('send-message', ({ content, sentDate, conversationId, conversationName, isPersonalChat, members }) => {
    members.forEach(member => {
      socket.broadcast.to(member).emit('receive-message', {
        senderId: clientId, content, sentDate, conversationId, conversationName, isPersonalChat, members, isRead: false
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

  socket.on('check-others-online', ({ contactsDetails }) => {
    contacts = contactsDetails
    console.log(contacts);
    if (contacts.length > 0) {
      contacts.forEach(contact => {
        socket.broadcast.to(contact.id).emit('new-online-user', { userId: clientId })
      })
    }
  })

  socket.on('send-user-online', ({ contactId }) => {
    if (contactId) {
      socket.broadcast.to(contactId).emit('receive-user-online', { userId: clientId })
    }
  })

  socket.on('disconnect', () => {
    console.log('disconnect');
    console.log(contacts);
    if (contacts.length > 0) {
      contacts.forEach(contact => {
        socket.broadcast.to(contact.id).emit('receive-user-offline', { userId: clientId, isGoToOffline: true })
      })
    }
  });
})
