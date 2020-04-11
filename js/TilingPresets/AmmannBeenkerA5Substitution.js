// This code is part of JS-Sandpile (https://github.com/huacayacauh/JS-Sandpile/)
// CC-BY Valentin Darrigo, Jeremy Fersula, Kevin Perrot

// Ammann-Beenker tiling (set A5)
// substitution described at
// http://tilings.math.uni-bielefeld.de/substitution/ammann-beenker/

//
// [0] toolbox
//

// sqrt(2)
var sqrt2 = Math.sqrt(2);

//
// [1] define tile types A5
//

// square
var bounds = [];
bounds.push(0,0);
bounds.push(sqrt2/2,sqrt2/2);
bounds.push(0,sqrt2);
bounds.push(-sqrt2/2,sqrt2/2);
var square = new Tile(['square'],[],bounds,4);

// rhombus
var bounds = [];
bounds.push(0,0);
bounds.push(0,1);
bounds.push(-sqrt2/2,sqrt2/2+1);
bounds.push(-sqrt2/2,sqrt2/2);
var rhombus = new Tile(['rhombus'],[],bounds,4);

// convert a square to a rhombus
Tile.prototype.square2rhombus = function(){
  this.id[0]='rhombus';
  var b23 = rotatePoint(this.bounds[2],this.bounds[3],this.bounds[0],this.bounds[1],Math.PI/4);
  this.bounds[2] = b23[0];
  this.bounds[3] = b23[1];
  var b45 = rotatePoint(this.bounds[4],this.bounds[5],this.bounds[6],this.bounds[7],Math.PI/4);
  this.bounds[4] = b45[0];
  this.bounds[5] = b45[1];
}

// convert a rhombus to a square
Tile.prototype.rhombus2square = function(){
  this.id[0]='square';
  var b23 = rotatePoint(this.bounds[2],this.bounds[3],this.bounds[0],this.bounds[1],-Math.PI/4);
  this.bounds[2] = b23[0];
  this.bounds[3] = b23[1];
  var b45 = rotatePoint(this.bounds[4],this.bounds[5],this.bounds[6],this.bounds[7],-Math.PI/4);
  this.bounds[4] = b45[0];
  this.bounds[5] = b45[1];
}

//
// [2] define substitution A5
//
function substitutionA5(tile){
  switch(tile.id[0]){
    case 'square':
      //
      // -------------------------------
      // square substitution -> 5 squares, 4 rhombuses
      // -------------------------------
      //
      var newtiles = [];

      // new square 0
      var news0 = tile.myclone();
      news0.id.push('s0');
      news0.scale(tile.bounds[0],tile.bounds[1],1/(1+sqrt2));
      news0.rotate(tile.bounds[0],tile.bounds[1],3*Math.PI/4);
      news0.shift(tile.bounds[2]-tile.bounds[0],tile.bounds[3]-tile.bounds[1]);
      newtiles.push(news0);

      // new square 1
      var news1 = tile.myclone();
      news1.id.push('s1');
      news1.scale(tile.bounds[0],tile.bounds[1],1/(1+sqrt2));
      news1.rotate(tile.bounds[0],tile.bounds[1],-3*Math.PI/4);
      news1.shift(tile.bounds[4]-tile.bounds[0],tile.bounds[5]-tile.bounds[1]);
      newtiles.push(news1);

      // new square 2
      var news2 = tile.myclone();
      news2.id.push('s2');
      news2.scale(tile.bounds[0],tile.bounds[1],1/(1+sqrt2));
      news2.rotate(tile.bounds[0],tile.bounds[1],3*Math.PI/4);
      news2.shift(tile.bounds[4]-tile.bounds[0],tile.bounds[5]-tile.bounds[1]);
      newtiles.push(news2);

      // new square 3
      var news3 = tile.myclone();
      news3.id.push('s3');
      news3.scale(tile.bounds[0],tile.bounds[1],1/(1+sqrt2));
      news3.rotate(tile.bounds[0],tile.bounds[1],-3*Math.PI/4);
      news3.shift(tile.bounds[6]-tile.bounds[0],tile.bounds[7]-tile.bounds[1]);
      newtiles.push(news3);

      // new square 4
      var news4 = tile.myclone();
      news4.id.push('s4');
      news4.scale(tile.bounds[0],tile.bounds[1],1/(1+sqrt2));
      news4.rotate(tile.bounds[0],tile.bounds[1],Math.PI);
      news4.shift((1+sqrt2)/(2+sqrt2)*(tile.bounds[4]-tile.bounds[0]),(1+sqrt2)/(2+sqrt2)*(tile.bounds[5]-tile.bounds[1]));
      newtiles.push(news4);

      // new rhombus 0
      var newr0 = tile.myclone();
      newr0.square2rhombus();
      newr0.id.push('r0');
      newr0.scale(tile.bounds[0],tile.bounds[1],1/(1+sqrt2));
      newr0.rotate(tile.bounds[0],tile.bounds[1],-Math.PI/4);
      newtiles.push(newr0);

      // new rhombus 1
      var newr1 = tile.myclone();
      newr1.square2rhombus();
      newr1.id.push('r1');
      newr1.scale(tile.bounds[0],tile.bounds[1],1/(1+sqrt2));
      newr1.rotate(tile.bounds[0],tile.bounds[1],Math.PI/4);
      newr1.shift(tile.bounds[2]-tile.bounds[0],tile.bounds[3]-tile.bounds[1]);
      newtiles.push(newr1);

      // new rhombus 2
      var newr2 = tile.myclone();
      newr2.square2rhombus();
      newr2.id.push('r2');
      newr2.scale(tile.bounds[0],tile.bounds[1],1/(1+sqrt2));
      newr2.rotate(tile.bounds[0],tile.bounds[1],-Math.PI/2);
      newr2.shift(tile.bounds[6]-tile.bounds[0],tile.bounds[7]-tile.bounds[1]);
      newtiles.push(newr2);

      // new rhombus 3
      var newr3 = tile.myclone();
      newr3.square2rhombus();
      newr3.id.push('r3');
      newr3.scale(tile.bounds[0],tile.bounds[1],1/(1+sqrt2));
      newtiles.push(newr3);

      // done
      return newtiles;
      break;

    case 'rhombus':
      //
      // -------------------------------
      // rhombus substitution -> 4 squares, 3 rhombuses
      // -------------------------------
      //
      var newtiles = [];

      // new square 0
      var news0 = tile.myclone();
      news0.rhombus2square();
      news0.id.push('s0');
      news0.scale(tile.bounds[0],tile.bounds[1],1/(1+sqrt2));
      news0.rotate(tile.bounds[0],tile.bounds[1],Math.PI);
      news0.shift(tile.bounds[2]-tile.bounds[0],tile.bounds[3]-tile.bounds[1]);
      newtiles.push(news0);

      // new square 1
      var news1 = tile.myclone();
      news1.rhombus2square();
      news1.id.push('s1');
      news1.scale(tile.bounds[0],tile.bounds[1],1/(1+sqrt2));
      news1.rotate(tile.bounds[0],tile.bounds[1],Math.PI/4);
      news1.shift(tile.bounds[2]-tile.bounds[0],tile.bounds[3]-tile.bounds[1]);
      newtiles.push(news1);

      // new square 2
      var news2 = tile.myclone();
      news2.rhombus2square();
      news2.id.push('s2');
      news2.scale(tile.bounds[0],tile.bounds[1],1/(1+sqrt2));
      news2.shift(tile.bounds[6]-tile.bounds[0],tile.bounds[7]-tile.bounds[1]);
      newtiles.push(news2);

      // new square 3
      var news3 = tile.myclone();
      news3.rhombus2square();
      news3.id.push('s3');
      news3.scale(tile.bounds[0],tile.bounds[1],1/(1+sqrt2));
      news3.rotate(tile.bounds[0],tile.bounds[1],-3*Math.PI/4);
      news3.shift(tile.bounds[6]-tile.bounds[0],tile.bounds[7]-tile.bounds[1]);
      newtiles.push(news3);

      // new rhombus 0
      var newr0 = tile.myclone();
      newr0.id.push('r0');
      newr0.scale(tile.bounds[0],tile.bounds[1],1/(1+sqrt2));
      newtiles.push(newr0);
      
      // new rhombus 1
      var newr1 = tile.myclone();
      newr1.id.push('r1');
      newr1.scale(tile.bounds[4],tile.bounds[5],1/(1+sqrt2));
      newtiles.push(newr1);

      // new rhombus 2
      var newr2 = tile.myclone();
      newr2.id.push('r2');
      newr2.scale(tile.bounds[0],tile.bounds[1],1/(1+sqrt2));
      newr2.rotate(tile.bounds[0],tile.bounds[1],Math.PI/2);
      newr2.shift(tile.bounds[2]-tile.bounds[0],tile.bounds[3]-tile.bounds[1]);
      newtiles.push(newr2);

      // done
      return newtiles;
      break;

    default:
      // all tiles should be square or rhombus
      console.log("caution: undefined tile type for substitutionA5, id="+tile.id);
  }
}

//
// [3] defined duplicated tile informations A5
//

var duplicatedA5 = [];

var duplicatedA5oriented = [];
duplicatedA5oriented.push(new DupInfoOriented('rhombus','square','s1',1,'square','s0',0)); // 1
duplicatedA5oriented.push(new DupInfoOriented('rhombus','square','s3',3,'square','s0',0)); // 2
duplicatedA5oriented.push(new DupInfoOriented('rhombus','square','s1',1,'square','s1',1)); // 3
duplicatedA5oriented.push(new DupInfoOriented('rhombus','square','s3',3,'square','s1',1)); // 4
duplicatedA5oriented.push(new DupInfoOriented('rhombus','square','s0',0,'square','s2',2)); // 5
duplicatedA5oriented.push(new DupInfoOriented('rhombus','square','s2',2,'square','s2',2)); // 6
duplicatedA5oriented.push(new DupInfoOriented('rhombus','square','s0',0,'square','s3',3)); // 7
duplicatedA5oriented.push(new DupInfoOriented('rhombus','square','s2',2,'square','s3',3)); // 8
duplicatedA5oriented.push(new DupInfoOriented('square','square','s2',2,'square','s0',0)); // 9
duplicatedA5oriented.push(new DupInfoOriented('square','square','s3',3,'square','s0',0)); // 10
duplicatedA5oriented.push(new DupInfoOriented('square','square','s2',2,'square','s1',1)); // 11
duplicatedA5oriented.push(new DupInfoOriented('square','square','s3',3,'square','s1',1)); // 12
duplicatedA5oriented.push(new DupInfoOriented('rhombus','square','s1',1,'rhombus','s0',0)); // 13
duplicatedA5oriented.push(new DupInfoOriented('rhombus','square','s3',3,'rhombus','s0',0)); // 14
duplicatedA5oriented.push(new DupInfoOriented('rhombus','square','s2',2,'rhombus','s1',1)); // 15
duplicatedA5oriented.push(new DupInfoOriented('rhombus','square','s3',3,'rhombus','s2',2)); // 16

//
// [4] fill neighbors informations in A5 newtiles (by side effect)
//
function neighborsA5(tiles,tilesdict,newtiles,newtilesdict,newdup){
  // iterate tiles and fill neighbors of newtiles
  for(let tile of tiles) {
    switch(tile.id[0]){

      case 'square':
        //
        // --------------------------------
        // set square's children neighbors
        // --------------------------------
        //
        // set inner neighborhood (even for duplicated, don't mind)
        //
        setNeighbor(newtilesdict,tile.id,'r3','rhombus',0,tile.id,'r0','rhombus');
        setNeighbor(newtilesdict,tile.id,'r0','rhombus',3,tile.id,'r3','rhombus');
        setNeighbor(newtilesdict,tile.id,'r0','rhombus',1,tile.id,'s0','square');
        setNeighbor(newtilesdict,tile.id,'s0','square',1,tile.id,'r0','rhombus');
        setNeighbor(newtilesdict,tile.id,'s0','square',0,tile.id,'r1','rhombus');
        setNeighbor(newtilesdict,tile.id,'r1','rhombus',3,tile.id,'s0','square');
        setNeighbor(newtilesdict,tile.id,'r1','rhombus',1,tile.id,'s1','square');
        setNeighbor(newtilesdict,tile.id,'s1','square',1,tile.id,'r1','rhombus');
        setNeighbor(newtilesdict,tile.id,'s1','square',0,tile.id,'s2','square');
        setNeighbor(newtilesdict,tile.id,'s2','square',3,tile.id,'s1','square');
        setNeighbor(newtilesdict,tile.id,'s2','square',2,tile.id,'r2','rhombus');
        setNeighbor(newtilesdict,tile.id,'r2','rhombus',2,tile.id,'s2','square');
        setNeighbor(newtilesdict,tile.id,'r2','rhombus',0,tile.id,'s3','square');
        setNeighbor(newtilesdict,tile.id,'s3','square',3,tile.id,'r2','rhombus');
        setNeighbor(newtilesdict,tile.id,'s3','square',2,tile.id,'r3','rhombus');
        setNeighbor(newtilesdict,tile.id,'r3','rhombus',2,tile.id,'s3','square');
        setNeighbor(newtilesdict,tile.id,'s4','square',0,tile.id,'r2','rhombus');
        setNeighbor(newtilesdict,tile.id,'s4','square',1,tile.id,'r3','rhombus');
        setNeighbor(newtilesdict,tile.id,'s4','square',2,tile.id,'r0','rhombus');
        setNeighbor(newtilesdict,tile.id,'s4','square',3,tile.id,'r1','rhombus');
        setNeighbor(newtilesdict,tile.id,'r2','rhombus',1,tile.id,'s4','square');
        setNeighbor(newtilesdict,tile.id,'r3','rhombus',1,tile.id,'s4','square');
        setNeighbor(newtilesdict,tile.id,'r0','rhombus',2,tile.id,'s4','square');
        setNeighbor(newtilesdict,tile.id,'r1','rhombus',2,tile.id,'s4','square');
        //
        // set outer neighborhood
        // via a case disjunction on the neighbors
        //
        // neighbor 0
        if(tile.neighbors[0] == undefined){
          setNeighborUndefined(newtilesdict,tile.id,'r0','rhombus',0);
          setNeighborUndefined(newtilesdict,tile.id,'s0','square',2);
          setNeighborUndefined(newtilesdict,tile.id,'s0','square',3);
        }
        else{
          switch(tile.neighbors[0][0]){
            case 'square':
              // depends on the orientation of the neighbor
              if(  tilesdict.get(id2key(tile.neighbors[0])).neighbors[2] != undefined
                && are_id_equal(tile.id,tilesdict.get(id2key(tile.neighbors[0])).neighbors[2])){
                // case 9
                setNeighbor(newtilesdict,tile.id,'r0','rhombus',0,tile.neighbors[0],'r2','rhombus');
                setNeighbor(newtilesdict,tile.id,'s0','square',2,tile.neighbors[0],'r2','rhombus');
                setNeighbor(newtilesdict,tile.id,'s0','square',3,tile.neighbors[0],'s1','square');
              }
              else{
                // case 10
                setNeighbor(newtilesdict,tile.id,'r0','rhombus',0,tile.neighbors[0],'r3','rhombus');
                setNeighbor(newtilesdict,tile.id,'s0','square',2,tile.neighbors[0],'r3','rhombus');
                setNeighbor(newtilesdict,tile.id,'s0','square',3,tile.neighbors[0],'r2','rhombus');
              }
              break;
            case 'rhombus':
              // depends on the orientation of the neighbor
              if(  tilesdict.get(id2key(tile.neighbors[0])).neighbors[1] != undefined
                && are_id_equal(tile.id,tilesdict.get(id2key(tile.neighbors[0])).neighbors[1])){
                // case 1
                setNeighbor(newtilesdict,tile.id,'r0','rhombus',0,tile.neighbors[0],'r1','rhombus');
                setNeighbor(newtilesdict,tile.id,'s0','square',2,tile.neighbors[0],'r1','rhombus');
                setNeighbor(newtilesdict,tile.id,'s0','square',3,tile.neighbors[0],'r2','rhombus');
              }
              else{
                // case 2
                setNeighbor(newtilesdict,tile.id,'r0','rhombus',0,tile.neighbors[0],'r0','rhombus');
                setNeighbor(newtilesdict,tile.id,'s0','square',2,tile.neighbors[0],'r0','rhombus');
                setNeighbor(newtilesdict,tile.id,'s0','square',3,tile.neighbors[0],'r2','rhombus');
              }
          }
        }
        // neighbor 1
        if(tile.neighbors[1] == undefined){
          setNeighborUndefined(newtilesdict,tile.id,'r1','rhombus',0);
          setNeighborUndefined(newtilesdict,tile.id,'s1','square',2);
          setNeighborUndefined(newtilesdict,tile.id,'s1','square',3);
        }
        else{
          switch(tile.neighbors[1][0]){
            case 'square':
              // depends on the orientation of the neighbor
              if(  tilesdict.get(id2key(tile.neighbors[1])).neighbors[2] != undefined
                && are_id_equal(tile.id,tilesdict.get(id2key(tile.neighbors[1])).neighbors[2])){
                // case 11
                setNeighbor(newtilesdict,tile.id,'r1','rhombus',0,tile.neighbors[1],'r2','rhombus');
                setNeighbor(newtilesdict,tile.id,'s1','square',2,tile.neighbors[1],'r2','rhombus');
                setNeighbor(newtilesdict,tile.id,'s1','square',3,tile.neighbors[1],'s1','square');
              }
              else{
                // case 12
                setNeighbor(newtilesdict,tile.id,'r1','rhombus',0,tile.neighbors[1],'r3','rhombus');
                setNeighbor(newtilesdict,tile.id,'s1','square',2,tile.neighbors[1],'r3','rhombus');
                setNeighbor(newtilesdict,tile.id,'s1','square',3,tile.neighbors[1],'r2','rhombus');
              }
              break;
            case 'rhombus':
              // depends on the orientation of the neighbor
              if(  tilesdict.get(id2key(tile.neighbors[1])).neighbors[1] != undefined
                && are_id_equal(tile.id,tilesdict.get(id2key(tile.neighbors[1])).neighbors[1])){
                // case 3
                setNeighbor(newtilesdict,tile.id,'r1','rhombus',0,tile.neighbors[1],'r1','rhombus');
                setNeighbor(newtilesdict,tile.id,'s1','square',2,tile.neighbors[1],'r1','rhombus');
                setNeighbor(newtilesdict,tile.id,'s1','square',3,tile.neighbors[1],'r2','rhombus');
              }
              else{
                // case 4
                setNeighbor(newtilesdict,tile.id,'r1','rhombus',0,tile.neighbors[1],'r0','rhombus');
                setNeighbor(newtilesdict,tile.id,'s1','square',2,tile.neighbors[1],'r0','rhombus');
                setNeighbor(newtilesdict,tile.id,'s1','square',3,tile.neighbors[1],'r2','rhombus');
              }
          }
        }
        // neighbor 2
        if(tile.neighbors[2] == undefined){
          setNeighborUndefined(newtilesdict,tile.id,'r2','rhombus',3);
          setNeighborUndefined(newtilesdict,tile.id,'s2','square',1);
          setNeighborUndefined(newtilesdict,tile.id,'s2','square',0);
        }
        else{
          switch(tile.neighbors[2][0]){
            case 'square':
              // depends on the orientation of the neighbor
              if(  tilesdict.get(id2key(tile.neighbors[2])).neighbors[0] != undefined
                && are_id_equal(tile.id,tilesdict.get(id2key(tile.neighbors[2])).neighbors[0])){
                // case 9
                setNeighbor(newtilesdict,tile.id,'r2','rhombus',3,tile.neighbors[2],'r0','rhombus');
              }
              else{
                // case 11
                setNeighbor(newtilesdict,tile.id,'r2','rhombus',3,tile.neighbors[2],'r1','rhombus');
              }
              break;
            case 'rhombus':
              // depends on the orientation of the neighbor
              if(  tilesdict.get(id2key(tile.neighbors[2])).neighbors[0] != undefined
                && are_id_equal(tile.id,tilesdict.get(id2key(tile.neighbors[2])).neighbors[0])){
                // case 5
                setNeighbor(newtilesdict,tile.id,'r2','rhombus',3,tile.neighbors[2],'r0','rhombus');
                setNeighbor(newtilesdict,tile.id,'s2','square',1,tile.neighbors[2],'r0','rhombus');
                setNeighbor(newtilesdict,tile.id,'s2','square',0,tile.neighbors[2],'r2','rhombus');
              }
              else{
                // case 6
                setNeighbor(newtilesdict,tile.id,'r2','rhombus',3,tile.neighbors[2],'r1','rhombus');
                setNeighbor(newtilesdict,tile.id,'s2','square',1,tile.neighbors[2],'r1','rhombus');
                setNeighbor(newtilesdict,tile.id,'s2','square',0,tile.neighbors[2],'r2','rhombus');
              }
          }
        }
        // neighbor 3
        if(tile.neighbors[3] == undefined){
          setNeighborUndefined(newtilesdict,tile.id,'r3','rhombus',3);
          setNeighborUndefined(newtilesdict,tile.id,'s3','square',1);
          setNeighborUndefined(newtilesdict,tile.id,'s3','square',0);
        }
        else{
          switch(tile.neighbors[3][0]){
            case 'square':
              // depends on the orientation of the neighbor
              if(  tilesdict.get(id2key(tile.neighbors[3])).neighbors[0] != undefined
                && are_id_equal(tile.id,tilesdict.get(id2key(tile.neighbors[3])).neighbors[0])){
                // case 10
                setNeighbor(newtilesdict,tile.id,'r3','rhombus',3,tile.neighbors[3],'r0','rhombus');
              }
              else{
                // case 12
                setNeighbor(newtilesdict,tile.id,'r3','rhombus',3,tile.neighbors[3],'r1','rhombus');
              }
              break;
            case 'rhombus':
              // depends on the orientation of the neighbor
              if(  tilesdict.get(id2key(tile.neighbors[3])).neighbors[0] != undefined
                && are_id_equal(tile.id,tilesdict.get(id2key(tile.neighbors[3])).neighbors[0])){
                // case 7
                setNeighbor(newtilesdict,tile.id,'r3','rhombus',3,tile.neighbors[3],'r0','rhombus');
                setNeighbor(newtilesdict,tile.id,'s3','square',1,tile.neighbors[3],'r0','rhombus');
                setNeighbor(newtilesdict,tile.id,'s3','square',0,tile.neighbors[3],'r2','rhombus');
              }
              else{
                // case 8
                setNeighbor(newtilesdict,tile.id,'r3','rhombus',3,tile.neighbors[3],'r1','rhombus');
                setNeighbor(newtilesdict,tile.id,'s3','square',1,tile.neighbors[3],'r1','rhombus');
                setNeighbor(newtilesdict,tile.id,'s3','square',0,tile.neighbors[3],'r2','rhombus');
              }
          }
        }
        //
        // done
        //
        break;

      case 'rhombus':
        //
        // --------------------------------
        // set rhombus' children neighbors
        // --------------------------------
        //
        // set inner neighborhood (even for duplicated, don't mind)
        //
        setNeighbor(newtilesdict,tile.id,'r0','rhombus',1,tile.id,'s0','square');
        setNeighbor(newtilesdict,tile.id,'s0','square',1,tile.id,'r0','rhombus');
        setNeighbor(newtilesdict,tile.id,'s0','square',0,tile.id,'r2','rhombus');
        setNeighbor(newtilesdict,tile.id,'r2','rhombus',3,tile.id,'s0','square');
        setNeighbor(newtilesdict,tile.id,'r2','rhombus',0,tile.id,'s1','square');
        setNeighbor(newtilesdict,tile.id,'s1','square',3,tile.id,'r2','rhombus');
        setNeighbor(newtilesdict,tile.id,'s1','square',2,tile.id,'r1','rhombus');
        setNeighbor(newtilesdict,tile.id,'r1','rhombus',0,tile.id,'s1','square');
        setNeighbor(newtilesdict,tile.id,'r1','rhombus',3,tile.id,'s2','square');
        setNeighbor(newtilesdict,tile.id,'s2','square',1,tile.id,'r1','rhombus');
        setNeighbor(newtilesdict,tile.id,'s2','square',0,tile.id,'r2','rhombus');
        setNeighbor(newtilesdict,tile.id,'r2','rhombus',1,tile.id,'s2','square');
        setNeighbor(newtilesdict,tile.id,'r2','rhombus',2,tile.id,'s3','square');
        setNeighbor(newtilesdict,tile.id,'s3','square',3,tile.id,'r2','rhombus');
        setNeighbor(newtilesdict,tile.id,'s3','square',2,tile.id,'r0','rhombus');
        setNeighbor(newtilesdict,tile.id,'r0','rhombus',2,tile.id,'s3','square');
        //
        // set outer neighborhood
        // via a case disjunction on the neighbors
        //
        // neighbor 0
        if(tile.neighbors[0] == undefined){
          setNeighborUndefined(newtilesdict,tile.id,'r0','rhombus',0);
          setNeighborUndefined(newtilesdict,tile.id,'s0','square',2);
          setNeighborUndefined(newtilesdict,tile.id,'s0','square',3);
        }
        else{
          switch(tile.neighbors[0][0]){
            case 'square':
              // depends on the orientation of the neighbor
              if(  tilesdict.get(id2key(tile.neighbors[0])).neighbors[2] != undefined
                && are_id_equal(tile.id,tilesdict.get(id2key(tile.neighbors[0])).neighbors[2])){
                // case 5
                setNeighbor(newtilesdict,tile.id,'r0','rhombus',0,tile.neighbors[0],'r2','rhombus');
              }
              else{
                // case 7
                setNeighbor(newtilesdict,tile.id,'r0','rhombus',0,tile.neighbors[0],'r3','rhombus');
              }
              break;
            case 'rhombus':
              // depends on the orientation of the neighbor
              if(  tilesdict.get(id2key(tile.neighbors[0])).neighbors[1] != undefined
                && are_id_equal(tile.id,tilesdict.get(id2key(tile.neighbors[0])).neighbors[1])){
                // case 13
                setNeighbor(newtilesdict,tile.id,'r0','rhombus',0,tile.neighbors[0],'r1','rhombus');
                setNeighbor(newtilesdict,tile.id,'s0','square',2,tile.neighbors[0],'r1','rhombus');
                setNeighbor(newtilesdict,tile.id,'s0','square',3,tile.neighbors[0],'r2','rhombus');
              }
              else{
                // case 14
                setNeighbor(newtilesdict,tile.id,'r0','rhombus',0,tile.neighbors[0],'r0','rhombus');
                setNeighbor(newtilesdict,tile.id,'s0','square',2,tile.neighbors[0],'r0','rhombus');
                setNeighbor(newtilesdict,tile.id,'s0','square',3,tile.neighbors[0],'r2','rhombus');
              }
          }
        }
        // neighbor 1
        if(tile.neighbors[1] == undefined){
          setNeighborUndefined(newtilesdict,tile.id,'r1','rhombus',1);
          setNeighborUndefined(newtilesdict,tile.id,'s1','square',1);
          setNeighborUndefined(newtilesdict,tile.id,'s1','square',0);
        }
        else{
          switch(tile.neighbors[1][0]){
            case 'square':
              // depends on the orientation of the neighbor
              if(  tilesdict.get(id2key(tile.neighbors[1])).neighbors[0] != undefined
                && are_id_equal(tile.id,tilesdict.get(id2key(tile.neighbors[1])).neighbors[0])){
                // case 1
                setNeighbor(newtilesdict,tile.id,'r1','rhombus',1,tile.neighbors[1],'r0','rhombus');
              }
              else{
                // case 3
                setNeighbor(newtilesdict,tile.id,'r1','rhombus',1,tile.neighbors[1],'r1','rhombus');
              }
              break;
            case 'rhombus':
              // depends on the orientation of the neighbor
              if(  tilesdict.get(id2key(tile.neighbors[1])).neighbors[0] != undefined
                && are_id_equal(tile.id,tilesdict.get(id2key(tile.neighbors[1])).neighbors[0])){
                // case 13
                setNeighbor(newtilesdict,tile.id,'r1','rhombus',1,tile.neighbors[1],'r0','rhombus');
              }
              else{
                // case 15
                setNeighbor(newtilesdict,tile.id,'r1','rhombus',1,tile.neighbors[1],'r1','rhombus');
                setNeighbor(newtilesdict,tile.id,'s1','square',1,tile.neighbors[1],'r1','rhombus');
                setNeighbor(newtilesdict,tile.id,'s1','square',0,tile.neighbors[1],'r2','rhombus');
              }
          }
        }
        // neighbor 2
        if(tile.neighbors[2] == undefined){
          setNeighborUndefined(newtilesdict,tile.id,'r1','rhombus',2);
          setNeighborUndefined(newtilesdict,tile.id,'s2','square',2);
          setNeighborUndefined(newtilesdict,tile.id,'s2','square',3);
        }
        else{
          switch(tile.neighbors[2][0]){
            case 'square':
              // depends on the orientation of the neighbor
              if(  tilesdict.get(id2key(tile.neighbors[2])).neighbors[2] != undefined
                && are_id_equal(tile.id,tilesdict.get(id2key(tile.neighbors[2])).neighbors[2])){
                // case 6
                setNeighbor(newtilesdict,tile.id,'r1','rhombus',2,tile.neighbors[2],'r2','rhombus');
              }
              else{
                // case 8
                setNeighbor(newtilesdict,tile.id,'r1','rhombus',2,tile.neighbors[2],'r3','rhombus');
              }
              break;
            case 'rhombus':
              // depends on the orientation of the neighbor
              if(  tilesdict.get(id2key(tile.neighbors[2])).neighbors[1] != undefined
                && are_id_equal(tile.id,tilesdict.get(id2key(tile.neighbors[2])).neighbors[1])){
                // case 15
                setNeighbor(newtilesdict,tile.id,'r1','rhombus',2,tile.neighbors[2],'r1','rhombus');
              }
              else{
                // case 16
                setNeighbor(newtilesdict,tile.id,'r1','rhombus',2,tile.neighbors[2],'r0','rhombus');
                setNeighbor(newtilesdict,tile.id,'s2','square',2,tile.neighbors[2],'r0','rhombus');
                setNeighbor(newtilesdict,tile.id,'s2','square',3,tile.neighbors[2],'r2','rhombus');
              }
          }
        }
        // neighbor 3
        if(tile.neighbors[3] == undefined){
          setNeighborUndefined(newtilesdict,tile.id,'r0','rhombus',3);
          setNeighborUndefined(newtilesdict,tile.id,'s3','square',1);
          setNeighborUndefined(newtilesdict,tile.id,'s3','square',0);
        }
        else{
          switch(tile.neighbors[3][0]){
            case 'square':
              // depends on the orientation of the neighbor
              if(  tilesdict.get(id2key(tile.neighbors[3])).neighbors[0] != undefined
                && are_id_equal(tile.id,tilesdict.get(id2key(tile.neighbors[3])).neighbors[0])){
                // case 2
                setNeighbor(newtilesdict,tile.id,'r0','rhombus',3,tile.neighbors[3],'r0','rhombus');
              }
              else{
                // case 4
                setNeighbor(newtilesdict,tile.id,'r0','rhombus',3,tile.neighbors[3],'r1','rhombus');
              }
              break;
            case 'rhombus':
              // depends on the orientation of the neighbor
              if(  tilesdict.get(id2key(tile.neighbors[3])).neighbors[0] != undefined
                && are_id_equal(tile.id,tilesdict.get(id2key(tile.neighbors[3])).neighbors[0])){
                // case 14
                setNeighbor(newtilesdict,tile.id,'r0','rhombus',3,tile.neighbors[3],'r0','rhombus');
              }
              else{
                // case 16
                setNeighbor(newtilesdict,tile.id,'r0','rhombus',3,tile.neighbors[3],'r1','rhombus');
              }
          }
        }
        //
        // done
        //
        break;

      default:
        // all tiles should be square or rhombus
        console.log("caution: undefined tile type for neighborsA5, id="+tile.id);
    }
  }

  // neighbors modified by side effect in tilesdict, nothing to return
  return;
}

//
// [6] use default neighbors2bounds
//
var neighbors2boundsA5 = new Map();
neighbors2boundsA5.set('square',default_neighbors2bounds(4));
neighbors2boundsA5.set('rhombus',default_neighbors2bounds(4));

//
// [7] construct base tilings and call substitute
//

// prepare decoration
decorateA5 = new Map();
decorateA5.set('square',0);
decorateA5.set('rhombus',1);

//
// [7.1] construct "Ammann-Beenker by subst" tiling by substitution
// 
Tiling.A5bysubst = function({iterations}={}){
  var tiles = [];
  // push base tiling (a kind of rhombus flower?)
  for(var i=0; i<8; i++){
    // construct tiles
    var myrhombus = rhombus.myclone();
    myrhombus.id.push(i);
    myrhombus.rotate(0,0,i*Math.PI/4);
    // define neighbors with undefined on the boundary
    myrhombus.neighbors.push(['rhombus',(i-1+8)%8]); // 0
    myrhombus.neighbors.push(undefined); // 1
    myrhombus.neighbors.push(undefined); // 2
    myrhombus.neighbors.push(['rhombus',(i+1)%8]); // 3
    tiles.push(myrhombus);
  }
  // call the substitution
  tiles = substitute(
    iterations,
    tiles,
    1+sqrt2,
    substitutionA5,
    duplicatedA5,
    duplicatedA5oriented,
    neighborsA5,
    neighbors2boundsA5,
    decorateA5
  );
  // construct tiling
  return new Tiling(tiles);
}

