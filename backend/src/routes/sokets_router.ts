import socketIo from 'socket.io';
import colors from 'colors';

import Player, {createUser, removeUser} from "../models/Player";
import {findOneRoom, InterfaceRoomModel} from "../models/Room";
import {OptionsConnectRoom} from "../interfaces/OptionsConnectRoom";

const io = socketIo();

io.on('connection', (socket) => {
    console.log(colors.gray(`connect: ${socket.id}`));
    io.to(socket.id).emit('sendIdPlayer', socket.id);
    createUser(socket.id).then();

    socket.on('connectToRoom', (opts) => handleConnectToRoom(opts, socket.id));

    socket.on('disconnect', () => handleDisconnect(socket.id));

    socket.on('movingPlayer', (positionY) => handleMovePlayer(positionY, socket.id));
});

const ioEmit = (name: string, body?: object | string | number) => io.emit(name, body);
const ioEmitTo = (
    path: string,
    name: string,
    body?: object | string | number
) => io.to(path).emit(name, body);

const handleConnectToRoom = (opts: OptionsConnectRoom, socketId: string) => {
    console.log(colors.gray(
        `-socket-user: ${socketId}, joined the room: ${opts.idRoom}`
    ));
    findOneRoom({_id: opts.idRoom}, async (err: any, room: InterfaceRoomModel) => {
        if (room.connectPlayer.length === 2) {
            console.log('2 player');
            ioEmit('allPlayerConnected');
            return false;
        }

        if (room.connectPlayer.length === 0) {
            room.roomData.player1 = new Player(socketId);
        }

        if (room.connectPlayer.length === 1) {
            if (room.roomData.player1) {
                room.roomData.player2 = new Player(socketId);
            }
            if (room.roomData.player2) {
                room.roomData.player1 = new Player(socketId);
            }
        }

        room.connectPlayer.push(socketId);
        room.markModified('roomData');

        try {
            await room.save();
        } catch (e) {
            console.log(e)
        }

        ioEmit('updateRooms');
        room.connectPlayer.map((idPlayer) => ioEmitTo(idPlayer, 'startGame', room));
    })
};

const handleMovePlayer = (positionY: number, socketId: string) => {
    findOneRoom(
        {connectPlayer: {'$in': [socketId]}},
        async (err: any, room: InterfaceRoomModel) => {
            if (room.roomData.player1.id === socketId) {
                room.roomData.player1.positions.y = positionY;
            }

            if (room.roomData.player2.id === socketId) {
                room.roomData.player2.positions.y = positionY;
            }

            room.markModified('roomData');
            await room.save();
        }
    )
};

const handleDisconnect = (socketId: string): void => {
    removeUser(socketId);
    findOneRoom(
        {connectPlayer: {'$in': [socketId]}},
        async (err: any, room: InterfaceRoomModel) => {
            const indexPlayer = room.connectPlayer.indexOf(socketId);
            room.connectPlayer.splice(Number(indexPlayer), 1);

            if (room.roomData.player1 && room.roomData.player1.id === socketId) {
                room.roomData.player1 = null;
            }

            if (room.roomData.player2 && room.roomData.player2 === socketId) {
                room.roomData.player2 = null;
            }

            room.markModified('roomData');
            await room.save();

            ioEmit('updateRooms');
            room.connectPlayer.map((idPlayer) => ioEmitTo(idPlayer, 'startGame', room));
        }
    );
};

export { ioEmit, ioEmitTo };
export default io;
