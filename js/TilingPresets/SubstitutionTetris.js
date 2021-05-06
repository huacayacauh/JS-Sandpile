

var bounds = [];
bounds.push(0,0);
bounds.push(0,2);
bounds.push(2,2);
bounds.push(2,0);
var o = new Tile(['o'],[],bounds,8);

var bounds = [];
bounds.push(0,0);
bounds.push(0,4);
bounds.push(1,4);
bounds.push(1,0);
var i = new Tile(['i'],[],bounds,8);

var bounds = [];
bounds.push(0,0);
bounds.push(0,1);
bounds.push(1,1);
bounds.push(1,2);
bounds.push(2,2);
bounds.push(2,1);
bounds.push(3,1);
bounds.push(3,0);
var t = new Tile(['t'],[],bounds,8);

var bounds = [];
bounds.push(0,0);
bounds.push(0,1);
bounds.push(-1,1);
bounds.push(-1,2);
bounds.push(1,2);
bounds.push(1,1);
bounds.push(2,1);
bounds.push(2,0);
var z = new Tile(['z'],[],bounds,8);

var bounds = [];
bounds.push(0,0);
bounds.push(0,3);
bounds.push(2,3);
bounds.push(2,2);
bounds.push(1,2);
bounds.push(1,0);
var j = new Tile(['j'],[],bounds,8);

var bounds = [];
bounds.push(0,0);
bounds.push(0,2);
bounds.push(-1,2);
bounds.push(-1,3);
bounds.push(1,3);
bounds.push(1,0);
var l = new Tile(['l'],[],bounds,8);

Tile.prototype.tile2l = function(){
  switch(this.id[0]){
    case 'o':
      var vx = [];
      vx.push((this.bounds[6]-this.bounds[0])/2,(this.bounds[7]-this.bounds[1])/2);
      var vy = [];
      vy.push((this.bounds[2]-this.bounds[0])/2,(this.bounds[3]-this.bounds[1])/2);
      break;
    case 'i':
      var vx = [];
      vx.push(this.bounds[6]-this.bounds[0],this.bounds[7]-this.bounds[1]);
      var vy = [];
      vy.push((this.bounds[2]-this.bounds[0])/4,(this.bounds[3]-this.bounds[1])/4);
      break;
    case 't':
      var vx = [];
      vx.push(this.bounds[4]-this.bounds[2],this.bounds[5]-this.bounds[3]);
      var vy = [];
      vy.push(this.bounds[2]-this.bounds[0],this.bounds[3]-this.bounds[1]);
      break;
    default:
      console.log('Transformation non prevue (tile2l)');
  }
  this.id[0]='l';
  var newbounds = [];
  var b0 = this.bounds[0];
  var b1 = this.bounds[1];
  newbounds.push(b0,b1);
  var b2b3 = shiftPoint(b0,b1,2*vy[0],2*vy[1]);
  newbounds.push(b2b3[0],b2b3[1]);
  var b4b5 = shiftPoint(b2b3[0],b2b3[1],-vx[0],-vx[1]);
  newbounds.push(b4b5[0],b4b5[1]);
  var b6b7 = shiftPoint(b4b5[0],b4b5[1],vy[0],vy[1]);
  newbounds.push(b6b7[0],b6b7[1]);
  var b8b9 = shiftPoint(b6b7[0],b6b7[1],2*vx[0],2*vx[1]);
  newbounds.push(b8b9[0],b8b9[1]);
  var b10b11 = shiftPoint(b0,b1,vx[0],vx[1]);
  newbounds.push(b10b11[0],b10b11[1]);
  this.bounds = newbounds;
}

Tile.prototype.tile2t = function(){
  switch(this.id[0]){
    case 'o':
      var vx = [];
      vx.push((this.bounds[6]-this.bounds[0])/2,(this.bounds[7]-this.bounds[1])/2);
      var vy = [];
      vy.push((this.bounds[2]-this.bounds[0])/2,(this.bounds[3]-this.bounds[1])/2);
      break;
    default:
      console.log('Transformation non prevue (tile2t)');
  }
  this.id[0]='t';
  var newbounds = [];
  var b0 = this.bounds[0];
  var b1 = this.bounds[1];
	newbounds.push(b0,b1);
	var b23 = shiftPoint(b0,b1,vy[0],vy[1]);
	newbounds.push(b23[0],b23[1]);
	var b45 = shiftPoint(b23[0],b23[1],vx[0],vx[1]);
	newbounds.push(b45[0],b45[1]);
	var b67 = shiftPoint(b45[0],b45[1],vy[0],vy[1]);
	newbounds.push(b67[0],b67[1]);
  var b89 = shiftPoint(b67[0],b67[1],vx[0],vx[1])
	newbounds.push(b89[0],b89[1]);
	var b1011 = shiftPoint(b89[0],b89[1],-vy[0],-vy[1]);
	newbounds.push(b1011[0],b1011[1]);
	var b1213 = shiftPoint(b1011[0],b1011[1],vx[0],vx[1]);
	newbounds.push(b1213[0],b1213[1]);
	var b1415 = shiftPoint(b1213[0],b1213[1],-vy[0],-vy[1]);
	newbounds.push(b1415[0],b1415[1]);
	this.bounds = newbounds;
}

Tile.prototype.tile2z = function(){
  switch(this.id[0]){
    case 'o':
      var vx = [];
      vx.push((this.bounds[6]-this.bounds[0])/2,(this.bounds[7]-this.bounds[1])/2);
      var vy = [];
      vy.push((this.bounds[2]-this.bounds[0])/2,(this.bounds[3]-this.bounds[1])/2);
      break;
    default:
      console.log('Transformation non prevue (tile2z)');
  }
  this.id[0]='z';
  var newbounds = [];
  var b0 = this.bounds[0];
  var b1 = this.bounds[1];
  newbounds.push(b0,b1);
  var b23 = shiftPoint(b0,b1,vy[0],vy[1]);
	newbounds.push(b23[0],b23[1]);
	var b45 = shiftPoint(b23[0],b23[1],-vx[0],-vx[1]);
	newbounds.push(b45[0],b45[1]);
	var b67 = shiftPoint(b45[0],b45[1],vy[0],vy[1]);
	newbounds.push(b67[0],b67[1]);
	var b89 = shiftPoint(b67[0],b67[1],2*vx[0],2*vx[1]);
	newbounds.push(b89[0],b89[1]);
	var b1011 = shiftPoint(b89[0],b89[1],-vy[0],-vy[1]);
	newbounds.push(b1011[0],b1011[1]);
	var b1213 = shiftPoint(b1011[0],b1011[1],vx[0],vx[1]);
	newbounds.push(b1213[0],b1213[1]);
  var b1415 = shiftPoint(b1213[0],b1213[1],-vy[0],-vy[1]);
	newbounds.push(b1415[0],b1415[1]);
  this.bounds = newbounds;
}

Tile.prototype.tile2j = function(){
  switch(this.id[0]){
    case 'i':
      var vx = [];
      vx.push(this.bounds[6]-this.bounds[0],this.bounds[7]-this.bounds[1]);
      var vy = [];
      vy.push((this.bounds[2]-this.bounds[0])/4,(this.bounds[3]-this.bounds[1])/4);
      break;
    case 't':
      var vx = [];
      vx.push(this.bounds[4]-this.bounds[2],this.bounds[5]-this.bounds[3]);
      var vy = [];
      vy.push(this.bounds[2]-this.bounds[0],this.bounds[3]-this.bounds[1]);
      break;
    case 'z':
      var vx = [];
      vx.push(this.bounds[2]-this.bounds[4],this.bounds[3]-this.bounds[5]);
      var vy = [];
      vy.push(this.bounds[2]-this.bounds[0],this.bounds[3]-this.bounds[1]);
      break;
    default:
      console.log('Transformation non prevue (tile2j)');
  }
  this.id[0]='j';
  var newbounds = [];
  var b0 = this.bounds[0];
  var b1 = this.bounds[1];
  newbounds.push(b0,b1);
  var b2b3 = shiftPoint(b0,b1,3*vy[0],3*vy[1]);
  newbounds.push(b2b3[0],b2b3[1]);
  var b4b5 = shiftPoint(b2b3[0],b2b3[1],2*vx[0],2*vx[1]);
  newbounds.push(b4b5[0],b4b5[1]);
  var b6b7 = shiftPoint(b4b5[0],b4b5[1],-vy[0],-vy[1]);
  newbounds.push(b6b7[0],b6b7[1]);
  var b8b9 = shiftPoint(b6b7[0],b6b7[1],-vx[0],-vx[1]);
  newbounds.push(b8b9[0],b8b9[1]);
  var b10b11 = shiftPoint(b0,b1,vx[0],vx[1]);
  newbounds.push(b10b11[0],b10b11[1]);
  this.bounds = newbounds;
}

Tile.prototype.tile2o = function(){
  switch(this.id[0]){
    case 'i':
      var vx = [];
      vx.push(this.bounds[6]-this.bounds[0],this.bounds[7]-this.bounds[1]);
      var vy = [];
      vy.push((this.bounds[2]-this.bounds[0])/4,(this.bounds[3]-this.bounds[1])/4);
      break;
    case 'j':
      var vx = [];
      vx.push(this.bounds[10]-this.bounds[0],this.bounds[11]-this.bounds[1]);
      var vy = [];
      vy.push(this.bounds[4]-this.bounds[6],this.bounds[5]-this.bounds[7]);
      break;
    case 'l':
      var vx = [];
      vx.push(this.bounds[10]-this.bounds[0],this.bounds[11]-this.bounds[1]);
      var vy = [];
      vy.push(this.bounds[6]-this.bounds[4],this.bounds[7]-this.bounds[5]);
      break;
    case 't':
      var vx = [];
      vx.push(this.bounds[4]-this.bounds[2],this.bounds[5]-this.bounds[3]);
      var vy = [];
      vy.push(this.bounds[2]-this.bounds[0],this.bounds[3]-this.bounds[1]);
      break;
    case 'z':
      var vx = [];
      vx.push(this.bounds[2]-this.bounds[4],this.bounds[3]-this.bounds[5]);
      var vy = [];
      vy.push(this.bounds[2]-this.bounds[0],this.bounds[3]-this.bounds[1]);
      break;
    default:
      console.log('Transformation non prevue (tile2o)');
  }
  this.id[0]='o';
  var newbounds = [];
  var b0 = this.bounds[0];
  var b1 = this.bounds[1];
  newbounds.push(b0,b1);
  var b2b3 = shiftPoint(b0,b1,2*vy[0],2*vy[1]);
  newbounds.push(b2b3[0],b2b3[1]);
  var b4b5 = shiftPoint(b2b3[0],b2b3[1],2*vx[0],2*vx[1])
  newbounds.push(b4b5[0],b4b5[1]);
  var b6b7 = shiftPoint(b0,b1,2*vx[0],2*vx[1]);
  newbounds.push(b6b7[0],b6b7[1]);
  this.bounds = newbounds;
}

Tile.prototype.tile2i = function(){
  switch(this.id[0]){
    case 'l':
      var vx = [];
      vx.push(this.bounds[10]-this.bounds[0],this.bounds[11]-this.bounds[1]);
      var vy = [];
      vy.push(this.bounds[6]-this.bounds[4],this.bounds[7]-this.bounds[5]);
      break;
    case 'j':
      var vx = [];
      vx.push(this.bounds[10]-this.bounds[0],this.bounds[11]-this.bounds[1]);
      var vy = [];
      vy.push(this.bounds[4]-this.bounds[6],this.bounds[5]-this.bounds[7]);
      break;
    case 't':
      var vx = [];
      vx.push(this.bounds[4]-this.bounds[2],this.bounds[5]-this.bounds[3]);
      var vy = [];
      vy.push(this.bounds[2]-this.bounds[0],this.bounds[3]-this.bounds[1]);
      break;
    case 'z':
      var vx = [];
      vx.push(this.bounds[2]-this.bounds[4],this.bounds[3]-this.bounds[5]);
      var vy = [];
      vy.push(this.bounds[2]-this.bounds[0],this.bounds[3]-this.bounds[1]);
      break;
    default:
      console.log('Transformation non prevue (tile2i)');
  }

  this.id[0]='i';
  var newbounds = [];
  var b0 = this.bounds[0];
  var b1 = this.bounds[1];
  newbounds.push(b0,b1);
  var b2b3 = shiftPoint(b0,b1,4*vy[0],4*vy[1]);
  newbounds.push(b2b3[0],b2b3[1]);
  var b4b5 = shiftPoint(b2b3[0],b2b3[1],vx[0],vx[1])
  newbounds.push(b4b5[0],b4b5[1]);
  var b6b7 = shiftPoint(b0,b1,vx[0],vx[1]);
  newbounds.push(b6b7[0],b6b7[1]);

  this.bounds = newbounds;
}

function substitutionTetris(tile){
  switch(tile.id[0]){
    case 'i':
      var newtiles = [];

      var vx = [];
      vx.push((tile.bounds[6]-tile.bounds[0]),(tile.bounds[7]-tile.bounds[1]));
      var vy = [];
      vy.push((tile.bounds[2]-tile.bounds[0])/4,(tile.bounds[3]-tile.bounds[1])/4);

      var newl1 = tile.myclone();
      newl1.id.push('l1');
      newl1.tile2l();
      newl1.rotate(newl1.bounds[0]+(vx[0]/2)+vy[0]*(3/2),newl1.bounds[1]+(vx[1]/2)+vy[1]*(3/2),Math.PI);
      newl1.scale(newl1.bounds[8],newl1.bounds[9],1/2);
      newtiles.push(newl1);

      var newi1 = tile.myclone();
      newi1.id.push('i1');
      newi1.scale(newi1.bounds[6], newi1.bounds[7],1/2);
      newi1.shift(vy[0]/2,vy[1]/2);
      newtiles.push(newi1);

      var newj1 = tile.myclone();
      newj1.id.push('j1');
      newj1.tile2j();
      newj1.scale(newj1.bounds[2],newj1.bounds[3],1/2);
      newtiles.push(newj1);

      var newo1 = tile.myclone();
      newo1.id.push('o1');
      newo1.tile2o();
      newo1.shift(2*vy[0],2*vy[1]);
      newo1.scale(newo1.bounds[2], newo1.bounds[3],1/2);
      newtiles.push(newo1);

      return newtiles;
      break;

    case 't':
      var newtiles = [];
      var vx = [];
      vx.push(tile.bounds[4]-tile.bounds[2],tile.bounds[5]-tile.bounds[3]);
      var vy = [];
      vy.push(tile.bounds[2]-tile.bounds[0],tile.bounds[3]-tile.bounds[1]);
      var newo1 = tile.myclone();

      newo1.tile2o();
      newo1.id.push('o1');
      newo1.scale(newo1.bounds[4], newo1.bounds[5],1/2);
      newtiles.push(newo1);

      var newi1 = tile.myclone();
      newi1.tile2i();
      newi1.id.push('i1');
      newi1.scale(newi1.bounds[0], newi1.bounds[1],1/2);
      newi1.rotate(newi1.bounds[0]+vx[0]+vy[0]*3/2,newi1.bounds[1]+vx[1]+vy[1]*3/2,Math.PI/2)
      newtiles.push(newi1);

      var newj1 = tile.myclone();
      newj1.tile2j();
      newj1.id.push('j1');
      newj1.rotate(newj1.bounds[0]+vx[0]*3/2+vy[0]*3/2,newj1.bounds[1]+vx[1]*3/2+vy[1]*3/2,Math.PI/2)
      newj1.scale(newj1.bounds[2],newj1.bounds[3],1/2);
      newtiles.push(newj1);

      var newl1 = tile.myclone();
      newl1.tile2l();
      newl1.id.push('l1');
      newl1.rotate(newl1.bounds[0]+vx[0]/2+vy[0]/2,newl1.bounds[1]+vx[1]/2+vy[1]/2,-Math.PI/2)
      newl1.scale(newl1.bounds[8],newl1.bounds[9],1/2);
      newtiles.push(newl1);

      return newtiles;
      break;

    case 'o':
      var newtiles = [];

      var vx = [];
      vx.push((tile.bounds[6]-tile.bounds[0])/2,(tile.bounds[7]-tile.bounds[1])/2);
      var vy = [];
      vy.push((tile.bounds[2]-tile.bounds[0])/2,(tile.bounds[3]-tile.bounds[1])/2);

      var newl1 = tile.myclone();
      newl1.tile2l();
      newl1.id.push('l1');
      newl1.rotate(newl1.bounds[0]+(vx[0]/2)+vy[0]*(3/2),newl1.bounds[1]+(vx[1]/2)+vy[1]*(3/2),Math.PI);
      newl1.scale(newl1.bounds[8],newl1.bounds[9],1/2);
      newtiles.push(newl1);

      var newz1 = tile.myclone();
      newz1.tile2z();
      newz1.id.push('z1');
      newz1.scale(newz1.bounds[14], newz1.bounds[15],1/2);
      newtiles.push(newz1)

      var newt1 = tile.myclone();
      newt1.tile2t();
      newt1.id.push('t1');
      newt1.rotate(newt1.bounds[0]+(3/2)*vx[0]+vy[0],newt1.bounds[1]+(3/2)*vx[1]+vy[1],Math.PI);
      newt1.scale(newt1.bounds[14],newt1.bounds[15],1/2);
      newtiles.push(newt1);

      var newt2 = tile.myclone();
      newt2.tile2t();
      newt2.id.push('t2');
      newt2.rotate(newt2.bounds[0]+(3/2)*vx[0]+vy[0]/2,newt2.bounds[1]+(3/2)*vx[1]+vy[1]/2,Math.PI/2);
      newt2.scale(newt2.bounds[14],newt2.bounds[15],1/2);
      newtiles.push(newt2);

      return newtiles;
      break;

    case 'j':
      var newtiles = [];

      var vx = [];
      vx.push(tile.bounds[10]-tile.bounds[0],tile.bounds[11]-tile.bounds[1]);
      var vy = [];
      vy.push(tile.bounds[4]-tile.bounds[6],tile.bounds[5]-tile.bounds[7]);

      var newj1 = tile.myclone();
      newj1.id.push('j1');
      newj1.scale(newj1.bounds[8],newj1.bounds[9],1/2);
      newtiles.push(newj1);

      var newj2 = tile.myclone();
      newj2.id.push('j2');
      newj2.rotate(tile.bounds[8],tile.bounds[9],-Math.PI/2);
      newj2.scale(tile.bounds[4],tile.bounds[5],1/2);
      newtiles.push(newj2);

      var newi1 = tile.myclone();
      newi1.tile2i();
      newi1.id.push('i1');
      newi1.shift(-vy[0],-vy[1]);
      newi1.scale(newi1.bounds[2],newi1.bounds[3],1/2);
      newtiles.push(newi1);

      var newo1 = tile.myclone();
      newo1.tile2o();
      newo1.id.push('o1');
      newo1.scale(newo1.bounds[0],newo1.bounds[1],1/2);
      newtiles.push(newo1);

      return newtiles;
      break;

    case 'l':

      var newtiles = [];

      var vx = [];
      vx.push(tile.bounds[10]-tile.bounds[0],tile.bounds[11]-tile.bounds[1]);
      var vy = [];
      vy.push(tile.bounds[6]-tile.bounds[4],tile.bounds[7]-tile.bounds[5]);

      var newl1 = tile.myclone();
      newl1.id.push('l1');
      newl1.scale(newl1.bounds[2],newl1.bounds[3],1/2);
      newtiles.push(newl1);

      var newl2 = tile.myclone();
      newl2.id.push('l2');
      newl2.rotate(tile.bounds[2],tile.bounds[3],Math.PI/2);
      newl2.scale(tile.bounds[6],tile.bounds[7],1/2);

      newtiles.push(newl2);

      var newi1 = tile.myclone();
      newi1.tile2i();
      newi1.id.push('i1');
      newi1.shift(-vy[0],-vy[1]);
      newi1.scale(newi1.bounds[4],newi1.bounds[5],1/2);
      newtiles.push(newi1);

      var newo1 = tile.myclone();
      newo1.tile2o();
      newo1.id.push('o1');
      newo1.scale(newo1.bounds[0],newo1.bounds[1],1/2);
      newtiles.push(newo1);

      return newtiles;
      break;

    case 'z':
      var newtiles = [];

      var vx = [];
      vx.push(tile.bounds[2]-tile.bounds[4],tile.bounds[3]-tile.bounds[5]);
      var vy = [];
      vy.push(tile.bounds[2]-tile.bounds[0],tile.bounds[3]-tile.bounds[1]);

      var newj1 = tile.myclone();
      newj1.tile2j();
      newj1.id.push('j1');
      newj1.rotate(newj1.bounds[0]+vx[0]+(3/2)*vy[0],newj1.bounds[1]+vx[1]+(3/2)*vy[1],Math.PI);
      newj1.scale(newj1.bounds[4],newj1.bounds[5],1/2);
      newtiles.push(newj1);

      var newj2 = tile.myclone();
      newj2.tile2j();
      newj2.id.push('j2');
      newj2.rotate(newj2.bounds[0]+2*vy[0],newj2.bounds[1]+2*vy[1],-Math.PI/2);
      newj2.scale(newj2.bounds[8],newj2.bounds[9],1/2);
      newtiles.push(newj2);

      var newi1 = tile.myclone();
      newi1.tile2i();
      newi1.id.push('i1');
      newi1.scale(newi1.bounds[6],newi1.bounds[7],1/2);
      newi1.rotate(newi1.bounds[0]+vx[0]/4+(7/4)*vy[0],newi1.bounds[1]+vx[1]/4+(7/4)*vy[1],-Math.PI/2);
      newtiles.push(newi1);

      var newo1 = tile.myclone();
      newo1.tile2o();
      newo1.id.push('o1');
      newo1.scale(newo1.bounds[6],newo1.bounds[7],1/2);
      newtiles.push(newo1);

      return newtiles;
      break;

    default:
      console.log("caution: undefined tile type for substitutionTetris,id="+tile.id);
  }
}

var neighbors2boundsTetris = new Map();
neighbors2boundsTetris.set('o',default_neighbors2bounds(4));
neighbors2boundsTetris.set('i',default_neighbors2bounds(4));
neighbors2boundsTetris.set('j',default_neighbors2bounds(6));
neighbors2boundsTetris.set('l',default_neighbors2bounds(6));
neighbors2boundsTetris.set('t',default_neighbors2bounds(8));
neighbors2boundsTetris.set('z',default_neighbors2bounds(8));

Tiling.TetrisSubstitution = function({iterations}={}){
  var tiles = [];
  var mayo1 = o.myclone();
  mayo1.id.push('o1');
  tiles.push(mayo1);
  var mayo2 = o.myclone()
  mayo2.id.push('o2');
  mayo2.rotate(0, 0, Math.PI/2);
  tiles.push(mayo2);
  var mayo3 = o.myclone()
  mayo3.id.push('o3');
  mayo3.rotate(0, 0, Math.PI);
  tiles.push(mayo3);
  var mayo4 = o.myclone()
  mayo4.id.push('o4');
  mayo4.rotate(0, 0, -Math.PI/2);
  tiles.push(mayo4);
  tiles = substitute(
    iterations,
    tiles,
    2,
    substitutionTetris,
    [],
    [],
    "I am lazy",
    neighbors2boundsTetris
  );
  return new Tiling(tiles);
}
