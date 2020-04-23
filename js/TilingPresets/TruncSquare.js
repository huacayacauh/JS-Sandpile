Tiling.truncSq = function({width, height}={}){
	
	var tils = [];

	for(var j = 0; j < width; j++){
		for(var i = 0; i < height; i++){
			if((i+j)%2==0)
				tils.push(Tile.truncSqTile(j, i));
			else
				tils.push(Tile.truncOctoTile(j, i));
		}	
	}

	return new Tiling(tils, false, true);;
}

Tile.truncSqTile = function(x, y){

	var id = [x, y];
	
	var neighbors = [];
	
	neighbors.push([x+1, y]);
	neighbors.push([x-1, y]);
	neighbors.push([x, y-1]);
	neighbors.push([x, y+1]);
	
	var bounds = [];
	var dist = (1 + 1/Math.sqrt(2));
	bounds.push(dist*x, dist*y);
	bounds.push(dist*x+1, dist*y);
	bounds.push(dist*x+1, dist*y+1);
	bounds.push(dist*x, dist*y+1);
	
	let tile = new Tile(id, neighbors, bounds, 4);
	tile.sand = 1;
	return tile ;
}


Tile.truncOctoTile = function(x, y){

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
	var d = 1/Math.sqrt(2);

	bounds.push((1+d)*x -d, (1+d)*y);
	bounds.push((1+d)*x -d, (1+d)*y +1);
	bounds.push((1+d)*x, (1+d)*y +1 +d);
	bounds.push((1+d)*x+1, (1+d)*y +1 +d);
	bounds.push((1+d)*x+1+d, (1+d)*y +1);
	bounds.push((1+d)*x+1+d, (1+d)*y);
	bounds.push((1+d)*x+1, (1+d)*y -d);
	bounds.push((1+d)*x, (1+d)*y -d);
				
	return new Tile(id, neighbors, bounds, 8);
}