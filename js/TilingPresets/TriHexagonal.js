Tiling.triHexTiling = function ({size}={}) {

	var tils = [];
<<<<<<< HEAD
	var parcouru = []
	var compteur = true
	
=======

>>>>>>> 98cd507b8e9227b4f3806e0dc4b627c753581742
	for(var x=-size; x<=size; x++){
		for(var y=-size; y<=size; y++){
			for(var z=-size; z<=size; z++){
				if(x+y+z == 0){
					last_tile = hexTile(3*x, 3*y, 3*z);
					tils.push(last_tile);
					last_tile.neighbors.forEach(function(pos){
						var free = true;
						parcouru.forEach(function(other_pos){
							if (pos[0]==other_pos[0] && pos[1]==other_pos[1]){
								free = false;
							}
						})
						if (free == true  && -3*size-1<=pos[0] && -3*size-1<=pos[1] && -3*size-1<=pos[2] && pos[0]<=3*size+1 && pos[1]<=3*size+1 && pos[2]<=3*size+1){
							tils.push(triTile(pos[0],pos[1], pos[2], compteur));
							parcouru.push(pos);
						}
						compteur = 1 - compteur
					});
				}
			}
		}
	}
	console.log(new Tiling(tils));
	return new Tiling(tils);
}

function triTile(x, y, z, bool){
	var id = [x, y, z];
	
	var neighbors =  [];
	if (bool == false){
		neighbors.push([x - 1, y - 1, z + 2]);
		neighbors.push([x - 1, y + 2, z - 1]);
		neighbors.push([x + 2, y - 1, z - 1]);
	}
	else{
		neighbors.push([x + 1, y - 2, z + 1]);
		neighbors.push([x - 2, y + 1, z + 1]);
		neighbors.push([x + 1, y + 1, z - 2]);
	}
	
	let sq3 = Math.sqrt(3)/2;
	let invsq3 = 1/Math.sqrt(3)
	var bounds = [];
	if (bool == true){
		bounds.push(2*sq3*x - 0.5*invsq3*3, (y-z) - 0.5*3);
		bounds.push(2*sq3*x + invsq3*3, (y-z));
		bounds.push(2*sq3*x  - 0.5*invsq3*3, (y-z) + 0.5*3);
	}
	else{
		bounds.push(2*sq3*x + 0.5*invsq3*3, (y-z) - 0.5*3);
		bounds.push(2*sq3*x - invsq3*3, (y-z));
		bounds.push(2*sq3*x  + 0.5*invsq3*3, (y-z) + 0.5*3);		
	}
	
	return new Tile(id, neighbors, bounds, 3);
}

function hexTile(x, y, z){
	var id = [x, y, z];

	var neighbors =  [];
<<<<<<< HEAD
	neighbors.push([x - 1, y - 1, z + 2]);
	neighbors.push([x + 1, y - 2, z + 1]);
	neighbors.push([x - 1, y + 2, z - 1]);
	neighbors.push([x - 2, y + 1, z + 1]);
	neighbors.push([x + 2, y - 1, z - 1]);
	neighbors.push([x + 1, y + 1, z - 2]);
=======
	neighbors.push([x-1, y,   z+1]);
	neighbors.push([x-1, y+1, z  ]);
	neighbors.push([x,   y+1, z-1]);
	neighbors.push([x,   y-1, z+1]);
	neighbors.push([x+1, y,   z-1]);
	neighbors.push([x+1, y-1, z  ]);

>>>>>>> 98cd507b8e9227b4f3806e0dc4b627c753581742
	

	let sq3 = Math.sqrt(3)/2;
	var bounds = [];
<<<<<<< HEAD
	bounds.push(2*sq3*x - sq3*3, (y-z) - 0.5*3);
	bounds.push(2*sq3*x , (y-z) - 3);
	bounds.push(2*sq3*x + sq3*3, (y-z) - 0.5*3);
	bounds.push(2*sq3*x + sq3*3, (y-z) + 0.5*3);
	bounds.push(2*sq3*x , (y-z) + 3);
	bounds.push(2*sq3*x - sq3*3, (y-z) + 0.5*3);
	
=======
	bounds.push(2*sq3*x - sq3, (y-z) - 0.5);
	bounds.push(2*sq3*x , (y-z) - 1);
	bounds.push(2*sq3*x + sq3, (y-z) - 0.5);
	bounds.push(2*sq3*x + sq3, (y-z) + 0.5);
	bounds.push(2*sq3*x , (y-z) + 1);
	bounds.push(2*sq3*x - sq3, (y-z) + 0.5);




>>>>>>> 98cd507b8e9227b4f3806e0dc4b627c753581742
	return new Tile(id, neighbors, bounds, 6);



}
<<<<<<< HEAD
=======
	function triTile(x, y, z){
		var id = [x, y, z];
		var neighbors = [];
		let sq5= Math.sqrt(5)/2;

		neighbors.push([x-sq5, y, z+sq5]);
		neighbors.push([x+sq5, y, z-sq5]);
		neighbors.push([x+sq5, y-sq5, z]);
		neighbors.push([x, y-sq5, z+sq5]);
		neighbors.push([x-sq5, y+sq5, z]);
		neighbors.push([x, y+sq5, z-sq5]);

		var bounds=[];



		return new Tile(id, neighbors, bounds, 3);
	}
>>>>>>> 98cd507b8e9227b4f3806e0dc4b627c753581742
