import db from './db';
import errors from '../config/errors';
import RoomData from "./RoomData";

const ROOM_SCHEMA = new db.Schema({
    name: String,
    quantityPlayer: Number,
    connectPlayer: Array,
    roomData: Object,
    idPlayerRenderBall: String,
});

const Room = db.model('Room', ROOM_SCHEMA);

function createNewRoom(nameRoom: String): any {
    if (!nameRoom) {
        throw({...errors.exceptions.nameNewRoom});
    }
    return new Room({
        name: nameRoom,
        quantityPlayer: 2,
        connectPlayer: [],
        roomData: new RoomData(),
    });
}

export { createNewRoom };
export default Room;
