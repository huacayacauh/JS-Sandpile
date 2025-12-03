// Pentomino chair substitution
// was unable to find a clear reference
// see https://www.iec.hiroshima-u.ac.jp/~imai/docs/corona-limit.pdf page 64 substitution number (6)
// see https://mathworld.wolfram.com/Rep-Tile.html

// [1] base tile
var bounds = [0,0, 2,0, 2,2, 1,2, 1,3, 0,3];
var pentoChair = new Tile(['pentochair'],[],bounds,6);

// [2] tile substiution for Pentomino Chair
function substitutionPentoChair(tile){
    var newtiles = [];
    var newc1 = tile.myclone();
    newc1.id.push('1');
    newc1.scale(tile.bounds[0],tile.bounds[1],1/2);
    newtiles.push(newc1)
    var newc2 = tile.myclone();
    newc2.id.push('2');
    newc2.scale(tile.bounds[0],tile.bounds[1],1/2);
    newc2.reflect(newc2.bounds[2],newc2.bounds[3], newc2.bounds[4]-newc2.bounds[2], newc2.bounds[5]-newc2.bounds[3]);
    newtiles.push(newc2);
    var newc3 = tile.myclone();
    newc3.id.push('3');
    newc3.scale(tile.bounds[0],tile.bounds[1],1/2);
    newc3.reflect(newc3.bounds[10],newc3.bounds[11], newc3.bounds[10]-newc3.bounds[8], newc3.bounds[11]-newc3.bounds[9]);
    newtiles.push(newc3);
    var newc4 = tile.myclone();
    newc4.id.push('4');
    newc4.scale(tile.bounds[6],tile.bounds[7],1/2);
    newc4.reflect(tile.bounds[6], tile.bounds[7], newc4.bounds[4]-newc4.bounds[2], newc4.bounds[5]-newc4.bounds[3]);
    newc4.reflect(newc4.bounds[2], newc4.bounds[3], newc4.bounds[10]-newc4.bounds[6], newc4.bounds[11]-newc4.bounds[7]);
    newtiles.push(newc4);
    return newtiles;
}

// [3] duplicated tiles : none

// [4] neighborhood : I am lazy

// [5] clean duplicates : no duplicates to clean

// [6] non-local neighbors : default method
var neighbors2boundsPentoChair = new Map();
neighbors2boundsPentoChair.set('pentochair', default_neighbors2bounds(6));

var decoratePentoChair = new Map();
decoratePentoChair.set('pentochair', 0);

// [7] calling the substitute method

Tiling.PentominoChairSubst = function({iterations, neighborMultiplicity, neighborCondition}={}){
    var tiles = [];
    // initial tile
    var mypentochair = pentoChair.myclone();
    //mypentochair.reflect(0,0,1,0);
    tiles.push(mypentochair);
    // call the substitution
    tiles = substitute(
	iterations,
	tiles,
	2,
	substitutionPentoChair,
	[],
	[],
	"I am lazy",
	neighbors2boundsPentoChair,
	decoratePentoChair,
	neighborCondition,
	neighborMultiplicity
    );
    return new Tiling(tiles);
}
