Tiling.triHexTiling = function ({size}={}) {

	var tils = [];
	
	for(var x=-size; x<=size; x++){
		for(var y=-size; y<=size; y++){
			for(var z=-size; z<=size; z++){
				if(x+y+z == 0){
					tils.push(hexTile(x, y, z));
				}
			}
		}
	}
	console.log(new Tiling(tils));
	return new Tiling(tils);
}

function hexTile(x, y, z){
	var id = [x, y, z];
	
	var neighbors =  [];
	neighbors.push([x-1, y,   z+1]);
	neighbors.push([x-1, y+1, z  ]);
	neighbors.push([x,   y+1, z-1]);
	neighbors.push([x,   y-1, z+1]);
	neighbors.push([x+1, y,   z-1]);
	neighbors.push([x+1, y-1, z  ]);
	
	let sq3 = Math.sqrt(3)/2;
	var bounds = [];
	bounds.push(1.5*x-0.5, (y-z-1)*sq3);
	bounds.push(1.5*x-1, (y-z)*sq3);
	bounds.push(1.5*x-0.5, (y-z+1)*sq3);
	bounds.push(1.5*x+0.5, (y-z+1)*sq3);
	bounds.push(1.5*x+1, (y-z)*sq3);
	bounds.push(1.5*x+0.5, (y-z-1)*sq3);
	
	return new Tile(id, neighbors, bounds, 6);
}


