// This code is part of JS-Sandpile (https://github.com/huacayacauh/JS-Sandpile/)
// CC-BY Valentin Darrigo, Jeremy Fersula, Kevin Perrot

//
// [0]
// Measure roundness during the
// stabilization of ( max-stable + identity )
//
// Produces a file with all measures of roundness,
// one iteration = one line "innerRadius/outerRadius/roundness,"
// from m+e until m included
//

//
// [ 0.0 ] Event handling and file download
//         Calls makeRoundnessFile
//         Same as ImportExport.js [ 2.0 ]
//

handleDownloadRoundness = async function(evt){
    // begin: disable button
    document.getElementById('createRoundness').disabled = true;

    if(currentTiling === undefined) return
    var link = document.getElementById('downloadlink');
    let textFile = await makeRoundnessFile(currentTiling);
    link.setAttribute('download', "JS-Sandpile_Roundness.txt");
    link.href = textFile;
    link.click();
	
    // end: enable button
    document.getElementById('createRoundness').disabled = false;
}

// event listener: click on createRoundness calls handleDownloadRoundness
var createRoundness = document.getElementById('createRoundness');
createRoundness.addEventListener('click', handleDownloadRoundness, false);

//
// [ 0.1 ] Global variables to be initialized by makeRoundnessFile
//

// computed once
var borderTiles = null; // tiles touching the border, ids only
var smallestDistancedict = null; // smallest distance of each tile to (0,0)
var biggestDistancedict = null; // biggest distance of each tile to (0,0)
var inscribedCircleRadius = 0; // radius of inscribed circle
var circumscribedCircleRadius = 0; // radius of circumscribed circle

// updated at each step
var innerTiles_touches_border = true; // get_roundness is separated into two phases according to this
var innerTiles_touches_border_previous = true; // to log phase transitions only once
var outerTiles = null; // tiles at max-stable connected to the border, ids only
var frontierTiles = null; // outerTiles having a neighbor in innerTiles (used in phase 2 only)

//
// [ 0.2 ] Compute the radius of the tiling's [inscribed,circumscribed] circles
//         Uses borderTiles
//
function circles_radii(tiling){
  // get border bounds
  let borderEdges = []; // pairs of points (pairs of coordinates)
  let r_error=0.01;
  for(let id of borderTiles){
    // check which edges are on the border:
    // iff they are not shared with a neighbor tile (up to r_error)
    let tile = tiling.tiles[id];
    for(let i=0; i<tile.bounds.length; i+=2){
      let x1 = tile.bounds[i];
      let y1 = tile.bounds[i+1];
      let x2 = tile.bounds[(i+2)%tile.bounds.length];
      let y2 = tile.bounds[(i+3)%tile.bounds.length];
      // check neighbors' edges
      let edge_shared = false;
      for(let nid of tile.neighbors){
        let ntile = tiling.tiles[nid];
        for(let j=0; j<ntile.bounds.length; j+=2){
          let x3 = ntile.bounds[j];
          let y3 = ntile.bounds[j+1];
          let x4 = ntile.bounds[(j+2)%ntile.bounds.length];
          let y4 = ntile.bounds[(j+3)%ntile.bounds.length];
          // up to r_error
          if( ( distance(x1,y1,x3,y3)<r_error && distance(x2,y2,x4,y4)<r_error )
           || ( distance(x1,y1,x4,y4)<r_error && distance(x2,y2,x3,y3)<r_error ) ){
            // edge is shared
            edge_shared = true;
            break;
          }
        }
        if(edge_shared){break;} // shortcut
      }
      if(!edge_shared){
        // this edge has its bounds on the border
        borderEdges.push([[x1,y1],[x2,y2]]);
      }
    }
  }
  // compute distance to (0,0) of border edges
  let borderEdgeDistances = borderEdges.map(e => distancePointSegment(0,0,e[0][0],e[0][1],e[1][0],e[1][1]));
  // compute distances to (0,0) of bounds from border edges
  let borderDistances = borderEdges.flat(1).map(b => distance(0,0,b[0],b[1]));

  // inscribed is the smallest distance to (0,0)
  // upon edges on the border (not simply bounds)
  let inscribed = Math.min(...borderEdgeDistances);

  // circumscribed is the largest bound distance to (0,0)
  //let circumscribed = Math.max(...Array.from(innerdistancedict.values()));
  // shortcut: upon bounds on the border
  let circumscribed = Math.max(...borderDistances);
  
  // done
  return [inscribed,circumscribed];
}

//
// [ 1.0 ] Compute the current roundness
//

// side effect on:
// * outerTiles
// * frontierTiles (used in phase 2 only)
// * innerTiles_touches_border (_previous)
Tiling.prototype.get_roundness = function(){
  // the procedure is separated into two phases
  if(innerTiles_touches_border){
    // phase 1: roundness measure is messy:
    // recompute from the border at each step

    // reset outerTiles
    outerTiles = [];
    let tileStack = Array.from(borderTiles);
    while(tileStack.length != 0){
      let id = tileStack.shift();
      let tile = this.tiles[id];
      if((!outerTiles.includes(id)) && (tile.sand == tile.limit-1)){
        // new outerTile
        outerTiles.push(id);
        tileStack.push(...tile.neighbors);
      }
    }

    // update innerTiles_touches_border, frontierTiles
    if(borderTiles.filter(id => !outerTiles.includes(id)).length == 0){
      // all borderTiles are outerTiles: transition to phase 2
      innerTiles_touches_border = false;
      // set frontierTiles
      frontierTiles = [];
      for(let id of outerTiles){
        let tile = this.tiles[id];
        if(tile.neighbors.filter(nid => {
            let ntile = this.tiles[nid];
            return ntile.sand != ntile.limit-1;
          }).length > 0){
          // a neighbor in innerTiles
          frontierTiles.push(id);
        }
      }
    }
    // end of phase 1
  }
  else{
    // phase 2: the circle slowly shrinks
    // check and exploit the assumption that outerTiles only grows
    // (otherwise an outerTiles (from frontierTiles) receives some grain
    // and triggers the toppling of all outerTiles)

    // update outerTiles, frontierTiles
    // use the fact that only frontierTiles can change their sand content
    let outerTiles_new = [];
    if(frontierTiles.filter(id => this.tiles[id].sand == this.tiles[id].limit-1).length != frontierTiles.length){
      // some frontierTiles are not outerTiles anymore: recompute all as in phase 1
      innerTiles_touches_border = true;
      return this.get_roundness();
    }
    else{
      // frontierTiles are included in outerTiles: add new outerTiles
      let tileStack = Array.from(frontierTiles.map(id => this.tiles[id].neighbors).flat(1));
      while(tileStack.length != 0){
        let id = tileStack.shift();
        let tile = this.tiles[id];
        if((!outerTiles.includes(id)) && (tile.sand == tile.limit-1)){
          // new outerTile
          outerTiles.push(id);
          outerTiles_new.push(id);
          tileStack.push(...tile.neighbors);
        }
      }
      // set frontierTiles
      // shortcut: among old frontierTiles and new outerTiles
      frontierTiles_new = [];
      for(let id of frontierTiles.concat(outerTiles_new)){
        let tile = this.tiles[id];
        if(tile.neighbors.filter(nid => {
            let ntile = this.tiles[nid];
            return ntile.sand != ntile.limit-1;
          }).length > 0){
          // a neighbor in innerTiles
          frontierTiles_new.push(id);
        }
      }
      frontierTiles = frontierTiles_new;
    }

    // update innerTiles_touches_border (check regression to phase 1)
    if(borderTiles.filter(id => !outerTiles.includes(id)).length > 0){
      // some borderTiles are not outerTiles: transition to phase 1
      innerTiles_touches_border = true;
    }
    // end of phase 2
  }

  // compute outerRadius
  let outerRadius = 0;
  if(outerTiles.length == 0){
    // no outerTiles => inscribed circle
    outerRadius = inscribedCircleRadius;
  }
  else{
    // compute smallest distance of outerTiles (upper bounded by inscribed circle)
    // shortcut: among fontierTiles during phase 2
    let outerTiles_smallest = null; // outTiles to consider
    if(innerTiles_touches_border){
      outerTiles_smallest = outerTiles;
    }
    else{
      outerTiles_smallest = frontierTiles;
    }
    let smallestDistances_outerTiles = outerTiles_smallest.map(id => smallestDistancedict.get(id));
    if(smallestDistances_outerTiles.length == 0){
      // when all tiles are outerTiles
      // then frontierTiles and outerTiles_smallest and smallestDistances_outerTiles are [],
      // and Math.min returns Infinity...
      outerRadius = 0;
    }
    else{
      let smallestDistance_outerTiles = Math.min(...smallestDistances_outerTiles);
      outerRadius = Math.min(inscribedCircleRadius,smallestDistance_outerTiles);
    }
  }

  // compute innerRadius
  // from a subset of innerTiles only
  let innerTiles_sub = [];
  // 1. borderTiles (if some inner tiles touch the border)
  if(innerTiles_touches_border){
     innerTiles_sub.push(...borderTiles.filter(id => !outerTiles.includes(id)));
  }
  // 2. neighbors of frontierTiles
  frontierTiles.forEach(id => {
    let tile = this.tiles[id];
    tile.neighbors.forEach(nid => {
      let ntile = this.tiles[nid];
      if(ntile.sand != ntile.limit-1){
        innerTiles_sub.push(nid);
      }
    });
  });
  // innerTiles_sub is ready
  let innerRadius = 0;
  if(innerTiles_sub.length == 0){
    //no innerTiles
    innerRadius = 0;
  }
  else{
    // compute biggest distance of innerTiles
    let biggestDistances_innerTiles = innerTiles_sub.map(id => biggestDistancedict.get(id));
    innerRadius = Math.max(...biggestDistances_innerTiles);
  }

  return [outerRadius,innerRadius];
}

//
// [ 1.1 ] Create a file with all measures of roundness,
//         one iteration = one line "innerRadius/outerRadius/roundness,"
//         from m+e until m included
//         (this is the main function called)
//

async function makeRoundnessFile(tiling){
  // set up max-stable + identity
  tiling.clear()
  tiling.addMaxStable();
  if(!currentIdentity){findIdentity();}
  tiling.addConfiguration(currentIdentity);
  tiling.colorTiles();
  reset_number_of_steps();

  // log (after identity)
  console.log("compute roundness");

  // file text variable
  var roundness_file_text = "";

  // whether to animate roundness or not
  var show_roundness = document.getElementById('roundShow').checked;

  // compute border tiles
  console.log("* compute border tiles");
  borderTiles = tiling.tiles.filter(tile =>
    tile.neighbors.length != tile.bounds.length/2
  ).map(tile => tile.id);

  // precompute the biggest and smallest distance from (0,0) for all tiles
  console.log("* precompute distances for all tiles");
  smallestDistancedict = new Map();
  biggestDistancedict = new Map();
  tiling.tiles.forEach(tile => {
    // compute an array of distances for all bounds and edges
    let boundsDistances = [];
    let edgesDistances = [];
    for(let i=0; i<tile.bounds.length; i+=2){
      boundsDistances.push(distance(0,0,tile.bounds[i],tile.bounds[i+1]));
      edgesDistances.push(distancePointSegment(0,0,tile.bounds[i],tile.bounds[i+1],tile.bounds[(i+2)%tile.bounds.length],tile.bounds[(i+3)%tile.bounds.length]));
    }
    // smallest distance from edges
    smallestDistancedict.set(tile.id,Math.min(...edgesDistances));
    // biggest distance from bounds
    biggestDistancedict.set(tile.id,Math.max(...boundsDistances));
  });

  // compute inscribed and circumscribed circle radii
  console.log("* compute radii");
  let radii = circles_radii(tiling);
  inscribedCircleRadius = radii[0];
  circumscribedCircleRadius = radii[1];
  console.log("  inscribed radius="+inscribedCircleRadius);
  console.log("  circumscribed radius="+circumscribedCircleRadius);

  // initialize tile sets
  outerTiles = [];
  frontierTiles = [];
  innerTiles_touches_border = true;
  innerTiles_touches_border_previous = true;

  // measure roundness, push to file, and iterate
  console.log("* measure roundness at each step from m+e to e");
  var is_stable = false;
  while(!is_stable){
    // get roundness
    // (side effect on outerTiles, frontierTiles, innerTiles_touches_border)
    let roundness = tiling.get_roundness();

    // log phase transition
    if(innerTiles_touches_border != innerTiles_touches_border_previous){
      console.log("  phase transition at step "+number_of_steps+": innerTiles touches border="+innerTiles_touches_border);
      innerTiles_touches_border_previous = innerTiles_touches_border;
    }
    // push to file
    roundness_file_text += roundness[0].toFixed(3)+"/"+
                           roundness[1].toFixed(3)+"/"+
                           (roundness[1]-roundness[0]).toFixed(3)+",\n";

    // iterate
    is_stable = tiling.iterate();
    increment_number_of_steps()
    if(show_roundness){
      // configuration already iterated
      // 1. plot roundnesses
      // caution: THREE.CircleGeometry does not like circles of radius 0...
      if(roundness[0]>0){
        // plot outer radius
        let outerCircleGeometry = new THREE.CircleGeometry(roundness[0],64);
        outerCircleGeometry.vertices.splice(0,1); // close the circle
                                                  // source: https://stackoverflow.com/a/61312034
        let outerCircleMaterial = new THREE.MeshBasicMaterial({color:0x0000ff});
        // var for app.scene.remove
        var outerCircle = new THREE.LineLoop(outerCircleGeometry,outerCircleMaterial);
        app.scene.add(outerCircle);
      }
      if(roundness[1]>0){
        // plot inner radius
        let innerCircleGeometry = new THREE.CircleGeometry(roundness[1],64);
        innerCircleGeometry.vertices.splice(0,1);
        let innerCircleMaterial = new THREE.MeshBasicMaterial({color:0xff0000});
        // var for app.scene.remove
        var innerCircle = new THREE.LineLoop(innerCircleGeometry,innerCircleMaterial);
        app.scene.add(innerCircle);
      }
      // 2. wait
      await sleep(delay);
      // 3. unplot roundnesses
      app.scene.remove(outerCircle);
      app.scene.remove(innerCircle);
      // 4. update configuration
      tiling.colorTiles();
    }
  }
  // stability reached
  console.log("* roundness data is ready to create file");

  // create file from roundness_file_text
  var roundness_data = new Blob([roundness_file_text], {type: 'text/plain'});
  // If we are replacing a previously generated file we need to
  // manually revoke the object URL to avoid memory leaks.
  if (roundness_file !== null) {
          window.URL.revokeObjectURL(roundness_file);
  }
  var roundness_file = window.URL.createObjectURL(roundness_data);
  
  // done
  console.log("done");
  tiling.colorTiles();
  return [roundness_file]; 
}




// ################################################
// ################################################
// ################################################
// ################################################
//
// BELOW IS VERSION 1 (OBSOLETE)
//
// ################################################
// ################################################
// ################################################
// ################################################

var bound_set = [];			// Out of the circle
var init_bounds = false;

var round_delay = delay;

var show_round = false;

Tiling.prototype.get_roundness_version1 = function(){
	
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
// 	[ 2.0 ] Creates a file corresponding
//	        to all measures of roundness
//	        (this is the main function called)
//
// ################################################

async function makeRoundnessFile_version1(Tiling){
	
        // set up max-stable + identity
	Tiling.clear()
	Tiling.addMaxStable();
	if(!currentIdentity)
		findIdentity();
	Tiling.addConfiguration(currentIdentity);
	
	// make a file out of the function [ 1.0 ]
        // toto
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
	
	return [textFile1]; 
}
