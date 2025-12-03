// This code is part of JS-Sandpile (https://github.com/huacayacauh/JS-Sandpile/)
// CC-BY Valentin Darrigo, Jeremy Fersula, Kevin Perrot

//
// [ 0 ]
// Tile and Tiling objects
// Contains most sandpile logics, in Tiling
//

// ################################################
//
// 	[ 1.0 ] 	Representation of any Tile
//
//		The tile contains a list of its neighbors,
//		all tiles are included in a Tiling.			
//		See [ 2.0 ]
//
// ################################################
class Tile{
    constructor(id, neighbors, bounds, limit){
	this.id = id; // unique identifier
	this.neighbors = neighbors; // ids of adjacent tiles

	this.limit = limit; // topples when sand >= limit
	this.sand = 0; // sand content
	if(limit < 0)
	    this.sand = -1;
	this.prevSand = 0; // "trick" variable to iterate the sand

	this.bounds = bounds; // vertices of the polygon to be drawn
	this.points = [];
	
	this.svg_color = "000000";
    }
    
    // [1.1] homemade Tile cloning method
    myclone(){
        var newid=JSON.parse(JSON.stringify(this.id));
        var newneighbors=JSON.parse(JSON.stringify(this.neighbors));
        var newbounds=JSON.parse(JSON.stringify(this.bounds));
        return new Tile(newid, newneighbors, newbounds, this.limit)
    }
    resetNeighbors(){
        for(let i=0; i<this.neighbors.length;i++){
            this.neighbors[i]=undefined;
        }
    }
    
    // [1.2] geometric transformations of a tile (scale, shift, rotate)

    // scale tile (all bounds) towards point B by factor f
    scale(xB, yB, f){
        // scale all bounds one by one with scalePoint
        var newpoint = [];
        for(var i=0; i<this.bounds.length; i+=2){
            newpoint = scalePoint(this.bounds[i], this.bounds[i+1], xB, yB, f);
            this.bounds[i] = newpoint[0];
            this.bounds[i+1] = newpoint[1];
        }
    }

    // shift tile by vector B
    shift(xB, yB){
        // shift all bounds one by one with shiftPoint
        var newpoint = [];
        for(var i=0; i<this.bounds.length; i+=2){
            newpoint = shiftPoint(this.bounds[i], this.bounds[i+1], xB, yB);
            this.bounds[i] = newpoint[0];
            this.bounds[i+1] = newpoint[1];
        }
    }

    // rotate tile around point B by angle a (in radian)
    rotate(xB, yB, a){
        // rotate all bounds one by one with rotatePoint
        var newpoint = [];
        for(var i=0; i<this.bounds.length; i+=2){
            newpoint = rotatePoint(this.bounds[i], this.bounds[i+1], xB, yB, a);
            this.bounds[i] = newpoint[0];
            this.bounds[i+1] = newpoint[1];
        }
    }

    // reflect tile with respect to the line of direction (vector) C and going through B
    reflect(xB, yB, xC, yC){
	// reflect all bounds one by one with reflectPoint
	var newpoint = [];
	for(var i=0; i<this.bounds.length; i+=2){
	    newpoint = reflectPoint(this.bounds[i], this.bounds[i+1], xB, yB, xC, yC);
	    this.bounds[i] = newpoint[0];
	    this.bounds[i+1] = newpoint[1];
	}
    }
    
}


// ################################################
//
// 	[ 2.0 ] 	Representation of any Tiling
//			
//		This class contains maily a list of
//		Tiles, which themselves contains 
//		references to their neighbors.
//
//		This class also contains the THREE.js
//		Objects displayed in the app.
//
// ################################################
class Tiling{
    
    // ------------------------------------------------
    // 	[ 2.1 ] 	The Tiling object takes in
    //				just a list of Tile, and proceed
    //				to translate it into a more
    //				computable efficient representation
    //				with arrays instead of dict.
    //				
    //	It builds the THREE.js object representing
    //	the Tiling, and the THREE.js object representing
    //	the limits of the Tiles (called the WireFrame).
    //
    // ------------------------------------------------
    constructor(tiles, hide=false, recenter=false){
	
	this.tiles = tiles;
	
	this.hide = hide;
	
	if(!hide){
	    
	    // Building the THREE.js main Object ------------------
	    
	    var geometry = new THREE.BufferGeometry();
	    var points = [];
	    var colors = [];
	    
	    var idloc = {}; // translate tiles ids (of any type) into array locations, for computationnal efficiency
	    
	    var pointcounter = 0;
	    
	    for(var i = 0; i<tiles.length; i++){
		if(tiles[i].bounds){
		    var triangles = earcut(tiles[i].bounds);  // triangulation of the bounds
		    for(var index in triangles){
			points.push(tiles[i].bounds[triangles[index]*2], tiles[i].bounds[triangles[index]*2 +1], 0);
			colors.push(0, 255, 0);
			tiles[i].points.push(pointcounter);
			pointcounter ++;
		    }
		    idloc[tiles[i].id] = i;
		}
	    }
	    geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( points, 3 )  );
	    geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
	    
	    var material = new THREE.MeshBasicMaterial( {vertexColors: THREE.VertexColors, side: THREE.DoubleSide} );
	    this.mesh = new THREE.Mesh( geometry, material );
	    
	    // The THREE.js object is built. ------------------

	    this.selectedIndex;
	    this.cmap = [new THREE.Color(0xffffff),
			 new THREE.Color(0xff0000)]; // if you see these colors, something went wrong
	    
	    // From the idloc dictionnary, translates neighbors of each Tile from ID to
	    // Indexes in the list of Tiles.
	    for(var i = 0; i<this.tiles.length; i++){
		this.tiles[i].id = i;
		var new_neighbors = [];
		for(var j=0; j<this.tiles[i].neighbors.length; j++){
		    var neighbor = idloc[this.tiles[i].neighbors[j]];
		    if(neighbor!=null)
			new_neighbors.push(neighbor);
		}
		this.tiles[i].neighbors = new_neighbors;
	    }
	    
	    // WireFrame -----------------------------------------------------
	    
	    var wireFrame = [];
	    for(var i = 0; i<tiles.length; i++){
		if(tiles[i].bounds){
		    wireFrame.push(tiles[i].bounds[0]);
		    wireFrame.push(tiles[i].bounds[1]);
		    wireFrame.push(0);
		    for(var j=2; j< tiles[i].bounds.length; j+=2){
			wireFrame.push(tiles[i].bounds[j]);
			wireFrame.push(tiles[i].bounds[j+1]);
			wireFrame.push(0);
			wireFrame.push(tiles[i].bounds[j]);
			wireFrame.push(tiles[i].bounds[j+1]);
			wireFrame.push(0);
		    }
		    wireFrame.push(tiles[i].bounds[0]);
		    wireFrame.push(tiles[i].bounds[1]);
		    wireFrame.push(0);
		}
	    }
	    var wireFrameGeometry = new THREE.BufferGeometry();

	    var wirePosition = new THREE.Float32BufferAttribute( wireFrame, 3 );
	    wireFrameGeometry.addAttribute( 'position', wirePosition );
	    
	    var mat = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 1 } );
	    this.wireFrame = new THREE.LineSegments( wireFrameGeometry, mat );
	    
	    // Engravings -----------------------------------------------------

            this.engravings = [];
            let engravingArcsMaterial = new THREE.LineBasicMaterial({color:0xff0000,linewidth:1});
            engravingArcs.forEach(eA => {
                let x=eA[0];
                let y=eA[1];
                let r=eA[2];
                let Ax=eA[3];
                let Ay=eA[4];
                let Bx=eA[5];
                let By=eA[6];
                // this loop is really too slow...
                let angleA = Math.atan2(Ay-y,Ax-x);
                if(angleA<0){ angleA += 2*Math.PI; }
                let angleB = Math.atan2(By-y,Bx-x);
                if(angleB<0){ angleB += 2*Math.PI; }
                let ellipse = new THREE.EllipseCurve(x,y,r,r,angleA,angleB,false,0);
                let ellipsePoints = ellipse.getPoints( 32 );
                let ellipseGeometry = new THREE.BufferGeometry().setFromPoints( ellipsePoints );
                let ellipseObject = new THREE.Line(ellipseGeometry, engravingArcsMaterial);
                this.engravings.push(ellipseObject);
            });
            
	    // Clicking -----------------------------------------------------
	    this.indexDict = {}; // Dict face index <-> tile index

	    for(var i=0; i<tiles.length; i++){
		for(var j = 0; j<tiles[i].points.length; j+=3 ){
		    // We only need one point on three because the Mesh is made out of triangles
		    this.indexDict[tiles[i].points[j]] = i;
		}
	    }
	    
	    // Centering -----------------------------------------------------
            // puts (0,0) at the barycenter of all tile bounds
	    
	    this.center = [0, 0];
	    if(recenter){
		var count = 0;
		for(var i = 0; i<tiles.length; i++){
		    if(tiles[i].bounds){
			for(var j=0; j< tiles[i].bounds.length; j+=2){
			    this.center[0] += tiles[i].bounds[j];
			    this.center[1] += tiles[i].bounds[j+1];
			    count++;
			}
		    }
		}
		this.center[0] /= count;
		this.center[1] /= count;
	    }
	    this.mesh.position.set(-this.center[0], -this.center[1], 0); 
	    this.wireFrame.position.set(-this.center[0], -this.center[1], 0);
	}
    }

    // ------------------------------------------------
    // 	[ 2.2 ] 	Apply sandpile steps
    // ------------------------------------------------
    iterate(){
	// Topple any tile that has more than the limit of sand
	var is_stable = true;
	for(var i=0; i<this.tiles.length; i++){
	    this.tiles[i].prevSand = this.tiles[i].sand;
	}
	for(var i=0; i<this.tiles.length; i++){
	    var til = this.tiles[i];
	    if(til.prevSand >= til.limit){
		til.sand -= til.limit;
		for(var j = 0; j< til.neighbors.length; j++){
		    this.tiles[til.neighbors[j]].sand += 1;
		}
		is_stable = false;
	    }
	}
	return is_stable;
    }
    
    stabilize(){
        console.log("  stabilization...");
	let t0 = performance.now();
	let is_stable = false;
        let n=-1;
	while(!is_stable){
	    is_stable = this.iterate();
            n++;
	}
	console.log("  done after "+n+" steps in "+(performance.now()-t0)+" (ms)");
	this.colorTiles();
    }
    
    // ------------------------------------------------
    // 	[ 2.3 ] 	Basic operation functions
    // ------------------------------------------------
    add(id, amount){
	this.tiles[id].sand += amount;
	this.colorTile(id);
    }
    
    set(id, amount){
	this.tiles[id].sand = amount;
	this.colorTile(id);
    }
    
    remove(id, amount){
	this.tiles[id].sand -= amount;
	if(this.tiles[id].sand < 0) this.tiles[id].sand = 0;
	this.colorTile(id);
    }
    
    addRandom(amount){
	for(var j = 0; j<amount; j++){
	    var chosen = Math.floor(this.tiles.length * Math.random());
	    this.add(chosen, 1);

	}
    }

    removeRandom(amount){
	for(var j = 0; j<amount; j++){
	    var chosen = Math.floor(this.tiles.length * Math.random());
	    this.remove(chosen, 1);
	}
    }
    
    // ------------------------------------------------
    // 	[ 2.4 ] 	"Everywhere" operations
    // ------------------------------------------------
    clear(){
	for(var id in this.tiles){
	    this.tiles[id].sand = 0;
	}
	this.colorTiles();
    }

    addEverywhere(amount){
	for(var id in this.tiles){
	    this.tiles[id].sand += amount;
	}
	this.colorTiles();
    }
    
    addMaxStable(){
	for(var id in this.tiles){
	    this.add(id, this.tiles[id].limit - 1);
	}
	this.colorTiles();
    }

    addRandomEverywhere(amount){
	for(var j = 0; j<amount; j++){
	    for(var id in this.tiles){
		if(Math.random() > 0.5) this.tiles[id].sand += 1;
	    }
	}
	this.colorTiles();
    }

    removeEverywhere(amount){
	for(var id in this.tiles){
	    this.tiles[id].sand -= amount;
	    if(this.tiles[id].sand < 0) this.tiles[id].sand = 0;
	}
	this.colorTiles();
    }
    
    // ------------------------------------------------
    // 	[ 2.5 ] 	Complex operations
    // ------------------------------------------------

    // add configuration n times
    addConfiguration(otherTiling,n=1){
	if(otherTiling.tiles.length != this.tiles.length) alert("Can't add configurations ! Different number of tiles.");
	for(var i = 0; i<this.tiles.length; i++){
	    this.tiles[i].sand += n*otherTiling.tiles[i].sand;
	}
	this.colorTiles();
    }

    removeConfiguration(otherTiling){
	if(otherTiling.tiles.length != this.tiles.length) alert("Can't add configurations ! Different number of tiles.");
	for(var i = 0; i<this.tiles.length; i++){
	    this.tiles[i].sand -= otherTiling.tiles[i].sand;
	    if(this.tiles[i].sand < 0) this.tiles[i].sand = 0;
	}
	this.colorTiles();
    }

    getHiddenDual(){
	var newTiling = this.hiddenCopy();
	for(var i = 0; i<newTiling.tiles.length; i++){
	    newTiling.tiles[i].sand = Math.max(0, this.tiles[i].limit - 1 - this.tiles[i].sand);
	}
	return newTiling;
    }
    
    hiddenCopy(){
	var newTiles = [];
	for(var i = 0; i<this.tiles.length; i++){
	    newTiles.push(new Tile(this.tiles[i].id, Array.from(this.tiles[i].neighbors), null, this.tiles[i].limit));
	}
	var newTiling = new Tiling(newTiles, true);
	for(var i = 0; i<this.tiles.length; i++){
	    newTiling.tiles[i].sand = new Number(this.tiles[i].sand);
	}
	return newTiling;
    }

    // ------------------------------------------------
    // 	[ 2.6 ] 	Coloring and display
    // ------------------------------------------------
    colorTile(id, color){
	// Colors only one tile according to this.cmap
	var tile = this.tiles[id];
	var colorNum = tile.sand;
	if(colorNum >= this.cmap.length){
	    colorNum = this.cmap.length-1;
	}
	
	if(!color){
	    if(colorNum >= 0){
		color = this.cmap[colorNum];
	    } else{
		// default
		
		if(tile.sand >= tile.limit){
		    // ready to topple - flashy colors
		    var flashy = ["#ff1a1a", "#ff751a", "#ffbb33", "#ffff4d", "#99ff66", "#44ff11", "#22ffaa", "#00ffff", "#0077ff",  "#0000ff"];
		    var flashyIndex = Math.min(tile.sand-tile.limit, flashy.length-1);
		    color = new THREE.Color(flashy[flashyIndex]);
		} else {
		    // stable, grey
		    var greyScale = 1.0 - tile.sand / tile.limit;
		    color = new THREE.Color( greyScale, greyScale, greyScale );
		    
		}
	    }
	}
	for(var k in tile.points){
	    var point = tile.points[k];
	    this.mesh.geometry.attributes.color.setXYZ(point, color.r, color.g, color.b);
	}
	tile.svg_color = color.getHexString();
	this.mesh.geometry.attributes.color.needsUpdate = true;
    }

    colorTiles(){
	// Colors every tile
	if(this.hide)
	    return
	for(var i=0; i<this.tiles.length; i++) {
	    this.colorTile(i);
	}
    }

    // ------------------------------------------------
    // [ 2.7 ] Compute the maximum stable configuration
    // ------------------------------------------------
    get_maxStable(){
        let max_stable = this.hiddenCopy();
        max_stable.tiles.forEach(tile => tile.sand = tile.limit-1);
        return max_stable;
    }

    // ------------------------------------------------
    // [ 2.8 ] Compute the sandpile identity
    // ------------------------------------------------
    get_identity(){
        // check if it has already been computed
        if(this.identity != null){
            return this.identity;
        }
        // compute identity
        let ctime_identity = performance.now();
        console.log("compute identity e...");
        console.log("* compute (2m)°");
        let stable2m = this.hiddenCopy();
        stable2m.clear();
        stable2m.addConfiguration(this.get_maxStable(),2);
        let identity = stable2m.hiddenCopy();
        stable2m.stabilize();
        console.log("* compute e=(2m-(2m)°)°");
        identity.removeConfiguration(stable2m);
        identity.stabilize();
        console.log("done identity in "+(performance.now()-ctime_identity)+" (ms)");
        this.identity = identity;
        return this.identity;
    }

    // ------------------------------------------------
    // [ 2.9 ] Compute the inverse of the current configuration
    // ------------------------------------------------
    get_inverse(){
        console.log("compute inverse i...");
        console.log("* (assumes the current configuration to be recurrent without verification)");
        // stabilize the configuration
        console.log("* stabilize c");
        this.stabilize();
        // compute inverse
        console.log("* get super identity 3m-(3m)°");
        // check if it has already been computed
        if(this.super_identity == null){
            console.log("  compute it...");
            let stable3m = this.hiddenCopy();
            stable3m.clear();
            stable3m.addConfiguration(this.get_maxStable(),3);
            this.super_identity = stable3m.hiddenCopy();
            stable3m.stabilize();
            this.super_identity.removeConfiguration(stable3m);
        }
        console.log("* compute i=(3m-(3m)°-c)°");
        let inverse = this.super_identity.hiddenCopy();
        inverse.removeConfiguration(this);
        inverse.stabilize();
        console.log("done");
        return inverse;
    }

    // ------------------------------------------------
    // [ 2.10 ] Compute the burning configuration
    // ------------------------------------------------
    get_burning(){
        console.log("compute burning b...");
        let burning = this.hiddenCopy();
        burning.tiles.forEach(tile =>
            tile.sand = tile.limit - tile.neighbors.length
        );
        console.log("done");
        return burning;
    }
}

