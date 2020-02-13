class Player {
    constructor(id) {
        this.id = id;
        this.speed = 10;
        this.positions = {
            x: 40,
            y: 40,
        };
        this.sizes = {
            width: 30,
            height: 100,
        };
    }
}

module.exports = Player;
