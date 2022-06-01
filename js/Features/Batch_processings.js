// This code is part of JS-Sandpile (https://github.com/huacayacauh/JS-Sandpile/)
// CC-BY Valentin Darrigo, Jeremy Fersula, Kevin Perrot

//
// [0] Start batch processings
//

//
// [1] compute some identities
//

function batch_identities(){
  console.log("batch compute identities...");
  let rid = confirm("Compute the identity for\n"
                   +"* square grid 500\n"
                   +"* triangular grid 500 step 50163\n"
                   +"* hexagonal grid 200 step 13252\n"
                   +"* P2 sun 11 iterations step 42724\n"
                   +"* P2 star 11 iterations step 27337\n"
                   +"* P3 sun 10 iterations step 42067\n"
                   +"* P3 cut and project 100 step 39210\n"
                   +"? (takes a few hours)");
  if(rid == false){
    // cancel: abort
    console.log("abort");
    return;
  }
  // ok
  let link = document.getElementById('downloadlink');
  // unlock files download...
  console.log("* unlock files download");
  currentTiling = Tiling.sqTiling({width:5,height:5});
  currentTiling.clear();
  currentTiling.addConfiguration(currentTiling.get_identity());
  link.download = "trash.json";
  link.href = tilingToJson(currentTiling);
  link.click();
  link.click();
  link.click();
  // square grid 500
  console.log("* square grid 500");
  currentTiling = Tiling.sqTiling({width:500,height:500});
  currentTiling.clear();
  currentTiling.addConfiguration(currentTiling.get_identity());
  link.download = "squaregrid-500-id.json";
  link.href = tilingToJson(currentTiling);
  link.click();
  // triangular grid 500
  console.log("* triangular grid 500");
  currentTiling = Tiling.triTiling({size:500});
  currentTiling.clear();
  currentTiling.addConfiguration(currentTiling.get_identity());
  link.download = "triangulargrid-500-id.json";
  link.href = tilingToJson(currentTiling);
  link.click();
  // hexagonal grid 200
  console.log("* haxagonal grid 200");
  currentTiling = Tiling.hexTiling({size:200});
  currentTiling.clear();
  currentTiling.addConfiguration(currentTiling.get_identity());
  link.download = "hexagonalgrid-200-id.json";
  link.href = tilingToJson(currentTiling);
  link.click();
  // P2 sun 11 iterations
  console.log("* P2 Sun 11 iterations");
  currentTiling = Tiling.P2sunbysubst({iterations:11});
  currentTiling.clear();
  currentTiling.addConfiguration(currentTiling.get_identity());
  link.download = "P2-sun-11-id.json";
  link.href = tilingToJson(currentTiling);
  link.click();
  // P2 star 11 iterations
  console.log("* P2 Star 11 iterations");
  currentTiling = Tiling.P2starbysubst({iterations:11});
  currentTiling.clear();
  currentTiling.addConfiguration(currentTiling.get_identity());
  link.download = "P2-star-11-id.json";
  link.href = tilingToJson(currentTiling);
  link.click();
  // P3 sun 10 iterations
  console.log("* P3 Sun 10 iterations");
  currentTiling = Tiling.P3sunbysubst({iterations:10});
  currentTiling.clear();
  currentTiling.addConfiguration(currentTiling.get_identity());
  link.download = "P3-sun-10-id.json";
  link.href = tilingToJson(currentTiling);
  link.click();
  // P3 cut and project 100
  console.log("* P3 cut and project 100");
  currentTiling = Tiling.PenroseCutandproject({size:100});
  currentTiling.clear();
  currentTiling.addConfiguration(currentTiling.get_identity());
  link.download = "P3-cutandproject-100-id.json";
  link.href = tilingToJson(currentTiling);
  link.click();
  // done
  console.log("done");
}

//
// [2] compute some roundness datas
//     requires: batch_identities()
//

// start: push json contents to identities
// then call batch_roundness_identities
function batch_roundness(){
  console.log("batch compute roundness...");
  //
  // upload identities (prints expected order to user)
  //
  console.log("* upload identities");
  let identities = [];
  let input = document.createElement('input');
  input.setAttribute("multiple","");
  input.type = 'file';
  input.onchange = e => { 
    let files = e.target.files;
    let reader = new FileReader();  
    function readFile(index){
      if(index >= files.length){
        return batch_roundness_identities(identities);
      }
      let file = files[index];
      reader.onload = readerEvent => {
        let jsonstr = readerEvent.target.result;
        let json = JSON.parse(jsonstr);
        identities.push(json);
        readFile(index+1);
      }
      reader.readAsBinaryString(file);
    }
    readFile(0);
  }
  let rload = confirm("please select .json files of the identity configuration\n"
                     +"for the tilings on which we will call roundnessFast");
  if(rload == false){
    // cancel: abort
    console.log("abort");
    return;
  }
  // ok
  input.click();
}

// prepare currentTiling (simpler to draw it with jsonToTiling)
// and call roundnessFast
async function batch_roundness_identities(identities){
  // uncheck animate
  document.getElementById('roundAnimate').checked = false;
  // loop over identities
  for(let json of identities){
    jsonToTiling(json);
    currentTiling.identity = currentTiling.hiddenCopy();
    let link = document.getElementById('downloadlink');
    let textFile = await makeRoundnessFileFast(currentTiling);
    link.setAttribute('download',"roundness-phase2.txt");
    link.href = textFile;
    link.click();
  }
}

//
// [3] compute some frontiers
//     requires: batch_identities()
//

// start: push json contents to identities
// then call batch_frontiers_identities
function batch_frontiers(){
  console.log("batch compute frontiers...");
  //
  // upload identities (prints expected order to user)
  //
  console.log("* upload identities");
  let identities = [];
  let input = document.createElement('input');
  input.setAttribute("multiple","");
  input.type = 'file';
  input.onchange = e => { 
    let files = e.target.files;
    let reader = new FileReader();  
    function readFile(index){
      if(index >= files.length){
        return batch_frontiers_identities(identities);
      }
      let file = files[index];
      reader.onload = readerEvent => {
        let jsonstr = readerEvent.target.result;
        let json = JSON.parse(jsonstr);
        identities.push(json);
        readFile(index+1);
      }
      reader.readAsBinaryString(file);
    }
    readFile(0);
  }
  let rload = confirm("please select .json files of the identity configuration for:\n"
                     +"(IN THIS ORDER)\n"
                     +" 1. square grid 500 (step 40413)\n"
                     +" 2. triangular grid 500 (step 50163)\n"
                     +" 3. hexagonal grid 200 (step 13252)\n"
                     +" 4. P2 sun 11 iterations (step 42724)\n"
                     +" 5. P2 star 11 iterations (step 27337)\n"
                     +" 6. P3 sun 10 iterations (step 42067)\n"
                     +" 7. P3 cut and project 100 (step 39210)\n"
                     +"and we will export the frontier to tikz\n"
                     +"on the configuration at the beginning of phase 2\n"
                     +"(STEPS ARE HARD-CODED)");
  if(rload == false){
    // cancel: abort
    console.log("abort");
    return;
  }
  // ok
  input.click();
}

// prepare currentTiling (simpler to draw it with jsonToTiling)
// and computer frontier at the beginning of phase 2
async function batch_frontiers_identities(identities){
  console.log("batch compute frontiers...");
  // check number of identities
  if(identities.length != 7){
    console.log("abort: "+identities.length+" identities given, expecting 7.");
    return;
  }
  // unlock files download...
  console.log("* unlock files download");
  let link = document.getElementById('downloadlink');
  currentTiling = Tiling.sqTiling({width:5,height:5});
  currentTiling.clear();
  currentTiling.addConfiguration(currentTiling.get_identity());
  link.download = "trash.json";
  link.href = tilingToJson(currentTiling);
  link.click();
  link.click();
  link.click();
  // 1. square grid 500 (step 40413)
  console.log("* square grid 500 (step 40413)");
  jsonToTiling(identities[0]);
  currentTiling.identity = currentTiling.hiddenCopy();
  currentTiling.addMaxStable();
  console.log("  tiling has "+currentTiling.tiles.length+" tiles");
  for(let i=0; i<40413; i++){currentTiling.iterate();}
  export_frontierTikz();
  // 2. triangular grid 500 (step 50163)
  console.log("* triangular grid 500 (step 50163)");
  jsonToTiling(identities[1]);
  currentTiling.identity = currentTiling.hiddenCopy();
  currentTiling.addMaxStable();
  console.log("  tiling has "+currentTiling.tiles.length+" tiles");
  for(let i=0; i<50163; i++){currentTiling.iterate();}
  export_frontierTikz();
  // 3. hexagonal grid 200 (step 13252)
  console.log("* hexagonal grid 200 (step 13252)");
  jsonToTiling(identities[2]);
  currentTiling.identity = currentTiling.hiddenCopy();
  currentTiling.addMaxStable();
  console.log("  tiling has "+currentTiling.tiles.length+" tiles");
  for(let i=0; i<13252; i++){currentTiling.iterate();}
  export_frontierTikz();
  // 4. P2 sun 11 iterations (step 42724)
  console.log("* P2 sun 11 iterations (step 42724)");
  jsonToTiling(identities[3]);
  currentTiling.identity = currentTiling.hiddenCopy();
  currentTiling.addMaxStable();
  console.log("  tiling has "+currentTiling.tiles.length+" tiles");
  for(let i=0; i<42724; i++){currentTiling.iterate();}
  export_frontierTikz();
  // 5. P2 star 11 iterations (step 27337)
  console.log("* P2 star 11 iterations (step 27337)");
  jsonToTiling(identities[4]);
  currentTiling.identity = currentTiling.hiddenCopy();
  currentTiling.addMaxStable();
  console.log("  tiling has "+currentTiling.tiles.length+" tiles");
  for(let i=0; i<27337; i++){currentTiling.iterate();}
  export_frontierTikz();
  // 6. P3 sun 10 iterations (step 42067)
  console.log("* P3 sun 10 iterations (step 42067)");
  jsonToTiling(identities[5]);
  currentTiling.identity = currentTiling.hiddenCopy();
  currentTiling.addMaxStable();
  console.log("  tiling has "+currentTiling.tiles.length+" tiles");
  for(let i=0; i<42067; i++){currentTiling.iterate();}
  export_frontierTikz();
  // 7. P3 cut and project 100 (step 39210)
  console.log("* P3 cut and project 100 (step 39210)");
  jsonToTiling(identities[6]);
  currentTiling.identity = currentTiling.hiddenCopy();
  currentTiling.addMaxStable();
  console.log("  tiling has "+currentTiling.tiles.length+" tiles");
  for(let i=0; i<39210; i++){currentTiling.iterate();}
  export_frontierTikz();
}


//
// [4] expot some identities differences to tikz
//

// rounding error when comparing coordinates
var p_error_diff=0.01;

// return minimum (x,y) among bounds
// used as "let [xmin,ymin] = minimumBounds(bounds)"
function minimumBounds(bounds){
  let x = bounds[0];
  let y = bounds[1];
  for(let i=2; i<bounds.length; i+=2){
    if(bounds[i]-x<=p_error_diff){
      if(bounds[i+1]-y<=p_error_diff){
        x = bounds[i];
        y = bounds[i+1];
      }
    }
  }
  return [x, y];
}

// order the tiles by smallest minimum (x,y)
// takes into account rounding errors (up to p_error_diff)
function compareTileBounds(tile1,tile2){
  let [xmin1,ymin1] = minimumBounds(tile1.bounds);
  let [xmin2,ymin2] = minimumBounds(tile2.bounds);
  if(Math.abs(xmin1-xmin2)>p_error_diff){
    return xmin1-xmin2;
  }
  return ymin1-ymin2;
}

// return true when the two tiles have the same SET of bounds, false otherwise
function sameTile(tile1,tile2){
  if(tile1.bounds.length != tile2.bounds.length){ return false;}
  for(i=0; i<tile1.bounds.length; i+=2){
    let found = false;
    for(j=0; j<tile2.bounds.length; j+=2){
      if(Math.abs(tile1.bounds[i]-tile2.bounds[j])<=p_error_diff &&
        Math.abs(tile1.bounds[i+1]-tile2.bounds[j+1])<=p_error_diff){
        found = true;
        break;
      }
    }
    if(!found){ return false; }
  }
  return true;
}

// TODO: minimumBounds is used crazily too ofter, it should be kept in a Map

// return the diff of two tilings
// tiling1 is supposed to be included in tiling2
// both sandpiles are supposed to be stable
// tiling2 is returned with difference marked by .sand = .limit
function tilingDiff(tiling1,tiling2){
  let p_error=0.01;
  // order the tiles by smallest minimum (x,y)
  tiling1.tiles.sort(compareTileBounds);
  tiling2.tiles.sort(compareTileBounds);
  // parse the list of tiles1 and look for each of them in tiles2
  // mark the correspondance in the identifier map same
  let same = new Map(); // id1 -> id2
  let i2 = 0;// retains the current position in tiles2 to optimize search
  tiling1.tiles.forEach(tile1 => {
    let [xmin1,ymin1] = minimumBounds(tile1.bounds);
    let [xmin2,ymin2] = minimumBounds(tiling2.tiles[i2].bounds);
    if(Math.abs(xmin1-xmin2)>p_error_diff){
      // time to move i2 onward
      while(i2<tiling2.tiles.length-1 && Math.abs(xmin1-minimumBounds(tiling2.tiles[i2].bounds)[0])>p_error_diff){
        i2+=1;
      }
    }
    // compare tile1 with the tiles at i2 onward with the same x
    for(let i2bis=i2; i2bis<tiling2.tiles.length && Math.abs(xmin1-minimumBounds(tiling2.tiles[i2bis].bounds)[0])<=p_error_diff && minimumBounds(tiling2.tiles[i2bis].bounds)[1]-ymin1<=p_error_diff; i2bis+=1){
      // are tile1 and tiling2.tiles[i2bis] the same ?
      if(sameTile(tile1,tiling2.tiles[i2bis])){
        // mark it in same and go to next
        same.set(tile1.id,tiling2.tiles[i2bis].id);
        break;
      }
    }
  });
  // use the same map to change .sand of tiling2
  // 0. sort again tiles by id
  tiling1.tiles.sort((tile1,tile2) => tile1.id - tile2.id);
  tiling2.tiles.sort((tile1,tile2) => tile1.id - tile2.id);
  // 1. different sand content => .sand = .limit
  same.forEach((id2,id1)=>{
    if(tiling1.tiles[id1].sand != tiling2.tiles[id2].sand){
      // contents are different
      tiling2.tiles[id2].sand = tiling2.tiles[id2].limit;
    }
  });
  // 2. do not exist in tiling1 => .sand = .limit+1
  let same_rev = new Map(Array.from(same, entry => [entry[1], entry[0]])); // source: https://stackoverflow.com/a/56550600
  tiling2.tiles.forEach(tile2 => {
    if(!same_rev.has(tile2.id)){
      // tile2 not in tiling1
      tile2.sand = tile2.limit+1;
    }
  });
  // 3. update tile colors
  tiling2.cmap = []; // meuh :-(
  tiling2.colorTiles();
  // done
  return tiling2;
}

function batch_identities_diff(){
  console.log("batch compute identities to compute differences...");
  let rid = confirm("Compute the identity difference for\n"
                   //+"** Square grid 50 to 250, step 50\n"
                   //+"** Square grid 200 to 210, step 2\n"
                   //+"* Triangular grid 50 to 250 step 50\n"
                   //+"* Hexagonal grid 50 to 250 step 50\n"
                   //+"** Ammann-Beenker substitution 1 to 5\n"
                   //+"** P3 substitution sun 1 to 8 iterations (order 4)\n"
                   //+"** P2 substitution sun 1 to 8 iterations (order 4)\n"
                   //+"** P2 substitution star 1 to 8 iterations (order 4)\n"
                   //+"** P2 cut and project size 1 to 20\n"
                   //+"** Ammann-Beenker cut and project size 1 to 20\n"
                   +"* n-fold cut and project, n=5 to 12, three crop methods, 10 sizes each\n"
                   +"?");
  if(rid == false){
    // cancel: abort
    console.log("abort");
    return;
  }
  // ok
  let link = document.getElementById('downloadlink');
  // unlock files download...
  console.log("* unlock files download");
  currentTiling = Tiling.sqTiling({width:5,height:5});
  currentTiling.clear();
  currentTiling.addConfiguration(currentTiling.get_identity());
  link.download = "trash.tex";
  link.href = tilingToTIKZ(currentTiling);
  link.click();
  // Square grid 50 to 250, step 50
  /*
  console.log("* Square grid 50 to 250, step 50");
  currentTiling = Tiling.sqTiling({width:50,height:50});
  currentTiling.clear();
  currentTiling.addConfiguration(currentTiling.get_identity());
  tiling1 = currentTiling;
  for(let n=100; n<=250; n+=50){
    currentTiling = Tiling.sqTiling({width:n,height:n});
    currentTiling.clear();
    currentTiling.addConfiguration(currentTiling.get_identity());
    tiling2 = currentTiling;
    link.download = "SquareGrid-diff-"+(n-50)+"-"+n+"-id.tex";
    link.href = tilingToTIKZ(tilingDiff(tiling1,tiling2));
    link.click();
    // restore identity
    tiling2.clear();
    tiling2.addConfiguration(tiling2.get_identity());
    tiling1 = tiling2;
  }
  */
  // Square grid 200 to 210, step 2
  /*
  console.log("* Square grid 200 to 210, step 2");
  currentTiling = Tiling.sqTiling({width:200,height:200});
  currentTiling.clear();
  currentTiling.addConfiguration(currentTiling.get_identity());
  tiling1 = currentTiling;
  for(let n=202; n<=210; n+=2){
    currentTiling = Tiling.sqTiling({width:n,height:n});
    currentTiling.clear();
    currentTiling.addConfiguration(currentTiling.get_identity());
    tiling2 = currentTiling;
    link.download = "SquareGrid-diff-"+(n-2)+"-"+n+"-id.tex";
    link.href = tilingToTIKZ(tilingDiff(tiling1,tiling2));
    link.click();
    // restore identity
    tiling2.clear();
    tiling2.addConfiguration(tiling2.get_identity());
    tiling1 = tiling2;
  }
  */
  // Ammann-Beenker substitution 1 to 5
  /*
  console.log("* Ammann-Beenker substitution 1 to 5");
  currentTiling = Tiling.A5bysubst({iterations:1});
  currentTiling.clear();
  currentTiling.addConfiguration(currentTiling.get_identity());
  tiling1 = currentTiling;
  for(let n=2; n<=5; n++){
    currentTiling = Tiling.A5bysubst({iterations:n});
    currentTiling.clear();
    currentTiling.addConfiguration(currentTiling.get_identity());
    tiling2 = currentTiling;
    link.download = "AmmannBeenkerSubst-diff-"+(n-1)+"-"+n+"-id.tex";
    link.href = tilingToTIKZ(tilingDiff(tiling1,tiling2));
    link.click();
    // restore identity
    tiling2.clear();
    tiling2.addConfiguration(tiling2.get_identity());
    tiling1 = tiling2;
  }
  */
  // P3 substitution sun 1 to 8 iterations (order 4)
  /*
  console.log("* P3 substitution sun 1 to 8 iterations (order 4)");
  for(let n=1; n<=4; n++){
    currentTiling = Tiling.P3sunbysubst({iterations:n});
    currentTiling.clear();
    currentTiling.addConfiguration(currentTiling.get_identity());
    tiling1 = currentTiling;
    currentTiling = Tiling.P3sunbysubst({iterations:(n+4)});
    currentTiling.clear();
    currentTiling.addConfiguration(currentTiling.get_identity());
    tiling2 = currentTiling;
    link.download = "P3SunSubst-diff-"+n+"-"+(n+4)+"-id.tex";
    link.href = tilingToTIKZ(tilingDiff(tiling1,tiling2));
    link.click();
  }
  */
  // P2 substitution sun 1 to 8 iterations (order 4)
  /*
  console.log("* P2 substitution sun 1 to 8 iterations (order 4)");
  for(let n=1; n<=4; n++){
    currentTiling = Tiling.P2sunbysubst({iterations:n});
    currentTiling.clear();
    currentTiling.addConfiguration(currentTiling.get_identity());
    tiling1 = currentTiling;
    currentTiling = Tiling.P2sunbysubst({iterations:(n+4)});
    currentTiling.clear();
    currentTiling.addConfiguration(currentTiling.get_identity());
    tiling2 = currentTiling;
    link.download = "P2SunSubst-diff-"+n+"-"+(n+4)+"-id.tex";
    link.href = tilingToTIKZ(tilingDiff(tiling1,tiling2));
    link.click();
  }
  */
  // P2 substitution star 1 to 8 iterations (order 4)
  /*
  console.log("* P2 substitution star 1 to 8 iterations (order 4)");
  for(let n=1; n<=4; n++){
    currentTiling = Tiling.P2starbysubst({iterations:n});
    currentTiling.clear();
    currentTiling.addConfiguration(currentTiling.get_identity());
    tiling1 = currentTiling;
    currentTiling = Tiling.P2starbysubst({iterations:(n+4)});
    currentTiling.clear();
    currentTiling.addConfiguration(currentTiling.get_identity());
    tiling2 = currentTiling;
    link.download = "P2StarSubst-diff-"+n+"-"+(n+4)+"-id.tex";
    link.href = tilingToTIKZ(tilingDiff(tiling1,tiling2));
    link.click();
  }
  */
  // P2 cut and project size 1 to 20
  /*
  console.log("* P2 cut and project size 1 to 20");
  currentTiling = Tiling.PenroseCutandproject({size:1});
  currentTiling.clear();
  currentTiling.addConfiguration(currentTiling.get_identity());
  tiling1 = currentTiling;
  for(let n=2; n<=20; n++){
    currentTiling = Tiling.PenroseCutandproject({size:n});
    currentTiling.clear();
    currentTiling.addConfiguration(currentTiling.get_identity());
    tiling2 = currentTiling;
    link.download = "P2CutAndProject-diff-"+(n-1)+"-"+n+"-id.tex";
    link.href = tilingToTIKZ(tilingDiff(tiling1,tiling2));
    link.click();
    // restore identity
    tiling2.clear();
    tiling2.addConfiguration(tiling2.get_identity());
    tiling1 = tiling2;
  }
  */
  // Ammann-Benker cut and project size 1 to 20
  /*
  console.log("* Ammann-Benker cut and project size 1 to 20");
  currentTiling = Tiling.AmmannBeenkerCutandproject({size:1});
  currentTiling.clear();
  currentTiling.addConfiguration(currentTiling.get_identity());
  tiling1 = currentTiling;
  for(let n=2; n<=20; n++){
    currentTiling = Tiling.AmmannBeenkerCutandproject({size:n});
    currentTiling.clear();
    currentTiling.addConfiguration(currentTiling.get_identity());
    tiling2 = currentTiling;
    link.download = "AmmannBeenkerCutAndProject-diff-"+(n-1)+"-"+n+"-id.tex";
    link.href = tilingToTIKZ(tilingDiff(tiling1,tiling2));
    link.click();
    // restore identity
    tiling2.clear();
    tiling2.addConfiguration(tiling2.get_identity());
    tiling1 = tiling2;
  }
  */
  // n-fold cut and project, n=5 to 12, three crop methods, 10 sizes each
  console.log("* n-fold cut and project, n=5 to 12, three crop methods, 10 sizes each");
  let zip = new JSZip();
  // n-fold
  for(let n=5; n<=12; n++){
    // crop methods
    let crops=["maxCoord","sumCoord","euclideanNorm"];
    for(let c=0; c<crops.length; c++){
      // sizes
      // maxCoord: 1 to 10
      // sumCoord: 3 to 10
      // euclideanNorm: 2 to 10
      let x=1; // maxCoord
      switch (crops[c]){
        case "sumCoord":
          x=3;
          break;
        case "euclideanNorm":
          x=2;
          break;
      }
      currentTiling = Tiling.nfold_simple({size:x,order:n,cropMethod:crops[c]});
      currentTiling.clear();
      currentTiling.addConfiguration(currentTiling.get_identity());
      tiling1 = currentTiling;
      for(++x; x<=10; x++){
        currentTiling = Tiling.nfold_simple({size:x,order:n,cropMethod:crops[c]});
        currentTiling.clear();
        currentTiling.addConfiguration(currentTiling.get_identity());
        tiling2 = currentTiling;
        //link.download = n+"-fold-"+crops[c]+"-diff-"+(x-1)+"-"+x+"-id.tex";
        //link.href = tilingToTIKZ(tilingDiff(tiling1,tiling2));
        //link.click();
        let filenamezip = n+"-fold-"+crops[c]+"-diff-"+(x-1)+"-"+x+"-id.tex";
        let contentzip = tilingToTIKZtxt(tilingDiff(tiling1,tiling2));
        zip.file(filenamezip, contentzip);
        // restore identity
        tiling2.clear();
        tiling2.addConfiguration(tiling2.get_identity());
        tiling1 = tiling2;
      }
    }
  }
  zip.generateAsync({type:"blob"}).then(function(content){
    saveAs(content,"n-fold-diff-id.zip");
  }); // download
  // done
  console.log("done");
}


