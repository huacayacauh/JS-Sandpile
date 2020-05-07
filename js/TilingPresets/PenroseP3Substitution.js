// This code is part of JS-Sandpile (https://github.com/huacayacauh/JS-Sandpile/)
// CC-BY Valentin Darrigo, Jeremy Fersula, Kevin Perrot

// Penrose P3 (rhomb)
// substitution described at
// http://tilings.math.uni-bielefeld.de/substitution/penrose-rhomb/

//
// [0] toolbox
//

// golden ratio
var phi = (1+Math.sqrt(5))/2;

//
// [1] define tile types P3
//

// fat
var bounds = [];
bounds.push(0,0);
bounds.push(Math.sin(Math.PI/5),Math.cos(Math.PI/5));
// remark that... 2*cos(pi/5) = phi
bounds.push(0,2*Math.cos(Math.PI/5));
bounds.push(-Math.sin(Math.PI/5),Math.cos(Math.PI/5));
var fat = new Tile(['fat'],[],bounds,4);

// thin
var bounds = [];
bounds.push(0,0);
bounds.push(Math.sin(2*Math.PI/5),Math.cos(2*Math.PI/5));
// remark that... 2*cos(2*pi/5) = phi-1
bounds.push(0,2*Math.cos(2*Math.PI/5));
bounds.push(-Math.sin(2*Math.PI/5),Math.cos(2*Math.PI/5));
var thin = new Tile(['thin'],[],bounds,4);

// convert a fat to a thin
Tile.prototype.fat2thin = function(){
  this.id[0]='thin';
  var b23 = rotatePoint(this.bounds[2],this.bounds[3],this.bounds[0],this.bounds[1],-Math.PI/5);
  this.bounds[2] = b23[0];
  this.bounds[3] = b23[1];
  var b45 = scalePoint(this.bounds[4],this.bounds[5],this.bounds[0],this.bounds[1],Math.cos(2*Math.PI/5)/Math.cos(Math.PI/5));
  this.bounds[4] = b45[0];
  this.bounds[5] = b45[1];
  var b67 = rotatePoint(this.bounds[6],this.bounds[7],this.bounds[0],this.bounds[1],Math.PI/5);
  this.bounds[6] = b67[0];
  this.bounds[7] = b67[1];
}

// convert a thin to a fat
Tile.prototype.thin2fat = function(){
  this.id[0]='fat';
  var b23 = rotatePoint(this.bounds[2],this.bounds[3],this.bounds[0],this.bounds[1],Math.PI/5);
  this.bounds[2] = b23[0];
  this.bounds[3] = b23[1];
  var b45 = scalePoint(this.bounds[4],this.bounds[5],this.bounds[0],this.bounds[1],Math.cos(Math.PI/5)/Math.cos(2*Math.PI/5));
  this.bounds[4] = b45[0];
  this.bounds[5] = b45[1];
  var b67 = rotatePoint(this.bounds[6],this.bounds[7],this.bounds[0],this.bounds[1],-Math.PI/5);
  this.bounds[6] = b67[0];
  this.bounds[7] = b67[1];
}

//
// [2] define substitution P3
//
function substitutionP3(tile){
  switch(tile.id[0]){
    case 'fat':
      //
      // -------------------------------
      // fat substitution -> 3 fats, 2 thins
      // -------------------------------
      //
      var newtiles = [];

      // new fat 1
      var newfat1 = tile.myclone();
      newfat1.id.push('fat1');
      newfat1.rotate(tile.bounds[0],tile.bounds[1],Math.PI);
      newfat1.scale(tile.bounds[0],tile.bounds[1],1/phi);
      newfat1.shift(tile.bounds[4]-tile.bounds[0],tile.bounds[5]-tile.bounds[1]);
      newtiles.push(newfat1);

      // new fat 2
      var newfat2 = tile.myclone();
      newfat2.id.push('fat2');
      newfat2.rotate(tile.bounds[0],tile.bounds[1],4*Math.PI/5);
      newfat2.scale(tile.bounds[0],tile.bounds[1],1/phi);
      newfat2.shift(tile.bounds[2]-tile.bounds[0],tile.bounds[3]-tile.bounds[1]);
      newtiles.push(newfat2);

      // new fat 3
      var newfat3 = tile.myclone();
      newfat3.id.push('fat3');
      newfat3.rotate(tile.bounds[0],tile.bounds[1],-4*Math.PI/5);
      newfat3.scale(tile.bounds[0],tile.bounds[1],1/phi);
      newfat3.shift(tile.bounds[6]-tile.bounds[0],tile.bounds[7]-tile.bounds[1]);
      newtiles.push(newfat3);

      // new thin 1
      var newthin1 = tile.myclone();
      newthin1.fat2thin();
      newthin1.id.push('thin1');
      newthin1.rotate(tile.bounds[0],tile.bounds[1],Math.PI/5);
      newthin1.scale(tile.bounds[0],tile.bounds[1],1/phi);
      newthin1.shift(tile.bounds[2]-tile.bounds[0],tile.bounds[3]-tile.bounds[1]);
      newtiles.push(newthin1);

      // new thin 2
      var newthin2 = tile.myclone();
      newthin2.fat2thin();
      newthin2.id.push('thin2');
      newthin2.rotate(tile.bounds[0],tile.bounds[1],-Math.PI/5);
      newthin2.scale(tile.bounds[0],tile.bounds[1],1/phi);
      newthin2.shift(tile.bounds[6]-tile.bounds[0],tile.bounds[7]-tile.bounds[1]);
      newtiles.push(newthin2);

      // done
      return newtiles;
      break;

    case 'thin':
      //
      // -------------------------------
      // thin substitution -> 2 fats, 2 thins
      // -------------------------------
      //
      var newtiles = [];

      // check that neighbors 1 and 2 of a thin is not a thin
      // otherwise there is a not nice overlap of new thins
      if(  tile.neighbors[1] != undefined
        && tile.neighbors[1][0] == 'thin'){
        console.log("error: neighbor 1 of thin tile "+tile.id+" is thin tile "+tile.neighbors[1]);
      }
      if(  tile.neighbors[2] != undefined
        && tile.neighbors[2][0] == 'thin'){
        console.log("error: neighbor 2 of thin tile "+tile.id+" is thin tile "+tile.neighbors[2]);
      }

      // new fat 1
      var newfat1 = tile.myclone();
      newfat1.thin2fat();
      newfat1.id.push('fat1');
      newfat1.rotate(tile.bounds[0],tile.bounds[1],3*Math.PI/5);
      newfat1.scale(tile.bounds[0],tile.bounds[1],1/phi);
      newfat1.shift(tile.bounds[2]-tile.bounds[0],tile.bounds[3]-tile.bounds[1]);
      newtiles.push(newfat1);

      // new fat 2
      var newfat2 = tile.myclone();
      newfat2.thin2fat();
      newfat2.id.push('fat2');
      newfat2.rotate(tile.bounds[0],tile.bounds[1],-3*Math.PI/5);
      newfat2.scale(tile.bounds[0],tile.bounds[1],1/phi);
      newfat2.shift(tile.bounds[6]-tile.bounds[0],tile.bounds[7]-tile.bounds[1]);
      newtiles.push(newfat2);

      // new thin 1
      var newthin1 = tile.myclone();
      newthin1.id.push('thin1');
      newthin1.rotate(tile.bounds[0],tile.bounds[1],-3*Math.PI/5);
      newthin1.scale(tile.bounds[0],tile.bounds[1],1/phi);
      newthin1.shift(tile.bounds[4]-tile.bounds[0],tile.bounds[5]-tile.bounds[1]);
      newtiles.push(newthin1);

      // new thin 2
      var newthin2 = tile.myclone();
      newthin2.id.push('thin2');
      newthin2.rotate(tile.bounds[0],tile.bounds[1],3*Math.PI/5);
      newthin2.scale(tile.bounds[0],tile.bounds[1],1/phi);
      newthin2.shift(tile.bounds[4]-tile.bounds[0],tile.bounds[5]-tile.bounds[1]);
      newtiles.push(newthin2);

      // done
      return newtiles;
      break;

    default:
      // all tiles should be fat or thin
      console.log("caution: undefined tile type for substitutionP3, id="+tile.id);
  }
}

//
// [3] defined duplicated tile informations P3
//

var duplicatedP3 = [];
duplicatedP3.push(new DupInfo('fat','fat','fat3',3,'fat','fat2'));
duplicatedP3.push(new DupInfo('fat','thin','thin2',2,'fat','thin1'));
duplicatedP3.push(new DupInfo('thin','fat','fat2',3,'fat','fat2'));
duplicatedP3.push(new DupInfo('thin','fat','fat1',0,'fat','fat3'));
duplicatedP3.push(new DupInfo('thin','thin','thin1',1,'fat','thin1'));
duplicatedP3.push(new DupInfo('thin','thin','thin2',2,'fat','thin2'));
duplicatedP3.push(new DupInfo('thin','fat','fat2',3,'thin','fat1'));

var duplicatedP3oriented = [];

//
// [4] fill neighbors informations in P3 newtiles (by side effect)
//
function neighborsP3(tiles,tilesdict,newtiles,newtilesdict,newdup){
  // iterate tiles and fill neighbors of newtiles
  for(let tile of tiles) {
    switch(tile.id[0]){

      case 'fat':
        //
        // --------------------------------
        // set fat's children neighbors
        // --------------------------------
        //
        // new fat 1
        //
        // neighbor 0
        if(tile.neighbors[2] != undefined){
          switch(tile.neighbors[2][0]){
            case 'fat':
              setNeighbor(newtilesdict,tile.id,'fat1','fat',0,tile.neighbors[2],'fat1','fat');
              break;
            case 'thin':
              setNeighbor(newtilesdict,tile.id,'fat1','fat',0,tile.neighbors[2],'fat2','fat');
          }
        }
        else{
          setNeighborUndefined(newtilesdict,tile.id,'fat1','fat',0);
        }
        // neighbor 1
        setNeighbor(newtilesdict,tile.id,'fat1','fat',1,tile.id,'thin2','thin');
        // neighbor 2
        setNeighbor(newtilesdict,tile.id,'fat1','fat',2,tile.id,'thin1','thin');
        // neighbor 3
        if(tile.neighbors[1] != undefined){
          switch(tile.neighbors[1][0]){
            case 'fat':
              setNeighbor(newtilesdict,tile.id,'fat1','fat',3,tile.neighbors[1],'fat1','fat');
              break;
            case 'thin':
              setNeighbor(newtilesdict,tile.id,'fat1','fat',3,tile.neighbors[1],'fat1','fat');
          }
        }
        else{
          setNeighborUndefined(newtilesdict,tile.id,'fat1','fat',3);
        }
        //
        // new fat 2
        //
        // neighbor 0
        setNeighbor(newtilesdict,tile.id,'fat2','fat',0,tile.id,'thin1','thin');
        // neighbor 1
        setNeighbor(newtilesdict,tile.id,'fat2','fat',1,tile.id,'fat3','fat');
        // neighbor 2
        if(tile.neighbors[0] != undefined){
          switch(tile.neighbors[0][0]){
            case 'fat':
              setNeighbor(newtilesdict,tile.id,'fat2','fat',2,tile.neighbors[0],'fat2','fat');
              break;
            case 'thin':
              setNeighbor(newtilesdict,tile.id,'fat2','fat',2,tile.neighbors[0],'thin2','thin');
          }
        }
        else{
          setNeighborUndefined(newtilesdict,tile.id,'fat2','fat',2);
        }
        // neighbor 3
        if(tile.neighbors[0] != undefined){
          switch(tile.neighbors[0][0]){
            case 'fat':
              setNeighbor(newtilesdict,tile.id,'fat2','fat',3,tile.neighbors[0],'thin2','thin');
              break;
            case 'thin':
              if(tilesdict.get(id2key(tile.neighbors[0])).neighbors[2] != undefined){
                switch(tilesdict.get(id2key(tile.neighbors[0])).neighbors[2][0]){
                  case 'fat':
                    setNeighbor(newtilesdict,tile.id,'fat2','fat',3,tilesdict.get(id2key(tile.neighbors[0])).neighbors[2],'fat1','fat');
                    break;
                  case 'thin':
                    setNeighbor(newtilesdict,tile.id,'fat2','fat',3,tilesdict.get(id2key(tile.neighbors[0])).neighbors[2],'fat1','fat');
                }
              }
              else{
                setNeighborUndefined(newtilesdict,tile.id,'fat2','fat',3);
              }
          }
        }
        // (from non-adjacent side)
        else if(tile.neighbors[1] != undefined
             && tile.neighbors[1][0] == 'thin'){
          setNeighbor(newtilesdict,tile.id,'fat2','fat',3,tile.neighbors[1],'thin2','thin');
        }
        else{
          setNeighborUndefined(newtilesdict,tile.id,'fat2','fat',3);
        }
        //
        // new fat 3
        //
        // maybe dup
        if(!isDup(newdup,tile.id,'fat3','fat')){
          // neighbor 0
          if(tile.neighbors[3] != undefined){
            switch(tile.neighbors[3][0]){
              case 'fat':
                setNeighbor(newtilesdict,tile.id,'fat3','fat',0,tile.neighbors[0],'fat3','fat');
                break;
              case 'thin':
                if(tilesdict.get(id2key(tile.neighbors[3])).neighbors[1] != undefined){
                  switch(tilesdict.get(id2key(tile.neighbors[3])).neighbors[1][0]){
                    case 'fat':
                      setNeighbor(newtilesdict,tile.id,'fat3','fat',0,tilesdict.get(id2key(tile.neighbors[3])).neighbors[1],'fat1','fat');
                      break;
                    case 'thin':
                      setNeighbor(newtilesdict,tile.id,'fat3','fat',0,tilesdict.get(id2key(tile.neighbors[3])).neighbors[1],'fat2','fat');
                  }
                }
                else{
                  setNeighborUndefined(newtilesdict,tile.id,'fat3','fat',0);
                }
            }
          }
          // (from non-adjacent side)
          else if(tile.neighbors[2] != undefined
               && tile.neighbors[2][0] == 'thin'){
            setNeighbor(newtilesdict,tile.id,'fat3','fat',0,tile.neighbors[2],'thin1','thin');
          }
          else{
            setNeighborUndefined(newtilesdict,tile.id,'fat3','fat',0);
          }
          // neighbor 1
          if(tile.neighbors[3] != undefined){
            switch(tile.neighbors[3][0]){
              case 'fat':
                setNeighbor(newtilesdict,tile.id,'fat3','fat',1,tile.neighbors[3],'thin1','thin');
                break;
              case 'thin':
                setNeighbor(newtilesdict,tile.id,'fat3','fat',1,tile.neighbors[3],'thin1','thin');
            }
          }
          else{
            setNeighborUndefined(newtilesdict,tile.id,'fat3','fat',1);
          }
          // neighbor 2
          setNeighbor(newtilesdict,tile.id,'fat3','fat',2,tile.id,'fat2','fat');
          // neighbor 3
          setNeighbor(newtilesdict,tile.id,'fat3','fat',3,tile.id,'thin2','thin');
        }
        //
        // new thin 1
        //
        // neighbor 0
        if(tile.neighbors[1] != undefined){
          switch(tile.neighbors[1][0]){
            case 'fat':
              setNeighbor(newtilesdict,tile.id,'thin1','thin',0,tile.neighbors[1],'fat3','fat');
              break;
            case 'thin':
              setNeighbor(newtilesdict,tile.id,'thin1','thin',0,tile.neighbors[1],'thin2','thin');
          }
        }
        // (from non-adjacent side)
        else if(tile.neighbors[0] != undefined
             && tile.neighbors[0][0] == 'fat'){
          setNeighbor(newtilesdict,tile.id,'thin1','thin',0,tile.neighbors[0],'thin2','thin');
        }
        else{
          setNeighborUndefined(newtilesdict,tile.id,'thin1','thin',0);
        }
        // neighbor 1
        if(tile.neighbors[1] != undefined){
          switch(tile.neighbors[1][0]){
            case 'fat':
              setNeighbor(newtilesdict,tile.id,'thin1','thin',1,tile.neighbors[1],'fat1','fat');
              break;
            case 'thin':
              setNeighbor(newtilesdict,tile.id,'thin1','thin',1,tile.neighbors[1],'fat1','fat');
          }
        }
        else{
          setNeighborUndefined(newtilesdict,tile.id,'thin1','thin',1);
        }
        // neighbor 2
        setNeighbor(newtilesdict,tile.id,'thin1','thin',2,tile.id,'fat1','fat');
        // neighbor 3
        setNeighbor(newtilesdict,tile.id,'thin1','thin',3,tile.id,'fat2','fat');
        //
        // new thin 2
        //
        // maybe dup
        if(!isDup(newdup,tile.id,'thin2','thin')){
          // neighbor 0
          setNeighbor(newtilesdict,tile.id,'thin2','thin',0,tile.id,'fat3','fat');
          // neighbor 1
          setNeighbor(newtilesdict,tile.id,'thin2','thin',1,tile.id,'fat1','fat');
          // neighbor 2
          if(tile.neighbors[2] != undefined){
            switch(tile.neighbors[2][0]){
              case 'fat':
                setNeighbor(newtilesdict,tile.id,'thin2','thin',2,tile.neighbors[2],'fat1','fat');
                break;
              case 'thin':
                setNeighbor(newtilesdict,tile.id,'thin2','thin',2,tile.neighbors[2],'fat2','fat');
            }
          }
          else{
            setNeighborUndefined(newtilesdict,tile.id,'thin2','thin',2);
          }
          // neighbor 3
          if(tile.neighbors[2] != undefined){
            switch(tile.neighbors[2][0]){
              case 'fat':
                setNeighbor(newtilesdict,tile.id,'thin2','thin',3,tile.neighbors[2],'fat2','fat');
                break;
              case 'thin':
                setNeighbor(newtilesdict,tile.id,'thin2','thin',3,tile.neighbors[2],'thin1','thin');
            }
          }
          // (from non-adjacent side)
          else if(tile.neighbors[3] != undefined
               && tile.neighbors[3][0] == 'fat'){
            setNeighbor(newtilesdict,tile.id,'thin2','thin',3,tile.neighbors[3],'thin1','thin');
          }
          else{
            setNeighborUndefined(newtilesdict,tile.id,'thin2','thin',3);
          }
        }
        //
        // done
        //
        break;

      case 'thin':
        //
        // --------------------------------
        // set thin's children neighbors
        // --------------------------------
        //
        // new fat 1
        //
        // maybe dup
        if(!isDup(newdup,tile.id,'fat1','fat')){
          // neighbor 0
          if(tile.neighbors[1] != undefined){
            switch(tile.neighbors[1][0]){
              case 'fat':
                setNeighbor(newtilesdict,tile.id,'fat1','fat',0,tile.neighbors[1],'fat1','fat');
                break;
              case 'thin':
                setNeighbor(newtilesdict,tile.id,'fat1','fat',0,tile.neighbors[1],'fat2','fat');
            }
          }
          else{
            setNeighborUndefined(newtilesdict,tile.id,'fat1','fat',0);
          }
          // neighbor 1
          setNeighbor(newtilesdict,tile.id,'fat1','fat',1,tile.id,'thin1','thin');
          // neighbor 2
          if(tile.neighbors[0] != undefined){
            switch(tile.neighbors[0][0]){
              case 'fat':
                setNeighbor(newtilesdict,tile.id,'fat1','fat',2,tile.neighbors[0],'fat2','fat');
                break;
              case 'thin':
                setNeighbor(newtilesdict,tile.id,'fat1','fat',2,tile.neighbors[0],'thin2','thin');
            }
          }
          // (from non-adjacent side)
          else if(tile.neighbors[3] != undefined
               && tile.neighbors[3][0] == 'thin'){
            setNeighbor(newtilesdict,tile.id,'fat1','fat',2,tile.neighbors[3],'fat2','fat');
          }
          else{
            setNeighborUndefined(newtilesdict,tile.id,'fat1','fat',2);
          }
          // neighbor 3
          if(tile.neighbors[0] != undefined){
            switch(tile.neighbors[0][0]){
              case 'fat':
                setNeighbor(newtilesdict,tile.id,'fat1','fat',3,tile.neighbors[0],'thin2','thin');
                break;
              case 'thin':
                if(tilesdict.get(id2key(tile.neighbors[0])).neighbors[2] != undefined){
                  switch(tilesdict.get(id2key(tile.neighbors[0])).neighbors[2][0]){
                    case 'fat':
                      setNeighbor(newtilesdict,tile.id,'fat1','fat',3,tilesdict.get(id2key(tile.neighbors[0])).neighbors[2],'fat1','fat');
                      break;
                    case 'thin':
                      setNeighbor(newtilesdict,tile.id,'fat1','fat',3,tilesdict.get(id2key(tile.neighbors[0])).neighbors[2],'fat1','fat');
                  }
                }
                else{
                  setNeighborUndefined(newtilesdict,tile.id,'fat1','fat',3);
                }
            }
          }
          else{
            setNeighborUndefined(newtilesdict,tile.id,'fat1','fat',3);
          }
        }
        //
        // new fat 2
        //
        // maybe dup
        if(!isDup(newdup,tile.id,'fat2','fat')){
          // neighbor 0
          if(tile.neighbors[3] != undefined){
            switch(tile.neighbors[3][0]){
              case 'fat':
                setNeighbor(newtilesdict,tile.id,'fat2','fat',0,tile.neighbors[3],'thin1','thin');
                break;
              case 'thin':
                if(tilesdict.get(id2key(tile.neighbors[3])).neighbors[1] != undefined){
                  switch(tilesdict.get(id2key(tile.neighbors[3])).neighbors[1][0]){
                    case 'fat':
                      setNeighbor(newtilesdict,tile.id,'fat2','fat',0,tilesdict.get(id2key(tile.neighbors[3])).neighbors[1],'fat1','fat');
                      break;
                    case 'thin':
                      setNeighbor(newtilesdict,tile.id,'fat2','fat',0,tilesdict.get(id2key(tile.neighbors[3])).neighbors[1],'fat2','fat');
                  }
                }
                else{
                  setNeighborUndefined(newtilesdict,tile.id,'fat2','fat',0);
                }
            }
          }
          else{
            setNeighborUndefined(newtilesdict,tile.id,'fat2','fat',0);
          }
          // neighbor 1
          if(tile.neighbors[3] != undefined){
            switch(tile.neighbors[3][0]){
              case 'fat':
                setNeighbor(newtilesdict,tile.id,'fat2','fat',1,tile.neighbors[3],'fat3','fat');
                break;
              case 'thin':
                setNeighbor(newtilesdict,tile.id,'fat2','fat',1,tile.neighbors[3],'thin1','thin');
            }
          }
          // (from non-adjacent side)
          else if(tile.neighbors[0] != undefined
               && tile.neighbors[0][0] == 'thin'){
            setNeighbor(newtilesdict,tile.id,'fat2','fat',1,tile.neighbors[0],'fat1','fat');
          }
          else{
            setNeighborUndefined(newtilesdict,tile.id,'fat2','fat',1);
          }
          // neighbor 2
          setNeighbor(newtilesdict,tile.id,'fat2','fat',2,tile.id,'thin2','thin');
          // neighbor 3
          if(tile.neighbors[2] != undefined){
            switch(tile.neighbors[2][0]){
              case 'fat':
                setNeighbor(newtilesdict,tile.id,'fat2','fat',3,tile.neighbors[2],'fat1','fat');
                break;
              case 'thin':
                setNeighbor(newtilesdict,tile.id,'fat2','fat',3,tile.neighbors[2],'fat1','fat');
            }
          }
          else{
            setNeighborUndefined(newtilesdict,tile.id,'fat2','fat',3);
          }
        }
        //
        // new thin 1
        //
        // maybe dup
        if(!isDup(newdup,tile.id,'thin1','thin')){
          // neighbor 0
          setNeighbor(newtilesdict,tile.id,'thin1','thin',0,tile.id,'thin2','thin');
          // neighbor 1
          setNeighbor(newtilesdict,tile.id,'thin1','thin',1,tile.id,'fat1','fat');
          // neighbor 2
          if(tile.neighbors[1] != undefined){
            switch(tile.neighbors[1][0]){
              case 'fat':
                setNeighbor(newtilesdict,tile.id,'thin1','thin',2,tile.neighbors[1],'fat1','fat');
                break;
              case 'thin':
                console.log("error (neighborsP3): neighbor 1 of thin tile "+tile.id+" is thin tile "+tile.neighbors[1]);
                setNeighbor(newtilesdict,tile.id,'thin1','thin',2,tile.neighbors[1],'fat2','fat');
            }
          }
          else{
            setNeighborUndefined(newtilesdict,tile.id,'thin1','thin',2);
          }
          // neighbor 3
          if(tile.neighbors[1] != undefined){
            switch(tile.neighbors[1][0]){
              case 'fat':
                setNeighbor(newtilesdict,tile.id,'thin1','thin',3,tile.neighbors[1],'fat2','fat');
                break;
              case 'thin':
                setNeighbor(newtilesdict,tile.id,'thin1','thin',3,tile.neighbors[1],'thin1','thin');
            }
          }
          // (from non-adjacent side)
          else if(tile.neighbors[2] != undefined
               && tile.neighbors[2][0] == 'fat'){
            setNeighbor(newtilesdict,tile.id,'thin1','thin',3,tile.neighbors[2],'fat3','fat');
          }
          else{
            setNeighborUndefined(newtilesdict,tile.id,'thin1','thin',3);
          }
        }
        //
        // new thin 2
        //
        // maybe dup
        if(!isDup(newdup,tile.id,'thin2','thin')){
          // neighbor 0
          if(tile.neighbors[2] != undefined){
            switch(tile.neighbors[2][0]){
              case 'fat':
                setNeighbor(newtilesdict,tile.id,'thin2','thin',0,tile.neighbors[2],'fat3','fat');
                break;
              case 'thin':
                setNeighbor(newtilesdict,tile.id,'thin2','thin',0,tile.neighbors[2],'thin2','thin');
            }
          }
          // (from non-adjacent side)
          else if(tile.neighbors[1] != undefined
               && tile.neighbors[1][0] == 'fat'){
            setNeighbor(newtilesdict,tile.id,'thin2','thin',0,tile.neighbors[1],'fat2','fat');
          }
          else{
            setNeighborUndefined(newtilesdict,tile.id,'thin2','thin',0);
          }
          // neighbor 1
          if(tile.neighbors[2] != undefined){
            switch(tile.neighbors[2][0]){
              case 'fat':
                setNeighbor(newtilesdict,tile.id,'thin2','thin',1,tile.neighbors[2],'fat1','fat');
                break;
              case 'thin':
                console.log("error (neighborsP3): neighbor 2 of thin tile "+tile.id+" is thin tile "+tile.neighbors[2]);
                setNeighbor(newtilesdict,tile.id,'thin2','thin',1,tile.neighbors[2],'fat1','fat');
            }
          }
          else{
            setNeighborUndefined(newtilesdict,tile.id,'thin2','thin',1);
          }
          // neighbor 2
          setNeighbor(newtilesdict,tile.id,'thin2','thin',2,tile.id,'fat2','fat');
          // neighbor 3
          setNeighbor(newtilesdict,tile.id,'thin2','thin',3,tile.id,'thin1','thin');
        }
        //
        // done
        //
        break;

      default:
        // all tiles should be fat or thin
        console.log("caution: undefined tile type for neighborsP3, id="+tile.id);
    }
  }

  // neighbors modified by side effect in tilesdict, nothing to return
  return;
}

//
// [6] use default neighbors2bounds
//
var neighbors2boundsP3 = new Map();
neighbors2boundsP3.set('fat',default_neighbors2bounds(4));
neighbors2boundsP3.set('thin',default_neighbors2bounds(4));

//
// [7] construct base tilings and call substitute
//

// prepare decoration
decorateP3 = new Map();
decorateP3.set('fat',0);
decorateP3.set('thin',1);

//
// [7.1] construct "P3 (rhomb) Star1 by subst" tiling by substitution
// 
Tiling.P3star1bysubst = function({iterations}={}){
  var tiles = [];
  // push base "star" tiling with origins inside
  for(var i=0; i<5; i++){
    // construct tiles
    var myfat = fat.myclone();
    myfat.id.push(i);
    myfat.rotate(0,0,i*2*Math.PI/5);
    // define neighbors with undefined on the boundary
    myfat.neighbors.push(['fat',(i-1+5)%5]); // 0
    myfat.neighbors.push(undefined); // 1
    myfat.neighbors.push(undefined); // 2
    myfat.neighbors.push(['fat',(i+1)%5]); // 3
    tiles.push(myfat);
  }
  // call the substitution
  tiles = substitute(
    iterations,
    tiles,
    phi,
    substitutionP3,
    duplicatedP3,
    duplicatedP3oriented,
    neighborsP3,
    neighbors2boundsP3,
    decorateP3
  );
  // construct tiling
  return new Tiling(tiles);
}

//
// [7.2] construct "P3 (rhomb) Star2 by subst" tiling by substitution
// 
Tiling.P3star2bysubst = function({iterations}={}){
  var tiles = [];
  // push base "star" tiling with origins outside
  for(var i=0; i<5; i++){
    // construct tiles
    var myfat = fat.myclone();
    myfat.id.push(i);
    myfat.shift(0,-2*Math.cos(Math.PI/5));
    myfat.rotate(0,0,Math.PI+i*2*Math.PI/5);
    // define neighbors with undefined on the boundary
    myfat.neighbors.push(undefined); // 0
    myfat.neighbors.push(['fat',(i+1)%5]); // 1
    myfat.neighbors.push(['fat',(i-1+5)%5]); // 2
    myfat.neighbors.push(undefined); // 3
    tiles.push(myfat);
  }
  // call the substitution
  tiles = substitute(
    iterations,
    tiles,
    phi,
    substitutionP3,
    duplicatedP3,
    duplicatedP3oriented,
    neighborsP3,
    neighbors2boundsP3,
    decorateP3
  );
  // construct tiling
  return new Tiling(tiles);
}

//
// [7.3] construct "P3 (rhomb) Sun by subst" tiling by substitution
// 
Tiling.P3sunbysubst = function({iterations}={}){
  var tiles = [];
  // push base "sun" tiling
  for(var i=0; i<5; i++){
    // construct tiles
    var myfat = fat.myclone();
    myfat.id.push('basefat'+i); // unique!
    myfat.rotate(0,0,i*2*Math.PI/5);
    var mythin = thin.myclone();
    mythin.id.push('basethin'+i); // unique!
    mythin.rotate(0,0,Math.PI);
    mythin.shift(0,2*Math.cos(2*Math.PI/5)+1);
    mythin.rotate(0,0,(i*2+1)*Math.PI/5);
    // define neighbors with undefined on the boundary
    myfat.neighbors.push(['fat','basefat'+(i-1+5)%5]); // 0
    myfat.neighbors.push(['thin','basethin'+(i-1+5)%5]); // 1
    myfat.neighbors.push(['thin','basethin'+i]); // 2
    myfat.neighbors.push(['fat','basefat'+(i+1)%5]); // 3
    mythin.neighbors.push(undefined); // 0
    mythin.neighbors.push(['fat','basefat'+(i+1)%5]); // 1
    mythin.neighbors.push(['fat','basefat'+i]); // 2
    mythin.neighbors.push(undefined); // 3
    tiles.push(myfat);
    tiles.push(mythin);
  }
  // call the substitution
  tiles = substitute(
    iterations,
    tiles,
    phi,
    substitutionP3,
    duplicatedP3,
    duplicatedP3oriented,
    neighborsP3,
    neighbors2boundsP3,
    decorateP3
  );
  // construct tiling
  return new Tiling(tiles);
}

