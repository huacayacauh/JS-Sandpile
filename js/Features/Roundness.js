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
    document.getElementById('createRoundnessFast').disabled = true;

    if(currentTiling === undefined){return;}
    var link = document.getElementById('downloadlink');
    let textFile = await makeRoundnessFile(currentTiling);
    link.setAttribute('download', "JS-Sandpile_Roundness.txt");
    link.href = textFile;
    link.click();
	
    // end: enable button
    document.getElementById('createRoundness').disabled = false;
    document.getElementById('createRoundnessFast').disabled = false;
}

// event listener: click on createRoundness calls handleDownloadRoundness
var createRoundness = document.getElementById('createRoundness');
createRoundness.addEventListener('click', handleDownloadRoundness, false);

//
// [ 0.1 ] Same as [ 0.0 ], for Faster roundness
// 

handleDownloadRoundnessFast = async function(evt){
    // begin: disable buttons
    document.getElementById('createRoundness').disabled = true;
    document.getElementById('createRoundnessFast').disabled = true;

    if(currentTiling === undefined){return;}
    var link = document.getElementById('downloadlink');
    let textFile = await makeRoundnessFileFast(currentTiling);
    link.setAttribute('download', "JS-Sandpile_RoundnessFast.txt");
    link.href = textFile;
    link.click();
	
    // end: enable button
    document.getElementById('createRoundness').disabled = false;
    document.getElementById('createRoundnessFast').disabled = false;
}

// event listener fast: click on createRoundnessFast calls handleDownloadRoundnessFast
var createRoundnessFast = document.getElementById('createRoundnessFast');
createRoundnessFast.addEventListener('click', handleDownloadRoundnessFast, false);

//
// [ 0.1 ] Global variables to be initialized by makeRoundnessFile
//

// computed once
let r_error=0.001; // take into account rounding error in coordinates
var borderTiles = null; // tiles touching the border, ids only
var smallestDistancedict = null; // smallest distance of each tile to (0,0)
var biggestDistancedict = null; // biggest distance of each tile to (0,0)
var inscribedCircleRadius = 0; // radius of inscribed circle
var circumscribedCircleRadius = 0; // radius of circumscribed circle

// updated at each step
var phase = 1; // get_roundness is separated into three subsequent phases according to this:
               // phase 1: erratic behvior
               // phase 2: innerRadius \leq inscribed radius
               // phase 3: borderTiles \subseteq outerTiles
               // remark: we can intuitively expect a direct transition from phase 1 to phase 3
               //         when the condition of phase 2 is met (because tiles are polygons, but r_error may mess it up?)
var phase_previous = 1; // to log phase transitions only once
var outerTiles = null; // tiles at max-stable connected to the border, ids only
var frontierTiles = null; // outerTiles having a neighbor in innerTiles (used in phase 2 only)

//
// [ 0.2 ] Compute the radius of the tiling's [inscribed,circumscribed] circles
//         Uses borderTiles
//
function circles_radii(tiling){
  // get border bounds
  let borderEdges = []; // pairs of points (pairs of coordinates)
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
// * frontierTiles
// * phase
Tiling.prototype.get_roundness = function(){
  // the procedure is separated into two phases
  if(phase != 3){
    // phase 1 and 2: recompute from the border at each step

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

    // end of phase 1
  }
  else{
    // phase 3: the circle slowly shrinks
    // check and exploit the assumption that outerTiles only grows
    // (otherwise an outerTiles (from frontierTiles) receives some grain
    // and triggers the toppling of all outerTiles)

    // update outerTiles, frontierTiles
    // use the fact that only frontierTiles can change their sand content
    let outerTiles_new = [];
    if(frontierTiles.filter(id => this.tiles[id].sand != this.tiles[id].limit-1).length > 0){
      // some frontierTiles are not outerTiles anymore: recompute all as in phase 1+2
      phase = 2;
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
      let frontierTiles_new = [];
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
    // shortcut: among fontierTiles only
    if(frontierTiles.length == 0){
      // when all tiles are outerTiles then frontierTiles is [],
      // and Math.min returns -Infinity...
      outerRadius = 0;
    }
    else{
      let smallestDistances_outerTiles = frontierTiles.map(id => smallestDistancedict.get(id));
      let smallestDistance_outerTiles = Math.min(...smallestDistances_outerTiles);
      outerRadius = Math.min(inscribedCircleRadius,smallestDistance_outerTiles);
    }
  }

  // compute innerRadius
  // from a subset of innerTiles only
  let innerTiles_sub = [];
  // 1. borderTiles (if some inner tiles touch the border)
  if(phase < 3){
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

  // update phase
  if(phase == 1){
    // check transition to phase 2 (with rounding error)
    if(innerRadius <= inscribedCircleRadius+r_error){
      // transition to phase 2
      phase = 2;
    }
  }
  if(phase == 2){
    // check transition to phase 3
    if(borderTiles.filter(id => !outerTiles.includes(id)).length == 0){
      // transition to phase 3 (all borderTiles are outerTiles)
      phase = 3;
    }
    // check regression to phase 1 (with rounding error)
    if(innerRadius > inscribedCircleRadius+r_error){
      // regression to phase 1
      phase = 1;
    }
  }
  if(phase == 3){
    // check regression to phase 2
    if(borderTiles.filter(id => !outerTiles.includes(id)).length > 0){
      // regression to phase 3 (some borderTiles are not outerTiles)
      phase = 2;
      // check regression to phase 1 (with rounding error)
      if(innerRadius > inscribedCircleRadius+r_error){
        // regression to phase 1
        phase = 1;
      }
    }
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
  tiling.addConfiguration(tiling.get_identity());
  tiling.colorTiles();
  reset_number_of_steps();

  // log (after identity)
  console.log("compute roundness...");
  // measure time
  let t0 = performance.now();
  // file text variable
  var roundness_file_text = "";
  // whether to animate roundness or not
  var show_roundness = document.getElementById('roundAnimate').checked;

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
  phase = 1;
  phase_previous = 1;

  // measure roundness, push to file, and iterate
  console.log("* measure roundness at each step from m+e to m");
  var is_stable = false;
  while(!is_stable){
    // get roundness
    // (side effect on outerTiles, frontierTiles, phase)
    let roundness = tiling.get_roundness();

    // log phase transitions
    if(phase != phase_previous){
      console.log("  phase transition at step "+number_of_steps+": phase="+phase);
      phase_previous = phase;
    }
    // push to file
    roundness_file_text += roundness[0].toFixed(3)+"/"+
                           roundness[1].toFixed(3)+"/"+
                           (roundness[1]-roundness[0]).toFixed(3)+",\n";

    // iterate
    is_stable = tiling.iterate();
    if(!is_stable){increment_number_of_steps();}
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
  console.log("* stabilized to m at step "+number_of_steps);
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
  console.log("done roundness in "+(performance.now()-t0)+" (ms)");
  tiling.colorTiles();
  return [roundness_file]; 
}

//
// [ 1.2 ] Faster roundness
//         CAUTION: only phase 2
//         CAUTION: logs the starting step of phase 2 in the output file
//         CAUTION: frontier regression is unexpected and may cause failures
//                 (recorded in the log and output file)
//

async function makeRoundnessFileFast(tiling){
  // set up max-stable + identity
  tiling.clear()
  tiling.addMaxStable();
  tiling.addConfiguration(tiling.get_identity());
  tiling.colorTiles();
  reset_number_of_steps();

  // log (after identity)
  console.log("compute roundness fast (phase 2)...");
  // measure time
  let t0 = performance.now();
  // file text variable
  let roundness_file_text = "";
  // whether to animate roundness or not
  let show_roundness = document.getElementById('roundAnimate').checked;

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

  // iterate until phase 2
  console.log("* phase 1: iterate until phase 2");
  let is_stable = false;
  phase = 1;
  // prepare quick pre-check of transition to phase 2
  let inscribedTiles = []; // a subset of tiles required to be outerTiles in order to have innerRadius <= inscribedCircleRadius
  tiling.tiles.forEach(tile => {
    // tiles intersecting the circle of radius inscribedCircleRadius+r_error
    if(  (smallestDistancedict.get(tile.id) <= inscribedCircleRadius+r_error)
      && (biggestDistancedict.get(tile.id) >= inscribedCircleRadius+r_error)){
      inscribedTiles.push(tile.id);
    }
  });
  // go
  while(!is_stable && phase==1){
    // iterate
    is_stable = tiling.iterate();
    if(!is_stable){increment_number_of_steps();}
    if(show_roundness){
      await sleep(delay);
      tiling.colorTiles();
    }
    // check if phase 2 is reached
    // quick pre-check from inscribedTiles
    if(inscribedTiles.filter(id => tiling.tiles[id].sand != tiling.tiles[id].limit-1).length == 0){
      // we may have innerRadius <= inscribedCircleRadius
      console.log("  pre-check transition to phase 2 passed at step "+number_of_steps);
      // full check with .get_roundness()
      outerTiles = [];
      frontierTiles = [];
      tiling.get_roundness(); // side effect on phase
    }
  }
  // phase 2 reached
  console.log("  done phase 1 in "+(performance.now()-t0)+" (ms)");
  let t1 = performance.now();
  console.log("* phase 2: reached at step "+number_of_steps);
  roundness_file_text += number_of_steps+"\n";

  // expect a direct transition from phase 2 to phase 3
  console.log("* direct transition to phase 3 expected...");
  if(phase == 3){
    // phase 3 reached
    console.log("  OK");
    console.log("* phase 3: reached at step "+number_of_steps);
    phase = 3;
  }
  else{
    // phase 3 not reached
    console.log("  KO");
    console.log("error: a direct transition to phase 3 was expected (for the moment we abort, complete this code if this case needs to be handled)");
    return;
  }

  // initialize outerTiles
  outerTiles = [];
  let tileStack = Array.from(borderTiles);
  while(tileStack.length != 0){
    let id = tileStack.shift();
    let tile = tiling.tiles[id];
    if((!outerTiles.includes(id)) && (tile.sand == tile.limit-1)){
      // new outerTile
      outerTiles.push(id);
      tileStack.push(...tile.neighbors);
    }
  }

  // initialize frontierTiles
  frontierTiles = [];
  for(let id of outerTiles){
    let tile = tiling.tiles[id];
    if(tile.neighbors.filter(nid => {
        let ntile = tiling.tiles[nid];
        return ntile.sand != ntile.limit-1;
      }).length > 0){
      // a neighbor in innerTiles
      frontierTiles.push(id);
    }
  }
  
  // shortcut (main): initialize outerTiles_sub
  // the subset of outerTiles being frontierTiles or neighbors of frontierTiles
  let outerTiles_sub = Array.from(frontierTiles);
  frontierTiles.forEach(id =>
    outerTiles_sub.push(...tiling.tiles[id].neighbors.filter(nid => 
      tiling.tiles[nid].sand == tiling.tiles[nid].limit-1
    ))
  );
  // remove duplicates
  outerTiles_sub = outerTiles_sub.filter(function(e,i,self){return i === self.indexOf(e);});

  ////TIME: log times to find which part of the code requires optimization
  //let time_outerTiles = 0; //TIME
  //let time_frontierTiles = 0; //TIME
  //let time_outerRadius = 0; //TIME
  //let time_innerRadius = 0; //TIME
  //let time_iterate = 0; //TIME
  //let time_regression = 0; //TIME
  //let ctime = 0; // current time //TIME

  // measure roundness, push to file, and iterate
  // (plus check regression of frontierTiles)
  while(!is_stable){
    // -----------------
    // compute roundness
    // (phase 2: the circle slowly shrinks)
    // -----------------
    // add new outerTiles with a BFS from frontierTiles
    // shortcut (main): use outerTiles_sub (a subset) instead of (all) outerTiles
    //ctime = performance.now(); //TIME
    let outerTiles_new = [];
    // shortcut: start with frontierTiles and their neighbors
    let tileStack = Array.from(frontierTiles.map(id => tiling.tiles[id].neighbors.concat(id)).flat(1));
    // shortcut: remove duplicates
    tileStack = tileStack.filter(function(e,i,self){return i === self.indexOf(e);});
    // shortcut: remove outerTiles_sub 1/3
    // (includes removal of frontierTiles, checked during regression)
    tileStack = tileStack.filter(nid => !outerTiles_sub.includes(nid));
    // go
    while(tileStack.length > 0){
      let id = tileStack.shift();
      let tile = tiling.tiles[id];
      // shortcut: we have no outerTiles(_sub) tile in tileStack 2/3
      if(tile.sand == tile.limit-1){
        // new outerTile
        outerTiles_sub.push(id);
        outerTiles_new.push(id);
        // shortcut: do not push outerTiles(_sub) to tileStack 3/3
        tileStack.push(...tile.neighbors.filter(nid => !outerTiles_sub.includes(nid)));
      }
    }
    //time_outerTiles += performance.now()-ctime;//TIME
    // update frontierTiles
    //ctime = performance.now();//TIME
    // shortcut: among old frontierTiles and new outerTiles
    let frontierTiles_new = [];
    for(let id of frontierTiles.concat(outerTiles_new)){
      let tile = tiling.tiles[id];
      if(tile.neighbors.filter(nid => {
          let ntile = tiling.tiles[nid];
          return ntile.sand != ntile.limit-1;
        }).length > 0){
        // a neighbor in innerTiles
        frontierTiles_new.push(id);
      }
    }
    frontierTiles = frontierTiles_new;
    //time_frontierTiles += performance.now()-ctime;//TIME
    // shortcut (main): update outerTiles_sub
    //ctime = performance.now();//TIME
    outerTiles_sub = Array.from(frontierTiles);
    frontierTiles.forEach(id =>
      outerTiles_sub.push(...tiling.tiles[id].neighbors.filter(nid => 
        tiling.tiles[nid].sand == tiling.tiles[nid].limit-1
      ))
    );
    outerTiles_sub = outerTiles_sub.filter(function(e,i,self){return i === self.indexOf(e);});
    //time_outerTiles += performance.now()-ctime;//TIME
    // compute outerRadius from frontierTiles
    //ctime = performance.now();//TIME
    let outerRadius = 0;
    if(frontierTiles.length == 0){
      outerRadius = 0;
    }
    else{
      let smallestDistances_outerTiles = frontierTiles.map(id => smallestDistancedict.get(id));
      outerRadius = Math.min(...smallestDistances_outerTiles);
    }
    //time_outerRadius += performance.now()-ctime;//TIME
    // compute innerRadius from neighbors of frontierTiles
    //ctime = performance.now();//TIME
    let innerTiles_sub = [];
    frontierTiles.forEach(id => {
      let tile = tiling.tiles[id];
      tile.neighbors.forEach(nid => {
        let ntile = tiling.tiles[nid];
        if(ntile.sand != ntile.limit-1){
          innerTiles_sub.push(nid);
        }
      });
    });
    let innerRadius = 0;
    if(innerTiles_sub.length == 0){
      innerRadius = 0;
    }
    else{
      let biggestDistances_innerTiles = innerTiles_sub.map(id => biggestDistancedict.get(id));
      innerRadius = Math.max(...biggestDistances_innerTiles);
    }
    //time_innerRadius += performance.now()-ctime;//TIME
    // roundness is ready

    // push to file
    roundness_file_text += outerRadius.toFixed(3)+"/"+
                           innerRadius.toFixed(3)+"/"+
                           (innerRadius-outerRadius).toFixed(3)+",\n";

    // iterate
    //ctime = performance.now();//TIME
    is_stable = tiling.iterate();
    if(!is_stable){increment_number_of_steps();}
    //time_iterate += performance.now()-ctime;//TIME
    if(show_roundness){
      // configuration already iterated
      // 1. plot roundnesses
      // caution: THREE.CircleGeometry does not like circles of radius 0...
      if(outerRadius>0){
        // plot outer radius
        let outerCircleGeometry = new THREE.CircleGeometry(outerRadius,64);
        outerCircleGeometry.vertices.splice(0,1);
        let outerCircleMaterial = new THREE.MeshBasicMaterial({color:0x0000ff});
        // var for app.scene.remove
        var outerCircle = new THREE.LineLoop(outerCircleGeometry,outerCircleMaterial);
        app.scene.add(outerCircle);
      }
      if(innerRadius>0){
        // plot inner radius
        let innerCircleGeometry = new THREE.CircleGeometry(innerRadius,64);
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

    // check regression of frontier
    //ctime = performance.now();//TIME
    if(frontierTiles.filter(id => tiling.tiles[id].sand != tiling.tiles[id].limit-1).length > 0){
      console.log("  warning: unexpected frontier regression at step "+number_of_steps);
      roundness_file_text += "warning: unexpected frontier regression at step "+number_of_steps+"\n";
    }
    //time_regression += performance.now()-ctime;//TIME
  }

  // stability reached
  console.log("  done phase 3 in "+(performance.now()-t1)+" (ms)");
  console.log("* stabilized to m at step "+number_of_steps);
  console.log("* roundness data (phase 2) is ready to create file");

  // create file from roundness_file_text
  var roundness_data = new Blob([roundness_file_text], {type: 'text/plain'});
  // If we are replacing a previously generated file we need to
  // manually revoke the object URL to avoid memory leaks.
  if (roundness_file !== null) {
          window.URL.revokeObjectURL(roundness_file);
  }
  var roundness_file = window.URL.createObjectURL(roundness_data);
  
  // done
  console.log("done roundness in "+(performance.now()-t0)+" (ms)");
  //console.log("TIME updating outerTiles: "+time_outerTiles); //TIME
  //console.log("TIME updating frontierTiles: "+time_frontierTiles); //TIME
  //console.log("TIME computing outerRadius: "+time_outerRadius); //TIME
  //console.log("TIME computing innerRadius: "+time_innerRadius); //TIME
  //console.log("TIME iterating tiling: "+time_iterate); //TIME
  //console.log("TIME checking regression: "+time_regression); //TIME
  tiling.colorTiles();
  return [roundness_file]; 
}

//
// [2.0] function displaying infos directly in app
//

//
// [2.1] factorize parts of the code
//

// compute borderTiles
function compute_borderTiles(tiling){
  console.log("* compute border tiles");
  borderTiles = tiling.tiles.filter(tile =>
    tile.neighbors.length != tile.bounds.length/2
  ).map(tile => tile.id);
}

// compute smallestDistancedict and biggestDistancedict
function compute_Distancedicts(tiling){
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
}

// compute inscribedRadius and circumscribedRadius
function compute_radii(tiling){
  console.log("* compute radii");
  let radii = circles_radii(tiling);
  inscribedCircleRadius = radii[0];
  circumscribedCircleRadius = radii[1];
  console.log("  inscribed radius="+inscribedCircleRadius);
  console.log("  circumscribed radius="+circumscribedCircleRadius);
}

// 
// [2.2] compute, display and show
//       inscribed and circumscrined radii
//       of the current tiling
//

var inscribedCircle // to add/remove inscribed from app.scene
var circumscribedCircle // to add/remove circumscribed from app.scene

function radii(elem){
  // TODO: compute radii once and store the results
  // boring...
  if(!currentTiling){return;}
  // called to checked or unchecked?
  if(!elem.checked){
    // unchecked: remove circles
    app.scene.remove(inscribedCircle);
    app.scene.remove(circumscribedCircle);
    return;
  }
  // checked: go
  let tiling = currentTiling;
  console.log("compute radii...");
  // compute border tiles
  compute_borderTiles(tiling);
  // precompute the biggest and smallest distance from (0,0) for all tiles
  compute_Distancedicts(tiling);
  // compute radii
  compute_radii(tiling);
  // display
  let disp = document.getElementById("radiiInfo");
  disp.innerHTML = "inscribed radius : "+inscribedCircleRadius.toFixed(3)+"<br>"
                  +"circumscribed radius : "+circumscribedCircleRadius.toFixed(3);
  // show
  if(inscribedCircleRadius>0){
    let inscribedCircleGeometry = new THREE.CircleGeometry(inscribedCircleRadius,64);
    inscribedCircleGeometry.vertices.splice(0,1);
    let inscribedCircleMaterial = new THREE.MeshBasicMaterial({color:0x0000ff});
    inscribedCircle = new THREE.LineLoop(inscribedCircleGeometry,inscribedCircleMaterial);
    app.scene.add(inscribedCircle);
  }
  if(circumscribedCircleRadius>0){
    let circumscribedCircleGeometry = new THREE.CircleGeometry(circumscribedCircleRadius,64);
    circumscribedCircleGeometry.vertices.splice(0,1);
    let circumscribedCircleMaterial = new THREE.MeshBasicMaterial({color:0xff0000});
    circumscribedCircle = new THREE.LineLoop(circumscribedCircleGeometry,circumscribedCircleMaterial);
    app.scene.add(circumscribedCircle);
  }
}
                      
// 
// [2.3] compute, display and show
//       the current roundness
//

var outerCircle // to add/remove inner from app.scene
var innerCircle // to add/remove outer from app.scene

function roundness(elem){
  // boring...
  if(!currentTiling){return;}
  // called to checked or unchecked?
  if(!elem.checked){
    // unchecked: remove circles and info
    let disp = document.getElementById("roundInfo");
    disp.innerHTML = "<br><br>";
    app.scene.remove(outerCircle);
    app.scene.remove(innerCircle);
    return;
  }
  // checked: go
  let tiling = currentTiling;
  console.log("compute roundness...");
  // compute border tiles
  compute_borderTiles(tiling);
  // precompute the biggest and smallest distance from (0,0) for all tiles
  compute_Distancedicts(tiling);
  // compute inscribed and circumscribed circle radii
  compute_radii(tiling);
  // initialize global variables
  outerTiles = [];
  frontierTiles = [];
  phase = 1;
  // compute roundness
  let roundness = tiling.get_roundness();
  let outerRadius = roundness[0];
  let innerRadius = roundness[1];
  console.log("* outer radius="+outerRadius);
  console.log("* inner radius="+innerRadius);
  // display
  let disp = document.getElementById("roundInfo");
  disp.innerHTML = "outer radius : "+outerRadius.toFixed(3)+"<br>"
                  +"inner radius : "+innerRadius.toFixed(3)+"<br>"
                  +"roundness : "+(innerRadius-outerRadius).toFixed(3);
  // show
  if(outerRadius>0){
    let outerCircleGeometry = new THREE.CircleGeometry(outerRadius,64);
    outerCircleGeometry.vertices.splice(0,1);
    let outerCircleMaterial = new THREE.MeshBasicMaterial({color:0x0000ff});
    outerCircle = new THREE.LineLoop(outerCircleGeometry,outerCircleMaterial);
    app.scene.add(outerCircle);
  }
  if(innerRadius>0){
    let innerCircleGeometry = new THREE.CircleGeometry(innerRadius,64);
    innerCircleGeometry.vertices.splice(0,1);
    let innerCircleMaterial = new THREE.MeshBasicMaterial({color:0xff0000});
    innerCircle = new THREE.LineLoop(innerCircleGeometry,innerCircleMaterial);
    app.scene.add(innerCircle);
  }
}
                      
//
// [3.0] export frontier (edges between inner and outer tiles) to tikz
//

function export_frontierTikz(){
  // boring...
  if(!currentTiling){return;}
  // go
  console.log("export frontier to tikz");
  tiling = currentTiling;
  // compute border tiles
  compute_borderTiles(tiling);
  // compute outer tiles
  outerTiles = [];
  let tileStack = Array.from(borderTiles);
  while(tileStack.length != 0){
    let id = tileStack.shift();
    let tile = tiling.tiles[id];
    if((!outerTiles.includes(id)) && (tile.sand == tile.limit-1)){
      // new outerTile
      outerTiles.push(id);
      tileStack.push(...tile.neighbors);
    }
  }
  // compute frontierTiles
  frontierTiles = [];
  for(let id of outerTiles){
    let tile = tiling.tiles[id];
    if(tile.neighbors.filter(nid => {
        let ntile = tiling.tiles[nid];
        return ntile.sand != ntile.limit-1;
      }).length > 0){
      // a neighbor in innerTiles
      frontierTiles.push(id);
    }
  }
  // compute frontier bounds
  frontierEdges = []; // pairs of points (pairs of coordinates)
  for(let id of frontierTiles){
    // check which edges are on the frontier:
    // iff they are shared with an inner tile (up to r_error)
    let tile = tiling.tiles[id];
    for(let i=0; i<tile.bounds.length; i+=2){
      let x1 = tile.bounds[i];
      let y1 = tile.bounds[i+1];
      let x2 = tile.bounds[(i+2)%tile.bounds.length];
      let y2 = tile.bounds[(i+3)%tile.bounds.length];
      // find the neighbor along this edge
      let found_neighbor = false;
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
            // found the neighbor
            found_neighbor = true;
            // check if it is an inner tile
            if(ntile.sand != ntile.limit-1){
              // yes: new frontier edge
              frontierEdges.push([[x1,y1],[x2,y2]]);
            }
            break;
          }
        }
        if(found_neighbor){break;} // shortcut
      }
    }
  }
  // precompute the biggest and smallest distance from (0,0) for all tiles
  compute_Distancedicts(tiling);
  // compute radii
  compute_radii(tiling);
  // compute outerRadius
  let outerRadius = 0;
  if(outerTiles.length == 0){
    outerRadius = inscribedCircleRadius;
  }
  else{
    if(frontierTiles.length == 0){
      outerRadius = 0;
    }
    else{
      let smallestDistances_outerTiles = frontierTiles.map(id => smallestDistancedict.get(id));
      let smallestDistance_outerTiles = Math.min(...smallestDistances_outerTiles);
      outerRadius = Math.min(inscribedCircleRadius,smallestDistance_outerTiles);
    }
  }
  // compute innerRadius
  let innerTiles_sub = [];
  innerTiles_sub.push(...borderTiles.filter(id => !outerTiles.includes(id)));
  frontierTiles.forEach(id => {
    let tile = tiling.tiles[id];
    tile.neighbors.forEach(nid => {
      let ntile = tiling.tiles[nid];
      if(ntile.sand != ntile.limit-1){
        innerTiles_sub.push(nid);
      }
    });
  });
  let innerRadius = 0;
  if(innerTiles_sub.length == 0){
    innerRadius = 0;
  }
  else{
    let biggestDistances_innerTiles = innerTiles_sub.map(id => biggestDistancedict.get(id));
    innerRadius = Math.max(...biggestDistances_innerTiles);
  }
  // construct tikz from frontierEdges
  let tikz = "";
  tikz += "\\begin{tikzpicture}[every path/.style={very thick}]\n";
  // tikz edges
  for(let edge of frontierEdges){
    let x1 = edge[0][0];
    let y1 = edge[0][1];
    let x2 = edge[1][0];
    let y2 = edge[1][1];
    tikz += "\\draw ("+x1.toFixed(3)+","+y1.toFixed(3)+") -- ("+x2.toFixed(3)+","+y2.toFixed(3)+");\n";
  }
  // tikz circles
  tikz += "\\draw[blue,thin] (0,0) circle ("+outerRadius.toFixed(3)+");\n";
  tikz += "\\draw[red,thin] (0,0) circle ("+innerRadius.toFixed(3)+");\n";
  tikz += "\\end{tikzpicture}\n";
  // create file
  let data = new Blob([tikz], {type: 'text/plain'});
  if (textFile !== null) {
    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    window.URL.revokeObjectURL(textFile);
  }
  textFile = window.URL.createObjectURL(data);
  let link = document.getElementById('downloadlink');
  link.setAttribute('download', "JS-Sandpile_frontier.tex");
  link.href = textFile;
  link.click();
  // done
  console.log("done");
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

async function makeRoundnessFile_version1(tiling){
	
        // set up max-stable + identity
	tiling.clear()
	tiling.addMaxStable();
        tiling.addConfiguration(tiling.get_identity());
	
	// make a file out of the function [ 1.0 ]
	show_round = document.getElementById('roundAnimate').checked;
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
			tiling.colorTiles();
			t_render += Date.now() - temp;
		}
		
		temp = Date.now();
		var stat = tiling.get_roundness_version1();
		t_round += Date.now() - temp;
		
		if(stat != null){
			arr_min.push(stat["Min"]);
			arr_max.push(stat["Max"]);
		}
		temp = Date.now();
		done = tiling.iterate();
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
	tiling.colorTiles();
	
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
