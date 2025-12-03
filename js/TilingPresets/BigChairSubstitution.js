// BigChair substitution
// https://tilings.math.uni-bielefeld.de/substitution/chair-variant/

// [1] base tile

var bounds = [0,0, 2,0, 2,1, 1,1, 1,2, 0,2];
var chair = new Tile(['chair'], [], bounds, 8);


// [2] define tile substitution for bigChair
function substitutionBigChair(tile){
    var newtiles = [];
    var newc1 = tile.myclone();
    newc1.id.push('1');
    newc1.scale(tile.bounds[0],tile.bounds[1], 1/3);
    newtiles.push(newc1)
    var newc2 = tile.myclone();
    newc2.id.push('2');
    newc2.scale(tile.bounds[6], tile.bounds[7], 1/3);
    newtiles.push(newc2);
    var newc3 = tile.myclone();
    newc3.id.push('3');
    newc3.scale( (tile.bounds[6]+tile.bounds[0])/2, (tile.bounds[7]+tile.bounds[1])/2, 1/3);
    newtiles.push(newc3);
    var newc4 = tile.myclone();
    newc4.id.push('4');
    newc4.scale(tile.bounds[0],tile.bounds[1], 1/3);
    newc4.rotate(newc2.bounds[0], newc2.bounds[1], Math.PI/2);
    newtiles.push(newc4);
    var newc5 = tile.myclone();
    newc5.id.push('5');
    newc5.scale(tile.bounds[0],tile.bounds[1], 1/3);
    newc5.rotate(newc2.bounds[0], newc2.bounds[1], -Math.PI/2);
    newtiles.push(newc5);
    var newc6 = tile.myclone();
    newc6.id.push('6');
    newc6.rotate(tile.bounds[6],tile.bounds[7],Math.PI/2);
    newc6.scale(newc6.bounds[0], newc6.bounds[1], 1/3);
    newtiles.push(newc6);
    var newc7 = tile.myclone();
    newc7.id.push('7');
    newc7.rotate(tile.bounds[6],tile.bounds[7], -Math.PI/2);
    newc7.scale(tile.bounds[2],tile.bounds[3], 1/3);
    newc7.shift(newc1.bounds[4]-newc1.bounds[2], newc1.bounds[5]-newc1.bounds[3]);
    newtiles.push(newc7);
    var newc8 = tile.myclone();
    newc8.id.push('8');
    newc8.rotate(tile.bounds[6],tile.bounds[7],-Math.PI/2);
    newc8.scale(newc8.bounds[0],newc8.bounds[1],1/3);
    newtiles.push(newc8);
    var newc9 = tile.myclone();
    newc9.id.push('9');
    newc9.rotate(tile.bounds[6],tile.bounds[7], Math.PI/2);
    newc9.scale(tile.bounds[10],tile.bounds[11], 1/3);
    newc9.shift(newc1.bounds[8]-newc1.bounds[10],newc1.bounds[9]-newc1.bounds[11]);
    newtiles.push(newc9);

    return newtiles;
}

// [3] duplicates
// no duplicates


// [4] neighbor function
// "I am lazy"

// [5] clean duplicates
// no duplicates to clean


// [6] non-local neighbors
var neighbors2boundsBigChair = new Map();
neighbors2boundsBigChair.set('chair', default_neighbors2bounds(6));

var decorateBigChair = new Map();
decorateBigChair.set('chair', 0);

// [7] calling the substitute method
Tiling.BigChairSubst = function({iterations,neighborMultiplicity,neighborCondition}={}){
    var tiles = [];
    // initial tile
    var mychair = chair.myclone();
    tiles.push(mychair);
    // call the substitution
    tiles = substitute(
	iterations,
	tiles,
	3,
	substitutionBigChair,
	[],
	[],
	"I am lazy", 
	neighbors2boundsBigChair,
	decorateBigChair,
	neighborCondition,// neighborhood condition is "fullEdge" or "partialEdge"
	neighborMultiplicity // neighborhood multiplicity (bool)
    );
    return new Tiling(tiles);
}
