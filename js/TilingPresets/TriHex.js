// This code is part of JS-Sandpile (https://github.com/huacayacauh/JS-Sandpile/)
// CC-BY Valentin Darrigo, Jeremy Fersula, Kevin Perrot

// TriHex substitution
// substitution described at
// https://tilings.math.uni-bielefeld.de/substitution/trihex/



//
// [0] toolbox
//

var y_side = Math.tan(Math.PI/3);
var scaling_ratio = 0.5;

//
// [1] define tile types TriHex
//

// White triangles

var bounds = [];
bounds.push(0,0);
bounds.push(1,0);
bounds.push(0,y_side);
var Wtriangle = new Tile(['Wtriangle'],[],bounds,3);

// Black triangles

bounds = []
bounds.push(0,0);
bounds.push(1,0);
bounds.push(1,y_side);
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

            // new Wtriangle1
            var Wtriangle1 = tile.myclone();
            Wtriangle1.id.push('W1');
            Wtriangle1.scale(tile.bounds[0], tile.bounds[1], 2);
            newtiles.push(Wtriangle1);

            // new Wtriangle2

            var Wtriangle2 = tile.myclone();
            Wtriangle2.id.push('W2');
            Wtriangle2.rotate(tile.bounds[2], tile.bounds[3], -(Math.PI/2 + Math.PI/6));
            Wtriangle2.shift(tile.bounds[4] - tile.bounds[2], tile.bounds[3] - tile.bounds[5]);
            Wtriangle2.scale(tile.bounds[0], tile.bounds[1], 2);
            newtiles.push(Wtriangle2);

            // new Btriangle1

            var Btriangle1 = tile.myclone();
            Btriangle1.Wtriangle2Btriangle();
            Btriangle1.id.push('B1');
            var reflectedPoint = rotatePoint(tile.bounds[4], tile.bounds[5], tile.bounds[0], tile.bounds[1], Math.PI);
            Btriangle1.bounds[4] = reflectedPoint[0];
            Btriangle1.bounds[5] = reflectedPoint[1];
            Btriangle1.scale(tile.bounds[0], tile.bounds[1], 2);
            newtiles.push(Btriangle1);
            
            
            // new Btriangle2

            var Btriangle2 = tile.myclone();
            Btriangle2.Wtriangle2Btriangle();
            Btriangle2.id.push('B2');
            var reflectedPoint = rotatePoint(tile.bounds[4], tile.bounds[5], tile.bounds[0], tile.bounds[1], Math.PI);
            Btriangle2.bounds[4] = reflectedPoint[0];
            Btriangle2.bounds[5] = reflectedPoint[1];
            Btriangle2.rotate(bounds[2], bounds[3], Math.PI/3);
            Btriangle2.scale(tile.bounds[0], tile.bounds[1], 2);
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

            // new Btriangle1
            var Btriangle1 = tile.myclone();
            Btriangle1.id.push('B1')
            Btriangle1.scale(tile.bounds[0], tile.bounds[1], 2);
            newtiles.push(Btriangle1);

            // new Btriangle2

            var Btriangle2 = tile.myclone();
            Btriangle2.id.push('B2');
            Btriangle2.rotate(tile.bounds[2], tile.bounds[3], -(Math.PI/2 + Math.PI/6));
            Btriangle2.shift(tile.bounds[4] - tile.bounds[2], tile.bounds[3] - tile.bounds[5]);
            Btriangle2.scale(tile.bounds[0], tile.bounds[1], 2);
            newtiles.push(Btriangle2);

            // new Wtriangle1

            var Wtriangle1 = tile.myclone();
            Wtriangle1.Btriangle2Wtriangle();
            Wtriangle1.id.push('W1');
            var reflectedPoint = rotatePoint(tile.bounds[4], tile.bounds[5], tile.bounds[0], tile.bounds[1], Math.PI);
            Wtriangle1.bounds[4] = reflectedPoint[0];
            Wtriangle1.bounds[5] = reflectedPoint[1];
            Wtriangle1.scale(tile.bounds[0], tile.bounds[1], 2);
            newtiles.push(Wtriangle1);
            
            
            // new Wtriangle2

            var Wtriangle2 = tile.myclone();
            Wtriangle2.Btriangle2Wtriangle();
            Wtriangle2.id.push('W2');
            var reflectedPoint = rotatePoint(tile.bounds[4], tile.bounds[5], tile.bounds[0], tile.bounds[1], Math.PI);
            Wtriangle2.bounds[4] = reflectedPoint[0];
            Wtriangle2.bounds[5] = reflectedPoint[1];
            Wtriangle2.rotate(bounds[2], bounds[3], Math.PI/3);
            Wtriangle2.scale(tile.bounds[0], tile.bounds[1], 2);
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
decorateTriHex.set('Btriangle',0);

Tiling.TriHex = function({iterations}={}){
    var tiles = [];
    // push base tiling
    var myTriangle = Wtriangle.myclone();
    tiles.push(myTriangle);
    
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

