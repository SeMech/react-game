const express = require('express');
const app = express();
// const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    origins: '*:*',
    path: '/server',
    serveClient: false,
});
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/game', {useNewUrlParser: true});

app.use(cors());
app.use(express.json());

require('./routes')(app, io, mongoose);

http.listen(3000);
