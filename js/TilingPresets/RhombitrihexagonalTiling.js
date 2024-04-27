// sqrt(3) / 2
const halfsqrt3 = Math.sqrt(3) / 2;

// funcions parameters are used for tiles' id :
//      xHalf : shift xHalf * 0.5 on x coordinate
//      xHalfSqrt3 : shift xHalf * halfsqrt3 on x coordinate
//      yHalf : shift yHalf * 0.5 on y coordinate
//      yHalfSqrt3 : shift yHalf * halfsqrt3 on y coordinate


function HEXAGON(xHalf, xHalfSqrt3, yHalf, yHalfSqrt3){
    var id = ['hexagon', xHalf, xHalfSqrt3, yHalf, yHalfSqrt3]
	var bounds = [];
    let x = xHalf * 0.5 + xHalfSqrt3 * halfsqrt3;
    let y = yHalf * 0.5 + yHalfSqrt3 * halfsqrt3;
	bounds.push(x, y + 1);
    bounds.push(x - halfsqrt3, y + 1/2);
    bounds.push(x - halfsqrt3, y - 1/2);
    bounds.push(x, y - 1);
    bounds.push(x + halfsqrt3, y - 1/2);
    bounds.push(x + halfsqrt3, y + 1/2);

    var neighbors = [];
    neighbors.push(['sidesquare', xHalf - 1, xHalfSqrt3 - 1, yHalf, yHalfSqrt3]);
    neighbors.push(['sidesquare', xHalf + 1, xHalfSqrt3 + 1, yHalf, yHalfSqrt3]);
    neighbors.push(['left', xHalf, xHalfSqrt3, yHalf + 2, yHalfSqrt3]);
    neighbors.push(['right', xHalf, xHalfSqrt3, yHalf + 2, yHalfSqrt3]);
    neighbors.push(['left', xHalf + 1, xHalfSqrt3 + 1, yHalf - 1, yHalfSqrt3 - 1]);
    neighbors.push(['right', xHalf - 1, xHalfSqrt3 - 1, yHalf - 1, yHalfSqrt3 - 1]);
    neighbors.push(['right', xHalf, xHalfSqrt3, yHalf - 2, yHalfSqrt3]);

    return new Tile(id, neighbors, bounds, 6);
}

function SIDE_SQUARE(xHalf, xHalfSqrt3, yHalf, yHalfSqrt3){
    var id = ['sidesquare', xHalf, xHalfSqrt3, yHalf, yHalfSqrt3]
    var bounds = [];
    let x = xHalf * 0.5 + xHalfSqrt3 * halfsqrt3;
    let y = yHalf * 0.5 + yHalfSqrt3 * halfsqrt3;
    bounds.push(x - 0.5, y + 0.5);
    bounds.push(x - 0.5, y - 0.5);
    bounds.push(x + 0.5, y - 0.5);
    bounds.push(x + 0.5, y + 0.5);

    var neighbors = [];
    neighbors.push(['hexagon', xHalf + 1, xHalfSqrt3 + 1, yHalf, yHalfSqrt3]);
    neighbors.push(['hexagon', xHalf - 1, xHalfSqrt3 - 1, yHalf, yHalfSqrt3]);
    neighbors.push(['up_triangle', xHalf - 1, xHalfSqrt3, yHalf + 1, yHalfSqrt3]);
    neighbors.push(['down_triangle', xHalf - 1, xHalfSqrt3, yHalf - 1, yHalfSqrt3]);

    return new Tile(id, neighbors, bounds, 4);
}

function LEFT_SQUARE(xHalf, xHalfSqrt3, yHalf, yHalfSqrt3){
    var id = ['left', xHalf, xHalfSqrt3, yHalf, yHalfSqrt3];
    var bounds = [];
    let x = xHalf * 0.5 + xHalfSqrt3 * halfsqrt3;
    let y = yHalf * 0.5 + yHalfSqrt3 * halfsqrt3;
    bounds.push(x, y);
    bounds.push(x - halfsqrt3, y - 0.5);
    bounds.push(x - 0.5 - halfsqrt3, y + halfsqrt3 - 0.5);
    bounds.push(x - 0.5, y + halfsqrt3);

    var neighbors = [];
    neighbors.push(['hexagon', xHalf, xHalfSqrt3, yHalf - 2, yHalfSqrt3]);
    neighbors.push(['hexagon', xHalf - 1, xHalfSqrt3 - 1, yHalf + 1, yHalfSqrt3 + 1]);
    neighbors.push(['up_triangle', xHalf - 2, xHalfSqrt3 - 1, yHalf - 1, yHalfSqrt3]);
    neighbors.push(['down_triangle', xHalf - 1, xHalfSqrt3, yHalf, yHalfSqrt3 + 1]);

    return new Tile(id, neighbors, bounds, 4);
}

function RIGHT_SQUARE(xHalf, xHalfSqrt3, yHalf, yHalfSqrt3){
    var id = ['right', xHalf, xHalfSqrt3, yHalf, yHalfSqrt3];
    var bounds = [];
    let x = xHalf * 0.5 + xHalfSqrt3 * halfsqrt3;
    let y = yHalf * 0.5 + yHalfSqrt3 * halfsqrt3;
    bounds.push(x, y);
    bounds.push(x + halfsqrt3, y - 0.5);
    bounds.push(x + halfsqrt3 + 0.5, y - 0.5 + halfsqrt3);
    bounds.push(x + 0.5, y + halfsqrt3);

    var neighbors = [];
    neighbors.push(['hexagon', xHalf, xHalfSqrt3, yHalf - 2, yHalfSqrt3]);
    neighbors.push(['hexagon', xHalf + 1, xHalfSqrt3 + 1, yHalf + 1, yHalfSqrt3 + 1]);
    neighbors.push(['down_triangle', xHalf - 1, xHalfSqrt3, yHalf, yHalfSqrt3 + 1]);
    neighbors.push(['up_triangle', xHalf, xHalfSqrt3 + 1, yHalf - 1, yHalfSqrt3]);

    return new Tile(id, neighbors, bounds, 4);
}

function UP_TRIANGLE(xHalf, xHalfSqrt3, yHalf, yHalfSqrt3){
    var id = ['up_triangle', xHalf, xHalfSqrt3, yHalf, yHalfSqrt3];
    var bounds = [];
    let x = xHalf * 0.5 + xHalfSqrt3 * halfsqrt3;
    let y = yHalf * 0.5 + yHalfSqrt3 * halfsqrt3;
    bounds.push(x, y);
    bounds.push(x + 1, y);
    bounds.push(x + 0.5, y + halfsqrt3);

    var neighbors = [];
    neighbors.push(['right', xHalf, xHalfSqrt3 - 1, yHalf + 1, yHalfSqrt3]);
    neighbors.push(['left', xHalf + 2, xHalfSqrt3 + 1, yHalf + 1, yHalfSqrt3]);
    neighbors.push(['sidesquare', xHalf + 1, xHalfSqrt3, yHalf - 1, yHalfSqrt3]);

    return new Tile(id, neighbors, bounds, 3);
}

function DOWN_TRIANGLE(xHalf, xHalfSqrt3, yHalf, yHalfSqrt3){
    var id = ['down_triangle', xHalf, xHalfSqrt3, yHalf, yHalfSqrt3];
    var bounds = [];
    let x = xHalf * 0.5 + xHalfSqrt3 * halfsqrt3;
    let y = yHalf * 0.5 + yHalfSqrt3 * halfsqrt3;
    bounds.push(x, y);
    bounds.push(x + 1, y);
    bounds.push(x + 0.5, y - halfsqrt3);

    var neighbors = [];
    neighbors.push(['sidesquare', xHalf + 1, xHalfSqrt3, yHalf + 1, yHalfSqrt3]);
    neighbors.push(['left', xHalf + 1, xHalfSqrt3, yHalf, yHalfSqrt3 - 1]);
    neighbors.push(['right', xHalf + 1, xHalfSqrt3, yHalf, yHalfSqrt3 - 1]);

    return new Tile(id, neighbors, bounds, 3);
}

Tiling.rhombTriHex = function({size} = {}){
    // Creates a Tiling corresponding to a rhombitrihexagonal Tiling of with a size
    // source : https://en.wikipedia.org/wiki/Rhombitrihexagonal_tiling
    
	var tiles = [];

    // Default shapes
    tiles.push(HEXAGON(0, 0, 0, 0));
    tiles.push(SIDE_SQUARE(-1, -1,  0, 0));
    tiles.push(SIDE_SQUARE(1, 1,  0, 0));

    tiles.push(LEFT_SQUARE(0, 0, 2, 0));
    tiles.push(LEFT_SQUARE(1, 1, -1, -1));

    tiles.push(RIGHT_SQUARE(0, 0, 2, 0));
    tiles.push(RIGHT_SQUARE(-1, -1, -1, -1));

    tiles.push(UP_TRIANGLE(-2, -1, 1, 0));
    tiles.push(UP_TRIANGLE(0, 1, 1, 0));
    tiles.push(UP_TRIANGLE(-1, 0, -2, -1));

    tiles.push(DOWN_TRIANGLE(-2, -1, -1, 0));
    tiles.push(DOWN_TRIANGLE(0, 1, -1, 0));
    tiles.push(DOWN_TRIANGLE(-1, 0, 2, 1));

    for (let i = 1 ; i <= size ; i++){
        tiles.push(HEXAGON(-i, -i, 3*i, i)); // up left hexagon
        tiles.push(UP_TRIANGLE(-(i + 2), -(i + 1), 3*i + 1, i)); // left of up left Zhexagon
        tiles.push(SIDE_SQUARE(-(i + 1), -(i + 1), 3*i, i)); // left of up left hexagon
        tiles.push(DOWN_TRIANGLE(-(i + 2), -(i + 1), 3*i - 1, i)); // left of up left hexagon
        tiles.push(RIGHT_SQUARE(-(i + 1), -(i + 1), 3*i - 1, i - 1)); // left of up left hexagon
        tiles.push(LEFT_SQUARE(-i, -i, 3*i + 2, i)); // left of up left hexagon
        tiles.push(RIGHT_SQUARE(-i, -i, 3*i + 2, i)); // right of up left hexagon
        tiles.push(UP_TRIANGLE(-i, -(i - 1), 3*i + 1, i)); // right of up left hexagon
        tiles.push(SIDE_SQUARE(-(i - 1), -(i - 1), 3*i, i)); // right of up left hexagon
        tiles.push(DOWN_TRIANGLE(-(i + 1), -i, 3*i + 2, i + 1)); // above up left hexagon

        tiles.push(HEXAGON(i, i, 3*i, i)); // up right hexagon
        tiles.push(LEFT_SQUARE(i, i, 3*i + 2, i)); // left of up right hexagon
        tiles.push(UP_TRIANGLE(i, i + 1, 3*i + 1, i)); // right of up right hexagon
        tiles.push(SIDE_SQUARE(i + 1, i + 1, 3*i, i)); // right of up right hexagon
        tiles.push(DOWN_TRIANGLE(i, i + 1, 3*i - 1, i)); // right of up right hexagon
        tiles.push(RIGHT_SQUARE(i, i, 3*i + 2, i)); // right of up right hexagon
        tiles.push(LEFT_SQUARE(i + 1, i + 1, 3*i - 1, i - 1)); // right of up left hexagon
        tiles.push(DOWN_TRIANGLE(i - 1, i, 3*i + 2, i + 1)); // above up right hexagon

        tiles.push(HEXAGON(-i, -i, -3*i, -i)); // down left hexagon
        tiles.push(SIDE_SQUARE(-(i + 1), -(i + 1), -3*i, -i)); // left of down left hexagon
        tiles.push(DOWN_TRIANGLE(-(i + 2), -(i + 1), -(3*i + 1), -i)); // left of down left hexagon
        tiles.push(UP_TRIANGLE(-(i + 2), -(i + 1), -(3*i - 1), -i)); // left of down left hexagon
        tiles.push(LEFT_SQUARE(-i, -i, -3*i + 2, -i)); // left of down hexagon
        tiles.push(LEFT_SQUARE(-(i - 1), -(i - 1), -(3*i + 1), -(i + 1))); // left of down hexagon
        tiles.push(SIDE_SQUARE(-(i - 1), -(i - 1), -3*i, -i)); // right of down hexagon
        tiles.push(RIGHT_SQUARE(-(i + 1), -(i + 1), -(3*i + 1), -(i + 1))); // right of down hexagon
        tiles.push(DOWN_TRIANGLE( -i,-(i - 1), -(3*i + 1), -i)); // right of down hexagon
        tiles.push(UP_TRIANGLE(-(i + 1), -i, -(3*i + 2), -(i + 1))); // under down hexagon

        tiles.push(HEXAGON(i, i, -3*i,-i)); // down right hexagon
        tiles.push(RIGHT_SQUARE(i - 1, i - 1, -(3*i + 1), -(i + 1))); // left of down right hexagon
        tiles.push(LEFT_SQUARE(i + 1, i + 1, -(3*i + 1), -(i + 1))); // right of down right hexagon
        tiles.push(UP_TRIANGLE(i, i + 1, -(3*i - 1), -i)); // right of down right hexagon
        tiles.push(SIDE_SQUARE(i + 1, i + 1, -3*i, -i)); // right of down right hexagon
        tiles.push(DOWN_TRIANGLE(i, i + 1, -(3*i + 1), -i)); // right of down right hexagon
        tiles.push(RIGHT_SQUARE(i, i, -(3*i - 2), -i)); // right of down right hexagon
        tiles.push(UP_TRIANGLE(i - 1, i, -(3*i + 2), -(i + 1))); // under down right hexagon

        

        for (let k = 1 ; k < i ; k++){
            // up iteration from up left hexagon : add hexagons to the right, with some neighbors
            tiles.push(HEXAGON(-i + 2*k, -i + 2*k, 3*i, i));
            tiles.push(LEFT_SQUARE(-i + 2*k, -i + 2*k, 3*i + 2, i));
            tiles.push(DOWN_TRIANGLE(-i + 2*k - 1, -i + 2*k, 3*i + 2, i + 1));
            tiles.push(RIGHT_SQUARE(-i + 2*k, -i + 2*k, 3*i + 2, i));
            tiles.push(UP_TRIANGLE(-i + 2*k, -i + 2*k + 1, 3*i + 1, i));
            tiles.push(SIDE_SQUARE(-i + 2*k + 1, -i + 2*k + 1, 3*i, i));

            // down iteration from down left hexagon : add hexagons to the right, with some neighbors
            tiles.push(HEXAGON(-i + 2*k, -i + 2*k, -3*i, -i));
            tiles.push(LEFT_SQUARE(-i + 2*k + 1, -i + 2*k + 1, -3*i - 1, -(i + 1)));
            tiles.push(DOWN_TRIANGLE(-i + 2*k, -i + 2*k + 1, -3*i - 1, -i));
            tiles.push(RIGHT_SQUARE(-i + 2*k - 1, -i + 2*k - 1, -3*i - 1, -(i + 1)));
            tiles.push(UP_TRIANGLE(-i + 2*k - 1, -i + 2*k, -3*i-2, -(i + 1)));
            tiles.push(SIDE_SQUARE(-i + 2*k + 1, -i + 2*k + 1, -3*i, -i));
        }

        for (let j = 0 ; j < i ; j++){
            // right iteration : add hexagon and some neighbors from center to the right (until half of distance between most right and center)
            tiles.push(HEXAGON(1 + i, 1 + i, 3*(i - 1) - 6*j, i - 1 - 2*j));
            tiles.push(RIGHT_SQUARE(1 + i, 1 + i, 3*(i - 1) - 6*j + 2, i - 1 - 2*j));
            tiles.push(UP_TRIANGLE(1 + i, 2 + i, 3*(i - 1) - 6*j + 1, i - 1 - 2*j));
            tiles.push(SIDE_SQUARE(2 + i, 2 + i, 3*(i - 1) - 6*j, i - 1 - 2*j));
            tiles.push(DOWN_TRIANGLE(1 + i, 2 + i, 3*(i - 1) - 6*j - 1, i - 1 - 2*j));
            tiles.push(LEFT_SQUARE(2 + i, 2 + i, 3*(i - 1) - 6*j - 1, i - 2 - 2*j));

            // left iteration : add hexagon and some neighbors from center to the left (until half of distance between most left and center)
            tiles.push(HEXAGON(-(i + 1), -(i + 1), 3*(i - 1) - 6*j, i - 1 - 2*j));
            tiles.push(LEFT_SQUARE(-(i + 1), -(i + 1), 3*(i - 1) - 6*j + 2, i - 1 - 2*j));
            tiles.push(UP_TRIANGLE(-(i + 3), -(i + 2), 3*(i - 1) - 6*j + 1, i - 1 - 2*j));
            tiles.push(SIDE_SQUARE(-(i + 2), -(i + 2), 3*(i - 1) - 6*j, i - 1 - 2*j));
            tiles.push(DOWN_TRIANGLE(-(i + 3), -(i + 2), 3*(i - 1) - 6*j - 1, i - 1 - 2*j));
            tiles.push(RIGHT_SQUARE(-(i + 2), -(i + 2), 3*(i - 1) - 6*j - 1, i - 2 - 2*j));
        }

        for (let m = 0 ; m < i-1 ; m++){
            // right iteration : add hexagon and some neighbors from right to center (until half - 1 of distance between most right and center)
            tiles.push(HEXAGON(2*size - (i - 2), 2*size - (i - 2), 3*(i - 2) - 6*m, i - 2 - 2*m));
            tiles.push(RIGHT_SQUARE(2*size - (i - 2), 2*size - (i - 2), 3*(i - 2) - 6*m + 2, i - 2 - 2*m));
            tiles.push(UP_TRIANGLE(2*size - (i - 2), 2*size - (i - 3), 3*(i - 2) - 6*m + 1, i - 2 - 2*m));
            tiles.push(SIDE_SQUARE(2*size - (i - 3), 2*size - (i - 3), 3*(i - 2) - 6*m, i - 2 - 2*m));
            tiles.push(DOWN_TRIANGLE(2*size - (i - 2), 2*size - (i - 3), 3*(i - 2) - 6*m - 1, i - 2 - 2*m));
            tiles.push(LEFT_SQUARE(2*size - (i - 3), 2*size - (i - 3), 3*(i - 2) - 6*m - 1, i - 3 - 2*m));

            // left iteration : add hexagon and some neighbors from left to center (until half - 1 of distance between most left and center)
            tiles.push(HEXAGON(-2*size + i - 2, -2*size + i - 2, 3*(i - 2) - 6*m, i - 2 - 2*m));
            tiles.push(LEFT_SQUARE(-2*size + i - 2, -2*size + i - 2, 3*(i - 2) - 6*m + 2, i - 2 - 2*m));
            tiles.push(UP_TRIANGLE(-2*size + i - 4, -2*size + i - 3, 3*(i - 2) - 6*m + 1, i - 2 - 2*m));
            tiles.push(SIDE_SQUARE(-2*size + i - 3, -2*size + i - 3, 3*(i - 2) - 6*m, i - 2 - 2*m));
            tiles.push(DOWN_TRIANGLE(-2*size + i - 4, -2*size + i - 3, 3*(i - 2) - 6*m - 1, i - 2 - 2*m));
            tiles.push(RIGHT_SQUARE(-2*size + i - 3, -2*size + i - 3, 3*(i - 2) - 6*m - 1, i - 3 - 2*m));
        }
    }
    
	return new Tiling(tiles);
}
