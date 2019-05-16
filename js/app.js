class App{
	// Create the three.js canvas, which contains the grids

	constructor(){

		var container = document.getElementById("canvasHolder");
		this.WIDTH = container.clientWidth- 10;
		this.HEIGHT = container.clientHeight - 10;


		this.scene = new THREE.Scene();
		this.ratio = this.WIDTH / this.HEIGHT;

		var left = -this.WIDTH / 4.5;
		var right = this.WIDTH / 4.5;
		var top_cam = this.HEIGHT / 4.5;
		var bottom = -this.HEIGHT / 4.5;

		this.camera = new THREE.OrthographicCamera( left, right, top_cam, bottom, 0, 10 );
		this.camera.position.z = 5;

		this.renderer = new THREE.WebGLRenderer( );

		this.renderer.setSize(this.WIDTH, this.HEIGHT);
		container.appendChild(this.renderer.domElement);

		this.controls = new THREE.OrthographicTrackballControls( this.camera, this.renderer.domElement ); //OK

		this.controls.enablePan = true;
		this.controls.enableZoom = true;
		this.controls.enableRotate = false;
	}
	
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


// Application state variables ------------------------------------------------------------

var cmap = [new THREE.Color(0xffffff),
              new THREE.Color(0xdddddd),
              new THREE.Color(0xbbbbbb),
              new THREE.Color(0x999999),
              new THREE.Color(0x777777),
              new THREE.Color(0x555555),
              new THREE.Color(0xeeee00)];

var play = false;

var currentGrid;

var app = new App();

var SPEED = 1;

var delay = 20;

Math.seedrandom(1);

var selectedTile;

var tileInfo = document.getElementById("tileInfo");

var savedConfigs = [];

var selectColor = 0.0;

var color_select = new THREE.Color();

setInterval(refresh_zoom, 200);

setInterval(colorSelected, 100);

// ----------------------------------------------------------------------------------------

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){
	app.reset_size();

	//document.getElementById("bottomGroup").style.height = document.documentElement.clientHeight - document.getElementById("bottomGroup").offsetTop - 10;


}

function saveConfiguration(){
	if(currentGrid){
		var config_name = prompt("Enter configuration name : ", "Configuration " + savedConfigs.length);
		if (config_name == null || config_name == "") {
			return;
		}
		document.getElementById("complexOperationValue").innerHTML += '<option value="CNFG'+ savedConfigs.length +'">' + config_name + '</option>';
		
		savedConfigs.push(currentGrid.copy());
	}
}

function playPause(){
	var element = document.getElementById("playButton");
	element.classList.toggle("paused");
	play = !play;
}

function step(){
	if(currentGrid){
		currentGrid.iterate();
		currentGrid.colorTiles();
		if(selectedTile)
			tileInfo.innerHTML = "Tile index : " + selectedTile + "<br>Sand : " + currentGrid.tiles[selectedTile].sand;
	}
}


	
function colorSelected(){
	if(currentGrid){
		selectColor += 0.025;
		selectColor = selectColor % 1.0;
		if(currentGrid.selectedIndex >= 0 ){
			color_select.setHSL( selectColor, 1.0, 0.5 );
			currentGrid.colorTile(currentGrid.selectedIndex, color_select);
		}
	}
}

function complexOperationAdd(){
	// Apply the selected operation, additively

	if(currentGrid){
		var operationType = document.getElementById("complexOperationValue").value;
		var operationTimes = document.getElementById("complexOperationRepeat").valueAsNumber;
		switch(operationType) {
			case "OneE":
				currentGrid.addEverywhere(operationTimes);
			break;

			case "MaxS":
				currentGrid.addMaxStable();
			break;

			case "Rand":
				currentGrid.addRandom(operationTimes);
			break;

			case "Dual":
				currentGrid.addConfiguration(currentGrid.getDual());
			break;

			case "Iden":
				var identity1 = currentGrid.copy();
				var identity2 = currentGrid.copy();
				identity1.clear();
				identity2.clear();
				var maxLimit = 0;
				for(var i = 0; i < currentGrid.tiles.length; i++){
					if(maxLimit < currentGrid.tiles[i].limit)
						maxLimit = currentGrid.tiles[i].limit;
				}
				identity1.addEverywhere((maxLimit - 1) * 2);
				identity2.addEverywhere((maxLimit - 1) * 2);
				identity1.stabilize();
				identity2.removeConfiguration(identity1);

				identity2.stabilize();
				currentGrid.addConfiguration(identity2);
			break;
		}
		if(operationType.substring(0, 4) == "CNFG"){
			for(var i = 0; i<operationTimes; i++)
				currentGrid.addConfiguration(savedConfigs[operationType.substring(4, operationType.length)]);
		}
	}

	if(selectedTile)
		tileInfo.innerHTML = "Tile index : " + selectedTile + "<br>Sand : " + currentGrid.tiles[selectedTile].sand;
}

function complexOperationSet(){
	// Apply the selected operation, and set the grid accordingly

	if(currentGrid){
		var operationType = document.getElementById("complexOperationValue").value;
		var operationTimes = document.getElementById("complexOperationRepeat").valueAsNumber;
		switch(operationType) {
			case "OneE":
				currentGrid.clear();
				currentGrid.addEverywhere(operationTimes);
			break;

			case "MaxS":
				currentGrid.clear();
				currentGrid.addMaxStable();
			break;

			case "Rand":
				currentGrid.clear();
				currentGrid.addRandom(operationTimes);
			break;

			case "Dual":
				var newGrid = currentGrid.getDual();
				currentGrid.clear();
				currentGrid.addConfiguration(newGrid);
			break;

			case "Iden":
				var identity1 = currentGrid.copy();
				var identity2 = currentGrid.copy();
				identity1.clear();
				identity2.clear();

				var maxLimit = 0;
				for(var i = 0; i < currentGrid.tiles.length; i++){
					if(maxLimit < currentGrid.tiles[i].limit)
						maxLimit = currentGrid.tiles[i].limit;
				}
				identity1.addEverywhere((maxLimit - 1) * 2);
				identity2.addEverywhere((maxLimit - 1) * 2);

				identity1.stabilize();
				identity2.removeConfiguration(identity1);

				identity2.stabilize();
				currentGrid.clear();
				currentGrid.addConfiguration(identity2);
			break;
		}
		if(operationType.substring(0, 4) == "CNFG"){
			currentGrid.clear();
			for(var i = 0; i<operationTimes; i++)
				currentGrid.addConfiguration(savedConfigs[operationType.substring(4, operationType.length)]);
		}
	}

	if(selectedTile)
		tileInfo.innerHTML = "Tile index : " + selectedTile + "<br>Sand : " + currentGrid.tiles[selectedTile].sand;
}

function complexOperationSub(){
	// Apply the selected operation, subtractively

	if(currentGrid){
		var operationType = document.getElementById("complexOperationValue").value;
		var operationTimes = document.getElementById("complexOperationRepeat").valueAsNumber;
		switch(operationType) {
			case "OneE":
				currentGrid.removeEverywhere(operationTimes);
			break;

			case "MaxS":
				for(var i = 0; i< currentGrid.tiles.length; i++){
					currentGrid.remove(i, currentGrid.tiles[i].limit - 1);
				}
				currentGrid.colorTiles();
			break;

			case "Rand":
				currentGrid.removeRandom(operationTimes);
			break;

			case "Dual":
				currentGrid.removeConfiguration(currentGrid.getDual());
			break;

			case "Iden":
				var identity1 = currentGrid.copy();
				var identity2 = currentGrid.copy();
				identity1.clear();
				identity2.clear();

				var maxLimit = 0;
				for(var i = 0; i < currentGrid.tiles.length; i++){
					if(maxLimit < currentGrid.tiles[i].limit)
						maxLimit = currentGrid.tiles[i].limit;
				}
				identity1.addEverywhere((maxLimit - 1) * 2);
				identity2.addEverywhere((maxLimit - 1) * 2);

				identity1.stabilize();
				identity2.removeConfiguration(identity1);

				identity2.stabilize();
				currentGrid.removeConfiguration(identity2);
			break;
		}
		if(operationType.substring(0, 4) == "CNFG"){
			for(var i = 0; i<operationTimes; i++)
				currentGrid.removeConfiguration(savedConfigs[operationType.substring(4, operationType.length)]);
		}
	}

	if(selectedTile)
		tileInfo.innerHTML = "Tile index : " + selectedTile + "<br>Sand : " + currentGrid.tiles[selectedTile].sand;
}
function stabGrid(){
	if(currentGrid) {
		currentGrid.stabilize();
	}

	if(selectedTile)
		tileInfo.innerHTML = "Tile index : " + selectedTile + "<br>Sand : " + currentGrid.tiles[selectedTile].sand;
}

function drawGrid(){
	// Draws the selected grid

	while(app.scene.children.length > 0){
		app.scene.remove(app.scene.children[0]);
		console.log("cleared");
	}
	cW = document.getElementById("cW").value;
	cH = document.getElementById("cH").value;

	selectedTile = null;
	preset = document.getElementById("gridSelect").value;

	var nbIt = document.getElementById("penroseIt").value;
	switch(preset){
		case "gridHex":
			currentGrid = Tiling.hexTiling(cW, cH, cmap);
			app.camera.zoom = 0.7;
		break;

		case "gridTri":
			currentGrid = Tiling.triTiling(cW, cmap);
			app.camera.zoom = 1.2;
		break;

		case "gridPenHKKD":
			currentGrid = Tiling.HKKDPenroseSandpile(nbIt, cmap);
			app.camera.zoom = 0.7;
		break;

		case "gridPenHDKD":
			currentGrid = Tiling.HDKDPenroseSandpile(nbIt, cmap);
			app.camera.zoom = 0.7;
		break;

		case "gridPenSunKD":
			currentGrid = Tiling.SunKDPenroseSandpile(nbIt, cmap);
			app.camera.zoom = 0.7;
		break;

		case "gridPenStarKD":
			currentGrid = Tiling.StarKDPenroseSandpile(nbIt, cmap);
			app.camera.zoom = 0.7;
		break;

		default:
			currentGrid = Tiling.sqTiling(cW, cH, cmap);
			app.camera.zoom = 1;
		break;

	}

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

async function playWithDelay() {
	// Apply the selected delay to the iterations

	if(currentGrid){
	  while(true){
		  if(play){
		  iterateGrid ();
		  }
		await sleep(delay);
	  }
	}
}

function iterateGrid(){
	for(var i = 0; i<SPEED; i++){
		currentGrid.iterate();
	}
	currentGrid.colorTiles();
	if(selectedTile)
		tileInfo.innerHTML = "Tile index : " + selectedTile + "<br>Sand : " + currentGrid.tiles[selectedTile].sand;

}

function sleep(ms) {
	// JS implementation of sleep
	return new Promise(resolve => setTimeout(resolve, ms));
}

/***********************************/
/* PARTIE IMPLEMENTATION DU CLIQUE */
/***********************************/

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
					currentGrid.remove(currentGrid.indexDict[face.faceIndex*3], nbTimes);
					break;

				case "select":
					selectedTile = currentGrid.indexDict[face.faceIndex*3];
					tileInfo.innerHTML = "Tile index : " + selectedTile + "<br>Sand : " + currentGrid.tiles[selectedTile].sand;
					currentGrid.selectedIndex = currentGrid.indexDict[face.faceIndex*3];
					break;

				default:
					currentGrid.add(currentGrid.indexDict[face.faceIndex*3], nbTimes);
					break;
			}

		}
	}

  }, false);


/*******/
/* FIN */
/*******/



function typed_splice(arr, starting, deleteCount, elements) {
  if (arguments.length === 1) {
    return arr;
  }
  starting = Math.max(starting, 0);
  deleteCount = Math.max(deleteCount, 0);
  elements = elements || [];


  const newSize = arr.length - deleteCount + elements.length;
  const splicedArray = new arr.constructor(newSize);

  splicedArray.set(arr.subarray(0, starting));
  splicedArray.set(elements, starting);
  splicedArray.set(arr.subarray(starting + deleteCount), starting + elements.length);
  return splicedArray;
};
//https://threejs.org/examples/#webgl_interactive_buffergeometry
