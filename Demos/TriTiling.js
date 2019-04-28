Tiling.triTiling = function (size, cmap) {
	
	var pos = [];
	var col = [];
	var tils = [];

	var xMid = size/2;
	var yMid = (size*Math.sin(Math.PI/3))/2;

	
	for(var i = 0; i < size; i++){
		var length = 2*size-1 - i*2;
		for(var j = 0; j < length; j++){
			makeTriCell(pos, col, i, j, xMid, yMid)
			tils.push(Tile.triTile(i, j, size, length));
		}
	}
	
	
	return new Tiling(pos, col, tils, 3, cmap);
}

Tile.triTile = function(x, y, size, length){
	var id;
	var neighboors = [];

	id = 0;
	for(var i = 0; i < x; i++){
		id += 2*size-1 - i*2;
	}
	id += y;
	
	if (y > 0) neighboors.push(id-1);
	if (y < length-1) neighboors.push(id+1);


	if(y%2 == 0){
		if (i > 0) neighboors.push(id - (length+1));
	} else{
		if (i < size-1) neighboors.push(id + (length-1));
	}
	
	var pointsIds = [];
	for(var i=0; i<3; i++){
		pointsIds.push(id*3 + i);
	}
	return new Tile(id, neighboors, pointsIds);
}

function makeTriCell(positions, colors, i, j, xMid, yMid){

		var A = new THREE.Vector2();
		var B = new THREE.Vector2();
		var C = new THREE.Vector2();

		if (j%2 === 0){
			A.x = j/2 + i*0.5 - xMid; A.y = i* Math.sin(Math.PI/3) - yMid;
			B.x = A.x + 1     ; B.y = A.y ;
			C.x = A.x+0.5     ; C.y = A.y + Math.sin(Math.PI/3) ;
		}
		

		else{
			A.x = (j-1)/2 + (i+1)*0.5 - xMid; A.y = (i+1)* Math.sin(Math.PI/3) - yMid;
			B.x = A.x + 0.5           ; B.y = A.y - Math.sin(Math.PI/3) ;
			C.x = A.x+1               ; C.y = A.y ;
		}
		

		positions.push( A.x, A.y, 0 );  colors.push( 0, 1, 0 );
		positions.push( B.x, B.y , 0 ); colors.push( 0, 1, 0 );
		positions.push( C.x, C.y , 0 ); colors.push( 0, 1, 0 );

	}



/**********************/
/* PARTIE APPLICATION */
/**********************/
var SPEED = 5;

class App{

    constructor(){
        this.WIDTH = window.innerWidth;
        this.HEIGHT = window.innerHeight;

        this.scene = new THREE.Scene();
        this.ratio = this.WIDTH / this.HEIGHT;

        var left = -this.WIDTH /8 ;
        var right = this.WIDTH /8;
        var top_cam = this.HEIGHT /8 ;
        var bottom = -this.HEIGHT /8;

        this.camera = new THREE.OrthographicCamera( left, right, top_cam, bottom, 0, 10 );
        this.camera.position.z = 5;

        this.renderer = new THREE.WebGLRenderer( );

        this.renderScene = document.createElement('div');
        this.renderScene.width = this.WIDTH;
        this.renderScene.height = this.HEIGHT;

        this.renderer.setSize(this.WIDTH, this.HEIGHT);
        //this.scene.background = new THREE.Color( 0x000066 );

        this.renderScene.appendChild( this.renderer.domElement );
        document.body.appendChild(this.renderScene);
    
        this.controls = new THREE.OrthographicTrackballControls( this.camera ); //OK
        
        this.controls.enablePan = true;
        this.controls.enableZoom = true;
        this.controls.enableRotate = false;

        var cmap = [new THREE.Color(0xffffff),
                new THREE.Color(0xaaaaaa),
                new THREE.Color(0x555555),
                new THREE.Color(0xff9900),
                new THREE.Color(0xff0000)];
    
        this.sandpile = Tiling.triTiling(200, cmap)
        

        this.scene.add(this.sandpile.mesh);
    }
}

//generateHKTiling(11);

var app = new App();
app.sandpile.addEverywhere(3);

var render = function () {
  
requestAnimationFrame( render );
    app.controls.update();

    for(var i = 0; i < SPEED; i++)
		app.sandpile.iterate();

    app.sandpile.colorTiles();
    app.renderer.render( app.scene, app.camera );
      
};

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



            app.sandpile.add(app.sandpile.indexDict[face.faceIndex*3], 1);

        }
    }

  }, false);


/*******/
/* FIN */
/*******/

render();