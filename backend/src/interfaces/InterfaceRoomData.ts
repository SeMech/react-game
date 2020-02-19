import {InterfacePlayer} from "./InterfacePlayer";
import {InterfaceBall} from "./InterfaceBall";
import {InterfaceCanvas} from "./InterfaceCanvas";

export interface InterfaceScore {
    player1: number;
    player2: number;
}

export interface InterfaceRoomData {
    player1: InterfacePlayer | any;
    player2: InterfacePlayer | any;
    ball: InterfaceBall;
    score: InterfaceScore;
    canvas: InterfaceCanvas;
}
