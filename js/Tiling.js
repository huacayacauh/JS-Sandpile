class Tile{
	constructor(id, neighboors, points){
		this.id = id; // Id of the tile
		this.prevSand = 0; // "trick" variable to iterate the sand
		this.sand = 0;
		this.neighboors = neighboors; // Ids of adjacent tiles
		
		this.pointsIndexes = points; // Indexes of points representing the tile, in the Tiling array of points
	}
	
	static squareTile(x, y, xMax, yMax){
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
}

class Tiling{
	// Represents any tiling
	constructor(points, colors, tiles, toppleMin, colormap){
		this.tiles = tiles;
		this.limit = toppleMin;
		
		var geometry = new THREE.BufferGeometry();

		var positionAttribute = new THREE.Float32BufferAttribute( points, 3 );
		var colorAttribute = new THREE.Float32BufferAttribute( colors, 3 );

		geometry.addAttribute( 'position', positionAttribute );
		geometry.addAttribute( 'color', colorAttribute );

		var material = new THREE.MeshBasicMaterial( {vertexColors: THREE.VertexColors} );

		this.mesh = new THREE.Mesh( geometry, material );
		this.colors = this.mesh.geometry.attributes.color;
		this.points = this.mesh.geometry.attributes.position;
		
		this.cmap = colormap;
	}
	
	iterate(){
		this.tiles.forEach(function(element) {
		  element.prevSand = element.sand;
		});
		
		for(var i = 0; i<this.tiles.length; i++){
			if(this.tiles[i].prevSand >= this.limit){
				this.tiles[i].sand -= this.limit;
				for(var j = 0; j< this.tiles[i].neighboors.length; j++){
					if(typeof this.tiles[this.tiles[i].neighboors[j]] === 'undefined'){
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
			var colorNum = this.tiles[index].sand;
			if(colorNum > this.limit){
				colorNum = this.limit;
			}
			this.colors.setXYZ(this.tiles[index].pointsIndexes[j], this.cmap[colorNum].r, this.cmap[colorNum].g, this.cmap[colorNum].b);
		}
		
		this.mesh.geometry.attributes.color.needsUpdate = true;
	}
	
	colorTiles(){
		for(var i = 0; i<this.tiles.length; i++){
			this.colorTile(i);
		}
	}
	
	static sqTiling(width, height, cmap){

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

