var bounds = [];
bounds.push(0, 0);
bounds.push(1, 0);
bounds.push(1, 0.5);
bounds.push(0.5, 0.5);
bounds.push(0.5, 1);
bounds.push(0, 1);
var AmmanChair2 = new Tile(["AmmanChair2"], [], bounds, 6);

function pushVector(array, vector) {
  array.push(vector.x, vector.y);
}

function substitutionAmmannChair2(tile) {
	switch(tile.id[0]) {
		case "AmmanChair2":
			var newtiles = [];
			
			var A = new THREE.Vector2(tile.bounds[0], tile.bounds[1]);
			var B = new THREE.Vector2(tile.bounds[2], tile.bounds[3]);
			var C = new THREE.Vector2(tile.bounds[4], tile.bounds[5]);
			var D = new THREE.Vector2(tile.bounds[6], tile.bounds[7]);
			var E = new THREE.Vector2(tile.bounds[8], tile.bounds[9]);
			var F = new THREE.Vector2(tile.bounds[10], tile.bounds[11]);
			var AB = ((new THREE.Vector2()).add(B)).sub(A);
			var unit = Math.sqrt(AB.dot(AB));
			
			var G = (((((new THREE.Vector2()).add(B)).sub(A)).normalize()).multiplyScalar(unit * 0.5)).add(A);
			var H = (((((new THREE.Vector2()).add(C)).sub(B)).normalize()).multiplyScalar(unit * 0.25)).add(G);
			var I = (((((new THREE.Vector2()).add(A)).sub(B)).normalize()).multiplyScalar(unit * 0.25)).add(H);
			var J = (((((new THREE.Vector2()).add(F)).sub(A)).normalize()).multiplyScalar(unit * 0.25)).add(I);
			var K = (((((new THREE.Vector2()).add(F)).sub(A)).normalize()).multiplyScalar(unit * 0.5)).add(A);
			var L = (((((new THREE.Vector2()).add(B)).sub(A)).normalize()).multiplyScalar(unit * 0.25)).add(H);
			var M = (((((new THREE.Vector2()).add(A)).sub(B)).normalize()).multiplyScalar(unit * 0.25)).add(C);
			var N = (((((new THREE.Vector2()).add(D)).sub(E)).normalize()).multiplyScalar(unit * 0.25)).add(E);
			var O = (((((new THREE.Vector2()).add(A)).sub(B)).normalize()).multiplyScalar(unit * 0.25)).add(N);

			var newl = tile.myclone();
			newl.id.push("fils0");
			newl.bounds = chairVectorsToBounds(A, G, H, I, J, K);
			newtiles.push(newl);

			var newl2 = tile.myclone();
			newl2.id.push("fils1");
			newl2.bounds = chairVectorsToBounds(I, L, M, D, N, O);
			newtiles.push(newl2);

			var newl3 = tile.myclone();
			newl3.id.push("fils2");
			newl3.bounds = chairVectorsToBounds(B, C, M, L, H, G);
			newtiles.push(newl3);

			var newl4 = tile.myclone();
			newl4.id.push("fils3");
			newl4.bounds = chairVectorsToBounds(F, K, J, O, N, E);
			newtiles.push(newl4);

			return newtiles;
		default:
			console.log("caution: undefined tile type for substitutionAmmannChair2, id=" + tile.id);
	}
}

function chairVectorsToBounds(v1, v2, v3, v4, v5, v6) {
  var bounds = [];
  pushVector(bounds, v1);
  pushVector(bounds, v2);
  pushVector(bounds, v3);
  pushVector(bounds, v4);
  pushVector(bounds, v5);
  pushVector(bounds, v6);
  return bounds;
}

neighbors2boundsA = new Map();
neighbors2boundsA.set("AmmanChair2", default_neighbors2bounds(6));

decorateA = new Map();
decorateA.set("AmmanChair2", 1);

Tiling.AmmannChair2BySubst = function({iterations}={}) {
	var tiles = [];
	var AmmanChair = AmmanChair2.myclone();
	tiles.push(AmmanChair);
	tiles = substituteAmmannChair2(
		iterations,
		tiles,
		1,
		substitutionAmmannChair2,
		[], // no duplicated tiles
		[], // no duplicated tiles
		"laziness", // myneighbors
		neighbors2boundsA,
		decorateA // decorateTT
	);
	return new Tiling(tiles);
};

function substituteAmmannChair2(iterations,tiles,ratio,mysubstitution,mydupinfos,mydupinfosoriented,myneighbors,findNeighbors_option=false,mydecoration_option=false){
  // lazy? discover base neighbors
  if(typeof(myneighbors)=="string"){
    // check that findNeighbors_option is set
    if(findNeighbors_option==false){
      console.log("error: please provide some neighbors2bounds according to your dupinfos/dupinfosoriented, even if you are lazy.");
      return tiles;
    }
    console.log("lazy: compute base neighbors");
    // reset then find neighbors
    resetAllNeighbors(tiles);
    let tilesdict = new Map(tiles.map(i => [id2key(i.id), i]));
    let fn=findNeighborsEnhanced(tiles,tilesdict,findNeighbors_option);
    console.log("  found "+fn);
  }
  // scale the base tiling all at once
  tiles.forEach(tile => tile.scale(0,0,ratio**iterations));
  // iterate substitution
  for(let i=0; i < iterations; i++){
    console.log("starting substitution "+(i+1)+"/"+iterations+"...");
    // substitute (scaling already done)
    console.log("* create (new) tiles");
    let newtiles = tiles.flatMap(mysubstitution);
    console.log("  "+newtiles.length+" tiles");
    // convert tiles array to map with id as key (for convenient access)
    let tilesdict = new Map(tiles.map(i => [id2key(i.id), i]));
    // convert newtiles array to map with id as key (for convenient access)
    let newtilesdict = new Map(newtiles.map(i => [id2key(i.id), i]));
    // compute map of duplicated newtiles (idkey -> id)
    console.log("* compute map of duplicated tiles");
    let newdup = duplicatedMap(mydupinfos,mydupinfosoriented,tiles,tilesdict);
    // set neighbors (if user is not lazy)
    if(typeof(myneighbors)!="string"){
      console.log("* compute neighbors (local)");
      myneighbors(tiles,tilesdict,newtiles,newtilesdict,newdup);
    }
    else{
      console.log("* lazy: reset neighbors");
      resetAllNeighbors(newtiles);
    }
    // remove duplicated tiles
    console.log("* clean duplicated tiles");
    newtiles = clean(newtiles,newdup);
    // find neighbors from non-adjacent tiles
    if(findNeighbors_option != false){
      console.log("* compute neighbors (global)");
	  newtiles.forEach(tile => tile.neighbors = []);
      let fn=findNeighborsEnhanced(newtiles,newtilesdict,findNeighbors_option);
      console.log("  found "+fn);
    }
    // update tiles
    tiles = newtiles;
      console.log("* done");
  }
  // decorate tiles
  if(mydecoration_option != false){
    console.log("decorate tiles");
    tiles.forEach(tile => tile.sand=mydecoration_option.get(tile.id[0]));
  }
  // done
  console.log(tiles);
  console.log("done");
  return tiles;
}