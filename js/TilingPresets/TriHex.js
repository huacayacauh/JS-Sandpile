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
bounds.push(0,y_side);
bounds.push(x_side,y_side);
bounds.push(0,0);
var Wtriangle = new Tile(['Wtriangle'],[],bounds,3);

// Black triangles

bounds = []
bounds.push(0,y_side);
bounds.push(-x_side,y_side);
bounds.push(0,0);
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
            // This tile is specific as it has 4 neighboors

            new_bounds = [];
            var Btriangle2 = tile.myclone();
            Btriangle2.Wtriangle2Btriangle();
            Btriangle2.id.push('B2');
            new_bounds.push((bounds[0] + bounds[4]) / 2, (bounds[1] + bounds[5]) / 2);
            new_bounds.push((bounds[2] + bounds[4]) / 2, (bounds[3] + bounds[5]) / 2);
            new_bounds.push(bounds[0], bounds[1]);
            Btriangle2.bounds = new_bounds;
            Btriangle2.scale(0, 0, scaling_ratio);
            Btriangle2.limit = 4;
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
            // This tile is specific as it has 4 neighboors

            new_bounds = [];
            var Wtriangle2 = tile.myclone();
            Wtriangle2.Btriangle2Wtriangle();
            Wtriangle2.id.push('W2');
            new_bounds.push((bounds[0] + bounds[4]) / 2, (bounds[1] + bounds[5]) / 2);
            new_bounds.push((bounds[2] + bounds[4]) / 2, (bounds[3] + bounds[5]) / 2);
            new_bounds.push(bounds[0], bounds[1]);
            Wtriangle2.bounds = new_bounds;
            Wtriangle2.scale(0, 0, scaling_ratio);
            Wtriangle2.limit = 4;
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

function neighborsTriHex(tiles,tilesdict,newtiles,newtilesdict,newdup){
    // iterate tiles and fill neighbors of newtiles
    for(let tile of tiles) {
        switch(tile.id[0]){
        case 'Wtriangle':
            //
            // --------------------------------
            // set Wtriangle's children neighbors
            // --------------------------------
            //
            // new Wtriangle 1
            //
            if (tile.neighbors.length == 3){
                // neighbor 0
                setNeighbor(newtilesdict,tile.id,'W1','Wtriangle',0,tile.id,'B2','Btriangle');
                // neighbor 1
                if(tile.neighbors[1] != undefined){
                    setNeighbor(newtilesdict,tile.id,'W1','Wtriangle',1,tile.neighbors[1],'B1','Btriangle');
                }
                else{
                    setNeighborUndefined(newtilesdict,tile.id,'W1','Wtriangle',1);
                }
                // neighbor 2
                if(tile.neighbors[2] != undefined){
                    setNeighbor(newtilesdict,tile.id,'W1','Wtriangle',2,tile.neighbors[2],'B1','Btriangle');
                }
                else{
                    setNeighborUndefined(newtilesdict,tile.id,'W1','Wtriangle',2);
                }
            }
            else {
                // neighbor 0
                setNeighbor(newtilesdict,tile.id,'W1','Wtriangle',0,tile.id,'B2','Btriangle');
                // neighbor 1
                setNeighbor(newtilesdict,tile.id,'W1','Wtriangle',1,tile.neighbors[2],'B2','Btriangle');
                // neighbor 2
                if(tile.neighbors[3] != undefined){
                    setNeighbor(newtilesdict,tile.id,'W1','Wtriangle',2,tile.neighbors[3],'B1','Btriangle');
                }
                else{
                    setNeighborUndefined(newtilesdict,tile.id,'W1','Wtriangle',2);
                }           
            }
            //
            // new Wtriangle 2
            //
            // neighbor 0
            setNeighbor(newtilesdict,tile.id,'W2','Wtriangle',0,tile.id,'B2','Btriangle');
            // neighbor 1
            if(tile.neighbors[0] != undefined){
                switch(tile.neighbors[0][0]){
                    case 'Wtriangle':
                        setNeighbor(newtilesdict,tile.id,'W2','Wtriangle',1,tile.neighbors[0],'B1','Btriangle');
                    case 'Btriangle':
                        setNeighbor(newtilesdict,tile.id,'W2','Wtriangle',1,tile.neighbors[0],'B2','Btriangle');
                }
            }
            else{
                setNeighborUndefined(newtilesdict,tile.id,'W2','Wtriangle',1);
            }
            // neighbor 2
            setNeighbor(newtilesdict,tile.id,'W2','Wtriangle',2,tile.id,'B1','Btriangle')
            //
            // new Btriangle 1
            //
            // neighbor 0
            setNeighbor(newtilesdict,tile.id,'B1','Btriangle',0,tile.id,'B2','Btriangle');
            // neighbor 1
            if (tile.neighbors.length == 3){
                if(tile.neighbors[1] != undefined){
                    setNeighbor(newtilesdict,tile.id,'B1','Btriangle',1,tile.neighbors[1],'W1','Wtriangle');
                }
                else{
                    setNeighborUndefined(newtilesdict,tile.id,'B1','Btriangle',1);
                }
            }
            else{
                setNeighbor(newtilesdict,tile.id,'B1','Btriangle',1,tile.neighbors[1],'W2','Wtriangle');
            }
            // neighbor 2
            setNeighbor(newtilesdict,tile.id,'B1','Btriangle',2,tile.id,'W2','Wtriangle')
            //
            // new Btriangle 2
            //
            // neighbor 0
            setNeighbor(newtilesdict,tile.id,'B2','Btriangle',0,tile.id,'W1','Wtriangle');
            // neighbor 1
            setNeighbor(newtilesdict,tile.id,'B2','Btriangle',1,tile.id,'B1','Btriangle');
            // neighbor 2
            setNeighbor(newtilesdict,tile.id,'B2','Btriangle',2,tile.id,'W2','Wtriangle');
            // neighbor 3
            if (tile.neighbors.length == 3){
                if(tile.neighbors[2] != undefined){
                    setNeighbor(newtilesdict,tile.id,'B2','Btriangle',3,tile.neighbors[2],'W2','Wtriangle');
                }
                else{
                    setNeighborUndefined(newtilesdict,tile.id,'B2','Btriangle',3);
                }
            }
            else{
                if(tile.neighbors[3] != undefined){
                    setNeighbor(newtilesdict,tile.id,'B2','Btriangle',3,tile.neighbors[3],'W2','Wtriangle');
                }
                else{
                    setNeighborUndefined(newtilesdict,tile.id,'B2','Btriangle',3);
                }

            }
            
            //
            // done
            //
            break;
        case 'Btriangle':
            //
            // --------------------------------
            // set Btriangle's children neighbors
            // --------------------------------
            //
            // new Btriangle 1
            //
            if (tile.neighbors.length == 3){
                // neighbor 0
                setNeighbor(newtilesdict,tile.id,'B1','Btriangle',0,tile.id,'W2','Wtriangle');
                // neighbor 1
                if(tile.neighbors[1] != undefined){
                    setNeighbor(newtilesdict,tile.id,'B1','Btriangle',1,tile.neighbors[1],'W1','Wtriangle');
                }
                else{
                    setNeighborUndefined(newtilesdict,tile.id,'B1','Btriangle',1);
                }
                // neighbor 2
                if(tile.neighbors[2] != undefined){
                    setNeighbor(newtilesdict,tile.id,'B1','Btriangle',2,tile.neighbors[2],'W1','Wtriangle');
                }
                else{
                    setNeighborUndefined(newtilesdict,tile.id,'B1','Btriangle',2);
                }
            }
            else {
                // neighbor 0
                setNeighbor(newtilesdict,tile.id,'B1','Btriangle',0,tile.id,'W2','Wtriangle'); 
                // neighbor 1
                setNeighbor(newtilesdict,tile.id,'B1','Btriangle',1,tile.neighbors[2],'W2','Wtriangle');
                // neighbor 2
                if(tile.neighbors[3] != undefined){
                    setNeighbor(newtilesdict,tile.id,'B1','Btriangle',2,tile.neighbors[3],'W1','Wtriangle');
                }
                else{
                    setNeighborUndefined(newtilesdict,tile.id,'B1','Btriangle',2);
                }
            }
            //
            // new Btriangle 2
            //
            // neighbor 0
            setNeighbor(newtilesdict,tile.id,'B2','Btriangle',0,tile.id,'W2','Wtriangle');
            // neighbor 1
            if(tile.neighbors[0] != undefined){
                switch(tile.neighbors[0][0]){
                case 'Btriangle':
                    setNeighbor(newtilesdict,tile.id,'B2','Btriangle',1,tile.neighbors[0],'W1','Wtriangle');
                case 'Wtriangle':
                    setNeighbor(newtilesdict,tile.id,'B2','Btriangle',1,tile.neighbors[0],'W2','Wtriangle');
                }
            }
            else{
                setNeighborUndefined(newtilesdict,tile.id,'B2','Btriangle',1);
            }
            // neighbor 2
            setNeighbor(newtilesdict,tile.id,'B2','Btriangle',2,tile.id,'W1','Wtriangle')
            //
            // new Wtriangle 1
            //
            // neighbor 0
            setNeighbor(newtilesdict,tile.id,'W1','Wtriangle',0,tile.id,'W2','Wtriangle');
            // neighbor 1
            if (tile.neighbors.length == 3){
                if(tile.neighbors[1] != undefined){
                    setNeighbor(newtilesdict,tile.id,'W1','Wtriangle',1,tile.neighbors[1],'B1','Btriangle');
                }
                else{
                    setNeighborUndefined(newtilesdict,tile.id,'W1','Wtriangle',1);
                }
            }
            else{
                setNeighbor(newtilesdict,tile.id,'W1','Wtriangle',1,tile.neighbors[1],'B2','Btriangle');
            }
            // neighbor 2
            setNeighbor(newtilesdict,tile.id,'W1','Wtriangle',2,tile.id,'B2','Btriangle')
            //
            // new Wtriangle 2
            //
            // neighbor 0
            setNeighbor(newtilesdict,tile.id,'W2','Wtriangle',0,tile.id,'B1','Btriangle');
            // neighbor 1
            setNeighbor(newtilesdict,tile.id,'W2','Wtriangle',1,tile.id,'W1','Wtriangle');
            // neighbor 2
            setNeighbor(newtilesdict,tile.id,'W2','Wtriangle',2,tile.id,'B2','Btriangle');
            // neighbor 3
            if (tile.neighbors.length == 3){
                if(tile.neighbors[2] != undefined){
                    setNeighbor(newtilesdict,tile.id,'W2','Wtriangle',3,tile.neighbors[2],'B2','Btriangle');
                }
                else{
                    setNeighborUndefined(newtilesdict,tile.id,'W2','Wtriangle',3);
                }
            }
            else{
                if(tile.neighbors[3] != undefined){
                    setNeighbor(newtilesdict,tile.id,'W2','Wtriangle',3,tile.neighbors[3],'B2','Btriangle');
                }
                else{
                    setNeighborUndefined(newtilesdict,tile.id,'W2','Wtriangle',3);
                }
            }
            //
            // done
            //
            break;

        default:
            // all tiles should be kite or dart
            console.log("caution: undefined tile type for TriHex, id="+tile.id);
        }
    }
    // neighbors modified by side effect in tilesdict, nothing to return
    return;
}

//
// [6] use default neighbors2bounds
// 

// Not using it

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
    for (var i = 0; i < 6; i++){
        // white triangles
        var newWtriangle = Wtriangle.myclone();
        newWtriangle.id.push('W'+i);

        newWtriangle.rotate(0, 0, i * Math.PI / 3);

        newWtriangle.neighbors.push(undefined);
        newWtriangle.neighbors.push(['Btriangle','B'+(i+5) % 6]);
        newWtriangle.neighbors.push(['Btriangle','B'+i]);

        tiles.push(newWtriangle);
        
        // black triangles
        var newBtriangle = Btriangle.myclone();
        newBtriangle.id.push('B'+i);

        newBtriangle.rotate(0, 0, i * Math.PI / 3);

        newBtriangle.neighbors.push(undefined);
        newBtriangle.neighbors.push(['Wtriangle','W'+(i+7) % 6]);
        newBtriangle.neighbors.push(['Wtriangle','W'+i]);

        tiles.push(newBtriangle);
    }
    
    // call the substitution
    tiles = substitute(
        iterations,
        tiles,
        1,
        substitutionTriHex,
        mydupinfos,
        mydupinfosoriented,
        neighborsTriHex,
        false,
        decorateTriHex
    );

    console.log(tiles)
    // construct tiling
    return new Tiling(tiles);
}

