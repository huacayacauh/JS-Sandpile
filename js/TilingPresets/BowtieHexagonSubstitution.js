// MAKING BOWTIE HEXAGON MADE BY AMALYA MOURIH
//https://tilings.math.uni-bielefeld.de/substitution/bowtie-hexagon/

//
// [0] toolbox
//

// sqrt(2)
let varBowtieHexa=  (1 + Math.sqrt(5))/2;

// angles of hexagon
var  littleAngleh = 2*Math.PI/5;
var bigAngleh = 4*Math.PI/5;

// angles of bowtie
var littleAngleb = littleAngleh;
var bigAngleb = 2*Math.PI - bigAngleh;

//important values for bowtie
var distBetweenBowties = Math.sqrt(varBowtieHexa**2 + varBowtieHexa**2 - 2*varBowtieHexa*varBowtieHexa*Math.cos(bigAngleb));
var importantHeight = Math.sqrt((distBetweenBowties/2)**2 + varBowtieHexa**2 - 2*varBowtieHexa*(distBetweenBowties/2)*Math.cos(Math.PI/10));
var heightMiddleBowtie = varBowtieHexa - 2*importantHeight; 
var anotherheight = importantHeight + heightMiddleBowtie;
//important values for hexagon

var distanceSommetHexa = (varBowtieHexa/2)/Math.tan(Math.PI/5);
//
// [1] define tile types A5
//

// hexagon  (FINALLY WORKS)
var bounds = [];
bounds.push(0,0); //down left
bounds.push(varBowtieHexa,0); //down right
bounds.push(varBowtieHexa + distanceSommetHexa, varBowtieHexa/2); //right middle point
bounds.push(varBowtieHexa, varBowtieHexa); //up right
bounds.push(0, varBowtieHexa) //up left
bounds.push(-distanceSommetHexa, varBowtieHexa/2) //left middle point
var hexagon = new Tile(['hexagon'],[],bounds,6); 


// bowtie (FINALLY WORKS)
var bounds = [];
bounds.push(0,0); //down left
bounds.push(distBetweenBowties/2, importantHeight); //down point of  bowtie's middle
bounds.push(distBetweenBowties,0) //down right
bounds.push(distBetweenBowties,varBowtieHexa) //up right
bounds.push(distBetweenBowties/2, anotherheight); //up point of bowtie's middle
bounds.push(0,varBowtieHexa); //up left
var bowtie = new Tile(['bowtie'],[],bounds,6);


// convert a bowtie to hexagone
Tile.prototype.bowtie2hexa = function(){
    this.id[0]='hexagon';


    /*let h0 = this.bounds[2];
    let h1 = this.bounds[3];

    let h2 = this.bounds[0];
    let h3 = this.bounds[1];

    let h10 = this.bounds[4];
    let h11 = this.bounds[5];



    this.bounds[0] = h0;
    this.bounds[1] = h1;
     
    this.bounds[2] = h2;
    this.bounds[3] = h3;

    this.bounds[10] = h10;
    this.bounds[11] = h11; */


    let h23 = rotatePoint(this.bounds[2],this.bounds[3],this.bounds[0],this.bounds[1],-Math.PI/(2*5));
    this.bounds[2] = h23[0];
    this.bounds[3] = h23[1]; 

    let dist2345 = distance(this.bounds[2],this.bounds[3],this.bounds[4],this.bounds[5]);
    let dist0123 = distance(this.bounds[0],this.bounds[1],this.bounds[2],this.bounds[3]);
    let scale2345 = dist0123/dist2345; 
    let h45 = scalePoint(this.bounds[4], this.bounds[5], this.bounds[2], this.bounds[3], scale2345);
    let h45bis = rotatePoint(h45[0], h45[1], this.bounds[2], this.bounds[3], Math.PI/5);
    this.bounds[4] = h45bis[0];
    this.bounds[5] = h45bis[1];

  

    let dist4567 = distance(this.bounds[4], this.bounds[5], this.bounds[6], this.bounds[7]);
    let dist2345_1 = distance(this.bounds[2],this.bounds[3],this.bounds[4],this.bounds[5]);
    let scale4567 = dist2345_1/dist4567;
    let h67 = scalePoint(this.bounds[4], this.bounds[5], this.bounds[6], this.bounds[7], -scale4567);
    let h67bis = rotatePoint(h67[0], h67[1], this.bounds[4], this.bounds[5], 2*Math.PI/5);
    this.bounds[6] = h67bis[0];
    this.bounds[7] = h67bis[1];

    /*let h1011 = rotatePoint(this.bounds[10], this.bounds[11], this.bounds[0], this.bounds[1], 3*Math.PI/10); 
    this.bounds[10] = h1011[0];
    this.bounds[11] = h1011[1];*/
    
    /*let dist6789 = distance(this.bounds[8], this.bounds[9], this.bounds[6], this.bounds[7]);
    let scale6789 = varBowtieHexa/dist6789;
    let h89 = scalePoint(this.bounds[6], this.bounds[7], this.bounds[8], this.bounds[9], -scale6789);
    //let h89bis = rotatePoint(h89[0], h89[1], this.bounds[6], this.bounds[7], -Math.PI/2);
    this.bounds[8] = h89[0];
    this.bounds[9] = h89[1];

    let h1011 = rotatePoint(this.bounds[10], this.bounds[11], this.bounds[0], this.bounds[1], 3*Math.PI/10); 
    this.bounds[10] = h1011[0];
    this.bounds[11] = h1011[1];*/

     /* version de coline
    let h8 = this.bounds[10];
    let h9 = this.bounds[11];
    //let dist01_67 = distance(this.bounds[0], this.bounds[1], this.bounds[6], this.bounds[7]);

  


    //goood
    let h2 = (((this.bounds[2] - this.bounds[0])/varBowtieHexa)*Math.cos(Math.PI/10) + ((this.bounds[3] - this.bounds[1])/varBowtieHexa)*Math.sin(Math.PI/10))*varBowtieHexa + this.bounds[0];
    let h3 = (((this.bounds[3] - this.bounds[1])/varBowtieHexa)*Math.cos(Math.PI/10) - ((this.bounds[2] - this.bounds[0])/varBowtieHexa)*Math.sin(Math.PI/10))*varBowtieHexa +  this.bounds[1];

    // :/
    let h4 = (((this.bounds[4]- this.bounds[0])/(2*varBowtieHexa))*Math.cos(Math.PI/11) - ((this.bounds[5]- this.bounds[1])/(2*varBowtieHexa))*Math.sin(Math.PI/11))*2*varBowtieHexa + this.bounds[0];// AUTRE HYPO
    let h5 = (((this.bounds[5]- this.bounds[1])/(2*varBowtieHexa))*Math.cos(Math.PI/11) + ((this.bounds[4]- this.bounds[0])/(2*varBowtieHexa))*Math.sin(Math.PI/11))*2*varBowtieHexa + this.bounds[1]; //AUTRE HYPO

    //goooood
    let h6 = (((h2 - this.bounds[0])/varBowtieHexa)*Math.cos(Math.PI/4) - ((h3 - this.bounds[1])/varBowtieHexa)*Math.sin(Math.PI/4))*Math.sqrt(2)*varBowtieHexa + this.bounds[0];
    let h7 = (((h3 - this.bounds[1])/varBowtieHexa)*Math.cos(Math.PI/4) + ((h2 - this.bounds[0])/varBowtieHexa)*Math.sin(Math.PI/4))*Math.sqrt(2)*varBowtieHexa + this.bounds[1];

    //check 
    let h10 = (-1)*((((this.bounds[0]-this.bounds[10])/varBowtieHexa)*Math.cos(3*Math.PI/9) + ((this.bounds[11]-this.bounds[1])/varBowtieHexa)*Math.sin(3*Math.PI/9))*varBowtieHexa - this.bounds[0]);
    let h11 = (((this.bounds[11]-this.bounds[1])/varBowtieHexa)*Math.cos(3*Math.PI/9) - ((this.bounds[0]-this.bounds[10])/varBowtieHexa)*Math.sin(3*Math.PI/9))*varBowtieHexa + this.bounds[1];
   
    this.bounds[2] = h2;
    this.bounds[3] = h3;
    this.bounds[4] = h4;
    this.bounds[5] = h5;
    this.bounds[6] = h6;
    this.bounds[7] = h7;
    this.bounds[8] = h8;
    this.bounds[9] = h9;
    this.bounds[10] = h10;
    this.bounds[11] = h11;   
    
    */

  } 

// convert a hexagon to bowtie
Tile.prototype.hexa2bowtie = function(){
    this.id[0]='bowtie';

    let h10 = this.bounds[8]
    let h11 = this.bounds[9]
    let dist01_67 = distance(this.bounds[0], this.bounds[1], this.bounds[6], this.bounds[7]);
    let dist01_89 = distance(this.bounds[0], this.bounds[1], this.bounds[8], this.bounds[9]);

    let h2 = (((this.bounds[2] - this.bounds[0])/varBowtieHexa)*Math.cos(Math.PI/10) - ((this.bounds[3] - this.bounds[1])/varBowtieHexa)*Math.sin(Math.PI/10))*varBowtieHexa + this.bounds[0];
    let h3 = (((this.bounds[3] - this.bounds[1])/varBowtieHexa)*Math.cos(Math.PI/10) + ((this.bounds[2] - this.bounds[0])/varBowtieHexa)*Math.sin(Math.PI/10))*varBowtieHexa +  this.bounds[1];

    let h4 = (((this.bounds[4]- this.bounds[0])/(distBetweenBowties))*Math.cos(Math.PI/11) + ((this.bounds[5]- this.bounds[1])/(distBetweenBowties))*Math.sin(Math.PI/11))*distBetweenBowties + this.bounds[0];// AUTRE HYPO
    let h5 = (((this.bounds[5]- this.bounds[1])/(distBetweenBowties))*Math.cos(Math.PI/11) - ((this.bounds[4]- this.bounds[0])/(distBetweenBowties))*Math.sin(Math.PI/11))*distBetweenBowties + this.bounds[1]; //AUTRE HYPO
    
    let h6 = Math.cos(Math.acos((this.bounds[2] - this.bounds[0])/varBowtieHexa))*Math.sqrt(2)*varBowtieHexa + this.bounds[0];
    let h7 = Math.sin(Math.acos((this.bounds[2] - this.bounds[0])/varBowtieHexa))*Math.sqrt(2)*varBowtieHexa + this.bounds[1];


    
    let h8 = (-1)*((((this.bounds[0]-this.bounds[10])/varBowtieHexa)*Math.cos(3*Math.PI/10) + ((this.bounds[11]-this.bounds[1])/varBowtieHexa)*Math.sin(3*Math.PI/10))*varBowtieHexa - this.bounds[0]);
    let h9 = (((this.bounds[11]-this.bounds[1])/varBowtieHexa)*Math.cos(3*Math.PI/10) - ((this.bounds[0]-this.bounds[10])/varBowtieHexa)*Math.sin(3*Math.PI/10))*varBowtieHexa + this.bounds[1];
   
    this.bounds[2] = h2;
    this.bounds[3] = h3;
    this.bounds[4] = h4;
    this.bounds[5] = h5;
    this.bounds[6] = h6;
    this.bounds[7] = h7;
    this.bounds[8] = h8;
    this.bounds[9] = h9;
    this.bounds[10] = h10;
    this.bounds[11] = h11;    



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

        //-------------two bowties are good

        // new bowtie 0 
        /*var newb0 = tile.myclone();
        newb0.id.push('b0');
        newb0.scale(tile.bounds[0],tile.bounds[1],varBowtieHexa);
        newb0.rotate(tile.bounds[0],tile.bounds[1],Math.PI);
        newtiles.push(newb0);
          
        // new bowtie 1
        var newb1 = tile.myclone();
        newb1.id.push('b1');
        newb1.scale(tile.bounds[0],tile.bounds[1],varBowtieHexa);
        newb1.rotate(tile.bounds[0],tile.bounds[1],Math.PI);
        newb1.shift((varBowtieHexa)*tile.bounds[4],(varBowtieHexa)*tile.bounds[5]); 
        newtiles.push(newb1); */
        
      //---------------------------


  
        // new hexagon 0
        var newh0 = tile.myclone();
        newh0.bowtie2hexa();
        newh0.id.push('h0');
        newh0.scale(tile.bounds[0],tile.bounds[1],varBowtieHexa);
        //newh0.rotate(tile.bounds[0], tile.bounds[1],Math.PI);
        //newh0.shift(tile.bounds[4], tile.bounds[5]);
        newtiles.push(newh0);
  
        // new hexagon 1
        /*var newh1 = tile.myclone();
        newh1.bowtie2hexa();
        newh1.id.push('h1');
        newh1.scale(tile.bounds[0],tile.bounds[1],varBowtieHexa);
        newh1.rotate(tile.bounds[0],tile.bounds[1],-3*Math.PI/4);
        //newh1.shift(tile.bounds[0],tile.bounds[1]);
        newtiles.push(newh1);
  
        // new hexagon 2
        var newh2 = tile.myclone();
        newh2.bowtie2hexa();
        newh2.id.push('h2');
        newh2.scale(tile.bounds[0],tile.bounds[1],varBowtieHexa);
        newh2.rotate(tile.bounds[0],tile.bounds[1],3*Math.PI/4);
        newh2.shift(tile.bounds[4]-tile.bounds[0],tile.bounds[5]-tile.bounds[1]);
        newtiles.push(newh2);*/
  
        /*// new hexagon 3
        var newh3 = tile.myclone();
        newh3.bowtie2hexa();
        newh3.id.push('h3');
        newh3.scale(tile.bounds[0],tile.bounds[1],1/(1+varBowtieHexa));
        newh3.rotate(tile.bounds[0],tile.bounds[1],-3*Math.PI/4);
        newh3.shift(tile.bounds[6]-tile.bounds[0],tile.bounds[7]-tile.bounds[1]);
        newtiles.push(newh3);
  
        // new hexagon 4
        var newh4 = tile.myclone();
        newh4.bowtie2hexa();
        newh4.id.push('h4');
        newh4.scale(tile.bounds[0],tile.bounds[1],1/(1+varBowtieHexa));
        newh4.rotate(tile.bounds[0],tile.bounds[1],Math.PI);
        //newh4.shift((1+sqrt2)/(2+sqrt2)*(tile.bounds[4]-tile.bounds[0]),(1+)/(2+sqrt2)*(tile.bounds[5]-tile.bounds[1]));
        newtiles.push(newh4);
  
        // new hexagon 5
        var newh5 = tile.myclone();
        newh5.bowtie2hexa();
        newh5.id.push('h5');
        newh5.scale(tile.bounds[0],tile.bounds[1],1/(1+varBowtieHexa));
        newh5.rotate(tile.bounds[0],tile.bounds[1],-Math.PI/4);
        newtiles.push(newh5);*/
  
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
        newh0.scale(tile.bounds[0],tile.bounds[1],varBowtieHexa);
        newh0.rotate(tile.bounds[0],tile.bounds[1],Math.PI);
        newtiles.push(newh0);
  
        // new hexagon 1
        var newh1 = tile.myclone();
        newh1.id.push('h1');
        newh1.scale(tile.bounds[0],tile.bounds[1],varBowtieHexa);
        newh1.rotate(tile.bounds[0],tile.bounds[1],Math.PI);
        newh1.rotate(newh0.bounds[10], newh0.bounds[11],-bigAngleh); //check pi ;//
        newtiles.push(newh1);
  
        // new hexagon 2
        var newh2 = tile.myclone();
        newh2.id.push('h2');
        newh2.scale(tile.bounds[0],tile.bounds[1],varBowtieHexa);
        newh2.rotate(tile.bounds[0],tile.bounds[1],Math.PI);
        newh2.rotate(newh0.bounds[10], newh0.bounds[11],-bigAngleh);
        newh2.rotate(newh1.bounds[4], newh1.bounds[5], -littleAngleh);
        newtiles.push(newh2);
  
        // new hexagon 3
        var newh3 = tile.myclone();
        newh3.id.push('h3');
        newh3.scale(tile.bounds[0],tile.bounds[1],varBowtieHexa);
        newh3.rotate(tile.bounds[0],tile.bounds[1],Math.PI);
        newh3.rotate(newh0.bounds[10], newh0.bounds[11],-bigAngleh);
        newh3.rotate(newh1.bounds[4], newh1.bounds[5], -littleAngleh);
        newh3.rotate(newh2.bounds[10], newh2.bounds[11],-littleAngleh);
        newtiles.push(newh3);
  
        // new hexagon 4
        var newh4 = tile.myclone();
        newh4.id.push('h4');
        newh4.scale(tile.bounds[0],tile.bounds[1],varBowtieHexa);
        newh4.rotate(tile.bounds[0],tile.bounds[1],Math.PI);
        newh4.rotate(newh0.bounds[10], newh0.bounds[11],-bigAngleh);
        newh4.rotate(newh1.bounds[4], newh1.bounds[5], -littleAngleh);
        newh4.rotate(newh2.bounds[10], newh2.bounds[11],-littleAngleh)
        newh4.rotate(newh3.bounds[10], newh3.bounds[11],-littleAngleh)
        newtiles.push(newh4);
  
        // new hexagon 5
        var newh5 = tile.myclone();
        newh5.id.push('h5');
        newh5.scale(tile.bounds[0],tile.bounds[1],varBowtieHexa);
        newh5.rotate(tile.bounds[0],tile.bounds[1],Math.PI);
        newh5.rotate(newh0.bounds[10], newh0.bounds[11],-bigAngleh);
        newh5.rotate(newh1.bounds[4], newh1.bounds[5], -littleAngleh);
        newh5.rotate(newh2.bounds[10], newh2.bounds[11],-littleAngleh);
        newh5.rotate(newh3.bounds[10], newh3.bounds[11],-littleAngleh);
        newh5.rotate(newh4.bounds[4], newh4.bounds[5],-littleAngleh);
        newtiles.push(newh5);

        // new hexagon 6
        var newh6 = tile.myclone();
        newh6.id.push('h6');
        newh6.scale(tile.bounds[0],tile.bounds[1],varBowtieHexa);
        newh6.rotate(tile.bounds[0],tile.bounds[1],Math.PI);
        newh6.rotate(newh0.bounds[10], newh0.bounds[11],-bigAngleh);
        newh6.rotate(newh1.bounds[4], newh1.bounds[5], -littleAngleh);
        newh6.rotate(newh2.bounds[10], newh2.bounds[11],-littleAngleh);
        newh6.rotate(newh3.bounds[10], newh3.bounds[11],-littleAngleh);
        newh6.rotate(newh4.bounds[4], newh4.bounds[5],-littleAngleh);
        newh6.rotate(newh5.bounds[4], newh5.bounds[5],-littleAngleh);
        newtiles.push(newh6);        

        // new hexagon 7
        var newh7 = tile.myclone();
        newh7.id.push('h7');
        newh7.scale(tile.bounds[0],tile.bounds[1],varBowtieHexa);
        newh7.rotate(tile.bounds[0],tile.bounds[1],Math.PI);
        newh7.rotate(newh0.bounds[10], newh0.bounds[11],-bigAngleh);
        newh7.rotate(newh1.bounds[4], newh1.bounds[5], -littleAngleh);
        newh7.rotate(newh2.bounds[10], newh2.bounds[11],-littleAngleh);
        newh7.rotate(newh3.bounds[10], newh3.bounds[11],-littleAngleh);
        newh7.rotate(newh4.bounds[4], newh4.bounds[5],-littleAngleh);
        newh7.rotate(newh5.bounds[4], newh5.bounds[5],-littleAngleh);
        newh7.rotate(newh6.bounds[10], newh6.bounds[11],-littleAngleh);
        newtiles.push(newh7); 

        // new bowtie 0
        /*var newb0 = tile.myclone();
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
        newtiles.push(newb2); */

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
// [7.1] construct "Equithirds" tiling by substitution
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
    varBowtieHexa,
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


  



