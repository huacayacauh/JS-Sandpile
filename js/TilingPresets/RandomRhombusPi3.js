// A random rhombus tiling based
// Generation method :
//    1 . generate a very simple periodic tiling
//    2 . for some time : draw at random a tile, draw at random a vertex, try to flip
// reference :  https://lipn.univ-paris13.fr/~fernique/qc/growth_2.pdf section 4
// reference :  https://arxiv.org/abs/1111.7297

// [0] auxiliary values


// [1] tiles //TODO 
function xyRhomb(x,y,z, edgeLength){
}

function xzRhomb(x,y,z, edgeLength){
}

function yzRhomb(x,y,z, edgeLength){
}



// [2] flip a tile
function flipRhombusTile(tiles, tile, vertex){
    // try to flip tile around vertex
    // TODO 
    return tiles;
}


// [3] generate tiling

Tiling.SimpleRandomRhombusTiling = function({size, p_random}={}){
    var tiles = [];
    // generate simple tiling
    
    // flip for some time

    return new Tiling(tiles);

}


