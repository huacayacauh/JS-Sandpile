Tiling.sqTiling = function(width, height, cmap, type){
		// Creates a Tiling corresponding to a square grid of dimensions width, height
		
		var pos = [];
		var col = [];
		var tils = [];

		var c2 = width/2;
		var l2 = height/2;

		for(var j = 0; j < width; j++){
			for(var i = 0; i < height; i++){
				// triangles corresponding to a square grid
				pos.push( j - c2, -i + l2, 0 );
				pos.push( j- c2, -i-1 + l2, 0 );
				pos.push( j+1- c2, -i-1 + l2, 0 );

				col.push( 255, 0, 0 );
				col.push( 255, 0, 0 );
				col.push( 255, 0, 0 );

				pos.push( j+1- c2, -i-1 + l2, 0 );
				pos.push( j+1- c2, -i + l2, 0 );
				pos.push( j- c2, -i + l2, 0 );

				col.push( 255, 255, 255 );
				col.push( 255, 255, 255 );
				col.push( 255, 255, 255 );
				
				if(type == "Neumann"){
					tils.push(Tile.squareTile(j, i, width, height));
				} else if(type == "Moore") {
					tils.push(Tile.squareTileMoore(j, i, width, height));
				}
			}	
		}

		return new Tiling(pos, col, tils, cmap);
}

Tile.squareTile = function(x, y, xMax, yMax){
		// Creates the Tile in position x, y of a square grid

		var id;
		var neighbours = [];
		id = x*yMax + y;
		if(x > 0) neighbours.push((x-1)*yMax + y);
		if(x < xMax-1) neighbours.push((x+1)*yMax + y);
		if(y > 0) neighbours.push(x*yMax + (y-1));
		if(y < yMax-1) neighbours.push(x*yMax + (y+1));
		var pointsIds = [];
		for(var i=0; i<6; i++){
			pointsIds.push(id*6 + i);
		}
		return new Tile(id, neighbours, pointsIds, 4);
	}
	
Tile.squareTileMoore = function(x, y, xMax, yMax){
		// Creates the Tile in position x, y of a square grid

		var id;
		var neighbours = [];
		id = x*yMax + y;
		if(x > 0) neighbours.push((x-1)*yMax + y);
		if(x < xMax-1) neighbours.push((x+1)*yMax + y);
		if(y > 0) neighbours.push(x*yMax + (y-1));
		if(y < yMax-1) neighbours.push(x*yMax + (y+1));
		
		
		if(y < yMax-1 && x < xMax-1) neighbours.push((x+1)*yMax + (y+1));
		
		if(y < yMax-1 && x > 0) neighbours.push((x-1)*yMax + (y+1));
		
		if(y > 0 && x < xMax - 1) neighbours.push((x+1)*yMax + (y-1));
		
		if(y > 0 && x > 0) neighbours.push((x-1)*yMax + (y-1));
		var pointsIds = [];
		for(var i=0; i<6; i++){
			pointsIds.push(id*6 + i);
		}
		return new Tile(id, neighbours, pointsIds, 8);
	}