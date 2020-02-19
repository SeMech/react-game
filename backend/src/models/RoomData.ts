import Canvas from "./Canvas";
import {InterfacePlayer} from "../interfaces/InterfacePlayer";
import {InterfaceRoomData} from "../interfaces/InterfaceRoomData";
import {Ball} from "./Ball";

class RoomData implements InterfaceRoomData {
    player1: InterfacePlayer | any = null;
    player2: InterfacePlayer | any = null;
    ball = new Ball;
    score = {
        player1: 0,
        player2: 0,
    };
    canvas = new Canvas;
}

export default RoomData;
