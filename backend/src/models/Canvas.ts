import {InterfaceCanvas} from "../interfaces/InterfaceCanvas";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

class Canvas implements InterfaceCanvas {
    width = CANVAS_WIDTH;
    height = CANVAS_HEIGHT;
}

export { CANVAS_WIDTH, CANVAS_HEIGHT };
export default Canvas;
