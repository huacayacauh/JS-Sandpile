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
    
        this.sandpile = makePenroseSandpile(triangles);
        

        this.scene.add(this.sandpile.mesh);
    }
}

generateHDTiling(11);

var app = new App();
//app.sandpile.addEverywhere(3);

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
    mouse.x = ( event.clientX / app.WIDTH ) * 2 - 1;
	mouse.y = - ( event.clientY / app.HEIGHT ) * 2 + 1;

	// on paramète le rayon selon les ratios et la camera
	raycaster.setFromCamera(mouse, app.camera);
	// l'objet intersects est u tableau qui contient toutes les faces intersectés par le rayon
	var intersects = raycaster.intersectObject(app.sandpile.mesh);

	if(intersects.length > 0){

		var face = intersects[0];
		var triangleIndex = face.faceIndex; 
		app.sandpile.add(triangleIndex, 10000);

	}

  }, false);


/*******/
/* FIN */
/*******/

render();