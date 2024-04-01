// Double Halfhex Variation
// substitution, variation from this one described at
// https://tilings.math.uni-bielefeld.de/substitution/double-halfhex/
//
// New rules for the moment :
// Small Halfhex (red) divided in 4 bug (yellow) halfhex
// Big Halfex (yellow) divided in 16 (red) halfhex

//
// [0] toolbox
//


// sqrt(3)
var sqrt3 = Math.sqrt(3);

//
// [1] define tile types double halfhex
//

// small halfhex
var bounds = [];
bounds.push(-4, -sqrt3);
bounds.push(-2, sqrt3);
bounds.push(2, sqrt3);
bounds.push(4, -sqrt3);
var small = new Tile(['small'],[],bounds,4);

// big halfhex
var big = new Tile(['big'],[],bounds,4);

// convert a small halfhex to a big halfhex
Tile.prototype.small2big = function(){
  this.id[0]='big';
}

// convert a big halfhex to a small halfhex
Tile.prototype.big2small = function(){
  this.id[0]='small';
}

//
// [2] define substitution doublehalfhex
//
function substitutionDoubleHalfhex(tile){
  switch(tile.id[0]){
    case 'small':
      //
      // -------------------------------
      // small substitution -> 16 big halfhexs
      // -------------------------------
      //
      var newtiles = [];

      var s60 = tile.bounds[6] - tile.bounds[0];
      var s71 = tile.bounds[7] - tile.bounds[1];
      var s42 = tile.bounds[4] - tile.bounds[2];
      var s53 = tile.bounds[5] - tile.bounds[3];
      var s20 = tile.bounds[2] - tile.bounds[0];
      var s31 = tile.bounds[3] - tile.bounds[1];
      var s46 = tile.bounds[4] - tile.bounds[6];
      var s57 = tile.bounds[5] - tile.bounds[7];

      //
      // Right big halfhexs
      //

      // new big halfhex (left one)
      var newBig0 = tile.myclone();
      newBig0.id.push('b0');
      newBig0.small2big();
      newBig0.scale(newBig0.bounds[0], newBig0.bounds[1], 1/4);
      newBig0.rotate(newBig0.bounds[6], newBig0.bounds[7], -Math.PI/3);
      newBig0.shift(s60/2, s71/2);
      newtiles.push(newBig0);

      // new big halfhex (bottom one)
      var newBig1 = tile.myclone();
      newBig1.id.push('b1');
      newBig1.small2big();
      newBig1.scale(newBig1.bounds[0], newBig1.bounds[1], 1/4);
      var b60 = newBig1.bounds[6] - newBig1.bounds[0];
      var b71 = newBig1.bounds[7] - newBig1.bounds[1];
      newBig1.shift(s60 - b60, s71 - b71);
      newtiles.push(newBig1);

      // new big halfhex (right one)
      var newBig2 = tile.myclone();
      newBig2.id.push('b2');
      newBig2.small2big();
      newBig2.scale(newBig2.bounds[0], newBig2.bounds[1], 1/4);
      newBig2.rotate(newBig2.bounds[0], newBig2.bounds[1], 2*Math.PI/3);
      var b64 = newBig2.bounds[6] - newBig2.bounds[4];
      var b75 = newBig2.bounds[7] - newBig2.bounds[5];
      var b20 = newBig2.bounds[2] - newBig2.bounds[0];
      var b31 = newBig2.bounds[3] - newBig2.bounds[1];
      newBig2.shift(s60 + b64 + b20, s71 + b75 + b31);
      newtiles.push(newBig2);

      // new big halfhex (upper one)
      var newBig3 = tile.myclone();
      newBig3.id.push('b3');
      newBig3.small2big();
      newBig3.scale(newBig3.bounds[0], newBig3.bounds[1], 1/4);
      newBig3.rotate(newBig3.bounds[0], newBig3.bounds[1], -2*Math.PI/3);
      newBig3.shift(s20 + s42, s31 + s53);
      newtiles.push(newBig3);


      //
      // Bottom big halfhexs
      //

      // new big halfhex (left one)
      var newBig4 = tile.myclone();
      newBig4.id.push('b4');
      newBig4.small2big();
      newBig4.scale(newBig4.bounds[0], newBig4.bounds[1], 1/4);
      newBig4.rotate(newBig4.bounds[6], newBig4.bounds[7], -2*Math.PI/3);
      newtiles.push(newBig4);

      // new big halfhex (bottom one)
      var newBig5 = tile.myclone();
      newBig5.id.push('b5');
      newBig5.small2big();
      newBig5.scale(newBig5.bounds[0], newBig5.bounds[1], 1/4);
      b60 = newBig5.bounds[6] - newBig5.bounds[0];
      b71 = newBig5.bounds[7] - newBig5.bounds[1];
      newBig5.shift(s60/2 - b60/2, s71/2 - b71/2);
      newtiles.push(newBig5);

      // new big halfhex (right one)
      var newBig6 = tile.myclone();
      newBig6.id.push('b6');
      newBig6.small2big();
      newBig6.scale(newBig6.bounds[0], newBig6.bounds[1], 1/4);
      b60 = newBig6.bounds[6] - newBig6.bounds[0];
      b71 = newBig6.bounds[7] - newBig6.bounds[1];
      newBig6.shift(s60 - b60, s71 - b71);
      newBig6.rotate(newBig6.bounds[0], newBig6.bounds[1], 2*Math.PI/3);
      newtiles.push(newBig6);

      // new big halfhex (upper one)
      var newBig7 = tile.myclone();
      newBig7.id.push('b7');
      newBig7.small2big();
      newBig7.scale(newBig7.bounds[0], newBig7.bounds[1], 1/4);
      newBig7.rotate(newBig7.bounds[0], newBig7.bounds[1], Math.PI);
      var b06 = newBig7.bounds[0] - newBig7.bounds[6];
      var b17 = newBig7.bounds[1] - newBig7.bounds[7];
      var b02 = newBig7.bounds[0] - newBig7.bounds[2];
      var b13 = newBig7.bounds[1] - newBig7.bounds[3];
      newBig7.shift(2*b06 + 2*b02, 2*b17 + 2*b13);
      newtiles.push(newBig7);


      //
      // Left big halfhexs
      //

      // new big halfhex (left one)
      var newBig8 = tile.myclone();
      newBig8.id.push('b8');
      newBig8.small2big();
      newBig8.scale(newBig8.bounds[0], newBig8.bounds[1], 1/4);
      b20 = newBig8.bounds[2] - newBig8.bounds[0];
      b31 = newBig8.bounds[3] - newBig8.bounds[1];
      newBig8.rotate(newBig8.bounds[0], newBig8.bounds[1], -2*Math.PI/3);
      b06 = newBig8.bounds[0] - newBig8.bounds[6];
      b17 = newBig8.bounds[1] - newBig8.bounds[7];
      newBig8.shift(b20 + b06, b31 + b17);
      newtiles.push(newBig8);
      

      // new big halfhex (bottom one)
      var newBig9 = tile.myclone();
      newBig9.id.push('b9');
      newBig9.small2big();
      newBig9.scale(newBig9.bounds[0], newBig9.bounds[1], 1/4);
      newtiles.push(newBig9);

      // new big halfhex (right one)
      var newBig10 = tile.myclone();
      newBig10.id.push('b10');
      newBig10.small2big();
      newBig10.scale(newBig10.bounds[0], newBig10.bounds[1], 1/4);
      b60 = newBig10.bounds[6] - newBig10.bounds[0];
      b71 = newBig10.bounds[7] - newBig10.bounds[1];
      newBig10.rotate(newBig10.bounds[0], newBig10.bounds[1], Math.PI/3);
      newBig10.shift(b60, b71);
      newtiles.push(newBig10);
      

      // new big halfhex (upper one)
      var newBig11 = tile.myclone();
      newBig11.id.push('b11');
      newBig11.small2big();
      newBig11.scale(newBig11.bounds[0], newBig11.bounds[1], 1/4);
      newBig11.rotate(newBig11.bounds[0], newBig11.bounds[1], 2*Math.PI/3);
      b60 = newBig11.bounds[6] - newBig11.bounds[0];
      b71 = newBig11.bounds[7] - newBig11.bounds[1];
      newBig11.shift(s60/2 + b60, s71/2 + b71);
      newtiles.push(newBig11);


      //
      // Upper big halfhexs
      //

      // new big halfhex (left one)
      var newBig12 = tile.myclone();
      newBig12.id.push('b12');
      newBig12.small2big();
      newBig12.scale(newBig12.bounds[0], newBig12.bounds[1], 1/4);
      newBig12.rotate(newBig12.bounds[0], newBig12.bounds[1], -Math.PI/3);
      newBig12.shift(s20, s31);
      newtiles.push(newBig12);
      

      // new big halfhex (bottom one)
      var newBig13 = tile.myclone();
      newBig13.id.push('b13');
      newBig13.small2big();
      newBig13.scale(newBig13.bounds[0], newBig13.bounds[1], 1/4);
      b64 = newBig13.bounds[6] - newBig13.bounds[4];
      b75 = newBig13.bounds[7] - newBig13.bounds[5];
      newBig13.shift(s20 + 2*b64, s31 + 2*b75);
      newtiles.push(newBig13);

      // new big halfhex (right one)
      var newBig14 = tile.myclone();
      newBig14.id.push('b14');
      newBig14.small2big();
      newBig14.scale(newBig14.bounds[0], newBig14.bounds[1], 1/4);
      b60 = newBig14.bounds[6] - newBig14.bounds[0];
      b71 = newBig14.bounds[7] - newBig14.bounds[1];
      newBig14.rotate(newBig14.bounds[6], newBig14.bounds[7], Math.PI/3);
      newBig14.shift(s60 + s46 - b60, s71 + s57 - b71);
      newtiles.push(newBig14);
      
      // new big halfhex (upper one)
      var newBig15 = tile.myclone();
      newBig15.id.push('b15');
      newBig15.small2big();
      newBig15.scale(newBig15.bounds[0], newBig15.bounds[1], 1/4);
      b60 = newBig15.bounds[6] - newBig15.bounds[0];
      b71 = newBig15.bounds[7] - newBig15.bounds[1];
      newBig15.rotate(newBig15.bounds[0], newBig15.bounds[1], Math.PI);
      newBig15.shift(s20 + s42/2 + b60/2, s31 + s53/2 + b71/2);
      newtiles.push(newBig15);
      
      // done
      return newtiles;
      break;

    case 'big':
      //
      // -------------------------------
      // big substitution -> 4 small halfhex
      // -------------------------------
      //
      var newtiles = [];

      var b42 = tile.bounds[4] - tile.bounds[2];
      var b53 = tile.bounds[5] - tile.bounds[3];
      var b20 = tile.bounds[2] - tile.bounds[0];
      var b31 = tile.bounds[3] - tile.bounds[1];
      var b06 = tile.bounds[0] - tile.bounds[6];
      var b17 = tile.bounds[1] - tile.bounds[7];
      
      // new small halfhex (left one)
      var newSmall0 = tile.myclone();
      newSmall0.big2small();
      newSmall0.id.push('s0');
      newSmall0.scale(newSmall0.bounds[0], newSmall0.bounds[1], 1/2);
      newSmall0.rotate(newSmall0.bounds[6], newSmall0.bounds[7], -2*Math.PI/3);
      newSmall0.shift(b06/2, b17/2);
      newtiles.push(newSmall0);

      // new small halfhex (upper one)
      var newSmall1 = tile.myclone();
      newSmall1.big2small();
      newSmall1.id.push('s1');
      newSmall1.scale(newSmall1.bounds[0], newSmall1.bounds[1], 1/2);
      newSmall1.rotate(newSmall1.bounds[0], newSmall1.bounds[1], Math.PI);
      newSmall1.shift(b20 + b42, b31 + b53);
      newtiles.push(newSmall1);

      // new small halfhex (right one)
      var newSmall2 = tile.myclone();
      newSmall2.big2small();
      newSmall2.id.push('s2');
      newSmall2.scale(newSmall2.bounds[6], newSmall2.bounds[7], 1/2);
      newSmall2.rotate(newSmall2.bounds[0], newSmall2.bounds[1], 2*Math.PI/3);
      newSmall2.shift(-b06/2, -b17/2);
      newtiles.push(newSmall2);

      // new small halfhex (bottom one)
      var newSmall3 = tile.myclone();
      newSmall3.big2small();
      newSmall3.id.push('s3');
      newSmall3.scale(newSmall3.bounds[0], newSmall3.bounds[1], 1/2);
      var bc42 = newSmall3.bounds[4] - newSmall3.bounds[2];
      var bc53 = newSmall3.bounds[5] - newSmall3.bounds[3];
      newSmall3.shift(bc42, bc53);
      newtiles.push(newSmall3);

      // done
      return newtiles;
      break;
  }
}

//
// [3] no duplicated tiles
//

//
// [4] I am lazy
//

//
// [6] use default neighbors2bounds
//
var neighbors2boundsDoubleHalfhex = new Map();
neighbors2boundsDoubleHalfhex.set('small',default_neighbors2bounds(4));
neighbors2boundsDoubleHalfhex.set('big',default_neighbors2bounds(4));

//
// [7] construct base tilings and call substitute
//

// prepare decoration
decorateDoubleHalfhex = new Map();
decorateDoubleHalfhex.set('small',0);
decorateDoubleHalfhex.set('big',1);

//
// [7.1] construct "Double Halfhex by subst" tiling by substitution
// 
Tiling.doubleHalfhexVarbysubst = function({iterations}={}){
  var tiles = [];
  var mySmall0 = small.myclone();
  mySmall0.id.push(0);
  tiles.push(mySmall0);
  var mySmall1 = small.myclone();
  mySmall1.id.push(1);
  mySmall1.rotate(mySmall1.bounds[0], mySmall1.bounds[1], Math.PI);
  mySmall1.shift(mySmall1.bounds[0] - mySmall1.bounds[6], mySmall1.bounds[1] - mySmall1.bounds[7]);
  tiles.push(mySmall1);

  // call the substitution
  tiles = substitute(
    iterations,
    tiles,
    phi,
    substitutionDoubleHalfhex,
    [], // no duplicated tiles
    [], // no duplicated tiles
    "I am lazy", // myneighbors
    neighbors2boundsDoubleHalfhex,
    decorateDoubleHalfhex
  );
  // construct tiling
  return new Tiling(tiles);
}

