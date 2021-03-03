Tiling.tetrakisSquareTiling = function({width, height}={}) {
	var tiles = [];
	for (var i = 0; i < width; i++) {
		for (var j = 0; j < height; j++) {
			tiles.push(Tile.TSupTriangleTile(i, j, width, height));
			tiles.push(Tile.TSdownTriangleTile(i, j, width, height));
			tiles.push(Tile.TSleftTriangleTile(i, j, width, height));
			tiles.push(Tile.TSrightTriangleTile(i, j, width, height));
		}
	}
	console.log(new Tiling(tiles));
	return new Tiling(tiles);
};

Tile.TSupTriangleTile = function(x, y, width, height) {
	var id = [x, y, "up"];
	var neighbors = [];
	neighbors.push([x, y-1, "down"]);
	neighbors.push([x, y, "left"]);
	neighbors.push([x, y, "right"]);
	var bounds = [];
	bounds.push((x-width/2), (y-height/2));
	bounds.push((x-width/2)+1/2, (y-height/2)-1/2);
	bounds.push((x-width/2)-1/2, (y-height/2)-1/2);
	return new Tile(id, neighbors, bounds, 3);
};

Tile.TSdownTriangleTile = function(x, y, width, height) {
	var id = [x, y, "down"];
	var neighbors = [];
	neighbors.push([x, y+1, "up"]);
	neighbors.push([x, y, "right"]);
	neighbors.push([x, y, "left"]);
	var bounds = [];
	bounds.push((x-width/2), (y-height/2));
	bounds.push((x-width/2)+1/2, (y-height/2)+1/2);
	bounds.push((x-width/2)-1/2, (y-height/2)+1/2);
	return new Tile(id, neighbors, bounds, 3);
};

Tile.TSleftTriangleTile = function(x, y, width, height) {
	var id = [x, y, "left"];
	var neighbors = [];
	neighbors.push([x-1, y, "right"]);
	neighbors.push([x, y, "up"]);
	neighbors.push([x, y, "down"]);
	var bounds = [];
	bounds.push((x-width/2), (y-height/2));
	bounds.push((x-width/2)-1/2, (y-height/2)-1/2);
	bounds.push((x-width/2)-1/2, (y-height/2)+1/2);
	return new Tile(id, neighbors, bounds, 3);
};

Tile.TSrightTriangleTile = function(x, y, width, height) {
	var id = [x, y, "right"];
	var neighbors = [];
	neighbors.push([x+1, y, "left"]);
	neighbors.push([x, y, "up"]);
	neighbors.push([x, y, "down"]);
	var bounds = [];
	bounds.push((x-width/2), (y-height/2));
	bounds.push((x-width/2)+1/2, (y-height/2)-1/2);
	bounds.push((x-width/2)+1/2, (y-height/2)+1/2);
	return new Tile(id, neighbors, bounds, 3);
};