export const CELL_WIDTH = 50;
export const CELL_HEIGHT = 50;
export const LEFT = {
    N: 'W',
    E: 'N',
    S: 'E',
    W: 'S',
};
export const RIGHT = {
    N: 'E',
    E: 'S',
    S: 'W',
    W: 'N',
};
export const MOVE = {
    N: {x:  0, y:  1},
    E: {x:  1, y:  0},
    S: {x:  0, y: -1},
    W: {x: -1, y:  0},
}
export const DEG = {
    N: 0,
    E: 90,
    S: 180,
    W: 270,
}
export const BORDER_THICKNESS = 1;