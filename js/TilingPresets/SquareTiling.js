Tiling.sqTiling = function(cmap, {width, height}={}){
	// Creates a Tiling corresponding to a square Tiling of dimensions width, height
	
	var pos = [];
	var col = [];
	var tils = [];

	var c2 = width/2;
	var l2 = height/2;

	for(var j = 0; j < width; j++){
		for(var i = 0; i < height; i++){
			// triangles corresponding to a square Tiling
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
			tils.push(Tile.squareTile(j, i, width, height));
		}	
	}

	return new Tiling(pos, col, tils, cmap, pos);
}

Tiling.sqSpecial = function(cmap, {width, height}={}){
	// Creates a Tiling corresponding to a square Tiling of dimensions width, height
	
	var pos = [];
	var col = [];
	var tils = [];

	var c2 = width/2;
	var l2 = height/2;

	for(var j = 0; j < width; j++){
		for(var i = 0; i < height; i++){
			// triangles corresponding to a square Tiling
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
			tils.push(Tile.specialTile(j, i, width, height));
		}	
	}

	return new Tiling(pos, col, tils, cmap, pos);
}

Tiling.sqTilingMoore = function(cmap, {width, height}={}){
	// Creates a Tiling corresponding to a square Tiling of dimensions width, height
	
	var pos = [];
	var col = [];
	var tils = [];

	var c2 = width/2;
	var l2 = height/2;

	for(var j = 0; j < width; j++){
		for(var i = 0; i < height; i++){
			// triangles corresponding to a square Tiling
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
			
			tils.push(Tile.squareTileMoore(j, i, width, height));
		}	
	}

	return new Tiling(pos, col, tils, cmap, pos);
}

Tile.squareTile = function(x, y, xMax, yMax){
	// Creates the Tile in position x, y of a square Tiling

	var id;
	var neighbors = [];
	id = x*yMax + y;
	if(x > 0) neighbors.push((x-1)*yMax + y);
	if(x < xMax-1) neighbors.push((x+1)*yMax + y);
	if(y > 0) neighbors.push(x*yMax + (y-1));
	if(y < yMax-1) neighbors.push(x*yMax + (y+1));
	var pointsIds = [];
	for(var i=0; i<6; i++){
		pointsIds.push(id*6 + i);
	}
	return new Tile(id, neighbors, pointsIds, 4);
}

Tile.specialTile = function(x, y, xMax, yMax){
	// Creates the Tile in position x, y of a square Tiling

	var id;
	var neighbors = [];
	id = x*yMax + y;
	if(x > 0) neighbors.push((x-1)*yMax + y);
	else neighbors.push(y*yMax + x);
	if(x < xMax-1) neighbors.push((x+1)*yMax + y);
	if(y > 0) neighbors.push(x*yMax + (y-1));
	else neighbors.push(y*yMax + x);
	if(y < yMax-1) neighbors.push(x*yMax + y+1);
	if(x==0 && y==0) neighbors = [0, 0, 1, yMax];
	var pointsIds = [];
	for(var i=0; i<6; i++){
		pointsIds.push(id*6 + i);
	}
	return new Tile(id, neighbors, pointsIds, 4);
}
	
Tile.squareTileMoore = function(x, y, xMax, yMax){
	// Creates the Tile in position x, y of a square Tiling

	var id;
	var neighbors = [];
	id = x*yMax + y;
	if(x > 0) neighbors.push((x-1)*yMax + y);
	if(x < xMax-1) neighbors.push((x+1)*yMax + y);
	if(y > 0) neighbors.push(x*yMax + (y-1));
	if(y < yMax-1) neighbors.push(x*yMax + (y+1));
	
	
	if(y < yMax-1 && x < xMax-1) neighbors.push((x+1)*yMax + (y+1));
	
	if(y < yMax-1 && x > 0) neighbors.push((x-1)*yMax + (y+1));
	
	if(y > 0 && x < xMax - 1) neighbors.push((x+1)*yMax + (y-1));
	
	if(y > 0 && x > 0) neighbors.push((x-1)*yMax + (y-1));
	var pointsIds = [];
	for(var i=0; i<6; i++){
		pointsIds.push(id*6 + i);
	}
	return new Tile(id, neighbors, pointsIds, 8);
}