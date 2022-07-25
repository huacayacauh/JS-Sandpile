// This code is part of JS-Sandpile (https://github.com/huacayacauh/JS-Sandpile/)
// CC-BY Valentin Darrigo, Jeremy Fersula, Kevin Perrot

//
// [0] import/export features
//
// for the "import from image" feature, see js/TilingPresets/CustomSquareTiling.js
//

//
// [1] JSON Translation of Tilings
//

// [1.1] Import from JSON

function jsonToTiling(json){

	var tiles = [];
    for(var i = 0; i < json.tiles.length; i++){
        var tileJson = json.tiles[i]
		var til = new Tile(tileJson.id, tileJson.neighbors, tileJson.bounds, tileJson.lim);
		til.sand = tileJson.sand;
        tiles.push(til);
    }

    currentTiling = new Tiling(tiles);
	
	while(app.scene.children.length > 0){
		app.scene.remove(app.scene.children[0]);
		console.log("cleared");
	}
	
	selectedTile = null;
	app.controls.zoomCamera();
	app.controls.object.updateProjectionMatrix();

	app.scene.add(currentTiling.mesh);
	currentTiling.colorTiles();

	playWithDelay();

	var render = function () {
		requestAnimationFrame( render );
		app.controls.update();
		app.renderer.render( app.scene, app.camera );
	};
	render();
}

// [1.1] Export to JSON

function tilingToJson(sandpile){

    var json = {};
	
    var tiles = []

    for(var i = 0; i < sandpile.tiles.length; i++){
        var tile = sandpile.tiles[i];
        tiles.push({id: tile.id, neighbors: tile.neighbors, bounds: tile.bounds, lim: tile.limit, sand:tile.sand});
        
    }

    json.tiles = tiles;

    var text = JSON.stringify(json);

    var data = new Blob([text], {type: 'text/plain'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    return textFile; 
}

//
// [2] Export to svg
//
// laser cut removes line doublons and adds engravings (passed as global variable)
//

// returns a svg file
function tilingToSvg(sandpile){
    // get svg width and height
    var x_min = 0;
    var y_min = 0;
    var x_max = 0;
    var y_max = 0;

    for(var i = 0; i < sandpile.tiles.length; i++){
        var tile = sandpile.tiles[i];
        for(var j=0; j<tile.bounds.length; j+=2){
            if(tile.bounds[j] < x_min)
                x_min = tile.bounds[j];
            if(tile.bounds[j+1] < y_min)
                y_min = tile.bounds[j+1];
            if(tile.bounds[j] > x_max)
                x_max = tile.bounds[j];
            if(tile.bounds[j+1] > y_max)
                y_max = tile.bounds[j+1];
        }
    }

    // start generate svg as String
    var svg = ['<?xml version="1.0" standalone="no"?> \n<svg width="' + ((x_max - x_min)*2).toFixed(3) + '" height="' + ((y_max-y_min)*2).toFixed(3) + '" version="1.1" xmlns="http://www.w3.org/2000/svg">\n'];

    if(wireFrameEnabled)
    	svg += '<g stroke="black" stroke-width=".1">\n';
    else
    	svg += '<g stroke="black" stroke-width="0">\n';

    for(var i = 0; i < sandpile.tiles.length; i++){
        var tile = sandpile.tiles[i];
	var poly = '<polygon points="';
	for(var j=0; j<tile.bounds.length; j+=2){
	    poly += " " + ((tile.bounds[j] - x_min)*2).toFixed(3) + " " + ((tile.bounds[j+1] - y_min)*2).toFixed(3);
	}
	poly += '" fill="#'+tile.svg_color+'"/>\n';
	svg += poly;
    }
    svg += "</g>\n";
    svg += "</svg>";

    // create file
    var data = new Blob([svg], {type: 'text/plain'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    return textFile; 
}

// Laser Cut : returns a svg file of tile bounds as lines (instead of polygons), with engravings
function tilingToSvgLaserCut(sandpile){

  /*
   * get svg width and height
   */
  var x_min = 0;
  var y_min = 0;
  var x_max = 0;
  var y_max = 0;
  for(var i = 0; i < sandpile.tiles.length; i++){
    var tile = sandpile.tiles[i];
    for(var j=0; j<tile.bounds.length; j+=2){
      if(tile.bounds[j] < x_min)
        x_min = tile.bounds[j];
      if(tile.bounds[j+1] < y_min)
        y_min = tile.bounds[j+1];
      if(tile.bounds[j] > x_max)
        x_max = tile.bounds[j];
      if(tile.bounds[j+1] > y_max)
        y_max = tile.bounds[j+1];
    }
  }

  /*
   * create a list of tile segments and remove doublons
   * (order the list then check for consecutive identical segments: code taken from findNeighbors...)
   */
  let p_error=0.01; // rounding errors in bounds coordinates

  let segments = [];
  sandpile.tiles.forEach(function(tile){
    for(let i=0; i<tile.bounds.length; i=i+2){
      // caution: segment points need to be ordered (up to p_error)
      //          so that [x,y,x',y'] is the same as [x',y',x,y].
      //          smallest x first, and if x ~equal then smallest y first
      let segment = [];
      let x1 = tile.bounds[i];
      let y1 = tile.bounds[i+1];
      let blen = tile.bounds.length;
      let x2 = tile.bounds[(i+2)%blen];
      let y2 = tile.bounds[(i+3)%blen];
      if( x2-x1>=p_error || (Math.abs(x2-x1)<p_error && y2-y1>=p_error) ){
        // normal order
        segment.push(x1);
        segment.push(y1);
        segment.push(x2);
        segment.push(y2);
      }
      else{
        // reverse order
        segment.push(x2);
        segment.push(y2);
        segment.push(x1);
        segment.push(y1);
      }
      // add to list of segments
      segments.push(segment);
    }
  });
  // sort the list of segments lexicographicaly
  // takes into account rounding errors (up to p_error)
  segments.sort(function(s1,s2){
    for(let i=0; i<s1.length; i++){
      if(Math.abs(s1[i]-s2[i])>=p_error){return s1[i]-s2[i];}
    }
    return 0;
  });
  // check if consecutive elements are identical => destroy one!
  // (hypothesis: no three consecutive elements are identical)
  for(let i=0; i<segments.length-1; i++){
    // compare i to i+1: check if points are identical (up to p_error)
    if(  distance(segments[i][0],segments[i][1],segments[i+1][0],segments[i+1][1])<p_error
      && distance(segments[i][2],segments[i][3],segments[i+1][2],segments[i+1][3])<p_error){
      // found two identical segments => destroy second
      segments.splice(i+1,1);
    }
  }
  // done removing segment doublons in Array segments

  /*
  /* start generate svg as String
   */
  let factor = 10; // scaling factor

  var svg = ['<?xml version="1.0" standalone="no"?> \n<svg width="' + ((x_max - x_min)*10).toFixed(3) + '" height="' + ((y_max-y_min)*10).toFixed(3) + '" version="1.1" xmlns="http://www.w3.org/2000/svg">\n'];

  // 1. tile segments

  // begin svg
  svg += '<g stroke="black" stroke-width=".1">\n';
  segments.forEach(seg => {
    svg += '<line x1="'+((seg[0] - x_min)*10).toFixed(3)+'" y1="'+((seg[1] - y_min)*10).toFixed(3)+'" x2="'+((seg[2] - x_min)*10).toFixed(3)+'" y2="'+((seg[3] - y_min)*10).toFixed(3)+'"/>\n';
  });
  svg += "</g>\n";

  // 2. engravings from engravingArcs and engravingLines

  // lines
  svg += '<g stroke="blue" stroke-width=".1">\n';
  engravingLines.forEach(seg => {
    svg += '<line x1="'+((seg[0] - x_min)*10).toFixed(3)+'" y1="'+((seg[1] - y_min)*10).toFixed(3)+'" x2="'+((seg[2] - x_min)*10).toFixed(3)+'" y2="'+((seg[3] - y_min)*10).toFixed(3)+'"/>\n';
  });
  svg += "</g>\n";
  // arcs
  svg += '<g fill="none" stroke="red" stroke-width=".1">\n';
  engravingArcs.forEach(arc => {
    // svg arcs documentation: https://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands
    let x = arc[0];
    let y = arc[1];
    let r = arc[2];
    let Ax = arc[3];
    let Ay = arc[4];
    let Bx = arc[5];
    let By = arc[6];
    let [AAx,AAy] = scalePoint(x,y,Ax,Ay,1-r/distance(x,y,Ax,Ay));
    let [BBx,BBy] = scalePoint(x,y,Bx,By,1-r/distance(x,y,Bx,By));
    let angle = Math.atan2(BBy-y,BBx-x) - Math.atan2(AAy-y,AAx-x);
    if(angle < 0){ angle += 2*Math.PI; };
    let largeArcFlag = angle <= Math.PI ? "0" : "1";
    svg += '<path d="M '+((AAx - x_min)*10).toFixed(3)+' '+((AAy - y_min)*10).toFixed(3)+' A '+(10*r).toFixed(3)+' '+(10*r).toFixed(3)+' 0 '+largeArcFlag+' 1 '+((BBx - x_min)*10).toFixed(3)+' '+((BBy - y_min)*10).toFixed(3)+'"/>\n';
  });
  svg += "</g>\n";

  // end svg
  svg += "</svg>";

  /*
   * create file
   */
  var data = new Blob([svg], {type: 'text/plain'});

  // If we are replacing a previously generated file we need to
  // manually revoke the object URL to avoid memory leaks.
  if (textFile !== null) {
    window.URL.revokeObjectURL(textFile);
  }

  textFile = window.URL.createObjectURL(data);

  return textFile; 
}

//
// [3] Export to tikz
//

function tilingToTIKZtxt(sandpile){
    let tikz = "";
    // construct color_map: sand -> svg_color
    let color_map = new Map();
    for(let tile of sandpile.tiles){
        if(!color_map.has(tile.sand)){
            color_map.set(tile.sand,tile.svg_color);
        }
    }
    // define colors (hexa colors as \definecolor{foo}{HTML}{hexa})
    for(let i of Array.from(color_map.keys()).sort()){
        // caution: in order to avoid confusion with a white pdflatex background
        // we replace color ffffff with eeeeee
        if(color_map.get(i)=="ffffff"){
          tikz += "\\definecolor{c"+i+"}{HTML}{eeeeee}\n";
        }
        else{
          tikz += "\\definecolor{c"+i+"}{HTML}{"+color_map.get(i)+"}\n";
        }
    }
    // start tikzpicture
    tikz += "\\begin{tikzpicture}";
    // draw tile edges?
    if(wireFrameEnabled)
        tikz += "[every path/.style={draw}]\n";
    else
        tikz += "\n";
    // draw tiles
    for(let tile of sandpile.tiles){
        let tikz_tile = "\\fill[fill=c"+ tile.sand +"]";
	for(var j=0; j<tile.bounds.length; j+=2)
	    tikz_tile += " ("+ tile.bounds[j].toFixed(3) +","+ tile.bounds[j+1].toFixed(3) +") --";
	tikz_tile += " cycle;\n";
	tikz += tikz_tile;
    }
    tikz += "\\end{tikzpicture}";
    return tikz;
}

function tilingToTIKZ(sandpile){
    let tikz = tilingToTIKZtxt(sandpile);
    var data = new Blob([tikz], {type: 'text/plain'});
    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
    }
    textFile = window.URL.createObjectURL(data);
    return textFile; 
}

//
//  [4] Manage events
//

//cette fonction est applé quand on clique sur le bouton selection
handleFileSelect = function(evt) {
    var files = evt.target.files; // FileList object
    var file = files[0];

    // files is a FileList of File objects. List some properties.
    reader = new FileReader();
    reader.readAsText(file, "UTF-8");

    reader.onload = function(evt){
        var fileString = evt.target.result;
        var json = JSON.parse(fileString);
        //app.sandpile = json;
        jsonToTiling(json);
    }
}

//cette fonction est appelé quand on clique sur le bouton create file
handleDownloadJSON = function(evt){
    if(currentTiling === undefined) return
    var link = document.getElementById('downloadlink');
    link.href = tilingToJson(currentTiling);
    link.setAttribute('download', "JS-Sandpile.json");
    //link.style.display = 'block';
    link.click();
}

handleDownloadTIKZ = function(evt){
    if(currentTiling === undefined) return
    var link = document.getElementById('downloadlink');
    var textFile = tilingToTIKZ(currentTiling);
	
    link.setAttribute('download', "JS-Sandpile.tex");
    link.href = textFile;
    link.click();
}

handleDownloadSVG = function(evt){
    if(currentTiling === undefined) return
    var link = document.getElementById('downloadlink');
    var textFile = tilingToSvg(currentTiling);
	
    link.setAttribute('download', "JS-Sandpile.svg");
    link.href = textFile;
    link.click();
}

handleDownloadSVGlasercut = function(evt){
    if(currentTiling === undefined) return
    var link = document.getElementById('downloadlink');
    var textFile = tilingToSvgLaserCut(currentTiling);
	
    link.setAttribute('download', "JS-Sandpile-lasercut.svg");
    link.href = textFile;
    link.click();
}

var createjson = document.getElementById('createjson')
createjson.addEventListener('click', handleDownloadJSON, false);

var createtikz = document.getElementById('createtikz');
createtikz.addEventListener('click', handleDownloadTIKZ, false);

var createsvg = document.getElementById('createsvg');
createsvg.addEventListener('click', handleDownloadSVG, false);

var createsvglasercut = document.getElementById('createsvglasercut');
createsvglasercut.addEventListener('click', handleDownloadSVGlasercut, false);

var textFile = null;

document.getElementById('files').addEventListener('change', handleFileSelect, false);

