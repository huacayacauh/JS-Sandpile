Tiling.allongTri = function ({size}={}) {
	
	var tils = [];
	
	let n = size;
	tmp = 1
	for(i = 0; i<size;i++)
	{
		for(j = 0;j<tmp;j++)
		{
			if(j % 2 == 0)
			{
				tils.push(upTriangleAllong(i,j/2));
			}
			else
			{
				tils.push(downTriangleAllong(i,j/2));
			}
		}
		tmp+=2
	}
	console.log(new Tiling(tils));
	return new Tiling(tils);
}

function upTriangleAllong(x, y){
	var id = [x, y, "up"];
	
	var neighbors = [];
	neighbors.push([x, y-1, "down"])
	neighbors.push([x,y+1, "down"])
	neighbors.push([x+1, y+1, "down"])
	
	var bounds = [];
	bounds.push(x, y + 1/2);
	bounds.push(x+1/2, y-1/3);
	bounds.push(x-1/2, y-1/3);
	
	if(x == 0 && y == 0)
	{
		return new Tile(id, neighbors, bounds, 5);
	}
	return new Tile(id, neighbors, bounds, 3);
}

function downTriangleAllong(x, y){
	var id = [x, y, "down"];
	
	var neighbors = [];
	neighbors.push([x, y-1, "up"])
	neighbors.push([x,y+1, "up"])
	neighbors.push([x-1, y-1, "up"])
	
	
	var bounds = [];
	bounds.push(x,y-1/2);
	bounds.push(x-1/2,y+1/3);
	bounds.push(x+1/2, y+1/3);
	
	return new Tile(id, neighbors, bounds, 3);
}