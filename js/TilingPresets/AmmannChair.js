var phi = (1+Math.sqrt(5))/2;

//[1]

Tile.prototype.chair_red2white = function(){
  this.id[0]='white';
  this.scale(this.bounds[0],this.bounds[1],Math.sqrt(phi));
}
Tile.prototype.chair_white2red = function(){
  this.id[0]='red';
  this.scale(this.bounds[0],this.bounds[1],1/Math.sqrt(phi));
}

//tuile rouge ayant subie une rotation
Tile.prototype.chair_red90 = function(){
  this.id[0]='red90';
}

//tuile rouge reflechie
Tile.prototype.chair_redMiror = function(){
  this.id[0]='redMiror';
}

Tile.prototype.chair_redMiror90 = function(){
  this.id[0]='redMiror90';
}

Tile.prototype.chair_white90 = function(){
  this.id[0]='white90';
}

// tuile blanche ayant déjà subie une rotation a 90° redevient une tuile blanche classique après une rotation suplémentaire 
Tile.prototype.chair_90White = function(){
  this.id[0]='white';
}

Tile.prototype.chair_whiteMiror = function(){
  this.id[0]='whiteMiror';
}

Tile.prototype.chair_white90Miror = function(){
  this.id[0]='white90Miror';
}



//symetries par rapport aux axes x et y

Tile.prototype.rotateYlo = function(){
  const rmax = this.bounds[4]-this.bounds[2];
  const rmin = this.bounds[8]-this.bounds[6];
  this.bounds[0]=this.bounds[0]+rmax+rmin;
  this.bounds[2]=this.bounds[2]+rmax+rmin;
  this.bounds[4]=this.bounds[4]+rmin-rmax;
  this.bounds[6]=this.bounds[6]+rmin-rmax;
  this.bounds[8]=this.bounds[8]-rmax-rmin;
  this.bounds[10]=this.bounds[10]-rmax-rmin;
}

Tile.prototype.rotateYla = function(){
  const rmax = this.bounds[2]-this.bounds[0];
  const rmin = this.bounds[6]-this.bounds[4];
  this.bounds[0]=this.bounds[0]+rmax;
  this.bounds[2]=this.bounds[2]-rmax;
  this.bounds[4]=this.bounds[4]-rmax;
  this.bounds[6]=this.bounds[6]-rmax-2*rmin;
  this.bounds[8]=this.bounds[8]-rmax-2*rmin;
  this.bounds[10]=this.bounds[10]+rmax;
}

Tile.prototype.rotateX = function(){
  const rmax = this.bounds[3]-this.bounds[1];
  const rmin = this.bounds[9]-this.bounds[11];
  this.bounds[1]+=rmax;
  this.bounds[3]-=rmax;
  this.bounds[5]-=rmax;
  this.bounds[7]+=rmax-2*rmin;
  this.bounds[9]+=rmax-2*rmin;
  this.bounds[11]+=rmax;

}

var bounds = [];
bounds.push(0,0);
bounds.push(0,Math.pow(phi,5/2));
bounds.push(phi,Math.pow(phi,5/2));
bounds.push(phi,Math.pow(phi,5/2)-Math.pow(phi,1/2));
bounds.push(phi+1,Math.pow(phi,5/2)-Math.pow(phi,1/2));
bounds.push(phi+1,0);

var chair_red = new Tile(['red'],[],bounds,4);
var chair_white = chair_red.myclone();
chair_white.limit = 6;
chair_white.chair_red2white();
var chair_white90 = chair_white.myclone();
chair_white90.chair_white90();

//[2]

function AmmannChairSub(tile){
  switch(tile.id[0]){
    case 'red':

      var newtiles = [];
      var newhite = tile.myclone();
      newhite.scale(tile.bounds[0], tile.bounds[1], 1/Math.sqrt(phi));
      newhite.id.push("newhite");
      newhite.chair_red2white();
      
      newtiles.push(newhite);

      return newtiles;

    case 'red90':

      var newtiles = [];
      var newhite90 = tile.myclone();
      newhite90.scale(tile.bounds[0], tile.bounds[1], 1/Math.sqrt(phi));
      newhite90.id.push("newhite90");
      newhite90.chair_red2white();
      newhite90.chair_white90();
      
      newtiles.push(newhite90);

      return newtiles;

    
    case 'redMiror':

      var newtiles = [];
      var newhiteMiror = tile.myclone();
      newhiteMiror.scale(tile.bounds[0], tile.bounds[1], 1/Math.sqrt(phi));
      newhiteMiror.id.push("newhiteMiror");
      newhiteMiror.chair_red2white();
      newhiteMiror.chair_whiteMiror();
      
      newtiles.push(newhiteMiror);

      return newtiles;

    case 'redMiror90':

      var newtiles = [];
      var newhite90Miror = tile.myclone();
      newhite90Miror.scale(tile.bounds[0], tile.bounds[1], 1/Math.sqrt(phi));
      newhite90Miror.id.push("newhite90Miror");
      newhite90Miror.chair_red2white();
      newhite90Miror.chair_white90Miror();
      
      newtiles.push(newhite90Miror);

      return newtiles;

    case 'white':

      var newtiles = [];
      var newhite90 = tile.myclone();
      newhite90.id.push("newhite90");
      
      newhite90.rotate(tile.bounds[0], tile.bounds[1],Math.PI/2);
      newhite90.shift(tile.bounds[3] - tile.bounds[1],tile.bounds[2]-tile.bounds[0]);
      newhite90.scale(tile.bounds[0], tile.bounds[1], 1/Math.sqrt(phi));
      newhite90.chair_white90(); 
      newtiles.push(newhite90);

      var newRed1 = tile.myclone();
      newRed1.id.push("newRed1");
      newRed1.chair_white2red();
      newRed1.chair_redMiror();
      newRed1.rotateX();
      newRed1.scale(tile.bounds[0], tile.bounds[1], 1/Math.sqrt(phi));
      newRed1.shift(newhite90.bounds[4]-newhite90.bounds[2],newhite90.bounds[5]-newhite90.bounds[3])
      
      newtiles.push(newRed1);
      
      return newtiles;
    
    case 'white90':
      var newtiles = [];
      var newhite = tile.myclone();
      newhite.id.push("newhite");
      newhite.rotate(tile.bounds[0], tile.bounds[1],Math.PI/2);
      newhite.shift(tile.bounds[3] - tile.bounds[1],-(tile.bounds[2]-tile.bounds[0]));
      newhite.chair_90White();
      
      var newRed1 = tile.myclone();
      newRed1.id.push("newRed1");
      newRed1.chair_white2red();
      newRed1.chair_redMiror90();
      newRed1.rotateYla();
      newRed1.shift(newhite.bounds[4]-newhite.bounds[2],newhite.bounds[5]-newhite.bounds[3])

      newhite.scale(tile.bounds[0], tile.bounds[1], 1/Math.sqrt(phi));
      newRed1.scale(tile.bounds[0], tile.bounds[1], 1/Math.sqrt(phi));
      newtiles.push(newRed1);
      newtiles.push(newhite);

      return newtiles;

    case 'whiteMiror':
        var newtiles = [];
        var newhiteM = tile.myclone();
        newhiteM.id.push("newhiteMiror");
        
        newhiteM.rotate(tile.bounds[0], tile.bounds[1],-Math.PI/2);
        newhiteM.shift(-(tile.bounds[3] - tile.bounds[1]),tile.bounds[2]-tile.bounds[0]);
        newhiteM.scale(tile.bounds[0], tile.bounds[1], 1/Math.sqrt(phi));
        newhiteM.chair_white90Miror(); 
        newtiles.push(newhiteM);
  
        var newRed1 = tile.myclone();
        newRed1.id.push("newRed1");
        newRed1.chair_white2red();
        newRed1.rotateX();
        newRed1.scale(tile.bounds[0], tile.bounds[1], 1/Math.sqrt(phi));
        newRed1.shift(newhiteM.bounds[4]-newhiteM.bounds[2],newhiteM.bounds[5]-newhiteM.bounds[3])
        
        newtiles.push(newRed1);
        return newtiles;


    case 'white90Miror':
        var newtiles = [];
        var newhite90M = tile.myclone();
        newhite90M.id.push("newhite90Miror");
        
        newhite90M.rotate(tile.bounds[0], tile.bounds[1],-Math.PI/2);
        newhite90M.shift(-(tile.bounds[3] - tile.bounds[1]),tile.bounds[2]-tile.bounds[0]);
        newhite90M.scale(tile.bounds[0], tile.bounds[1], 1/Math.sqrt(phi));
        newhite90M.chair_whiteMiror(); 
        newtiles.push(newhite90M);
  
        var newRed1 = tile.myclone();
        newRed1.id.push("newRed1");
        newRed1.chair_white2red();
        newRed1.chair_red90();
        newRed1.rotateYla();
        newRed1.scale(tile.bounds[0], tile.bounds[1], 1/Math.sqrt(phi));
        newRed1.shift(newhite90M.bounds[4]-newhite90M.bounds[2],newhite90M.bounds[5]-newhite90M.bounds[3])
        
        newtiles.push(newRed1);
        return newtiles;

    default:
      console.log("Error: undefined tile type for mysubstitution, id="+tile.id);
  }
}

//[3]

var AmmannChairdupinfos = [];
var AmmannChairdupinfosoriented = [];

//[4] [5]

var AmmannChairneighbors = "I am lazy";

// [6] 

//La detection automatique des voisins ne fonctionne pas du fait qu'une une tuile a plusieur cotés en contact avec d'autres tuiles

var AmmannChairneighbors2bounds = new Map();
AmmannChairneighbors2bounds.set('red',[[0,1,2,3],[2,3,4,5],[4,5,6,7],[6,7,8,9],[8,9,10,11],[10,11,0,1]]);
AmmannChairneighbors2bounds.set('red90',[[0,1,2,3],[2,3,4,5],[4,5,6,7],[6,7,8,9],[8,9,10,11],[10,11,0,1]]);
AmmannChairneighbors2bounds.set('redMiror',[[0,1,2,3],[2,3,4,5],[4,5,6,7],[6,7,8,9],[8,9,10,11],[10,11,0,1]]);
AmmannChairneighbors2bounds.set('redMiror90',[[0,1,2,3],[2,3,4,5],[4,5,6,7],[6,7,8,9],[8,9,10,11],[10,11,0,1]]);
AmmannChairneighbors2bounds.set('white',[[0,1,2,3],[2,3,4,5],[4,5,6,7],[6,7,8,9],[8,9,10,11],[10,11,0,1]]);
AmmannChairneighbors2bounds.set('white90',[[0,1,2,3],[2,3,4,5],[4,5,6,7],[6,7,8,9],[8,9,10,11],[10,11,0,1]]);
AmmannChairneighbors2bounds.set('whiteMiror',[[0,1,2,3],[2,3,4,5],[4,5,6,7],[6,7,8,9],[8,9,10,11],[10,11,0,1]]);
AmmannChairneighbors2bounds.set('white90Miror',[[0,1,2,3],[2,3,4,5],[4,5,6,7],[6,7,8,9],[8,9,10,11],[10,11,0,1]]);

// AmmannChairneighbors2bounds.set('red',default_neighbors2bounds(3));
// AmmannChairneighbors2bounds.set('red90',default_neighbors2bounds(3));
// AmmannChairneighbors2bounds.set('redMiror',default_neighbors2bounds(3));
// AmmannChairneighbors2bounds.set('redMiror90',default_neighbors2bounds(3));

// AmmannChairneighbors2bounds.set('white',default_neighbors2bounds(3));
// AmmannChairneighbors2bounds.set('white90',default_neighbors2bounds(3));
// AmmannChairneighbors2bounds.set('whiteMiror',default_neighbors2bounds(3));
// AmmannChairneighbors2bounds.set('white90Miror',default_neighbors2bounds(3));



// [7]

AmmannChairdecorate = new Map();
// AmmannChairdecorate.set('red',6);
// AmmannChairdecorate.set('red90',7);
// AmmannChairdecorate.set('redMiror',8);
// AmmannChairdecorate.set('redMiror90',9);
// AmmannChairdecorate.set('white',0);
// AmmannChairdecorate.set('white90',4);
// AmmannChairdecorate.set('whiteMiror',13);
// AmmannChairdecorate.set('white90Miror',15);

AmmannChairdecorate.set('red',6);
AmmannChairdecorate.set('red90',6);
AmmannChairdecorate.set('redMiror',6);
AmmannChairdecorate.set('redMiror90',6);
AmmannChairdecorate.set('white',0);
AmmannChairdecorate.set('white90',0);
AmmannChairdecorate.set('whiteMiror',0);
AmmannChairdecorate.set('white90Miror',0);
//[Tiling]

Tiling.AmmannChair = function({iterations}={}){
    var tiles = [];
    var myred = chair_red.myclone();

    tiles.push(myred);
    tiles = substitute(
      iterations,
      tiles,
      Math.sqrt(phi),
      AmmannChairSub,
      AmmannChairdupinfos,
      AmmannChairdupinfosoriented,
      AmmannChairneighbors,
      AmmannChairneighbors2bounds,
      AmmannChairdecorate
    );

    return new Tiling(tiles);
}

