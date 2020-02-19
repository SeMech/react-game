import {InterfacePlayer, PositionPlayer, SizesPlayer} from "../interfaces/InterfacePlayer";
import {CANVAS_HEIGHT} from "./Canvas";

export const PLAYER_WIDTH = 30;
export const PLAYER_HEIGHT = 80;

export default class Player implements InterfacePlayer {
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
