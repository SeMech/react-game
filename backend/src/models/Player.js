const CANVAS_HEIGHT = 800;

class Player {
    constructor(id, x = 0) {
        this.id = id;
        this.speed = 20;
        this.positions = {
            x: x,
            y: (CANVAS_HEIGHT / 2) - 50,
        };
        this.sizes = {
            width: 30,
            height: 80,
        };
    }
}

module.exports = Player;
