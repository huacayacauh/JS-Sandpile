

Tiling.trihexagonal = function ({size}={}) {

	var tils = [];
	for(var q=0; q<=size; q++){
		for(var r=-Math.floor((size-q+1)/2); r<=Math.floor((size-q)/2); r++){
			tils.push(thHex(r, q));
			tils.push(thTriSup(r, q));
			tils.push(thTriInf(r,q));
			if (q !=0){

			tils.push(thHex(r, -q));
			tils.push(thTriSup(r, -q));
			tils.push(thTriInf(r, -q));
		}

		}
	}
	console.log(new Tiling(tils));
	return new Tiling(tils);
}

function thTriInf(r, q){
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

	return new Tile(id, neighbors, bounds, 3);
}

function thTriSup(r, q){
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

	return new Tile(id, neighbors, bounds, 3);
}



function thHex(r, q){
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

	return new Tile(id, neighbors, bounds, 6);
}


Tiling.rhombitrihexagonal = function ({size}={}) {

	var tils = [];

	for(var r=-size; r<=size; r++){
		for(var q=-size; q<=size; q++){
			tils.push(rbtrhHex(r, q));
			tils.push(rbtrhSqu1(r, q));
			tils.push(rbtrhSqu2(r, q));
			tils.push(rbtrhSqu3(r, q));
			tils.push(rbtrhTri4(r, q));
			tils.push(rbtrhTri5(r, q));

		}
	}
	console.log(new Tiling(tils));
	return new Tiling(tils);
}


function rbtrhHex(r, q){
	var id = [r, q, 0];
	var neighbors =  [];
	let sq3 = Math.sqrt(3)/2;
	let coef1 = Math.sqrt(3) +3;
	let coef2 = (Math.sqrt(3) +1)/2;

	neighbors.push([r, q, 1]);
	neighbors.push([r, q, 2]);
	neighbors.push([r, q, 3]);
	neighbors.push([r-1+Math.abs(q)%2, q+1, 3]);
	neighbors.push([r+Math.abs(q)%2, q+1, 2]);
	neighbors.push([r, q-2, 1]);

	var bounds = [];

	bounds.push(coef1*(r+1/2*(Math.abs(q)%2))+1, q*coef2);
	bounds.push(coef1*(r+1/2*(Math.abs(q)%2))+1/2,q*coef2+sq3);
	bounds.push(coef1*(r+1/2*(Math.abs(q)%2))-1/2,q*coef2+sq3);
	bounds.push(coef1*(r+1/2*(Math.abs(q)%2))-1,q*coef2);
	bounds.push(coef1*(r+1/2*(Math.abs(q)%2))-1/2,q*coef2-sq3);
	bounds.push(coef1*(r+1/2*(Math.abs(q)%2))+1/2,q*coef2-sq3);
	return new Tile(id, neighbors, bounds, 6);
}


function rbtrhSqu1(r, q){
	var id = [r, q, 1];
	var neighbors =  [];
	let sq3 = Math.sqrt(3)/2;
	let coef1 = Math.sqrt(3) +3;
	let coef2 = (Math.sqrt(3) +1)/2;

	neighbors.push([r, q, 0]);
	neighbors.push([r, q+2, 0]);
	neighbors.push([r, q, 4]);
	neighbors.push([r, q, 5]);

	var bounds = [];

	bounds.push(coef1*(r+1/2*(Math.abs(q)%2))+1/2,q*coef2+sq3);
	bounds.push(coef1*(r+1/2*(Math.abs(q)%2))-1/2,q*coef2+sq3);
	bounds.push(coef1*(r+1/2*(Math.abs(q)%2))-1/2,q*coef2+sq3+1);
	bounds.push(coef1*(r+1/2*(Math.abs(q)%2))+1/2,q*coef2+sq3+1);

	return new Tile(id, neighbors, bounds, 4);
}

function rbtrhSqu2(r, q){
	var id = [r, q, 2];
	var neighbors =  [];
	let sq3 = Math.sqrt(3)/2;
	let coef1 = Math.sqrt(3) +3;
	let coef2 = (Math.sqrt(3) +1)/2;

	neighbors.push([r, q, 0]);
	neighbors.push([r-Math.abs(q+1)%2, q-1, 0]);
	neighbors.push([r, q-2, 4]);
	neighbors.push([r-Math.abs(q+1)%2, q-1, 5]);

	var bounds = [];

	bounds.push(coef1*(r+1/2*(Math.abs(q)%2))-1,q*coef2);
	bounds.push(coef1*(r+1/2*(Math.abs(q)%2))-1/2,q*coef2-sq3);
	bounds.push(coef1*(r+1/2*(Math.abs(q)%2))-1/2-sq3,q*coef2-sq3-1/2);
	bounds.push(coef1*(r+1/2*(Math.abs(q)%2))-1-sq3,q*coef2-1/2);

	return new Tile(id, neighbors, bounds, 4);
}

function rbtrhSqu3(r, q){
	var id = [r, q, 3];
	var neighbors =  [];
	let sq3 = Math.sqrt(3)/2;
	let coef1 = Math.sqrt(3) +3;
	let coef2 = (Math.sqrt(3) +1)/2;

	neighbors.push([r, q, 0]);
	neighbors.push([r+1-Math.abs(q+1)%2, q-1, 0]);
	neighbors.push([r, q-2, 5]);
	neighbors.push([r+1-Math.abs(q+1)%2, q-1, 4]);

	var bounds = [];

	bounds.push(coef1*(r+1/2*(Math.abs(q)%2))+1, q*coef2);
	bounds.push(coef1*(r+1/2*(Math.abs(q)%2))+1/2,q*coef2-sq3);
	bounds.push(coef1*(r+1/2*(Math.abs(q)%2))+1/2+sq3,q*coef2-sq3-1/2);
	bounds.push(coef1*(r+1/2*(Math.abs(q)%2))+1+sq3, q*coef2-1/2);


	return new Tile(id, neighbors, bounds, 4);
}

function rbtrhTri4(r, q){
	var id = [r, q, 4];
	var neighbors =  [];
	let sq3 = Math.sqrt(3)/2;
	let coef1 = Math.sqrt(3) +3;
	let coef2 = (Math.sqrt(3) +1)/2;

	neighbors.push([r, q, 1]);
	neighbors.push([r, q+2, 2]);
	neighbors.push([r-1+Math.abs(q)%2, q+1, 3]);

	var bounds = [];

	bounds.push(coef1*(r+1/2*(Math.abs(q)%2))-1/2,q*coef2+sq3);
	bounds.push(coef1*(r+1/2*(Math.abs(q)%2))-1/2,q*coef2+sq3+1);
	bounds.push(coef1*(r+1/2*(Math.abs(q)%2))-1/2-sq3,q*coef2+sq3+1/2);


	return new Tile(id, neighbors, bounds, 3);
}

function rbtrhTri5(r, q){
	var id = [r, q, 5];
	var neighbors =  [];
	let sq3 = Math.sqrt(3)/2;
	let coef1 = Math.sqrt(3) +3;
	let coef2 = (Math.sqrt(3) +1)/2;

	neighbors.push([r, q, 1]);
	neighbors.push([r+Math.abs(q)%2, q+1, 2]);
	neighbors.push([r, q+2, 3]);

	var bounds = [];

	bounds.push(coef1*(r+1/2*(Math.abs(q)%2))+1/2,q*coef2+sq3);
	bounds.push(coef1*(r+1/2*(Math.abs(q)%2))+1/2,q*coef2+sq3+1);
	bounds.push(coef1*(r+1/2*(Math.abs(q)%2))+1/2+sq3,q*coef2+sq3+1/2);


	return new Tile(id, neighbors, bounds, 3);
}
