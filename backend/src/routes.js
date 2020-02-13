const DataGame = require('./models/DataGame');
const Player = require('./models/Player');

module.exports = function (app, io, mongoose) {
    const Room = mongoose.model('Room', {name: String, quantityPlayer: Number, connectPlayer: Array, dataGame: Object});


    io.on('connection', (socket) => {
        console.log('connect: ' + socket.id);
        io.to(socket.id).emit('sendIdPlayer', socket.id);

        socket.on('connectRoom', (opts) => {
            Room.findOne({_id: opts.idRoom}, async (err, room) => {
                if (room.connectPlayer.length === 0) {
                    room.dataGame.player1 = new Player(opts.idPlayer);
                }
                if (room.connectPlayer.length === 1) {
                    room.dataGame.player2 = new Player(opts.idPlayer);
                }
                room.connectPlayer.push(opts.idPlayer);
                room.markModified('dataGame');
                try {
                    await room.save();
                } catch (e) {
                    console.log(e);
                }
                io.emit('updateRooms');
                io.to(socket.id).emit('startGame', room);
            })
        });

        socket.on('disconnect', () => {
            Room.findOne({connectPlayer: {'$in': [socket.id]}}, async (err, room) => {
                console.log(room);
                if(room) {
                    const indexPlayer = room.connectPlayer.indexOf(socket.id);
                    room.connectPlayer.splice(Number(indexPlayer), 1);
                    await room.save();
                    io.emit('updateRooms');
                }
            })
        })
    });

    app.get('/api/rooms', (req, res) => {
        Room.find()
            .skip(+req.query.offset)
            .limit(+req.query.limit)
            .exec(async (err, rooms) => {
            if (err || rooms.length === 0) {
                res.statusCode = 404;
                res.send('Not found rooms')
            } else {
                const roomsLength = await Room.count();
                res.json({rooms: rooms, length: roomsLength});
            }
        })
    });

    app.post('/api/rooms', async (req, res) => {
        const room = new Room({name: req.body.name, quantityPlayer: 2, connectPlayer: [], dataGame: new DataGame()});
        // console.log(req.body);
        try {
            await room.save();
            io.emit('updateRooms');
            res.end();
        } catch (e) {
            console.log(e);
            res.end();
        }

    });

    return io;
};
