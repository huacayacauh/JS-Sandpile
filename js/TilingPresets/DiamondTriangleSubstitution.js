// Diamond triangle
// substitution described at
// https://tilings.math.uni-bielefeld.de/substitution/diamond-triangle/

//
// [0] toolbox
//

//
// [1] define tile types triangle and parallelogramme
//

// dtriangle
var bounds = [];
bounds.push(0,0);
bounds.push(2,0);
bounds.push(1,Math.sqrt(3)); // REMARK replaces rotatePoint(2,0,0,0,Math.PI/3) by (1, Math.sqrt(3))
var dtriangle = new Tile(['dtriangle'], [], bounds, 3);

// dparallelogram
var bounds = [];
bounds.push(0,0);
bounds.push(1,0);
bounds.push(1/2,Math.sqrt(3)/2);
bounds.push(-1/2,Math.sqrt(3)/2);
var dparallelogram = new Tile(['dparallelogram'], [], bounds, 4);

function TRIANGLE(){
    return dtriangle.myclone()

}

function PARALLELOGRAMME(){
    return dparallelogram.myclone();

}

// convert a triangle to a parallelogramme
Tile.prototype.triangle2para = function(){
	this.id[0] = 'dparallelogram';
	this.bounds[2] = (this.bounds[0] + this.bounds[2])/2; 
	this.bounds[3] = (this.bounds[1] + this.bounds[3])/2;
	this.bounds[4] = (this.bounds[0] + this.bounds[4])/2;
	this.bounds[5] = (this.bounds[1] + this.bounds[5])/2;
	point_numero_4 = rotatePoint(this.bounds[2], this.bounds[3], this.bounds[0], this.bounds[1], (2*Math.PI)/3);
	this.bounds[6] = point_numero_4[0];
	this.bounds[7] = point_numero_4[1];
	this.limit = 4;
}

// convert a parallelogramme to a triangle
Tile.prototype.para2triangle = function(){
	this.id[0] = 'dtriangle';
	let distance_des_x = Math.abs(this.bounds[2] - this.bounds[0]);
	let distance_des_y = Math.abs(this.bounds[1] - this.bounds[3]);
	if (this.bounds[2] < this.bounds[0]){
		this.bounds[2] = this.bounds[2] - distance_des_x;
	}
	else{
		this.bounds[2] = this.bounds[2] + distance_des_x;
	}
	if (this.bounds[3] < this.bounds[1]){
		this.bounds[3] = this.bounds[3] - distance_des_y;
	}
	else{
		this.bounds[3] = this.bounds[3] + distance_des_y;
	}
	let sommet = rotatePoint(this.bounds[2], this.bounds[3], this.bounds[0], this.bounds[1], Math.PI/3);
	this.bounds[4] = sommet[0];
	this.bounds[5] = sommet[1];
	this.bounds.pop();
	this.bounds.pop();
	this.limit = 3;
}


//
// [2] define substitution diamond triangle
//
function subsitutionDT(tile){
	switch (tile.id[0]){
		case 'dtriangle':
	                // substitution σ : triangle -> 3 triangles + 12 parallelograms 
			var new_tiles = [];
			let centre_triangle = [];
			centre_triangle.push((tile.bounds[0] + tile.bounds[2] + tile.bounds[4])/3)
			centre_triangle.push((tile.bounds[1] + tile.bounds[3] + tile.bounds[5])/3)
	                // computing the tiles
	                // the 3 triangles new_t1, new_t2 and new_t3
			var new_t1 = tile.myclone();
			new_t1.scale(new_t1.bounds[0], new_t1.bounds[1], 1/3);
			var new_t2 = tile.myclone();
			new_t2.scale(new_t2.bounds[2], new_t2.bounds[3], 1/3);
			var new_t3 = tile.myclone();
			new_t3.scale(new_t3.bounds[4], new_t3.bounds[5], 1/3);
			// the 12 parallelograms new_p1 to new_p12
			var new_p1 = tile.myclone();
			new_p1.scale(new_p1.bounds[4], new_p1.bounds[5], 2/3) ;
			new_p1.scale(new_p1.bounds[0], new_p1.bounds[1], 3/4) ;
			new_p1.scale(new_p1.bounds[2], new_p1.bounds[3], 2/3) ;
			new_p1.triangle2para();
			var new_p2 = new_p1.myclone();
			new_p2.rotate(new_p1.bounds[2], new_p1.bounds[3], Math.PI/3);
			var new_p3 = new_p1.myclone();
			new_p3.rotate(new_p1.bounds[2], new_p1.bounds[3], 2*Math.PI/3);
			var new_p4 = new_p1.myclone();
			new_p4.rotate(new_p1.bounds[2], new_p1.bounds[3], Math.PI);
			var new_p5 = new_p1.myclone();
			new_p5.rotate(new_p1.bounds[2], new_p1.bounds[3], 4*Math.PI/3);
			var new_p6 = new_p1.myclone();
			new_p6.rotate(new_p1.bounds[2], new_p1.bounds[3], 5*Math.PI/3);
			var new_p7 = new_p1.myclone();
			new_p7.rotate(new_p7.bounds[6], new_p7.bounds[7], -Math.PI/3);
			var new_p8 = new_p2.myclone();
			new_p8.rotate(new_p8.bounds[6], new_p8.bounds[7], -Math.PI/3);
			var new_p9 = new_p3.myclone();
			new_p9.rotate(new_p9.bounds[6], new_p9.bounds[7], -Math.PI/3);
			var new_p10 = new_p4.myclone();
			new_p10.rotate(new_p10.bounds[6], new_p10.bounds[7], -Math.PI/3);
			var new_p11 = new_p5.myclone();
			new_p11.rotate(new_p11.bounds[6], new_p11.bounds[7], -Math.PI/3);
			var new_p12 = new_p6.myclone();
			new_p12.rotate(new_p12.bounds[6], new_p12.bounds[7], -Math.PI/3);	
	                // adding the new labels in tile.id
	                new_t1.id.push('t1');
			new_t2.id.push('t2');
			new_t3.id.push('t3');
			new_p1.id.push('p1');
			new_p2.id.push('p2');
			new_p3.id.push('p3');
			new_p4.id.push('p4');
			new_p5.id.push('p5');
			new_p6.id.push('p6');
			new_p7.id.push('p7');
			new_p8.id.push('p8');
			new_p9.id.push('p9');
			new_p10.id.push('p10');
			new_p11.id.push('p11');
			new_p12.id.push('p12');
			// pushing the tiles in new_tiles
			new_tiles.push(new_t1);
			new_tiles.push(new_t2);
			new_tiles.push(new_t3);
			new_tiles.push(new_p1);
			new_tiles.push(new_p2);
			new_tiles.push(new_p3);
			new_tiles.push(new_p4);
			new_tiles.push(new_p5);
			new_tiles.push(new_p6);
			new_tiles.push(new_p7);
			new_tiles.push(new_p8);
			new_tiles.push(new_p9);
			new_tiles.push(new_p10);
			new_tiles.push(new_p11);
			new_tiles.push(new_p12);		
			return new_tiles;
			break;

		case 'dparallelogram':
                        // substiution σ : parallelogram -> 5 parallelograms and 2 triangles
	    		var new_tiles = [];
			// computing the parallelograms
	                var new_p1 = tile.myclone();
			new_p1.scale(new_p1.bounds[6], new_p1.bounds[7], 2/3);
			new_p1.scale(new_p1.bounds[2], new_p1.bounds[3], 1/2);
			var new_p2 = new_p1.myclone();
			new_p2.rotate(new_p2.bounds[2], new_p2.bounds[3], Math.PI/3);
			new_p2.rotate((new_p2.bounds[2] + new_p2.bounds[6])/2, (new_p2.bounds[3] + new_p2.bounds[7])/2, Math.PI);
			var new_p3 = new_p1.myclone();
			new_p3.rotate(new_p3.bounds[2], new_p3.bounds[3], -Math.PI/3);
			new_p3.rotate((new_p3.bounds[2] + new_p3.bounds[6])/2, (new_p3.bounds[3] + new_p3.bounds[7])/2, Math.PI);
			var new_p4 = new_p1.myclone();
			new_p4.rotate(new_p4.bounds[6], new_p4.bounds[7], Math.PI/3);
			new_p4.rotate((new_p4.bounds[2] + new_p4.bounds[6])/2, (new_p4.bounds[3] + new_p4.bounds[7])/2, Math.PI);
			var new_p5 = new_p1.myclone();
			new_p5.rotate(new_p5.bounds[6], new_p5.bounds[7], -Math.PI/3);
			new_p5.rotate((new_p5.bounds[2] + new_p5.bounds[6])/2, (new_p5.bounds[3] + new_p5.bounds[7])/2, Math.PI);
			// computing the triangles
			var new_t1 = tile.myclone();
			new_t1.scale(new_t1.bounds[2], new_t1.bounds[3], 2/3);
			new_t1.scale(new_t1.bounds[0], new_t1.bounds[1], 1/2);
			new_t1.para2triangle();
			var new_t2 = new_t1.myclone();
			new_t2.scale((new_p1.bounds[0]+new_p1.bounds[4])/2, (new_p1.bounds[1]+new_p1.bounds[5])/2, -1);
			// adding the new labels to tile.id
			new_t1.id.push('T1');
			new_t2.id.push('T2');
			new_p1.id.push('P1');
			new_p2.id.push('P2');
			new_p3.id.push('P3');
			new_p4.id.push('P4');
			new_p5.id.push('P5');
			// pushing the tiles in new_tiles
			new_tiles.push(new_t1);
			new_tiles.push(new_p1);
			new_tiles.push(new_p2);
			new_tiles.push(new_p3);
			new_tiles.push(new_p4);
			new_tiles.push(new_p5);
			new_tiles.push(new_t2);
			return new_tiles;
			break;
	}
}

//
// [3] no duplicated tiles
// [4] I'm lazy
//

//
// [6] use default neighbors2bounds
//
var neighbors2boundsDT = new Map();
neighbors2boundsDT.set('dtriangle',default_neighbors2bounds(3));
neighbors2boundsDT.set('dparallelogram',default_neighbors2bounds(4));

//
// [7] construct base tilings and call substitute
//

// prepare decoration
var decorateDT = new Map();
decorateDT.set('dtriangle',0);
decorateDT.set('dparallelogram',1);

//
// [7.1] construct "Diamond triangle by subst" tiling by substitution
// 
Tiling.DiamondTriangle = function({iterations, neighborMultiplicity, neighborCondition} = {}){
        // neighborFunc // NOTE this comment is used by hideParams(), do not remove
	var new_tiles = [];
	let tile_2 = dtriangle.myclone();
	tile_2.shift(-1, -Math.sqrt(3)/3)
	new_tiles.push(tile_2);		
	new_tiles = substitute(
		iterations, 
		new_tiles, 
		3, 
		subsitutionDT, 
		[], 
		[], 
		"I am lazy", 
		neighbors2boundsDT, 
		decorateDT, 
	        neighborCondition,
	        neighborMultiplicity
	);
        // construct tiling 
	return new Tiling(new_tiles);
}
