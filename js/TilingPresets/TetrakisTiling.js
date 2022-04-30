Tiling.tetrakisTiling = function({width, height}={}){
	// Creates a Tiling corresponding to a tetrakis Tiling of dimensions (width, height), based on a square tiling 
	var tils = [];

	for(var j = 0; j < width; j++){
		for(var i = 0; i < height; i++){
			for(var index = 0; index < 4; index++){
				tils.push(Tile.tetrakisTile(j, i, width, height, index));
				console.log(Tile.tetrakisTile(j, i, width, height, index));
			}
		}	
	}
	
	return new Tiling(tils);
}

Tile.tetrakisTile = function(x, y, width, height, index){
	// Creates the Tile in position x, y of a tetrakis Tiling.
	// Index represents the position of the triangle in a square : 0 up, 1 right, 2 bottom, 3 left

	var id = [x, y, index];
	
	
	/*if(x > 0) neighbors.push([x-1, y]);
	if(x < xMax-1) neighbors.push([x+1, y]);
	if(y > 0) neighbors.push([x, y-1]);
	if(y < yMax-1) neighbors.push([x, y+1]);*/

	// x and y offset are there to point the neighboor out of the square
	
	var bounds = [];

	bounds.push(x + 1/2 - width / 2, y + 1/2 - height / 2)

	if (index == 0){
		bounds.push(x+1 - width/2, y+1 - height/2);
		bounds.push(x - width/2, y+1 - height/2);
		xOffset = 0;
		yOffset = 1;
	}
	else if (index == 1){
		bounds.push(x+1 - width/2, y - height/2);
		bounds.push(x+1 - width/2, y+1 - height/2);
		xOffset = 1;
		yOffset = 0;
	}
	else if (index == 2){
		bounds.push(x - width/2, y - height/2);
		bounds.push(x+1 - width/2, y - height/2);
		xOffset = 0;
		yOffset = -1;
	}
	else if (index == 3){
		bounds.push(x - width/2, y - height/2);
		bounds.push(x - width/2, y+1 - height/2);
		xOffset = -1;
		yOffset = 0;
	}

	var neighbors = [];
	
	neighbors.push([x + xOffset, y + yOffset, (index + 2) % 4]);
	neighbors.push([x, y, (index + 1) % 4]);
	neighbors.push([x, y, (index + 3) % 4]);

	return new Tile(id, neighbors, bounds, 3);
}
