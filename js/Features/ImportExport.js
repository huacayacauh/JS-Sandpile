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

function jsonToTilling(json){

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
	currentIdentity = null;
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

function tillingToJson(sandpile){

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

    // start
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

function tilingToTIKZ (sandpile){
    let tikz = "";
    // construct color map (hexa colors as \definecolor{foo}{HTML}{hexa}
    let color_map = new Map();
    let color_counter = 0;
    for(let tile of sandpile.tiles){
        if(!color_map.has(tile.svg_color)){
            color_map.set(tile.svg_color,color_counter);
            color_counter++;
        }
    }
    color_map.forEach(function (counter,color,map){
        // caution: in order to avoid confusion with a white pdflatex background
        // we replace color ffffff with eeeeee
        if(color=="ffffff"){
          tikz += "\\definecolor{c"+counter+"}{HTML}{eeeeee}\n";
        }
        else{
          tikz += "\\definecolor{c"+counter+"}{HTML}{"+color+"}\n";
        }
    });
    // start tikzpicture
    tikz += "\\begin{tikzpicture}";
    // draw tile edges?
    if(wireFrameEnabled)
        tikz += "[every path/.style={draw}]\n";
    else
        tikz += "\n";
    // draw tiles
    for(let tile of sandpile.tiles){
        let tikz_tile = "\\fill[fill=c"+ color_map.get(tile.svg_color) +"]";
	for(var j=0; j<tile.bounds.length; j+=2)
	    tikz_tile += " ("+ tile.bounds[j].toFixed(3) +","+ tile.bounds[j+1].toFixed(3) +") --";
	tikz_tile += " cycle;\n";
	tikz += tikz_tile;
    }
    tikz += "\\end{tikzpicture}";

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
        jsonToTilling(json);
    }
}

//cette fonction est appelé quand on clique sur le bouton create file
handleDownloadJSON = function(evt){
    if(currentTiling === undefined) return
    var link = document.getElementById('downloadlink');
    link.href = tillingToJson(currentTiling);
	link.setAttribute('download', "JS-Sandpile.json");
    //link.style.display = 'block';
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

handleDownloadTIKZ = function(evt){
    if(currentTiling === undefined) return
    var link = document.getElementById('downloadlink');
    var textFile = tilingToTIKZ(currentTiling);
	
    link.setAttribute('download', "JS-Sandpile.tex");
    link.href = textFile;
    link.click();
}

var createjson = document.getElementById('createjson')
createjson.addEventListener('click', handleDownloadJSON, false);

var createsvg = document.getElementById('createsvg');
createsvg.addEventListener('click', handleDownloadSVG, false);

var createtikz = document.getElementById('createtikz');
createtikz.addEventListener('click', handleDownloadTIKZ, false);

var textFile = null;

document.getElementById('files').addEventListener('change', handleFileSelect, false);

