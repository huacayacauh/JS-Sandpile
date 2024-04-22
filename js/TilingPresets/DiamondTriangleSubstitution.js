// Diamond triangle
// substitution described at
// https://tilings.math.uni-bielefeld.de/substitution/diamond-triangle/

//
// [0] toolbox
//

//
// [1] define tile types triangle and parallelogramme
//

function TRIANGLE(){
	var bounds = [];
	bounds.push(0, 0);
	bounds.push(2, 0);
	let c1 = rotatePoint(2, 0, 0, 0, Math.PI/3)[0];
	let c2 = rotatePoint(2, 0, 0, 0, Math.PI/3)[1];
	bounds.push(c1, c2);
	return new Tile(['TRIANGLE'], [], bounds, 3);
}

function PARALLELOGRAMME(){
	var bounds = [];
	bounds.push(0, 0);
	bounds.push(1, 0);
	let c1 = rotatePoint(1, 0, 0, 0, Math.PI/3)[0];
	let c2 = rotatePoint(1, 0, 0, 0, Math.PI/3)[1];
	bounds.push(c1, c2);
	let c3 = rotatePoint(1, 0, 0, 0, 2*Math.PI/3)[0];
	let c4 = rotatePoint(1, 0, 0, 0, 2*Math.PI/3)[1];
	bounds.push(c3, c4);
	return new Tile(['PARALLELOGRAMME'], [], bounds, 4);
}

// convert a triangle to a parallelogramme
Tile.prototype.triangle2para = function(){
	this.id = ['PARALLELOGRAMME'];
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
	this.id = ['TRIANGLE'];
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
	this.bounds.splice(-2);
  this.limit = 3;
}

//
// [2] define substitution diamond triangle
//

function subsitution(tile){
	switch (tile.id[0]){
		case 'TRIANGLE':
			//
      // -------------------------------
      // triangle substitution -> 3 triangles, 12 parallelogrammes
      // -------------------------------
      //
			var newtiles = [];

      // PARALLELOGRAMMES
			//FLEUR
			var new_parallelogramme_1 = tile.myclone();
			new_parallelogramme_1.triangle2para();

			let d_des_x = Math.abs(new_parallelogramme_1.bounds[0] - new_parallelogramme_1.bounds[2]);
			let d_des_y = Math.abs(new_parallelogramme_1.bounds[1] - new_parallelogramme_1.bounds[3]);

			if (new_parallelogramme_1.bounds[2] < new_parallelogramme_1.bounds[0]){
				new_parallelogramme_1.shift(-d_des_x, 0);
			}
			else{
				new_parallelogramme_1.shift(d_des_x, 0);
			}
			if (new_parallelogramme_1.bounds[3] < new_parallelogramme_1.bounds[1]){
				new_parallelogramme_1.shift(0, -d_des_y);
			}
			else{
				new_parallelogramme_1.shift(0, d_des_y);
			}
      
			var new_parallelogramme_2 = new_parallelogramme_1.myclone();
			new_parallelogramme_2.rotate(new_parallelogramme_1.bounds[6], new_parallelogramme_1.bounds[7], Math.PI/3);
			new_parallelogramme_2.rotate((new_parallelogramme_2.bounds[2] + new_parallelogramme_2.bounds[6])/2, (new_parallelogramme_2.bounds[3] + new_parallelogramme_2.bounds[7])/2, Math.PI);
			var new_parallelogramme_3 = new_parallelogramme_1.myclone();
			new_parallelogramme_3.rotate(new_parallelogramme_1.bounds[6], new_parallelogramme_1.bounds[7], 2*Math.PI/3);
			var new_parallelogramme_4 = new_parallelogramme_1.myclone();
			new_parallelogramme_4.rotate(new_parallelogramme_1.bounds[6], new_parallelogramme_1.bounds[7], Math.PI);
			new_parallelogramme_4.rotate((new_parallelogramme_4.bounds[2] + new_parallelogramme_4.bounds[6])/2, (new_parallelogramme_4.bounds[3] + new_parallelogramme_4.bounds[7])/2, Math.PI);
			var new_parallelogramme_5 = new_parallelogramme_1.myclone();
			new_parallelogramme_5.rotate(new_parallelogramme_1.bounds[6], new_parallelogramme_1.bounds[7], 4*Math.PI/3);
			var new_parallelogramme_6 = new_parallelogramme_1.myclone();
			new_parallelogramme_6.rotate(new_parallelogramme_1.bounds[6], new_parallelogramme_1.bounds[7], 5*Math.PI/3);
			new_parallelogramme_6.rotate((new_parallelogramme_6.bounds[2] + new_parallelogramme_6.bounds[6])/2, (new_parallelogramme_6.bounds[3] + new_parallelogramme_6.bounds[7])/2, Math.PI);
	
			// TRIANGLES
			var new_triangle_1 = new_parallelogramme_1.myclone();
			new_triangle_1.rotate(new_triangle_1.bounds[2], new_triangle_1.bounds[3], Math.PI/3);
			new_triangle_1.rotate(new_triangle_1.bounds[0], new_triangle_1.bounds[1], -Math.PI/3);
			new_triangle_1.para2triangle();
			var new_triangle_2 = new_parallelogramme_5.myclone();
			new_triangle_2.rotate(new_triangle_2.bounds[2], new_triangle_2.bounds[3], 2*Math.PI/3);
			new_triangle_2.rotate(new_triangle_2.bounds[0], new_triangle_2.bounds[1], -Math.PI/3);
			new_triangle_2.rotate(new_triangle_2.bounds[2], new_triangle_2.bounds[3], Math.PI/3);
			new_triangle_2.para2triangle();
			var new_triangle_3 = new_parallelogramme_3.myclone();
			new_triangle_3.rotate(new_triangle_3.bounds[4], new_triangle_3.bounds[5], 2*Math.PI/3);
			new_triangle_3.rotate(new_triangle_3.bounds[0], new_triangle_3.bounds[1], 2*Math.PI/3);
			new_triangle_3.para2triangle();


			// AUTRES
			var new_parallelogramme_7 = new_parallelogramme_5.myclone();
			new_parallelogramme_7.rotate(new_parallelogramme_7.bounds[2], new_parallelogramme_7.bounds[3], -2*Math.PI/3);
			new_parallelogramme_7.rotate(new_parallelogramme_7.bounds[0], new_parallelogramme_7.bounds[1], -2*Math.PI/3);
			var new_parallelogramme_8 = new_parallelogramme_1.myclone();
			new_parallelogramme_8.rotate(new_parallelogramme_8.bounds[2], new_parallelogramme_8.bounds[3], Math.PI/3);
			new_parallelogramme_8.rotate((new_parallelogramme_8.bounds[2] + new_parallelogramme_8.bounds[6])/2, (new_parallelogramme_8.bounds[3] + new_parallelogramme_8.bounds[7])/2, Math.PI);
			var new_parallelogramme_9 = new_parallelogramme_1.myclone();
			new_parallelogramme_9.rotate(new_parallelogramme_9.bounds[2], new_parallelogramme_9.bounds[3], -Math.PI/3);
			new_parallelogramme_9.rotate((new_parallelogramme_9.bounds[2] + new_parallelogramme_9.bounds[6])/2, (new_parallelogramme_9.bounds[3] + new_parallelogramme_9.bounds[7])/2, Math.PI);
			var new_parallelogramme_10 = new_parallelogramme_3.myclone();
			new_parallelogramme_10.rotate(new_parallelogramme_10.bounds[0], new_parallelogramme_10.bounds[1], -2*Math.PI/3);
			var new_parallelogramme_11 = new_parallelogramme_3.myclone();
			new_parallelogramme_11.rotate(new_parallelogramme_11.bounds[2], new_parallelogramme_11.bounds[3], -Math.PI/3);
			new_parallelogramme_11.rotate((new_parallelogramme_11.bounds[2] + new_parallelogramme_11.bounds[6])/2, (new_parallelogramme_11.bounds[3] + new_parallelogramme_11.bounds[7])/2, Math.PI);
			var new_parallelogramme_12 = new_parallelogramme_5.myclone();
			new_parallelogramme_12.rotate(new_parallelogramme_12.bounds[2], new_parallelogramme_12.bounds[3], Math.PI/3);	
			new_parallelogramme_12.rotate((new_parallelogramme_12.bounds[2] + new_parallelogramme_12.bounds[6])/2, (new_parallelogramme_12.bounds[3] + new_parallelogramme_12.bounds[7])/2, Math.PI);
			
			new_triangle_1.id.push('t1');
			new_triangle_2.id.push('t2');
			new_triangle_3.id.push('t3');

			new_parallelogramme_1.id.push('p1');
			new_parallelogramme_2.id.push('p2');
			new_parallelogramme_3.id.push('p3');
			new_parallelogramme_4.id.push('p4');
			new_parallelogramme_5.id.push('p5');
			new_parallelogramme_6.id.push('p6');
			new_parallelogramme_7.id.push('p7');
			new_parallelogramme_8.id.push('p8');
			new_parallelogramme_9.id.push('p9');
			new_parallelogramme_10.id.push('p10');
			new_parallelogramme_11.id.push('p11');
			new_parallelogramme_12.id.push('p12');

			newtiles.push(new_triangle_1);
			newtiles.push(new_triangle_2);
			newtiles.push(new_triangle_3);

			newtiles.push(new_parallelogramme_1);
			newtiles.push(new_parallelogramme_2);
			newtiles.push(new_parallelogramme_3);
			newtiles.push(new_parallelogramme_4);
			newtiles.push(new_parallelogramme_5);
			newtiles.push(new_parallelogramme_6);
			newtiles.push(new_parallelogramme_7);
			newtiles.push(new_parallelogramme_8);
			newtiles.push(new_parallelogramme_9);
			newtiles.push(new_parallelogramme_10);
			newtiles.push(new_parallelogramme_11);
			newtiles.push(new_parallelogramme_12);
			
			return newtiles;
			break;

		case 'PARALLELOGRAMME':
			//
      // -------------------------------
      // parallelogramme substitution -> 5 parallelogrammes , 2 triangles
      // -------------------------------
      //
      
			//5 PARALLELOGRAMMES
			var tiles = [];

			var new_parallelogram_1 = tile.myclone();
			var new_parallelogram_2 = tile.myclone();
			new_parallelogram_2.rotate(new_parallelogram_2.bounds[2], new_parallelogram_2.bounds[3], Math.PI/3);
			new_parallelogram_2.rotate((new_parallelogram_2.bounds[2] + new_parallelogram_2.bounds[6])/2, (new_parallelogram_2.bounds[3] + new_parallelogram_2.bounds[7])/2, Math.PI);
			var new_parallelogram_3 = tile.myclone();
			new_parallelogram_3.rotate(new_parallelogram_3.bounds[2], new_parallelogram_3.bounds[3], -Math.PI/3);
			new_parallelogram_3.rotate((new_parallelogram_3.bounds[2] + new_parallelogram_3.bounds[6])/2, (new_parallelogram_3.bounds[3] + new_parallelogram_3.bounds[7])/2, Math.PI);
			var new_parallelogram_4 = tile.myclone();
			new_parallelogram_4.rotate(new_parallelogram_4.bounds[6], new_parallelogram_4.bounds[7], Math.PI/3);
			new_parallelogram_4.rotate((new_parallelogram_4.bounds[2] + new_parallelogram_4.bounds[6])/2, (new_parallelogram_4.bounds[3] + new_parallelogram_4.bounds[7])/2, Math.PI);
			var new_parallelogram_5 = tile.myclone();
			new_parallelogram_5.rotate(new_parallelogram_5.bounds[6], new_parallelogram_5.bounds[7], -Math.PI/3);
			new_parallelogram_5.rotate((new_parallelogram_5.bounds[2] + new_parallelogram_5.bounds[6])/2, (new_parallelogram_5.bounds[3] + new_parallelogram_5.bounds[7])/2, Math.PI);

			//2 TRIANGLES
			var new_TRIANGLE_1 = tile.myclone();
			new_TRIANGLE_1.rotate(new_TRIANGLE_1.bounds[6], new_TRIANGLE_1.bounds[7], 2*Math.PI/3);
			new_TRIANGLE_1.rotate(new_TRIANGLE_1.bounds[0], new_TRIANGLE_1.bounds[1], Math.PI/3);
			new_TRIANGLE_1.para2triangle();
		
			var new_TRIANGLE_2 = tile.myclone();
			new_TRIANGLE_2.rotate(new_TRIANGLE_2.bounds[2], new_TRIANGLE_2.bounds[3], Math.PI/3);
			new_TRIANGLE_2.rotate(new_TRIANGLE_2.bounds[0], new_TRIANGLE_2.bounds[1], -Math.PI/3);
			new_TRIANGLE_2.para2triangle();
			
			new_TRIANGLE_1.id.push('T1');
			new_TRIANGLE_2.id.push('T2');

			new_parallelogram_1.id.push('P1');
			new_parallelogram_2.id.push('P2');
			new_parallelogram_3.id.push('P3');
			new_parallelogram_4.id.push('P4');
			new_parallelogram_5.id.push('P5');

			tiles.push(new_TRIANGLE_1);
			tiles.push(new_TRIANGLE_2);

			tiles.push(new_parallelogram_1);
			tiles.push(new_parallelogram_2);
			tiles.push(new_parallelogram_3);
			tiles.push(new_parallelogram_4);
			tiles.push(new_parallelogram_5);
			
			return tiles;
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
var neighbors2boundsBB = new Map();
neighbors2boundsBB.set('TRIANGLE',default_neighbors2bounds(3));
neighbors2boundsBB.set('PARALLELOGRAMME',default_neighbors2bounds(4));

//
// [7] construct base tilings and call substitute
//

// prepare decoration
var decorate = new Map();
decorate.set('TRIANGLE', 0);
decorate.set('PARALLELOGRAMME', 1);

//
// [7.1] construct "Diamond triangle by subst" tiling by substitution
// 
Tiling.DiamondTriangle = function({iterations} = {}){
	var tiles = [];
	
	let tile_1 = PARALLELOGRAMME();
	tiles.push(tile_1);

	var new_parallelogram_1 = tile_1.myclone();
    var new_parallelogram_2 = tile_1.myclone();
    new_parallelogram_2.rotate(new_parallelogram_2.bounds[2], new_parallelogram_2.bounds[3], Math.PI/3);
    new_parallelogram_2.rotate((new_parallelogram_2.bounds[2] + new_parallelogram_2.bounds[6])/2, (new_parallelogram_2.bounds[3] + new_parallelogram_2.bounds[7])/2, Math.PI);
    var new_parallelogram_3 = tile_1.myclone();
    new_parallelogram_3.rotate(new_parallelogram_3.bounds[2], new_parallelogram_3.bounds[3], -Math.PI/3);
    new_parallelogram_3.rotate((new_parallelogram_3.bounds[2] + new_parallelogram_3.bounds[6])/2, (new_parallelogram_3.bounds[3] + new_parallelogram_3.bounds[7])/2, Math.PI);
    var new_parallelogram_4 = tile_1.myclone();
    new_parallelogram_4.rotate(new_parallelogram_4.bounds[6], new_parallelogram_4.bounds[7], Math.PI/3);
    new_parallelogram_4.rotate((new_parallelogram_4.bounds[2] + new_parallelogram_4.bounds[6])/2, (new_parallelogram_4.bounds[3] + new_parallelogram_4.bounds[7])/2, Math.PI);
    var new_parallelogram_5 = tile_1.myclone();
    new_parallelogram_5.rotate(new_parallelogram_5.bounds[6], new_parallelogram_5.bounds[7], -Math.PI/3);
    new_parallelogram_5.rotate((new_parallelogram_5.bounds[2] + new_parallelogram_5.bounds[6])/2, (new_parallelogram_5.bounds[3] + new_parallelogram_5.bounds[7])/2, Math.PI);

    //2 TRIANGLES
    var new_TRIANGLE_1 = tile_1.myclone();
    new_TRIANGLE_1.rotate(new_TRIANGLE_1.bounds[6], new_TRIANGLE_1.bounds[7], 2*Math.PI/3);
    new_TRIANGLE_1.rotate(new_TRIANGLE_1.bounds[0], new_TRIANGLE_1.bounds[1], Math.PI/3);
    new_TRIANGLE_1.para2triangle();

    var new_TRIANGLE_2 = tile_1.myclone();
    new_TRIANGLE_2.rotate(new_TRIANGLE_2.bounds[2], new_TRIANGLE_2.bounds[3], Math.PI/3);
    new_TRIANGLE_2.rotate(new_TRIANGLE_2.bounds[0], new_TRIANGLE_2.bounds[1], -Math.PI/3);
    new_TRIANGLE_2.para2triangle();
    
    new_TRIANGLE_1.id.push('T1');
    new_TRIANGLE_2.id.push('T2');

    new_parallelogram_1.id.push('P1');
    new_parallelogram_2.id.push('P2');
    new_parallelogram_3.id.push('P3');
    new_parallelogram_4.id.push('P4');
    new_parallelogram_5.id.push('P5');

    tiles.push(new_TRIANGLE_1);
    tiles.push(new_TRIANGLE_2);

    tiles.push(new_parallelogram_1);
    tiles.push(new_parallelogram_2);
    tiles.push(new_parallelogram_3);
    tiles.push(new_parallelogram_4);
    tiles.push(new_parallelogram_5);
			
  // call the substitution
	tiles = substitute(
    iterations, 
    tiles, 
    1, 
    subsitution, 
    [], 
    [], 
    "I am lazy",
    neighbors2boundsBB, 
    decorate
  );

	return new Tiling(tiles);
}
