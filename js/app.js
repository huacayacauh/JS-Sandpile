// 	###################  APP.JS  ###################
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
// 	[ 1.0 ] 	Main class of the application
//			
//		Creates the THREE.js canvas containing
//		the interesting part of the app.
//
// ################################################
class App{

	constructor(){

		// Display
		var container = document.getElementById("canvasHolder");
		this.WIDTH = container.clientWidth- 10;
		this.HEIGHT = container.clientHeight - 10;
		
		this.scene = new THREE.Scene();
		this.ratio = this.WIDTH / this.HEIGHT;
		
		this.renderer = new THREE.WebGLRenderer( );
		this.renderer.setSize(this.WIDTH, this.HEIGHT);
		container.appendChild(this.renderer.domElement);

		// Controls
		var left = -this.WIDTH / 4.5;
		var right = this.WIDTH / 4.5;
		var top_cam = this.HEIGHT / 4.5;
		var bottom = -this.HEIGHT / 4.5;

		this.camera = new THREE.OrthographicCamera( left, right, top_cam, bottom, 0, 10 );
		this.camera.position.z = 5;

		this.controls = new THREE.OrthographicTrackballControls( this.camera, this.renderer.domElement ); //OK

		this.controls.enablePan = true;
		this.controls.enableZoom = true;
		this.controls.enableRotate = false;
	}
	
	// ------------------------------------------------
	// 	[ 1.1 ] 	Re-sizing of the Canvas
	// ------------------------------------------------
	
	reset_size(){
		var container = document.getElementById("canvasHolder");
		this.WIDTH = container.clientWidth- 10;
		this.HEIGHT = container.clientHeight - 10;

		this.ratio = this.WIDTH / this.HEIGHT;

		var left = -this.WIDTH / 4.5;
		var right = this.WIDTH / 4.5;
		var top_cam = this.HEIGHT / 4.5;
		var bottom = -this.HEIGHT / 4.5;
		this.camera.left = left;
		this.camera.right = right;
		this.camera.top = top_cam;
		this.camera.bottom = bottom;
		
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(this.WIDTH, this.HEIGHT);
	}
}


// ################################################
//
// 	[ 2.0 ]		Application state variables
//			
//		Shared and used between many files
//
// ################################################

var cmap = []; // default

var play = false;

var currentTiling;

var currentIdentity;

var app = new App();

var it_per_frame = 1;

var delay = 100;

var selectedTile;

var savedConfigs = [];

var wireFrameEnabled = false;

// ---------------------- Less important variables

var color_hue_shift = 0.0; // Animation of selected tile color

var color_select = new THREE.Color(); // Animation of selected tile color

var tileInfo = document.getElementById("tileInfo"); 

var check_copy = true; // Copy the tiling once in a while to see if it is stable

// ---------------------- Routines

setInterval(colorSelected, 200); //		[ 4.2 ]

setInterval(refresh_zoom, 200); // 		[ 5.2 ]

// ---------------------- Events

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){
	app.reset_size();
}

// ################################################
//
// 	[ 3.0 ]		Tiling manipulation controls
//			
//		See Tiling.js [ 2.0 ]
//
// ################################################

// ------------------------------------------------
// 	[ 3.1 ] 	Apply one sandpile step
//		Tiling.js [ 2.2 ] [ 2.6 ]
// ------------------------------------------------
function step(){
	if(currentTiling){
		currentTiling.iterate();
		currentTiling.colorTiles();
		if(selectedTile)
			tileInfo.innerHTML = "Tile index : " + selectedTile + "<br>Sand : " + currentTiling.tiles[selectedTile].sand;
	}
}


// ------------------------------------------------
// 	[ 3.2 ] 	Apply multiple steps and color
//		Tiling.js [ 2.2 ] [ 2.6 ]
// ------------------------------------------------
function iterateTiling(){
	var is_stable = false;
	for(var i = 0; i<it_per_frame; i++){
		is_stable = currentTiling.iterate();
	}
	
	if(document.getElementById("pauseToggle").checked && is_stable)
		playPause(document.getElementById("playButton"));
	currentTiling.colorTiles();
	if(selectedTile)
		tileInfo.innerHTML = "Tile index : " + selectedTile + "<br>Sand : " + currentTiling.tiles[selectedTile].sand;

}

// ------------------------------------------------
// 	[ 3.3 ] 	Assign sandpile identity to
//				the currentIdentity variable.
//		Tiling.js [ 2.4 ] [ 2.5 ]
// ------------------------------------------------
function findIdentity(){
	var identity1 = currentTiling.hiddenCopy();
	var identity2 = currentTiling.hiddenCopy();
	identity1.clear();
	identity2.clear();
	console.log(identity1);
	var maxLimit = 0;
	for(var id in currentTiling.tiles){
		if(maxLimit < currentTiling.tiles[id].limit)
			maxLimit = currentTiling.tiles[id].limit;
	}
	identity1.addEverywhere((maxLimit - 1) * 2);
	identity2.addEverywhere((maxLimit - 1) * 2);
	identity1.stabilize();
	identity2.removeConfiguration(identity1);

	identity2.stabilize();
	
	currentIdentity = identity2;
}

// ------------------------------------------------
// 	[ 3.4 ] 	Stabilize the current Tiling
//		Tiling.js [ 2.5 ]
// ------------------------------------------------
function stabTiling(){
	if(currentTiling) {
		currentTiling.stabilize();
	}

	if(selectedTile)
		tileInfo.innerHTML = "Tile index : " + selectedTile + "<br>Sand : " + currentTiling.tiles[selectedTile].sand;
}


// ------------------------------------------------
// 	[ 3.5 ] 	Empty the Tiling
//		Tiling.js [ 2.4 ]
// ------------------------------------------------
function clearTiling(){
	if(currentTiling){
		currentTiling.clear();
	}
}

// ------------------------------------------------
// 	[ 3.6 ] 	Adding, Subtracting and setting
//				complex operations over the
//				current Tiling.
//		
//		This section could be improved ...
//
//		Tiling.js [ 2.3 ] [ 2.4 ] [ 2.5 ]
//
// ------------------------------------------------
function complexOperationAdd(){
	// Apply the selected operation, additively

	if(currentTiling){
		var operationType = document.getElementById("complexOperationValue").value;
		var operationTimes = document.getElementById("complexOperationRepeat").valueAsNumber;
		switch(operationType) {
			case "OneE":
				currentTiling.addEverywhere(operationTimes);
			break;

			case "MaxS":
				for(var i = 0; i<operationTimes;i++)
					currentTiling.addMaxStable();
			break;

			case "Rand":
				currentTiling.addRandom(operationTimes);
			break;

			case "Dual":
				currentTiling.addConfiguration(currentTiling.getHiddenDual());
			break;

			case "Iden":
				if(!currentIdentity)
					findIdentity();
				for(var i = 0; i< operationTimes; i++)
					currentTiling.addConfiguration(currentIdentity);
			break;
		}
		if(operationType.substring(0, 4) == "CNFG"){
			for(var i = 0; i<operationTimes; i++)
				currentTiling.addConfiguration(savedConfigs[operationType.substring(4, operationType.length)]);
		}
	}

	if(selectedTile)
		tileInfo.innerHTML = "Tile index : " + selectedTile + "<br>Sand : " + currentTiling.tiles[selectedTile].sand;
}

function complexOperationSet(){
	// Apply the selected operation, and set the Tiling accordingly

	if(currentTiling){
		var operationType = document.getElementById("complexOperationValue").value;
		var operationTimes = document.getElementById("complexOperationRepeat").valueAsNumber;
		switch(operationType) {
			case "OneE":
				currentTiling.clear();
				currentTiling.addEverywhere(operationTimes);
			break;

			case "MaxS":
				currentTiling.clear();
				for(var i = 0; i< operationTimes; i++)
					currentTiling.addMaxStable();
			break;

			case "Rand":
				currentTiling.clear();
				currentTiling.addRandom(operationTimes);
			break;

			case "Dual":
				var newTiling = currentTiling.getHiddenDual();
				currentTiling.clear();
				currentTiling.addConfiguration(newTiling);
			break;

			case "Iden":
				currentTiling.clear();
				if(!currentIdentity)
					findIdentity();
				for(var i = 0; i< operationTimes; i++)
					currentTiling.addConfiguration(currentIdentity);
			break;
		}
		if(operationType.substring(0, 4) == "CNFG"){
			currentTiling.clear();
			for(var i = 0; i<operationTimes; i++)
				currentTiling.addConfiguration(savedConfigs[operationType.substring(4, operationType.length)]);
		}
	}

	if(selectedTile)
		tileInfo.innerHTML = "Tile index : " + selectedTile + "<br>Sand : " + currentTiling.tiles[selectedTile].sand;
}

function complexOperationSub(){
	// Apply the selected operation, subtractively

	if(currentTiling){
		var operationType = document.getElementById("complexOperationValue").value;
		var operationTimes = document.getElementById("complexOperationRepeat").valueAsNumber;
		switch(operationType) {
			case "OneE":
				currentTiling.removeEverywhere(operationTimes);
			break;

			case "MaxS":
				for(var i = 0; i< currentTiling.tiles.length; i++){
					currentTiling.remove(i, (currentTiling.tiles[i].limit - 1)* operationTimes);
				}
				currentTiling.colorTiles();
			break;

			case "Rand":
				currentTiling.removeRandom(operationTimes);
			break;

			case "Dual":
				currentTiling.removeConfiguration(currentTiling.getHiddenDual());
			break;

			case "Iden":
				if(!currentIdentity)
					findIdentity();
				for(var i = 0; i< operationTimes; i++)
					currentTiling.removeConfiguration(currentIdentity);
			break;
		}
		if(operationType.substring(0, 4) == "CNFG"){
			for(var i = 0; i<operationTimes; i++)
				currentTiling.removeConfiguration(savedConfigs[operationType.substring(4, operationType.length)]);
		}
	}

	if(selectedTile)
		tileInfo.innerHTML = "Tile index : " + selectedTile + "<br>Sand : " + currentTiling.tiles[selectedTile].sand;
}

// ################################################
//
// 	[ 4.0 ]		Tiling display controls
//			
//		See Tiling [ 2.0 ]
//
// ################################################

// ------------------------------------------------
// 	[ 4.1 ] 	Main play function
// ------------------------------------------------
async function playWithDelay() {
	if(currentTiling){
	  while(true){
		  if(play){
		  iterateTiling ();
		  }
		await sleep(delay);
	  }
	}
}

// ------------------------------------------------
// 	[ 4.2 ] 	Either play, or pause
// ------------------------------------------------
function playPause(elem){
	if(play){
		play = false;
		elem.innerHTML = "Play";
		elem.style.backgroundColor= "#FFFFFF";
	} else {
		play = true;
		elem.innerHTML = "Pause";
		elem.style.backgroundColor = "#CCCCCC";
	}
}

// ------------------------------------------------
// 	[ 4.3 ] 	Shift hue of selected tile
//			
//			Called by a routine.
// ------------------------------------------------
function colorSelected(){
	if(currentTiling){
		if(!play){
			color_hue_shift += 0.05;
			color_hue_shift = color_hue_shift % 1.0;
			if(currentTiling.selectedIndex >= 0 ){
				color_select.setHSL( color_hue_shift, 1.0, 0.5 );
				currentTiling.colorTile(currentTiling.selectedIndex, color_select);
			}
		}
	}
}

// ------------------------------------------------
// 	[ 4.4 ] 	Display border of tiles.
// ------------------------------------------------
function enableWireFrame(elem){
	if(currentTiling){
		if(currentTiling.wireFrame){
			if(elem.checked){
				app.scene.add(currentTiling.wireFrame);
				wireFrameEnabled = true;
			}
			else{
				app.scene.remove(currentTiling.wireFrame);
				wireFrameEnabled = false;
			}
		}
	}
		
}

// ------------------------------------------------
// 	[ 4.5 ] 	Draws currentTiling on
//				the THREE.js Canvas.
//
//		App.js [ 1.0 ]
// ------------------------------------------------
function drawTiling(){

	while(app.scene.children.length > 0){
		app.scene.remove(app.scene.children[0]);
		console.log("cleared");
	}
	
	check_stable = 0;
	
	cW = document.getElementById("cW").value;
	cH = document.getElementById("cH").value;
	
	var size = document.getElementById("size").value;

	selectedTile = null;
	
	currentIdentity = null;
	
	preset = document.getElementById("TilingSelect").value;

	var nbIt = document.getElementById("penroseIt").value;
	
	var command = "currentTiling = Tiling." + preset + "({height:cH, width:cW, iterations:nbIt, size:size})";
	
	eval(command);
	
	currentTiling.cmap = cmap;
	
	app.controls.zoomCamera();
	app.controls.object.updateProjectionMatrix();

	app.scene.add(currentTiling.mesh);
	
	currentTiling.colorTiles();
	//console.log(currentTiling);
	
	enableWireFrame(document.getElementById("wireFrameToggle"));

	playWithDelay();

	var render = function () {
		requestAnimationFrame( render );
		app.controls.update();
		app.renderer.render( app.scene, app.camera );
	};
	render();
}

// ################################################
//
// 	[ 5.0 ]		Misc Functions
//
// ################################################

// ------------------------------------------------
// 	[ 5.1 ] 	JS implementation of sleep
// ------------------------------------------------
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// ------------------------------------------------
// 	[ 5.2 ] 	Refresh the zoom according to
//				the html element.
//
//			Called by a routine.
// ------------------------------------------------
function refresh_zoom(){
	if(app)
		document.getElementById("zoomLevel").value = Math.round(app.camera.zoom * 100);
}

// ------------------------------------------------
// 	[ 5.3 ] 	Locally saves tiling
// ------------------------------------------------
function saveConfiguration(){
	if(currentTiling){
		var config_name = prompt("Enter configuration name : ", "Configuration " + savedConfigs.length);
		if (config_name == null || config_name == "") {
			return;
		}
		document.getElementById("complexOperationValue").innerHTML += '<option value="CNFG'+ savedConfigs.length +'">' + config_name + '</option>';
		
		savedConfigs.push(currentTiling.hiddenCopy());
	}
}


// ################################################
//
// 	[ 6.0 ]		Mouse Click
//			
//		See Tiling 
//
// ################################################


var mouse = new THREE.Vector2(); // un Vector2 contient un attribut x et un attribut y
var raycaster = new THREE.Raycaster(); // rayon qui va intersecter la pile de sable

app.renderer.domElement.addEventListener('click', function( event ) {

	//on calcule un ration entre -1 et 1 pour chaque coordonées x et y du clique
	//si mouse.x == -1 alors on a cliqué tout à gauche
	//si mouse.x ==  1 alors on a cliqué tout à droite
	//si mouse.y == -1 alors on a cliqué tout en bas
	//si mouse.y ==  1 alors on a cliqué tout en haut
	var rect = app.renderer.domElement.getBoundingClientRect(); // correction de la position de la souris par rapport au canvas

    mouse.x = ((event.clientX - rect.left) / app.WIDTH ) * 2 - 1;
	mouse.y = - ((event.clientY - rect.top) / app.HEIGHT ) * 2 + 1;

	// on paramète le rayon selon les ratios et la camera
	raycaster.setFromCamera(mouse, app.camera);
	// l'objet intersects est u tableau qui contient toutes les faces intersectés par le rayon

	if(app.scene.children.length > 0){

		var intersects = raycaster.intersectObject(app.scene.children[0]);

		if(intersects.length > 0){

			var face = intersects[0];
			var triangleIndex = face.faceIndex;
			var nbTimes = document.getElementById("mouseOperationRepeat").valueAsNumber;

			var mouseTODO = document.getElementById("mouseOperation").value;
			
			switch(mouseTODO){
				case "rmOne":
					currentTiling.remove(currentTiling.indexDict[face.faceIndex*3], nbTimes);
					break;

				case "select":
					if(currentTiling.selectedIndex)
						currentTiling.colorTile(currentTiling.selectedIndex);
					selectedTile = currentTiling.indexDict[face.faceIndex*3];
					
					console.log(currentTiling.tiles[selectedTile]);
					tileInfo.innerHTML = "Tile index : " + selectedTile + "<br>Sand : " + currentTiling.tiles[selectedTile].sand;
					currentTiling.selectedIndex = currentTiling.indexDict[face.faceIndex*3];
					break;

				default:
					currentTiling.add(currentTiling.indexDict[face.faceIndex*3], nbTimes);
					break;
			}

		}
	}

  }, false);

// ################################################
//
// 	EOF
//
// ################################################

