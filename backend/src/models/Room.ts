import db from './db';
import errors from '../config/errors';
import RoomData from "./RoomData";
import {InterfaceRoomData} from "../interfaces/InterfaceRoomData";
import {Document, Model} from "mongoose";

const ROOM_SCHEMA = new db.Schema({
    name: String,
    quantityPlayer: Number,
    connectPlayer: Array,
    roomData: Object,
    idPlayerRenderBall: String,
});

const Room = db.model('Room', ROOM_SCHEMA);

interface InterfaceRoomModel extends Document {
    name: string;
    quantityPlayer: number,
    connectPlayer: Array<string>,
    roomData: InterfaceRoomData,
}

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

function findRooms(offset = 0, limit = 0) {
    return Room.find()
        .skip(+offset)
        .limit(+limit);
}

function findOneRoom(conditions: Object, callback: Function) {
    return Room.findOne(conditions, (err, room) => callback(err, room));
}

function getCountRooms() {
    return Room.countDocuments();
}

export { createNewRoom, findRooms, getCountRooms, findOneRoom, InterfaceRoomModel };
export default Room;
