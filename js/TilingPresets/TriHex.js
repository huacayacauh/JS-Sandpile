// This code is part of JS-Sandpile (https://github.com/huacayacauh/JS-Sandpile/)
// CC-BY Valentin Darrigo, Jeremy Fersula, Kevin Perrot

// TriHex substitution
// substitution described at
// https://tilings.math.uni-bielefeld.de/substitution/trihex/



//
// [0] toolbox
//

var x_side = 3;
var y_side = Math.tan(Math.PI/3) * x_side;
var scaling_ratio = 2;

//
// [1] define tile types TriHex
//

// White triangles

var bounds = [];
bounds.push(0,0);
bounds.push(x_side,0);
bounds.push(0,y_side);
var Wtriangle = new Tile(['Wtriangle'],[],bounds,3);

// Black triangles

bounds = []
bounds.push(0,0);
bounds.push(x_side,0);
bounds.push(0,y_side);
var Btriangle = new Tile(['Btriangle'],[],bounds,3);

Tile.prototype.Btriangle2Wtriangle = function(){
    this.id[0]='Wtriangle';
}
Tile.prototype.Wtriangle2Btriangle = function(){
    this.id[0]='Btriangle';
}

//
// [2] define substitution TriHex
//

function substitutionTriHex(tile){
    switch(tile.id[0]){
        case 'Wtriangle':
            //
            //-------------------------------
            // White triangle substitution -> 2 w, 2 b
            //-------------------------------
            //

            var newtiles = [];
            var bounds = tile.bounds;
            var new_bounds = [];

            // new Wtriangle1
            var Wtriangle1 = tile.myclone();
            Wtriangle1.id.push('W1');
            new_bounds.push((bounds[0] + bounds[4]) / 2, (bounds[1] + bounds[5]) / 2);
            new_bounds.push((bounds[2] + bounds[4]) / 2, (bounds[3] + bounds[5]) / 2);
            new_bounds.push(bounds[4], bounds[5]);
            Wtriangle1.bounds = new_bounds;
            Wtriangle1.scale(0, 0, scaling_ratio);
            newtiles.push(Wtriangle1);

            // new Wtriangle2

            new_bounds = [];
            var Wtriangle2 = tile.myclone();
            Wtriangle2.id.push('W2');
            new_bounds.push( ( (bounds[2] + bounds[4]) / 2 + bounds[0]) / 2, ( (bounds[3] + bounds[5]) / 2 + bounds[1]) / 2);
            new_bounds.push(bounds[0], bounds[1]);
            new_bounds.push(bounds[2], bounds[3]);
            Wtriangle2.bounds = new_bounds;
            Wtriangle2.scale(0, 0, scaling_ratio);
            newtiles.push(Wtriangle2);

            // new Btriangle1

            new_bounds = [];
            var Btriangle1 = tile.myclone();
            Btriangle1.Wtriangle2Btriangle();
            Btriangle1.id.push('B1');
            new_bounds.push( ( (bounds[2] + bounds[4]) / 2 + bounds[0]) / 2, ( (bounds[3] + bounds[5]) / 2 + bounds[1]) / 2);
            new_bounds.push((bounds[2] + bounds[4]) / 2, (bounds[3] + bounds[5]) / 2);
            new_bounds.push(bounds[2], bounds[3]);
            Btriangle1.bounds = new_bounds;
            Btriangle1.scale(0, 0, scaling_ratio);
            newtiles.push(Btriangle1);
            
            
            // new Btriangle2

            new_bounds = [];
            var Btriangle2 = tile.myclone();
            Btriangle2.Wtriangle2Btriangle();
            Btriangle2.id.push('B2');
            new_bounds.push((bounds[0] + bounds[4]) / 2, (bounds[1] + bounds[5]) / 2);
            new_bounds.push((bounds[2] + bounds[4]) / 2, (bounds[3] + bounds[5]) / 2);
            new_bounds.push(bounds[0], bounds[1]);
            Btriangle2.bounds = new_bounds;
            Btriangle2.scale(0, 0, scaling_ratio);
            newtiles.push(Btriangle2);

            return newtiles;
            break;
        
        case 'Btriangle':
            //
            //-------------------------------
            // Black triangle substitution -> 2 b, 2 w
            //-------------------------------
            //

            var newtiles = [];
            var bounds = tile.bounds;
            var new_bounds = [];

            // new Btriangle1
            var Btriangle1 = tile.myclone();
            Btriangle1.id.push('B1')
            new_bounds.push((bounds[0] + bounds[4]) / 2, (bounds[1] + bounds[5]) / 2);
            new_bounds.push((bounds[2] + bounds[4]) / 2, (bounds[3] + bounds[5]) / 2);
            new_bounds.push(bounds[4], bounds[5]);
            Btriangle1.bounds = new_bounds;
            Btriangle1.scale(0, 0, scaling_ratio);
            newtiles.push(Btriangle1);

            // new Btriangle2

            new_bounds = [];
            var Btriangle2 = tile.myclone();
            Btriangle2.id.push('B2');
            new_bounds.push( ( (bounds[2] + bounds[4]) / 2 + bounds[0]) / 2, ( (bounds[3] + bounds[5]) / 2 + bounds[1]) / 2);
            new_bounds.push(bounds[0], bounds[1]);
            new_bounds.push(bounds[2], bounds[3]);
            Btriangle2.bounds = new_bounds;
            Btriangle2.scale(0, 0, scaling_ratio);
            newtiles.push(Btriangle2);

            // new Wtriangle1

            new_bounds = [];
            var Wtriangle1 = tile.myclone();
            Wtriangle1.Btriangle2Wtriangle();
            Wtriangle1.id.push('W1');
            new_bounds.push( ( (bounds[2] + bounds[4]) / 2 + bounds[0]) / 2, ( (bounds[3] + bounds[5]) / 2 + bounds[1]) / 2);
            new_bounds.push((bounds[2] + bounds[4]) / 2, (bounds[3] + bounds[5]) / 2);
            new_bounds.push(bounds[2], bounds[3]);
            Wtriangle1.bounds = new_bounds;
            Wtriangle1.scale(0, 0, scaling_ratio);
            newtiles.push(Wtriangle1);
            
            // new Wtriangle2

            new_bounds = [];
            var Wtriangle2 = tile.myclone();
            Wtriangle2.Btriangle2Wtriangle();
            Wtriangle2.id.push('W2');
            new_bounds.push((bounds[0] + bounds[4]) / 2, (bounds[1] + bounds[5]) / 2);
            new_bounds.push((bounds[2] + bounds[4]) / 2, (bounds[3] + bounds[5]) / 2);
            new_bounds.push(bounds[0], bounds[1]);
            Wtriangle2.bounds = new_bounds;
            Wtriangle2.scale(0, 0, scaling_ratio);
            newtiles.push(Wtriangle2);

            return newtiles;
            break;

        default:
            // all tiles should be white or black triangles
            console.log("caution: undefined tile type for trihex, id="+tile.id);

    }
}

//
// [3] defined duplicated tile informations TriHex
//


// No duplicates !

mydupinfos=[];
mydupinfosoriented=[];

//
// [4] fill neighbors informations in TriHex newtiles (by side effect)
//

myneighbors="I am lazy";

//
// [6] use default neighbors2bounds
// 
var neighbors2boundsTriHex = new Map();
neighbors2boundsTriHex.set('Wtriangle',default_neighbors2bounds(3));
neighbors2boundsTriHex.set('Btriangle',default_neighbors2bounds(3));

//
// [7] construct base tilings and call substitute
//

// prepare decoration
decorateTriHex = new Map();
decorateTriHex.set('Wtriangle',0);
decorateTriHex.set('Btriangle',1);

Tiling.TriHex = function({iterations}={}){
    var tiles = [];
    // push base tiling
    var myTriangle1 = Wtriangle.myclone();
    var myTriangle2 = Btriangle.myclone();
    myTriangle2.bounds[2] = -myTriangle2.bounds[2];
    var myTriangle3 = Wtriangle.myclone();
    myTriangle3.bounds[2] = -myTriangle3.bounds[2];
    myTriangle3.bounds[5] = -myTriangle3.bounds[5];
    var myTriangle4 = Btriangle.myclone();
    myTriangle4.bounds[5] = -myTriangle4.bounds[5];
    tiles.push(myTriangle1);
    tiles.push(myTriangle2);
    tiles.push(myTriangle3);
    tiles.push(myTriangle4);
    
    // call the substitution
    tiles = substitute(
        iterations,
        tiles,
        1,
        substitutionTriHex,
        mydupinfos,
        mydupinfosoriented,
        myneighbors,
        neighbors2boundsTriHex,
        decorateTriHex
    );

    console.log(tiles)
    // construct tiling
    return new Tiling(tiles);
}

