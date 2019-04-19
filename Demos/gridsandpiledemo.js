var SPEED = 10;

var colors = [new THREE.Color(0xffffff),
              new THREE.Color(0xcccccc),
              new THREE.Color(0x999999),
              new THREE.Color(0x666666),
              new THREE.Color(0xff9900)];

var NBCOLORS = colors.length;

class GridSandpile{


	//créer un carré l'objet 3D représantant constituant le tas de sable
	//ATTENTION l'objet bufferGeometry de three.js ne prend en charge
	//que des faces triangulaires  
	//un carré est donc composé de deux triabgles
	makeSquare(positions, colors, i, j, l2, c2) {

	    positions.push( i  - c2, -j   + l2, 0 );
		positions.push( i  - c2, -j-1 + l2, 0 );
		positions.push( i+1- c2, -j-1 + l2, 0 );

		colors.push( 0, 1, 0 );
		colors.push( 0, 1, 0 );
		colors.push( 0, 1, 0 );

		positions.push( i+1 - c2, -j-1 + l2, 0 );
		positions.push( i+1 - c2, -j   + l2, 0 );
		positions.push( i   - c2, -j   + l2, 0 );

		colors.push( 1, 0, 0 );
		colors.push( 1, 0, 0 );
		colors.push( 1, 0, 0 );
	}

	//met à jour la couleurs du carré i,j 
	setSquareColor(i, j, newColor){

		var index = (i*this.column + j)*6;

		var color = this.object3D.geometry.attributes.color;

		var r = newColor.r; var g = newColor.g; var b = newColor.b;
		
		color = color.setXYZ(index  , r, g, b);
		color = color.setXYZ(index+1, r, g, b);
		color = color.setXYZ(index+2, r, g, b);
		color = color.setXYZ(index+3, r, g, b);
		color = color.setXYZ(index+4, r, g, b);
		color = color.setXYZ(index+5, r, g, b);

		color.needsUpdate = true;

	}

	//met à jour les couleurs des faces de l'objet 3D 
	//représantant le tas de sable suivant les valeurs du model
	updateColor(){

		for(var i = 0; i < this.line; i++) {
			
			for(var j = 0; j < this.column; j++){
				var c;
				if(this.model[i][j] >= NBCOLORS) c = new THREE.Color(0xee0000);
				else c = colors[this.model[i][j]];
				this.setSquareColor(i, j, c);
				
			}
		}
		
		
	}

	//créer l'objet 3D représenant le tas de sable
	//ici une grille de carré
	makeMatrixOfSquares() {
	  
	    var geometry = new THREE.BufferGeometry();
		var positions = [];
		var colors = [];

		//les variables c2 et l2 sont utilisées pour
		//pouvoir centré la grille au milieu
		var c2 = this.column/2;
		var l2 = this.line/2;

		for(var j = 0; j < this.line; j++){ 
			for(var i = 0; i < this.column; i++){ 

				this.makeSquare(positions, colors, i, j, l2, c2);

			}
		}

		var positionAttribute = new THREE.Float32BufferAttribute( positions, 3 );
		var colorAttribute    = new THREE.Float32BufferAttribute( colors, 3 );

		geometry.addAttribute( 'position', positionAttribute );
		geometry.addAttribute( 'color', colorAttribute );

		//geometry.computeBoundingSphere();

		var material = new THREE.MeshBasicMaterial( {vertexColors: THREE.VertexColors} );

		return new THREE.Mesh( geometry, material );
	}

	//créer le model du tas de sable
	makeModel(){
		var array2D = [];
		for(var j = 0; j < this.line; j++) {
			array2D[j] = [];
			for(var i = 0; i < this.column; i++)
				array2D[j][i] = 0;
		}
		
		return array2D;	
	}

	//effectu un écroulement des cellules qui ont trop de grains
	//une seule fois
	nextStep(){
		var newModel = [];
		for (var i = 0; i<this.line; i++){
			newModel[i] = [];
			for(var j = 0; j<this.column; j++){
				newModel[i][j] = this.model[i][j];
			}
		}

		for(var i = 0; i<this.model.length; i++){
			for(var j = 0; j<this.model[i].length; j++){
				if(this.model[i][j] > 3){
					newModel[i][j] -= 4;
					if(i < this.model.length - 1){
						newModel[i+1][j] += 1;
					}
					if(i > 0){
						newModel[i-1][j] += 1;
					}
					if(j < this.model[i].length - 1){
						newModel[i][j+1] += 1;
					}
					if(j > 0){
						newModel[i][j-1] += 1;
					}
				}
			}
		}
		this.model = newModel;
	}

	//ajoute un grain dans la cellule i,j
	add(i, j){
		this.model[i][j] += 1;
	}

	//ajoute un grain dans toutes les cellules du tas de sable
	onesEverywhere(){
		for(var i = 0; i < this.line; i++) {
			
			for(var j = 0; j < this.column; j++){

				this.model[i][j] += 1;
				
			}
		}
	}

	//ajoute un grain dans la cellule indiqué par
	//l'index d'un triangle la composant
	addFromTriangleIndex(index){
		var squareIndex = (index%2 == 0) ? index/2 : (index-1)/2; //1 carré = 2 triangles

		var i = ~~(squareIndex / app.sandpile.column); //division euclidienne en JS
		var j = squareIndex % app.sandpile.column;

		this.add(i, j);
	}

	//le constructeur peut varier selon le tas de sable
	constructor(line, column){

		this.line = line;
		this.column = column;

		this.object3D = this.makeMatrixOfSquares();

		this.model = this.makeModel();

		
	}
	
}

class App{
	
	nextStep(){
		this.sandpile.nextStep();
		this.sandpile.updateColor();
	}

	constructor(){
		this.WIDTH = 600;
		this.HEIGHT = 500;


		this.scene = new THREE.Scene();
		this.ratio = this.WIDTH / this.HEIGHT;

		var left = -this.WIDTH / 4.5;
		var right = this.WIDTH / 4.5;
		var top_cam = this.HEIGHT / 4.5;
		var bottom = -this.HEIGHT/ 4.5;

		this.camera = new THREE.OrthographicCamera( left, right, top_cam, bottom, 0, 10 );
		this.camera.position.z = 5;

		this.renderer = new THREE.WebGLRenderer( );

		this.renderScene = document.createElement('div');
		this.renderScene.width = this.WIDTH;
		this.renderScene.height = this.HEIGHT;

		this.renderer.setSize(this.WIDTH, this.HEIGHT);

		//this.renderer.setPixelRatio( window.devicePixelRatio );

		this.renderScene.appendChild( this.renderer.domElement );
		document.body.appendChild(this.renderScene);
	
		this.controls = new THREE.OrthographicTrackballControls( this.camera ); //OK
		
		this.controls.enablePan = true;
		this.controls.enableZoom = true;
		this.controls.enableRotate = false;


		this.sandpile = new GridSandpile(200, 200);

		

		//this.sandpile.updateColor();

		//this.nextStep();

		

		this.scene.add(this.sandpile.object3D);
	}
}

var app = new App();

app.sandpile.onesEverywhere();
app.sandpile.onesEverywhere();
app.sandpile.onesEverywhere();
app.sandpile.onesEverywhere();

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
    mouse.x = ( event.clientX / app.WIDTH ) * 2 - 1;
	mouse.y = - ( event.clientY / app.HEIGHT ) * 2 + 1;

	// on paramète le rayon selon les ratios et la camera
	raycaster.setFromCamera(mouse, app.camera);
	// l'objet intersects est u tableau qui contient toutes les faces intersectés par le rayon
	var intersects = raycaster.intersectObject(app.sandpile.object3D);

	if(intersects.length > 0){

		var face = intersects[0];
		var triangleIndex = face.faceIndex; 

		app.sandpile.addFromTriangleIndex(triangleIndex);

	}

  }, false);


/*******/
/* FIN */
/*******/


var render = function () {
  
requestAnimationFrame( render );
	app.controls.update();
	for(var i = 0; i < SPEED; i++){

			  
		app.nextStep();
		
	}
	app.renderer.render( app.scene, app.camera );
	  
};

render();


//https://threejs.org/examples/#webgl_interactive_buffergeometry