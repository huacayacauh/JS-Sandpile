class Tile{
	constructor(id, neighboors, points){
		this.id = id;
		this.prevSand = 0; // "trick" variable to iterate the sand
		this.sand = 0;
		this.neighboors = neighboors; // Ids of adjacent tiles
		
		this.pointsIndexes = points; // Indexes of points representing the tile, in the Tiling array of points
	}
	
	static squareTile(x, y, xMax, yMax){
		// Creates the Tile in position x, y of a square grid
		
		var id;
		var neighboors = [];
		id = x*yMax + y;
		if(x > 0) neighboors.push((x-1)*yMax + y);
		if(x < xMax-1) neighboors.push((x+1)*yMax + y);
		if(y > 0) neighboors.push(x*yMax + (y-1));
		if(y < yMax-1) neighboors.push(x*yMax + (y+1));
		var pointsIds = [];
		for(var i=0; i<6; i++){
			pointsIds.push(id*6 + i);
		}
		return new Tile(id, neighboors, pointsIds);
	}
	
	static hexTile(){
		
	}
}

class Tiling{
	// Represents any tiling
	constructor(points, colors, tiles, toppleMin, colormap){
		
		this.tiles = tiles;
		this.limit = toppleMin; // limit until the sand topple to adjacents tiles
		
		var geometry = new THREE.BufferGeometry();

		var positionAttribute = new THREE.Float32BufferAttribute( points, 3 );
		var colorAttribute = new THREE.Float32BufferAttribute( colors, 3 );

		geometry.addAttribute( 'position', positionAttribute );
		geometry.addAttribute( 'color', colorAttribute );

		var material = new THREE.MeshBasicMaterial( {vertexColors: THREE.VertexColors, side: THREE.DoubleSide} );

		this.mesh = new THREE.Mesh( geometry, material );
		
		this.colors = this.mesh.geometry.attributes.color; // colors of every point of the mesh
		this.points = this.mesh.geometry.attributes.position; // every point of the mesh
		

		this.indexDict = {}; // Dict face index <-> tile index
		
		for(var i=0; i<tiles.length; i++){
			for(var j = 0; j<tiles[i].pointsIndexes.length; j+=3 ){
				// We only need one point on three because the Mesh is made out of triangles
				this.indexDict[tiles[i].pointsIndexes[j]] = i;
			}
		}
		this.cmap = colormap;
	}
	
	iterate(){
		// Topple any tile that has more than the limit of sand
		
		this.tiles.forEach(function(element) {
		  element.prevSand = element.sand;
		});
		
		for(var i = 0; i<this.tiles.length; i++){
			if(this.tiles[i].prevSand >= this.limit){
				this.tiles[i].sand -= this.limit;
				for(var j = 0; j< this.tiles[i].neighboors.length; j++){
					
					if(typeof this.tiles[this.tiles[i].neighboors[j]] === 'undefined'){
						//useful to identify problems in the grid
						console.log("Error");
						console.log(i);
						console.log(this.tiles[i].neighboors);
					}
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
			this.add(Math.floor(Math.random() * this.tiles.length), 1);
			
		}
	}
	
	removeRandom(amount){
		for(var j = 0; j<amount; j++){
			this.remove(Math.floor(Math.random() * this.tiles.length), 1);
			
		}
	}
	
	addRandomEverywhere(amount){
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
			newTiles.push(new Tile(this.tiles[i].id, Array.from(this.tiles[i].neighboors), Array.from(this.tiles[i].pointsIndexes)));
		}
		var newTiling = new Tiling(Array.from(this.points), Array.from(this.colors), newTiles, this.limit, Array.from(this.cmap));
		for(var i = 0; i<newTiling.tiles.length; i++){
			newTiling.tiles[i].sand = Math.max(0, this.limit -1 - this.tiles[i].sand);
		}
		return newTiling;
	}
	
	copy(){
		var newTiles = [];
		for(var i = 0; i<this.tiles.length; i++){
			newTiles.push(new Tile(this.tiles[i].id, Array.from(this.tiles[i].neighboors), Array.from(this.tiles[i].pointsIndexes)));
		}
		var newTiling = new Tiling(Array.from(this.points), Array.from(this.colors), newTiles, this.limit, Array.from(this.cmap));
		return newTiling;
	}
	
	clear(){
		for(var i = 0; i<this.tiles.length; i++){
			this.tiles[i].sand = 0;
		}
		this.colorTiles();
	}
	
	stabilize(){
		var oldTiles = [];
		for(var i = 0; i<this.tiles.length; i++){
			oldTiles.push(new Tile(this.tiles[i].id, Array.from(this.tiles[i].neighboors), Array.from(this.tiles[i].pointsIndexes)));
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
			this.iterate();
		}
		this.colorTiles();
		
	}
	
	colorTile(index){
		// Colors only one tile
		for(var j = 0; j<this.tiles[index].pointsIndexes.length; j++){
			var colorNum = this.tiles[index].sand;
			if(colorNum >= this.cmap.length){
				colorNum = this.cmap.length-1;
			}
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
	
	static sqTiling(width, height, cmap){
		// Creates a Tiling corresponding to a square grid of dimensions width, height

		var pos = [];
		var col = [];
		var tils = [];

		var c2 = width/2;
		var l2 = height/2;

		for(var j = 0; j < width; j++){ 
			for(var i = 0; i < height; i++){ 
				// triangles corresponding to a square grid
				pos.push( j - c2, -i + l2, 0 );
				pos.push( j- c2, -i-1 + l2, 0 );
				pos.push( j+1- c2, -i-1 + l2, 0 );

				col.push( 255, 0, 0 );
				col.push( 255, 0, 0 );
				col.push( 255, 0, 0 );

				pos.push( j+1- c2, -i-1 + l2, 0 );
				pos.push( j+1- c2, -i + l2, 0 );
				pos.push( j- c2, -i + l2, 0 );

				col.push( 255, 255, 255 );
				col.push( 255, 255, 255 );
				col.push( 255, 255, 255 );
				
				tils.push(Tile.squareTile(j, i, width, height));
			}
		}
		
		return new Tiling(pos, col, tils, 4, cmap);
	}
	
	
}