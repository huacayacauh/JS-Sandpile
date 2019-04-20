class App{
	// Create the three.js canvas, which contains the grids

	constructor(){
		this.WIDTH = 600;
		this.HEIGHT = 500;


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
		var container = document.getElementById("canvasHolder");
		document.body.appendChild( container );
		container.appendChild(this.renderer.domElement);
	
		this.controls = new THREE.OrthographicTrackballControls( this.camera, this.renderer.domElement ); //OK
		
		this.controls.enablePan = true;
		this.controls.enableZoom = true;
		this.controls.enableRotate = false;
	}
}



var cmap = [new THREE.Color(0xffffff),
              new THREE.Color(0xffff00),
              new THREE.Color(0xff9900),
              new THREE.Color(0xff5500),
              new THREE.Color(0xff0000)];

var play = false;
var currentGrid;
var app = new App();
var SPEED = 10;

function playPause(){
	var element = document.getElementById("playButton");
	element.classList.toggle("paused");
	play = !play;
}

function step(){
	if(currentGrid){
		currentGrid.iterate();
		currentGrid.colorTiles();
	}
}

function complexOperation(){
	// Function applied by the secondary operations
	
	if(currentGrid){
		var operationType = document.getElementById("complexOperationValue").value;
		var operationTimes = Number(document.getElementById("complexOperationRepeat").value);
		switch(operationType) {
			case "addOne":
				currentGrid.addEverywhere(operationTimes);
			break;
			
			case "rmOne":
				currentGrid.removeEverywhere(operationTimes);
			break;
		}
	}
}

function drawGrid(){
	// Draw a square grid - could be splitted in init() and drawSquare()
	
	while(app.scene.children.length > 0){ 
		app.scene.remove(app.scene.children[0]); 
	}
	cW = document.getElementById("cW").value;
	cH = document.getElementById("cH").value;
	
	currentGrid = Tiling.sqTiling(cW, cH, cmap);
	
	app.scene.add(currentGrid.mesh);
	currentGrid.colorTiles();
	console.log(currentGrid);
	
	var render = function () {
		requestAnimationFrame( render );
		app.controls.update();
		if(currentGrid){
			if(play){
				for(var i = 0; i<SPEED; i++){
					currentGrid.iterate();
				}
				currentGrid.colorTiles();
			}
		}
		app.renderer.render( app.scene, app.camera );
	};
	render();
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

			var squareIndex = (triangleIndex%2 == 0) ? triangleIndex/2 : (triangleIndex-1)/2; //1 carré = 2 triangles
			currentGrid.add(squareIndex, 1);

		}
	}

  }, false);


/*******/
/* FIN */
/*******/

//https://threejs.org/examples/#webgl_interactive_buffergeometry