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
	constructor(id, neighbors, bounds, lim){
		this.id = id;
		this.prevSand = 0; // "trick" variable to iterate the sand
		this.sand = 0;
		if(lim < 0)
			this.sand = -1;
		this.neighbors = neighbors; // Ids of adjacent tiles

		this.limit = lim;

		this.bounds = bounds; // Indexes of points representing the tile, in the Tiling array of points
		this.points = [];
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
	constructor(tiles, hide=false){
		
		this.tiles = tiles;
		
		this.hide = hide;
		
		if(!hide){
			var geometry = new THREE.BufferGeometry();
			var points = [];
			var colors = [];
			
			var idloc = {}; // translate tiles ids (of any type) into array locations, for computationnal efficiency
			
			var pointcounter = 0;
			
			for(var i = 0; i<tiles.length; i++){
				if(tiles[i].bounds){
					triangles = earcut(tiles[i].bounds);
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

			this.selectedIndex;
			this.cmap = [new THREE.Color(0xffffff),
				  new THREE.Color(0xff0000)]; // default
			
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
			
			
			// Clicking -----------------------------------------------------
			this.indexDict = {}; // Dict face index <-> tile index

			for(var i=0; i<tiles.length; i++){
				for(var j = 0; j<tiles[i].points.length; j+=3 ){
					// We only need one point on three because the Mesh is made out of triangles
					this.indexDict[tiles[i].points[j]] = i;
				}
			}
			
			// Centering
			
			this.massCenter = [0, 0];
			var count = 0;
			for(var i = 0; i<tiles.length; i++){
				if(tiles[i].bounds){
					for(var j=0; j< tiles[i].bounds.length; j+=2){
						this.massCenter[0] += tiles[i].bounds[j];
						this.massCenter[1] += tiles[i].bounds[j+1];
						count++;
					}
				}
			}
			this.massCenter[0] /= count;
			this.massCenter[1] /= count;
			
			this.mesh.position.set(-this.massCenter[0], -this.massCenter[1], 0); 
			this.wireFrame.position.set(-this.massCenter[0], -this.massCenter[1], 0);
		}
		
	}

	// ------------------------------------------------
	// 	[ 2.2 ] 	Apply one sandpile step
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
	
	// ------------------------------------------------
	// 	[ 2.3 ] 	Basic operation functions
	// ------------------------------------------------
	add(id, amount){
		this.tiles[id].sand += amount;
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


	stabilize(){
		var t0 = performance.now();
		var done = false;
		while(!done){
			done = this.iterate();
		}

		console.log("Stabilized in : " + (performance.now() - t0) + " (ms)");
		
		this.colorTiles();

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
		if(colorNum < 0){
			color = new THREE.Color(0x000000);
		} else{
			if(!color)
				color = this.cmap[colorNum];
		}
		for(var k in tile.points){
			var point = tile.points[k];
			this.mesh.geometry.attributes.color.setXYZ(point, color.r, color.g, color.b);
		}

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

}

// ################################################
//
// 	EOF
//
// ################################################


