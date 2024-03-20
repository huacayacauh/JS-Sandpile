// Truncated square tiling with octagons

function OCTAGON(x, y){
	var id = [x, y, 'octagon'];

	var neighbors = [];
	neighbors.push([x+3, y, 'square']);
	neighbors.push([x+3, y+3, 'octagon']);
	neighbors.push([x, y+3, 'square']);
	neighbors.push([x-3, y+3, 'octagon']);
    neighbors.push([x-3, y, 'square']);
	neighbors.push([x-3, y-3, 'octagon']);
	neighbors.push([x, y-3, 'square']);
	neighbors.push([x+3, y-3, 'octagon']);

	var bounds = [];
	bounds.push(x-1, y+2);
	bounds.push(x+1, y+2);
	bounds.push(x+2, y+1);
	bounds.push(x+2, y-1);
    bounds.push(x+1, y-2);
	bounds.push(x-1, y-2);
	bounds.push(x-2, y-1);
	bounds.push(x-2, y+1);

	return new Tile(id, neighbors, bounds, 8);
}

function SQUARE(x, y){
    var id = [x, y, 'square'];

    var neighbors = [];
    neighbors.push([x-3, y, 'octagon']);
	neighbors.push([x, y+3, 'octagon']);
	neighbors.push([x+3, y, 'octagon']);
	neighbors.push([x, y-3, 'octagon']);

    var bounds = [];
    bounds.push(x-1, y+1);
    bounds.push(x+1, y+1);
    bounds.push(x+1, y-1);
    bounds.push(x-1, y-1);

	return new Tile(id, neighbors, bounds, 4);
}

Tiling.truncSqTiling = function({size} = {}){
	var tiles = [];

  tiles.push(OCTAGON(0, 0));

	if (size > 0){
		for (let i = 1; i<=size; i++){
			tiles.push(OCTAGON(-3*i, 3*i));
			tiles.push(OCTAGON(3*i, 3*i));
			tiles.push(OCTAGON(3*i, -3*i));
			tiles.push(OCTAGON(-3*i, -3*i));
		}

		// up
		for (let i = 1; i<=size; i++){
			tiles.push(SQUARE(-3*i + 3, 3*i));
			for (j = 1; j<=i-1; j++){
				tiles.push(SQUARE(-3*i + 3 + 6*j, 3*i));
			}
		}
		for (let i = 2; i<=size; i++){
			for (j = 1; j<= i-1; j++){
				tiles.push(OCTAGON(-3*i + 6*j, 3*i));
			}
		}

		// down
		for (let i = 1; i<=size; i++){
			tiles.push(SQUARE(-3*i + 3, -3*i));
			for (j = 1; j<=i-1; j++){
				tiles.push(SQUARE(-3*i + 3 + 6*j, -3*i));
			}
		}

		for (let i = 2; i<=size; i++){
			for (j = 1; j<= i-1; j++){
				tiles.push(OCTAGON(-3*i + 6*j, -3*i));
			}
		}

		// left
		for (let i = 1; i<=size; i++){
			tiles.push(SQUARE(-3*i, 3*i -3));
			for (j = 1; j<=i-1; j++){
				tiles.push(SQUARE(-3*i, 3*i - 3 - 6*j));
			}
		}

		for (let i = 2; i<=size; i++){
			for (j = 1; j<= i-1; j++){
				tiles.push(OCTAGON(-3*i, 3*i-6*j));
			}
		}

		// right
		for (let i = 1; i<=size; i++){
			tiles.push(SQUARE(3*i, 3*i-3));
			for (j = 1; j<=i-1; j++){
				tiles.push(SQUARE(3*i, 3*i-3-6*j));
			}
		}

		for (let i = 2; i<=size; i++){
			for (j = 1; j<= i-1; j++){
				tiles.push(OCTAGON(3*i, 3*i - 6*j));
			}
		}
	}

	return new Tiling(tiles);
}
