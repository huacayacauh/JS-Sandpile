// This code is part of JS-Sandpile (https://github.com/huacayacauh/JS-Sandpile/)
// CC-BY Valentin Darrigo, Jeremy Fersula, Kevin Perrot

// Penrose: split P3 (rhombus) and P2 (kite-dart) to obtain P0 (triangles)
// https://tartarus.org/~simon/20110412-penrose/penrose.xhtml

// generate Penrose P3 tiles (rhombus) from CutAndProjectViaMultigrids
function P3tiles(size){
  // code copy from CutAndProjectViaMultigrids.js Tiling.PenroseCutandproject
  console.log("* cut and projet via multigrid code");
  let phi=(1+Math.sqrt(5))/2;
  let penrose_dir = generators_to_grid([[phi,0,-phi,-1,1],[-1,1,phi,0,-phi]]);
  let penrose_shift = [1/5,1/5,1/5,1/5,1/5];
  let penrose_draw = [];
  for(let k=0; k<5; k++){
    penrose_draw.push([Math.cos(k*2*Math.PI/5),Math.sin(k*2*Math.PI/5)]);
  }
  let tiles_info = dual2(penrose_dir,penrose_shift,size);
  console.log("  initial: "+tiles_info.length+" tiles");
  let tiles_info_croped = cropn(tiles_info,size);
  console.log("  croped: "+tiles_info_croped.length+" tiles");
  console.log("  compute 2d tiles");
  let tiles = draw2(penrose_draw,tiles_info_croped);
  return tiles;
}

// split a set of P3 tiles (rhombus) into P0 tiles (triangles)
function P3split(tiles){
  console.log("* split tiles");
  let newtiles = [];
  tiles.forEach(tile => {
    // tile 1 : points 0,1,2
    let bounds1 = tile.bounds.slice(0,6);
    newtiles.push(new Tile(tile.id.concat("1"),[],bounds1,3));
    // tile 2 : points 2,3,0
    let bounds2 = tile.bounds.slice(4,8).concat(tile.bounds.slice(0,2));
    newtiles.push(new Tile(tile.id.concat("2"),[],bounds2,3));
  });
  return newtiles;
}

// find neighbors in P0 with findNeighbors from SubstitutionAPI
// by side effect on the Array of Tile
function P0fn(tiles){
  console.log("* find neighbors (using findNeighbors from SubstitutionAPI)");
  resetAllNeighbors(tiles);
  let tilesdict = new Map(tiles.map(i => [id2key(i.id), i]));
  let neighbors2bounds = new Map();
  for(let t of combinations(Array.from(Array(5).keys()),2)){
    neighbors2bounds.set(id2key(t),default_neighbors2bounds(3));
  }
  let fn=findNeighbors(tiles,tilesdict,neighbors2bounds);
  console.log("  found "+fn);
}

// decorate P0 tiles
// by side effect on the Array of Tile
function P0decorate(tiles){
  console.log("* decorate tiles");
  let idkey_colored = [[0,1],[1,2],[2,3],[3,4],[0,4]].map(t => id2key(t));
  tiles.forEach(tile => {
    if(!idkey_colored.includes(tile.id[0])){
      tile.sand=5;
    }
  });
}

// generate P0 from P3
Tiling.P0splitP3 = function({size}={}){
  console.log("Generating Penrose P0 from P3 cut and project via multigrid...");
  // generate P3 tiles
  tiles = P3tiles(size);
  // split tiles
  tiles = P3split(tiles);
  // find neighbors with findNeighbors from SubstitutionAPI
  P0fn(tiles);
  // decorate tiles
  P0decorate(tiles);
  // done
  console.log("done");
  return new Tiling(tiles);
}

