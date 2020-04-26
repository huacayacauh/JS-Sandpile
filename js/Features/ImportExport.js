// 	#############  IMPORTEXPORT.JS  ################
//	 		Authors : 	FERSULA Jérémy
//						DARRIGO Valentin
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
// 	[ 1.0 ] 	JSON Translation of Tilings
//
// ################################################

jsonToTilling = function(json){

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
	//console.log(currentTiling);

	playWithDelay();

	var render = function () {
		requestAnimationFrame( render );
		app.controls.update();
		app.renderer.render( app.scene, app.camera );
	};
	render();
}


tillingToJson = function(sandpile){

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
};

tilingToSvg = function(sandpile){

   
	
    var tiles = []
	
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
};

// ################################################
//
// 	[ 2.0 ] 	Tiling Download
//
// ################################################

//cette fonction est applé quand on clique sur le bouton selection
handleFileSelect = function(evt) {
    var files = evt.target.files; // FileList object
    var file = files[0];

    //console.log("Type:", file.type);

    // files is a FileList of File objects. List some properties.
    reader = new FileReader();
    reader.readAsText(file, "UTF-8");

    reader.onload = function(evt){
        
        var fileString = evt.target.result;
        //console.log(fileString);

        var json = JSON.parse(fileString);

        //app.sandpile = json;

        jsonToTilling(json);


    }
}

//cette fonction est appelé quand on clique sur le bouton create file
handleDownload = function(evt){

    if(currentTiling === undefined) return
    var link = document.getElementById('downloadlink');
    link.href = tillingToJson(currentTiling);
	link.setAttribute('download', "Sandpile.JSON");
    //link.style.display = 'block';
	link.click();
}

handleDownloadSVG = function(evt){
    if(currentTiling === undefined) return
    var link = document.getElementById('downloadlink');
	var textFile = tilingToSvg(currentTiling);
	
	link.setAttribute('download', "Sandpile.svg");
    link.href = textFile;
	link.click();
}

var create = document.getElementById('create')
var textFile = null;

create.addEventListener('click', handleDownload, false);

document.getElementById('files').addEventListener('change', handleFileSelect, false);

var createsvg = document.getElementById('createsvg');
createsvg.addEventListener('click', handleDownloadSVG, false);


// ################################################
//
// 	EOF
//
// ################################################

