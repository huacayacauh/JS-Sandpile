Tiling.uniformTriHexagonalTiling = function ({size}={}) {

	var tils = [];
	
	for(var x=-size; x<=size; x++){
		for(var y=-size; y<=size - Math.abs(x % 2); y++){
			for(var z=0; z<=5; z++){
				if(z == 0){
					tils.push(dodecagon(x, y));
				}
				else if(z % 2 == 0){
					tils.push(hexagon(x, y, z));
				}
				else if(z % 2 == 1){
					tils.push(adsquare(x, y, z));
				}
			}
		}
	}
	console.log(new Tiling(tils));
	return new Tiling(tils);
}

function dodecagon(x, y){
	var id = [x, y, 0];
	
	var neighbors =  [];

	neighbors.push([x,    y,   1]);
	neighbors.push([x,    y,   2]);
	neighbors.push([x,    y,   3]);
	neighbors.push([x,    y,   4]);
	neighbors.push([x,    y,   5]);
	neighbors.push([x,    y+1, 1]);
	neighbors.push([x,    y+1, 2]);
	neighbors.push([x+1,  y + Math.abs(x % 2),   2]);
	neighbors.push([x+1,  y + Math.abs(x % 2),   3]);
	neighbors.push([x+1,  y + Math.abs(x % 2),   4]);
	neighbors.push([x+1,  y-1 + Math.abs(x % 2), 5]);
	neighbors.push([x+1,  y-1 + Math.abs(x % 2), 4]);



    let dodecagonApothem = 1 + Math.sqrt(3) / 2;
    let hexagonApothem = Math.sqrt(3) / 2;
    let squareApothem = 1 / 2;

    let circumradius = (Math.sqrt(6) + Math.sqrt(2)) / 2;
    sq2 = Math.sqrt(2) / 2;

    let deltaX = dodecagonApothem + 2 * hexagonApothem + squareApothem;
    let deltaY = 2 * dodecagonApothem + 2 * squareApothem;

	var bounds = [];
	bounds.push(deltaX * x + dodecagonApothem, deltaY * (y + Math.abs(x % 2) / 2) + squareApothem);
    bounds.push(deltaX * x + dodecagonApothem, deltaY * (y + Math.abs(x % 2) / 2) - squareApothem);
    bounds.push(deltaX * x + circumradius * sq2, deltaY * (y + Math.abs(x % 2) / 2) - circumradius * sq2);
    bounds.push(deltaX * x + squareApothem, deltaY * (y + Math.abs(x % 2) / 2) - dodecagonApothem);
    bounds.push(deltaX * x - squareApothem, deltaY * (y + Math.abs(x % 2) / 2) - dodecagonApothem);
    bounds.push(deltaX * x - circumradius * sq2, deltaY * (y + Math.abs(x % 2) / 2) - circumradius * sq2);
    bounds.push(deltaX * x - dodecagonApothem, deltaY * (y + Math.abs(x % 2) / 2) - squareApothem);
    bounds.push(deltaX * x - dodecagonApothem, deltaY * (y + Math.abs(x % 2) / 2) + squareApothem);
    bounds.push(deltaX * x - circumradius * sq2, deltaY * (y + Math.abs(x % 2) / 2) + circumradius * sq2);
    bounds.push(deltaX * x - squareApothem, deltaY * (y + Math.abs(x % 2) / 2) + dodecagonApothem);
    bounds.push(deltaX * x + squareApothem, deltaY * (y + Math.abs(x % 2) / 2) + dodecagonApothem);
    bounds.push(deltaX * x + circumradius * sq2, deltaY * (y + Math.abs(x % 2) / 2) + circumradius * sq2);



	return new Tile(id, neighbors, bounds, 12);
}

function hexagon(x, y, z){
	var id = [x, y, z];
	
	var neighbors =  [];
	
	if (z == 2){
		neighbors.push([x,    y,   0]);
		neighbors.push([x,    y,   1]);
		neighbors.push([x,    y,   3]);
		neighbors.push([x-1,  y - Math.abs((x+1) % 2),   0]);
		neighbors.push([x,    y-1, 5]);
		neighbors.push([x,    y-1, 0]);
	}
	
	if (z == 4){
		neighbors.push([x,    y,   0]);
		neighbors.push([x,    y,   3]);
		neighbors.push([x,    y,   5]);
		neighbors.push([x-1,  y - Math.abs((x+1) % 2),   0]);
		neighbors.push([x-1,  y + Math.abs(x % 2), 1]);
		neighbors.push([x-1,  y + Math.abs(x % 2), 0]);
	}

    let dodecagonApothem = 1 + Math.sqrt(3) / 2;
    let hexagonApothem = Math.sqrt(3) / 2;
    let squareApothem = 1 / 2;

    let circumradius = (Math.sqrt(6) + Math.sqrt(2)) / 2;
    sq2 = Math.sqrt(2) / 2;

	let deltaX = dodecagonApothem + 2 * hexagonApothem + squareApothem;
    let deltaY = 2 * dodecagonApothem + 2 * squareApothem;

	var bounds = [];

	if (z == 2){
    	bounds.push(deltaX * x - circumradius * sq2, deltaY * (y + Math.abs(x % 2) / 2) - circumradius * sq2);
		bounds.push(deltaX * x - squareApothem, deltaY * (y + Math.abs(x % 2) / 2) - dodecagonApothem);
		bounds.push(deltaX * x - squareApothem, deltaY * (y - 1 + Math.abs(x % 2) / 2) + dodecagonApothem);
		bounds.push(deltaX * x - circumradius * sq2, deltaY * (y - 1 + Math.abs(x % 2) / 2) + circumradius * sq2);
		bounds.push(deltaX * (x - 1) + dodecagonApothem, deltaY * (y - Math.abs((x - 1) % 2) / 2) - squareApothem);
		bounds.push(deltaX * (x - 1) + dodecagonApothem, deltaY * (y - Math.abs((x - 1) % 2) / 2) + squareApothem);
	}

	else if (z == 4){
		bounds.push(deltaX * x - dodecagonApothem, deltaY * (y + Math.abs(x % 2) / 2) + squareApothem);
		bounds.push(deltaX * x - dodecagonApothem, deltaY * (y + Math.abs(x % 2) / 2) - squareApothem);
		bounds.push(deltaX * (x - 1) + circumradius * sq2, deltaY * (y - Math.abs((x - 1) % 2) / 2) + circumradius * sq2);
		bounds.push(deltaX * (x - 1) + squareApothem, deltaY * (y - Math.abs((x - 1) % 2) / 2) + dodecagonApothem);
		bounds.push(deltaX * (x - 1) + squareApothem, deltaY * (y + 1 - Math.abs((x - 1) % 2) / 2) - dodecagonApothem);
		bounds.push(deltaX * (x - 1) + circumradius * sq2, deltaY * (y + 1 - Math.abs((x - 1) % 2) / 2) - circumradius * sq2);
	}

	return new Tile(id, neighbors, bounds, 6);
}

function adsquare(x, y, z){
	var id = [x, y, z];
	
	var neighbors =  [];
	
	if (z == 1){
		neighbors.push([x,    y,   0]);
		neighbors.push([x,    y,   2]);
		neighbors.push([x,    y-1, 0]);
		neighbors.push([x+1,  y - Math.abs((x+1) % 2), 4]);
	}
	
	if (z == 3){
		neighbors.push([x,    y,   0]);
		neighbors.push([x,    y,   2]);
		neighbors.push([x,    y,   4]);
		neighbors.push([x-1,  y - Math.abs((x+1) % 2),   0]);
	}
	
	if (z == 5){
		neighbors.push([x,    y,   0]);
		neighbors.push([x,    y,   4]);
		neighbors.push([x-1,  y + Math.abs(x % 2),   0]);
		neighbors.push([x,    y + 1,   2]);
	}

    let dodecagonApothem = 1 + Math.sqrt(3) / 2;
    let hexagonApothem = Math.sqrt(3) / 2;
    let squareApothem = 1 / 2;

    let circumradius = (Math.sqrt(6) + Math.sqrt(2)) / 2;
    sq2 = Math.sqrt(2) / 2;

	let deltaX = dodecagonApothem + 2 * hexagonApothem + squareApothem;
    let deltaY = 2 * dodecagonApothem + 2 * squareApothem;

	var bounds = [];

	if (z == 1){
		bounds.push(deltaX * x - squareApothem, deltaY * (y + Math.abs(x % 2) / 2) - dodecagonApothem);
		bounds.push(deltaX * x + squareApothem, deltaY * (y + Math.abs(x % 2) / 2) - dodecagonApothem);
		bounds.push(deltaX * x + squareApothem, deltaY * (y - 1 + Math.abs(x % 2) / 2) + dodecagonApothem);
		bounds.push(deltaX * x - squareApothem, deltaY * (y - 1 + Math.abs(x % 2) / 2) + dodecagonApothem);
	}

	else if (z == 3){
		bounds.push(deltaX * x - dodecagonApothem, deltaY * (y + Math.abs(x % 2) / 2) - squareApothem);
		bounds.push(deltaX * x - circumradius * sq2, deltaY * (y + Math.abs(x % 2) / 2) - circumradius * sq2);
		bounds.push(deltaX * (x - 1) + dodecagonApothem, deltaY * (y - Math.abs((x - 1) % 2) / 2) + squareApothem);
		bounds.push(deltaX * (x - 1) + circumradius * sq2, deltaY * (y - Math.abs((x - 1) % 2) / 2) + circumradius * sq2);
	}
	else if (z == 5){
		bounds.push(deltaX * x - circumradius * sq2, deltaY * (y + Math.abs(x % 2) / 2) + circumradius * sq2);
		bounds.push(deltaX * x - dodecagonApothem, deltaY * (y + Math.abs(x % 2) / 2) + squareApothem);
		bounds.push(deltaX * (x - 1) + circumradius * sq2, deltaY * (y + 1 - Math.abs((x - 1) % 2) / 2) - circumradius * sq2);
		bounds.push(deltaX * (x - 1) + dodecagonApothem, deltaY * (y + 1 - Math.abs((x - 1) % 2) / 2) - squareApothem);
	}

	return new Tile(id, neighbors, bounds, 4);
}



