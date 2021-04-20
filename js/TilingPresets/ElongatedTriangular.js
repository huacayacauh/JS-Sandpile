Tiling.elongatedTriangularTiling = function({width, height}={}) {
	var tiles = [];
	for (var y = 0; y < height; y++) {
		for (var x = 0; x < width; x++) {
			var square_side = 1;
			var triangle_height = Math.sqrt(3)/2*square_side;
			var x_unit = square_side;
			var y_unit = square_side + triangle_height;
			var is_odd_line = y % 2;
			var x_slide = is_odd_line * x_unit / 2;
			tiles.push(Tile.ETupTriangleTile(x, y, is_odd_line, square_side, triangle_height, x_unit, y_unit, x_slide, width, height));
			tiles.push(Tile.ETdownTriangleTile(x, y, is_odd_line, square_side, triangle_height, x_unit, y_unit, x_slide, width, height));
			tiles.push(Tile.ETsquareTile(x, y, is_odd_line, square_side, triangle_height, x_unit, y_unit, x_slide, width, height));
		}
	}
	return new Tiling(tiles);
}

Tile.ETupTriangleTile = function(x, y, is_odd_line, square_side, triangle_height, x_unit, y_unit, x_slide, width, height) {
	var id = [x, y, "up"];
	var neighbors = [];
	neighbors.push([x, y, "square"]);
	neighbors.push([x-1+is_odd_line, y+1, "down"]);
	neighbors.push([x+is_odd_line, y+1, "down"]);
	var bounds = [];
	bounds.push((x-width/2)*x_unit + square_side/2 + x_slide, (y-height/2)*y_unit + square_side/2); // right up -:
	bounds.push((x-width/2)*x_unit - square_side/2 + x_slide, (y-height/2)*y_unit + square_side/2); // left up :-
	bounds.push((x-width/2)*x_unit + x_slide, (y-height/2)*y_unit + square_side/2 + triangle_height); // center up ^
	return new Tile(id, neighbors, bounds, 3);
};

Tile.ETdownTriangleTile = function(x, y, is_odd_line, square_side, triangle_height, x_unit, y_unit, x_slide, width, height) {
	var id = [x, y, "down"];
	var neighbors = [];
	neighbors.push([x, y, "square"]);
	neighbors.push([x-1+is_odd_line, y-1, "up"]);
	neighbors.push([x+is_odd_line, y-1, "up"]);
	var bounds = [];
	bounds.push((x-width/2)*x_unit - square_side/2 + x_slide, (y-height/2)*y_unit - square_side/2); // left down |_
	bounds.push((x-width/2)*x_unit + square_side/2 + x_slide, (y-height/2)*y_unit - square_side/2); // right down _|
	bounds.push((x-width/2)*x_unit + x_slide, (y-height/2)*y_unit - square_side/2 - triangle_height); // center down v
	return new Tile(id, neighbors, bounds, 3);
};

Tile.ETsquareTile = function(x, y, is_odd_line, square_side, triangle_height, x_unit, y_unit, x_slide, width, height) {
	var id = [x, y, "square"];
	var neighbors = [];
	neighbors.push([x-1, y, "square"]);
	neighbors.push([x+1, y, "square"]);
	neighbors.push([x, y, "up"]);
	neighbors.push([x, y, "down"]);
	var bounds = [];
	bounds.push((x-width/2)*x_unit - square_side/2 + x_slide, (y-height/2)*y_unit - square_side/2); // left down |_
	bounds.push((x-width/2)*x_unit + square_side/2 + x_slide, (y-height/2)*y_unit - square_side/2); // right down _|
	bounds.push((x-width/2)*x_unit + square_side/2 + x_slide, (y-height/2)*y_unit + square_side/2); // right up -:
	bounds.push((x-width/2)*x_unit - square_side/2 + x_slide, (y-height/2)*y_unit + square_side/2); // left up :-
	return new Tile(id, neighbors, bounds, 4);
};