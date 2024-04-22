// Equithirds
// substitution described at
// https://tilings.math.uni-bielefeld.de/substitution/equithirds/

//
// [0] toolbox
//

// golden ratio
var phi = (1+Math.sqrt(5))/2;

// sqrt(3)
var sqrt3 = Math.sqrt(3);

//
// [1] define tile types Eq
//

// equi
var bounds = [];
bounds.push(-0.5,-0.5*(sqrt3/3)); // left
bounds.push(0.5,-0.5*(sqrt3/3)); // right
bounds.push(0,sqrt3/3); // up
var equi = new Tile(['equi'],[],bounds,3);

// iso
var bounds = [];
bounds.push(-(sqrt3/2),-0.5/2);
bounds.push((sqrt3/2),-0.5/2);
bounds.push(0,0.5/2);
var iso = new Tile(['iso'],[],bounds,3);

// convert equi to iso
Tile.prototype.equi2iso = function(){
  this.id[0]='iso';
  let e2 = (this.bounds[2]-this.bounds[0]) * sqrt3 + this.bounds[0];
  let e3 = (this.bounds[3]-this.bounds[1]) * sqrt3 + this.bounds[1];
  let e4 = ((this.bounds[2]-this.bounds[0]) * (sqrt3/2) - (this.bounds[3]-this.bounds[1]) * 0.5) + this.bounds[0];
  let e5 = ((this.bounds[3]-this.bounds[1]) * (sqrt3/2) + (this.bounds[2]-this.bounds[0]) * 0.5) + this.bounds[1];
  this.bounds[2] = e2;
  this.bounds[3] = e3;
  this.bounds[4] = e4;
  this.bounds[5] = e5;
}

// convert iso to equi
Tile.prototype.iso2equi = function(){
  this.id[0]='equi';
  let i2 = (this.bounds[2]-this.bounds[0]) / sqrt3 + this.bounds[0];
  let i3 = (this.bounds[3]-this.bounds[1]) / sqrt3 + this.bounds[1];
  let i4 = ((this.bounds[2]-this.bounds[0]) * 0.5 - (this.bounds[3]-this.bounds[1]) * (sqrt3/2)) / sqrt3 + this.bounds[0];
  let i5 = ((this.bounds[3]-this.bounds[1]) * 0.5 + (this.bounds[2]-this.bounds[0]) * (sqrt3/2)) / sqrt3 + this.bounds[1];
  this.bounds[2] = i2;
  this.bounds[3] = i3;
  this.bounds[4] = i4;
  this.bounds[5] = i5;
  }

//
// [2] define substitution Eq
//
function substitutionEq(tile){
  switch(tile.id[0]){
    case 'equi':
      //
      // -------------------------------
      // equi substitution -> 3 iso
      // -------------------------------
      //
      var newtiles = [];

	  // new iso 1 (bas)
	  var newiso1 = tile.myclone();
	  newiso1.equi2iso();
	  newiso1.id.push('iso1');
	  newiso1.scale(tile.bounds[0],tile.bounds[1],1/(sqrt3));
      newtiles.push(newiso1);

	  // new iso 2 (droit)
	  var newiso2 = tile.myclone();
	  newiso2.equi2iso();
	  newiso2.id.push('iso2');
	  newiso2.scale(tile.bounds[0],tile.bounds[1],1/(sqrt3));
	  newiso2.rotate(tile.bounds[0],tile.bounds[1],2*Math.PI/3);
      newiso2.shift(newiso1.bounds[2]-newiso1.bounds[0],newiso1.bounds[3]-newiso1.bounds[1]);
      newtiles.push(newiso2);

	  // new iso 3 (left)
	  var newiso3 = tile.myclone();
	  newiso3.equi2iso();
	  newiso3.id.push('iso3');
	  newiso3.scale(tile.bounds[0],tile.bounds[1],1/(sqrt3));
	  newiso3.rotate(tile.bounds[0],tile.bounds[1],-2*Math.PI/3);
      newiso3.shift(newiso3.bounds[0]-newiso3.bounds[2],newiso3.bounds[1]-newiso3.bounds[3]);
      newtiles.push(newiso3);

      // done
      return newtiles;
      break;

    case 'iso':
      //
      // -------------------------------
      // iso substitution -> 2 iso, 1 equi
      // -------------------------------
      //
      var newtiles = [];
      
	  // new iso 1 (left)
	  var newiso4 = tile.myclone();
	  newiso4.id.push('iso4');
	  newiso4.scale(tile.bounds[0],tile.bounds[1],1/(sqrt3));
	  newiso4.rotate(tile.bounds[0],tile.bounds[1],((7*Math.PI)/6));
	  newiso4.shift(newiso4.bounds[0]-newiso4.bounds[2],newiso4.bounds[1]-newiso4.bounds[3]);
      newtiles.push(newiso4);

	  // new iso 2 (droit) 
	  var newiso5 = tile.myclone();
	  newiso5.id.push('iso5');
	  newiso5.scale(tile.bounds[0],tile.bounds[1],1/(sqrt3));
	  newiso5.rotate(tile.bounds[0],tile.bounds[1],(5*Math.PI)/6);
      newiso5.shift((newiso5.bounds[0]-newiso5.bounds[4])*3,(newiso5.bounds[1]-newiso5.bounds[5])*3);
      newtiles.push(newiso5);

	  // new equi 1 (bas)
	  var newequi1 = tile.myclone();
	  newequi1.iso2equi();
	  newequi1.id.push('equi1');
	  newequi1.scale(tile.bounds[0],tile.bounds[1],1/(sqrt3));
      newequi1.shift(newequi1.bounds[2]-newequi1.bounds[0],newequi1.bounds[3]-newequi1.bounds[1]);
      newtiles.push(newequi1);

      // done
      return newtiles;
      break;

    default:
      // all tiles should be equi or iso
      console.log("caution: undefined tile type for substitutionEq, id="+tile.id);
  }
}

//
// [3] defined duplicated tile informations Eq
//

var duplicatedEq = [];
var duplicatedEqoriented = [];

//
// [4] fill neighbors informations in Eq newtiles (by side effect)
//

//
// [6] use default neighbors2bounds
// 
var neighbors2boundsEq = new Map();
neighbors2boundsEq.set('equi',default_neighbors2bounds(3));
neighbors2boundsEq.set('iso',default_neighbors2bounds(3));

//
// [7] construct base tilings and call substitute
//

// prepare decoration
decorateEq = new Map();
decorateEq.set('equi',0);
decorateEq.set('iso',1);

//
// [7.1] construct "Equithirds" tiling by substitution
// 
Tiling.equithirdsSubstitution = function({iterations}={}){
	var tiles = [];
    var myequi = equi.myclone();
    myequi.id.push(0);
    tiles.push(myequi);

    // call the substitution
    tiles = substitute(
      iterations,
      tiles,
      sqrt3,
      substitutionEq,
      duplicatedEq,
      duplicatedEqoriented,
      "I am lazy",
      neighbors2boundsEq,
      decorateEq
    );
    // construct tiling
    return new Tiling(tiles);
}
