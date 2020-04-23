Tiling.cairoPenta = function({width, height}={}){
	// Creates a Tiling corresponding to a square Tiling of dimensions width, height
	
	var tils = [];

	for(var j = 0; j < width; j++){
		for(var i = 0; i < height; i++){
			for(var k = 0; k < 4; k++)
				tils.push(Tile.pentaTiles(j, i, k));
		}	
	}

	return new Tiling(tils, false, true);
}


Tile.pentaTiles = function(x, y, k){

	var id = [x, y, k];
	
	var neighbors = [];
	
	if(k==0){
		neighbors.push([x, y, 1]);
		neighbors.push([x, y, 2]);
		neighbors.push([x, y, 3]);
		neighbors.push([x, y-1, 3]);
		neighbors.push([x-1, y, 1]);
	}
	if(k==1){
		neighbors.push([x, y, 0]);
		neighbors.push([x, y, 2]);
		neighbors.push([x+1, y, 0]);
		neighbors.push([x+1, y-1, 3]);
		neighbors.push([x, y-1, 2]);
	}
	if(k==2){
		neighbors.push([x, y, 1]);
		neighbors.push([x, y, 0]);
		neighbors.push([x, y, 3]);
		neighbors.push([x, y+1, 1]);
		neighbors.push([x+1, y, 3]);
	}
	if(k==3){
		neighbors.push([x, y, 0]);
		neighbors.push([x, y, 2]);
		neighbors.push([x-1, y, 2]);
		neighbors.push([x-1, y+1, 1]);
		neighbors.push([x, y+1, 0]);
	}
	
	var bounds = [];
	var d=1/(Math.sqrt(3)-1);
	var h= Math.sqrt(2 * d * d + 0.25); // big h
	var h_xs = Math.sqrt((2 * d * d)*1.5) * 0.5;
	var h_ys = Math.sqrt(d*d - h_xs*h_xs);
	var x_x = h+0.5;  // variation of x when x = x+1
	var x_y = h+0.5;  // variation of y when x = x+1
	var y_x = -h-0.5;
	var y_y = h+0.5;
	
	var x2 = x*x_x + y*y_x;
	var y2= x*x_y + y*y_y;
	
	if(k==0){
		bounds.push(x2, y2);
		bounds.push(x2+h/2 +0.25, y2 +h/2 -0.25);
		bounds.push(x2+0.5, y2 +h);
		bounds.push(x2-0.5, y2 +h);
		bounds.push(x2-h/2 -0.25, y2 +h/2 -0.25);
	}
	if(k==1){
		bounds.push(x2+h/2 +0.25, y2 +h/2 -0.25);
		bounds.push(x2+h_xs+h-h_ys, y2 +h-0.5);
		bounds.push(x2+h_xs+h-h_ys, y2 +h+0.5);
		bounds.push(x2+h/2 +0.25, y2 +2*h - h/2 +0.25);
		bounds.push(x2+0.5, y2 +h);
	}
	if(k==2){
		bounds.push(x2, y2+2*h);
		bounds.push(x2+h/2 +0.25, y2 +2*h - h/2 +0.25);
		bounds.push(x2+0.5, y2 +h);
		bounds.push(x2-0.5, y2 +h);
		bounds.push(x2-h/2 -0.25, y2 +2*h -h/2 +0.25);
	}
	if(k==3){
		bounds.push(x2-h/2 -0.25, y2 +h/2 -0.25);
		bounds.push(x2-h_xs-h+h_ys, y2 +h-0.5);
		bounds.push(x2-h_xs-h+h_ys, y2 +h+0.5);
		bounds.push(x2-h/2 -0.25, y2 +2*h - h/2 +0.25);
		bounds.push(x2-0.5, y2 +h);
	}
	return new Tile(id, neighbors, bounds, 5);
}