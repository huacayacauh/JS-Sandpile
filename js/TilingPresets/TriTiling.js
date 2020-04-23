Tiling.triTiling = function ({size}={}) {
	
	var tils = [];
	
	let n = size;
	
	for(var y = 0; y < n; y++){
		for(var x = 0; x < n - y; x++){
			tils.push(upTriangle(x, y, n));
		}
	}
	for(var y = 0; y < n - 1; y++){
		for(var x = 0; x < n - y - 1; x++){
			tils.push(downTriangle(x, y, n));
		}
	}
	return new Tiling(tils);
}

function upTriangle(x, y, n){
	var id = [x, y, "up"];
	
	var neighbors = [];
	neighbors.push([x, y, "down"])
	neighbors.push([x-1, y, "down"])
	neighbors.push([x, y-1, "down"])
	
	
	let sq3 = Math.sqrt(3);
	
	var bounds = [];
	bounds.push(x+ (y-n)/2, y*(sq3/2) - n*(sq3/6));
	bounds.push(x+ (y-n)/2 + 1, y*(sq3/2) - n*(sq3/6));
	bounds.push(x+ (y-n)/2 + 0.5, (y+1)*(sq3/2) - n*(sq3/6));
	
	return new Tile(id, neighbors, bounds, 3);
}

function downTriangle(x, y, n){
	var id = [x, y, "down"];
	
	var neighbors = [];
	neighbors.push([x, y, "up"])
	neighbors.push([x+1, y, "up"])
	neighbors.push([x, y+1, "up"])
	
	
	let sq3 = Math.sqrt(3);
	
	var bounds = [];
	bounds.push(x+ (y-n)/2 + 0.5, (y+1)*(sq3/2) - n*(sq3/6));
	bounds.push(x+ (y-n)/2 + 1.5, (y+1)*(sq3/2) - n*(sq3/6));
	bounds.push(x+ (y-n)/2 + 1, y*(sq3/2) - n*(sq3/6));
	
	return new Tile(id, neighbors, bounds, 3);
}
