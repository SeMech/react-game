export interface PositionPlayer {
    x: number,
    y: number,
}

export interface SizesPlayer {
    width: number,
    height: number,
}

export interface InterfacePlayer {
    id: string,
    speed: number,
    positions: PositionPlayer,
    sizes: SizesPlayer,
}
