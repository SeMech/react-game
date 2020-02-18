const DataGame = require('./models/DataGame');
const Player = require('./models/Player');

module.exports = function (app, io, mongoose) {
    const Room = mongoose.model('Room', {
        name: String,
        quantityPlayer: Number,
        connectPlayer: Array,
        dataGame: Object,
        idPlayerRenderBall: String,
    });
    const ModelPlayer = mongoose.model('Player', {id: String, roomId: String});

    let rerenderInterval = null;

    const renderCanvas = (idRoom) => {
        Room.findOne({_id: idRoom}, (err, room) => {
            let ball = room.dataGame.ball;
            let canvas = room.dataGame.canvas;
            const player1 = room.dataGame.player1;
            const player2 = room.dataGame.player2;
            if (!(player1 && player2)) return false;
            if (ball.x + ball.dx < ball.radius) {
                // game over for left player
                room.dataGame.score.player1 += 1;
                room.dataGame.ball = {
                    radius: 10,
                    x: 800 / 2,
                    y: 800 / 2,
                    dx: 5,
                    dy: -4,
                }
            }
            if ((ball.x + ball.dx) > (canvas.width - ball.radius)) {
                // game over for right player
                room.dataGame.score.player2 += 1;
                room.dataGame.ball = {
                    radius: 10,
                    x: 800 / 2,
                    y: 800 / 2,
                    dx: -5,
                    dy: 4,
                }
            }

            if (ball.x + ball.dx > canvas.width - player2.sizes.width - ball.radius) {
                if (
                    ball.y > player2.positions.y &&
                    ball.y < player2.positions.y + player2.sizes.height
                ) {
                    room.dataGame.ball.dx = -ball.dx;
                    room.dataGame.ball.dx *= 1.1;
                    room.dataGame.ball.dy *= 1.1;
                }
            }

            if (ball.x + ball.dx < ball.radius + player1.sizes.width) {
                if (
                    ball.y > player1.positions.y &&
                    ball.y < player1.positions.y + player1.sizes.height
                ) {
                    room.dataGame.ball.dx = -ball.dx;
                    room.dataGame.ball.dx *= 1.1;
                    room.dataGame.ball.dy *= 1.1;
                }
            }

            if (
                (ball.y + ball.dy) > (canvas.height - ball.radius) ||
                (ball.y + ball.dy) < ball.radius
            ) room.dataGame.ball.dy = -ball.dy;

            room.dataGame.ball.x = room.dataGame.ball.x + room.dataGame.ball.dx;
            room.dataGame.ball.y = room.dataGame.ball.y + room.dataGame.ball.dy;
            room.markModified('dataGame');
            room.save();
            room.connectPlayer.map((playerId) => io.to(playerId).emit('rerenderCanvas', room));
        });
    };

    const rerenderCanvas = (idRoom) => {
        rerenderInterval = setInterval(() => renderCanvas(idRoom), (1000 / 30))
    };

    io.on('connection', (socket) => {
        console.log('connect: ' + socket.id);
        io.to(socket.id).emit('sendIdPlayer', socket.id);
        const player = new ModelPlayer({id: socket.id});
        player.save();

        socket.on('connectRoom', (opts) => {
            Room.findOne({_id: opts.idRoom}, async (err, room) => {
                if (room.connectPlayer.length === 0) {
                    room.idPlayerRenderBall = opts.idPlayer;
                    room.dataGame.player1 = new Player(opts.idPlayer);
                }
                if (room.connectPlayer.length === 1) {
                    if (!room.dataGame.player1)
                        room.dataGame.player1 = new Player(opts.idPlayer);
                    if (!room.dataGame.player2)
                        room.dataGame.player2 = new Player(opts.idPlayer, room.dataGame.canvas.width - 30);
                }
                room.connectPlayer.push(opts.idPlayer);
                room.markModified('dataGame');
                try {
                    await room.save();
                } catch (e) {
                    console.log(e);
                }
                io.emit('updateRooms');
                room.connectPlayer.map((playerId) => io.to(playerId).emit('startGame', room));
                if (room.connectPlayer.length === 2) {
                    rerenderCanvas(room._id);
                }
            })
        });

        socket.on('movingPlayer', (y) => {
            Room.findOne({connectPlayer: {'$in': [socket.id]}}, async (err, room) => {
                if (room.dataGame.player1.id === socket.id) {
                    room.dataGame.player1.positions.y = y;
                }
                if (room.dataGame.player2.id === socket.id) {
                    room.dataGame.player2.positions.y = y;
                }
                room.markModified('dataGame');
                room.save();
            })
        });

        socket.on('disconnect', () => {
            ModelPlayer.deleteOne({id: socket.id}, function(err) {});
            Room.findOne({connectPlayer: {'$in': [socket.id]}}, async (err, room) => {
                console.log(room);
                if(room) {
                    const indexPlayer = room.connectPlayer.indexOf(socket.id);
                    if (room.dataGame.player1 && room.dataGame.player1.id === socket.id) {
                        room.dataGame.player1 = null;
                    }
                    if (room.dataGame.player2 && room.dataGame.player2 === socket.id) {
                        room.dataGame.player2 = null;
                    }
                    room.markModified('dataGame');
                    room.connectPlayer.splice(Number(indexPlayer), 1);
                    await room.save();
                    io.emit('updateRooms');
                    room.connectPlayer.map((playerId) => io.to(playerId).emit('stopGame', room));
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
