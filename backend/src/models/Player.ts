import db from './db';

import {InterfacePlayer, PositionPlayer, SizesPlayer} from "../interfaces/InterfacePlayer";
import {CANVAS_HEIGHT} from "./Canvas";

const PLAYER_WIDTH = 30;
const PLAYER_HEIGHT = 80;

const USER_SCHEMA = new db.Schema({
    id: String,
    roomId: String,
});

const User = db.model('User', USER_SCHEMA);

class Player implements InterfacePlayer {
    id: string;
    speed: number = 10;
    positions: PositionPlayer = {
        x: 0,
        y: (CANVAS_HEIGHT / 2) - (PLAYER_HEIGHT / 2)
    };
    sizes: SizesPlayer = {
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
    };
    constructor(id: string, positionX = 0) {
        this.id = id;
        this.positions.x = positionX;
    }
}

const createUser = async (id: string) => {
    const user = new User({
        id: id,
    });
    await user.save();
    return user;
};

const removeUser = (id: string): void => {
    User.deleteOne({id: id}, function(err) {});
};

export { PLAYER_HEIGHT, PLAYER_WIDTH, createUser, removeUser };
export default Player;
