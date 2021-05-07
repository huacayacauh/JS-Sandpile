Tiling.triTiling = function({size,trou}={}) {
	var tiles = [];
	for (var y = 0; y < size - 1; y++){
		for (var x = 0; x < size - y - 1; x++) {
			var delet_this = Math.random();
			if (delet_this > trou/100)
				tiles.push(Tile.triTilingUpTriangle(x, y, size));
			delet_this = Math.random();
			if (delet_this > trou/100)
				tiles.push(Tile.triTilingDownTriangle(x, y, size));
		}
	}
	for (var y = 0; y < size; y++){
		var delet_this = Math.random();
		if (delet_this > trou/100)
			tiles.push(Tile.triTilingUpTriangle(size - y - 1, y, size));
		}
	return new Tiling(tiles);
};

Tile.triTilingUpTriangle = function(x, y, size) {
	var id = [x, y, "up"];
	var neighbors = [];
	neighbors.push([x, y, "down"]);
	neighbors.push([x-1, y, "down"]);
	neighbors.push([x, y-1, "down"]);
	var sq3 = Math.sqrt(3);
	var bounds = [];
	bounds.push(x + (y-size)/2, y*(sq3/2) - size*(sq3/6));
	bounds.push(x + (y-size)/2 + 1, y*(sq3/2) - size*(sq3/6));
	bounds.push(x + (y-size)/2 + 0.5, (y+1)*(sq3/2) - size*(sq3/6));
	return new Tile(id, neighbors, bounds, 3);
};

Tile.triTilingDownTriangle = function(x, y, size) {
	var id = [x, y, "down"];
	var neighbors = [];
	neighbors.push([x, y, "up"]);
	neighbors.push([x+1, y, "up"]);
	neighbors.push([x, y+1, "up"]);
	var sq3 = Math.sqrt(3);
	var bounds = [];
	bounds.push(x + (y-size)/2 + 0.5, (y+1)*(sq3/2) - size*(sq3/6));
	bounds.push(x + (y-size)/2 + 1.5, (y+1)*(sq3/2) - size*(sq3/6));
	bounds.push(x + (y-size)/2 + 1, y*(sq3/2) - size*(sq3/6));
	return new Tile(id, neighbors, bounds, 3);
};
