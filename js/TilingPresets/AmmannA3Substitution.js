// Ammann A3
// substitution described at
// https://tilings.math.uni-bielefeld.de/substitution/ammann-a3/

//
// [0] toolbox
//

// sqrt(2)
var sqrt2 = Math.sqrt(2);

// golden ratio
var phi = (1 + Math.sqrt(5))/2;

//
// [1] define tile types A3
//

//
// six edges tiles
//

// Rotation : 0
var bounds = [];
bounds.push(0, 0);
bounds.push(0, phi);
bounds.push(phi, phi);
bounds.push(phi, phi**2);
bounds.push(phi**3, phi**2);
bounds.push(phi**3, 0);
var six0 = new Tile(['six0'],[],bounds,6);

// rotation : pi/2
var bounds = [];
bounds.push(0, 0);
bounds.push(-phi, 0);
bounds.push(-phi, phi);
bounds.push(-(phi**2), phi);
bounds.push(-(phi**2), phi**3);
bounds.push(0, phi**3);
var six90 = new Tile(['six90'],[],bounds,6);

// rotation : pi
var bounds = [];
bounds.push(0, 0);
bounds.push(0, -phi);
bounds.push(-phi, -phi);
bounds.push(-phi, -(phi**2));
bounds.push(-(phi**3), -(phi**2));
bounds.push(-(phi**3), 0);
var six180 = new Tile(['six180'],[],bounds,6);

// rotation : 2pi/3
var bounds = [];
bounds.push(0, 0);
bounds.push(phi, 0);
bounds.push(phi, -phi);
bounds.push(phi**2, -phi);
bounds.push(phi**2, -(phi**3));
bounds.push(0, -(phi**3));
var six270 = new Tile(['six270'],[],bounds,6);

//
// eight edges tiles
//

// rotation : 0
var bounds = [];
bounds.push(0, 0);
bounds.push(0, phi**2);
bounds.push(phi**2, phi**2);
bounds.push(phi**2, phi**2 + phi);
bounds.push(phi**2 + phi, phi**2 + phi);
bounds.push(phi**2 + phi, phi);
bounds.push(2 * phi**2, phi);
bounds.push(2 * phi**2, 0);
var eight0 = new Tile(['eight0'],[],bounds,8);

// rotation : pi/2
var bounds = [];
bounds.push(0, 0);
bounds.push(-(phi**2), 0);
bounds.push(-(phi**2), phi**2);
bounds.push(-(phi**2 + phi), phi**2);
bounds.push(-(phi**2 + phi), phi**2 + phi);
bounds.push(-phi, phi**2 + phi);
bounds.push(-phi, 2 * phi**2);
bounds.push(0, 2 * phi**2);
var eight90 = new Tile(['eight90'],[],bounds,8);

// rotation : pi
var bounds = [];
bounds.push(0, 0);
bounds.push(0, -(phi**2));
bounds.push(-(phi**2), -(phi**2));
bounds.push(-(phi**2), -(phi**2 + phi));
bounds.push(-(phi**2 + phi), -(phi**2 + phi));
bounds.push(-(phi**2 + phi), -phi);
bounds.push(-(2 * phi**2), -phi);
bounds.push(-(2 * phi**2), 0);
var eight180 = new Tile(['eight180'],[],bounds,8);

// rotation : 3pi/2
var bounds = [];
bounds.push(0, 0);
bounds.push(phi**2, 0);
bounds.push(phi**2, -(phi**2));
bounds.push(phi**2 + phi, -(phi**2));
bounds.push(phi**2 + phi, -(phi**2 + phi));
bounds.push(phi, -(phi**2 + phi));
bounds.push(phi, -(2 * phi**2));
bounds.push(0, -(2 * phi**2));
var eight270 = new Tile(['eight270'],[],bounds,8);


//
// ten edges tiles
//

//rotation : 0
var bounds = [];
bounds.push(0, 0);
bounds.push(0, phi);
bounds.push(-(phi - 1), phi);
bounds.push(-(phi - 1), phi + 1);
bounds.push(1, phi + 1);
bounds.push(1, 2 * phi + 1);
bounds.push(phi + 1, 2 * phi + 1);
bounds.push(phi + 1, phi);
bounds.push(phi**2 + 1, phi);
bounds.push(phi**2 + 1, 0);
var ten0 = new Tile(['ten0'],[],bounds,10);

//rotation : pi/2
var bounds = [];
bounds.push(0, 0);
bounds.push(-phi, 0);
bounds.push(-phi, -(phi - 1));
bounds.push(-(phi + 1), -(phi - 1));
bounds.push(-(phi + 1), 1);
bounds.push(-(2 * phi + 1), 1);
bounds.push(-(2 * phi + 1), phi + 1);
bounds.push(-phi, phi + 1);
bounds.push(-phi, phi**2 + 1);
bounds.push(0, phi**2 + 1);
var ten90 = new Tile(['ten90'],[],bounds,10);

//rotation : pi
var bounds = [];
bounds.push(0, 0);
bounds.push(0, -phi);
bounds.push(phi - 1, -phi);
bounds.push(phi - 1, -(phi + 1));
bounds.push(-1, -(phi + 1));
bounds.push(-1, -(2 * phi + 1));
bounds.push(-(phi + 1), -(2 * phi + 1));
bounds.push(-(phi + 1), -phi);
bounds.push(-(phi**2 + 1), -phi);
bounds.push(-(phi**2 + 1), 0);
var ten180 = new Tile(['ten180'],[],bounds,10);

//rotation : 3pi/2
var bounds = [];
bounds.push(0, 0);
bounds.push(phi, 0);
bounds.push(phi, phi - 1);
bounds.push(phi + 1, phi - 1);
bounds.push(phi + 1, -1);
bounds.push(2 * phi + 1, -1);
bounds.push(2 * phi + 1, -(phi + 1));
bounds.push(phi, -(phi + 1));
bounds.push(phi, -(phi**2 + 1));
bounds.push(0, -(phi**2 + 1));
var ten270 = new Tile(['ten270'],[],bounds,10);

// convert a six to an eight
Tile.prototype.six2eight = function(){
  var x0 = this.bounds[0];
  var y0 = this.bounds[1];
  var s20 = this.bounds[2] - this.bounds[0];
  var s31 = this.bounds[3] - this.bounds[1];
  var s86 = this.bounds[8] - this.bounds[6];
  var s97 = this.bounds[9] - this.bounds[7];

  Tile.prototype.six0And180 = function(){
    // point 2
    this.bounds[2] = x0;
    this.bounds[3] = y0 + s86;
    // point 3
    this.bounds[4] = x0 + s86;
    this.bounds[5] = this.bounds[3];
    //point 4
    this.bounds[6] = this.bounds[4];
    this.bounds[7] = y0 + s31 + s86;
    //point 5
    this.bounds[8] = x0 + s31 + s86;
    this.bounds[9] = this.bounds[7];
    //point 6
    this.bounds[10] = this.bounds[8];
    this.bounds[11] = y0 + s31;
    //point 7
    this.bounds.push(x0 + 2 * s86, this.bounds[11]);
    //point 8
    this.bounds.push(this.bounds[12], y0);
  }

  Tile.prototype.six90And270 = function(){
    // point 2
    this.bounds[2] = x0 - s97;
    this.bounds[3] = y0;
    // point 3
    this.bounds[4] = this.bounds[2];
    this.bounds[5] = y0 + s97;
    //point 4
    this.bounds[6] = x0 - s97 + s20;
    this.bounds[7] = this.bounds[5];
    //point 5
    this.bounds[8] = this.bounds[6];
    this.bounds[9] = y0 + s97 - s20;
    //point 6
    this.bounds[10] = x0 + s20;
    this.bounds[11] = this.bounds[9];
    //point 7
    this.bounds.push(this.bounds[10], y0 + 2 * s97);
    //point 8
    this.bounds.push(x0, this.bounds[13]);
  }
  console.log(this);
  switch(this.id[0]){
    case 'six0':
      this.id[0]='eight0';
      this.six0And180();
      break;

    case 'six90':
      this.id[0]='eight90';
      this.six90And270();
      break;

    case 'six180':
      this.id[0]='eight180';
      this.six0And180();
      break;

    case 'six270':
      this.id[0]='eight270';
      this.six90And270();
      break;
  }
  this.limit = 8;
}

// convert an eight to a six
Tile.prototype.eight2six = function(){
  var x0 = this.bounds[0];
  var y0 = this.bounds[1];
  var e20 = this.bounds[2] - this.bounds[0];
  var e31 = this.bounds[3] - this.bounds[1];
  var e64 = this.bounds[6] - this.bounds[4];
  var e75 = this.bounds[7] - this.bounds[5];

  Tile.prototype.eight0And180 = function(){
    // point 2
    this.bounds[2] = x0;
    this.bounds[3] = y0 + e75;
    // point 3
    this.bounds[4] = x0 + e75;
    this.bounds[5] = this.bounds[3];
    //point 4
    this.bounds[6] = this.bounds[4];
    this.bounds[7] = y0 + e31;
    //point 5
    this.bounds[8] = x0 + e75 + e31;
    this.bounds[9] = this.bounds[7];
    //point 6
    this.bounds[10] = this.bounds[8];
    this.bounds[11] = y0;
  }

  Tile.prototype.eight90And270 = function(){
    // point 2
    this.bounds[2] = x0 + e64;
    this.bounds[3] = y0;
    // point 3
    this.bounds[4] = this.bounds[2];
    this.bounds[5] = y0 - e64;
    //point 4
    this.bounds[6] = x0 + e20;
    this.bounds[7] = this.bounds[5];
    //point 5
    this.bounds[8] = this.bounds[6];
    this.bounds[9] = y0 - e64 - e20;
    //point 6
    this.bounds[10] = x0;
    this.bounds[11] = this.bounds[9];
  }
  switch(this.id[0]){
    case 'eight0':
      this.id[0]='six0';
      this.eight0And180();
      break;

    case 'eight90':
      this.id[0]='six90';
      this.eight90And270();
      break;

    case 'eight180':
      this.id[0]='six180';
      this.eight0And180();
      break;

    case 'eight270':
      this.id[0]='six270';
      this.eight90And270();
      break;
  }
  // removes points 7 and 8
  this.bounds.splice(-4);
  this.limit = 6;
}

// convert an eight to a ten
Tile.prototype.eight2ten = function(){
  var x0 = this.bounds[0];
  var y0 = this.bounds[1];
  var e20 = this.bounds[2] - this.bounds[0];
  var e31 = this.bounds[3] - this.bounds[1];
  var e64 = this.bounds[6] - this.bounds[4];
  var e75 = this.bounds[7] - this.bounds[5];
  var e1210 = this.bounds[12] - this.bounds[10];
  var e1311 = this.bounds[13] - this.bounds[11];

  Tile.prototype.eight0And180 = function(){
    // point 2
    this.bounds[2] = x0;
    this.bounds[3] = y0 + e75;
    // point 3
    this.bounds[4] = x0 - (e75 - e1210) ;
    this.bounds[5] = this.bounds[3];
    //point 4
    this.bounds[6] = this.bounds[4];
    this.bounds[7] = y0 + e75 + e1210;
    //point 5
    this.bounds[8] = x0 + e1210;
    this.bounds[9] = this.bounds[7];
    //point 6
    this.bounds[10] = this.bounds[8];
    this.bounds[11] = y0 + e31 + e75;
    //point 7
    this.bounds[12] = x0 + e1210 + e75;
    this.bounds[13] = this.bounds[11];
    //point 8
    this.bounds[14] = this.bounds[12];
    this.bounds[15] = y0 + e75;
    //point 9
    this.bounds.push(x0 + e1210 + e31, this.bounds[15]);
    //point 10
    this.bounds.push(this.bounds[16], y0);
  }

  Tile.prototype.eight90And270 = function(){
    // point 2
    this.bounds[2] = x0 + e64;
    this.bounds[3] = y0;
    // point 3
    this.bounds[4] = this.bounds[2];
    this.bounds[5] = y0 - (-e64 - e1311);
    //point 4
    this.bounds[6] = x0 + e64 - e1311;
    this.bounds[7] = this.bounds[5];
    //point 5
    this.bounds[8] = this.bounds[6];
    this.bounds[9] = y0 + e1311;
    //point 6
    this.bounds[10] = x0 + e64 + e20;
    this.bounds[11] = this.bounds[9];
    //point 7
    this.bounds[12] = this.bounds[10];
    this.bounds[13] = y0 + e1311 - e64;
    //point 8
    this.bounds[14] = x0 + e64;
    this.bounds[15] = this.bounds[13];
    //point 9
    this.bounds.push(this.bounds[14], y0 + e1311 - e20);
    //point 10
    this.bounds.push(x0, this.bounds[17]);
  }
  switch(this.id[0]){
    case 'eight0':
      this.id[0] = 'ten180';
      this.eight0And180();
      break;

    case 'eight90':
      this.id[0] = 'ten270';
      this.eight90And270();
      break;

    case 'eight180':
      this.id[0] = 'ten0';
      this.eight0And180();
      break;

    case 'eight270':
      this.id[0] = 'ten90';
      this.eight90And270();
      break;
  }

  this.limit = 10;
}

// convert a ten to a six
Tile.prototype.ten2six = function(){
  var x0 = this.bounds[0];
  var y0 = this.bounds[1];
  var t20 = this.bounds[2] - this.bounds[0];
  var t31 = this.bounds[3] - this.bounds[1];
  var t1214 = this.bounds[12] - this.bounds[14];
  var t1315 = this.bounds[13] - this.bounds[15];
  
  Tile.prototype.ten0And180 = function(){
    // point 2
    this.bounds[2] = x0;
    this.bounds[3] = y0 + t31;
    // point 3
    this.bounds[4] = x0 + t31;
    this.bounds[5] = this.bounds[3];
    //point 4
    this.bounds[6] = this.bounds[4];
    this.bounds[7] = y0 + t1315;
    //point 5
    this.bounds[8] = x0 + t31 + t1315;
    this.bounds[9] = this.bounds[7];
    //point 6
    this.bounds[10] = this.bounds[8];
    this.bounds[11] = y0;
  }

  Tile.prototype.ten90And270 = function(){
    // point 2
    this.bounds[2] = x0 + t20;
    this.bounds[3] = y0;
    // point 3
    this.bounds[4] = this.bounds[2];
    this.bounds[5] = y0 - t20;
    //point 4
    this.bounds[6] = x0 + t1214;
    this.bounds[7] = this.bounds[5];
    //point 5
    this.bounds[8] = this.bounds[6];
    this.bounds[9] = y0 - t20 - t1214;
    //point 6
    this.bounds[10] = x0;
    this.bounds[11] = this.bounds[9];
  }

  switch(this.id[0]){
    case 'ten0':
      this.id[0] = 'six0';
      this.ten0And180();
      break;

    case 'ten90':
      this.id[0] = 'six90';
      this.ten90And270();
      break;

    case 'ten180':
      this.id[0] = 'six180';
      this.ten0And180();
      break;

    case 'ten270':
      this.id[0] = 'six270';
      this.ten90And270();
      break;

  }
  // removes points 7, 8, 9 and 10
  this.bounds.splice(-8);
}

Tile.prototype.six2sixWithHalfPi = function(){
  switch(this.id[0]){
    case 'six0':
      this.id[0] = 'six90';
      break;
    
    case 'six90':
      this.id[0] = 'six180';
      break;

    case 'six180':
      this.id[0] = 'six270';
      break;

    case 'six270':
      this.id[0] = 'six0';
      break;
  }
}

Tile.prototype.six2sixWith3HalfPi = function(){
  switch(this.id[0]){
    case 'six0':
      this.id[0] = 'six270';
      break;
    
    case 'six90':
      this.id[0] = 'six0';
      break;

    case 'six180':
      this.id[0] = 'six90';
      break;

    case 'six270':
      this.id[0] = 'six180';
      break;
  }
}

Tile.prototype.ten2ten = function(){
  switch(this.id[0]){
    case 'ten0':
      this.id[0] = 'ten180';
      break;

    case 'ten90':
      this.id[0] = 'ten270';
      break;

    case 'ten180':
      this.id[0] = 'ten0';
      break;

    case 'ten270':
      this.id[0] = 'ten90';
      break;
  }
}

//
// [2] define substitution A3
//
function substitutionA3(tile){
  switch(tile.id[0]){
    
      //
      // -------------------------------
      // six substitution -> 1 eight, 1 six
      // -------------------------------
      //
    case 'six0':
    case 'six90':
    case 'six180':
    case 'six270':
      var newtiles = [];

      // new six
      var news = tile.myclone();
      news.id.push('s');
      news.six2sixWithHalfPi();
      var s100 = news.bounds[10] - news.bounds[0];
      var s111 = news.bounds[11] - news.bounds[1]; 
      news.scale(tile.bounds[0],tile.bounds[1], 1/phi);
      news.rotate(tile.bounds[0],tile.bounds[1], Math.PI/2);
      news.shift(s100,s111);
      newtiles.push(news);

      // new eight
      var newe = tile.myclone();
      newe.six2eight();
      newe.id.push('e');
      newe.scale(tile.bounds[0], tile.bounds[1], 1/phi);
      newtiles.push(newe);
      // done
      return newtiles;
      break;

    //
    // -------------------------------
    // eight substitution -> 3 six , 1 ten
    // -------------------------------
    //
    case 'eight0':
    case 'eight90':
    case 'eight180':
    case 'eight270':
      var newtiles = [];

      // new six (right one)
      var news0 = tile.myclone();
      news0.eight2six();
      news0.id.push('s0');
      news0.scale(tile.bounds[0],tile.bounds[1], 1/phi);
      var s100 = news0.bounds[10] - news0.bounds[0];
      var s111 = news0.bounds[11] - news0.bounds[1];
      news0.shift(tile.bounds[14] - tile.bounds[0] - s100, tile.bounds[15] - tile.bounds[1] - s111);
      newtiles.push(news0);

      // new six (left one)
      var news1 = tile.myclone();
      news1.eight2six();
      news1.six2sixWith3HalfPi();
      news1.id.push('s1');
      news1.scale(tile.bounds[0],tile.bounds[1], 1/phi);
      news1.rotate(tile.bounds[0],tile.bounds[1], -Math.PI/2);
      news1.shift(tile.bounds[2] - tile.bounds[0], tile.bounds[3] - tile.bounds[1]);
      newtiles.push(news1);

      // new six (upper one)
      var news2 = tile.myclone();
      news2.eight2six();
      news2.six2sixWithHalfPi();
      news2.id.push('s2');
      news2.scale(tile.bounds[0],tile.bounds[1], 1/phi);
      news2.rotate(tile.bounds[0],tile.bounds[1], Math.PI/2);
      news2.shift(tile.bounds[10] - tile.bounds[0], tile.bounds[11] - tile.bounds[1]);
      newtiles.push(news2);

      // new ten
      var newt = tile.myclone();
      newt.eight2ten();
      newt.id.push('t');
      newt.scale(tile.bounds[0], tile.bounds[1], 1/phi);
      newt.rotate(tile.bounds[0], tile.bounds[1], Math.PI);
      newt.shift(news2.bounds[4] - tile.bounds[0], news2.bounds[5] - tile.bounds[1]);
      newtiles.push(newt);

      // done
      return newtiles;
      break;

    case 'ten0':
    case 'ten90':
    case 'ten180':
    case 'ten270':
      //
      // -------------------------------
      // ten substitution -> 2 six , 1 ten
      // -------------------------------
      //
      var newtiles = [];

      // new six (right one)
      var news0 = tile.myclone();
      news0.ten2six();
      news0.id.push('s0');
      news0.scale(tile.bounds[0],tile.bounds[1], 1/phi);
      var s100 = news0.bounds[10] - news0.bounds[0];
      var s111 = news0.bounds[11] - news0.bounds[1];
      news0.shift(tile.bounds[18] - tile.bounds[0] - s100, tile.bounds[19] - tile.bounds[1] - s111);
      newtiles.push(news0);

      // new six (upper one)
      var news1 = tile.myclone();
      news1.ten2six();
      news1.six2sixWithHalfPi();
      news1.id.push('s1');
      news1.scale(tile.bounds[0],tile.bounds[1], 1/phi);
      news1.rotate(tile.bounds[0],tile.bounds[1], Math.PI/2);
      news1.shift(tile.bounds[14] - tile.bounds[0], tile.bounds[15] - tile.bounds[1]);
      newtiles.push(news1);

      // new ten
      var newt = tile.myclone();
      newt.ten2ten();
      newt.id.push('t');
      newt.scale(tile.bounds[0], tile.bounds[1], 1/phi);
      newt.rotate(tile.bounds[0], tile.bounds[1], Math.PI);
      newt.shift(news1.bounds[4] - tile.bounds[0], news1.bounds[5] - tile.bounds[1]);
      newtiles.push(newt);

      // done
      return newtiles;
      break;

    default:
      // all tiles should be six, eight or ten
      console.log("caution: undefined tile type for substitutionA3, id="+tile.id);
  }
}

//
// [3] no duplicated tiles
// [4] I'm lazy
//

//
// [6] use default neighbors2bounds
//
var neighbors2boundsA3 = new Map();
neighbors2boundsA3.set('six0',default_neighbors2bounds(6));
neighbors2boundsA3.set('six90',default_neighbors2bounds(6));
neighbors2boundsA3.set('six180',default_neighbors2bounds(6));
neighbors2boundsA3.set('six270',default_neighbors2bounds(6));
neighbors2boundsA3.set('eight0',default_neighbors2bounds(8));
neighbors2boundsA3.set('eight90',default_neighbors2bounds(8));
neighbors2boundsA3.set('eight180',default_neighbors2bounds(8));
neighbors2boundsA3.set('eight270',default_neighbors2bounds(8));
neighbors2boundsA3.set('ten0',default_neighbors2bounds(10));
neighbors2boundsA3.set('ten90',default_neighbors2bounds(10));
neighbors2boundsA3.set('ten180',default_neighbors2bounds(10));
neighbors2boundsA3.set('ten270',default_neighbors2bounds(10));

//
// [7] construct base tilings and call substitute
//

// prepare decoration
decorateA3 = new Map();
decorateA3.set('six0',0);
decorateA3.set('six90',0);
decorateA3.set('six180',0);
decorateA3.set('six270',0);
decorateA3.set('eight0',1);
decorateA3.set('eight90',1);
decorateA3.set('eight180',1);
decorateA3.set('eight270',1);
decorateA3.set('ten0',2);
decorateA3.set('ten90',2);
decorateA3.set('ten180',2);
decorateA3.set('ten270',2);

//
// [7.1] construct "Ammann A3 by subst" tiling by substitution
// 
Tiling.A3bysubst = function({iterations}={}){
  var tiles = [];
  var mySix0 = six0.myclone();
  var mySix90 = six90.myclone();
  var mySix180 = six180.myclone();
  var mySix270 = six270.myclone();
  tiles.push(mySix0/*, mySix90, mySix180, mySix270*/);
  var myEight0 = eight0.myclone();
  var myEight90 = eight90.myclone();
  var myEight180 = eight180.myclone();
  var myEight270 = eight270.myclone();
  //tiles.push(myEight0, myEight90, myEight180, myEight270);
  var myTen0 = ten0.myclone();
  var myTen90 = ten90.myclone();
  var myTen180 = ten180.myclone();
  var myTen270 = ten270.myclone();
  //tiles.push(myTen0, myTen90, myTen180, myTen270);

  // call the substitution
  tiles = substitute(
    iterations,
    tiles,
    phi,
    substitutionA3,
    [], // no duplicated tiles
    [], // no duplicated tiles
    "I am lazy", // myneighbors
    neighbors2boundsA3,
    decorateA3
  );
  // construct tiling
  return new Tiling(tiles);
}
