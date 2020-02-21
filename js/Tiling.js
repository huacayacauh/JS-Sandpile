// 	#################  TILING.JS  ##################
//	 		Authors : 	FERSULA Jérémy
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
// 	[ 1.0 ] 	Representation of any Tile
//
//		The tile contains a list of its neighbors,
//		all tiles are included in a Tiling.			
//		See [ 2.0 ]
//
// ################################################
class Tile{
	constructor(id, neighbors, points, lim){
		this.id = id;
		this.prevSand = 0; // "trick" variable to iterate the sand
		this.sand = 0;
		if(lim < 0)
			this.sand = -1;
		this.neighbors = neighbors; // Ids of adjacent tiles

		this.limit = lim;

		this.pointsIndexes = points; // Indexes of points representing the tile, in the Tiling array of points
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
//		Object displayed in the app.
//
// ################################################
class Tiling{
	
	// ------------------------------------------------
	// 	[ 2.1 ] 	The class takes in lists
	//				of numbers, which are packed
	//				3 by 3 to create the points
	//				of the figure and their colors.
	//				
	//		Things could be improved a bit here,
	//		colormap should be optional, WireFrame
	//		should be constructed and not given.
	//				
	// ------------------------------------------------
	constructor(points, colors, tiles, colormap, wireFrame){

		this.tiles = tiles;

		var geometry = new THREE.BufferGeometry();

		var positionAttribute = new THREE.Float32BufferAttribute( points, 3 );
		var colorAttribute = new THREE.Float32BufferAttribute( colors, 3 );

		geometry.addAttribute( 'position', positionAttribute );
		geometry.addAttribute( 'color', colorAttribute );

		var material = new THREE.MeshBasicMaterial( {vertexColors: THREE.VertexColors, side: THREE.DoubleSide} );

		this.mesh = new THREE.Mesh( geometry, material );

		this.colors = this.mesh.geometry.attributes.color; // colors of every point of the mesh
		this.points = this.mesh.geometry.attributes.position; // every point of the mesh
		
		// WireFrame -----------------------------------------------------
		var wireFrameGeometry = new THREE.BufferGeometry();

		var wirePosition = new THREE.Float32BufferAttribute( wireFrame, 3 );
		wireFrameGeometry.addAttribute( 'position', wirePosition );
		
		var mat = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 1 } );
		this.wireFrame = new THREE.LineSegments( wireFrameGeometry, mat );
		
		// ---------------------------------------------------------------


		this.indexDict = {}; // Dict face index <-> tile index

		for(var i=0; i<tiles.length; i++){
			for(var j = 0; j<tiles[i].pointsIndexes.length; j+=3 ){
				// We only need one point on three because the Mesh is made out of triangles
				this.indexDict[tiles[i].pointsIndexes[j]] = i;
			}
		}
		this.cmap = colormap;
		this.selectedIndex;
	}

	// ------------------------------------------------
	// 	[ 2.2 ] 	Apply one sandpile step
	// ------------------------------------------------
	iterate(){
		// Topple any tile that has more than the limit of sand
		this.tiles.forEach(function(element) {
		  element.prevSand = element.sand;
		});

		for(var i = 0; i<this.tiles.length; i++){
			if(this.tiles[i].prevSand >= this.tiles[i].limit){
				this.tiles[i].sand -= this.tiles[i].limit;
				for(var j = 0; j< this.tiles[i].neighbors.length; j++){
					this.tiles[this.tiles[i].neighbors[j]].sand += 1;
				}
			}
		}
	}
	
	// ------------------------------------------------
	// 	[ 2.3 ] 	Basic operation functions
	// ------------------------------------------------
	add(index, amount){
		this.tiles[index].sand += amount;
		this.colorTile(index);
	}
	
	remove(index, amount){
		this.tiles[index].sand -= amount;
		if(this.tiles[index].sand < 0) this.tiles[index].sand = 0;
		this.colorTile(index);
	}
	
	addRandom(amount){
		for(var j = 0; j<amount; j++){
			this.add(Math.floor(Math.random() * this.tiles.length), 1);

		}
	}

	removeRandom(amount){
		for(var j = 0; j<amount; j++){
			this.remove(Math.floor(Math.random() * this.tiles.length), 1);

		}
	}
	
	// ------------------------------------------------
	// 	[ 2.4 ] 	"Everywhere" operations
	// ------------------------------------------------
	clear(){
		for(var i = 0; i<this.tiles.length; i++){
			this.tiles[i].sand = 0;
		}
		this.colorTiles();
	}

	addEverywhere(amount){
		for(var i = 0; i<this.tiles.length; i++){
			this.tiles[i].sand += amount;
		}
		this.colorTiles();
	}
	
	addMaxStable(){
		for(var i = 0; i< this.tiles.length; i++){
			this.add(i, this.tiles[i].limit - 1);
		}
		this.colorTiles();
	}

	addRandomEverywhere(amount){
		for(var j = 0; j<amount; j++){
			for(var i = 0; i<this.tiles.length; i++){
				if(Math.random() > 0.5) this.tiles[i].sand += 1;
			}
		}
		this.colorTiles();
	}

	removeEverywhere(amount){
		for(var i = 0; i<this.tiles.length; i++){
			this.tiles[i].sand -= amount;
			if(this.tiles[i].sand < 0) this.tiles[i].sand = 0;
		}
		this.colorTiles();
	}
	
	// ------------------------------------------------
	// 	[ 2.5 ] 	Complex operations
	// ------------------------------------------------
	addConfiguration(otherTiling){
		if(otherTiling.tiles.length != this.tiles.length) alert("Can't add configurations ! Different number of tiles.");
		for(var i = 0; i<this.tiles.length; i++){
			this.tiles[i].sand += otherTiling.tiles[i].sand;
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

	getDual(){
		var newTiles = [];
		for(var i = 0; i<this.tiles.length; i++){
			newTiles.push(new Tile(this.tiles[i].id, Array.from(this.tiles[i].neighbors), Array.from(this.tiles[i].pointsIndexes), this.tiles[i].limit));
		}
		var newTiling = new Tiling(Array.from(this.points), Array.from(this.colors), newTiles, Array.from(this.cmap));
		for(var i = 0; i<newTiling.tiles.length; i++){
			newTiling.tiles[i].sand = Math.max(0, this.tiles[i].limit - 1 - this.tiles[i].sand);
		}
		return newTiling;
	}


	copy(){
		var newTiles = [];
		for(var i = 0; i<this.tiles.length; i++){
			newTiles.push(new Tile(this.tiles[i].id, Array.from(this.tiles[i].neighbors), Array.from(this.tiles[i].pointsIndexes), this.tiles[i].limit));
		}
		var newTiling = new Tiling(Array.from(this.points), Array.from(this.colors), newTiles, Array.from(this.cmap));
		for(var i = 0; i<this.tiles.length; i++){
			newTiling.tiles[i].sand = new Number(this.tiles[i].sand);
		}
		return newTiling;
	}


	stabilize(){
		var t0 = performance.now();

		var oldTiles = [];
		for(var i = 0; i<this.tiles.length; i++){
			oldTiles.push(new Tile(this.tiles[i].id, Array.from(this.tiles[i].neighbors), Array.from(this.tiles[i].pointsIndexes)));
		}
		var done = false;
		while(!done){
			done = true;
			for(var i = 0; i<this.tiles.length; i++){
				if(oldTiles[i].sand != this.tiles[i].sand){
					oldTiles[i].sand = this.tiles[i].sand;
					done = false;
				}
			}
			for(var i = 0; i<100; i++)
				this.iterate();
		}

		console.log("Stabilized in : " + (performance.now() - t0) + " (ms)");
		this.colorTiles();

	}
	
	// ------------------------------------------------
	// 	[ 2.6 ] 	Coloring and display
	// ------------------------------------------------
	colorTile(index, color){
		// Colors only one tile according to this.cmap
		for(var j = 0; j<this.tiles[index].pointsIndexes.length; j++){
			var colorNum = this.tiles[index].sand;
			if(colorNum >= this.cmap.length){
				colorNum = this.cmap.length-1;
			}
			if(colorNum < 0)
				color = new THREE.Color(0x000000);

			if(color)
				this.colors.setXYZ(this.tiles[index].pointsIndexes[j], color.r, color.g, color.b);
			else
				this.colors.setXYZ(this.tiles[index].pointsIndexes[j], this.cmap[colorNum].r, this.cmap[colorNum].g, this.cmap[colorNum].b);
		}

		this.mesh.geometry.attributes.color.needsUpdate = true;
	}

	colorTiles(){
		// Colors every tile
		for(var i = 0; i<this.tiles.length; i++){
			this.colorTile(i);
		}
	}

}

// ################################################
//
// 	EOF
//
// ################################################


