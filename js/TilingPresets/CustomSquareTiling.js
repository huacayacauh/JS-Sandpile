
async function draw_custom(srcPIC){
	
	while(app.scene.children.length > 0){
		app.scene.remove(app.scene.children[0]);
		console.log("cleared");
	}
	
	//Making the Tiling -------------------------------------------------------------------------------------------------------
	var img = new Image();
	
	img.src = srcPIC;
	
	while(img.width == 0){
		await sleep(20);
	}
	
	var convos = document.createElement('canvas');
	convos.width = img.width;
	convos.height = img.height;
	var context = convos.getContext('2d');
	context.drawImage(img, 0, 0, img.width, img.height);
	
	var height = img.height;
	var width = img.width;
	
	//Tiling construction
	var pos = [];
	var col = [];
	var tils = [];

	var c2 = width/2;
	var l2 = height/2;
	
	var index = 0;
	
	var neighbourhood = {};
	
	for(var i = 0; i < width; i++){
		for(var j = 0; j < height; j++){
			if(context.getImageData(i, j, 1, 1).data[0] == 0){
				pos.push( i - l2, -j + c2, 0 );
				pos.push( i+1 - l2, -j + c2, 0 );
				pos.push( i+1 - l2, -j-1 + c2, 0 );

				col.push( 255, 0, 0 );
				col.push( 255, 0, 0 );
				col.push( 255, 0, 0 );

				pos.push( i+1 - l2, -j-1 + c2, 0 );
				pos.push( +i - l2, -j-1 + c2, 0 );
				pos.push( +i - l2, -j + c2, 0 );

				col.push( 255, 255, 255 );
				col.push( 255, 255, 255 );
				col.push( 255, 255, 255 );
				
				
				var id;
				var neighbours = [];
				id = index;
				
				neighbourhood[i*height+j]=index;
				
				var pointsIds = [];
				for(var k=0; k<6; k++){
					pointsIds.push(pos.length/3 - 6 + k);
				}
				index++;
				tils.push(new Tile(id, neighbours, pointsIds, 4));
			}
		}
	}
	index = 0;
	for(var i = 0; i < width; i++){
		for(var j = 0; j < height; j++){
			if(context.getImageData(i, j, 1, 1).data[0] == 0){
				if(context.getImageData(i, j, 1, 1).data[1] == 255){
				tils[index].sand = 2;
				}
				if(context.getImageData(i, j, 1, 1).data[2] == 255){
					tils[index].sand = 3;
				}
				if(context.getImageData(i-1, j, 1, 1).data[0] == 0) tils[index].neighbours.push(neighbourhood[(i-1)*height + j]);
				if(context.getImageData(i+1, j, 1, 1).data[0] == 0) tils[index].neighbours.push(neighbourhood[(i+1)*height + j]);
				if(context.getImageData(i, j-1, 1, 1).data[0] == 0) tils[index].neighbours.push(neighbourhood[i*height + j-1]);
				if(context.getImageData(i, j+1, 1, 1).data[0] == 0) tils[index].neighbours.push(neighbourhood[i*height + j+1]);
				
				index++;
			}
			
		}
	}
	
	// ---------------------------------------------------------------------------------------------------------------
	
	check_stable = 0;

	selectedTile = null;
	
	
	currentGrid = new Tiling(pos, col, tils, cmap, pos);
	
	enableWireFrame(document.getElementById("wireFrameToggle"));
	app.camera.zoom = 1.0;
	
	grid_check_stable = currentGrid.copy();

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

async function importAsImage(){
	var buttonImport = document.getElementById("fileToUpload");
	buttonImport.click();
	document.getElementById("submitButton").click();
}


document.getElementById('filesPIC').onchange = function (evt) {
    var tgt = evt.target || window.event.srcElement,
        files = tgt.files;

    // FileReader support
    if (FileReader && files && files.length) {
        var fr = new FileReader();
        fr.onload = function () {
            draw_custom(fr.result);
        }
        fr.readAsDataURL(files[0]);
    }

    else {
        alert("Error : File not supported.");
    }
}