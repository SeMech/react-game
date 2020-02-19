import {InterfaceBall} from "../interfaces/InterfaceBall";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './Canvas';

export class Ball implements InterfaceBall {
    radius = 10;
    positions = {
        x: (CANVAS_WIDTH / 2),
        y: (CANVAS_HEIGHT / 2),
    };
    vectors = {
        vx: 6,
        vy: -5,
    };
}
