var golden_ration = (Math.sqrt(5) +1)/2;
var gamma = Math.pow(golden_ration,0.5);
//define the AmmanChair2
var bounds = [];
bounds.push(0,0);
bounds.push(Math.pow(gamma,5),0);
bounds.push(1*Math.pow(gamma,5),1*Math.pow(gamma,4));
bounds.push(1*(Math.pow(gamma,5)-gamma),1*Math.pow(gamma,4));
bounds.push(1*(Math.pow(gamma,5)-gamma),1*Math.pow(gamma,6));
bounds.push(0,Math.pow(gamma,6));
var littlechair = new Tile(['littlechair'],[],bounds,6);

var bounds = [];
bounds.push(0,0);
bounds.push(gamma*Math.pow(gamma,5),0);
bounds.push(gamma*Math.pow(gamma,5),gamma*Math.pow(gamma,4));
bounds.push(gamma*(Math.pow(gamma,5)-gamma),gamma*Math.pow(gamma,4));
bounds.push(gamma*(Math.pow(gamma,5)-gamma),gamma*Math.pow(gamma,6));
bounds.push(0,gamma*Math.pow(gamma,6));
var bigchair = new Tile(['bigchair'],[],bounds,6);
// conversion
Tile.prototype.littleChairToBigChair = function() {
  this.id[0] = 'bigchair';
};


function substitutionA2(tile){
	switch(tile.id[0]){
		case 'littlechair':
		  var newtiles = [];
		  var newChild = tile.myclone();
		  newChild.littleChairToBigChair();
		  newChild.id.push('littlechair1');
		 // newChild.shift(tile.bounds[2]-tile.bounds[0],tile.bounds[3]-tile.bounds[1]);
		  newtiles.push(newChild);
		case 'bigchair':
          //translation symetrique puis rotation
		  break;
		default:
		  console.log("caution: undefined tile type for substitutionA2, id="+tile.id);
	}

}

var neighbors2boundsA2 = new Map();
neighbors2boundsA2.set("littlechair",default_neighbors2bounds(6));
neighbors2boundsA2.set("bigchair",default_neighbors2bounds(6));

// prepare decoration
decorateA2 = new Map();
decorateA2.set('littlechair',0);
decorateA2.set('bigchair',1);


Tiling.A2bysubs = function({iterations}={}){
  var tiles = [];
  var thelittleChair = littlechair.myclone();
  tiles.push(thelittleChair);
  tiles = substituteGeneral(
    iterations,
    tiles,
    1+gamma,
    substitutionA2,
    [], // no duplicated tiles
    [], // no duplicated tiles
    "general", // myneighbors
    neighbors2boundsA2,
    decorateA2 // decorateTT
  );
  return new Tiling(tiles);
}