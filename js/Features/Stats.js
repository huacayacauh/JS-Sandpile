Tiling.prototype.get_stats = function(){
	var mean = 0;
	var std = 0;
	
	var populations = {};
	for(var i = 0; i<this.tiles.length; i++){
		mean += this.tiles[i].sand;
		if(!populations[this.tiles[i].sand])
			populations[this.tiles[i].sand] = 1;
		else 
			populations[this.tiles[i].sand]++ ;
	}
	var len = this.tiles.length;
	Object.keys(populations).forEach(function(key) {
		populations[key] = populations[key]/len;
	});
	mean = mean / this.tiles.length;
	for(var i = 0; i<this.tiles.length; i++){
		std += Math.pow((this.tiles[i].sand - mean), 2);
	}
	std = std / this.tiles.length;
	std = Math.sqrt(std);
	
	return {"Mean":mean, "Std":Math.round(std * 100000)/100000, "Population":populations};
}

function makeStatsFile(grid){
	var arr_mean = [];
	var arr_std = [];
	var arr_populations = [];
	
	var oldTiles = [];
	for(var i = 0; i<grid.tiles.length; i++){
		oldTiles.push(new Tile(grid.tiles[i].id, Array.from(grid.tiles[i].neighbors), Array.from(grid.tiles[i].pointsIndexes)));
	}
	var done = false;
	while(!done){
		done = true;
		for(var i = 0; i<grid.tiles.length; i++){
			if(oldTiles[i].sand != grid.tiles[i].sand){
				oldTiles[i].sand = grid.tiles[i].sand;
				done = false;
			}
		}
		for(var i = 0; i<50; i++){
			var stat = grid.get_stats();
			arr_mean.push(stat["Mean"]);
			arr_std.push(stat["Std"]);
			arr_populations.push(stat["Population"]);
			grid.iterate();
		}
	}
	grid.colorTiles();
	
	var text1 = "";
	for(var i = 0; i<arr_mean.length; i++){
		text1 += arr_mean[i] + " "
	}
	var text2	= "";
	for(var i = 0; i<arr_std.length; i++){
		text2 += arr_std[i] + " "
	}
	var text3 = "";
	
	for(var i = 0; i<arr_populations.length; i++){
		Object.keys(arr_populations[i]).forEach(function(key) {
			text3 += arr_populations[i][key] + " ";
		});
		text3 += "\n"
	}
	

    var data1 = new Blob([text1], {type: 'text/plain'});
    var data2 = new Blob([text2], {type: 'text/plain'});
    var data3 = new Blob([text3], {type: 'text/plain'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.

    var textFile1 = window.URL.createObjectURL(data1);

    var textFile2 = window.URL.createObjectURL(data2);

    var textFile3 = window.URL.createObjectURL(data3);


	
	return [textFile1, textFile2, textFile3]; 
}

handleDownloadStats = function(evt){

    if(currentGrid === undefined) return
    var link = document.getElementById('downloadlink');
	
	var textFiles = makeStatsFile(currentGrid);
	
	link.setAttribute('download', "Sandpile_means.txt");
    link.href = textFiles[0];
	link.click();
	
	link.setAttribute('download', "Sandpile_deviation.txt");
	link.href = textFiles[1];
	link.click();
	
	link.setAttribute('download', "Sandpile_population.txt");
	link.href = textFiles[2];
	link.click();
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}


var create2 = document.getElementById('create2')
create2.addEventListener('click', handleDownloadStats, false);