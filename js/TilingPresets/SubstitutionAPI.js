// This code is part of JS-Sandpile (https://github.com/huacayacauh/JS-Sandpile/)
// CC-BY Valentin Darrigo, Jeremy Fersula, Kevin Perrot

//
// See the wiki page for a description of this API:
// https://github.com/huacayacauh/JS-Sandpile/wiki/Substitution-API
//

//
// [0] Substitution API
// 
// tile ids are arrays of strings, where:
// * the first string is the tile type,
// * the second is a unique string in the base tiling,
// * each subsequent string identifies the child of a parent tile (uses push method)
// THESE IDENTIFIERS MUST BE UNIQUE
//
// How to use this API? see [1] to [7]
//
// "side effect" = a function modifies directly the objects it receives as argument
//

//
// [0.1] toolbox: convert an id array to a key (used in maps)
//
function id2key (a){
  return JSON.stringify(a);
}

//
// [0.2] toolbox: test if two id Arrays are equal
//
function are_id_equal(id1,id2){
  if(id1 == undefined && id2 == undefined){
    console.log("warning: are_id_equal has just compared two undefined ids (returns true), that may be unexpected...");
    return true;
  }
  if(( id1 == undefined && id2 != undefined)
    || id1 != undefined && id2 == undefined){
    return false;
  }
  if(id1.length != id2.length){
    return false;
  }
  for(let i=0; i<id1.length; i++){
    if(id1[i] != id2[i]){
      return false;
    }
  }
  return true;
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
// geometric point transformations provided by Utils/Geometry.js may be useful
//
// remark: neighbors may be left empty []
// or set all neighbors as undefined [undefined,undefined,...,undefined]
// (remember this when creating you base tiling at step [7])
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
// remark: newtiles are supposed to be scaled down by 1/ratio,
// with ratio the value passed to substitute at step [7]
//
// remark: should may use "switch(tile.id[0]){...}" for the different tile types
//
// remark: the substitution may create duplicated tiles
//

//
// [3] user provides informations on duplicated tiles as
// 'mydupinfos' an Array of DupInfo, and
// 'mydupinfosoriented' an Array of DupInfoOriented
//
// indeed, it often happens that the subsitution "déborde"
// and as a consequence, neighboring parent tiles may create twice
// a same newtile.
// If your substitution is very nice and does not
// have this issue, then simply set 'mydupinfo=[];'.
// Otherwise init to [] and then 'mydupinfo.push(new Dupinfo(...));'
// for each potential duplicate case.
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
// data structure storing informations about the potential
// duplicated children of a parent tile,
// when this also depends on the matching side of neighbor tile
// (thus on the orientation of the neighboring tile)
//
// meaning:
// if parent is 'ptype' and parent.neighbors['index'] is 'potype',
// and if furthermore the former is neighbor 'oindex' of the latter,
// then "'id' child of parent" is a duplicate of
// "'oid' child of parent.neighbors['index']" (both are 'type')
//
function DupInfoOriented(ptype,type,id,index,potype,oid,oindex){
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
  // parent of original's neighbor index of the parent
  this.oindex=oindex;
}

//
// [3.3]
// construct a map of duplicated tiles:
// * idkey of duplicated -> id of original
// from:
// * an Array of DupInfo
// * an Array of Tile
//
function duplicatedMap(dupInfos,dupInfosOriented,tiles,tilesdict){
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
    // for each potential duplicated oriented
    for(let dupInfo of dupInfosOriented){
      // check if it is duplicated
      if(  tile.id[0] == dupInfo.ptype
        && tile.neighbors[dupInfo.index] != undefined
        && tile.neighbors[dupInfo.index][0] == dupInfo.potype
        && tilesdict.get(id2key(tile.neighbors[dupInfo.index])).neighbors[dupInfo.oindex] != undefined // toto
        && are_id_equal(tile.id,tilesdict.get(id2key(tile.neighbors[dupInfo.index])).neighbors[dupInfo.oindex])){
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
// [3.4] 
// check if child id of pid is a duplicated tile, with
// * newdup the map of duplicated tiles
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
// remark: newtiles' neighbors are computed based on the parent's neighbors,
// therefore it may be natural to iterate over parent tiles.
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
// [6] (optional)
//     findNeighbors checks if non-neighboring tiles have neighborhing children,
//     in time O(n log n) with n the number of undefined neighbors
//     (hoping that javascript Array.sort() implements quicksort)
//
// remark: the default correspondence is that tile.neighbors[i] corresponds to
// segment (tile.bounds[2*i],tile.bounds[2*i+1]) -- (tile.bounds[2*i+2 %_],tile.bounds[2*i+3 %_]).
// If this is not the case in user's implementation,
// then user will provide a correspondance method (see [6.2] and [7])
// 
// remark: it is expected that tile.bounds.length = 2*tile.neighbors.length
//
// remark: this takes into account rounding error in coordinates computation,
// up to a distance between two points (expected to be identical) less than:
var p_error=0.001;

//
// [6.1] toolbox
// 

// segment (Array of 4 coordinates + tile idkey + neighbor index) to key
// id2key(tile.id) and neighbor index added otherwise segments may have identical keys
function segment2key (a){
  return JSON.stringify(a);
}

// datastructure associated to some tile's segment:
// * tile id
// * neighbors' index
function TileSegment(id,nindex){
  this.id=id;
  this.nindex=nindex;
}

//
// [6.2] neighbors' index to bounds' indices correspondence, for each tile type,
//       in order to fill the second par of the Map:
//       'type' -> Array of neighbors.length Arrays of four indices
//       (these latter corresponding to bounds)
//
// default one: tile.neighbors[i] corresponds to
// segment (tile.bounds[2*i],tile.bounds[2*i+1]) -- (tile.bounds[2*i+2 %_],tile.bounds[2*i+3 %_])
// may be constructed via the method below, as it depends on input:
// * number of neighbors
function default_neighbors2bounds(n){
  var n2b_array = [];
  for(let i=0; i<n; i++){
    n2b_array.push([2*i,2*i+1,(2*i+2)%(2*n),(2*i+3)%(2*n)]);
  }
  return n2b_array;
}

//
// [6.3] findneighbors
//
// input:
// * Array of tiles
// * Map of tiles (idkey -> tile)
// * neighbors2bounds (n2b) is a Map
//   tile 'type' -> Array of neighbors.length Arrays of four indices
// output:
// * number of matching segments founds
//
function findNeighbors(tiles,tilesdict,n2b){
  // construct
  // * segments = list of segments (Array of 4 coordinates + tile idkey + neighbor index)
  //   for undefined neighbors
  // * segmentsMap = segmentkey -> tile id, neighbors' index
  var segments = [];
  var segmentsMap = new Map();
  tiles.forEach(function(tile){
    for(let i=0; i<tile.neighbors.length; i++){
      if(tile.neighbors[i] == undefined){
        // found an undefined neighbor
        // caution: segment points need to be ordered (up to p_error)
        //          so that [x,y,x',y']=[x',y',x,y].
        //          smallest x first, and if x ~equal then smallest y first
        //          
        let segment = [];
        let x1 = tile.bounds[n2b.get(tile.id[0])[i][0]];
        let y1 = tile.bounds[n2b.get(tile.id[0])[i][1]];
        let x2 = tile.bounds[n2b.get(tile.id[0])[i][2]];
        let y2 = tile.bounds[n2b.get(tile.id[0])[i][3]];
        if( x2-x1>=p_error || (Math.abs(x2-x1)<p_error && y2-y1>=p_error) ){
          // normal order
          segment.push(x1);
          segment.push(y1);
          segment.push(x2);
          segment.push(y2);
        }
        else{
          // reverse order
          segment.push(x2);
          segment.push(y2);
          segment.push(x1);
          segment.push(y1);
        }
        // something unique for segment2key...
        segment.push(id2key(tile.id));
        segment.push(i);
        // add to datastructures
        segments.push(segment);
        segmentsMap.set(segment2key(segment),new TileSegment(tile.id,i));
      }
    }
  });
  // sort the list of segments lexicographicaly
  // takes into account rounding errors (up to p_error)
  segments.sort(function(s1,s2){
    for(let i=0; i<s1.length-2; i++){ // -2 to exclude idkey and index
      if(Math.abs(s1[i]-s2[i])>=p_error){return s1[i]-s2[i];}
    }
    return 0;
  });
  // check if consecutive elements are identical => new neighbors!
  // (hypothesis: no three consecutive elements are identical)
  var fn = 0;
  for(let i=0; i<segments.length-1; i++){
    // check if points are identical (up to p_error)
    if(  distance(segments[i][0],segments[i][1],segments[i+1][0],segments[i+1][1])<p_error
      && distance(segments[i][2],segments[i][3],segments[i+1][2],segments[i+1][3])<p_error){
      // found two identical segments => set neighbors
      fn++;
      let ts1=segmentsMap.get(segment2key(segments[i]));
      let ts2=segmentsMap.get(segment2key(segments[i+1]));
      tilesdict.get(id2key(ts1.id)).neighbors[ts1.nindex] = ts2.id;
      tilesdict.get(id2key(ts2.id)).neighbors[ts2.nindex] = ts1.id;
      // i+1 already set
      i++;
    }
  }
  // done
  return fn; // side effect
}

// 
// [6.4] set undefined neighbors for lazy user, by side effet
//
function resetAllNeighbors(tiles){
  for(let tile of tiles){
    // guess the length of neighbors from the length of bounds
    let n=tile.bounds.length/2;
    tile.neighbors=[];
    for(let i=0; i<n; i++){
      tile.neighbors.push(undefined);
    }
  }
  return; // side effet
}

// 
// [7] (eventually) the substitution method to call
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
//   * (optional) whether to call findNeighbors (see [6]), one of:
//     * false
//     * neighbors2bounds
//   how it work? see the code below
//   * (optional) a tile type to initial sand content for decoration purpose, one of:
//     * false
//     * a Map tile type (tile.id[0]) -> number
//
//   3. return new Tiling(tiles);
//
// }
// 
function substitute(iterations,tiles,ratio,mysubstitution,mydupinfos,mydupinfosoriented,myneighbors,findNeighbors_option=false,mydecoration_option=false){
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
    let fn=findNeighbors(tiles,tilesdict,findNeighbors_option);
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
      let fn=findNeighbors(newtiles,newtilesdict,findNeighbors_option);
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
  console.log("done");
  return tiles;
}

