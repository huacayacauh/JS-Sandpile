Tiling.Euclidean = function ({size}={}) {

	var tils = [];

	for(var r=-size; r<=size; r++){
		for(var q=-size; q<=size; q++){
			tils.push(EuclHex(r, q));
			//  tils.push(EuclTri(r, q, 1));
			//	tils.push(EuclTri(r, q,2));

		}
	}
	console.log(new Tiling(tils));
	return new Tiling(tils);
}

function EuclTri(x, y, z){
	var id = [x, y, z];

	var neighbors = [];
	neighbors.push([x, y, "down"])
	neighbors.push([x-1, y, "down"])
	neighbors.push([x, y-1, "down"])


	let sq3 = Math.sqrt(3);

	var bounds = [];
	neighbors.push([x-1, y,   z+1]);
	neighbors.push([x-1, y+1, z  ]);
	neighbors.push([x,   y+1, z-1]);

	return new Tile(id, neighbors, bounds, 3);
}



function EuclHex(r, q){
	var id = [r, q, 0];

	var neighbors =  [];


	let sq3 = Math.sqrt(3)/2;
	let coef = 1;
	var bounds = [];

	bounds.push(2*r+q%2+1, q*Math.sqrt(3));
	bounds.push(2*r+q%2+1/2,q*Math.sqrt(3)+sq3);
	bounds.push(2*r+q%2-1/2,q*Math.sqrt(3)+sq3);
	bounds.push(2*r+q%2-1,q*Math.sqrt(3));
	bounds.push(2*r+q%2-1/2,q*Math.sqrt(3)-sq3);
	bounds.push(2*r+q%2+1/2,q*Math.sqrt(3)-sq3);

	return new Tile(id, neighbors, bounds, 6);
}
