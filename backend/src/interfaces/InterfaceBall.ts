export interface PositionsBall {
    x: number;
    y: number;
}

export interface VectorsBall {
    vx: number;
    vy: number;
}

export interface InterfaceBall {
    radius: number;
    positions: PositionsBall;
    vectors: VectorsBall;
}
