// 	###############  ROUNDNESS.JS  #################
//	 		Authors : 	FERSULA Jérémy
// 	################################################
// 
// 	To help you dig into this code, the main parts
// 	in this file are indexed via comments.	
//
//		Ex:  [ 2.4 ] - Something
//
//	References to other parts of the app are linked
//	via indexes.
//
//		### indexes a section
//		--- indexes a sub-section
//
//	---
//
//	All relations between indexing in files can be
// 	found on our GitHub :
//
// 		https://github.com/huacayacauh/JS-Sandpile
//
// 	---
//
//  This file is under CC-BY.
//
//	Feel free to edit it as long as you provide 
// 	a link to its original source.
//
// 	################################################

// ################################################
//
// 	[ 1.0 ] 	Measures the roundness of
//				the operation max_stable +
//				Identity.
//				Calculates radius by estimating
//				the center of mass of the tiling,
//				or by measuring from the center
//				of canvas space.
//
// ################################################

var bound_set = [];			// Out of the circle
var init_bounds = false;
var anim_done = false;

var estimate_center = true;
var estimation = [0, 0, 0];

var round_delay = delay;

var show_round = false;

Tiling.prototype.get_roundness = function(){
	
	if(!init_bounds){ // Wait until a circle appear
		round_delay = 0;
		for(var i = 0; i<this.tiles.length; i++){
			if(this.tiles[i].neighbors.length < this.tiles[i].limit){ // If tile on the edge
				if(this.tiles[i].sand != this.tiles[i].limit - 1){    // Not at the limit
					return {"Min":0, "Max":0};						  		// -> There is no circle yet, return
				}
				if(!bound_set.includes(this.tiles[i].id)){
					bound_set.push(this.tiles[i].id);                 // This tile is both on the edge and at the limit, add it to the bound set
				}
			}
		}
		// We have added the edge, but there still are more tiles to add in order to encapsulate the circle
		var added_tiles = [];
		do{
			added_tiles = [];
			for(var i = 0; i<this.tiles.length; i++){
				if(this.tiles[i].sand == this.tiles[i].limit-1){
					if(!bound_set.includes(this.tiles[i].id)) {											// This tile is in the current disk, and at the limit
						for(var j=0; j<this.tiles[i].neighbors.length; j++){
							if(bound_set.includes(this.tiles[this.tiles[i].neighbors[j]].id)){			// This tile qualifies to be added to the bounds
								added_tiles.push(this.tiles[i].id);										// Add it
								break;
							}
						}
					}				
				}	
			}
			for(var i = 0; i<added_tiles.length; i++){
				bound_set.push(added_tiles[i]);			// Add the new found bounds to the bounds set
			}
		} while(added_tiles.length >0);
		
		init_bounds = true;  	// reachable only when all bounds that are < limit are in bound_set
	}
	
	var min_radius = Infinity;
	var max_radius = 0;
	var added_tiles = [];
	for(var i = 0; i<this.tiles.length; i++){
		if(this.tiles[i].sand == this.tiles[i].limit-1){
			if(!bound_set.includes(this.tiles[i].id)) {												// This tile is in the current disk, and at the limit
				for(var j=0; j<this.tiles[i].neighbors.length; j++){
					if(bound_set.includes(this.tiles[this.tiles[i].neighbors[j]].id)){	
						added_tiles.push(this.tiles[i].id);											// Add it
						break;
					}
				}
			}				
		}	
	}
	for(var i = 0; i<added_tiles.length; i++){
		bound_set.push(added_tiles[i]);			// Add the new found bounds to the bounds set
	}
	var circle = []  // Any tile that has a tile in the bound set as a neighbor and is not itself in the bound set 
	for(var i = 0; i<bound_set.length; i++){	
		for(var j=0; j<this.tiles[bound_set[i]].neighbors.length; j++){
			if(!bound_set.includes(this.tiles[this.tiles[bound_set[i]].neighbors[j]].id)){
				circle.push(bound_set[i]);
				break;
			}
		}
	}
	
	var pos = this.mesh.geometry.attributes.position;
	for(var i = 0; i<circle.length; i++){
		if(show_round)
			this.colorTile(circle[i], new THREE.Color(0xFF0000));
		var rad = 0;
		var posX = 0;
		var posY = 0;
		for(var k = 0; k<this.tiles[circle[i]].bounds.length; k+=2){
			posX += this.tiles[circle[i]].bounds[k];
			posY += this.tiles[circle[i]].bounds[k+1];
		}
		posX *= 2.0 / this.tiles[circle[i]].bounds.length;
		posY *= 2.0 / this.tiles[circle[i]].bounds.length;
		rad += (posX - this.center[0])**2;
		rad += (posY - this.center[1])**2;
		rad = Math.sqrt(rad);
		if(rad > max_radius){
			max_radius = rad;
		}
		if(rad < min_radius){
			min_radius = rad;
		}
		
	}
	
	
	if(circle.length == 0){
		round_delay = 0;
		return;										// No use to return anything, the circle did not change. (presumably, the tiling is stable)
	}
	
	round_delay = delay;
	return {"Min":min_radius, "Max":max_radius};
}

// ################################################
//
// 	[ 2.0 ] 	Creates a file corresponding
//				to all measures of roundness
//
// ################################################

async function makeRoundnessFile(Tiling){
	
	Tiling.clear()
	Tiling.addMaxStable();
	if(!currentIdentity)
		findIdentity();
	Tiling.addConfiguration(currentIdentity);
	
	// Make a file out of the function above
	show_round = document.getElementById('roundShow').checked;
	var arr_min = [];
	var arr_max = [];
	
	var done = false;
	
	round_delay = delay;
	
	// Measure roundness and iterate until there is no more circle
	var nb_it = 0;
	var t_render = 0;
	var t_iterate = 0;
	var t_round = 0;
	var temp = 0;
	while(!done){
	
		if(show_round){
			temp = Date.now();
			Tiling.colorTiles();
			t_render += Date.now() - temp;
		}
		
		temp = Date.now();
		var stat = Tiling.get_roundness();
		t_round += Date.now() - temp;
		
		if(stat != null){
			arr_min.push(stat["Min"]);
			arr_max.push(stat["Max"]);
		}
		temp = Date.now();
		done = Tiling.iterate();
		t_iterate += Date.now() - temp;
		
		nb_it++;
		if(nb_it%100 ==0){
			console.log("Iteration :", nb_it, "Circles :", stat);
			console.log("Time elapsed :")
			console.log("Render :", t_render, "Iterate :", t_iterate, "Roundness :", t_round);
			t_render = 0;
			t_iterate = 0;
			t_round = 0;
			
		}
		
		if(show_round){
			await sleep(round_delay);
		}
	}
	Tiling.colorTiles();
	
	// Make the file
	
	bound_set = [];
    init_bounds = false;
	
	var text1 = "";
	for(var i = 0; i<arr_min.length; i++){
		text1 += arr_min[i] + " " + arr_max[i] + "\n"
	}

    var data1 = new Blob([text1], {type: 'text/plain'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
	if (textFile1 !== null) {
      window.URL.revokeObjectURL(textFile1);
    }
    var textFile1 = window.URL.createObjectURL(data1);
	
	anim_done = true;
	
	return [textFile1]; 
}

// ################################################
//
// 	[ 3.0 ] 	Roundness file download
//
//		Same as ImportExport.js [ 2.0 ]
//
// ################################################
handleDownloadRoundness = async function(evt){
	document.getElementById('create3').disabled = true;

    if(currentTiling === undefined) return
    var link = document.getElementById('downloadlink');
	let textFile = await makeRoundnessFile(currentTiling);
	
	link.setAttribute('download', "Sandpile_Roundness.txt");
    link.href = textFile;
	link.click();
	
	document.getElementById('create3').disabled = false;
}


var create3 = document.getElementById('create3');
create3.addEventListener('click', handleDownloadRoundness, false);

// ################################################
//
// 	EOF
//
// ################################################
