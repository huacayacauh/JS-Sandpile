// MAKING BOWTIE HEXAGON MADE BY AMALYA MOURIH
//https://tilings.math.uni-bielefeld.de/substitution/bowtie-hexagon/

//
// [0] toolbox
//

// sqrt(2)
var sqrt2 = Math.sqrt(3);

// angles of hexagon
var  littleAngleh = 2*Math.PI/5;
var bigAngleh = 4*Math.PI/5;

// angles of bowtie
var littleAngleb = littleAngleh;
var bigAngleb = 2*Math.PI - bigAngleh;

//important values for bowtie
var distBetweenBowties = Math.sqrt(sqrt2**2 + sqrt2**2 - 2*sqrt2*sqrt2*Math.cos(bigAngleb));
var importantHeight = Math.sqrt((distBetweenBowties/2)**2 + sqrt2**2 - 2*sqrt2*(distBetweenBowties/2)*Math.cos(Math.PI/10));
var heightMiddleBowtie = sqrt2 - 2*importantHeight; 
var anotherheight = importantHeight + heightMiddleBowtie;
//important values for hexagon
var distBetweenDownPointandMiddle = Math.sin(0.3*Math.PI)*sqrt2;


//
// [1] define tile types A5
//

// hexagon  (FINALLY WORKS)
var bounds = [];
bounds.push(0,0); //down left
bounds.push(sqrt2,0); //down right
bounds.push(sqrt2 + distBetweenDownPointandMiddle, sqrt2/2); //right middle point
bounds.push(sqrt2, sqrt2); //up right
bounds.push(0, sqrt2) //up left
bounds.push(-distBetweenDownPointandMiddle, sqrt2/2) //left middle point
var hexagon = new Tile(['hexagon'],[],bounds,6); 


// bowtie (FINALLY WORKS)
var bounds = [];
bounds.push(0,0); //down left
bounds.push(distBetweenBowties/2, importantHeight); //down point of  bowtie's middle
bounds.push(distBetweenBowties,0) //down right
bounds.push(distBetweenBowties,sqrt2) //up right
bounds.push(distBetweenBowties/2, anotherheight); //up point of bowtie's middle
bounds.push(0,sqrt2); //up left
var bowtie = new Tile(['bowtie'],[],bounds,6);


// convert a bowtie to hexagone
Tile.prototype.bowtie2hexa = function(){
    this.id[0]='hexagon';

    //plutot bon
    var h23 = rotatePoint(this.bounds[2],this.bounds[3],this.bounds[4],this.bounds[5],Math.PI/4);
    this.bounds[2] = h23[0];
    this.bounds[3] = h23[1];

    //lui aussi ça passe
    var h89 = rotatePoint(this.bounds[8],this.bounds[9],this.bounds[6],this.bounds[7],-Math.PI/4);
    this.bounds[8] = h89[0];
    this.bounds[9] = h89[1];


    //distance entre 8,9 et 0,1
    var dist89_01 = distance(this.bounds[8],this.bounds[9],this.bounds[0],this.bounds[1]);
    var dist23_67 = distance(this.bounds[2],this.bounds[3],this.bounds[6],this.bounds[7]);

    /*var h1011 = scalePoint(this.bounds[8],this.bounds[9],this.bounds[0],this.bounds[1], dist89_01/2);
    this.bounds[10] = h1011[0];
    this.bounds[11] = h1011[1]; //meme chose que shift 

    var h1011 = scalePoint(this.bounds[8],this.bounds[9],this.bounds[0],this.bounds[1], dist89_01);
    this.bounds[10] = h1011[0];
    this.bounds[11] = h1011[1]; //meme chose que shift 

    var h01 = scalePoint(this.bounds[8],this.bounds[9],this.bounds[0],this.bounds[1], dist89_01/2);
    this.bounds[0] = h01[0];
    this.bounds[1] = h01[1]; //triangle chelou  

    var h01 = scalePoint(this.bounds[8],this.bounds[9],this.bounds[0],this.bounds[1], -dist89_01/2);
    this.bounds[8] = h01[0];
    this.bounds[9] = h01[1]; // essayé avec +dist8901/2 (figure chelou) essaye avec -dist (ca donne une raquette)

    var h01 = scalePoint(this.bounds[0],this.bounds[1],this.bounds[8],this.bounds[9], dist23_67/2);
    this.bounds[8] = h01[0];
    this.bounds[9] = h01[1]; //raqueyeeeee 


    var h01 = shiftPoint(this.bounds[8],this.bounds[9],this.bounds[0],this.bounds[1]);
    this.bounds[0] = h01[0];
    this.bounds[1] = h01[1]; // ne plus utiliser ca enlever le point 


    var h01 = scalePoint(this.bounds[8],this.bounds[9],this.bounds[0],this.bounds[1], dist89_01);
    this.bounds[8] = h01[0];
    this.bounds[9] = h01[1]; /epéééééééééééééééééééééééééééééééééééééééé */

    var1011h = scalePoint(his.bounds[8],this.bounds[9],this.bounds[0],this.bounds[1])

  } 

// convert a hexagon to bowtie
Tile.prototype.hexa2bowtie = function(){
    this.id[0]='bowtie';
    var h23 = rotatePoint(this.bounds[2],this.bounds[3],this.bounds[0],this.bounds[1],Math.PI/4);
    var h23bis = scalePoint(h23[0],h23[1],this.bounds[0],this.bounds[1],1/sqrt2);
    this.bounds[2] = h23bis[0];
    this.bounds[3] = h23bis[1];
    var h45 = rotatePoint(this.bounds[4],this.bounds[5],this.bounds[0],this.bounds[1],Math.PI/4);
    var h45bis = scalePoint(h45[0],h45[1],this.bounds[0],this.bounds[1],1/sqrt2);
    this.bounds[4] = h45bis[0];
    this.bounds[5] = h45bis[1];
    var h67= rotatePoint(this.bounds[6],this.bounds[7],this.bounds[0],this.bounds[1],Math.PI/4);
    var h67bis = scalePoint(h67[0],h67[1],this.bounds[0],this.bounds[1],1/sqrt2);
    this.bounds[6] = h67bis[0];
    this.bounds[7] = h67bis[1];
    var h89 = rotatePoint(this.bounds[8],this.bounds[9],this.bounds[0],this.bounds[1],Math.PI/4);
    var h89bis = scalePoint(h89[0],h89[1],this.bounds[0],this.bounds[1],1/sqrt2);
    this.bounds[8] = h89bis[0];
    this.bounds[9] = h89bis[1];
    var h1011 = rotatePoint(this.bounds[10],this.bounds[11],this.bounds[0],this.bounds[1],Math.PI/4);
    var h1011bis = scalePoint(h1011[0],h1011[1],this.bounds[0],this.bounds[1],1/sqrt2);
    this.bounds[10] = h1011bis[0];
    this.bounds[11] = h1011bis[1];

} 

function substitutionBowtieHexa(tile){
    switch(tile.id[0]){
      case 'bowtie':
        //
        // -------------------------------
        // bowtie substitution -> 6 hexagons, 2 bowties
        // -------------------------------
        //
        var newtiles = [];
  
        // new hexagon 0
        /*var newh0 = tile.myclone();
        newh0.bowtie2hexa();
        newh0.id.push('h0');
        newh0.scale(tile.bounds[0],tile.bounds[1],1/(1+sqrt2));
        newh0.rotate(tile.bounds[0],tile.bounds[1],);
        newh0.shift(tile.bounds[2]-tile.bounds[0],tile.bounds[3]-tile.bounds[1]);
        newtiles.push(newh0); */
  
        // new hexagon 1
        var newh1 = tile.myclone();
        newh1.bowtie2hexa();
        newh1.id.push('h1');
        newh1.scale(tile.bounds[0],tile.bounds[1],1/(1+sqrt2));
        //newh1.rotate(tile.bounds[0],tile.bounds[1],-3*Math.PI/4);
        newh1.shift(tile.bounds[0],tile.bounds[1]);
        newtiles.push(newh1);
  
        // new hexagon 2
        /*var newh2 = tile.myclone();
        newh2.bowtie2hexa();
        newh2.id.push('h2');
        newh2.scale(tile.bounds[0],tile.bounds[1],1/(1+sqrt2));
        newh2.rotate(tile.bounds[0],tile.bounds[1],3*Math.PI/4);
        newh2.shift(tile.bounds[4]-tile.bounds[0],tile.bounds[5]-tile.bounds[1]);
        newtiles.push(newh2);
  
        // new hexagon 3
        var newh3 = tile.myclone();
        newh3.bowtie2hexa();
        newh3.id.push('h3');
        newh3.scale(tile.bounds[0],tile.bounds[1],1/(1+sqrt2));
        newh3.rotate(tile.bounds[0],tile.bounds[1],-3*Math.PI/4);
        newh3.shift(tile.bounds[6]-tile.bounds[0],tile.bounds[7]-tile.bounds[1]);
        newtiles.push(newh3);
  
        // new hexagon 4
        var newh4 = tile.myclone();
        newh4.bowtie2hexa();
        newh4.id.push('h4');
        newh4.scale(tile.bounds[0],tile.bounds[1],1/(1+sqrt2));
        newh4.rotate(tile.bounds[0],tile.bounds[1],Math.PI);
        newh4.shift((1+sqrt2)/(2+sqrt2)*(tile.bounds[4]-tile.bounds[0]),(1+sqrt2)/(2+sqrt2)*(tile.bounds[5]-tile.bounds[1]));
        newtiles.push(newh4);
  
        // new hexagon 5
        var newh5 = tile.myclone();
        newh5.bowtie2hexa();
        newh5.id.push('h5');
        newh5.scale(tile.bounds[0],tile.bounds[1],1/(1+sqrt2));
        newh5.rotate(tile.bounds[0],tile.bounds[1],-Math.PI/4);
        newtiles.push(newh5);*/
  
        // new bowtie 0
        var newb0 = tile.myclone();
        newb0.id.push('b0');
        newb0.scale(tile.bounds[0],tile.bounds[1],1/(1+sqrt2));
        newb0.rotate(tile.bounds[0],tile.bounds[1],Math.PI);
        newb0.shift(tile.bounds[0],tile.bounds[0]);
        newtiles.push(newb0);
  
        // new bowtie 1
        /*var newb1 = tile.myclone();
        newb1.id.push('b1');
        newb1.scale(tile.bounds[0],tile.bounds[1],1/(1+sqrt2));
        newb1.rotate(tile.bounds[0],tile.bounds[1],Math.PI);
        newb1.shift(tile.bounds[2],tile.bounds[3]); //CHANGE
        newtiles.push(newb1); */

        // done
        return newtiles;
        break;
  
      case 'hexagon':
        //
        // -------------------------------
        // hexagon substitution -> 8 hexagons, 3 bowties
        // -------------------------------
        //
        var newtiles = [];
  
        // new hexagon 0
        var newh0 = tile.myclone();
        newh0.id.push('h0');
        newh0.scale(tile.bounds[0],tile.bounds[1],1/(1+sqrt2));
        newh0.rotate(tile.bounds[0],tile.bounds[1],3*Math.PI/4);
        newh0.shift(tile.bounds[2]-tile.bounds[0],tile.bounds[3]-tile.bounds[1]);
        newtiles.push(newh0);
  
        // new hexagon 1
        var newh1 = tile.myclone();
        newh1.id.push('h1');
        newh1.scale(tile.bounds[0],tile.bounds[1],1/(1+sqrt2));
        newh1.rotate(tile.bounds[0],tile.bounds[1],-3*Math.PI/4);
        newh1.shift(tile.bounds[4]-tile.bounds[0],tile.bounds[5]-tile.bounds[1]);
        newtiles.push(newh1);
  
        // new hexagon 2
        var newh2 = tile.myclone();
        newh2.id.push('h2');
        newh2.scale(tile.bounds[0],tile.bounds[1],1/(1+sqrt2));
        newh2.rotate(tile.bounds[0],tile.bounds[1],3*Math.PI/4);
        newh2.shift(tile.bounds[4]-tile.bounds[0],tile.bounds[5]-tile.bounds[1]);
        newtiles.push(newh2);
  
        // new hexagon 3
        var newh3 = tile.myclone();
        newh3.id.push('h3');
        newh3.scale(tile.bounds[0],tile.bounds[1],1/(1+sqrt2));
        newh3.rotate(tile.bounds[0],tile.bounds[1],-2*Math.PI/4);
        newh3.shift(tile.bounds[6]-tile.bounds[0],tile.bounds[7]-tile.bounds[1]);
        newtiles.push(newh3);
  
        // new hexagon 4
        var newh4 = tile.myclone();
        newh4.id.push('h4');
        newh4.scale(tile.bounds[0],tile.bounds[1],1/(1+sqrt2));
        newh4.rotate(tile.bounds[0],tile.bounds[1],Math.PI);
        newh4.shift((1+sqrt2)/(2+sqrt2)*(tile.bounds[4]-tile.bounds[0]),(1+sqrt2)/(2+sqrt2)*(tile.bounds[5]-tile.bounds[1]));
        newtiles.push(newh4);
  
        // new hexagon 5
        var newh5 = tile.myclone();
        newh5.id.push('h5');
        newh5.scale(tile.bounds[0],tile.bounds[1],1/(1+sqrt2));
        newh5.rotate(tile.bounds[0],tile.bounds[1],-Math.PI/4);
        newh5.shift((1+sqrt2)/(2+sqrt2)*(tile.bounds[4]-tile.bounds[0]),(1+sqrt2)/(2+sqrt2)*(tile.bounds[5]-tile.bounds[1]));
        newtiles.push(newh5);

        // new hexagon 6
        var newh6 = tile.myclone();
        newh6.id.push('h6');
        newh6.scale(tile.bounds[0],tile.bounds[1],1/(1+sqrt2));
        newh6.rotate(tile.bounds[0],tile.bounds[1],-Math.PI/4);
        newh6.shift((1+sqrt2)/(2+sqrt2)*(tile.bounds[4]-tile.bounds[0]),(1+sqrt2)/(2+sqrt2)*(tile.bounds[5]-tile.bounds[1]));
        newtiles.push(newh6);        

        // new hexagon 7
        var newh7 = tile.myclone();
        newh7.id.push('h7');
        newh7.scale(tile.bounds[0],tile.bounds[1],1/(1+sqrt2));
        newh7.rotate(tile.bounds[0],tile.bounds[1],-Math.PI/4);
        newh7.shift((1+sqrt2)/(2+sqrt2)*(tile.bounds[4]-tile.bounds[0]),(1+sqrt2)/(2+sqrt2)*(tile.bounds[5]-tile.bounds[1]));
        newtiles.push(newh7);

        // new bowtie 0
        var newb0 = tile.myclone();
        newb0.hexa2bowtie();
        newb0.id.push('b0');
        newb0.scale(tile.bounds[0],tile.bounds[1],1/(1+sqrt2));
        newb0.rotate(tile.bounds[0],tile.bounds[1],Math.PI/4);
        newb0.shift(tile.bounds[2]-tile.bounds[0],tile.bounds[3]-tile.bounds[1]);
        newtiles.push(newb0);
  
        // new bowtie 1
        var newb1 = tile.myclone();
        newb1.hexa2bowtie();
        newb1.id.push('b1');
        newb1.scale(tile.bounds[0],tile.bounds[1],1/(1+sqrt2));
        newb1.rotate(tile.bounds[0],tile.bounds[1],-Math.PI/2);
        newb1.shift(tile.bounds[6]-tile.bounds[0],tile.bounds[7]-tile.bounds[1]);
        newtiles.push(newb1);

        // new bowtie 2
        var newb2 = tile.myclone();
        newb2.hexa2bowtie();
        newb2.id.push('b2');
        newb2.scale(tile.bounds[0],tile.bounds[1],1/(1+sqrt2));
        newb2.rotate(tile.bounds[0],tile.bounds[1],-Math.PI/2);
        newb2.shift(tile.bounds[6]-tile.bounds[0],tile.bounds[7]-tile.bounds[1]);
        newtiles.push(newb2);

        // done
        return newtiles;
        break;

      default:
        // all tiles should be square or rhombus
        console.log("caution: undefined tile type for substitutionA5, id="+tile.id);
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
//
// [6] use default neighbors2bounds
// 
var neighbors2boundsBowHex= new Map();
neighbors2boundsBowHex.set('bowtie',default_neighbors2bounds(6));
neighbors2boundsBowHex.set('hexagon',default_neighbors2bounds(6));

//
// [7] construct base tilings and call substitute
//

// prepare decoration
decorateBowHex = new Map();
decorateBowHex.set('bowtie',0);
decorateBowHex.set('hexagon',1);


//
// [7.1] construct "Bowtie Hexagon" tiling by substitution
// 
Tiling.bowtieHexaSubstitution = function({iterations}={}){
  var tiles = [];
  var mybowtie1 = bowtie.myclone();
  mybowtie1.id.push(0);
  tiles.push(mybowtie1);

  // call the substitution
  tiles = substitute(
    iterations,
    tiles,
    phi,
    substitutionBowtieHexa,
    [], // no duplicated tiles
    [], // no duplicated tiles
    "I am lazy", // myneighbors
    neighbors2boundsBowHex,
    decorateBowHex
  );
  // construct tiling
  return new Tiling(tiles);
}
