Tiling.Euclidean = function ({size}={}) {

	var tils = [];

	for(var r=-size; r<=size; r++){
		for(var q=-size; q<=size; q++){
			tils.push(EuclHex(r, q));
			tils.push(EuclTriSup(r, q));
			tils.push(EuclTriInf(r, q));

			//  tils.push(EuclTri(r, q, 1));
			//	tils.push(EuclTri(r, q,2));

		}
	}
	console.log(new Tiling(tils));
	return new Tiling(tils);
}

function EuclTriInf(r, q){
	var id = [r,q,1];

	var neighbors = [];


	neighbors.push([r, q,   0]);
	neighbors.push([r-1+Math.abs(q)%2, q-1,   0]);
	neighbors.push([r+Math.abs(q)%2, q-1,   0]);


	let sq3 = Math.sqrt(3)/2;

	var bounds = [];
	bounds.push(2*r+Math.abs(q)%2+1/2,q*Math.sqrt(3)-sq3);
	bounds.push(2*r+Math.abs(q)%2-1/2,q*Math.sqrt(3)-sq3);
	bounds.push(2*r+Math.abs(q)%2,q*Math.sqrt(3)-2*sq3);

	return new Tile(id, neighbors, bounds, 4);
}

function EuclTriSup(r, q){
	var id = [r,q,2];

	var neighbors = [];
	neighbors.push([r, q,   0]);
	neighbors.push([r+Math.abs(q)%2, q+1,   0]);
	neighbors.push([r-1+Math.abs(q)%2, q+1,   0]);

	let sq3 = Math.sqrt(3)/2;

	var bounds = [];
	bounds.push(2*r+Math.abs(q)%2+1/2,q*Math.sqrt(3)+sq3);
	bounds.push(2*r+Math.abs(q)%2-1/2,q*Math.sqrt(3)+sq3);
	bounds.push(2*r+Math.abs(q)%2,q*Math.sqrt(3)+2*sq3);

	return new Tile(id, neighbors, bounds, 4);
}



function EuclHex(r, q){
	var id = [r, q, 0];

	var neighbors =  [];
	neighbors.push([r, q,   1]);
	neighbors.push([r, q,   2]);
	neighbors.push([r+Math.abs(q)%2, q+1,   1]);
	neighbors.push([r-1+Math.abs(q)%2, q+1,   1]);
	neighbors.push([r-Math.abs(q+1)%2, q-1,   2]);
	neighbors.push([r+1-Math.abs(q+1)%2, q-1,   2]);

	let sq3 = Math.sqrt(3)/2;
	let coef = 1;
	var bounds = [];

	bounds.push(2*r+Math.abs(q)%2+1, q*Math.sqrt(3));
	bounds.push(2*r+Math.abs(q)%2+1/2,q*Math.sqrt(3)+sq3);
	bounds.push(2*r+Math.abs(q)%2-1/2,q*Math.sqrt(3)+sq3);
	bounds.push(2*r+Math.abs(q)%2-1,q*Math.sqrt(3));
	bounds.push(2*r+Math.abs(q)%2-1/2,q*Math.sqrt(3)-sq3);
	bounds.push(2*r+Math.abs(q)%2+1/2,q*Math.sqrt(3)-sq3);

	return new Tile(id, neighbors, bounds, 4);
}
