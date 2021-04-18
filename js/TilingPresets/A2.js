
var phi = (Math.sqrt(5) + 1) / 2;

function pushVector(array, vector) {
  array.push(vector.x, vector.y);
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

var bounds = [];
bounds.push(0, 0);
bounds.push(Math.pow(phi, 2), 0);
bounds.push(Math.pow(phi, 2), Math.pow(phi, 3/2));
bounds.push(phi, Math.pow(phi, 3/2));
bounds.push(phi, Math.pow(phi, 5/2));
bounds.push(0, Math.pow(phi, 5/2));
var little_chair = new Tile(["little_chair"], [], bounds, 6);

// conversion
Tile.prototype.lTob = function() {
  this.id[0] = "big_chair";
};

Tile.prototype.bTol = function() {
  this.id[0] = "little_chair";
};

function substitution_A2(tile) {
	switch(tile.id[0]) {
		case "little_chair":
			var newtiles = [];
			var newb = tile.myclone();
			newb.lTob();
			newb.id.push("fils_1");
			newtiles.push(newb);
			return newtiles;
		case "big_chair":
			var newtiles = [];
			
			var A = new THREE.Vector2(tile.bounds[0], tile.bounds[1]);
			var B = new THREE.Vector2(tile.bounds[2], tile.bounds[3]);
			var C = new THREE.Vector2(tile.bounds[4], tile.bounds[5]);
			var D = new THREE.Vector2(tile.bounds[6], tile.bounds[7]);
			var E = new THREE.Vector2(tile.bounds[8], tile.bounds[9]);
			var F = new THREE.Vector2(tile.bounds[10], tile.bounds[11]);

			var CD = ((new THREE.Vector2()).add(D)).sub(C);
			var unit = Math.sqrt(CD.dot(CD));
			//G = A+AG
			var G = (((((new THREE.Vector2()).add(F)).sub(A)).normalize()).multiplyScalar(unit * Math.pow(phi, 1/2))).add(A);
			var H = (((((new THREE.Vector2()).add(B)).sub(A)).normalize()).multiplyScalar(unit)).add(G);
			var I = (((((new THREE.Vector2()).add(D)).sub(C)).normalize()).multiplyScalar(unit * Math.pow(phi, -1))).add(D);

			var newl = tile.myclone();
			newl.bTol();
			newl.id.push('fils1');
			newl.bounds = chairVectorsToBounds(F, E, D, I, H, G); 
			newtiles.push(newl);

			var newb = tile.myclone();
			newb.id.push('fils2'); 
			newb.bounds = chairVectorsToBounds(B, C, I, H, G, A);
			newtiles.push(newb);
			
			return newtiles;
		default:
			console.log("caution: undefined tile type for substitutionA2, id=" + tile.id);
	}
}

neighbors2bounds_A2 = new Map();
neighbors2bounds_A2.set("little_chair", default_neighbors2bounds(6));
neighbors2bounds_A2.set("big_chair", default_neighbors2bounds(6));

// prepare decoration
decorate_A2 = new Map();
decorate_A2.set("little_chair", 0);
decorate_A2.set("big_chair", 3);

Tiling.A2BySubst = function({iterations}={}) {
  var tiles = [];
  var base = little_chair.myclone();
  tiles.push(base);
  tiles = substituteAmmanA2(
    iterations,
    tiles,
    Math.pow(phi, 1/2),
    substitution_A2,
    [], // no duplicated tiles
    [], // no duplicated tiles
    "laziness", // myneighbors
    neighbors2bounds_A2,
    decorate_A2 // decorateTT
  );
  return new Tiling(tiles);
};

function substituteAmmanA2(iterations,tiles,ratio,mysubstitution,mydupinfos,mydupinfosoriented,myneighbors,findNeighbors_option=false,mydecoration_option=false){
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