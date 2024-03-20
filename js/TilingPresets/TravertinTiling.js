Tiling.travertinTiling = function({width, height}={}){
	// Creates a Tiling corresponding to a square Tiling of dimensions width, height
	
	var tils = [];
	
	for(var j = 0; j < width; j++){ // -->
		for(var i = 0; i < height; i++){ // |^
			if (j%6 == 0 && i%6 == 2){
				tils.push(smallSquare1(j, i, width, height));
			}
			if (j%6 == 1 && i%6 == 0){
				tils.push(smallSquare2(j, i, width, height));
			}
			if (j%6 == 3 && i%6 == 4){
				tils.push(smallSquare3(j, i, width, height));
			}
			if (j%6 == 4 && i%6 == 0){
				tils.push(smallSquare4(j, i, width, height));
			}
			if (j%6 == 1 && i%6 == 1){
				tils.push(bigSquare1(j, i, width, height));
			}
			if (j%6 == 2 && i%6 == 5){
				tils.push(bigSquare2(j, i, width, height));
			}
			if (j%6 == 4 && i%6 == 4){
				tils.push(bigSquare3(j, i, width, height));
			}
			if (j%6 == 5 && i%6 == 0){
				tils.push(bigSquare4(j, i, width, height));
			}
			if (j%6 == 2 && i%6 == 3){
				tils.push(smallRectangle1(j, i, width, height));
			}
			if (j%6 == 3 && i%6 == 1){
				tils.push(smallRectangle2(j, i, width, height));
			}
			if (j%6 == 0 && i%6 == 3){
				tils.push(bigRectangle1(j, i, width, height));
			}
			if (j%6 == 3 && i%6 == 2){
				tils.push(bigRectangle2(j, i, width, height));
			}
		}
	}
	
	return new Tiling(tils);
}


function smallSquare1(x, y, width, height){
	// Creates the Tile in position x, y of a square Tiling

	var id = [x, y];
	
	var neighbors = [];
	
	/*if(x > 0) neighbors.push([x-1, y]);
	if(x < xMax-1) neighbors.push([x+1, y]);
	if(y > 0) neighbors.push([x, y-1]);
	if(y < yMax-1) neighbors.push([x, y+1]);*/
	
	neighbors.push([x-1, y-2]);
	neighbors.push([x+1, y-1]);
	neighbors.push([x, y+1]);
	neighbors.push([x-3, y]);
	
	var bounds = [];
	bounds.push(x - width/2, y - height/2);
	bounds.push(x+1 - width/2, y - height/2);
	bounds.push(x+1 - width/2, y+1 - height/2);
	bounds.push(x - width/2, y+1 - height/2);
				
	return new Tile(id, neighbors, bounds, 4);
}

function smallSquare2(x, y, width, height){

	var id = [x, y];
	
	var neighbors = [];
	neighbors.push([x-1, y-3]);
	neighbors.push([x+1, y-1]);
	neighbors.push([x, y+1]);
	neighbors.push([x-2, y]);
	
	var bounds = [];
	bounds.push(x - width/2, y - height/2);
	bounds.push(x+1 - width/2, y - height/2);
	bounds.push(x+1 - width/2, y+1 - height/2);
	bounds.push(x - width/2, y+1 - height/2);
				
	return new Tile(id, neighbors, bounds, 4);
}

function smallSquare3(x, y, width, height){

	var id = [x, y];
	
	var neighbors = [];	
	neighbors.push([x, y-2]);
	neighbors.push([x+1, y]);
	neighbors.push([x-1, y+1]);
	neighbors.push([x-1, y-1]);
	
	var bounds = [];
	bounds.push(x - width/2, y - height/2);
	bounds.push(x+1 - width/2, y - height/2);
	bounds.push(x+1 - width/2, y+1 - height/2);
	bounds.push(x - width/2, y+1 - height/2);
				
	return new Tile(id, neighbors, bounds, 4);
}

function smallSquare4(x, y, width, height){

	var id = [x, y];
	
	var neighbors = [];	
	neighbors.push([x, y-2]);
	neighbors.push([x+1, y]);
	neighbors.push([x-1, y+1]);
	neighbors.push([x-2, y-1]);
	
	var bounds = [];
	bounds.push(x - width/2, y - height/2);
	bounds.push(x+1 - width/2, y - height/2);
	bounds.push(x+1 - width/2, y+1 - height/2);
	bounds.push(x - width/2, y+1 - height/2);
				
	return new Tile(id, neighbors, bounds, 4);
}

function bigSquare1(x, y, width, height){

	var id = [x, y];
	
	var neighbors = [];	
	neighbors.push([x, y-1]);
	neighbors.push([x+1, y-2]);
	neighbors.push([x+2, y]);
	neighbors.push([x+2, y+1]);
	neighbors.push([x+1, y+2]);
	neighbors.push([x-1, y+2]);
	neighbors.push([x-1, y+1]);
	neighbors.push([x-2, y-1]);
	
	var bounds = [];
	bounds.push(x - width/2, y - height/2);
	bounds.push(x+2 - width/2, y - height/2);
	bounds.push(x+2 - width/2, y+2 - height/2);
	bounds.push(x - width/2, y+2 - height/2);
				
	return new Tile(id, neighbors, bounds, 8);
}

function bigSquare2(x, y, width, height){

	var id = [x, y];
	
	var neighbors = [];
	neighbors.push([x, y-2]);
	neighbors.push([x+1, y-1]);
	neighbors.push([x+2, y-1]);
	neighbors.push([x+2, y+1]);
	neighbors.push([x+1, y+2]);
	neighbors.push([x-1, y+2]);
	neighbors.push([x-1, y+1]);
	neighbors.push([x-2, y-2]);
	
	var bounds = [];
	bounds.push(x - width/2, y - height/2);
	bounds.push(x+2 - width/2, y - height/2);
	bounds.push(x+2 - width/2, y+2 - height/2);
	bounds.push(x - width/2, y+2 - height/2);
				
	return new Tile(id, neighbors, bounds, 8);
}

function bigSquare3(x, y, width, height){

	var id = [x, y];
	
	var neighbors = [];
	neighbors.push([x-2, y-1]);
	neighbors.push([x+2, y-1]);
	neighbors.push([x+1, y+2]);
	neighbors.push([x, y+2]);
	neighbors.push([x-2, y+1]);
	neighbors.push([x-1, y]);
	
	var bounds = [];
	bounds.push(x - width/2, y - height/2);
	bounds.push(x+2 - width/2, y - height/2);
	bounds.push(x+2 - width/2, y+2 - height/2);
	bounds.push(x - width/2, y+2 - height/2);
				
	return new Tile(id, neighbors, bounds, 6);
}

function bigSquare4(x, y, width, height){

	var id = [x, y];
	
	var neighbors = [];	
	neighbors.push([x-1, y-2]);
	neighbors.push([x+1, y-3]);
	neighbors.push([x+2, y]);
	neighbors.push([x+2, y+1]);
	neighbors.push([x+1, y+2]);
	neighbors.push([x-2, y+2]);
	neighbors.push([x-2, y+1]);
	neighbors.push([x-1, y]);
	
	var bounds = [];
	bounds.push(x - width/2, y - height/2);
	bounds.push(x+2 - width/2, y - height/2);
	bounds.push(x+2 - width/2, y+2 - height/2);
	bounds.push(x - width/2, y+2 - height/2);
				
	return new Tile(id, neighbors, bounds, 8);
}

function smallRectangle1(x, y, width, height){

	var id = [x, y];
	
	var neighbors = [];	
	neighbors.push([x-1, y-2]);
	neighbors.push([x+1, y-1]);
	neighbors.push([x+1, y+1]);
	neighbors.push([x, y+2]);
	neighbors.push([x-2, y]);
	
	var bounds = [];
	bounds.push(x - width/2, y - height/2);
	bounds.push(x+1 - width/2, y - height/2);
	bounds.push(x+1 - width/2, y+2 - height/2);
	bounds.push(x - width/2, y+2 - height/2);
				
	return new Tile(id, neighbors, bounds, 5);
}

function smallRectangle2(x, y, width, height){

	var id = [x, y];
	
	var neighbors = [];	
	neighbors.push([x-1, y-2]);
	neighbors.push([x+1, y-1]);
	neighbors.push([x+2, y-1]);
	neighbors.push([x, y+1]);
	neighbors.push([x-2, y]);
	
	var bounds = [];
	bounds.push(x - width/2, y - height/2);
	bounds.push(x+2 - width/2, y - height/2);
	bounds.push(x+2 - width/2, y+1 - height/2);
	bounds.push(x - width/2, y+1 - height/2);
				
	return new Tile(id, neighbors, bounds, 5);
}

function bigRectangle1(x, y, width, height){

	var id = [x, y];
	
	var neighbors = [];	
	neighbors.push([x, y-1]);
	neighbors.push([x+1, y-2]);
	neighbors.push([x+2, y]);
	neighbors.push([x+2, y+2]);
	neighbors.push([x+1, y+3]);
	neighbors.push([x-1, y+3]);
	neighbors.push([x-2, y+1]);
	neighbors.push([x-3, y-1]);
	
	var bounds = [];
	bounds.push(x - width/2, y - height/2);
	bounds.push(x+2 - width/2, y - height/2);
	bounds.push(x+2 - width/2, y+3 - height/2);
	bounds.push(x - width/2, y+3 - height/2);
				
	return new Tile(id, neighbors, bounds, 8);
}

function bigRectangle2(x, y, width, height){

	var id = [x, y];
	
	var neighbors = [];	
	neighbors.push([x, y-1]);
	neighbors.push([x+2, y-2]);
	neighbors.push([x+3, y]);
	neighbors.push([x+3, y+1]);
	neighbors.push([x+1, y+2]);
	neighbors.push([x, y+2]);
	neighbors.push([x-1, y+1]);
	neighbors.push([x-2, y-1]);
	
	var bounds = [];
	bounds.push(x - width/2, y - height/2);
	bounds.push(x+3 - width/2, y - height/2);
	bounds.push(x+3 - width/2, y+2 - height/2);
	bounds.push(x - width/2, y+2 - height/2);
				
	return new Tile(id, neighbors, bounds, 8);
}
