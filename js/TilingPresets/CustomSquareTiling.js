
async function draw_custom(srcPIC){
        console.log("drawing a tiling from image");
	
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
	var tils = [];
	
	for(var i = 0; i < width; i++){
		for(var j = 0; j < height; j++){
			if(context.getImageData(i, j, 1, 1).data[0] == 0){
				tils.push(Tile.squareTile(i, height-j, width, height));
			}
		}
	}
	
	// ---------------------------------------------------------------------------------------------------------------
	
	check_stable = 0;
	selectedTile = null;
	
	currentTiling = new Tiling(tils);
	currentTiling.cmap = cmap;
	enableWireFrame(document.getElementById("wireFrameToggle"));
	//app.camera.zoom = 1.0;

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

        console.log("done with "+tils.length+" tiles");
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
