Tiling.crossTiling = function ({size}={}) { //number of lines of neighbors
	var tils = [];
    if (size >= 1)
        tils.push(cross(0, 0)); //central cross

	for(var i = 1 ; i < size; i++){
        tils.push(cross(-i, 2*i)); //top left of line n° i of neighbors
        tils.push(cross(i, -2*i)); //bottom right of line n° i of neighbors

        for(var k = 1; k < i + 1; k++){
            // from top left, adds crosses until top right and bottow left
            tils.push(cross(-i + 3*k, 2*i - k));
            tils.push(cross(-i - k, 2*i - 3*k));
        }
        for (var j = 1 ; j < i ; j++){
            // from bottom right, adds crosses until one step before top right and bottom left
            tils.push(cross(i - 3*j, (-2)*i + j));
            tils.push(cross(i + j, (-2)*i + 3*j));
        }
	}
	return new Tiling(tils);
}

function cross(x, y){
	var id = [x, y];
	
	var neighbors = [];
	
	/*if(x > 0) neighbors.push([x-1, y]);
	if(x < xMax-1) neighbors.push([x+1, y]);
	if(y > 0) neighbors.push([x, y-1]);
	if(y < yMax-1) neighbors.push([x, y+1]);*/
	
	neighbors.push([x+2, y+1]);
	neighbors.push([x+1, y-2]);
	neighbors.push([x-2, y-1]);
	neighbors.push([x-1, y+2]);
	
	var bounds = [];
    bounds.push(x+0.5, y+0.5);
    bounds.push(x+1.5,y+0.5);
    bounds.push(x+1.5,y-0.5);
    bounds.push(x+0.5,y-0.5);
    bounds.push(x+0.5,y-1.5);
    bounds.push(x-0.5,y-1.5);
    bounds.push(x-0.5,y-0.5);
    bounds.push(x-1.5,y-0.5);
    bounds.push(x-1.5,y+0.5);
    bounds.push(x-0.5,y+0.5);
    bounds.push(x-0.5,y+1.5);
    bounds.push(x+0.5,y+1.5);
				
	return new Tile(id, neighbors, bounds, 4);
}
