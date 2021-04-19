
var bounds = [];
bounds.push(0,0);
bounds.push(0,1);
bounds.push(1,1);
bounds.push(1,0);
var sqr = new Tile(['sqr'],[],bounds,4);

var bounds = [];
bounds.push(0,0);
bounds.push(0,1);
bounds.push(1,0);
var tri = new Tile(['tri'],[],bounds,3);

var bounds = [];
bounds.push(0,0);
bounds.push(-1,1);
bounds.push(-1,2);
bounds.push(0,1);
var lol = new Tile(['lol'],[],bounds,4);

var bounds = [];
bounds.push(0,0);
bounds.push(0,1);
bounds.push(1,2);
bounds.push(1,1);
var lor = new Tile(['lor'],[],bounds,4);

Tile.prototype.tri2sqr = function(){
    this.id[0] = 'sqr';
    var vx = [];
    var vy = [];
    vx.push(this.bounds[4]-this.bounds[0],this.bounds[5]-this.bounds[1]);
    vy.push(this.bounds[2]-this.bounds[0],this.bounds[3]-this.bounds[1]);
    var newbounds = [];
    newbounds.push(this.bounds[0],this.bounds[1],this.bounds[2],this.bounds[3]);
    newbounds.push(this.bounds[0]+vx[0]+vy[0],this.bounds[1]+vx[1]+vy[1]);
    newbounds.push(this.bounds[4],this.bounds[5]);
    this.bounds = newbounds;
};

Tile.prototype.tile2tri = function(){
    switch(this.id[0]){
        case 'sqr':
            this.id[0] = 'tri';
            this.bounds.splice(4,2);
            break;
        case 'lol':
            this.id[0] = 'tri';
            var vx = [];
            var vy = [];
            vx.push(this.bounds[6]-this.bounds[2],this.bounds[7]-this.bounds[3]);
            vy.push(this.bounds[6]-this.bounds[0],this.bounds[7]-this.bounds[1]);

            var newbounds = [];
            newbounds.push(this.bounds[0],this.bounds[1]);
            newbounds.push(this.bounds[0]+vy[0],this.bounds[1]+vy[1]);
            newbounds.push(this.bounds[0]+vx[0],this.bounds[1]+vx[1]);
            this.bounds = newbounds;
            break;
        case 'lor':
            this.id[0] = 'tri';
            var vx = [];
            var vy = [];
            vx.push(this.bounds[6]-this.bounds[2],this.bounds[7]-this.bounds[3]);
            vy.push(this.bounds[2]-this.bounds[0],this.bounds[3]-this.bounds[1]);

            var newbounds = [];
            newbounds.push(this.bounds[0],this.bounds[1]);
            newbounds.push(this.bounds[0]+vy[0],this.bounds[1]+vy[1]);
            newbounds.push(this.bounds[0]+vx[0],this.bounds[1]+vx[1]);
            this.bounds = newbounds;
            break;
        default:
            console.log('Transformation non prévue (tile2tri)');
    }

};

Tile.prototype.sqr2lol = function() {
    this.id[0] = 'lol';
    var vx = [];
    var vy = [];
    vx.push(this.bounds[6]-this.bounds[0],this.bounds[7]-this.bounds[1]);
    vy.push(this.bounds[2]-this.bounds[0],this.bounds[3]-this.bounds[1]);

    var newbounds = [];
    b0 = this.bounds[0];
    b1 = this.bounds[1];

    newbounds.push(b0,b1);
    newbounds.push(b0-vx[0]+vy[0],b1-vx[1]+vy[1]);
    newbounds.push(b0-vx[0]+2*vy[0],b1-vx[1]+2*vy[1]);
    newbounds.push(b0+vy[0],b1+vy[1]);
    this.bounds = newbounds;
};

Tile.prototype.sqr2lor = function() {
    this.id[0] = 'lor';
    var vx = [];
    var vy = [];
    vx.push(this.bounds[6]-this.bounds[0],this.bounds[7]-this.bounds[1]);
    vy.push(this.bounds[2]-this.bounds[0],this.bounds[3]-this.bounds[1]);

    var newbounds = [];
    b0 = this.bounds[0];
    b1 = this.bounds[1];

    newbounds.push(b0,b1);
    newbounds.push(b0+vy[0],b1+vy[1]);
    newbounds.push(b0+2*vy[0]+vx[0],b1+2*vy[1]+vx[1]);
    newbounds.push(b0+vy[0]+vx[0],b1+vy[1]+vx[1]);
    this.bounds = newbounds;
};


function substitutionTangram(tile){


  switch(tile.id[0]){


    case 'sqr':
    var newtiles = [];

        var newsqr = tile.myclone();

        newsqr.id.push('sqr');
        newsqr.scale(newsqr.bounds[4], newsqr.bounds[5],1/2);
        newtiles.push(newsqr);

        var newtrih = tile.myclone();
        newtrih.tile2tri();

        newtrih.id.push('trih');
        newtrih.rotate((newtrih.bounds[4]+newtrih.bounds[2])/2,(newtrih.bounds[5]+newtrih.bounds[3])/2,Math.PI/2);
        newtrih.scale(newtrih.bounds[0], newtrih.bounds[1],1/2);
        newtiles.push(newtrih);

        var newtrib = tile.myclone();
        newtrib.tile2tri();
        newtrib.id.push('trib');
        newtrib.rotate((newtrib.bounds[4]+newtrib.bounds[2])/2,(newtrib.bounds[5]+newtrib.bounds[3])/2,-Math.PI/2);
        newtrib.scale(newtrib.bounds[0], newtrib.bounds[1],1/2);
        newtiles.push(newtrib);


        var newlol = tile.myclone();
        newlol.sqr2lol();
        newlol.id.push('lol');

        newlol.rotate(newlol.bounds[0],newlol.bounds[1],-Math.PI/2);
        newlol.scale(newlol.bounds[0], newlol.bounds[1],1/2);
        newtiles.push(newlol);


        var newlor = tile.myclone();
        newlor.sqr2lor();
        newlor.id.push('lor');
        newlor.scale(newlor.bounds[0], newlor.bounds[1],1/2);
        newtiles.push(newlor);
        return newtiles;

        break;

    case 'tri':
    var newtiles = [];

        var newsqr = tile.myclone();
        newsqr.tri2sqr();

        newsqr.id.push('sqr');
        newsqr.scale(newsqr.bounds[0], newsqr.bounds[1],1/2);
        newtiles.push(newsqr);

        var newtrih = tile.myclone();
        newtrih.id.push('trih');
        newtrih.scale(newtrih.bounds[2], newtrih.bounds[3],1/2);
        newtiles.push(newtrih);

        var newtrid = tile.myclone();
        newtrid.id.push('trid');
        newtrid.scale(newtrid.bounds[4], newtrid.bounds[5],1/2);
        newtiles.push(newtrid);

        return newtiles;

        break;

    case 'lol':

    var newtiles = [];

        var newlolh = tile.myclone();

        newlolh.id.push('lolh');
        newlolh.scale(newlolh.bounds[4], newlolh.bounds[5],1/2);
        newtiles.push(newlolh);

        var newlolb = tile.myclone();

        newlolb.id.push('lolb');
        newlolb.scale(newlolb.bounds[0], newlolb.bounds[1],1/2);
        newtiles.push(newlolb);

        var newtrih1 = tile.myclone();
        newtrih1.id.push('trih1');
        newtrih1.tile2tri();
        newtrih1.shift(newtrih1.bounds[2]-newtrih1.bounds[4],newtrih1.bounds[3]-newtrih1.bounds[5]);
        newtrih1.scale(newtrih1.bounds[0], newtrih1.bounds[1],1/2);
        newtiles.push(newtrih1);

        var newtrih2 = tile.myclone();
        newtrih2.id.push('trih2');
        newtrih2.tile2tri();

        newtrih2.shift(newtrih2.bounds[2]-newtrih2.bounds[4],newtrih2.bounds[3]-newtrih2.bounds[5]);
        newtrih2.scale(newtrih2.bounds[4], newtrih2.bounds[5],1/2);
        newtiles.push(newtrih2);

        var newtrib1 = tile.myclone();
        newtrib1.id.push('trib1');
        newtrib1.tile2tri();

        newtrib1.rotate((newtrib1.bounds[0]+newtrib1.bounds[2])/2,(newtrib1.bounds[1]+newtrib1.bounds[3])/2,Math.PI);
      newtrib1.scale(newtrib1.bounds[4], newtrib1.bounds[5],1/2);
      newtiles.push(newtrib1);

        var newtrib2 = tile.myclone();
      newtrib2.id.push('trib2');
            newtrib2.tile2tri();

      newtrib2.rotate((newtrib2.bounds[0]+newtrib2.bounds[2])/2,(newtrib2.bounds[1]+newtrib2.bounds[3])/2,Math.PI);
      newtrib2.scale(newtrib2.bounds[0], newtrib2.bounds[1],1/2);
      newtiles.push(newtrib2);
      return newtiles;

      break;


       case 'lor':

       var newtiles = [];

       var newlorh = tile.myclone();

        newlorh.id.push('lorh');
      newlorh.scale(newlorh.bounds[4], newlorh.bounds[5],1/2);
      newtiles.push(newlorh);

       var newlorb = tile.myclone();

        newlorb.id.push('lorb');
      newlorb.scale(newlorb.bounds[0], newlorb.bounds[1],1/2);
      newtiles.push(newlorb);


      var newtrih1 = tile.myclone();
      newtrih1.id.push('trih1');
                  newtrih1.tile2tri();

      newtrih1.rotate(newtrih1.bounds[2],newtrih1.bounds[3],Math.PI/2);
      newtrih1.scale(newtrih1.bounds[2], newtrih1.bounds[3],1/2);
      newtiles.push(newtrih1);

      var newtrih2 = tile.myclone();
      newtrih2.id.push('trih2');
                  newtrih2.tile2tri();

      newtrih2.rotate(newtrih2.bounds[2],newtrih2.bounds[3],Math.PI/2);
      newtrih2.scale(newtrih2.bounds[0], newtrih2.bounds[1],1/2);
      newtiles.push(newtrih2);

      var newtrib1 = tile.myclone();
      newtrib1.id.push('trib1');
      newtrib1.tile2tri();

      newtrib1.rotate((newtrib1.bounds[4]+newtrib1.bounds[2])/2,(newtrib1.bounds[5]+newtrib1.bounds[3])/2,-Math.PI/2);
      newtrib1.scale(newtrib1.bounds[0], newtrib1.bounds[1],1/2);
      newtiles.push(newtrib1);

        var newtrib2 = tile.myclone();
      newtrib2.id.push('trib2');
                  newtrib2.tile2tri();

      newtrib2.rotate((newtrib2.bounds[4]+newtrib2.bounds[2])/2,(newtrib2.bounds[5]+newtrib2.bounds[3])/2,-Math.PI/2);
      newtrib2.scale(newtrib2.bounds[2], newtrib2.bounds[3],1/2);
      newtiles.push(newtrib2);
      return newtiles;

      break;

  }
}


        var neighbors2boundsTangram = new Map();
neighbors2boundsTangram.set('sqr',default_neighbors2bounds(4));
neighbors2boundsTangram.set('tri',default_neighbors2bounds(3));
neighbors2boundsTangram.set('lol',default_neighbors2bounds(4));
neighbors2boundsTangram.set('lor',default_neighbors2bounds(4));

decorateTangram = new Map();
decorateTangram.set('sqr',0);
decorateTangram.set('tri',1);
decorateTangram.set('lol',2);
decorateTangram.set('lor',2);


Tiling.TangramSubstitution = function({iterations}={}){
  var tiles = [];
  var mysqr = sqr.myclone();
  tiles.push(mysqr);

  tiles = substitute(
    iterations,
    tiles,
    2,
    substitutionTangram,
    [],
    [],
    "I am lazy",
    neighbors2boundsTangram,
    decorateTangram

  );
  return new Tiling(tiles);
}
