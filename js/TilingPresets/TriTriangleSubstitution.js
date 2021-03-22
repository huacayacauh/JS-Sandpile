// This code is part of JS-Sandpile (https://github.com/huacayacauh/JS-Sandpile/)
// CC-BY Valentin Darrigo, Jeremy Fersula, Kevin Perrot

// TriTriangle
// substitution described at
// https://tilings.math.uni-bielefeld.de/substitution/tritriangle/
// https://sites.math.washington.edu/wxml/tilings/pdfs/TriTriangle-tiling.pdf
// https://sites.math.washington.edu/wxml/tilings/source/Tritriangle.py

//
// [0] toolbox
//

var sqrt2 = Math.sqrt(2);

// [I]: Define the triangle

function getTriBounds(size) {
  var bounds = [];
  bounds.push(0, 0);
  bounds.push(size, 0);
  bounds.push(size, size);
  return bounds;
}
var littleGreen = new Tile(["littleGreen"], [], getTriBounds(1), 3);
var yellow = new Tile(["yellow"], [], getTriBounds(1), 3);
var bigGreen = new Tile(["bigGreen"], [], getTriBounds(1), 3);

// Conversion

Tile.prototype.littleGreenToYellow = function() {
  this.id[0] = 'yellow';
};
Tile.prototype.yellowToBigGreen = function() {
  this.id[0] = 'bigGreen';
};
Tile.prototype.bigGreenToLittleGreen = function() {
	this.id[0] = "littleGreen";
}

// [II]: Define Substitution 

function substitutionTriTriangle(tile) {
	switch (tile.id[0]) {
		case "littleGreen":
			tile.littleGreenToYellow();
			return tile;
			break;
		case "yellow":
			tile.yellowToBigGreen();
			return tile;
			break;
		case "bigGreen":
			var newtiles = [];

			var lenghtTriTriangle = tile.bounds[2] - tile.bounds[0]
			
			var littleGreen1 = tile.myclone();
			littleGreen1.bigGreenToLittleGreen();
			littleGreen1.id.push("littleGreen1");
			littleGreen1.bounds[0] = tile.bounds[2] + 1/2*(tile.bounds[4] - tile.bounds[2]); // Simplifié
			littleGreen1.bounds[1] = tile.bounds[3] + 1/2*(tile.bounds[5] - tile.bounds[3]); // Simplifié
			littleGreen1.bounds[2] = tile.bounds[0] + 3/4* (tile.bounds[4] - tile.bounds[0]); 
			littleGreen1.bounds[3] = tile.bounds[1] + 3/4*(tile.bounds[5] - tile.bounds[1]);
			littleGreen1.bounds[4] = tile.bounds[4];
			littleGreen1.bounds[5] = tile.bounds[5];
			newtiles.push(littleGreen1);
			
			var littleGreen4 = littleGreen1.myclone();
			littleGreen4.id.push("littleGreen4");
			littleGreen4.shift((tile.bounds[2] - tile.bounds[4])/2,(tile.bounds[3] - tile.bounds[5])/2);
			
			var littleGreen2 = littleGreen1.myclone();
			littleGreen2.id.push("littleGreen2"); // Change ID 
			littleGreen2.bounds[0] = tile.bounds[0] + 1/2* (tile.bounds[4] - tile.bounds[0]);
			littleGreen2.bounds[1] = tile.bounds[1] + 1/2*(tile.bounds[5] - tile.bounds[1]);
			littleGreen2.bounds[2] = tile.bounds[0] + 3/4* (tile.bounds[4] - tile.bounds[0]);
			littleGreen2.bounds[3] = tile.bounds[1] + 3/4*(tile.bounds[5] - tile.bounds[1]);
			littleGreen2.bounds[4] = littleGreen1.bounds[0];
			littleGreen2.bounds[5] = littleGreen1.bounds[1];

			newtiles.push(littleGreen2);
			
			var littleGreen3 = littleGreen2.myclone();
			littleGreen3.id.push("littleGreen3");
			littleGreen3.bounds[0] = littleGreen2.bounds[0];
			littleGreen3.bounds[1] = littleGreen2.bounds[1];
			littleGreen3.bounds[2] = littleGreen4.bounds[2];
			littleGreen3.bounds[3] = littleGreen4.bounds[3];
			littleGreen3.bounds[4] = littleGreen1.bounds[0];
			littleGreen3.bounds[5] = littleGreen1.bounds[1];
			newtiles.push(littleGreen3);
			
			newtiles.push(littleGreen4);
			
			var newBigGreen = tile.myclone();// No duplication, we reuse the older triangle
			newBigGreen.id.push("bigGreen");
			newBigGreen.bounds[0] = tile.bounds[0];
			newBigGreen.bounds[1] = tile.bounds[1];
			newBigGreen.bounds[2] = littleGreen2.bounds[0];
			newBigGreen.bounds[3] = littleGreen2.bounds[1];
			newBigGreen.bounds[4] = tile.bounds[2];
			newBigGreen.bounds[5] = tile.bounds[3];
			//newBigGreen.shift(lenghtTriTriangle, lenghtTriTriangle);
			newtiles.push(newBigGreen);
			
			return newtiles;
			break;
		default:		
			console.log("caution: undefined tile type for substitutionP2, id="+tile.id);
			break;
	}
}

// [3] no duplication
// [4] I am lazy


// prepare decoration
decorateTriTriangle = new Map();
decorateTriTriangle.set('littleGreen',0);
decorateTriTriangle.set('yellow',1);
decorateTriTriangle.set('bigGreen',2);
decorateTriTriangle.set('littleGreen1',3);
// [6]

var neighbors2boundsTriTriangle = new Map();
neighbors2boundsTriTriangle.set('littleGreen', default_neighbors2bounds(3));
neighbors2boundsTriTriangle.set('yellow', default_neighbors2bounds(3));
neighbors2boundsTriTriangle.set('bigGreen', default_neighbors2bounds(3));

// [7] construct base tilings and call substitute

Tiling.TriTriangleBySubst = function({iterations}={}){
  var tiles = [];
  var theLittleGreen = littleGreen.myclone();
  tiles.push(theLittleGreen);
  tiles = substitute(
    iterations,
    tiles,
    1,
    substitutionTriTriangle,
    [], // no duplicated tiles
    [], // no duplicated tiles
    "laziness", // myneighbors
    neighbors2boundsTriTriangle,
    decorateTriTriangle // decorateTT
  );
  return new Tiling(tiles);
}