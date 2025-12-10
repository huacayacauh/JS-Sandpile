// A random rhombus tiling based
// Generation method :
//    1 . generate a very simple periodic tiling
//    2 . for some time : draw at random a tile, draw at random a vertex, try to flip
// reference :  https://lipn.univ-paris13.fr/~fernique/qc/growth_2.pdf section 4
// reference :  https://arxiv.org/abs/1111.7297

// [0] auxiliary values
var cos6 = Math.cos(Math.PI/6);
var sin6 = Math.sin(Math.PI/6);


// [1] tiles 
function xyRhomb(i,j){
    var id = [i,j,'xy'];
    var refX = (2*i+j)*cos6;
    var refY = j*(1+sin6);
    var bounds = [refX, refY, refX+cos6, refY-sin6, refX+2*cos6, refY, refX+cos6, refY+sin6];
    var neighbours = [[i,j-1,'xz'], [i+1,j-1,'yz'], [i,j,'xz'], [i,j,'yz']];
    return new Tile(id, neighbours, bounds, 4);
}

function xzRhomb(i,j){
    var id = [i,j,'xz'];
    var refX = (2*i+j+1)*cos6;
    var refY = j*(1+sin6) + sin6;
    var bounds = [refX, refY, refX+cos6, refY-sin6, refX+cos6, refY+1-sin6, refX, refY+1];
    var neighbours = [[i,j,'xy'], [i+1,j,'yz'], [i,j+1,'xy'], [i,j,'yz']];
    return new Tile(id, neighbours, bounds, 4);    
}

function yzRhomb(i,j){
    var id = [i,j,'yz'];
    var refX = (2*i+j)*cos6;
    var refY = j*(1+sin6);
    var bounds = [refX, refY, refX+cos6, refY+sin6, refX+cos6, refY+sin6+1, refX, refY+1];
    var neighbours = [[i,j,'xy'], [i,j,'xz'], [i-1,j+1,'xy'], [i-1,j,'xz']];
    return new Tile(id, neighbours, bounds, 4);
}



// [2] flip a tile
function flipRhombusTileFromIndex(tiles, tileIndex, vertexIndex){
    // try to flip tile around vertex given the index of the tile in tiles, and the index of the vector between 0 and 3
    var t0Tile = tiles[tileIndex]; // get the corresponding tile
    var t1Id=-1;
    var t2Id=-1;
    if (vertexIndex == 0){ // select the two tiles adjacent to rdTile on either sides of the chosen vertex
	t1Id = t0Tile.neighbors[3];
	t2Id = t0Tile.neighbors[0];
    } else {
	t1Id = t0Tile.neighbors[vertexIndex-1];
	t2Id = t0Tile.neighbors[vertexIndex];
    }
    //console.log('t0Tile', t0Tile);
    //console.log('t0Tile.neighbors', t0Tile.neighbors);
    //console.log('t1Id', t1Id);
    var t1Index = -1;
    var t2Index = -1;
    for(var t = 0; t<tiles.length; t++){
	if (id2key(tiles[t].id) == id2key(t1Id)){
	    t1Index = t;
	}
	if (id2key(tiles[t].id) == id2key(t2Id)){
	    t2Index = t;
	}
    }
    if ((t1Index == -1) || (t2Index == -1)){
	console.log('no-flip');
	return 0; // if the tile is on the boundary of the tiling, then just skip
    }
    //console.log('t1Index', t1Index);
    var t1Tile = tiles[t1Index];
    // console.log('t1Tile', t1Tile);
    // console.log('t1Tile.neighbors', t1Tile.neighbors);
    // console.log('t2Id', t2Id);
    t1TileNeighborKeys  = [id2key(t1Tile.neighbors[0]),
			   id2key(t1Tile.neighbors[1]),
			   id2key(t1Tile.neighbors[2]),
			   id2key(t1Tile.neighbors[3])];
    if (t1TileNeighborKeys.includes(id2key(t2Id))){ // test if a flip is possible
	// we now have 3 tiles t0 t1 and t2 on which we will perform a flip
	console.log('performing a flip');
	var t2Tile = tiles[t2Index];
	var flipCenterX = t0Tile.bounds[2*vertexIndex];
	var flipCenterY = t0Tile.bounds[2*vertexIndex+1];
	// move the tiles around
	// move t0
	var t0TranslationX = flipCenterX - t0Tile.bounds[2*((vertexIndex+2)%4)]; // (vertexIndex+2)%4 is the index of the opposite vertex of the rhombus
	var t0TranslationY = flipCenterY - t0Tile.bounds[2*((vertexIndex+2)%4)+1];
	t0Tile.shift(t0TranslationX, t0TranslationY);
	// move t1
	// stupid method to find which point is the flipCenter in the bounds of t1
	var t1Center = -1;
	for(var i = 0; i < 4; i++){
	    if( (Math.abs(t1Tile.bounds[2*i] -flipCenterX) < p_error) &&
		(Math.abs(t1Tile.bounds[1+2*i] - flipCenterY) < p_error)){
		t1Center = i;
	    }
	}
	var t1TranslationX = flipCenterX - t1Tile.bounds[2*((t1Center+2)%4)]; //
	var t1TranslationY = flipCenterY - t1Tile.bounds[2*((t1Center+2)%4)+1];
	t1Tile.shift(t1TranslationX,t1TranslationY);
	// mote t2
	var t2Center = -1;
	for(var i = 0; i < 4; i++){
	    if( (Math.abs(t2Tile.bounds[2*i] -flipCenterX) < p_error) &&
		(Math.abs(t2Tile.bounds[1+2*i] - flipCenterY) < p_error)){
		t2Center = i;
	    }
	}
	var t2TranslationX = flipCenterX - t2Tile.bounds[2*((t2Center+2)%4)]; //
	var t2TranslationY = flipCenterY - t2Tile.bounds[2*((t2Center+2)%4)+1];
	t2Tile.shift(t2TranslationX,t2TranslationY);
	// TODO update neighbours
	return 1;
    } else {
	console.log('no-flip');
	return 0;
    }
}


// [3] generate tiling

Tiling.SimpleRandomRhombusTiling = function({size, p_random}={}){
    var tiles = [];
    // generate simple tiling
    for(var i = 0; i < 1; i++){
	for(var j = 0; j < 1; j++){
	    tiles.push(xyRhomb(i,j));
	    tiles.push(xzRhomb(i,j));
	    tiles.push(yzRhomb(i,j));
	}
    }
    // // // flip for some time
    // var nbFlips = 0;
    // for(var k = 0; k<5; k++){
    // 	var nbtiles = tiles.length;
    // 	var t0Index = Math.floor(Math.random()*nbtiles); // select a random tile number
    // 	var ptChosen = Math.floor(Math.random()*4); // chose a random vertex of the tile
    // 	nbFlips += flipRhombusTileFromIndex(tiles,t0Index,ptChosen);
    // }
    // console.log('Number of effective flips : ', nbFlips);
    flipRhombusTileFromIndex(tiles,0, 3);
    // NOTE impossible to perform more than one flip due to not having implemented the updated neighborhood
    return new Tiling(tiles);

}


