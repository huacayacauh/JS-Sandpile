var bound_set = [];
var init_bounds = false;

Tiling.prototype.get_roundness = function(){
	
	if(!init_bounds){ // Wait until a circle appear
		for(var i = 0; i<this.tiles.length; i++){
			if(this.tiles[i].neighbors.length < this.tiles[i].limit){ // If tile on the ledge
				if(this.tiles[i].sand != this.tiles[i].limit - 1){    // Not at the limit
					return;											  // -> There is no circle yet
				}
				if(!bound_set.includes(this.tiles[i].id)){
					bound_set.push(this.tiles[i].id);                 // This tile is both on the ledge and at the limit, add it to the bound set
				}
			}
		}
		var one_added = true;
		while(one_added){ // We have added the ledge, but there still are more tiles to add in order to encapsulate the circle
			one_added = false;
			for(var i = 0; i<this.tiles.length; i++){
				if(!bound_set.includes(this.tiles[i].id)){ 							// if not in bounds
					if(this.tiles[i].sand < this.tiles[i].limit){ 					// if it can be added
						for(var j=0; j<this.tiles[i].neighbors.length; j++){ 		// check its neighbors
							if(bound_set.includes(this.tiles[i].neighbors[j].id)){ 	// if it should be added
								bound_set.push(this.tiles[i].id); 					// add it
								one_added = true; 									// keep adding until there are no more tiles to add
								break;
							}
						}
					}
				}
			}
		}
		init_bounds = true;  	// reachable only when all bounds that are < limit are in bound_set
		return; 				// next iteration, there will be circles.
	}
	
	var min_radius = Infinity;
	var max_radius = 0;
	var current_bounds = [];
	for(var i = 0; i<this.tiles.length; i++){
		if(this.tiles[i].sand == this.tiles[i].limit-1 && !bound_set.includes(this.tiles[i].id)){
			for(var j=0; j<this.tiles[i].neighbors.length; j++){
				if(bound_set.includes(this.tiles[this.tiles[i].neighbors[j]].id)){					// This tile qualifies to be added to the bounds
					current_bounds.push(this.tiles[i].id);											// Add it, and calculate its distance to the center of the canvas
					for(var k = 0; k<this.tiles[i].pointsIndexes.length; k++){
						var rad = this.points.array[this.tiles[i].pointsIndexes[k]*3]**2 + this.points.array[this.tiles[i].pointsIndexes[k]*3 +1]**2 + this.points.array[this.tiles[i].pointsIndexes[k]*3+2]**2;
						rad = Math.sqrt(rad);
						if(rad > max_radius){
							max_radius = rad;
						}
						if(rad < min_radius){
							min_radius = rad;
						}
					}
					break;
				}
			}
		}	
	}
	
	for(var i = 0; i<current_bounds.length; i++){
		bound_set.push(current_bounds[i]);			// Add the new found bounds to the bounds set
	}
	if(current_bounds.length == 0){
		return;										// No use to return anything, the circle did not change. (presumably, the tiling is stable)
	}
	
	return {"Min":min_radius, "Max":max_radius};
}

function makeRoundnessFile(grid){
	// Make a file out of the function above
	
	var arr_min = [];
	var arr_max = [];
	
	var oldTiles = [];
	for(var i = 0; i<grid.tiles.length; i++){
		oldTiles.push(new Tile(grid.tiles[i].id, Array.from(grid.tiles[i].neighbors), Array.from(grid.tiles[i].pointsIndexes)));
	}
	var done = false;
	while(!done){
		done = true;
		for(var i = 0; i<grid.tiles.length; i++){
			if(oldTiles[i].sand != grid.tiles[i].sand){
				oldTiles[i].sand = grid.tiles[i].sand;
				done = false;
			}
		}
		for(var i = 0; i<50; i++){
			var stat = grid.get_roundness();
			if(stat != null){
				arr_min.push(stat["Min"]);
				arr_max.push(stat["Max"]);
			}
			
			grid.iterate();
		}
	}
	grid.colorTiles();
	
	bound_set = [];
    init_bounds = false;
	
	var text1 = "";
	for(var i = 0; i<arr_min.length; i++){
		text1 += arr_min[i] + " " + arr_max[i] + "\n"
	}

    var data1 = new Blob([text1], {type: 'text/plain'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.

    var textFile1 = window.URL.createObjectURL(data1);
	
	return [textFile1]; 
}

handleDownloadRoundness = function(evt){

    if(currentGrid === undefined) return
    var link = document.getElementById('downloadlink');
	
	var textFile = makeRoundnessFile(currentGrid);
	
	link.setAttribute('download', "Sandpile_Roundness.txt");
    link.href = textFile;
	link.click();
}


var create3 = document.getElementById('create3')
create3.addEventListener('click', handleDownloadRoundness, false);