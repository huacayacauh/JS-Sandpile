// Chair tiling by substitution
// https://tilings.math.uni-bielefeld.de/substitution/chair/

// [1] tuile de base
var bounds = [0,0,2,0,2,1,1,1,1,2,0,2];
var chair = new Tile(['chair'],[],bounds,8); // TODO 4 ou 5...

// [2] define tile substitution for Chair
function substitutionChair(tile){
  var newtiles = [];
  var newchair1 = tile.myclone();
  newchair1.id.push('1');
  newchair1.scale(tile.bounds[6],tile.bounds[7],1/2);
  newtiles.push(newchair1);
  var newchair2 = tile.myclone();
  newchair2.id.push('2');
  newchair2.scale(tile.bounds[0],tile.bounds[1],1/2);
  newtiles.push(newchair2);
  var newchair3 = tile.myclone();
  newchair3.id.push('3');
  newchair3.scale(tile.bounds[0],tile.bounds[1],1/2);
  newchair3.rotate(tile.bounds[6],tile.bounds[7],Math.PI/2);
  newtiles.push(newchair3);
  var newchair4 = tile.myclone();
  newchair4.id.push('4');
  newchair4.scale(tile.bounds[0],tile.bounds[1],1/2);
  newchair4.rotate(tile.bounds[6],tile.bounds[7],-Math.PI/2);
  newtiles.push(newchair4);
  return newtiles;
}

// [3] duplicated Chair : none

var duplicatedChair = [];

// [4] neighborhood Chair : TODO empty
// "I am lazy" => default SubstitutionAPI neighbors

// [6]

var neighbors2boundsChair = new Map();
neighbors2boundsChair.set('chair',default_neighbors2bounds(6));

var decorateChair = new Map();
decorateChair.set('chair',0);

// [7]

Tiling.Chairsubst = function({iterations,neighborMultiplicity,neighborCondition}={}){
    var tiles = [];
    // initial tile
    var mychair = chair.myclone();
    tiles.push(mychair);
    // call the substitution
    tiles = substitute(
	iterations,
	tiles,
	2,
	substitutionChair,
	duplicatedChair,
	duplicatedChair,
	"I am lazy", 
	neighbors2boundsChair,
	decorateChair,
	neighborCondition,// neighborhood condition is "fullEdge" or "partialEdge"
	neighborMultiplicity // neighborhood multiplicity (bool)
    );
    return new Tiling(tiles);
}

