class Tile{
	constructor(id, neighboors, points, limit){
		this.limit = limit;
		this.id = id; // Id of the tile
		this.prevSand = 0; // "trick" variable to iterate the sand
		this.sand = 0;
		this.neighboors = neighboors; // Ids of adjacent tiles
		
		this.pointsIndexes = points; // Indexes of points representing the tile, in the Tiling array of points
	}
	
}

class Tiling{
	// Represents any tiling
	constructor(points, colors, tiles, colormap){
		this.tiles = tiles;
		
		
		var geometry = new THREE.BufferGeometry();

		var positionAttribute = new THREE.Float32BufferAttribute( points, 3 );
		var colorAttribute = new THREE.Float32BufferAttribute( colors, 3 );

		geometry.addAttribute( 'position', positionAttribute );
		geometry.addAttribute( 'color', colorAttribute );

		 var material = new THREE.MeshBasicMaterial( {vertexColors: THREE.VertexColors, side: THREE.DoubleSide} );

		this.mesh = new THREE.Mesh( geometry, material );
		this.colors = this.mesh.geometry.attributes.color;
		this.points = this.mesh.geometry.attributes.position;
		
		this.cmap = colormap;

		this.indexTriangleToIndexFace = function(indexTriangle){
			var counter = 0;
			for(var i = 0; i < this.tiles.length; i++){
				counter += this.tiles[i].nbTriangles;
				if(this.tiles[i].pointsIndexes[0]/3 >= indexTriangle){
					console.log(i, counter);
					return i;
				} 
			}
		}
	}
	
	iterate(){
		this.tiles.forEach(function(element) {
		  element.prevSand = element.sand;
		});
		
		for(var i = 0; i<this.tiles.length; i++){

			var limit = this.tiles[i].limit;


			if(this.tiles[i].prevSand >= limit){
				this.tiles[i].sand -= limit;
				for(var j = 0; j< this.tiles[i].neighboors.length; j++){
					
					this.tiles[this.tiles[i].neighboors[j]].sand += 1;
				}
			}
		}
	}
	
	add(index, amount){
		this.tiles[index].sand += amount;
		this.colorTile(index);
	}
	
	addEverywhere(amount){
		for(var i = 0; i<this.tiles.length; i++){
			this.tiles[i].sand += amount;
		}
		this.colorTiles();
	}
	
	addRandom(amount){
		for(var j = 0; j<amount; j++){
			for(var i = 0; i<this.tiles.length; i++){
				if(Math.random() > 0.5) this.tiles[i].sand += 1;
			}
		}
		this.colorTiles();
	}
	
	remove(index, amount){
		this.tiles[index].sand -= amount;
		if(this.tiles[index].sand < 0) this.tiles[index].sand = 0;
		this.colorTile(index);
	}
	
	removeEverywhere(amount){
		for(var i = 0; i<this.tiles.length; i++){
			this.tiles[i].sand -= amount;
			if(this.tiles[i].sand < 0) this.tiles[i].sand = 0;
		}
		this.colorTiles();
	}
	
	colorTile(index){

		for(var j = 0; j<this.tiles[index].pointsIndexes.length; j++){
		//for(var j = 0; j<1; j++){
			//console.log("AAA");
			var colorNum = this.tiles[index].sand;
			if(colorNum >= this.cmap.length){
				colorNum = this.cmap.length-1;
			}
			//console.log(this.tiles[index].pointsIndexes);
			this.colors.setXYZ(this.tiles[index].pointsIndexes[j], this.cmap[colorNum].r, this.cmap[colorNum].g, this.cmap[colorNum].b);
			//this.colors.setXYZ(this.tiles[index].pointsIndexes[j], 1, 1, 1);
		}
		
		this.mesh.geometry.attributes.color.needsUpdate = true;
	}
	
	colorTiles(){
		for(var i = 0; i<this.tiles.length; i++){
			this.colorTile(i);
		}
	}
	
	
}

