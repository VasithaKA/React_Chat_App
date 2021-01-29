const SocketsController = require('../controllers/sockets.io');

module.exports = socket => {
    const clientId = socket.handshake.query.clientId
    let contacts = []
    socket.join(clientId)

    socket.on('send-message', req => SocketsController.sendMessage({ ...req, socket, clientId }))

    socket.on('create-conversation', req => SocketsController.createNewConversation({ ...req, socket }))

    socket.on('check-others-online', ({ contactsDetails }) => {
        contacts = contactsDetails
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
        if (contacts.length > 0) {
            contacts.forEach(contact => {
                socket.broadcast.to(contact.id).emit('receive-user-offline', { userId: clientId, isGoToOffline: true })
            })
        }
    });
}