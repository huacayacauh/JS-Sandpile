Tiling.tetrakisSquare = function({size}={}){
	
	var tils = [];

	for(var i = 0; i < size; i++){
		for(var j = 0; j < size; j++)
		{
			tils.push(Tile.upTriangle(i, j,size));
			tils.push(Tile.downTriangle(i, j,size));
			tils.push(Tile.leftTriangle(i, j,size));
			tils.push(Tile.rightTriangle(i, j,size));
		}
	}
	
	console.log(new Tiling(tils));
	return new Tiling(tils);
}
Tile.upTriangle = function(x,y,size)
{
	var id = [x, y, "up"];
	
	
	var neighbors = [];
	neighbors.push([x, y-1, "down"])
	neighbors.push([x, y, "left"])
	neighbors.push([x, y, "right"])
	
	var bounds = [];
	bounds.push(x, y);
	bounds.push(x+1/2,y-(1/2));
	bounds.push(x-1/2,y-(1/2));
	
	return new Tile(id, neighbors, bounds, 3);
	
}
Tile.downTriangle = function(x,y,size)
{
	var id = [x, y, "down"];
	
	
	var neighbors = [];
	neighbors.push([x, y+1, "up"])
	neighbors.push([x, y, "right"])
	neighbors.push([x, y, "left"])
	
	var bounds = [];
	bounds.push(x, y);
	bounds.push(x+1/2,y+(1/2));
	bounds.push(x-1/2,y+(1/2));
	
	return new Tile(id, neighbors, bounds, 3);
}
Tile.leftTriangle = function(x,y,size)
{
	var id = [x, y, "left"];
	
	var neighbors = [];
	neighbors.push([x-1, y, "right"])
	neighbors.push([x, y, "up"])
	neighbors.push([x, y, "down"])
	
	var bounds = [];
	bounds.push(x, y);
	bounds.push(x-(1/2),y-1/2);
	bounds.push(x-(1/2),y+1/2);
	
	return new Tile(id, neighbors, bounds, 3);
}
Tile.rightTriangle = function(x,y,size)
{
	var id = [x, y, "right"];
	
	
	var neighbors = [];
	neighbors.push([x+1, y, "left"])
	neighbors.push([x, y, "up"])
	neighbors.push([x, y, "down"])
	
	var bounds = [];
	bounds.push(x, y);
	bounds.push(x+(1/2),y-1/2);
	bounds.push(x+(1/2),y+1/2);
	
	return new Tile(id, neighbors, bounds, 3);
}



