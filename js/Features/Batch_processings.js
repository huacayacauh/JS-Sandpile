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

