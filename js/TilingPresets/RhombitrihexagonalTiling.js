// Creates a Tiling corresponding to a rhombitrihexagonal Tiling of with a size
// source : https://en.wikipedia.org/wiki/Rhombitrihexagonal_tiling



// sqrt(3) / 2
const halfsqrt3 = Math.sqrt(3) / 2;

// funcions parameters are used for tiles' id :
//      xHalf : shift xHalf * 0.5 on x coordinate
//      xHalfSqrt3 : shift xHalf * halfsqrt3 on x coordinate
//      yHalf : shift yHalf * 0.5 on y coordinate
//      yHalfSqrt3 : shift yHalf * halfsqrt3 on y coordinate


function rhombiHexagon(xHalf, xHalfSqrt3, yHalf, yHalfSqrt3){
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

function rhombiSideSquare(xHalf, xHalfSqrt3, yHalf, yHalfSqrt3){
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

function rhombiLeftSquare(xHalf, xHalfSqrt3, yHalf, yHalfSqrt3){
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

function rhombiRightSquare(xHalf, xHalfSqrt3, yHalf, yHalfSqrt3){
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

function rhombiUpTriangle(xHalf, xHalfSqrt3, yHalf, yHalfSqrt3){
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

function rhombiDownTriangle(xHalf, xHalfSqrt3, yHalf, yHalfSqrt3){
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
    var tiles = [];
    // simplified generation method
    var offset = size - 1 ;
    for (let j = 1 - size  ; j < size; j++){
	for (let i = 1 - size ; i < size; i++){
	    console.log('debugging rhombitrihexagonal ', i,j)
	    tiles.push(rhombiHexagon(2*i-j,2*i-j,3*j,j));
	    tiles.push(rhombiSideSquare(2*i-j+1, 2*i-j+1,3*j,j));
	    tiles.push(rhombiLeftSquare(2*i-j,2*i-j,3*j+2,j));
	    tiles.push(rhombiRightSquare(2*i-j,2*i-j,3*j+2,j));
	    tiles.push(rhombiUpTriangle(2*i-j,2*i-j+1,3*j+1,j));
	    tiles.push(rhombiDownTriangle(2*i-j-1,2*i-j,3*j+2,j+1));
	}}
    // // Old generation method
    // // Default shapes
    // tiles.push(rhombiHexagon(0, 0, 0, 0));
    // tiles.push(rhombiSideSquare(-1, -1,  0, 0));
    // tiles.push(rhombiSideSquare(1, 1,  0, 0));
    // tiles.push(rhombiLeftSquare(0, 0, 2, 0));
    // tiles.push(rhombiLeftSquare(1, 1, -1, -1));
    // tiles.push(rhombiRightSquare(0, 0, 2, 0));
    // tiles.push(rhombiRightSquare(-1, -1, -1, -1));
    // tiles.push(rhombiUpTriangle(-2, -1, 1, 0));
    // tiles.push(rhombiUpTriangle(0, 1, 1, 0));
    // tiles.push(rhombiUpTriangle(-1, 0, -2, -1));
    // tiles.push(rhombiDownTriangle(-2, -1, -1, 0));
    // tiles.push(rhombiDownTriangle(0, 1, -1, 0));
    // tiles.push(rhombiDownTriangle(-1, 0, 2, 1));
    // for (let i = 1 ; i <= size ; i++){
    //     tiles.push(rhombiHexagon(-i, -i, 3*i, i)); // up left hexagon
    //     tiles.push(rhombiUpTriangle(-(i + 2), -(i + 1), 3*i + 1, i)); // left of up left Zhexagon
    //     tiles.push(rhombiSideSquare(-(i + 1), -(i + 1), 3*i, i)); // left of up left hexagon
    //     tiles.push(rhombiDownTriangle(-(i + 2), -(i + 1), 3*i - 1, i)); // left of up left hexagon
    //     tiles.push(rhombiRightSquare(-(i + 1), -(i + 1), 3*i - 1, i - 1)); // left of up left hexagon
    //     tiles.push(rhombiLeftSquare(-i, -i, 3*i + 2, i)); // left of up left hexagon
    //     tiles.push(rhombiRightSquare(-i, -i, 3*i + 2, i)); // right of up left hexagon
    //     tiles.push(rhombiUpTriangle(-i, -(i - 1), 3*i + 1, i)); // right of up left hexagon
    //     tiles.push(rhombiSideSquare(-(i - 1), -(i - 1), 3*i, i)); // right of up left hexagon
    //     tiles.push(rhombiDownTriangle(-(i + 1), -i, 3*i + 2, i + 1)); // above up left hexagon

    //     tiles.push(rhombiHexagon(i, i, 3*i, i)); // up right hexagon
    //     tiles.push(rhombiLeftSquare(i, i, 3*i + 2, i)); // left of up right hexagon
    //     tiles.push(rhombiUpTriangle(i, i + 1, 3*i + 1, i)); // right of up right hexagon
    //     tiles.push(rhombiSideSquare(i + 1, i + 1, 3*i, i)); // right of up right hexagon
    //     tiles.push(rhombiDownTriangle(i, i + 1, 3*i - 1, i)); // right of up right hexagon
    //     tiles.push(rhombiRightSquare(i, i, 3*i + 2, i)); // right of up right hexagon
    //     tiles.push(rhombiLeftSquare(i + 1, i + 1, 3*i - 1, i - 1)); // right of up left hexagon
    //     tiles.push(rhombiDownTriangle(i - 1, i, 3*i + 2, i + 1)); // above up right hexagon

    //     tiles.push(rhombiHexagon(-i, -i, -3*i, -i)); // down left hexagon
    //     tiles.push(rhombiSideSquare(-(i + 1), -(i + 1), -3*i, -i)); // left of down left hexagon
    //     tiles.push(rhombiDownTriangle(-(i + 2), -(i + 1), -(3*i + 1), -i)); // left of down left hexagon
    //     tiles.push(rhombiUpTriangle(-(i + 2), -(i + 1), -(3*i - 1), -i)); // left of down left hexagon
    //     tiles.push(rhombiLeftSquare(-i, -i, -3*i + 2, -i)); // left of down hexagon
    //     tiles.push(rhombiLeftSquare(-(i - 1), -(i - 1), -(3*i + 1), -(i + 1))); // left of down hexagon
    //     tiles.push(rhombiSideSquare(-(i - 1), -(i - 1), -3*i, -i)); // right of down hexagon
    //     tiles.push(rhombiRightSquare(-(i + 1), -(i + 1), -(3*i + 1), -(i + 1))); // right of down hexagon
    //     tiles.push(rhombiDownTriangle( -i,-(i - 1), -(3*i + 1), -i)); // right of down hexagon
    //     tiles.push(rhombiUpTriangle(-(i + 1), -i, -(3*i + 2), -(i + 1))); // under down hexagon

    //     tiles.push(rhombiHexagon(i, i, -3*i,-i)); // down right hexagon
    //     tiles.push(rhombiRightSquare(i - 1, i - 1, -(3*i + 1), -(i + 1))); // left of down right hexagon
    //     tiles.push(rhombiLeftSquare(i + 1, i + 1, -(3*i + 1), -(i + 1))); // right of down right hexagon
    //     tiles.push(rhombiUpTriangle(i, i + 1, -(3*i - 1), -i)); // right of down right hexagon
    //     tiles.push(rhombiSideSquare(i + 1, i + 1, -3*i, -i)); // right of down right hexagon
    //     tiles.push(rhombiDownTriangle(i, i + 1, -(3*i + 1), -i)); // right of down right hexagon
    //     tiles.push(rhombiRightSquare(i, i, -(3*i - 2), -i)); // right of down right hexagon
    //     tiles.push(rhombiUpTriangle(i - 1, i, -(3*i + 2), -(i + 1))); // under down right hexagon

        

    //     for (let k = 1 ; k < i ; k++){
    //         // up iteration from up left hexagon : add hexagons to the right, with some neighbors
    //         tiles.push(rhombiHexagon(-i + 2*k, -i + 2*k, 3*i, i));
    //         tiles.push(rhombiLeftSquare(-i + 2*k, -i + 2*k, 3*i + 2, i));
    //         tiles.push(rhombiDownTriangle(-i + 2*k - 1, -i + 2*k, 3*i + 2, i + 1));
    //         tiles.push(rhombiRightSquare(-i + 2*k, -i + 2*k, 3*i + 2, i));
    //         tiles.push(rhombiUpTriangle(-i + 2*k, -i + 2*k + 1, 3*i + 1, i));
    //         tiles.push(rhombiSideSquare(-i + 2*k + 1, -i + 2*k + 1, 3*i, i));

    //         // down iteration from down left hexagon : add hexagons to the right, with some neighbors
    //         tiles.push(rhombiHexagon(-i + 2*k, -i + 2*k, -3*i, -i));
    //         tiles.push(rhombiLeftSquare(-i + 2*k + 1, -i + 2*k + 1, -3*i - 1, -(i + 1)));
    //         tiles.push(rhombiDownTriangle(-i + 2*k, -i + 2*k + 1, -3*i - 1, -i));
    //         tiles.push(rhombiRightSquare(-i + 2*k - 1, -i + 2*k - 1, -3*i - 1, -(i + 1)));
    //         tiles.push(rhombiUpTriangle(-i + 2*k - 1, -i + 2*k, -3*i-2, -(i + 1)));
    //         tiles.push(rhombiSideSquare(-i + 2*k + 1, -i + 2*k + 1, -3*i, -i));
    //     }

    //     for (let j = 0 ; j < i ; j++){
    //         // right iteration : add hexagon and some neighbors from center to the right (until half of distance between most right and center)
    //         tiles.push(rhombiHexagon(1 + i, 1 + i, 3*(i - 1) - 6*j, i - 1 - 2*j));
    //         tiles.push(rhombiRightSquare(1 + i, 1 + i, 3*(i - 1) - 6*j + 2, i - 1 - 2*j));
    //         tiles.push(rhombiUpTriangle(1 + i, 2 + i, 3*(i - 1) - 6*j + 1, i - 1 - 2*j));
    //         tiles.push(rhombiSideSquare(2 + i, 2 + i, 3*(i - 1) - 6*j, i - 1 - 2*j));
    //         tiles.push(rhombiDownTriangle(1 + i, 2 + i, 3*(i - 1) - 6*j - 1, i - 1 - 2*j));
    //         tiles.push(rhombiLeftSquare(2 + i, 2 + i, 3*(i - 1) - 6*j - 1, i - 2 - 2*j));

    //         // left iteration : add hexagon and some neighbors from center to the left (until half of distance between most left and center)
    //         tiles.push(rhombiHexagon(-(i + 1), -(i + 1), 3*(i - 1) - 6*j, i - 1 - 2*j));
    //         tiles.push(rhombiLeftSquare(-(i + 1), -(i + 1), 3*(i - 1) - 6*j + 2, i - 1 - 2*j));
    //         tiles.push(rhombiUpTriangle(-(i + 3), -(i + 2), 3*(i - 1) - 6*j + 1, i - 1 - 2*j));
    //         tiles.push(rhombiSideSquare(-(i + 2), -(i + 2), 3*(i - 1) - 6*j, i - 1 - 2*j));
    //         tiles.push(rhombiDownTriangle(-(i + 3), -(i + 2), 3*(i - 1) - 6*j - 1, i - 1 - 2*j));
    //         tiles.push(rhombiRightSquare(-(i + 2), -(i + 2), 3*(i - 1) - 6*j - 1, i - 2 - 2*j));
    //     }

    //     for (let m = 0 ; m < i-1 ; m++){
    //         // right iteration : add hexagon and some neighbors from right to center (until half - 1 of distance between most right and center)
    //         tiles.push(rhombiHexagon(2*size - (i - 2), 2*size - (i - 2), 3*(i - 2) - 6*m, i - 2 - 2*m));
    //         tiles.push(rhombiRightSquare(2*size - (i - 2), 2*size - (i - 2), 3*(i - 2) - 6*m + 2, i - 2 - 2*m));
    //         tiles.push(rhombiUpTriangle(2*size - (i - 2), 2*size - (i - 3), 3*(i - 2) - 6*m + 1, i - 2 - 2*m));
    //         tiles.push(rhombiSideSquare(2*size - (i - 3), 2*size - (i - 3), 3*(i - 2) - 6*m, i - 2 - 2*m));
    //         tiles.push(rhombiDownTriangle(2*size - (i - 2), 2*size - (i - 3), 3*(i - 2) - 6*m - 1, i - 2 - 2*m));
    //         tiles.push(rhombiLeftSquare(2*size - (i - 3), 2*size - (i - 3), 3*(i - 2) - 6*m - 1, i - 3 - 2*m));

    //         // left iteration : add hexagon and some neighbors from left to center (until half - 1 of distance between most left and center)
    //         tiles.push(rhombiHexagon(-2*size + i - 2, -2*size + i - 2, 3*(i - 2) - 6*m, i - 2 - 2*m));
    //         tiles.push(rhombiLeftSquare(-2*size + i - 2, -2*size + i - 2, 3*(i - 2) - 6*m + 2, i - 2 - 2*m));
    //         tiles.push(rhombiUpTriangle(-2*size + i - 4, -2*size + i - 3, 3*(i - 2) - 6*m + 1, i - 2 - 2*m));
    //         tiles.push(rhombiSideSquare(-2*size + i - 3, -2*size + i - 3, 3*(i - 2) - 6*m, i - 2 - 2*m));
    //         tiles.push(rhombiDownTriangle(-2*size + i - 4, -2*size + i - 3, 3*(i - 2) - 6*m - 1, i - 2 - 2*m));
    //         tiles.push(rhombiRightSquare(-2*size + i - 3, -2*size + i - 3, 3*(i - 2) - 6*m - 1, i - 3 - 2*m));
    //     }
    // }
    
    return new Tiling(tiles);
}
