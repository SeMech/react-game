import Axios from "axios";
import 'babel-polyfill';
import io from "socket.io-client";

const address = ADDRESS;

const uri = `http://${address}:3000/api`;

const socket = io(`http://${address}:3000`, {
    path: '/server',
    autoConnect: false,
});

export default class Api {
    static async getRooms(limit = 0, offset = 0) {
        return await Axios.get(`${uri}/rooms?limit=${limit}&offset=${offset}`);
    }

    static async createRoom(roomName) {
        return await Axios.post(`${uri}/rooms`, {
            name: roomName,
        });
    }

    static updateRooms(callback) {
        socket.on('updateRooms', callback);
    }

    static startGame(callback) {
        socket.on('startGame', (room) => callback(room));
    }

    static socketConnect(callback) {
        try {
            socket.open();
            socket.on('connect', () => {
                console.log('connection success');
                socket.on('sendIdPlayer', (response) => {
                    console.log(response);
                    callback(response);
                });
            });
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    static async connectRoom(idRoom, idPlayer) {
        console.log(idRoom, idPlayer);
        socket.emit('connectRoom', {
            idRoom: idRoom,
            idPlayer: idPlayer,
        });
    }

    static unsubscribeUpdateRoom() {
        socket.off('updateRooms');
    }

}

export { uri, socket };
