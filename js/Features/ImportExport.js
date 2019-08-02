jsonToTilling = function(json){

    var points = json.points;
    var tiles = []

    for(var i = 0; i < json.tiles.length; i++){
        var tileJson = json.tiles[i]
		var til = new Tile(tileJson.id, tileJson.neighbours, tileJson.points, tileJson.lim);
		til.sand = tileJson.sand;
        tiles.push(til);
    }
	
	var colors = json.points;


    currentGrid = new Tiling(points, colors, tiles, cmap);
	while(app.scene.children.length > 0){
		app.scene.remove(app.scene.children[0]);
		console.log("cleared");
	}
	
	grid_check_stable = currentGrid.copy();
	
	selectedTile = null;
	app.controls.zoomCamera();
	app.controls.object.updateProjectionMatrix();

	app.scene.add(currentGrid.mesh);
	currentGrid.colorTiles();
	//console.log(currentGrid);

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
    
    var arrayPosition = sandpile.mesh.geometry.attributes.position.array;

    var points = []
    for(var i = 0; i < arrayPosition.length; i++){
        points.push(arrayPosition[i]);
    }

    json.points = points


    var tiles = []

    for(var i = 0; i < sandpile.tiles.length; i++){
        var tile = sandpile.tiles[i];
        tiles.push({id: tile.id, neighbours: tile.neighbours, points: tile.pointsIndexes, lim: tile.limit, sand:tile.sand});
        
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

    if(currentGrid === undefined) return
    var link = document.getElementById('downloadlink');
    link.href = tillingToJson(currentGrid);
	link.setAttribute('download', "Sandpile.JSON");
    //link.style.display = 'block';
	link.click();
}

var create = document.getElementById('create')
var textFile = null;

create.addEventListener('click', handleDownload, false);

document.getElementById('files').addEventListener('change', handleFileSelect, false);
