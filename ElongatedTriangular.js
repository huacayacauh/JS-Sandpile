Tiling.elongatedTriangular = function ({width, height}={}) {
  var tils = [];
  var count = 0;

  for(var y=0; y<height; y++){
    for(var x=0; x<width; x++){
      if(y % 2 == 0){
        if(count % 2 == 0){
          tils.push(elongT_upTriangle(x, y, width, height));
          tils.push(elongT_downTriangle(x + 0.5, y, width, height));
        } else {
          tils.push(elongT_upTriangle(x + 0.5, y, width, height));
          tils.push(elongT_downTriangle(x, y, width, height));
        }
      } else {
		if((y+1) % 4 == 0){
			tils.push(elongT_square(x, y, width, height));
		}
		else{
			tils.push(elongT_square(x+0.5, y, width, height));
		}
      }
      
    }
    if (y % 2 == 0) {
      count++;
    }
  }

  return new Tiling(tils);
};



function elongT_upTriangle(x, y, width, height){
	var idX=x;
	if(!Number.isInteger(x)){
		idX = x-0.5;
	}
	var id = [idX, y, "up"];
	
	var neighbors = [];
	neighbors.push([idX, y-1])
	neighbors.push([idX, y, "down"])
	
	if(y%4==0){
		neighbors.push([idX-1, y,"down"]);
	}else{
		neighbors.push([idX+1, y,"down"]);
	}

	
	var bounds = [];
	
	bounds.push(x - width/2, y - height/2);
	bounds.push(x + 1 - width/2, y-height/2);
	bounds.push(x + 0.5 -width/2, y+1 - height/2);
	
	return new Tile(id, neighbors, bounds, 3);
}

function elongT_downTriangle(x, y, width, height){
	var idX=x;
	if(!Number.isInteger(x)){
		idX = x-0.5;
	}
	var id = [idX, y, "down"];
	var neighbors = [];
	neighbors.push([idX, y+1]);
	neighbors.push([idX, y,"up"]);
	if(y%4==0){
		neighbors.push([idX+1, y,"up"]);
	}else{
		neighbors.push([idX-1, y,"up"]);
	}
	
	
	var bounds = [];
	
	bounds.push(x - width/2, y+1 - height/2);
	bounds.push(x + 1 - width/2, y+1-height/2);
	bounds.push(x + 0.5 -width/2, y - height/2);
	
	return new Tile(id, neighbors, bounds, 3);
}

function elongT_square(x, y, width, height){
	var idX=x;
	if(!Number.isInteger(x)){
		idX = x-0.5;
	}
	var id = [idX, y];
	
	var neighbors = [];
	

	
	neighbors.push([idX-1, y]);
	neighbors.push([idX+1, y]);
	neighbors.push([idX, y-1,"down"]);
	neighbors.push([idX, y+1,"up"]);
	
	var bounds = [];
	bounds.push(x - width/2, y - height/2);
	bounds.push(x+1 - width/2, y - height/2);
	bounds.push(x+1 - width/2, y+1 - height/2);
	bounds.push(x - width/2, y+1 - height/2);
				
	return new Tile(id, neighbors, bounds, 4);
}

