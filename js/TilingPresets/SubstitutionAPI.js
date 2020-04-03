// This code is part of JS-Sandpile (https://github.com/huacayacauh/JS-Sandpile/)
// CC-BY Valentin Darrigo, Jeremy Fersula, Kevin Perrot

//
// [0] Substitution API
// 
// tile ids are arrays of strings, where:
// * the first string is the tile type,
// * the second is a unique string in the base tiling,
// * each subsequent string identifies the child of a parent tile (uses push method)
// THESE IDENTIFIERS MUST BE UNIQUE
//
// procedure: see [1] to [TODO]
// "side effect" = a function modifies directly the objects it receives as argument
//
//
//
//
//
// * construct substitution:
//   * substitution infos (use myclone and some type to type transformation in order to keep the orientation), give the ratio
//   * duplicate infos (+boolean to tell if there are duplicate or not)
//   * neighborhood infos
// * construct base tiling (as Array of tiles)
// * iterate substitution: full scale once
//   * sub
//   * compute_dup
//   * compute_neighbors
//   * clean dup

//
// [0] toolbox
//

//
// [0.1] convert an id array to a key (used in maps)
//
function id2key (a){
  return JSON.stringify(a);
}

//
// [1] user creates base Tile objects (id, bounds, lim)
//
// remark: each one must have a unique id identifying the type
// e.g. ['kite'] or ['dart']
//
// remark: it may be useful for the substitution to have some typeX2typeY method,
// converting (by side effect) some tile of typeX to typeY
// at the "same position" with the "same orientation".
// e.g. Tile.prototype.kite2dart = function(){ update id[0] and move bounds }
//
// remark: neighbors may be left empty []
// or set all neighbors as undefined [undefined,undefined,...,undefined]
//

//
// [2] user creates a substitution function 'mysubstitution'
// input:
// * Tile
// output:
// * (Array of) Tile
//
// useful methods:
// * Tile.myclone()
// * Tile.typeX2typeY()
// * Tile.scale(...)
// * Tile.rotate(...)
// * Tile.shift(...)
// depending on how you code neighbors computation:
// * Tile.resetNeighbors()
//
// remark: should may use "switch(tile.id[0]){...}" for the different tile types
//
// remark: the substitution may create duplicated tiles
//

//
// [3] user provides informations on duplicated tiles
// as 'mydupinfos' an Array of DupInfo
//

//
// [3.1]
// data structure storing informations about the potential
// duplicated children of a parent tile
//
// meaning:
// if parent is 'ptype' and parent.neighbors['index'] is 'potype',
// then "'id' child of parent" is a duplicate of
// "'oid' child of parent.neighbors['index']" (both are 'type')
//
function DupInfo(ptype,type,id,index,potype,oid){
  // type of parent
  this.ptype=ptype;
  // type of child potentialy duplicated
  this.type=type; 
  // id of the child potentialy duplicated (last part)
  this.id=id;
  // parent's neighbor index of the parent of original
  this.index=index;
  // type of parent of original
  this.potype=potype;
  // id of original (last part)
  this.oid=oid;
}

//
// [3.2]
// construct a map of duplicated tiles:
// * idkey of duplicated -> id of original
// from:
// * an Array of DupInfo
// * an Array of Tile
//
function duplicatedMap(dupInfos,tiles){
  // construct map
  var dup = new Map();
  // iterate tiles and fill dup
  for(let tile of tiles){
    // for each potential duplicated
    for(let dupInfo of dupInfos){
      // check if it is duplicated
      if(  tile.id[0] == dupInfo.ptype
        && tile.neighbors[dupInfo.index] != undefined
        && tile.neighbors[dupInfo.index][0] == dupInfo.potype){
        // construct duplicated tile id
        let dupid = JSON.parse(JSON.stringify(tile.id));
        dupid[0]=dupInfo.type;
        dupid.push(dupInfo.id);
        // construct original tile id
        let originalid = JSON.parse(JSON.stringify(tile.neighbors[dupInfo.index]));
        originalid[0]=dupInfo.type;
        originalid.push(dupInfo.oid);
        // add to dup map
        dup.set(id2key(dupid),originalid);
      }
    }
  }
  // done
  return dup;
}

//
// [3.3] 
// check if child id of pid is a duplicated tile, with
// * dup the map of duplicated tiles
// * pid the parend of id (Array)
// * id the child id (last part)
// * type the child type
function isDup(newdup,pid,id,type){
  // constrcut full child id
  let fid = JSON.parse(JSON.stringify(pid));
  fid[0] = type;
  fid.push(id);
  // check
  return newdup.has(id2key(fid));
}

//
// [4] user creates a function 'myneighbors' to fill (by side effect)
// neighbors of the new tiles
// input:
// * Array of tiles
// * Map of tiles (idkey -> tile)
// * Array of newtiles (obtained from 'mysubstitution')
// * Map of newtiles (newidkey -> newtile)
// * Map of duplicated newtiles (newidkey -> id of original)
// no output, just return;
//
// remark: you may have used Tile.resetNeighbors() at step [2]
//
// remark: no need to fill the neighbors of duplicated tiles (see isDup at [3.3])
//
// remark: the cleaning of duplicated tiles at step [5] will update the
// neighbors which are duplicated tiles. It means that you may set as neighbors
// some tiles which turn out to be duplicated, the replacement for the original
// tile will be handled automatically from your 'mydupinfos'
//
// remark: maps (aka dictionaries) may be useful to get the neighbor of a neighbor,
// do not forget to use id2key(id) (see [0.1]) when calling .has and .get methods.
// 
// see useful methods [4.1] to [4.3]
//

//
// [4.1] set some neighbor of a newtile
// modifies
// * tilesdict (map of tiles with id2key)
// by adding child nid (of type ntype) of pnid as neighbor number i
// of child id (of type type) of pid, with:
// * pid the parent id (Array)
// * id the child id (last part)
// * type the child type
// * i the neighbors index (integer)
// * pnid the neighbors parent id (Array)
// * nid the neighbors id (last part)
// * ntype the neighbors type
//
function setNeighbor(tilesdict,pid,id,type,i,pnid,nid,ntype){
  // construct full child id
  let fid = JSON.parse(JSON.stringify(pid));
  fid[0] = type;
  fid.push(id);
  // construct full neighbors id
  let fnid = JSON.parse(JSON.stringify(pnid));
  fnid[0] = ntype;
  fnid.push(nid);
  // set neighbor in tilesdict
  tilesdict.get(id2key(fid)).neighbors[i] = fnid;
  return; // side effect
}

//
// [4.2] set some neighbor of a newtile as undefined
// similar to setNeighbor
// 
function setNeighborUndefined(tilesdict,pid,id,type,i){
  // construct full child id
  let fid = JSON.parse(JSON.stringify(pid));
  fid[0] = type;
  fid.push(id);
  // set neighbor in tilesdict
  tilesdict.get(id2key(fid)).neighbors[i] = undefined;
  return; // side effect
}

//
// [4.3] set some neighbor of a newtile and check if this neighbor is duplicated
// (if it is then set the original as neighbor)
// similar to setNeighbor
// CAUTION: not useful because clean updates duplicated tiles in neighbors
// 
function setNeighborMaybeDup(tilesdict,pid,id,type,i,pnid,nid,ntype,dup){
  // construct full child id
  let fid = JSON.parse(JSON.stringify(pid));
  fid[0] = type;
  fid.push(id);
  // construct full neighbors id
  let fnid = JSON.parse(JSON.stringify(pnid));
  fnid[0] = ntype;
  fnid.push(nid);
  // check dup and set neighbor in tilesdict
  if(dup.has(id2key(fnid))){
    tilesdict.get(id2key(fid)).neighbors[i] = dup.get(id2key(fnid));
  }
  else{
    tilesdict.get(id2key(fid)).neighbors[i] = fnid;
  }
  return; // side effect
}

//
// [5] clean duplicates: remove duplicated tiles and update neighbors
//
function clean(tiles,dup){
  // remove duplicated tiles
  tiles = tiles.filter(a => !dup.has(id2key(a.id)));
  // update neighbors (if some are duplicated)
  tiles.forEach(tile =>
    tile.neighbors = tile.neighbors.map(nid => {
      if(dup.has(id2key(nid))){
        return dup.get(id2key(nid));
      }
      else{
        return nid;
      }
    }));
  // done
  return tiles;
}

// 
// [6] (eventually) the substitution method to call
//
// at this point the user writes its Tiling.mytiling function:
// 1. define a base tiling
// 2. call substitute
// 3. return a Tiling
// 
// Tiling.mytiling = function({iterations}={}){
//
//   1.
//   var tiles = [];
//   etc
//   tiles.push(mytile1);
//   etc
//   
//   remark: use the base tiles from step [1] and myclone() method,
//   do not forget to fill neighbors for tiles of the base tiling
//   and leave the boundary as 'undefined'
//   
//   2. tiles = substitute(...);
//
//   input:
//   * number of iterations
//   * Array of tiles (aka base tiling)
//   * scaling ratio of the substitution
//   * mysubstitution (see [2])
//   * mydupinfos (see [3])
//   * myneighbors (see [4])
//   how it work? see the code below
//
//   3. return new Tiling(tiles);
//
// }
// 
function substitute(iterations,tiles,ratio,mysubstitution,mydupinfos,myneighbors){
  // scale the base tiling all at once
  for(tile of tiles){
    tile.scale(0,0,ratio**iterations);
  }
  // iterate substitution
  for(var i=0; i < iterations; i++){
    // substitute (scaling already done)
    var newtiles = tiles.flatMap(mysubstitution);
    // compute map of duplicated newtiles (idkey -> id)
    var newdup = duplicatedMap(mydupinfos,tiles);
    // convert tiles array to map with id as key (for convenient access)
    var tilesdict = new Map(tiles.map(i => [id2key(i.id), i]));
    // convert newtiles array to map with id as key (for convenient access)
    var newtilesdict = new Map(newtiles.map(i => [id2key(i.id), i]));
    // set neighbors
    myneighbors(tiles,tilesdict,newtiles,newtilesdict,newdup);
    // remove duplicated tiles
    newtiles = clean(newtiles,newdup);
    // update tiles
    tiles = newtiles;
  }
  // done
  return tiles;
}



