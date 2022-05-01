// This code is part of JS-Sandpile (https://github.com/huacayacauh/JS-Sandpile/)
// CC-BY Valentin Darrigo, Jeremy Fersula, Kevin Perrot

// Truncated Trihexagonal tiling
// tiling described at 
// https://en.wikipedia.org/wiki/Truncated_trihexagonal_tiling


Tiling.truncatedTriHexagonalTiling = function ({size}={}) {

	var tils = [];

    tils.push(dodecagon(0, 0, 0));
    tils.push(squareTile(0, 0, 0, 1));
    tils.push(hexagonTile(0, 0, 0, 2));
    tils.push(squareTile(0, 0, 0, 3));
    tils.push(hexagonTile(0, 0, 0, 4));
    tils.push(squareTile(0, 0, 0, 5));
    tils.push(hexagonTile(0, 0, 0, 6));
    tils.push(squareTile(0, 0, 0, 7));
    tils.push(hexagonTile(0, 0, 0, 8));
    tils.push(squareTile(0, 0, 0, 9));
    tils.push(hexagonTile(0, 0, 0, 10));
    tils.push(squareTile(0, 0, 0, 11));
    tils.push(hexagonTile(0, 0, 0, 12));

	for (var radius = 1; radius <= size; radius++) {
        for (var x = -radius; x <= radius; x++) {
            for (var y = -radius; y <= radius; y++) {
                for (var z = -radius; z <= radius; z++) {
                    if (x + y + z == 0) {
                        // Right side
                        if (x == radius) {
                            // Upper right corner
                            if (z == -radius){
                                tils = tils.concat(upRightCorner(x, y, z));
                            }

                            // Lower right corner
                            else if (y == -radius){
                                tils = tils.concat(downRightCorner(x, y, z));
                            }

                            else{
                                tils = tils.concat(rightSide(x, y, z));
                            }
                        }
                        
                        // Left side
                        else if (x == -radius) {

                            // Upper left corner
                            if (y == radius){
                                tils = tils.concat(upLeftCorner(x, y, z));
                            }

                            // Lower left corner
                            else if (z == radius){
                                tils = tils.concat(downLeftCorner(x, y, z));
                            }
                            
                            else{
                                tils = tils.concat(leftSide(x, y, z));
                            }
                        }
                        
                        // Upper left side
                        else if (y == radius){

                            // Upper corner
                            if (z == -radius){
                                tils = tils.concat(upCorner(x, y, z));
                            }
                            
                            else{
                                tils = tils.concat(upLeftSide(x, y, z));
                            }
                        }
                        
                        // Lower right side
                        else if (y == -radius) {

                            // Lower corner
                            if (z == radius){
                                tils = tils.concat(downCorner(x, y, z));
                            }
                            
                            else{
                                tils = tils.concat(downRightSide(x, y, z));
                            }
                        }
                        
                        // Lower left side
                        else if (z == radius) {
                            tils = tils.concat(downLeftSide(x, y, z))
                        }

                        // Upper right side
                        else if (z == -radius) {
                            tils = tils.concat(upRightSide(x, y, z))
                        }
                        //tils.push(dodecagon(x, y, z));
                    }
                }
            }
        }
    }
	console.log(new Tiling(tils));
	return new Tiling(tils);
}

// Corners

function upCorner(x, y, z){
    tils = [];
    tils.push(dodecagon(x, y, z));
    tils.push(squareTile(x, y, z, 1));
    tils.push(hexagonTile(x, y, z, 2));
    tils.push(squareTile(x, y, z, 3));
    tils.push(squareTile(x, y, z, 9));
    tils.push(hexagonTile(x, y, z, 10));
    tils.push(squareTile(x, y, z, 11));
    tils.push(hexagonTile(x, y, z, 12));
    return tils;
}

function upRightCorner(x, y, z){
    tils = [];
    tils.push(dodecagon(x, y, z));
    tils.push(squareTile(x, y, z, 1));
    tils.push(hexagonTile(x, y, z, 2));
    tils.push(squareTile(x, y, z, 3));
    tils.push(hexagonTile(x, y, z, 4));
    tils.push(squareTile(x, y, z, 5));
    tils.push(squareTile(x, y, z, 11));
    tils.push(hexagonTile(x, y, z, 12));
    return tils;
}

function downRightCorner(x, y, z){
    tils = [];
    tils.push(dodecagon(x, y, z));
    tils.push(squareTile(x, y, z, 1));
    tils.push(hexagonTile(x, y, z, 2));
    tils.push(squareTile(x, y, z, 3));
    tils.push(hexagonTile(x, y, z, 4));
    tils.push(squareTile(x, y, z, 5));
    tils.push(hexagonTile(x, y, z, 6));
    tils.push(squareTile(x, y, z, 7));
    return tils;
}

function downCorner(x, y, z){
    tils = [];
    tils.push(dodecagon(x, y, z));
    tils.push(squareTile(x, y, z, 3));
    tils.push(hexagonTile(x, y, z, 4));
    tils.push(squareTile(x, y, z, 5));
    tils.push(hexagonTile(x, y, z, 6));
    tils.push(squareTile(x, y, z, 7));
    tils.push(hexagonTile(x, y, z, 8));
    tils.push(squareTile(x, y, z, 9));
    return tils;
}

function downLeftCorner(x, y, z){
    tils = [];
    tils.push(dodecagon(x, y, z));
    tils.push(squareTile(x, y, z, 5));
    tils.push(hexagonTile(x, y, z, 6));
    tils.push(squareTile(x, y, z, 7));
    tils.push(hexagonTile(x, y, z, 8));
    tils.push(squareTile(x, y, z, 9));
    tils.push(hexagonTile(x, y, z, 10));
    tils.push(squareTile(x, y, z, 11));
    return tils;
}

function upLeftCorner(x, y, z){
    tils = [];
    tils.push(dodecagon(x, y, z));
    tils.push(squareTile(x, y, z, 1));
    tils.push(squareTile(x, y, z, 7));
    tils.push(hexagonTile(x, y, z, 8));
    tils.push(squareTile(x, y, z, 9));
    tils.push(hexagonTile(x, y, z, 10));
    tils.push(squareTile(x, y, z, 11));
    tils.push(hexagonTile(x, y, z, 12));
    return tils;
}

// Sides

function upRightSide(x, y, z){
    tils = [];
    tils.push(dodecagon(x, y, z));
    tils.push(squareTile(x, y, z, 1));
    tils.push(hexagonTile(x, y, z, 2));
    tils.push(squareTile(x, y, z, 3));
    tils.push(squareTile(x, y, z, 11));
    tils.push(hexagonTile(x, y, z, 12));
    return tils;
}

function rightSide(x, y, z){
    tils = [];
    tils.push(dodecagon(x, y, z));
    tils.push(squareTile(x, y, z, 1));
    tils.push(hexagonTile(x, y, z, 2));
    tils.push(squareTile(x, y, z, 3));
    tils.push(hexagonTile(x, y, z, 4));
    tils.push(squareTile(x, y, z, 5));
    return tils;
}

function downRightSide(x, y, z){
    tils = [];
    tils.push(dodecagon(x, y, z));
    tils.push(squareTile(x, y, z, 3));
    tils.push(hexagonTile(x, y, z, 4));
    tils.push(squareTile(x, y, z, 5));
    tils.push(hexagonTile(x, y, z, 6));
    tils.push(squareTile(x, y, z, 7));
    return tils;
}

function downLeftSide(x, y, z){
    tils = [];
    tils.push(dodecagon(x, y, z));
    tils.push(squareTile(x, y, z, 5));
    tils.push(hexagonTile(x, y, z, 6));
    tils.push(squareTile(x, y, z, 7));
    tils.push(hexagonTile(x, y, z, 8));
    tils.push(squareTile(x, y, z, 9));
    return tils;
}

function leftSide(x, y, z){
    tils = [];
    tils.push(dodecagon(x, y, z));
    tils.push(squareTile(x, y, z, 7));
    tils.push(hexagonTile(x, y, z, 8));
    tils.push(squareTile(x, y, z, 9));
    tils.push(hexagonTile(x, y, z, 10));
    tils.push(squareTile(x, y, z, 11));
    return tils;
}

function upLeftSide(x, y, z){
    tils = [];
    tils.push(dodecagon(x, y, z));
    tils.push(squareTile(x, y, z, 1));
    tils.push(squareTile(x, y, z, 9));
    tils.push(hexagonTile(x, y, z, 10));
    tils.push(squareTile(x, y, z, 11));
    tils.push(hexagonTile(x, y, z, 12));
    return tils;
}

// Cells

function dodecagon(x, y, z){
	var id = [x, y, z, 0];
	
	var neighbors =  [];

    let dodecagonApothem = 1 + Math.sqrt(3) / 2;
    let hexagonApothem = Math.sqrt(3) / 2;
    let squareApothem = 1 / 2;

    let circumradius = (Math.sqrt(6) + Math.sqrt(2)) / 2;
    sq2 = Math.sqrt(2) / 2;

    let deltaX = dodecagonApothem + 2 * hexagonApothem + squareApothem;
    let deltaY = dodecagonApothem + squareApothem;

	var bounds = [];

	bounds.push(deltaX * x + dodecagonApothem, 		deltaY * (y - z) + squareApothem);          
    bounds.push(deltaX * x + dodecagonApothem, 		deltaY * (y - z) - squareApothem);
    bounds.push(deltaX * x + circumradius * sq2, 	deltaY * (y - z) - circumradius * sq2);
    bounds.push(deltaX * x + squareApothem, 		deltaY * (y - z) - dodecagonApothem);
    bounds.push(deltaX * x - squareApothem, 		deltaY * (y - z) - dodecagonApothem);
    bounds.push(deltaX * x - circumradius * sq2, 	deltaY * (y - z) - circumradius * sq2);
    bounds.push(deltaX * x - dodecagonApothem, 		deltaY * (y - z) - squareApothem);
    bounds.push(deltaX * x - dodecagonApothem, 		deltaY * (y - z) + squareApothem);
    bounds.push(deltaX * x - circumradius * sq2, 	deltaY * (y - z) + circumradius * sq2);
    bounds.push(deltaX * x - squareApothem, 		deltaY * (y - z) + dodecagonApothem);
    bounds.push(deltaX * x + squareApothem, 		deltaY * (y - z) + dodecagonApothem);
    bounds.push(deltaX * x + circumradius * sq2, 	deltaY * (y - z) + circumradius * sq2);

    neighbors.push([x, y, z, 1]);
    neighbors.push([x, y, z, 2]);
    neighbors.push([x, y, z, 3]);
    neighbors.push([x, y, z, 4]);
    neighbors.push([x, y, z, 5]);
    neighbors.push([x, y+1, z-1, 2]);
    neighbors.push([x, y+1, z-1, 1]);
    neighbors.push([x+1, y, z-1, 2]);
    neighbors.push([x+1, y, z-1, 3]);
    neighbors.push([x+1, y, z-1, 4]);
    neighbors.push([x+1, y-1, z, 5]);
    neighbors.push([x+1, y-1, z, 4]);

	return new Tile(id, neighbors, bounds, 12);
}

function squareTile(x, y, z, index){
    
    var id = [x, y, z, index]
    
    let dodecagonApothem = 1 + Math.sqrt(3) / 2;
    let hexagonApothem = Math.sqrt(3) / 2;
    let squareApothem = 1 / 2;

    let circumradius = (Math.sqrt(6) + Math.sqrt(2)) / 2;
    sq2 = Math.sqrt(2) / 2;

    let deltaX = dodecagonApothem + 2 * hexagonApothem + squareApothem;
    let deltaY = dodecagonApothem + squareApothem;

    var bounds = [];
    var neighbors = [];
    
    if (index == 1) {
        var id = [x, y+1, z-1, 1];
        bounds.push(deltaX * x + squareApothem, 		    deltaY * (y - z) + dodecagonApothem);
        bounds.push(deltaX * x - squareApothem, 		    deltaY * (y - z) + dodecagonApothem);
        bounds.push(deltaX * x - squareApothem, 		    deltaY * ((y + 1) - (z - 1)) - dodecagonApothem);
        bounds.push(deltaX * x + squareApothem, 		    deltaY * ((y + 1) - (z - 1)) - dodecagonApothem);

        neighbors.push([x, y, z, 0]);
        neighbors.push([x, y+1, z-1, 0]);
        neighbors.push([x, y+1, z-1, 2]);
        neighbors.push([x+1, y, z-1, 4]);
    }
    if (index == 3) {
        var id = [x+1, y, z-1, 3];
        bounds.push(deltaX * x + dodecagonApothem, 		    deltaY * (y - z) + squareApothem);
        bounds.push(deltaX * x + circumradius * sq2, 	    deltaY * (y - z) + circumradius * sq2);
        bounds.push(deltaX * (x + 1) - dodecagonApothem,    deltaY * (y - (z - 1)) - squareApothem);
        bounds.push(deltaX * (x + 1) - circumradius * sq2, 	deltaY * (y - (z - 1)) - circumradius * sq2);

        neighbors.push([x, y, z, 0]);
        neighbors.push([x+1, y, z-1, 0]);
        neighbors.push([x+1, y, z-1, 2]);
        neighbors.push([x+1, y, z-1, 4]);
    }
    if (index == 5) {
        var id = [x+1, y-1, z, 5];
        bounds.push(deltaX * x + circumradius * sq2, 	    deltaY * (y - z) - circumradius * sq2);
        bounds.push(deltaX * (x + 1) - dodecagonApothem,    deltaY * (y - 1 - z) + squareApothem);
        bounds.push(deltaX * (x + 1) - circumradius * sq2, 	deltaY * (y - 1 - z) + circumradius * sq2);
        bounds.push(deltaX * x + dodecagonApothem, 		    deltaY * (y - z) - squareApothem);

        neighbors.push([x, y, z, 0]);
        neighbors.push([x+1, y-1, z, 0]);
        neighbors.push([x+1, y-1, z, 4]);
        neighbors.push([x+1, y, z-1, 2]);
    }
    if (index == 7) {
        var id = [x, y, z, 1];
        bounds.push(deltaX * x - squareApothem, 		    deltaY * (y - z) - dodecagonApothem);
        bounds.push(deltaX * x + squareApothem, 		    deltaY * (y - z) - dodecagonApothem);
        bounds.push(deltaX * x + squareApothem, 		    deltaY * ((y - 1) - (z + 1)) + dodecagonApothem);
        bounds.push(deltaX * x - squareApothem, 		    deltaY * ((y - 1) - (z + 1)) + dodecagonApothem);

        neighbors.push([x, y, z, 0]);
        neighbors.push([x, y, z, 2]);
        neighbors.push([x+1, y-1, z, 4]);
        neighbors.push([x, y-1, z+1, 0]);
    }
    if (index == 9) {
        var id = [x, y, z, 3];
        bounds.push(deltaX * (x - 1) + dodecagonApothem, 	deltaY * (y - (z + 1)) + squareApothem);
        bounds.push(deltaX * (x - 1) + circumradius * sq2, 	deltaY * (y - (z + 1)) + circumradius * sq2);
        bounds.push(deltaX * x - dodecagonApothem, 		    deltaY * (y - z) - squareApothem);
        bounds.push(deltaX * x - circumradius * sq2, 	    deltaY * (y - z) - circumradius * sq2);

        neighbors.push([x, y, z, 0]);
        neighbors.push([x, y, z, 2]);
        neighbors.push([x, y, z, 4]);
        neighbors.push([x-1, y, z+1, 0]);
    }
    if (index == 11) {
        var id = [x, y, z, 5];
        bounds.push(deltaX * x - dodecagonApothem, 		    deltaY * (y - z) + squareApothem);
        bounds.push(deltaX * (x - 1) + circumradius * sq2, 	deltaY * (y + 1 - z) - circumradius * sq2);
        bounds.push(deltaX * (x - 1) + dodecagonApothem,    deltaY * (y + 1 - z) - squareApothem);
        bounds.push(deltaX * x - circumradius * sq2, 	    deltaY * (y - z) + circumradius * sq2);

        neighbors.push([x, y, z, 0]);
        neighbors.push([x, y, z, 4]);
        neighbors.push([x-1, y+1, z, 0]);
        neighbors.push([x, y+1, z-1, 2]);
    }

    return new Tile(id, neighbors, bounds, 4);
}

function hexagonTile(x, y, z, index){
    
    let dodecagonApothem = 1 + Math.sqrt(3) / 2;
    let hexagonApothem = Math.sqrt(3) / 2;
    let squareApothem = 1 / 2;

    let circumradius = (Math.sqrt(6) + Math.sqrt(2)) / 2;
    sq2 = Math.sqrt(2) / 2;

    let deltaX = dodecagonApothem + 2 * hexagonApothem + squareApothem;
    let deltaY = dodecagonApothem + squareApothem;

    var bounds = [];
    var neighbors = [];
    
    if (index == 2) {
        var id = [x+1, y, z-1, 4]
        bounds.push(deltaX * x + circumradius * sq2, 	    deltaY * (y - z) + circumradius * sq2);
        bounds.push(deltaX * x + squareApothem, 		    deltaY * (y - z) + dodecagonApothem);
        bounds.push(deltaX * x + squareApothem,             deltaY * (y + 1 - (z - 1)) - dodecagonApothem);
        bounds.push(deltaX * x + circumradius * sq2, 	    deltaY * (y + 1 - (z - 1)) - circumradius * sq2);
        bounds.push(deltaX * (x + 1) - dodecagonApothem, 	deltaY * (y - (z - 1)) + squareApothem);
        bounds.push(deltaX * (x + 1) - dodecagonApothem, 	deltaY * (y - (z - 1)) - squareApothem);
        
        neighbors.push([x+1, y, z-1, 0]);
        neighbors.push([x+1, y, z-1, 3]);
        neighbors.push([x+1, y, z-1, 5]);
        neighbors.push([x, y+1, z-1, 0]);
        neighbors.push([x, y+1, z-1, 1]);
        neighbors.push([x, y, z, 0]);
    }
    if (index == 4) {
        var id = [x+1, y, z-1, 2]
        bounds.push(deltaX * x + dodecagonApothem, 		    deltaY * (y - z) - squareApothem);
        bounds.push(deltaX * x + dodecagonApothem, 		    deltaY * (y - z) + squareApothem);
        bounds.push(deltaX * (x + 1) - circumradius * sq2, 	deltaY * (y - (z - 1)) - circumradius * sq2);
        bounds.push(deltaX * (x + 1) - squareApothem, 		deltaY * (y - (z - 1)) - dodecagonApothem);
        bounds.push(deltaX * (x + 1) - squareApothem, 		deltaY * ((y - 1) - z) + dodecagonApothem);
        bounds.push(deltaX * (x + 1) - circumradius * sq2, 	deltaY * ((y - 1) - z) + circumradius * sq2);

        neighbors.push([x+1, y, z-1, 0]);
        neighbors.push([x+1, y, z-1, 1]);
        neighbors.push([x+1, y, z-1, 3]);
        neighbors.push([x, y, z, 0]);
        neighbors.push([x+1, y-1, z, 5]);
        neighbors.push([x+1, y-1, z, 0]);
    }
    if (index == 6) {
        var id = [x+1, y-1, z, 4]
        bounds.push(deltaX * x + squareApothem, 		    deltaY * (y - z) - dodecagonApothem);
        bounds.push(deltaX * x + circumradius * sq2, 	    deltaY * (y - z) - circumradius * sq2);
        bounds.push(deltaX * (x + 1) - dodecagonApothem, 	deltaY * ((y - 1) - z) + squareApothem);
        bounds.push(deltaX * (x + 1) - dodecagonApothem, 	deltaY * ((y - 1) - z) - squareApothem);
        bounds.push(deltaX * x + circumradius * sq2, 	    deltaY * ((y - 1) - (z + 1)) + circumradius * sq2);
        bounds.push(deltaX * x + squareApothem, 		    deltaY * ((y - 1) - (z + 1)) + dodecagonApothem);
        
        neighbors.push([x+1, y-1, z, 0]);
        neighbors.push([x+1, y-1, z, 3]);
        neighbors.push([x+1, y-1, z, 5]);
        neighbors.push([x, y, z, 0]);
        neighbors.push([x, y, z, 1]);
        neighbors.push([x, y-1, z+1, 0]);
    }
    if (index == 8) {
        var id = [x, y, z, 2]
        bounds.push(deltaX * x - circumradius * sq2, 	    deltaY * (y - z) - circumradius * sq2);
        bounds.push(deltaX * x - squareApothem, 		    deltaY * (y - z) - dodecagonApothem);
        bounds.push(deltaX * x - squareApothem, 		    deltaY * ((y - 1) - (z + 1)) + dodecagonApothem);
        bounds.push(deltaX * x - circumradius * sq2, 	    deltaY * ((y - 1) - (z + 1)) + circumradius * sq2);
        bounds.push(deltaX * (x - 1) + dodecagonApothem, 	deltaY * (y - (z + 1)) - squareApothem);
        bounds.push(deltaX * (x - 1) + dodecagonApothem,    deltaY * (y - (z + 1)) + squareApothem);

        neighbors.push([x, y, z, 0]);
        neighbors.push([x, y, z, 1]);
        neighbors.push([x, y, z, 3]);
        neighbors.push([x, y-1, z+1, 0]);
        neighbors.push([x, y-1, z+1, 5]);
        neighbors.push([x-1, y, z+1, 0]);
    }
    if (index == 10) {
        var id = [x, y, z, 4]
        bounds.push(deltaX * x - dodecagonApothem, 		    deltaY * (y - z) + squareApothem);
        bounds.push(deltaX * x - dodecagonApothem, 		    deltaY * (y - z) - squareApothem);
        bounds.push(deltaX * (x - 1) + circumradius * sq2, 	deltaY * (y - (z + 1)) + circumradius * sq2);
        bounds.push(deltaX * (x - 1) + squareApothem, 		deltaY * (y - (z + 1)) + dodecagonApothem);
        bounds.push(deltaX * (x - 1) + squareApothem, 		deltaY * ((y + 1) - z) - dodecagonApothem);
        bounds.push(deltaX * (x - 1) + circumradius * sq2, 	deltaY * ((y + 1) - z) - circumradius * sq2);
        
        neighbors.push([x, y, z, 0]);
        neighbors.push([x, y, z, 3]);
        neighbors.push([x, y, z, 5]);
        neighbors.push([x-1, y+1, z, 0]);
        neighbors.push([x-1, y+1, z, 1]);
        neighbors.push([x-1, y, z+1, 0]);
    }
    if (index == 12) {
        var id = [x, y+1, z-1, 2]
        bounds.push(deltaX * x - squareApothem, 		    deltaY * (y - z) + dodecagonApothem);
        bounds.push(deltaX * x - circumradius * sq2, 	    deltaY * (y - z) + circumradius * sq2);
        bounds.push(deltaX * (x - 1) + dodecagonApothem, 	deltaY * ((y + 1) - z) - squareApothem);
        bounds.push(deltaX * (x - 1) + dodecagonApothem, 	deltaY * ((y + 1) - z) + squareApothem);
        bounds.push(deltaX * x - circumradius * sq2, 	    deltaY * ((y + 1) - (z - 1)) - circumradius * sq2);      
        bounds.push(deltaX * x - squareApothem, 		    deltaY * ((y + 1) - (z - 1)) - dodecagonApothem);

        neighbors.push([x, y+1, z-1, 0]);
        neighbors.push([x, y+1, z-1, 1]);
        neighbors.push([x, y+1, z-1, 3]);
        neighbors.push([x, y, z, 0]);
        neighbors.push([x, y, z, 5]);
        neighbors.push([x-1, y+1, z, 0]);
    }

    return new Tile(id, neighbors, bounds, 6);
}