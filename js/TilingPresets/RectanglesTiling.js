Tiling.rectanglesTiling = function({width, height}={}){
	var tils = [];

	for(var j = 0; j < width; j++){
		for(var i = 0; i < height; i++){
			if ((j%4 == 0 && i%4 == 0) || (j%4 == 2 && i%4 == 2)){
				tils.push(upLeftRectangle(j, i, width, height));
			}
			else if ((j%4 == 1 && i%4 == 0) || (j%4 == 3 && i%4 == 2)){
				tils.push(upRightRectangle(j, i, width, height));
			}
			else if ((j%4 == 2 && i%4 == 0) || (j%4 == 0 && i%4 == 2)){
				tils.push(horizonDownRectangle(j, i, width, height));
			}
			else if ((j%4 == 2 && i%4 == 1) || (j%4 == 0 && i%4 == 3)){
				tils.push(horizonUpRectangle(j, i, width, height));
			}
		}	
	}
	
	return new Tiling(tils);
}


function upLeftRectangle(x, y, width, height){
	var id = [x, y];
	
	var neighbors = [];
	
	neighbors.push([x+1, y]);
	neighbors.push([x, y+2]);
	neighbors.push([x-2, y+1]);
	neighbors.push([x-2, y]);
	neighbors.push([x, y-1]);
	
	var bounds = [];
	bounds.push(x - width/2, y - height/2);
	bounds.push(x+1 - width/2, y - height/2);
	bounds.push(x+1 - width/2, y+2 - height/2);
	bounds.push(x - width/2, y+2 - height/2);
				
	return new Tile(id, neighbors, bounds, 5);
}

function upRightRectangle(x, y, width, height){
	var id = [x, y];
	
	var neighbors = [];
	
	neighbors.push([x+1, y]);
	neighbors.push([x+1, y+1]);
	neighbors.push([x-1, y+2]);
	neighbors.push([x-1, y]);
	neighbors.push([x-1, y-1]);
	
	var bounds = [];
	bounds.push(x - width/2, y - height/2);
	bounds.push(x+1 - width/2, y - height/2);
	bounds.push(x+1 - width/2, y+2 - height/2);
	bounds.push(x - width/2, y+2 - height/2);
				
	return new Tile(id, neighbors, bounds, 5);
}

function horizonUpRectangle(x, y, width, height){
	var id = [x, y];
	
	var neighbors = [];
	
	neighbors.push([x+2, y-1]);
	neighbors.push([x+1, y+1]);
	neighbors.push([x, y+1]);
	neighbors.push([x-1, y-1]);
	neighbors.push([x, y-1]);
	
	var bounds = [];
	bounds.push(x - width/2, y - height/2);
	bounds.push(x+2 - width/2, y - height/2);
	bounds.push(x+2 - width/2, y+1 - height/2);
	bounds.push(x - width/2, y+1 - height/2);
				
	return new Tile(id, neighbors, bounds, 5);
}

function horizonDownRectangle(x, y, width, height){
	var id = [x, y];
	
	var neighbors = [];
	
	neighbors.push([x+2, y]);
	neighbors.push([x, y+1]);
	neighbors.push([x-1, y]);
	neighbors.push([x, y-2]);
	neighbors.push([x+1, y-2]);
	
	var bounds = [];
	bounds.push(x - width/2, y - height/2);
	bounds.push(x+2 - width/2, y - height/2);
	bounds.push(x+2 - width/2, y+1 - height/2);
	bounds.push(x - width/2, y+1 - height/2);
				
	return new Tile(id, neighbors, bounds, 5);
}


