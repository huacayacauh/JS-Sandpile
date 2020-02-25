
var math_phi = (1 + Math.sqrt(5)) /2;

Tiling.penrose0 = function({iterations}={}){
	
	base_bounds = [];
	base_bounds.push(0, 0);
	base_bounds.push(10, 0);
	base_bounds.push(5, Math.sqrt(100*math_phi*math_phi  - 25));
	var base_tile = new Tile(['s'], [], base_bounds, 0);
	
	var tils = [base_tile];
	
	for(var i=0; i<iterations; i++){
		tils = iterate_penrose0(tils);
	}
	var embiggen = Math.pow(math_phi, iterations);
	for(var i=0; i<tils.length; i++){
		for(var j =0; j<tils[i].bounds.length; j++){
			tils[i].bounds[j] *= embiggen;
		}
	}
	console.log("Division done. Computing neighbors ...");
	detect_neighbors(tils);
	
	for(var i=0; i<tils.length; i++){
		//tils[i].limit = tils[i].neighbors.length;
	}
	
	console.log(tils.length);

	return new Tiling(tils);
}

function detect_neighbors(tile_list){
	// Detect neighbors in any tile list by comparing tile bounds
	for(var i=0; i<tile_list.length; i++){
		for(var j=i+1; j<tile_list.length; j++){
			if(are_neighbors(tile_list[i], tile_list[j], 20)){
				
				tile_list[i].neighbors.push(tile_list[j].id);
				tile_list[j].neighbors.push(tile_list[i].id);
			}
		}
	}
}

function are_neighbors(tile1, tile2, heuristic){
	var tol = 0.0001;
	if (Math.pow(tile1.bounds[0] - tile2.bounds[0], 2) + Math.pow(tile1.bounds[1] - tile2.bounds[1], 2) > heuristic*heuristic){
		return false;
	}	
	var answer = check_shared_edge(tile1, tile2, tol);
	if(answer)
		return true;
	else
		return check_shared_edge(tile2, tile1, tol);
}

function check_shared_edge(tile1, tile2, tol){
	for(var i=0; i<tile1.bounds.length; i+=2){
		var max1 = i+2 >= tile1.bounds.length ? 0 : i+2;  // if i+2 > bounds, it means we are looking at the edge closing the tile
		var vector1_x = tile1.bounds[i] - tile1.bounds[max1];
		var vector1_y = tile1.bounds[i+1] - tile1.bounds[max1+1];
		var max_x = Math.max(tile1.bounds[i], tile1.bounds[max1]);
		var min_x = Math.min(tile1.bounds[i], tile1.bounds[max1]);
		var max_y = Math.max(tile1.bounds[i+1], tile1.bounds[max1+1]);
		var min_y = Math.min(tile1.bounds[i+1], tile1.bounds[max1+1]);
		// 1-----------(2------------>2)----------------> 1
		// 2 must be aligned with 1
		// both points of 2 must fall inside 1
		
		for(var j=0; j<tile2.bounds.length; j+=2){
			
			var max2 = j+2 >= tile2.bounds.length ? 0 : j+2;
			var vector2_x = tile2.bounds[j] - tile2.bounds[max2] ;
			var vector2_y = tile2.bounds[j+1] - tile2.bounds[max2  +1];
			
			var prod = vector1_x * vector2_y - vector1_y * vector2_x;

			if(Math.abs(prod) < tol ){
				
				// check is both points of 2 are inside 1
				
				var inside21 = false;
				if(tile2.bounds[j] < max_x + tol && tile2.bounds[j] > min_x - tol){ //2.1x
					if(tile2.bounds[j+1] < max_y + tol && tile2.bounds[j+1] > min_y - tol){ //2.1y
						inside21 = true;
					}
				}
				
				var inside22 = false;
				// at least point one of [2] inside [1]
				if(tile2.bounds[max2] < max_x + tol && tile2.bounds[max2] > min_x - tol){ //2.2x
					if(tile2.bounds[max2+1] < max_y + tol && tile2.bounds[max2+1] > min_y - tol){ //2.2y
						// 2.2 is inside 1
						inside22 = true;
					}
				}
				//both inside
				if(inside21 && inside22)
					return true;
				
				// else, check if at least one is inside and the segments share more than just a point
				
				if(inside21){
					var dist21_11 = Math.abs(tile2.bounds[j] - tile1.bounds[i]) + Math.abs(tile2.bounds[j+1] - tile1.bounds[i+1]);
					var dist21_12 = Math.abs(tile2.bounds[j] - tile1.bounds[max1]) + Math.abs(tile2.bounds[j+1] - tile1.bounds[max1+1]);
					
					if(Math.min(dist21_11, dist21_12) > 2*tol){
						return true;
					}
				}
				
				if(inside22){
					var dist22_11 = Math.abs(tile2.bounds[max2] - tile1.bounds[i]) + Math.abs(tile2.bounds[max2+1] - tile1.bounds[i+1]);
					var dist22_12 = Math.abs(tile2.bounds[max2] - tile1.bounds[max1]) + Math.abs(tile2.bounds[max2+1] - tile1.bounds[max1+1]);
					
					if(Math.min(dist22_11, dist22_12) > 2*tol){
						return true;
					}
				}
				
			}
		}
		
	}
}

function iterate_penrose0(tile_list){
	var new_list = [];
	for(var i=0; i<tile_list.length; i++){
		var tile_type = tile_list[i].id[tile_list[i].id.length-1]; // 's' or 'b' - last element of tile.id
		if( tile_type == 's' ){
			new_list = new_list.concat(cut_small(tile_list[i]));
		} else if( tile_type == 'b' ){
			new_list = new_list.concat(cut_big(tile_list[i]));
		}
	}
	return new_list;
}

function cut_big(tile){
	// Hypothesis : tile.bounds is a golden triangle [1:1:phi], 0 is left basis
	
	// Hypothesis : tile.bounds is a golden triangle [1:phi:phi], 0 is left basis
	var down_x = ( tile.bounds[0*2] - tile.bounds[1*2])/math_phi + tile.bounds[1*2];
	var down_y = (tile.bounds[0*2 + 1] - tile.bounds[1*2 + 1])/math_phi + tile.bounds[1*2 + 1];
	
	var bounds0 = [];
	bounds0.push(tile.bounds[0*2], tile.bounds[0*2 + 1]);
	bounds0.push(tile.bounds[2*2], tile.bounds[2*2 + 1]);
	bounds0.push(down_x, down_y);
	
	//id, neightbors, bounds, limit
	var tile0 = new Tile(tile.id.concat([0, 'b']), [], bounds0, 3);
	tile0.sand = 5;
	
	var bounds1 = [];
	bounds1.push(tile.bounds[2*2], tile.bounds[2*2 + 1]);
	bounds1.push(down_x, down_y);
	bounds1.push(tile.bounds[1*2], tile.bounds[1*2 +1]);
	//id, neightbors, bounds, limit
	var tile1 = new Tile(tile.id.concat([1, 's']), [], bounds1, 3);

	
	return [tile0, tile1];

}

function cut_small(tile){
	// Hypothesis : tile.bounds is a golden triangle [1:phi:phi], 0 is left basis
	var left_x = (tile.bounds[0*2] - tile.bounds[2*2])/math_phi + tile.bounds[2*2];
	var left_y = (tile.bounds[0*2 +1] - tile.bounds[2*2 + 1])/math_phi + tile.bounds[2*2+1];
	var right_x = (tile.bounds[2*2] - tile.bounds[1*2])/math_phi + tile.bounds[1*2];
	var right_y = (tile.bounds[2*2 + 1] - tile.bounds[1*2 +1])/math_phi + + tile.bounds[1*2 + 1];
	
	var bounds0 = [];
	bounds0.push(left_x, left_y);
	bounds0.push(tile.bounds[0*2], tile.bounds[0*2 +1]);
	bounds0.push(tile.bounds[1*2], tile.bounds[1*2 +1]);
	
	//id, neightbors, bounds, limit
	var tile0 = new Tile(tile.id.concat([0, 's']), [], bounds0, 3);
	
	var bounds1 = [];
	bounds1.push(left_x, left_y);
	bounds1.push(right_x, right_y);
	bounds1.push(tile.bounds[1*2], tile.bounds[1*2 +1]);
	//id, neightbors, bounds, limit
	var tile1 = new Tile(tile.id.concat([1, 's']), [], bounds1, 3);
	
	var bounds2 = [];
	bounds2.push(tile.bounds[2*2], tile.bounds[2*2 + 1]);
	bounds2.push(left_x, left_y);
	bounds2.push(right_x, right_y);
	//id, neightbors, bounds, limit
	var tile2 = new Tile(tile.id.concat([2, 'b']), [], bounds2, 3);
	tile2.sand = 5;
	
	return [tile0, tile1, tile2];

}