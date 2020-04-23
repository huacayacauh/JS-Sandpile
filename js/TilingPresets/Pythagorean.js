Tiling.pythagorean = function({width, height}={}){

	var tils = [];

	for(var j = 0; j < width; j++){
		for(var i = 0; i < height; i++){
			tils.push(Tile.pythBig(j, i));
			if(j<width-1 && i<height-1)
				tils.push(Tile.pythSmall(j, i));
		}	
	}

	return new Tiling(tils, false, true);
}

Tile.pythBig = function(x, y){

	var id = ["b", x, y];
	
	var neighbors = [];
	
	neighbors.push(["b", x-1, y]);
	neighbors.push(["b", x+1, y]);
	neighbors.push(["b", x, y-1]);
	neighbors.push(["b", x, y+1]);
	
	neighbors.push(["s", x, y]);
	neighbors.push(["s", x-1, y]);
	neighbors.push(["s", x, y-1]);
	neighbors.push(["s", x-1, y-1]);
	
	var bounds = [];
	var x_new = x - 0.5*y;
	var y_new = y + 0.5*x;
	bounds.push(x_new, y_new);
	bounds.push(x_new+1, y_new);
	bounds.push(x_new+1, y_new+1);
	bounds.push(x_new, y_new+1);
				
	return new Tile(id, neighbors, bounds, 8);
}
Tile.pythSmall = function(x, y){

	var id = ["s", x, y];
	
	var neighbors = [];
	
	neighbors.push(["b", x, y]);
	neighbors.push(["b", x+1, y]);
	neighbors.push(["b", x, y+1]);
	neighbors.push(["b", x+1, y+1]);
	
	var bounds = [];
	var x_new = x - 0.5*y + 0.5;
	var y_new = y + 0.5*x + 1;
	bounds.push(x_new, y_new);
	bounds.push(x_new+0.5, y_new);
	bounds.push(x_new+0.5, y_new+0.5);
	bounds.push(x_new, y_new+0.5);
	
	let tile = new Tile(id, neighbors, bounds, 4);
	tile.sand = 1;
	return tile;
}