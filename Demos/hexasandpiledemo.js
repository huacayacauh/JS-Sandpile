var SPEED = 10;

var colors = [new THREE.Color(0xffffff),
              new THREE.Color(0xdddddd),
              new THREE.Color(0xbbbbbb),
              new THREE.Color(0x999999),
              new THREE.Color(0x777777),
              new THREE.Color(0x555555),
              new THREE.Color(0xeeee00)];

var NBCOLORS = colors.length;

class HexSandpile{



	setCellColor(i, j, newColor){

		var index = (i*this.column + j)*4*3;

		var color = this.object3D.geometry.attributes.color;

		var r = newColor.r; var g = newColor.g; var b = newColor.b;
		
		color = color.setXYZ(index   , r, g, b);
		color = color.setXYZ(index+1 , r, g, b);
		color = color.setXYZ(index+2 , r, g, b);
		color = color.setXYZ(index+3 , r, g, b);
		color = color.setXYZ(index+4 , r, g, b);
		color = color.setXYZ(index+5 , r, g, b);
		color = color.setXYZ(index+6 , r, g, b);
		color = color.setXYZ(index+7 , r, g, b);
		color = color.setXYZ(index+8 , r, g, b);
		color = color.setXYZ(index+9 , r, g, b);
		color = color.setXYZ(index+10, r, g, b);
		color = color.setXYZ(index+11, r, g, b);

		color.needsUpdate = true;

	}

	updateColor(){

		for(var i = 0; i < this.line; i++) {
			
			for(var j = 0; j < this.column; j++){
				var c;
				if(this.model[i][j] >= NBCOLORS) c = new THREE.Color(0xee0000);
				else c = colors[this.model[i][j]];
				this.setCellColor(i, j, c);
				
			}
		}
		
		
	}


	genereXCoords(){
		console.log(this.column);

		var xCoords = [];

		xCoords.push(-1);
		xCoords.push(-0.5);
		xCoords.push(0.5);
		xCoords.push(1);

		var top = 1;

		for(var i = 1; i < this.column; i++){
			xCoords.push(top+1);
			xCoords.push(top+1.5);
			top += 1.5
		}

		return xCoords;

	}

	genereYCoords(){
		console.log(this.column);

		var yCoords = [];
		var SP3 = -Math.sin(Math.PI/3);

		yCoords.push(-SP3);
		yCoords.push(0);
		yCoords.push(SP3);

		var top = SP3;

		for(var i = 1; i < this.line; i++){
			yCoords.push(top+SP3);
			yCoords.push(top+2*SP3);
			top += 2*SP3
		}

		yCoords.push(top+SP3);

		return yCoords;

	}



	makeHexCell(positions, colors, i, j, xCoords, yCoords, xMid, yMid){

		var delta = j%2;

		var A = new THREE.Vector2();
		var B = new THREE.Vector2();
		var F = new THREE.Vector2();
		var C = new THREE.Vector2();
		var E = new THREE.Vector2();
		var D = new THREE.Vector2();

		A.x = xCoords[j*2+3] - xMid; A.y = yCoords[i*2+1+delta] - yMid;
		B.x = xCoords[j*2+2] - xMid; B.y = yCoords[i*2+  delta] - yMid;
		F.x = xCoords[j*2+2] - xMid; F.y = yCoords[i*2+2+delta] - yMid;
		C.x = xCoords[j*2+1] - xMid; C.y = yCoords[i*2+  delta] - yMid;
		E.x = xCoords[j*2+1] - xMid; E.y = yCoords[i*2+2+delta] - yMid;
		D.x = xCoords[j*2]   - xMid; D.y = yCoords[i*2+1+delta] - yMid;
		
		positions.push( A.x, A.y, 0 );  colors.push( 0, 1, 0 );
		positions.push( B.x, B.y , 0 ); colors.push( 0, 1, 0 );
		positions.push( F.x, F.y , 0 ); colors.push( 0, 1, 0 );

		positions.push( B.x, B.y, 0 );  colors.push( 1, 0, 0 );
		positions.push( E.x, E.y , 0 ); colors.push( 1, 0, 0 );
		positions.push( F.x, F.y , 0 ); colors.push( 1, 0, 0 );

		positions.push( B.x, B.y, 0 );  colors.push( 0, 1, 0 );
		positions.push( C.x, C.y , 0 ); colors.push( 0, 1, 0 );
		positions.push( E.x, E.y , 0 ); colors.push( 0, 1, 0 );

		positions.push( C.x, C.y, 0 );  colors.push( 1, 0, 0 );
		positions.push( D.x, D.y , 0 ); colors.push( 1, 0, 0 );
		positions.push( E.x, E.y , 0 ); colors.push( 1, 0, 0 );
	}

	makeMatrixOfCells() {

		
	  
	  	var xCoords = this.genereXCoords();
	  	//console.log(xCoords)
	  	var yCoords = this.genereYCoords();
	  	//console.log(yCoords)
	  	
	    var geometry = new THREE.BufferGeometry();
		var positions = [];
		var colors = [];

		var xMid = (xCoords[xCoords.length-1] - xCoords[0])/2;
		var yMid = (yCoords[yCoords.length-2] - yCoords[0])/2;

		
		for(var i = 0; i < this.line; i++){
			for(var j = 0; j < this.column; j++){
				this.makeHexCell(positions, colors, i, j, xCoords, yCoords, xMid, yMid)
			}
		}
		


		var positionAttribute = new THREE.Float32BufferAttribute( positions, 3 );
		var colorAttribute    = new THREE.Float32BufferAttribute( colors, 3 );

		geometry.addAttribute( 'position', positionAttribute );
		geometry.addAttribute( 'color', colorAttribute );

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

	addFromTriangleIndex(index){
		console.log(index);

		var squareIndex = (index-index%4)/4 //1 hexagone = 4 triangles

		var i = ~~(squareIndex / app.sandpile.column); //division euclidienne en JS
		var j = squareIndex % app.sandpile.column;

		this.add(i, j);
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

		for(var i = 0; i<this.line; i++){
			for(var j = 0; j<this.column; j++){


				if(j%2 == 0){
					if(this.model[i][j] > 5){

					


						newModel[i][j] -= 6;

						if(i < this.model.length - 1){
							newModel[i+1][j] += 1;
						}

						if(i > 0){
							newModel[i-1][j] += 1;
						}

						if(j > 0 ){
							newModel[i][j-1] += 1;
						}

						if(j > 0 && i > 0){
							newModel[i-1][j-1] += 1;
						}

						if(j < this.model[i].length - 1){
							newModel[i][j+1] += 1;
						}

						if(j < this.model[i].length - 1 && 
						   i > 0){
							newModel[i-1][j+1] += 1;
						}




					}
				}

				else{
					if(this.model[i][j] > 5){

					


						newModel[i][j] -= 6;

						if(i < this.model.length - 1){
							newModel[i+1][j] += 1;
						}

						if(i > 0){
							newModel[i-1][j] += 1;
						}

						if(j > 0 ){
							newModel[i][j-1] += 1;
						}

						if(j > 0 && i < this.model.length - 1){
							newModel[i+1][j-1] += 1;
						}

						if(j < this.model[i].length - 1){
							newModel[i][j+1] += 1;
						}

						if(j < this.model[i].length - 1 && 
						   i < this.model.length - 1){
							newModel[i+1][j+1] += 1;
						}




					}
				}


			}
		}
		this.model = newModel;
	}

	constructor(line, column){

		this.line = line;
		this.column = column;

		this.model = this.makeModel();
		this.object3D = this.makeMatrixOfCells();

		this.setCellColor(0, 1, colors[0]);
		
	}
	
}

class App{
	
	nextStep(){
		this.sandpile.nextStep();
		this.sandpile.updateColor();
	}

	constructor(){
		this.WIDTH = window.innerWidth;
		this.HEIGHT = window.innerHeight;


		this.scene = new THREE.Scene();
		this.ratio = this.WIDTH / this.HEIGHT;

		var left = -this.WIDTH / 5;
		var right = this.WIDTH / 5;
		var top_cam = this.HEIGHT / 5;
		var bottom = -this.HEIGHT/ 5;

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


		this.sandpile = new HexSandpile(200, 200);

		this.scene.add(this.sandpile.object3D);
	}
}

var app = new App();

app.sandpile.onesEverywhere();
app.sandpile.onesEverywhere();
app.sandpile.onesEverywhere();
app.sandpile.onesEverywhere();
app.sandpile.onesEverywhere();
app.sandpile.onesEverywhere();
//app.sandpile.onesEverywhere();
//app.sandpile.onesEverywhere();


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


var render = function () {
  
requestAnimationFrame( render );
	app.controls.update();
	for(var i = 0; i < SPEED; i++){

			  
		app.nextStep();
		//app.sandpile.updateColor();
		
	}
	app.renderer.render( app.scene, app.camera );
	  
};

render();


//https://threejs.org/examples/#webgl_interactive_buffergeometry