// This code is part of JS-Sandpile (https://github.com/huacayacauh/JS-Sandpile/)
// CC-BY Valentin Darrigo, Jeremy Fersula, Kevin Perrot

// Triangle Incenter substitution


//
// [1] define triangular tile
//

var bounds = [];
bounds.push(-1/2, 0);
bounds.push(1/2, 0);
bounds.push(0, Math.sqrt(0.75));  // equilateral
var tri = new Tile(['triangle'],[],bounds,3);

//
// [2] define substitution 
//
function incenterSubstitution(tile){
	
	// Calculate midpoint of each segment
	var midpointABx = (tile.bounds[0] + tile.bounds[2])/2;
	var midpointABy = (tile.bounds[1] + tile.bounds[3])/2;

	var midpointBCx = (tile.bounds[2] + tile.bounds[4])/2;
	var midpointBCy = (tile.bounds[3] + tile.bounds[5])/2;

	var midpointCAx = (tile.bounds[0] + tile.bounds[4])/2;
	var midpointCAy = (tile.bounds[1] + tile.bounds[5])/2;
	
	// Calculate edges lengths in order to calculate the triangle incenter
	// Length are labeled according to the opposite vertex
	
	var lengthC = Math.sqrt(Math.pow(tile.bounds[0] - tile.bounds[2], 2) + Math.pow(tile.bounds[1] - tile.bounds[3], 2));
	var lengthA = Math.sqrt(Math.pow(tile.bounds[2] - tile.bounds[4], 2) + Math.pow(tile.bounds[3] - tile.bounds[5], 2));
	var lengthB = Math.sqrt(Math.pow(tile.bounds[0] - tile.bounds[4], 2) + Math.pow(tile.bounds[1] - tile.bounds[5], 2));
	
	// Calculate triangle incenter
	
	var incenterx = tile.bounds[0] * lengthA + tile.bounds[2] * lengthB + tile.bounds[4] * lengthC;
	var incentery = tile.bounds[1] * lengthA + tile.bounds[3] * lengthB + tile.bounds[5] * lengthC;
	
	
	incenterx = incenterx / (lengthA + lengthB + lengthC);
	incentery = incentery / (lengthA + lengthB + lengthC);
	
	// builds ids 
	
	var ids = [];
	for(var i = 0; i<6; i++){
		var idi = tile.id.slice();
		idi.push(i);
		ids.push(idi);
	}
	
	// build bounds
	// could have probably made a smart loop
	
	var bounds0 = [];
	bounds0.push(tile.bounds[0], tile.bounds[1]);
	bounds0.push(midpointABx, midpointABy);
	bounds0.push(incenterx, incentery);
	
	var bounds1 = [];
	bounds1.push(midpointABx, midpointABy);
	bounds1.push(tile.bounds[2], tile.bounds[3]);
	bounds1.push(incenterx, incentery);
	
	var bounds2 = [];
	bounds2.push(tile.bounds[2], tile.bounds[3]);
	bounds2.push(incenterx, incentery);
	bounds2.push(midpointBCx, midpointBCy);
	
	var bounds3 = [];
	bounds3.push(midpointBCx, midpointBCy);
	bounds3.push(incenterx, incentery);
	bounds3.push(tile.bounds[4], tile.bounds[5]);
	
	var bounds4 = [];
	bounds4.push(tile.bounds[4], tile.bounds[5]);
	bounds4.push(incenterx, incentery);
	bounds4.push(midpointCAx, midpointCAy);
	
	var bounds5 = [];
	bounds5.push(tile.bounds[0], tile.bounds[1]);
	bounds5.push(midpointCAx, midpointCAy);
	bounds5.push(incenterx, incentery);
	
	
	
	

	// tile <-> id, neighbors, bounds, topple limit
	t0 = new Tile(ids[0], [], bounds0, 3);
	t1 = new Tile(ids[1], [], bounds1, 3);
	t2 = new Tile(ids[2], [], bounds2, 3);
	t3 = new Tile(ids[3], [], bounds3, 3);
	t4 = new Tile(ids[4], [], bounds4, 3);
	t5 = new Tile(ids[5], [], bounds5, 3);
	
	
	// add sand to ease the visualization of the subsitution
	t0.sand = 0;
	t1.sand = 1;
	t2.sand = 2;
	t3.sand = 3;
	t4.sand = 4;
	t5.sand = 5;
	
	// build tiles
	var newtiles = [];
	
	newtiles.push(t0);
	newtiles.push(t1);
	newtiles.push(t2);
	newtiles.push(t3);
	newtiles.push(t4);
	newtiles.push(t5);
	
	return newtiles;

}

//
// [3] no duplicated tiles
// [4] I am lazy
//

//
// [6] use default neighbors2bounds
// 
var neighbors2boundsTri = new Map();
neighbors2boundsTri.set('triangle',default_neighbors2bounds(3));

//
// [7] construct base tilings and call substitute
//


//
// [7.1] construct "Triangle Incenter" tiling by substitution
// 
Tiling.TriangleIncenter = function({iterations}={}){
  // push base tiling
  var tiles = [];
  // use incenter subsitution
  var mytriangle = tri.myclone();
  mytriangle.scale(0,0,100);
  var tiles = [mytriangle];

  // call the substitution
  tiles = substitute(
    iterations,
    tiles,
    1,
    incenterSubstitution,
    [], // no duplicated tiles
    [], // no duplicated tiles
    "I am lazy", // myneighbors
    neighbors2boundsTri,
    false,
  );
  // construct tiling
  console.log(tiles);
  return new Tiling(tiles);
}


// This substitution was inspired by Butler, Steve, and Ron Graham.
// "Subdivision by bisectors is dense in the space of all triangles.", 2010
//	
// triangles renders one in front of the other, but here is the original subsitution
//
// var bounds0 = [];
// bounds0.push(tile.bounds[0], tile.bounds[1]);
// bounds0.push(midpointBCx, midpointBCy);
// bounds0.push(midpointCAx, midpointCAy);

// var bounds1 = [];
// bounds1.push(tile.bounds[0], tile.bounds[1]);
// bounds1.push(midpointABx, midpointABy);
// bounds1.push(midpointBCx, midpointBCy);

// var bounds2 = [];
// bounds2.push(tile.bounds[2], tile.bounds[3]);
// bounds2.push(midpointABx, midpointABy);
// bounds2.push(midpointCAx, midpointCAy);

// var bounds3 = [];
// bounds3.push(tile.bounds[2], tile.bounds[3]);
// bounds3.push(midpointBCx, midpointBCy);
// bounds3.push(midpointCAx, midpointCAy);

// var bounds4 = [];
// bounds4.push(tile.bounds[4], tile.bounds[5]);
// bounds4.push(midpointABx, midpointABy);
// bounds4.push(midpointBCx, midpointBCy);

// var bounds5 = [];
// bounds5.push(tile.bounds[4], tile.bounds[5]);
// bounds5.push(midpointABx, midpointABy);
// bounds5.push(midpointCAx, midpointCAy);
