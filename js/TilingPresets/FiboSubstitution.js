let phi_fibo = (1 + Math.sqrt(5))/2

var bounds = [];
bounds.push(0,0);
bounds.push(0,1);
bounds.push(1,1);
bounds.push(1,0);
var sqsf = new Tile(['sqsf'],[],bounds,4);

var bounds = [];
bounds.push(0,0);
bounds.push(0,phi_fibo);
bounds.push(phi_fibo,phi_fibo);
bounds.push(phi_fibo,0);
var sqbf = new Tile(['sqbf'],[],bounds,4);

var bounds = [];
bounds.push(0,0);
bounds.push(-1,0);
bounds.push(-1,phi_fibo);
bounds.push(0,phi_fibo);
var reclf = new Tile(['reclf'],[],bounds,4);

var bounds = [];
bounds.push(0,0);
bounds.push(0,phi_fibo);
bounds.push(1,phi_fibo);
bounds.push(1,0);
var recrf = new Tile(['recrf'],[],bounds,4);

Tile.prototype.sqrs2b = function(){
  this.id[0] = 'sqbf';
}

Tile.prototype.sqrb2s = function(){
  this.id[0] = 'sqsf';
}

Tile.prototype.rectswitch = function(){
  switch(this.id[0]){
    case 'reclf':
      this.id[0] = 'recrf';
      var vx = [];
      vx.push(this.bounds[2]-this.bounds[0]);
      vx.push(this.bounds[3]-this.bounds[1]);
      var b67 = shiftPoint(this.bounds[0],this.bounds[1], -vx[0], -vx[1]);
      var b45 = shiftPoint(this.bounds[6],this.bounds[7], -vx[0], -vx[1]);
      this.bounds[2] = this.bounds[6];
      this.bounds[3] = this.bounds[7];
      this.bounds[6] = b67[0];
      this.bounds[7] = b67[1];
      this.bounds[4] = b45[0];
      this.bounds[5] = b45[1];
      break;
    case 'recrf':
      this.id[0] = 'reclf';
      var vx = [];
      vx.push(this.bounds[6]-this.bounds[0]);
      vx.push(this.bounds[7]-this.bounds[1]);
      var b45 = shiftPoint(this.bounds[2],this.bounds[3], -vx[0], -vx[1]);
      var b23 = shiftPoint(this.bounds[0],this.bounds[1], -vx[0], -vx[1]);
      this.bounds[6] = this.bounds[2];
      this.bounds[7] = this.bounds[3]
      this.bounds[4] = b45[0];
      this.bounds[5] = b45[1];
      this.bounds[2] = b23[0];
      this.bounds[3] = b23[1];
      break;
    default:
      console.log('Transfo non prévue (rectswitch)');
  }
}

Tile.prototype.square2rect = function(left){
  switch(this.id[0]){
    case 'sqsf':
      var vy = [];
      vy.push(this.bounds[2]-this.bounds[0]);
      vy.push(this.bounds[3]-this.bounds[1]);
      b2b3 = shiftPoint(this.bounds[0],this.bounds[1],phi_fibo*vy[0], phi_fibo*vy[1]);
      b4b5 = shiftPoint(this.bounds[6],this.bounds[7],phi_fibo*vy[0], phi_fibo*vy[1]);
      this.bounds[2] = b2b3[0];
      this.bounds[3] = b2b3[1];
      this.bounds[4] = b4b5[0];
      this.bounds[5] = b4b5[1];
      break;
    case 'sqbf':
      var vx = [];
      vx.push(this.bounds[6]-this.bounds[0]);
      vx.push(this.bounds[7]-this.bounds[1]);
      b4b5 = shiftPoint(this.bounds[2],this.bounds[3],vx[0]/phi_fibo,vx[1]/phi_fibo);
      b6b7 = shiftPoint(this.bounds[0],this.bounds[1],vx[0]/phi_fibo,vx[1]/phi_fibo);
      this.bounds[4] = b4b5[0];
      this.bounds[5] = b4b5[1];
      this.bounds[6] = b6b7[0];
      this.bounds[7] = b6b7[1];
      break;
    default:
      console.log('Transfo non prévue (sqr2rct)');
  }
  this.id[0] = 'recrf';
  if (left){
    this.rectswitch();
  }
}

Tile.prototype.rect2sqr = function(){
  switch(this.id[0]){
    case 'recrf':
      var vx = [];
      vx.push(this.bounds[6]-this.bounds[0]);
      vx.push(this.bounds[7]-this.bounds[1]);
      b4b5 = shiftPoint(this.bounds[2],this.bounds[3],vx[0]*phi_fibo,vx[1]*phi_fibo);
      b6b7 = shiftPoint(this.bounds[0],this.bounds[1],vx[0]*phi_fibo,vx[1]*phi_fibo);
      this.bounds[4] = b4b5[0];
      this.bounds[5] = b4b5[1];
      this.bounds[6] = b6b7[0];
      this.bounds[7] = b6b7[1];
      break;
    case 'reclf':
      var vx = [];
      vx.push(this.bounds[2]-this.bounds[0]);
      vx.push(this.bounds[3]-this.bounds[1]);
      b4b5 = shiftPoint(this.bounds[6],this.bounds[7],vx[0]*phi_fibo,vx[1]*phi_fibo);
      b2b3 = shiftPoint(this.bounds[0],this.bounds[1],vx[0]*phi_fibo,vx[1]*phi_fibo);
      this.bounds[4] = b4b5[0];
      this.bounds[5] = b4b5[1];
      this.bounds[2] = b2b3[0];
      this.bounds[3] = b2b3[1];
      break;
  }
  this.id[0] = 'sqbf';


}

function substitutionFibo(tile){
  switch(tile.id[0]){
    case 'sqsf':
      var newtiles = [];

      var newsq = tile.myclone();
      newsq.sqrs2b();
      newsq.id.push('sqbf1');

      newtiles.push(newsq);
      return newtiles;
      break;
    case 'sqbf':
      var newtiles = [];

      var newsqb = tile.myclone();
      newsqb.id.push('sqbf1');
      newsqb.scale(newsqb.bounds[0],newsqb.bounds[1],1/phi_fibo);
      newtiles.push(newsqb);

      var newsqs = tile.myclone();
      newsqs.id.push('sqsf1');
      newsqs.sqrb2s();
      newsqs.scale(newsqs.bounds[4],newsqs.bounds[5],1/(phi_fibo+1));
      newtiles.push(newsqs);

      var newrctl = tile.myclone();
      newrctl.id.push('reclf1');
      newrctl.square2rect(true);
      newrctl.scale(newrctl.bounds[0],newrctl.bounds[1],1/phi_fibo);
      newrctl.shift(newrctl.bounds[6]-newrctl.bounds[0],newrctl.bounds[7]-newrctl.bounds[1]);
      newrctl.rotate(newrctl.bounds[0],newrctl.bounds[1],-Math.PI/2);
      newtiles.push(newrctl);

      var newrctr = tile.myclone();
      newrctr.id.push('recrf1');
      newrctr.square2rect(false);
      newrctr.shift((newrctr.bounds[6]-newrctr.bounds[0])*(phi_fibo-1),(newrctr.bounds[7]-newrctr.bounds[1])*(phi_fibo-1));
      newrctr.scale(newrctr.bounds[6],newrctr.bounds[7],1/phi_fibo);
      newtiles.push(newrctr);

      return newtiles;
      break;

    case 'reclf':
      var newtiles = [];

      var newsqr = tile.myclone();
      newsqr.id.push('sqbf1');
      newsqr.rect2sqr();
      newsqr.scale(newsqr.bounds[0],newsqr.bounds[1],1/phi_fibo);
      newtiles.push(newsqr);

      var newrecr = tile.myclone();
      newrecr.id.push('recrf1');
      newrecr.rectswitch();
      newrecr.scale(newrecr.bounds[0],newrecr.bounds[1],1/phi_fibo);
      newrecr.shift(newrecr.bounds[2]-newrecr.bounds[0],newrecr.bounds[3]-newrecr.bounds[1]);
      newrecr.rotate(newrecr.bounds[0],newrecr.bounds[1],Math.PI/2);
      newtiles.push(newrecr);

      return newtiles;
      break;

    case 'recrf':
      var newtiles = [];

      var newsqr = tile.myclone();
      newsqr.id.push('sqbf1');
      newsqr.rect2sqr();
      newsqr.scale(newsqr.bounds[0],newsqr.bounds[1],1/phi_fibo);
      newtiles.push(newsqr);

      var newrecl = tile.myclone();
      newrecl.id.push('reclf1');
      newrecl.rectswitch();
      newrecl.scale(newrecl.bounds[0],newrecl.bounds[1],1/phi_fibo);
      newrecl.shift(newrecl.bounds[6]-newrecl.bounds[0],newrecl.bounds[7]-newrecl.bounds[1]);
      newrecl.rotate(newrecl.bounds[0],newrecl.bounds[1],-Math.PI/2);
      newtiles.push(newrecl);

      return newtiles;
      break;
    default:
      console.log('Substitution non prévue');
    }
}

var neighbors2boundsFibo = new Map();
neighbors2boundsFibo.set('sqsf',default_neighbors2bounds(4));
neighbors2boundsFibo.set('sqbf',default_neighbors2bounds(4));
neighbors2boundsFibo.set('reclf',default_neighbors2bounds(4));
neighbors2boundsFibo.set('recrf',default_neighbors2bounds(4));

var decorateFibo = new Map();
decorateFibo.set('sqsf',0);
decorateFibo.set('sqbf',1);
decorateFibo.set('reclf',2);
decorateFibo.set('recrf',2);

Tiling.FiboSubstitution = function({iterations}={}){
  var tiles = [];
  var mytile = sqsf.myclone();
  tiles.push(mytile);

  tiles = substitute(
    iterations,
    tiles,
    phi_fibo,
    substitutionFibo,
    [],
    [],
    "I am lazy",
    neighbors2boundsFibo,
    decorateFibo
  );
  return new Tiling(tiles);
}
