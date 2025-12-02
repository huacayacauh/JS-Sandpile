// Armchair tiling by substitution
// https://tilings.math.uni-bielefeld.de/substitution/armchair/

// [1] tuile de base
var bounds = [0,0,3,0,3,1,1,1,1,2,0,2];
var armChair = new Tile(['armchair'],[],bounds,6);

// [2]
function substitutionArmChair(tile){
    var newtiles = [];
    var newac1 = tile.myclone();
    newac1.id.push('1');
    newac1.scale(tile.bounds[0],tile.bounds[1], 1/2);
    newac1.rotate(tile.bounds[0],tile.bounds[1], Math.PI/2);
    newac1.shift(newac1.bounds[0]-newac1.bounds[10], newac1.bounds[1] - newac1.bounds[11]);
    newtiles.push(newac1);
    var newac2 = tile.myclone();
    newac2.id.push('2');
    newac2.scale(tile.bounds[0],tile.bounds[1], 1/2);
    newac2.rotate(tile.bounds[0],tile.bounds[1], -Math.PI/2);
    newac2.shift(newac1.bounds[8]-newac2.bounds[2],newac1.bounds[9]-newac2.bounds[3]);
    newtiles.push(newac2);
    var newac3 = tile.myclone();
    newac3.id.push('3');
    newac3.scale(tile.bounds[0],tile.bounds[1], 1/2);
    newac3.shift(newac1.bounds[0]-newac1.bounds[10], newac1.bounds[1] - newac1.bounds[11]);
    newtiles.push(newac3);
    var newac4 = tile.myclone();
    newac4.id.push('4');
    newac4.scale(tile.bounds[0],tile.bounds[1], 1/2);
    newac4.rotate(tile.bounds[0], tile.bounds[1], Math.PI);
    newac4.shift(newac3.bounds[8]-newac4.bounds[2],newac3.bounds[9]-newac4.bounds[3]);
    newtiles.push(newac4);
    return newtiles;
}




// [6]
var neighbors2boundsArmChair = new Map();
neighbors2boundsArmChair.set('armchair', default_neighbors2bounds(6));

var decorateArmChair = new Map();
decorateArmChair.set('armchair',0);


Tiling.ArmChairSubst = function({iterations, neighborMultiplicity, neighborCondition}={}){
    var tiles = [];
    // initial tiles
    var myarmchair = armChair.myclone();
    myarmchair.shift(-1.5,-0.5);
    tiles.push(myarmchair);
    // call the substitution
    tiles = substitute(
	iterations,
	tiles,
	2,
	substitutionArmChair,
	[],
	[],
	"I am lazy",
	neighbors2boundsArmChair,
	decorateArmChair,
	neighborCondition,
	neighborMultiplicity
    );
    return new Tiling(tiles);
}

    
