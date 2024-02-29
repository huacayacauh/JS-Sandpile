Tiling.prismPentTiling = function ({size}={}) { //number of lines of neighbors
	var tils = [];
    if(size >= 1)
        pushUpDownPent(0,0, tils); //central up and down pentagons

    for(var i = 1; i < size; i++){
        // left and right pentagons on line n° i (y = 0)
        pushUpDownPent(i, 0, tils);
        pushUpDownPent(-i, 0, tils);

		for(var j = 1; j < i; j++){
            // diagonals pentagons on line n° i
            pushUpDownPent(i - 0.5*j, 2.25*j, tils);
            pushUpDownPent(i - 0.5*j, -2.25*j, tils);
            pushUpDownPent(-i + 0.5*j, 2.25*j, tils);
            pushUpDownPent(-i + 0.5*j, -2.25*j, tils);
		}

        for (var k = 0 ; k <= i; k++){
            // top pentagons on line n° i
            pushUpDownPent(-0.5*i + k, 2.25*i, tils);
            pushUpDownPent(-0.5*i + k, -2.25*i, tils);
        }
        
	}
	
	return new Tiling(tils);
}

function pushUpDownPent(x, y, tils){
    tils.push(upPent(x,y));
    tils.push(downPent(x,y - 1));
}

function upPent(x, y){
	var id = [x, y];
	
	var neighbors = [];
	
	neighbors.push([x+1, y]); 
	neighbors.push([x+0.5, y+1.25]);
    neighbors.push([x-0.5, y+1.25]);
	neighbors.push([x-1, y]);
	neighbors.push([x, y-1]);
	
	var bounds = [];
    bounds.push(x+0.5, y-0.5);
    bounds.push(x+0.5, y+0.5);
    bounds.push(x, y+0.75);
    bounds.push(x-0.5, y+0.5);
    bounds.push(x-0.5, y-0.5);
				
	return new Tile(id, neighbors, bounds, 5);
}

function downPent(x, y){
	var id = [x, y];
	
	var neighbors = [];
	
	/*if(x > 0) neighbors.push([x-1, y]);
	if(x < xMax-1) neighbors.push([x+1, y]);
	if(y > 0) neighbors.push([x, y-1]);
	if(y < yMax-1) neighbors.push([x, y+1]);*/
	
	neighbors.push([x+1, y]);
	neighbors.push([x, y+1]);
    neighbors.push([x-1, y]);
	neighbors.push([x-0.5, y-1.25]);
	neighbors.push([x+0.5, y-1.25]);
	
	var bounds = [];
    bounds.push(x+0.5, y+0.5);
    bounds.push(x-0.5, y+0.5);
    bounds.push(x-0.5, y-0.5);
    bounds.push(x, y-0.75);
    bounds.push(x+0.5, y-0.5);
				
	return new Tile(id, neighbors, bounds, 5);
}
