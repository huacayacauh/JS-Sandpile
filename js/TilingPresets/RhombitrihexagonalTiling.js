// sqrt(3) / 2
const halfsqrt3 = Math.sqrt(3) / 2;

function HEXAGON(x, y){
    var id = [x, y, 'hexagon']
	var bounds = [];
	bounds.push(x, y+1);
    bounds.push(x-halfsqrt3, y+1/2);
    bounds.push(x-halfsqrt3, y-1/2);
    bounds.push(x, y-1);
    bounds.push(x+halfsqrt3, y-1/2);
    bounds.push(x+halfsqrt3, y+1/2);

    var neighbors = [];
    neighbors.push([x-halfsqrt3-1/2, y, 'sidesquare']);
    neighbors.push([x+halfsqrt3+1/2, y, 'sidesquare']);
    neighbors.push([x, y+1, 'left']);
    neighbors.push([x, y+1, 'right']);
    neighbors.push([1/2 + halfsqrt3, -1/2 - halfsqrt3, 'left']);
    neighbors.push([-halfsqrt3 - 1/2, -1/2 - halfsqrt3, 'right']);
    
    neighbors.push([x, y-1, 'right']);

    return new Tile(id, neighbors, bounds, 6);
}

function SIDE_SQUARE(x, y){
    var id = [x, y, 'sidesquare']
    var bounds = [];
    bounds.push(x-1/2, y+1/2);
    bounds.push(x-1/2, y-1/2);
    bounds.push(x+1/2, y-1/2);
    bounds.push(x+1/2, y+1/2);

    var neighbors = [];
    neighbors.push([x+1/2+halfsqrt3, y, 'hexagon']);
    neighbors.push([x-1/2-halfsqrt3, y, 'hexagon']);
    neighbors.push([x-1/2, y+1/2, 'up_triangle']);
    neighbors.push([x-1/2, y-1/2, 'down_triangle']);

    return new Tile(id, neighbors, bounds, 4);
}

function LEFT_SQUARE(x, y){
    var id = [x, y, 'left'];
    var bounds = [];
    bounds.push(x, y);
    bounds.push(x-halfsqrt3, y-1/2);
    bounds.push(x-1/2-halfsqrt3, y+halfsqrt3-1/2);
    bounds.push(x-1/2, y+halfsqrt3);

    var neighbors = [];
    neighbors.push([x, y-1, 'hexagon']);
    neighbors.push([x - halfsqrt3 - 1/2, y + halfsqrt3 + 1/2, 'hexagon']);
    neighbors.push([x-1-halfsqrt3, y-1/2, 'up_triangle']);
    neighbors.push([x-1/2, y+halfsqrt3, 'down_triangle']);

    return new Tile(id, neighbors, bounds, 4);
}

function RIGHT_SQUARE(x, y){
    var id = [x, y, 'right'];
    var bounds = [];
    bounds.push(x, y);
    bounds.push(x+halfsqrt3, y-1/2);
    bounds.push(x+halfsqrt3+1/2, y-1/2+halfsqrt3);
    bounds.push(x+1/2, y+halfsqrt3);

    var neighbors = [];
    neighbors.push([x, y-1, 'hexagon']);
    neighbors.push([x+1/2+halfsqrt3, y+halfsqrt3+1/2, 'hexagon']);
    neighbors.push([x-1/2, y+halfsqrt3, 'down_triangle']);
    neighbors.push([x+halfsqrt3, y-1/2, 'up_triangle']);

    return new Tile(id, neighbors, bounds, 4);
}

function UP_TRIANGLE(x, y){
    var id = [x, y, 'up_triangle'];
    var bounds = [];
    bounds.push(x, y);
    bounds.push(x+1, y);
    bounds.push(x+1/2, y+halfsqrt3);

    var neighbors = [];
    neighbors.push([x-halfsqrt3, y+1/2, 'right']);
    neighbors.push([x+1+halfsqrt3, y+1/2, 'left']);
    neighbors.push([x+1/2, y-1/2, 'sidesquare']);

    return new Tile(id, neighbors, bounds, 3);
}

function DOWN_TRIANGLE(x, y){
    var id = [x, y, 'down_triangle'];
    var bounds = [];
    bounds.push(x, y);
    bounds.push(x+1, y);
    bounds.push(x+1/2, y-halfsqrt3);

    var neighbors = [];
    neighbors.push([x+1/2, y+1/2, 'sidesquare']);
    neighbors.push([x+1/2, y-halfsqrt3, 'left']);
    neighbors.push([x+1/2, y-halfsqrt3, 'right']);

    return new Tile(id, neighbors, bounds, 3);
}

Tiling.rhombTriHex = function({size} = {}){
	var tiles = [];

    // Default shapes
    tiles.push(HEXAGON(0,0));
    tiles.push(SIDE_SQUARE(-halfsqrt3 - 0.5, 0));
    tiles.push(SIDE_SQUARE(halfsqrt3 + 0.5, 0));

    tiles.push(LEFT_SQUARE(0,1));
    tiles.push(LEFT_SQUARE(1/2 + halfsqrt3, -halfsqrt3 - 1/2));

    tiles.push(RIGHT_SQUARE(0,1));
    tiles.push(RIGHT_SQUARE(-halfsqrt3 - 1/2, -halfsqrt3 - 1/2));

    tiles.push(UP_TRIANGLE(-halfsqrt3 - 1, 1/2));
    tiles.push(UP_TRIANGLE(halfsqrt3, 1/2));
    tiles.push(UP_TRIANGLE(-1/2, -1 - halfsqrt3));

    tiles.push(DOWN_TRIANGLE(-halfsqrt3 - 1, -1/2));
    tiles.push(DOWN_TRIANGLE(halfsqrt3, -1/2));
    tiles.push(DOWN_TRIANGLE(-1/2, 1 + halfsqrt3));

    for (let i = 1 ; i <= size ; i++){
        tiles.push(HEXAGON((-halfsqrt3 - 1/2) * i, (3/2 + halfsqrt3) * i)); // up left hexagon
        tiles.push(UP_TRIANGLE((-halfsqrt3 - 1/2) * i - halfsqrt3 - 1, (3/2 + halfsqrt3) * i + 1/2)); // left of up left hexagon
        tiles.push(SIDE_SQUARE((-halfsqrt3 - 1/2) * i - halfsqrt3 - 1/2, (3/2 + halfsqrt3) * i)); // left of up left hexagon
        tiles.push(DOWN_TRIANGLE((-halfsqrt3 - 1/2) * i - halfsqrt3 - 1, (3/2 + halfsqrt3) * i - 1/2)); // left of up left hexagon
        tiles.push(RIGHT_SQUARE((-halfsqrt3 - 1/2) * i - halfsqrt3 - 1/2, (3/2 + halfsqrt3) * i - halfsqrt3 - 1/2)); // left of up left hexagon
        tiles.push(LEFT_SQUARE((-halfsqrt3 - 1/2) * i, (3/2 + halfsqrt3) * i + 1)); // left of up left hexagon
        tiles.push(RIGHT_SQUARE((-halfsqrt3 - 1/2) * i, (3/2 + halfsqrt3) * i + 1)); // right of up left hexagon
        tiles.push(UP_TRIANGLE((-halfsqrt3 - 1/2) * i + halfsqrt3, (3/2 + halfsqrt3) * i + 1/2)); // right of up left hexagon
        tiles.push(SIDE_SQUARE((-halfsqrt3 - 1/2) * i + halfsqrt3 + 1/2, (3/2 + halfsqrt3) * i)); // right of up left hexagon
        tiles.push(DOWN_TRIANGLE((-halfsqrt3 - 1/2) * i + -1/2, (3/2 + halfsqrt3) * i + 1 + halfsqrt3)); // above up left hexagon

        tiles.push(HEXAGON((halfsqrt3 + 1/2) * i, (3/2 + halfsqrt3) * i)); // up right hexagon
        tiles.push(LEFT_SQUARE((halfsqrt3 + 1/2) * i, (3/2 + halfsqrt3) * i + 1)); // left of up right hexagon
        tiles.push(UP_TRIANGLE((halfsqrt3 + 1/2) * i + halfsqrt3, (3/2 + halfsqrt3) * i + 1/2)); // right of up right hexagon
        tiles.push(SIDE_SQUARE((halfsqrt3 + 1/2) * i + halfsqrt3 + 1/2, (3/2 + halfsqrt3) * i)); // right of up right hexagon
        tiles.push(DOWN_TRIANGLE((halfsqrt3 + 1/2) * i + halfsqrt3, (3/2 + halfsqrt3) * i - 1/2)); // right of up right hexagon
        tiles.push(RIGHT_SQUARE((halfsqrt3 + 1/2) * i, (3/2 + halfsqrt3) * i + 1)); // right of up right hexagon
        tiles.push(LEFT_SQUARE((halfsqrt3 + 1/2) * i + halfsqrt3 + 1/2, (3/2 + halfsqrt3) * i - halfsqrt3 - 1/2)); // right of up left hexagon
        tiles.push(DOWN_TRIANGLE((halfsqrt3 + 1/2) * i - 1/2, (3/2 + halfsqrt3) * i + 1 + halfsqrt3)); // above up right hexagon

        tiles.push(HEXAGON((-halfsqrt3 - 1/2) * i, -(3/2 + halfsqrt3) * i)); // down left hexagon
        tiles.push(SIDE_SQUARE((-halfsqrt3 - 1/2) * i - halfsqrt3 - 1/2, (-3/2 - halfsqrt3) * i)); // left of down left hexagon
        tiles.push(DOWN_TRIANGLE((-halfsqrt3 - 1/2) * i  - halfsqrt3 - 1, -(3/2 + halfsqrt3) * i - 1/2)); // left of down left hexagon
        tiles.push(UP_TRIANGLE((-halfsqrt3 - 1/2) * i  - halfsqrt3 - 1, -(3/2 + halfsqrt3) * i + 1/2)); // left of down left hexagon
        tiles.push(LEFT_SQUARE((-halfsqrt3 - 1/2) * i, (-3/2 - halfsqrt3) * i + 1)); // left of down hexagon
        tiles.push(LEFT_SQUARE((-halfsqrt3 - 1/2) * i + halfsqrt3 + 1/2, -(3/2 + halfsqrt3) * i - 1/2 - halfsqrt3)); // left of down hexagon
        tiles.push(SIDE_SQUARE((-halfsqrt3 - 1/2) * i + halfsqrt3 + 1/2, -(3/2 + halfsqrt3) * i)); // right of down hexagon
        tiles.push(RIGHT_SQUARE((-halfsqrt3 - 1/2) * i - halfsqrt3 - 1/2, -(3/2 + halfsqrt3) * i - 1/2 - halfsqrt3)); // right of down hexagon
        tiles.push(DOWN_TRIANGLE((-halfsqrt3 - 1/2) * i + halfsqrt3, -(3/2 + halfsqrt3) * i - 1/2)); // right of down hexagon
        tiles.push(UP_TRIANGLE((-halfsqrt3 - 1/2) * i + -1/2, -(3/2 + halfsqrt3) * i - 1 - halfsqrt3)); // under down hexagon

        tiles.push(HEXAGON((halfsqrt3 + 1/2) * i, (-3/2 - halfsqrt3) * i)); // down right hexagon
        tiles.push(RIGHT_SQUARE((halfsqrt3 + 1/2) * i - halfsqrt3 - 1/2, (-3/2 - halfsqrt3) * i - halfsqrt3 - 1/2)); // left of down right hexagon
        tiles.push(LEFT_SQUARE((halfsqrt3 + 1/2) * i + halfsqrt3 + 1/2, (-3/2 - halfsqrt3) * i - 1/2 - halfsqrt3)); // right of down right hexagon
        tiles.push(UP_TRIANGLE((halfsqrt3 + 1/2) * i + halfsqrt3, (-3/2 - halfsqrt3) * i + 1/2)); // right of down right hexagon
        tiles.push(SIDE_SQUARE((halfsqrt3 + 1/2) * i + halfsqrt3 + 1/2, (-3/2 - halfsqrt3) * i)); // right of down right hexagon
        tiles.push(DOWN_TRIANGLE((halfsqrt3 + 1/2) * i + halfsqrt3, (-3/2 - halfsqrt3) * i - 1/2)); // right of down right hexagon
        tiles.push(RIGHT_SQUARE((halfsqrt3 + 1/2) * i, (-3/2 - halfsqrt3) * i + 1)); // right of down right hexagon
        tiles.push(UP_TRIANGLE((halfsqrt3 + 1/2) * i - 1/2, (-3/2 - halfsqrt3) * i - 1 - halfsqrt3)); // under down right hexagon

        

        for (let k = 1 ; k < i ; k++){
            // up iteration from up left hexagon : add hexagons to the right, with some neighbors
            tiles.push(HEXAGON((-halfsqrt3 - 1/2) * i + (2*halfsqrt3 + 1) * k, (3/2 + halfsqrt3) * i));
            tiles.push(LEFT_SQUARE((-halfsqrt3 - 1/2) * i + (2*halfsqrt3 + 1) * k, (3/2 + halfsqrt3) * i + 1));
            tiles.push(DOWN_TRIANGLE((-halfsqrt3 - 1/2) * i + (2*halfsqrt3 + 1) * k - 1/2, (3/2 + halfsqrt3) * i + 1 + halfsqrt3));
            tiles.push(RIGHT_SQUARE((-halfsqrt3 - 1/2) * i + (2*halfsqrt3 + 1) * k, (3/2 + halfsqrt3) * i + 1));
            tiles.push(UP_TRIANGLE((-halfsqrt3 - 1/2) * i + (2*halfsqrt3 + 1) * k + halfsqrt3, (3/2 + halfsqrt3) * i + 1/2));
            tiles.push(SIDE_SQUARE((-halfsqrt3 - 1/2) * i + (2*halfsqrt3 + 1) * k + halfsqrt3 + 1/2, (3/2 + halfsqrt3) * i));

            // down iteration from down left hexagon : add hexagons to the right, with some neighbors
            tiles.push(HEXAGON((-halfsqrt3 - 1/2) * i + (2*halfsqrt3 + 1) * k, (-3/2 - halfsqrt3) * i));
            tiles.push(LEFT_SQUARE((-halfsqrt3 - 1/2) * i + (2*halfsqrt3 + 1) * k + halfsqrt3 + 1/2, (-3/2 - halfsqrt3) * i - 1/2 - halfsqrt3));
            tiles.push(DOWN_TRIANGLE((-halfsqrt3 - 1/2) * i + (2*halfsqrt3 + 1) * k + halfsqrt3, (-3/2 - halfsqrt3) * i - 1/2));
            tiles.push(RIGHT_SQUARE((-halfsqrt3 - 1/2) * i + (2*halfsqrt3 + 1) * k - 1/2 - halfsqrt3, (-3/2 - halfsqrt3) * i -1/2 - halfsqrt3));
            tiles.push(UP_TRIANGLE((-halfsqrt3 - 1/2) * i + (2*halfsqrt3 + 1) * k - 1/2, (-3/2 - halfsqrt3) * i - 1 - halfsqrt3));
            tiles.push(SIDE_SQUARE((-halfsqrt3 - 1/2) * i + (2*halfsqrt3 + 1) * k + halfsqrt3 + 1/2, (-3/2 - halfsqrt3) * i));
        }

        for (let j = 0 ; j < i ; j++){
            // right iteration : add hexagon and some neighbors from center to the right (until half of distance between most right and center)
            tiles.push(HEXAGON(2*halfsqrt3 + 1 + (halfsqrt3 + 1/2) * (i-1), (3/2 + halfsqrt3) * (i-1) - (3 + 2*halfsqrt3) * j));
            tiles.push(RIGHT_SQUARE(2*halfsqrt3 + 1 + (halfsqrt3 + 1/2) * (i-1), (3/2 + halfsqrt3) * (i-1) - (3 + 2*halfsqrt3) * j + 1));
            tiles.push(UP_TRIANGLE(2*halfsqrt3 + 1 + (halfsqrt3 + 1/2) * (i-1) + halfsqrt3, (3/2 + halfsqrt3) * (i-1) - (3 + 2*halfsqrt3) * j+ 1/2));
            tiles.push(SIDE_SQUARE(2*halfsqrt3 + 1 + (halfsqrt3 + 1/2) * (i-1) + halfsqrt3 + 1/2, (3/2 + halfsqrt3) * (i-1) - (3 + 2*halfsqrt3) * j));
            tiles.push(DOWN_TRIANGLE(2*halfsqrt3 + 1 + (halfsqrt3 + 1/2) * (i-1) + halfsqrt3, (3/2 + halfsqrt3) * (i-1) - (3 + 2*halfsqrt3) * j - 1/2));
            tiles.push(LEFT_SQUARE(2*halfsqrt3 + 1 + (halfsqrt3 + 1/2) * (i-1) + halfsqrt3 + 1/2, (3/2 + halfsqrt3) * (i-1) - (3 + 2*halfsqrt3) * j -halfsqrt3 - 1/2));

            // left iteration : add hexagon and some neighbors from center to the left (until half of distance between most left and center)
            tiles.push(HEXAGON(-2*halfsqrt3 - 1 - (halfsqrt3 + 1/2) * (i-1), (3/2 + halfsqrt3) * (i-1) - (3 + 2*halfsqrt3) * j));
            tiles.push(LEFT_SQUARE(-2*halfsqrt3 - 1 - (halfsqrt3 + 1/2) * (i-1), (3/2 + halfsqrt3) * (i-1) - (3 + 2*halfsqrt3) * j + 1));
            tiles.push(UP_TRIANGLE(-2*halfsqrt3 - 1 - (halfsqrt3 + 1/2) * (i-1) - halfsqrt3 - 1, (3/2 + halfsqrt3) * (i-1) - (3 + 2*halfsqrt3) * j+ 1/2));
            tiles.push(SIDE_SQUARE(-2*halfsqrt3 - 1 - (halfsqrt3 + 1/2) * (i-1) - halfsqrt3 - 1/2, (3/2 + halfsqrt3) * (i-1) - (3 + 2*halfsqrt3) * j));
            tiles.push(DOWN_TRIANGLE(-2*halfsqrt3 - 1 - (halfsqrt3 + 1/2) * (i-1) - halfsqrt3 - 1, (3/2 + halfsqrt3) * (i-1) - (3 + 2*halfsqrt3) * j - 1/2));
            tiles.push(RIGHT_SQUARE(-2*halfsqrt3 - 1 - (halfsqrt3 + 1/2) * (i-1) - halfsqrt3 - 1/2, (3/2 + halfsqrt3) * (i-1) - (3 + 2*halfsqrt3) * j -halfsqrt3 - 1/2));
        }

        for (let m = 0 ; m < i-1 ; m++){
            // right iteration : add hexagon and some neighbors from right to center (until half - 1 of distance between most right and center)
            tiles.push(HEXAGON((2*halfsqrt3 + 1) * size + (-halfsqrt3 - 1/2) * (i-2), (halfsqrt3 + 3/2) * (i-2) + (-3 - 2*halfsqrt3) * m));
            tiles.push(RIGHT_SQUARE((2*halfsqrt3 + 1) * size + (-halfsqrt3 - 1/2) * (i-2), (halfsqrt3 + 3/2) * (i-2) + (-3 - 2*halfsqrt3) * m + 1));
            tiles.push(UP_TRIANGLE((2*halfsqrt3 + 1) * size + (-halfsqrt3 - 1/2) * (i-2) + halfsqrt3, (halfsqrt3 + 3/2) * (i-2) + (-3 - 2*halfsqrt3) * m+ 1/2));
            tiles.push(SIDE_SQUARE((2*halfsqrt3 + 1) * size + (-halfsqrt3 - 1/2) * (i-2) + halfsqrt3 + 1/2, (halfsqrt3 + 3/2) * (i-2) + (-3 - 2*halfsqrt3) * m));
            tiles.push(DOWN_TRIANGLE((2*halfsqrt3 + 1) * size + (-halfsqrt3 - 1/2) * (i-2) + halfsqrt3, (halfsqrt3 + 3/2) * (i-2) + (-3 - 2*halfsqrt3) * m - 1/2));
            tiles.push(LEFT_SQUARE((2*halfsqrt3 + 1) * size + (-halfsqrt3 - 1/2) * (i-2) + halfsqrt3 + 1/2, (halfsqrt3 + 3/2) * (i-2) + (-3 - 2*halfsqrt3) * m -halfsqrt3 - 1/2));

            // left iteration : add hexagon and some neighbors from left to center (until half - 1 of distance between most left and center)
            tiles.push(HEXAGON(-(2*halfsqrt3 + 1) * size + (halfsqrt3 + 1/2) * (i-2), (halfsqrt3 + 3/2) * (i-2) + (-3 - 2*halfsqrt3) * m));
            tiles.push(LEFT_SQUARE(-(2*halfsqrt3 + 1) * size + (halfsqrt3 + 1/2) * (i-2), (halfsqrt3 + 3/2) * (i-2) + (-3 - 2*halfsqrt3) * m + 1));
            tiles.push(UP_TRIANGLE(-(2*halfsqrt3 + 1) * size + (halfsqrt3 + 1/2) * (i-2) - halfsqrt3 - 1, (halfsqrt3 + 3/2) * (i-2) + (-3 - 2*halfsqrt3) * m+ 1/2));
            tiles.push(SIDE_SQUARE(-(2*halfsqrt3 + 1) * size + (halfsqrt3 + 1/2) * (i-2) - halfsqrt3 - 1/2, (halfsqrt3 + 3/2) * (i-2) + (-3 - 2*halfsqrt3) * m));
            tiles.push(DOWN_TRIANGLE(-(2*halfsqrt3 + 1) * size + (halfsqrt3 + 1/2) * (i-2) - halfsqrt3 - 1, (halfsqrt3 + 3/2) * (i-2) + (-3 - 2*halfsqrt3) * m - 1/2));
            tiles.push(RIGHT_SQUARE(-(2*halfsqrt3 + 1) * size + (halfsqrt3 + 1/2) * (i-2) - halfsqrt3 - 1/2, (halfsqrt3 + 3/2) * (i-2) + (-3 - 2*halfsqrt3) * m -halfsqrt3 - 1/2));
        }
    }
    
	return new Tiling(tiles);
}
