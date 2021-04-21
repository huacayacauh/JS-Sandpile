let sq2 = Math.sqrt(2);

var bounds = [];
bounds.push(0,0);
bounds.push(-sq2,sq2);
bounds.push(-sq2/2,sq2*3/2);
bounds.push(0,sq2);
bounds.push(sq2/2,sq2*3/2);
bounds.push(sq2,sq2);

var w = new Tile(['w'],[],bounds,5)

Tile.prototype.tile2w = function(){
	this.id[0] = 'w';
}

Tile.prototype.tile2o = function(){
	this.id[0] = 'o';
}

Tile.prototype.tile2b = function(){
	this.id[0] = 'b';
}

function substitutionChair(tile){
	var newtiles = [];

	var neww1 = tile.myclone();
	neww1.id.push('w1');
	neww1.tile2w();
	neww1.scale(neww1.bounds[0],neww1.bounds[1],1/2);
	newtiles.push(neww1);

	var newo1 = tile.myclone();
	newo1.id.push('o1');
	newo1.tile2o();
	newo1.scale(newo1.bounds[6],newo1.bounds[7],1/2);
	newtiles.push(newo1);

	var newb1 = tile.myclone();
	newb1.id.push('b1');
	newb1.tile2b();
	newb1.rotate(newb1.bounds[6],newb1.bounds[7],-Math.PI/2);
	newb1.scale(newb1.bounds[0],newb1.bounds[1],1/2);
	newtiles.push(newb1);

	var newb2 = tile.myclone();
	newb2.id.push('b2');
	newb2.tile2b();
	newb2.rotate(newb2.bounds[6],newb2.bounds[7],Math.PI/2);
	newb2.scale(newb2.bounds[0],newb2.bounds[1],1/2);
	newtiles.push(newb2);

	return newtiles;
}

var neighbors2boundsChair = new Map();
neighbors2boundsChair.set('w', default_neighbors2bounds(6));
neighbors2boundsChair.set('o', default_neighbors2bounds(6));
neighbors2boundsChair.set('b', default_neighbors2bounds(6));

decorateChair = new Map();
decorateChair.set('w',0);
decorateChair.set('o',1);
decorateChair.set('b',2);

Tiling.ChairSubstitution = function({iterations}={}){
	var tiles = []
	var myw = w.myclone();
	tiles.push(myw);

	tiles = substituteGeneral(
	iterations,
	tiles,
	2,
	substitutionChair,
	[],
	[],
	"general",
	neighbors2boundsChair,
	decorateChair
	);
	return new Tiling(tiles);
}
