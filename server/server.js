const http = require('http');
const app = require('./app');

const port = process.env.PORT || 5000;

const server = http.createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const ioFunction = require('./api/routes/sockets.io');

io.on('connection', ioFunction)

server.listen(port, () => console.log('Sever listening at ' + port));