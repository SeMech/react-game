const WIDTH = 800;
const HEIGHT = 800;

class DataGame {
    constructor() {
        this.player1 = null;
        this.player2 = null;
        this.ball = {
            radius: 10,
            x: WIDTH / 2,
            y: HEIGHT / 2,
            dx: 5,
            dy: -4,
        };
        this.score = {
            player1: 0,
            player2: 0,
        };
        this.canvas = {
            width: WIDTH,
            height: HEIGHT,
        };
    }
}

module.exports = DataGame;
