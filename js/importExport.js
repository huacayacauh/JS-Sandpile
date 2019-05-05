jsonToTilling = function(json){

    var points = json.points;
    var colors = json.colors;

    var tiles = []

    for(var i = 0; i < json.tiles.length; i++){
        var tileJson = json.tiles[i]
        tiles.push(new Tile(tileJson.id, tileJson.neighboors, tileJson.points, tileJson.lim));
    }


    currentGrid = new Tiling(points, colors, tiles, cmap);

    app.scene.remove(app.scene.children[0]); 
    app.scene.add(currentGrid.mesh);
}


tillingToJson = function(sandpile){

    var json = {};
    

    var arrayColors = sandpile.mesh.geometry.attributes.color.array;
    var arrayPosition = sandpile.mesh.geometry.attributes.position.array;

    var points = []
    var colors = []
    for(var i = 0; i < arrayColors.length; i++){
        
        points.push(arrayPosition[i]);
        colors.push(arrayColors[i]);
    }

    json.points = points
    json.colors = colors


    var tiles = []


    for(var i = 0; i < sandpile.tiles.length; i++){
        var tile = sandpile.tiles[i];
        tiles.push({id: tile.id, neighboors: tile.neighboors, points: tile.pointsIndexes, lim: tile.limit});
        
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
    link.style.display = 'block';
}

var create = document.getElementById('create')
var textFile = null;

create.addEventListener('click', handleDownload, false);

document.getElementById('files').addEventListener('change', handleFileSelect, false);
