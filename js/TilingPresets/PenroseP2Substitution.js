// Penrose P2 (kite-dart)
// substitution described at
// http://tilings.math.uni-bielefeld.de/substitution/penrose-kite-dart/

// CAUTION: starting from number of iterations 7, it misses some neighbor creation by the substitution

// golden number
var phi = (1+Math.sqrt(5))/2;

// [1.0] construct "Penrose P2 sun" tiling by substitution
// 
Tiling.penroseP2sun = function({iterations}={}){
  var tiles = [];
  // push base "sun" tiling
  for(var i=0; i<5; i++){
    // construct tiles
    var mykite = kite.myclone();
    mykite.id.push(i);
    mykite.rotate(0,0,i*2*Math.PI/5);
    // define neighbors with undefined on the boundary
    mykite.neighbors.push(['kite',(i-1+5)%5]); // 0
    mykite.neighbors.push(undefined); // 1
    mykite.neighbors.push(undefined); // 2
    mykite.neighbors.push(['kite',(i+1)%5]); // 3
    tiles.push(mykite);
  }
  // scale the base tiling
  for(tile of tiles){
    tile.scale(0,0,60);
  }
  // iterate substitution
  for(var i=0; i < iterations; i++){
    // substitute
    var newtiles = tiles.flatMap(substitutionP2);
    // convert newtiles array to dictionnary with id as key (for convenient access)
    var newtilesdict = new Map(newtiles.map(i => [id2key(i.id), i]));
    // compute map of duplicated tiles, and its inverse
    var dup = duplicatedP2(tiles); // id -> idkey
    var pud = new Map(); // idkey -> idkey
    dup.forEach((value,key) => pud.set(id2key(value),key));
    // set inner neighbors (easy)
    in_neighborsP2(tiles,newtilesdict);
    // set outer neighbors
    out_neighborsP2(tiles,newtilesdict,dup,pud);
    // remove duplicated tiles
    newtiles = cleanP2(newtiles,dup);
    // done
    tiles = newtiles;
  }
  // remove undefined neighbors: not needed
  return new Tiling(tiles);
}

//
// [1.1] define tile types
//

// kite
var bounds = [];
bounds.push(0,0);
bounds.push(phi*Math.sin(Math.PI/5),phi*Math.cos(Math.PI/5));
bounds.push(0,phi*Math.cos(Math.PI/5)+Math.sin(Math.PI/10));
bounds.push(-phi*Math.sin(Math.PI/5),phi*Math.cos(Math.PI/5));
var kite = new Tile(['kite'],[],bounds,4);

// dart
var bounds = [];
bounds.push(0,0);
bounds.push(phi*Math.sin(Math.PI/5),phi*Math.cos(Math.PI/5));
bounds.push(0,phi*Math.cos(Math.PI/5)-Math.sin(Math.PI/10));
bounds.push(-phi*Math.sin(Math.PI/5),phi*Math.cos(Math.PI/5));
var dart = new Tile(['dart'],[],bounds,4);

// convert a kite to a dart
Tile.prototype.kite2dart = function(){
  this.id[0]='dart';
  this.bounds[4] += (this.bounds[0]-this.bounds[4]) * 2*Math.sin(Math.PI/10)/phi;
  this.bounds[5] += (this.bounds[1]-this.bounds[5]) * 2*Math.sin(Math.PI/10)/phi;
}

// convert a dart to a kite
Tile.prototype.dart2kite = function(){
  this.id[0]='kite';
  this.bounds[4] -= (this.bounds[0]-this.bounds[4]) * 2*Math.sin(Math.PI/10)/(phi-2*Math.sin(Math.PI/10));
  this.bounds[5] -= (this.bounds[1]-this.bounds[5]) * 2*Math.sin(Math.PI/10)/(phi-2*Math.sin(Math.PI/10));
}

//
// [1.2] define substitution for each tile type
//       return array of children
//      (caution: no id collision)
//      (caution: may create duplicated tiles)
//      (caution: neighbors inherited from the parent tile)
//
function substitutionP2(tile){
  switch(tile.id[0]){
    case 'kite':
      //
      // -------------------------------
      // kite substitution -> 2 kites, 2 darts
      // -------------------------------
      //
      var newtiles = [];

      // new kite 1
      var newkite1 = tile.myclone();
      newkite1.id.push('kite1');
      newkite1.resetNeighbors();
      newkite1.scale(tile.bounds[0],tile.bounds[1],1/phi);
      newkite1.rotate(tile.bounds[0],tile.bounds[1],3*Math.PI/5);
      newkite1.shift(tile.bounds[2]-tile.bounds[0],tile.bounds[3]-tile.bounds[1]);
      newtiles.push(newkite1);

      // new kite 2
      var newkite2 = tile.myclone();
      newkite2.id.push('kite2');
      newkite2.resetNeighbors();
      newkite2.scale(tile.bounds[0],tile.bounds[1],1/phi);
      newkite2.rotate(tile.bounds[0],tile.bounds[1],-3*Math.PI/5);
      newkite2.shift(tile.bounds[6]-tile.bounds[0],tile.bounds[7]-tile.bounds[1]);
      newtiles.push(newkite2);

      // new dart 1
      var newdart1 = tile.myclone();
      newdart1.resetNeighbors();
      newdart1.kite2dart();
      newdart1.id.push('dart1');
      newdart1.scale(tile.bounds[0],tile.bounds[1],1/phi);
      newdart1.rotate(tile.bounds[0],tile.bounds[1],-Math.PI/5);
      newtiles.push(newdart1);

      // new dart 2
      var newdart2 = tile.myclone();
      newdart2.resetNeighbors();
      newdart2.kite2dart();
      newdart2.id.push('dart2');
      newdart2.scale(tile.bounds[0],tile.bounds[1],1/phi);
      newdart2.rotate(tile.bounds[0],tile.bounds[1],Math.PI/5);
      newtiles.push(newdart2);

      // done
      return newtiles;
      break;

    case 'dart':
      //
      // -------------------------------
      // dart substitution -> 2 darts, 1 kite
      // -------------------------------
      //
      var newtiles = [];

      // new kite 1
      var newkite1 = tile.myclone();
      newkite1.resetNeighbors();
      newkite1.dart2kite();
      newkite1.id.push('kite1');
      newkite1.scale(tile.bounds[0],tile.bounds[1],1/phi);
      newtiles.push(newkite1);

      // new dart 1
      var newdart1 = tile.myclone();
      newdart1.resetNeighbors();
      newdart1.id.push('dart1');
      newdart1.scale(tile.bounds[0],tile.bounds[1],1/phi);
      newdart1.rotate(tile.bounds[0],tile.bounds[1],4*Math.PI/5);
      newdart1.shift(tile.bounds[2]-tile.bounds[0],tile.bounds[3]-tile.bounds[1]);
      newtiles.push(newdart1);

      // new dart 2
      var newdart2 = tile.myclone();
      newdart2.resetNeighbors();
      newdart2.id.push('dart2');
      newdart2.scale(tile.bounds[0],tile.bounds[1],1/phi);
      newdart2.rotate(tile.bounds[0],tile.bounds[1],6*Math.PI/5);
      newdart2.shift(tile.bounds[6]-tile.bounds[0],tile.bounds[7]-tile.bounds[1]);
      newtiles.push(newdart2);

      // done
      return newtiles;
      break;

    default:
      // all tiles should be kite or dart
      console.log("caution: undefined tile type for substitutionP2, id="+tile.id);
  }
}

// [1.3] return a dictionnary (map) of duplicated tiles
//       dup[idkey1]=idkey2 with idkey2 the main tile and idkey1 the duplicated
//       and dup[idkey1]=unefined if tile idkey1 is not duplicated
//
function duplicatedP2(tiles){
  // construct map
  var dup = new Map();

  // iterate tiles and fill dup
  for(let tile of tiles) {
    switch(tile.id[0]){

      case 'kite':
        // new dart 2
        {
          let newdart2id = JSON.parse(JSON.stringify(tile.id));
          newdart2id[0]='dart';
          newdart2id.push('dart2');
          if(   tile.neighbors[3] != undefined
             && tile.neighbors[3][0] == 'kite'){
            // duplicate of this neighbor kite's child new dart 1
            let mainid = JSON.parse(JSON.stringify(tile.neighbors[3]));
            mainid[0]='dart';
            mainid.push('dart1');
            dup.set(id2key(newdart2id),mainid);
          }
        }
        break;

      case 'dart':
        // new dart 1
        {
          let newdart1id = JSON.parse(JSON.stringify(tile.id));
          newdart1id.push('dart1');
          if(   tile.neighbors[0] != undefined
             && tile.neighbors[0][0] == 'kite'){
            // duplicate of this neighbor kite's child new dart 1
            let mainid = JSON.parse(JSON.stringify(tile.neighbors[0]));
            mainid[0]='dart';
            mainid.push('dart1');
            dup.set(id2key(newdart1id),mainid);
          }
        }
        // new dart 2
        {
          let newdart2id = JSON.parse(JSON.stringify(tile.id));
          newdart2id.push('dart2');
          if(tile.neighbors[3] == undefined){
            // not a duplicated tile
          }
          else if(tile.neighbors[3][0] == 'kite'){
            // duplicate of this neighbor kite's child new dart 2
            let mainid = JSON.parse(JSON.stringify(tile.neighbors[3]));
            mainid[0]='dart';
            mainid.push('dart2');
            dup.set(id2key(newdart2id),mainid);
          }
          else if(tile.neighbors[3][0] == 'dart'){
            // duplicate of this neighbor dart's child new dart 1
            let mainid = JSON.parse(JSON.stringify(tile.neighbors[3]));
            mainid.push('dart1');
            dup.set(id2key(newdart2id),mainid);
          }
        }
        break;

      default:
        // all tiles should be kite or dart
        console.log("caution: undefined tile type for duplicatedP2, id="+tile.id);
    }
  }

  // done
  return dup;
}

// [1.4] find inner neighbors (neighbors within the parent tile)
//      (caution: assumes no neighbor creation by the substitution)
//      (caution: may put in neighbors the ids of duplicated tiles)
//      (caution: newtiles' neighbors are all undefined)
//
function in_neighborsP2(tiles,newtilesdict){
  // iterate tiles and fill inner neighbors of newtiles
  for(let tile of tiles) {
    switch(tile.id[0]){

      case 'kite':
        //
        // --------------------------------
        // set kite's children inner neighbors
        // --------------------------------
        // 
        // new kite 1
        //
        {
          let newkite1id = JSON.parse(JSON.stringify(tile.id));
          newkite1id.push('kite1');
          // neighbor 1
          let n1id = JSON.parse(JSON.stringify(tile.id));
          n1id.push('kite2');
          newtilesdict.get(id2key(newkite1id)).neighbors[1] = n1id;
          // neighbor 2
          let n2id = JSON.parse(JSON.stringify(tile.id));
          n2id[0]='dart';
          n2id.push('dart1');
          newtilesdict.get(id2key(newkite1id)).neighbors[2] = n2id;
        }
        // 
        // new kite 2
        //
        {
          let newkite2id = JSON.parse(JSON.stringify(tile.id));
          newkite2id.push('kite2');
          // neighbor 1
          let n1id = JSON.parse(JSON.stringify(tile.id));
          n1id[0]='dart';
          n1id.push('dart2');
          newtilesdict.get(id2key(newkite2id)).neighbors[1] = n1id;
          // neighbor 2
          let n2id = JSON.parse(JSON.stringify(tile.id));
          n2id.push('kite1');
          newtilesdict.get(id2key(newkite2id)).neighbors[2] = n2id;
        }
        // 
        // new dart 1
        //
        {
          let newdart1id = JSON.parse(JSON.stringify(tile.id));
          newdart1id[0]='dart';
          newdart1id.push('dart1');
          // neighbor 2
          let n2id = JSON.parse(JSON.stringify(tile.id));
          n2id.push('kite1');
          newtilesdict.get(id2key(newdart1id)).neighbors[2] = n2id;
          // neighbor 3
          let n3id = JSON.parse(JSON.stringify(tile.id));
          n3id[0]='dart';
          n3id.push('dart2');
          newtilesdict.get(id2key(newdart1id)).neighbors[3] = n3id;
        }
        //
        // new dart 2
        //
        {
          let newdart2id = JSON.parse(JSON.stringify(tile.id));
          newdart2id[0]='dart';
          newdart2id.push('dart2');
          // neighbor 0
          let n0id = JSON.parse(JSON.stringify(tile.id));
          n0id[0]='dart';
          n0id.push('dart1');
          newtilesdict.get(id2key(newdart2id)).neighbors[0] = n0id;
          // neighbor 1
          let n1id = JSON.parse(JSON.stringify(tile.id));
          n1id.push('kite2');
          newtilesdict.get(id2key(newdart2id)).neighbors[1] = n1id;
        }
        //
        // done
        //
        break;

      case 'dart':
        //
        // --------------------------------
        // set dart's children inner neighbors
        // --------------------------------
        // 
        // new kite 1
        //
        {
          let newkite1id = JSON.parse(JSON.stringify(tile.id));
          newkite1id[0]='kite';
          newkite1id.push('kite1');
          // neighbor 1
          let n1id = JSON.parse(JSON.stringify(tile.id));
          n1id.push('dart1');
          newtilesdict.get(id2key(newkite1id)).neighbors[1] = n1id;
          // neighbor 2
          let n2id = JSON.parse(JSON.stringify(tile.id));
          n2id.push('dart2');
          newtilesdict.get(id2key(newkite1id)).neighbors[2] = n2id;
        }
        // 
        // new dart 1
        //
        {
          let newdart1id = JSON.parse(JSON.stringify(tile.id));
          newdart1id.push('dart1');
          // neighbor 1
          let n1id = JSON.parse(JSON.stringify(tile.id));
          n1id[0]='kite';
          n1id.push('kite1');
          newtilesdict.get(id2key(newdart1id)).neighbors[1] = n1id;
        }
        //
        // new dart 2
        //
        {
          let newdart2id = JSON.parse(JSON.stringify(tile.id));
          newdart2id.push('dart2');
          // neighbor 2
          let n2id = JSON.parse(JSON.stringify(tile.id));
          n2id[0]='kite';
          n2id.push('kite1');
          newtilesdict.get(id2key(newdart2id)).neighbors[2] = n2id;
        }
        //
        // done
        //
        break;

      default:
        // all tiles should be kite or dart
        console.log("caution: undefined tile type for in_neighborsP2, id="+tile.id);
    }
  }

  // tiles modified by side effect, nothing to return
  return;
}

// [1.5] set outer neighbors (neighbors outside the parent tile)
//      (caution: assumes no neighbor creation by the substitution)
//      (caution: may put in neighbors the ids of duplicated tiles)
//      (caution: newtiles' neighbors are undefined except inner neighbors)
//
function out_neighborsP2(tiles,newtilesdict,dup,pud){
  // iterate tiles and fill outer neighbors of newtiles
  // A. only outer neighbors which are not inner neighbors of a duplicate
  //    and only outer neighbors of adjacent tile
  for(let tile of tiles) {
    switch(tile.id[0]){

      case 'kite':
        //
        // --------------------------------
        // set kite's children outer neighbors (partial)
        // --------------------------------
        //
        // new kite 1
        //
        {
          let newkite1id = JSON.parse(JSON.stringify(tile.id));
          newkite1id.push('kite1');
          // neighbor 0
          if(tile.neighbors[1] == undefined){
            newtilesdict.get(id2key(newkite1id)).neighbors[0] = undefined;
          }
          else if(tile.neighbors[1][0] == 'kite'){
            let n0id = JSON.parse(JSON.stringify(tile.neighbors[1]));
            n0id.push('kite2');
            newtilesdict.get(id2key(newkite1id)).neighbors[0] = n0id;
          }
          else if(tile.neighbors[1][0] == 'dart'){
            let n0id = JSON.parse(JSON.stringify(tile.neighbors[1]));
            n0id.push('dart1');
            newtilesdict.get(id2key(newkite1id)).neighbors[0] = n0id;
          }
          // neighbor 3
          if(tile.neighbors[0] == undefined){
            newtilesdict.get(id2key(newkite1id)).neighbors[3] = undefined;
          }
          else if(tile.neighbors[0][0] == 'kite'){
            let n3id = JSON.parse(JSON.stringify(tile.neighbors[0]));
            n3id.push('kite2');
            newtilesdict.get(id2key(newkite1id)).neighbors[3] = n3id;
          }
          else if(tile.neighbors[0][0] == 'dart'){
            let n3id = JSON.parse(JSON.stringify(tile.neighbors[0]));
            n3id[0]='kite';
            n3id.push('kite1');
            newtilesdict.get(id2key(newkite1id)).neighbors[3] = n3id;
          }
        }
        //
        // new kite 2
        //
        {
          let newkite2id = JSON.parse(JSON.stringify(tile.id));
          newkite2id.push('kite2');
          // neighbor 0
          if(tile.neighbors[3] == undefined){
            newtilesdict.get(id2key(newkite2id)).neighbors[0] = undefined;
          }
          else if(tile.neighbors[3][0] == 'kite'){
            let n0id = JSON.parse(JSON.stringify(tile.neighbors[3]));
            n0id.push('kite1');
            newtilesdict.get(id2key(newkite2id)).neighbors[0] = n0id;
          }
          else if(tile.neighbors[3][0] == 'dart'){
            let n0id = JSON.parse(JSON.stringify(tile.neighbors[3]));
            n0id[0]='kite';
            n0id.push('kite1');
            newtilesdict.get(id2key(newkite2id)).neighbors[0] = n0id;
          }
          // neighbor 3
          if(tile.neighbors[2] == undefined){
            newtilesdict.get(id2key(newkite2id)).neighbors[3] = undefined;
          }
          else if(tile.neighbors[2][0] == 'kite'){
            let n3id = JSON.parse(JSON.stringify(tile.neighbors[2]));
            n3id.push('kite1');
            newtilesdict.get(id2key(newkite2id)).neighbors[3] = n3id;
          }
          else if(tile.neighbors[2][0] == 'dart'){
            let n3id = JSON.parse(JSON.stringify(tile.neighbors[2]));
            n3id.push('dart2');
            newtilesdict.get(id2key(newkite2id)).neighbors[3] = n3id;
          }
        }
        //
        // new dart 1
        //
        // neighbor 0 will be filled in step B
        // neighbor 1 will be filled in step B
        //
        // new dart 2
        //
        // neighbor 2 will be filled in step B
        // neighbor 3 will be filled in step B
        //
        // done
        //
        break;

      case 'dart':
        //
        // -------------------------------
        // dart substitution -> 1 kite, 2 darts
        // -------------------------------
        //
        //
        // new kite 1
        // 
        {
          let newkite1id = JSON.parse(JSON.stringify(tile.id));
          newkite1id[0]='kite';
          newkite1id.push('kite1');
          // neighbor 0
          if(tile.neighbors[0] == undefined){
            newtilesdict.get(id2key(newkite1id)).neighbors[0] = undefined;
          }
          else if(tile.neighbors[0][0] == 'kite'){
            let n0id = JSON.parse(JSON.stringify(tile.neighbors[0]));
            n0id.push('kite1');
            newtilesdict.get(id2key(newkite1id)).neighbors[0] = n0id;
          }
          else if(tile.neighbors[0][0] == 'dart'){
            let n0id = JSON.parse(JSON.stringify(tile.neighbors[0]));
            n0id[0]='kite';
            n0id.push('kite1');
            newtilesdict.get(id2key(newkite1id)).neighbors[0] = n0id;
          }
          // neighbor 3
          if(tile.neighbors[3] == undefined){
            newtilesdict.get(id2key(newkite1id)).neighbors[3] = undefined;
          }
          else if(tile.neighbors[3][0] == 'kite'){
            let n3id = JSON.parse(JSON.stringify(tile.neighbors[3]));
            n3id.push('kite2');
            newtilesdict.get(id2key(newkite1id)).neighbors[3] = n3id;
          }
          else if(tile.neighbors[3][0] == 'dart'){
            let n3id = JSON.parse(JSON.stringify(tile.neighbors[3]));
            n3id[0]='kite';
            n3id.push('kite1');
            newtilesdict.get(id2key(newkite1id)).neighbors[3] = n3id;
          }
        }
        //
        // new dart 1
        //
        {
          let newdart1id = JSON.parse(JSON.stringify(tile.id));
          newdart1id.push('dart1');
          // neighbor 0
          if(tile.neighbors[1] == undefined){
            newtilesdict.get(id2key(newdart1id)).neighbors[0] = undefined;
          }
          else if(tile.neighbors[1][0] == 'kite'){
            let n0id = JSON.parse(JSON.stringify(tile.neighbors[1]));
            n0id.push('kite1');
            newtilesdict.get(id2key(newdart1id)).neighbors[0] = n0id;
          }
          else{
            console.log("caution: unexpected tile type for neighbor 1 of dart in out_neighborsP2, id="+tile.id+" neighbors[1]="+tile.neighbors[1]);
          }
        }
        // neighbor 2 will be filled in step B
        // neighbor 3 will be filled in step B
        //
        // new dart 2
        //
        {
          let newdart2id = JSON.parse(JSON.stringify(tile.id));
          newdart2id.push('dart2');
          // neighbor 0 will be filled in step B
          // neighbor 1 will be filled in step B
          // neighbor 3
          if(tile.neighbors[2] == undefined){
            newtilesdict.get(id2key(newdart2id)).neighbors[3] = undefined;
          }
          else if(tile.neighbors[2][0] == 'kite'){
            let n3id = JSON.parse(JSON.stringify(tile.neighbors[2]));
            n3id.push('kite2');
            newtilesdict.get(id2key(newdart2id)).neighbors[3] = n3id;
          }
          else{
            console.log("caution: unexpected tile type for neighbor 2 of dart in out_neighborsP2 A, id="+tile.id+" neighbors[2]="+tile.neighbors[2]);
          }
        }
        //
        // done
        //
        break;

      default:
        console.log("caution: undefined tile type for out_neighborsP2 A, id="+tile.id);
    }
  }

  // iterate tiles and fill outer neighbors of newtiles
  // B. propagate information
  //   (caution: only needed for non duplicated tiles)
  //   (caution: if no duplicate to get information then undefined)
  for(let tile of tiles) {
    switch(tile.id[0]){

      case 'kite':
        //
        // new dart 1
        // 
        {
          let newdart1id = JSON.parse(JSON.stringify(tile.id));
          newdart1id[0]='dart';
          newdart1id.push('dart1');
          // neighbors 0,1
          if(tile.neighbors[0] == undefined){
            newtilesdict.get(id2key(newdart1id)).neighbors[0] = undefined;
            newtilesdict.get(id2key(newdart1id)).neighbors[1] = undefined;
          }
          else{
            // get duplicate and copy these neighbors
            let pudkey = pud.get(id2key(newdart1id));
            newtilesdict.get(id2key(newdart1id)).neighbors[0] = newtilesdict.get(pudkey).neighbors[0];
            newtilesdict.get(id2key(newdart1id)).neighbors[1] = newtilesdict.get(pudkey).neighbors[1];
          }
        }
        //
        // new dart 2
        // 
        {
          let newdart2id = JSON.parse(JSON.stringify(tile.id));
          newdart2id[0]='dart';
          newdart2id.push('dart2');
          // neighbors 2,3
          if(!dup.has(id2key(newdart2id))){
            // not a duplicated tile
            if(tile.neighbors[3] == undefined){
              newtilesdict.get(id2key(newdart2id)).neighbors[2] = undefined;
              newtilesdict.get(id2key(newdart2id)).neighbors[3] = undefined;
            }
            else{
              // get duplicate and copy these neighbors
              let pudkey = pud.get(id2key(newdart2id));
              newtilesdict.get(id2key(newdart2id)).neighbors[2] = newtilesdict.get(pudkey).neighbors[2];
              newtilesdict.get(id2key(newdart2id)).neighbors[3] = newtilesdict.get(pudkey).neighbors[3];
            }
          }
        }
        break;

      case 'dart':
        //
        // new dart 1
        // 
        {
          let newdart1id = JSON.parse(JSON.stringify(tile.id));
          newdart1id.push('dart1');
          // neighbors 2,3
          if(!dup.has(id2key(newdart1id))){
            // not a duplicated tile
            if(tile.neighbors[0] == undefined){
              newtilesdict.get(id2key(newdart1id)).neighbors[2] = undefined;
              newtilesdict.get(id2key(newdart1id)).neighbors[3] = undefined;
            }
            else{
              // get duplicate and copy these neighbors
              let pudkey = pud.get(id2key(newdart1id));
              newtilesdict.get(id2key(newdart1id)).neighbors[2] = newtilesdict.get(pudkey).neighbors[2];
              newtilesdict.get(id2key(newdart1id)).neighbors[3] = newtilesdict.get(pudkey).neighbors[3];
            }
          }
        }
        //
        // new dart 2
        // 
        {
          let newdart2id = JSON.parse(JSON.stringify(tile.id));
          newdart2id.push('dart2');
          // neighbors 0,1
          if(!dup.has(id2key(newdart2id))){
            // not a duplicated tile
            if(tile.neighbors[3] == undefined){
              newtilesdict.get(id2key(newdart2id)).neighbors[0] = undefined;
              newtilesdict.get(id2key(newdart2id)).neighbors[1] = undefined;
            }
            else{
              console.log("caution: unexpected new dart 2 not duplicated but parent dart has a neighbor 3, in out_neighborsP2 B, id="+newdart2id);
            }
          }
        }
        break;

      default:
        console.log("caution: undefined tile type for out_neighborsP2 B, id="+tile.id);
    }
  }

  // tiles modified by side effect, nothing to return
  return;
}

// [1.6] remove duplicated tiles and update neighbors
// TODO what is the best datastructure for this ? newtiles or newtilesdict ?
//
function cleanP2(newtiles,dup){
  // A. remove duplicated tiles
  newtiles = newtiles.filter(a => !dup.has(id2key(a.id)));
  // B. update neighbors
  newtiles.forEach(newtile =>
    newtile.neighbors = newtile.neighbors.map(nid => {
      if(dup.has(id2key(nid))){
        return dup.get(id2key(nid));
      }
      else{
        return nid;
      }
    }));
  // done
  return newtiles;
}

// convert an id array into a key (used in maps)
function id2key (a){
  return JSON.stringify(a);
}

