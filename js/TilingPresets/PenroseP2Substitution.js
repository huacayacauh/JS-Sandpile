// This code is part of JS-Sandpile (https://github.com/huacayacauh/JS-Sandpile/)
// CC-BY Valentin Darrigo, Jeremy Fersula, Kevin Perrot

// Penrose P2 (kite-dart)
// substitution described at
// http://tilings.math.uni-bielefeld.de/substitution/penrose-kite-dart/

//
// [0] toolbox
//

// golden ratio
var phi = (1+Math.sqrt(5))/2;

//
// [1] define tile types P2
//

// kite
var bounds = [];
bounds.push(0,0);
bounds.push(phi*Math.sin(Math.PI/5),phi*Math.cos(Math.PI/5));
// remark that... phi*cos(pi/5)+sin(pi/10) = phi
bounds.push(0,phi*Math.cos(Math.PI/5)+Math.sin(Math.PI/10));
bounds.push(-phi*Math.sin(Math.PI/5),phi*Math.cos(Math.PI/5));
var kite = new Tile(['kite'],[],bounds,4);

// dart
var bounds = [];
bounds.push(0,0);
bounds.push(phi*Math.sin(Math.PI/5),phi*Math.cos(Math.PI/5));
// remark that... phi*cos(pi/5)-sin(pi/10) = 1
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
// [2] define substitution P2
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
      newkite1.scale(tile.bounds[0],tile.bounds[1],1/phi);
      newkite1.rotate(tile.bounds[0],tile.bounds[1],3*Math.PI/5);
      newkite1.shift(tile.bounds[2]-tile.bounds[0],tile.bounds[3]-tile.bounds[1]);
      newtiles.push(newkite1);

      // new kite 2
      var newkite2 = tile.myclone();
      newkite2.id.push('kite2');
      newkite2.scale(tile.bounds[0],tile.bounds[1],1/phi);
      newkite2.rotate(tile.bounds[0],tile.bounds[1],-3*Math.PI/5);
      newkite2.shift(tile.bounds[6]-tile.bounds[0],tile.bounds[7]-tile.bounds[1]);
      newtiles.push(newkite2);

      // new dart 1
      var newdart1 = tile.myclone();
      newdart1.kite2dart();
      newdart1.id.push('dart1');
      newdart1.scale(tile.bounds[0],tile.bounds[1],1/phi);
      newdart1.rotate(tile.bounds[0],tile.bounds[1],-Math.PI/5);
      newtiles.push(newdart1);

      // new dart 2
      var newdart2 = tile.myclone();
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
      newkite1.dart2kite();
      newkite1.id.push('kite1');
      newkite1.scale(tile.bounds[0],tile.bounds[1],1/phi);
      newtiles.push(newkite1);

      // new dart 1
      var newdart1 = tile.myclone();
      newdart1.id.push('dart1');
      newdart1.scale(tile.bounds[0],tile.bounds[1],1/phi);
      newdart1.rotate(tile.bounds[0],tile.bounds[1],4*Math.PI/5);
      newdart1.shift(tile.bounds[2]-tile.bounds[0],tile.bounds[3]-tile.bounds[1]);
      newtiles.push(newdart1);

      // new dart 2
      var newdart2 = tile.myclone();
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

//
// [3] defined duplicated tile informations P2
//

var duplicatedP2 = [];
duplicatedP2.push(new DupInfo('kite','dart','dart2',3,'kite','dart1'));
duplicatedP2.push(new DupInfo('dart','dart','dart1',0,'kite','dart1'));
duplicatedP2.push(new DupInfo('dart','dart','dart2',3,'kite','dart2'));
duplicatedP2.push(new DupInfo('dart','dart','dart2',3,'dart','dart1'));

var duplicatedP2oriented = [];

//
// [4] fill neighbors informations in P2 newtiles (by side effect)
//
function neighborsP2(tiles,tilesdict,newtiles,newtilesdict,newdup){
  // iterate tiles and fill neighbors of newtiles
  for(let tile of tiles) {
    switch(tile.id[0]){

      case 'kite':
        //
        // --------------------------------
        // set kite's children neighbors
        // --------------------------------
        //
        // new kite 1
        //
        // neighbor 0
        if(tile.neighbors[1] != undefined){
          switch(tile.neighbors[1][0]){
            case 'kite':
              setNeighbor(newtilesdict,tile.id,'kite1','kite',0,tile.neighbors[1],'kite2','kite');
              break;
            case 'dart':
              setNeighbor(newtilesdict,tile.id,'kite1','kite',0,tile.neighbors[1],'dart1','dart');
          }
        }
        else{
          setNeighborUndefined(newtilesdict,tile.id,'kite1','kite',0);
        }
        // neighbor 1
        setNeighbor(newtilesdict,tile.id,'kite1','kite',1,tile.id,'kite2','kite');
        // neighbor 2
        setNeighbor(newtilesdict,tile.id,'kite1','kite',2,tile.id,'dart1','dart');
        // neighbor 3
        if(tile.neighbors[0] != undefined){
          switch(tile.neighbors[0][0]){
            case 'kite':
              setNeighbor(newtilesdict,tile.id,'kite1','kite',3,tile.neighbors[0],'kite2','kite');
              break;
            case 'dart':
              setNeighbor(newtilesdict,tile.id,'kite1','kite',3,tile.neighbors[0],'kite1','kite');
          }
        }
        else{
          setNeighborUndefined(newtilesdict,tile.id,'kite1','kite',3);
        }
        //
        // new kite 2
        //
        // neighbor 0
        if(tile.neighbors[3] != undefined){
          switch(tile.neighbors[3][0]){
            case 'kite':
              setNeighbor(newtilesdict,tile.id,'kite2','kite',0,tile.neighbors[3],'kite1','kite');
              break;
            case 'dart':
              setNeighbor(newtilesdict,tile.id,'kite2','kite',0,tile.neighbors[3],'kite1','kite');
          }
        }
        else{
          setNeighborUndefined(newtilesdict,tile.id,'kite2','kite',0);
        }
        // neighbor 1
        //setNeighborMaybeDup(newtilesdict,tile.id,'kite2','kite',1,tile.id,'dart2','dart',newdup);
        setNeighbor(newtilesdict,tile.id,'kite2','kite',1,tile.id,'dart2','dart');
        // neighbor 2
        setNeighbor(newtilesdict,tile.id,'kite2','kite',2,tile.id,'kite1','kite');
        // neighbor 3
        if(tile.neighbors[2] != undefined){
          switch(tile.neighbors[2][0]){
            case 'kite':
              setNeighbor(newtilesdict,tile.id,'kite2','kite',3,tile.neighbors[2],'kite1','kite');
              break;
            case 'dart':
              //setNeighborMaybeDup(newtilesdict,tile.id,'kite2','kite',3,tile.neighbors[2],'dart2','dart',newdup);
              setNeighbor(newtilesdict,tile.id,'kite2','kite',3,tile.neighbors[2],'dart2','dart');
          }
        }
        else{
          setNeighborUndefined(newtilesdict,tile.id,'kite2','kite',3);
        }
        //
        // new dart 1
        //
        // neighbor 0
        if(  tile.neighbors[0] != undefined
          && tile.neighbors[0][0] == 'kite'){
          //setNeighborMaybeDup(newtilesdict,tile.id,'dart1','dart',0,tile.neighbors[0],'dart1','dart',newdup);
          setNeighbor(newtilesdict,tile.id,'dart1','dart',0,tile.neighbors[0],'dart1','dart');
        }
        else if( tile.neighbors[0] != undefined
              && tile.neighbors[0][0] == 'dart'
              && tilesdict.get(id2key(tile.neighbors[0])).neighbors[1] != undefined
              && tilesdict.get(id2key(tile.neighbors[0])).neighbors[1][0] == 'kite'){
          setNeighbor(newtilesdict,tile.id,'dart1','dart',0,tilesdict.get(id2key(tile.neighbors[0])).neighbors[1],'kite1','kite');
        }
        else{
          setNeighborUndefined(newtilesdict,tile.id,'dart1','dart',0);
        }
        // neighbor 1
        if(tile.neighbors[0] != undefined){
          switch(tile.neighbors[0][0]){
            case 'kite':
              setNeighbor(newtilesdict,tile.id,'dart1','dart',1,tile.neighbors[0],'kite2','kite');
              break;
            case 'dart':
              setNeighbor(newtilesdict,tile.id,'dart1','dart',1,tile.neighbors[0],'kite1','kite');
          }
        }
        else{
          setNeighborUndefined(newtilesdict,tile.id,'dart1','dart',1);
        }
        // neighbor 2
        setNeighbor(newtilesdict,tile.id,'dart1','dart',2,tile.id,'kite1','kite');
        // neighbor 3
        //setNeighborMaybeDup(newtilesdict,tile.id,'dart1','dart',3,tile.id,'dart2','dart',newdup);
        setNeighbor(newtilesdict,tile.id,'dart1','dart',3,tile.id,'dart2','dart');
        //
        // new dart 2
        //
        // maybe dup
        if(!isDup(newdup,tile.id,'dart2','dart')){
          //neighbor 0
          setNeighbor(newtilesdict,tile.id,'dart2','dart',0,tile.id,'dart1','dart');
          //neighbor 1
          setNeighbor(newtilesdict,tile.id,'dart2','dart',1,tile.id,'kite2','kite');
          //neighbor 2
          if(tile.neighbors[3] != undefined){
            switch(tile.neighbors[3][0]){
              case 'kite':
                setNeighbor(newtilesdict,tile.id,'dart2','dart',2,tile.neighbors[3],'kite1','kite');
                break;
              case 'dart':
                setNeighbor(newtilesdict,tile.id,'dart2','dart',2,tile.neighbors[3],'kite1','kite');
            }
          }
          else{
            setNeighborUndefined(newtilesdict,tile.id,'dart2','dart',2);
          }
          //neighbor 3
          if(  tile.neighbors[3] != undefined
            && tile.neighbors[3][0] == 'dart'
            && tilesdict.get(id2key(tile.neighbors[3])).neighbors[2] != undefined
            && tilesdict.get(id2key(tile.neighbors[3])).neighbors[2][0] == 'kite'){
            setNeighbor(newtilesdict,tile.id,'dart2','dart',3,tilesdict.get(id2key(tile.neighbors[3])).neighbors[2],'kite2','kite');
          }
          else{
            setNeighborUndefined(newtilesdict,tile.id,'dart2','dart',3);
          }
        }
        //
        // done
        //
        break;

      case 'dart':
        //
        // --------------------------------
        // set dart's children neighbors
        // --------------------------------
        //
        // new kite 1
        //
        // neighbor 0
        if(tile.neighbors[0] != undefined){
          switch(tile.neighbors[0][0]){
            case 'kite':
              setNeighbor(newtilesdict,tile.id,'kite1','kite',0,tile.neighbors[0],'kite1','kite');
              break;
            case 'dart':
              setNeighbor(newtilesdict,tile.id,'kite1','kite',0,tile.neighbors[0],'kite1','kite');
          }
        }
        else{
          setNeighborUndefined(newtilesdict,tile.id,'kite1','kite',0);
        }
        // neighbor 1
        //setNeighborMaybeDup(newtilesdict,tile.id,'kite1','kite',1,tile.id,'dart1','dart',newdup);
        setNeighbor(newtilesdict,tile.id,'kite1','kite',1,tile.id,'dart1','dart');
        // neighbor 2
        //setNeighborMaybeDup(newtilesdict,tile.id,'kite1','kite',2,tile.id,'dart2','dart',newdup);
        setNeighbor(newtilesdict,tile.id,'kite1','kite',2,tile.id,'dart2','dart');
        // neighbor 3
        if(tile.neighbors[3] != undefined){
          switch(tile.neighbors[3][0]){
            case 'kite':
              setNeighbor(newtilesdict,tile.id,'kite1','kite',3,tile.neighbors[3],'kite2','kite');
              break;
            case 'dart':
              setNeighbor(newtilesdict,tile.id,'kite1','kite',3,tile.neighbors[3],'kite1','kite');
          }
        }
        else{
          setNeighborUndefined(newtilesdict,tile.id,'kite1','kite',3);
        }
        //
        // new dart 1
        //
        // maybe dup
        if(!isDup(newdup,tile.id,'dart1','dart')){
          // neighbor 0
          if(  tile.neighbors[1] != undefined
            && tile.neighbors[1][0] == 'kite'){
            setNeighbor(newtilesdict,tile.id,'dart1','dart',0,tile.neighbors[1],'kite1','kite');
          }
          else{
            setNeighborUndefined(newtilesdict,tile.id,'dart1','dart',0);
          }
          // neighbor 1
          setNeighbor(newtilesdict,tile.id,'dart1','dart',1,tile.id,'kite1','kite');
          // neighbor 2
          if(tile.neighbors[0] != undefined){
            switch(tile.neighbors[0][0]){
              case 'kite':
                setNeighbor(newtilesdict,tile.id,'dart1','dart',2,tile.neighbors[0],'kite1','kite');
                break;
              case 'dart':
                setNeighbor(newtilesdict,tile.id,'dart1','dart',2,tile.neighbors[0],'kite1','kite');
            }
          }
          else{
            setNeighborUndefined(newtilesdict,tile.id,'dart1','dart',2);
          }
          // neighbor 3
          if(  tile.neighbors[0] != undefined
            && tile.neighbors[0][0] == 'dart'
            && tilesdict.get(id2key(tile.neighbors[0])).neighbors[2] != undefined
            && tilesdict.get(id2key(tile.neighbors[0])).neighbors[2][0] == 'kite'){
            setNeighbor(newtilesdict,tile.id,'dart1','dart',3,tilesdict.get(id2key(tile.neighbors[0])).neighbors[2],'kite2','kite');
          }
          else{
            setNeighborUndefined(newtilesdict,tile.id,'dart1','dart',3);
          }
        }
        //
        // new dart 2
        //
        // maybe dup
        if(!isDup(newdup,tile.id,'dart2','dart')){
          // neighbor 0
          setNeighborUndefined(newtilesdict,tile.id,'dart2','dart',0);
          // neighbor 1
          setNeighborUndefined(newtilesdict,tile.id,'dart2','dart',1);
          // neighbor 2
          setNeighbor(newtilesdict,tile.id,'dart2','dart',2,tile.id,'kite1','kite');
          // neighbor 3
          if(  tile.neighbors[2] != undefined
            && tile.neighbors[2][0] == 'kite'){
            setNeighbor(newtilesdict,tile.id,'dart2','dart',3,tile.neighbors[2],'kite2','kite');
          }
          else{
            setNeighborUndefined(newtilesdict,tile.id,'dart2','dart',3);
          }
        }
        //
        // done
        //
        break;

      default:
        // all tiles should be kite or dart
        console.log("caution: undefined tile type for neighborsP2, id="+tile.id);
    }
  }

  // neighbors modified by side effect in tilesdict, nothing to return
  return;
}

//
// [6] use default neighbors2bounds
// 
var neighbors2boundsP2 = new Map();
neighbors2boundsP2.set('kite',default_neighbors2bounds(4));
neighbors2boundsP2.set('dart',default_neighbors2bounds(4));

//
// [7] construct base tilings and call substitute
//

// prepare decoration
decorateP2 = new Map();
decorateP2.set('kite',0);
decorateP2.set('dart',1);

//
// [7.1] construct "P2 (kite-dart) Sun by subst" tiling by substitution
// 
Tiling.P2sunbysubst = function({iterations}={}){
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
  // call the substitution
  tiles = substitute(
    iterations,
    tiles,
    phi,
    substitutionP2,
    duplicatedP2,
    duplicatedP2oriented,
    neighborsP2,
    neighbors2boundsP2,
    decorateP2
  );
  // construct tiling
  return new Tiling(tiles);
}

//
// [7.2] construct "P2 (kite-dart) Star by subst" tiling by substitution
// 
Tiling.P2starbysubst = function({iterations}={}){
  var tiles = [];
  // push base "star" tiling
  for(var i=0; i<5; i++){
    // construct tiles
    var mydart = dart.myclone();
    mydart.id.push(i);
    mydart.rotate(0,0,i*2*Math.PI/5);
    // define neighbors with undefined on the boundary
    mydart.neighbors.push(['dart',(i-1+5)%5]); // 0
    mydart.neighbors.push(undefined); // 1
    mydart.neighbors.push(undefined); // 2
    mydart.neighbors.push(['dart',(i+1)%5]); // 3
    tiles.push(mydart);
  }
  // call the substitution
  tiles = substitute(
    iterations,
    tiles,
    phi,
    substitutionP2,
    duplicatedP2,
    duplicatedP2oriented,
    neighborsP2,
    neighbors2boundsP2,
    decorateP2
  );
  // construct tiling
  return new Tiling(tiles);
}

