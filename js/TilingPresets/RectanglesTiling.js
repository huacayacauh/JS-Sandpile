// Rectangle tiling
// 
// Checkerboard like tiling by 1×2 rectangles arranged in two types of squares : horizontal or vertical
// for simplicity of code, we implement four types of tiles : two horizontal rectangles (Up and Down in a horizontal square) and two vertical rectangles (Left or Right in a vertical square)
//
// FIXME maybe better description 
Tiling.rectanglesTiling = function({width, height}={}){
    var tils = [];
    for(var j = 0; j < width; j++){
	for(var i = 0; i < height; i++){
	    if ((j%4 == 0 && i%4 == 0) || (j%4 == 2 && i%4 == 2)){
		tils.push(verticalLeftRectangle(j, i, width, height));
	    }
	    else if ((j%4 == 1 && i%4 == 0) || (j%4 == 3 && i%4 == 2)){
		tils.push(verticalRightRectangle(j, i, width, height));
	    }
	    else if ((j%4 == 2 && i%4 == 0) || (j%4 == 0 && i%4 == 2)){
		tils.push(horizontalDownRectangle(j, i, width, height));
	    }
	    else if ((j%4 == 2 && i%4 == 1) || (j%4 == 0 && i%4 == 3)){
		tils.push(horizontalUpRectangle(j, i, width, height));
	    }
	}	
    }  
    return new Tiling(tils);
}
function verticalLeftRectangle(x, y, width, height){
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

function verticalRightRectangle(x, y, width, height){
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

function horizontalUpRectangle(x, y, width, height){
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

function horizontalDownRectangle(x, y, width, height){
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


