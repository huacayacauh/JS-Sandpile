Tiling.sqTiling = function({width, height}={}){
	// Creates a Tiling corresponding to a square Tiling of dimensions width, height
	
	var tils = [];

	for(var j = 0; j < width; j++){
		for(var i = 0; i < height; i++){
			tils.push(Tile.squareTile(j, i, width, height));
		}	
	}
	
	return new Tiling(tils);
}

Tiling.sqD2 = function({size}={}){
	var tils = [];

	for(var j = 0; j < size; j++){
		for(var i = 0; i < size; i++){
			tils.push(Tile.sqD2Tile(j, i, size));
		}	
	}

	return new Tiling(tils);
}

Tiling.sqD4 = function({size}={}){
	var tils = [];

	for(var j = 0; j < size; j++){
		for(var i = 0; i <= j; i++){
			tils.push(Tile.sqD4Tile(j, i, size));
		}	
	}

	return new Tiling(tils);
}


Tiling.sqTilingMoore = function({width, height}={}){
	// Creates a Tiling corresponding to a square Tiling of dimensions width, height
	
	var tils = [];

	for(var j = 0; j < width; j++){
		for(var i = 0; i < height; i++){
			tils.push(Tile.sqMooreTile(j, i, width, height));
		}	
	}

	return new Tiling(tils);
}


Tile.squareTile = function(x, y, width, height){
	// Creates the Tile in position x, y of a square Tiling

	var id = [x, y];
	
	var neighbors = [];
	
	/*if(x > 0) neighbors.push([x-1, y]);
	if(x < xMax-1) neighbors.push([x+1, y]);
	if(y > 0) neighbors.push([x, y-1]);
	if(y < yMax-1) neighbors.push([x, y+1]);*/
	
	neighbors.push([x-1, y]);
	neighbors.push([x+1, y]);
	neighbors.push([x, y-1]);
	neighbors.push([x, y+1]);
	
	var bounds = [];
	bounds.push(x - width/2, y - height/2);
	bounds.push(x+1 - width/2, y - height/2);
	bounds.push(x+1 - width/2, y+1 - height/2);
	bounds.push(x - width/2, y+1 - height/2);
				
	return new Tile(id, neighbors, bounds, 4);
}



Tile.sqD2Tile = function(x, y, Max){

	var id = [x, y];
	
	var neighbors = [];
	
	if(x > 0) neighbors.push([x-1, y]);
	else neighbors.push([y, x]);
	if(x < Max-1) neighbors.push([x+1, y]);
	if(y > 0) neighbors.push([x, y-1]);
	else neighbors.push([y, x]);
	if(y < Max-1) neighbors.push([x, y+1]);
	if(x==0 && y==0) neighbors = [[0, 0], [0, 0], [0, 1], [1, 0]];
	
	var bounds = [];
	bounds.push(x - Max/2, y - Max/2);
	bounds.push(x+1 - Max/2, y - Max/2);
	bounds.push(x+1 - Max/2, y+1 - Max/2);
	bounds.push(x - Max/2, y+1 - Max/2);
				
	return new Tile(id, neighbors, bounds, 4);
}

Tile.sqD4Tile = function(x, y, Max){

	var id = [x, y];
	
	var neighbors = [];
	
	if(x > 0) neighbors.push([x-1, y]);
	else neighbors.push([y, x]);
	if(x < Max-1) neighbors.push([x+1, y]);
	if(y > 0) neighbors.push([x, y-1]);
	else neighbors.push([x, y]);
	if(y < Max-1) neighbors.push([x, y+1]);
	if(x==0 && y==0) neighbors = [[0, 0], [0, 0], [0, 1], [1, 0]];
	if(x==y) neighbors.push([x+1, y]);
	if(x==y) neighbors.push([x, y-1]);
	
	var bounds = [];
	bounds.push(x - Max/2, y - Max/2);
	bounds.push(x+1 - Max/2, y - Max/2);
	bounds.push(x+1 - Max/2, y+1 - Max/2);
	bounds.push(x - Max/2, y+1 - Max/2);
				
	return new Tile(id, neighbors, bounds, 4);
}
	
Tile.sqMooreTile = function(x, y, width, height){
	// Creates the Tile in position x, y of a square Tiling

	var id = [x, y];
	
	var neighbors = [];
	
	neighbors.push([x-1, y]);
	neighbors.push([x+1, y]);
	neighbors.push([x, y-1]);
	neighbors.push([x, y+1]);
	
	neighbors.push([x+1, y+1]);
	neighbors.push([x-1, y+1]);
	neighbors.push([x+1, y-1]);
	neighbors.push([x-1, y-1]);
	
	var bounds = [];
	bounds.push(x - width/2, y - height/2);
	bounds.push(x+1 - width/2, y - height/2);
	bounds.push(x+1 - width/2, y+1 - height/2);
	bounds.push(x - width/2, y+1 - height/2);
				
	return new Tile(id, neighbors, bounds, 8);
}

Tiling.sqTilingCircle = function({size}={}){
  // square Tiling croped to a circle of radius size
  let tiles = [];
  for(var j = 0; j < 2*size; j++){
    for(var i = 0; i < 2*size; i++){
      // crop according to center of square tile
      if(distance(0,0,i-size+1/2,j-size+1/2)<=size){
        tiles.push(Tile.squareTile(j,i,2*size,2*size));
      }
    }	
  }
  return new Tiling(tiles);
}

