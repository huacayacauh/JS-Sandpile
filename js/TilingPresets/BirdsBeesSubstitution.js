// This code is part of JS-Sandpile (https://github.com/huacayacauh/JS-Sandpile/)
// CC-BY Valentin Darrigo, Jeremy Fersula, Kevin Perrot

// Birds and Bees
// substitution described at
// http://tilings.math.uni-bielefeld.de/substitution/birds-and-bees/

//
// [0] toolbox
//

// golden ratio
var phi = (1+Math.sqrt(5))/2;
// height of bird and bee
var hb = Math.sin(2*Math.PI/5);
// height of rien
var hr = Math.sin(Math.PI/5)*(2-phi);
// angles of bird and bee
var acuteb = 2*Math.PI/5;
var obtuseb = 3*Math.PI/5;
// angles of rien
var acuter = Math.PI/5;
var obtuser = 4*Math.PI/5;

//
// [1] define tile types bird, bee, rien
//

// bird
var bounds = [];
bounds.push(0.5,0);
bounds.push(1-phi/2,hb);
bounds.push(phi/2-1,hb);
bounds.push(-0.5,0);
var bird = new Tile(['bird'],[],bounds,4);

// bee
var bee = bird.myclone();
bee.id[0]='bee';

// rien (using a variable called "void" may cause troubles...)
var bounds = [];
bounds.push(0.5,0);
bounds.push(1-phi/2,hr);
bounds.push(phi/2-1,hr);
bounds.push(-0.5,0);
var rien = new Tile(['rien'],[],bounds,4);

// convert a bird to a bee
Tile.prototype.bird2bee = function(){
  this.id[0]='bee';
}

// convert a be to a bird
Tile.prototype.bee2bird = function(){
  this.id[0]='bird';
}

// convert a bird to a rien
Tile.prototype.bird2rien = function(){
  this.id[0]='rien';
  var b23 = rotatePoint(this.bounds[2],this.bounds[3],this.bounds[0],this.bounds[1],acuteb-acuter);
  var b23bis = scalePoint(b23[0],b23[1],this.bounds[0],this.bounds[1],2-phi);
  this.bounds[2]=b23bis[0];
  this.bounds[3]=b23bis[1];
  var b45 = rotatePoint(this.bounds[4],this.bounds[5],this.bounds[6],this.bounds[7],acuter-acuteb);
  var b45bis = scalePoint(b45[0],b45[1],this.bounds[6],this.bounds[7],2-phi);
  this.bounds[4]=b45bis[0];
  this.bounds[5]=b45bis[1];
}

// convert a bee to a rien
Tile.prototype.bee2rien = function(){
  this.bird2rien();
}

//
// [2] define substitution BB
//
function substitutionBB(tile){
  switch(tile.id[0]){
    case 'bird':
      //
      // -------------------------------
      // bird substitution -> 5 birds, 3 bees, 2 riens
      // -------------------------------
      //
      var newtiles = [];

      // new bird 1
      var newbird1 = tile.myclone();
      newbird1.id.push('bird1');
      newbird1.scale(tile.bounds[0],tile.bounds[1],2-phi);
      newbird1.shift(tile.bounds[6]-newbird1.bounds[0],tile.bounds[7]-newbird1.bounds[1]);
      newbird1.rotate(newbird1.bounds[0],newbird1.bounds[1],Math.PI+acuteb+acuter);
      newtiles.push(newbird1);

      // new bird 2
      var newbird2 = tile.myclone();
      newbird2.id.push('bird2');
      newbird2.scale(tile.bounds[0],tile.bounds[1],2-phi);
      newbird2.shift(tile.bounds[4]-newbird2.bounds[6],tile.bounds[5]-newbird2.bounds[7]);
      newbird2.rotate(newbird2.bounds[6],newbird2.bounds[7],-2*acuteb);
      newtiles.push(newbird2);

      // new bird 3
      var newbird3 = tile.myclone();
      newbird3.id.push('bird3');
      newbird3.scale(tile.bounds[0],tile.bounds[1],2-phi);
      newbird3.shift(tile.bounds[2]-newbird3.bounds[0],tile.bounds[3]-newbird3.bounds[1]);
      newbird3.rotate(newbird3.bounds[0],newbird3.bounds[1],2*acuteb);
      newtiles.push(newbird3);

      // new bird 4
      var newbird4 = tile.myclone();
      newbird4.id.push('bird4');
      newbird4.scale(tile.bounds[0],tile.bounds[1],2-phi);
      newbird4.shift(tile.bounds[0]-newbird4.bounds[6],tile.bounds[1]-newbird4.bounds[7]);
      newbird4.rotate(newbird4.bounds[6],newbird4.bounds[7],Math.PI-acuteb-acuter);
      newtiles.push(newbird4);

      // new bee 1 (requires new bird 1)
      var newbee1 = tile.myclone();
      newbee1.bird2bee();
      newbee1.id.push('bee1');
      newbee1.scale(tile.bounds[0],tile.bounds[1],2-phi);
      newbee1.shift(newbird1.bounds[6]-newbee1.bounds[0],newbird1.bounds[7]-newbee1.bounds[1]);
      newbee1.rotate(newbee1.bounds[0],newbee1.bounds[1],acuter-2*acuteb);
      newtiles.push(newbee1);

      // new bee 2
      var newbee2 = tile.myclone();
      newbee2.bird2bee();
      newbee2.id.push('bee2');
      newbee2.scale(tile.bounds[0],tile.bounds[1],2-phi);
      newbee2.shift(tile.bounds[4]-newbee2.bounds[0],tile.bounds[5]-newbee2.bounds[1]);
      newbee2.rotate(newbee2.bounds[0],newbee2.bounds[1],Math.PI);
      newtiles.push(newbee2);

      // new bee 3 (requires new bird 4)
      var newbee3 = tile.myclone();
      newbee3.bird2bee();
      newbee3.id.push('bee3');
      newbee3.scale(tile.bounds[0],tile.bounds[1],2-phi);
      newbee3.shift(newbird4.bounds[0]-newbee3.bounds[6],newbird4.bounds[1]-newbee3.bounds[7]);
      newbee3.rotate(newbee3.bounds[6],newbee3.bounds[7],-3*acuteb-acuter);
      newtiles.push(newbee3);

      // new bird 5 (requires new bee 2)
      var newbird5 = tile.myclone();
      newbird5.id.push('bird5');
      newbird5.scale(tile.bounds[0],tile.bounds[1],2-phi);
      newbird5.shift(newbee2.bounds[2]-newbird5.bounds[4],newbee2.bounds[3]-newbird5.bounds[5]);
      newtiles.push(newbird5);

      // new rien 1 (requires new bird 1)
      var newrien1 = tile.myclone();
      newrien1.bird2rien();
      newrien1.id.push('rien1');
      newrien1.scale(tile.bounds[0],tile.bounds[1],2-phi);
      newrien1.shift(newbird1.bounds[2]-newrien1.bounds[6],newbird1.bounds[3]-newrien1.bounds[7]);
      newrien1.rotate(newrien1.bounds[6],newrien1.bounds[7],acuteb);
      newtiles.push(newrien1);

      // new rien 2 (requires new bird 4)
      var newrien2 = tile.myclone();
      newrien2.bird2rien();
      newrien2.id.push('rien2');
      newrien2.scale(tile.bounds[0],tile.bounds[1],2-phi);
      newrien2.shift(newbird4.bounds[4]-newrien2.bounds[0],newbird4.bounds[5]-newrien2.bounds[1]);
      newrien2.rotate(newrien2.bounds[0],newrien2.bounds[1],-acuteb);
      newtiles.push(newrien2);

      // done
      return newtiles;
      break;

    case 'bee':
      //
      // -------------------------------
      // bee substitution -> 3 birds, 2 bees, 1 rien
      // -------------------------------
      //
      var newtiles = [];

      // new bird 1
      var newbird1 = tile.myclone();
      newbird1.bee2bird();
      newbird1.id.push('bird1');
      newbird1.scale(tile.bounds[0],tile.bounds[1],2-phi);
      newbird1.shift(tile.bounds[6]-newbird1.bounds[6],tile.bounds[7]-newbird1.bounds[7]);
      newbird1.rotate(newbird1.bounds[6],newbird1.bounds[7],-acuter);
      newtiles.push(newbird1);

      // new bird 2
      var newbird2 = tile.myclone();
      newbird2.bee2bird();
      newbird2.id.push('bird2');
      newbird2.scale(tile.bounds[0],tile.bounds[1],2-phi);
      newbird2.shift(tile.bounds[4]-newbird2.bounds[0],tile.bounds[5]-newbird2.bounds[1]);
      newbird2.rotate(newbird2.bounds[0],newbird2.bounds[1],Math.PI);
      newtiles.push(newbird2);

      // new bird 3
      var newbird3 = tile.myclone();
      newbird3.bee2bird();
      newbird3.id.push('bird3');
      newbird3.scale(tile.bounds[0],tile.bounds[1],2-phi);
      newbird3.rotate(newbird3.bounds[0],newbird3.bounds[1],acuter);
      newtiles.push(newbird3);

      // new bee 1 (requires new bird 2)
      var newbee1 = tile.myclone();
      newbee1.id.push('bee1');
      newbee1.scale(tile.bounds[0],tile.bounds[1],2-phi);
      newbee1.shift(newbird2.bounds[4]-newbee1.bounds[2],newbird2.bounds[5]-newbee1.bounds[3]);
      newtiles.push(newbee1);

      // new bee 2 (requires new bird 1)
      var newbee2 = tile.myclone();
      newbee2.id.push('bee2');
      newbee2.scale(tile.bounds[0],tile.bounds[1],2-phi);
      newbee2.shift(newbird1.bounds[2]-newbee2.bounds[4],newbird1.bounds[3]-newbee2.bounds[5]);
      newtiles.push(newbee2);
      
      // new rien 1 (requires new bird 1)
      var newrien1 = tile.myclone();
      newrien1.bee2rien();
      newrien1.id.push('rien1');
      newrien1.scale(tile.bounds[0],tile.bounds[1],2-phi);
      newrien1.shift(newbird1.bounds[4]-newrien1.bounds[0],newbird1.bounds[5]-newrien1.bounds[1]);
      newrien1.rotate(newrien1.bounds[0],newrien1.bounds[1],Math.PI);
      newtiles.push(newrien1);

      // done
      return newtiles;
      break;

    case 'rien':
      //
      // -------------------------------
      // rien substitution -> 
      // -------------------------------
      //
      return [];
      break;

    default:
      // all tiles should be bird, bee or rien
      console.log("caution: undefined tile type for substitutionBB, id="+tile.id);
  }
}

//
// [3] no duplicated tiles
// [4] I am lazy
//

//
// [6] use default neighbors2bounds
// 
var neighbors2boundsBB = new Map();
neighbors2boundsBB.set('bird',default_neighbors2bounds(4));
neighbors2boundsBB.set('bee',default_neighbors2bounds(4));
neighbors2boundsBB.set('rien',default_neighbors2bounds(4));

//
// [7] construct base tilings and call substitute
//

// decorate
decorateBB = new Map();
decorateBB.set('bird',1);
decorateBB.set('bee',2);
decorateBB.set('rien',0);

//
// [7.1] construct "Birds and Bees 1 by subst" tiling by substitution
// 
Tiling.BB1bysubst = function({iterations}={}){
  // push base tiling
  var tiles = [];
  // use bird subsitution
  var mybird = bird.myclone();
  mybird.scale(0,0,1/(2-phi));
  var tiles = substitutionBB(mybird);
  // add two birds, one bee, one rien
  var tilesdict = new Map(tiles.map(i => [id2key(i.id), i]));
  var mybird6 = bird.myclone();
  mybird6.id.push('bird6');
  mybird6.shift(tilesdict.get(id2key(['bird','bird1'])).bounds[0]-mybird6.bounds[0],tilesdict.get(id2key(['bird','bird1'])).bounds[1]-mybird6.bounds[1]);
  mybird6.rotate(mybird6.bounds[0],mybird6.bounds[1],Math.PI+acuter);
  tiles.push(mybird6);
  var mybird7 = bird.myclone();
  mybird7.id.push('bird7');
  mybird7.shift(tilesdict.get(id2key(['bird','bird4'])).bounds[6]-mybird7.bounds[6],tilesdict.get(id2key(['bird','bird4'])).bounds[7]-mybird7.bounds[7]);
  mybird7.rotate(mybird7.bounds[6],mybird7.bounds[7],Math.PI-acuter);
  tiles.push(mybird7);
  var mybee4 = bee.myclone();
  mybee4.id.push('bee4');
  mybee4.rotate(mybee4.bounds[0],mybee4.bounds[1],Math.PI);
  mybee4.shift(tilesdict.get(id2key(['bird','bird1'])).bounds[2]-mybee4.bounds[0],tilesdict.get(id2key(['bird','bird1'])).bounds[3]-mybee4.bounds[1]);
  tiles.push(mybee4);
  var myrien3 = rien.myclone();
  myrien3.id.push('rien3');
  myrien3.shift(mybee4.bounds[2]-myrien3.bounds[4],mybee4.bounds[3]-myrien3.bounds[5]);
  tiles.push(myrien3);
  // call the substitution
  tiles = substitute(
    iterations,
    tiles,
    1/(2-phi),
    substitutionBB,
    [], // no duplicated tiles
    [], // no duplicated tiles
    "I am lazy", // myneighbors
    neighbors2boundsBB,
    decorateBB,
  );
  // construct tiling
  return new Tiling(tiles);
}

