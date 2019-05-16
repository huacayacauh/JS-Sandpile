class Tile{
	constructor(id, neighboors, points, lim){
		this.id = id;
		this.prevSand = 0; // "trick" variable to iterate the sand
		this.sand = 0;
		if(lim < 0)
			this.sand = -1;
		this.neighboors = neighboors; // Ids of adjacent tiles

		this.limit = lim;

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
		return new Tile(id, neighboors, pointsIds, 4);
	}
	
	static squareTile2(x, y, xMax, yMax){
		// Creates the Tile in position x, y of a square grid

		var id;
		var neighboors = [];
		id = x*yMax + y;
		if(x > 0) neighboors.push((x-1)*yMax + y);
		if(x < xMax-1) neighboors.push((x+1)*yMax + y);
		if(y > 0) neighboors.push(x*yMax + (y-1));
		if(y < yMax-1) neighboors.push(x*yMax + (y+1));
		
		
		if(y < yMax-1 && x < xMax-1) neighboors.push((x+1)*yMax + (y+1));
		
		if(y < yMax-1 && x > 0) neighboors.push((x-1)*yMax + (y+1));
		
		if(y > 0 && x < xMax - 1) neighboors.push((x+1)*yMax + (y-1));
		
		if(y > 0 && x > 0) neighboors.push((x-1)*yMax + (y-1));
		var pointsIds = [];
		for(var i=0; i<6; i++){
			pointsIds.push(id*6 + i);
		}
		return new Tile(id, neighboors, pointsIds, 8);
	}
}

class Tiling{
	// Represents any tiling
	constructor(points, colors, tiles, colormap){

		this.tiles = tiles;
		//this.limit = toppleMin; // limit until the sand topple to adjacents tiles

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
		this.selectedIndex;
	}

	iterate(){
		// Topple any tile that has more than the limit of sand

		this.tiles.forEach(function(element) {
		  element.prevSand = element.sand;
		});

		for(var i = 0; i<this.tiles.length; i++){
			if(this.tiles[i].prevSand >= this.tiles[i].limit){
				this.tiles[i].sand -= this.tiles[i].limit;
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
			newTiles.push(new Tile(this.tiles[i].id, Array.from(this.tiles[i].neighboors), Array.from(this.tiles[i].pointsIndexes), this.tiles[i].limit));
		}
		var newTiling = new Tiling(Array.from(this.points), Array.from(this.colors), newTiles, Array.from(this.cmap));
		for(var i = 0; i<newTiling.tiles.length; i++){
			newTiling.tiles[i].sand = Math.max(0, this.tiles[i].limit - 1 - this.tiles[i].sand);
		}
		console.log(newTiling);
		return newTiling;
	}

	addMaxStable(){
		for(var i = 0; i< this.tiles.length; i++){
			this.add(i, this.tiles[i].limit - 1);
		}
		this.colorTiles();
	}

	copy(){
		var newTiles = [];
		for(var i = 0; i<this.tiles.length; i++){
			newTiles.push(new Tile(this.tiles[i].id, Array.from(this.tiles[i].neighboors), Array.from(this.tiles[i].pointsIndexes), this.tiles[i].limit));
		}
		var newTiling = new Tiling(Array.from(this.points), Array.from(this.colors), newTiles, Array.from(this.cmap));
		for(var i = 0; i<this.tiles.length; i++){
			newTiling.tiles[i].sand = new Number(this.tiles[i].sand);
		}
		return newTiling;
	}

	clear(){
		for(var i = 0; i<this.tiles.length; i++){
			this.tiles[i].sand = 0;
		}
		this.colorTiles();
	}

	stabilize(){
		var t0 = performance.now();

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
			for(var i = 0; i<100; i++)
				this.iterate();
		}

		console.log("Stabilized in : " + (performance.now() - t0) + " (ms)");
		this.colorTiles();

	}

	colorTile(index, color){
		// Colors only one tile
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
	
	get_stats(){
		var mean = 0;
		var std = 0;
		for(var i = 0; i<this.tiles.length; i++){
			mean += this.tiles[i].sand;
		}
		mean = mean / this.tiles.length;
		for(var i = 0; i<this.tiles.length; i++){
			std += Math.pow((this.tiles[i].sand - mean), 2);
		}
		std = std / this.tiles.length;
		std = Math.sqrt(std);
		return {"Mean":mean, "Std":Math.round(std * 100000)/100000};
	}
	
	apply_harmonic(){
		var grid_width = Number(document.getElementById("cW").value);
		var grid_height = Number(document.getElementById("cH").value);
		var identifier = document.getElementById("harmonicValue").value;
		
		var harmonic = new Array( grid_width + 2);

		for (var i = 0; i <  grid_width + 2; i++) {
		  harmonic[i] = new Array( grid_height + 2);
		}
		var harm_min = 0;
		for (var i = 0; i <  grid_width + 2; i++) {
		  for (var j = 0; j <  grid_height + 2; j++) {
			  if((i == 0 && j == 0) || (i ==  grid_width + 1 && j == 0) ||
			  (i ==  grid_width + 1 && j ==  grid_height + 1) ||(i == 0 && j ==  grid_height + 1)){
				continue;
			  }
			  var x = i - Math.floor( grid_width/2) - 1;
			  var y = j - Math.floor( grid_height/2) - 1;
			  switch(identifier){
				  case "1A":
				  harmonic[i][j] = x;
				  break;
				  
				  case "1B":
				  harmonic[i][j] = y;
				  break;
				  
				  case "2A":
				  harmonic[i][j] = x * y;
				  break;
				  
				  case "2B":
				  harmonic[i][j] = x*x - y*y;
				  break;
				  
				  case "3A":
				  harmonic[i][j] = x*x*x - 3*x*y*y;
				  break;
				  
				  case "3B":
				  harmonic[i][j] = y*y*y - 3*y*x*x;
				  break;
				  
				  case "4A":
				  harmonic[i][j] = x*x*x*x - 6*x*x*y*y + y*y*y*y - x*x - y*y;
				  break;
				  
				  case "4B":
				  harmonic[i][j] = x*x*x*y - x*y*y*y;
				  break;
			  }
			  if(harm_min > harmonic[i][j]){
				harm_min = harmonic[i][j];
			  }
			}
		}
		
		for (var i = 0; i <  grid_width + 2; i++) {
		  for (var j = 0; j <  grid_height + 2; j++) {
			  harmonic[i][j] -= harm_min;
			}
		}
		var harm_gcd = harmonic[0][0];
		for (var i = 0; i <  grid_width + 2; i++) {
		  for (var j = 0; j <  grid_height + 2; j++) {
			  harm_gcd = gcd(harm_gcd, harmonic[i][j]);
			}
		}
		for (var i = 0; i <  grid_width; i++) {
		  for (var j = 0; j <  grid_height; j++) {
			  if(i == 0){
				  this.add(i* grid_height + j, harmonic[i][j+1] / harm_gcd);
			  }
			  if(i ==  grid_width - 1){
				  this.add(i* grid_height + j, harmonic[i+2][j+1] / harm_gcd);
			  }
			  if(j == 0){
				  this.add(i* grid_height + j, harmonic[i+1][j] / harm_gcd);
			  }
			  if(j ==  grid_height - 1){
				  this.add(i* grid_height + j, harmonic[i+1][j+2] / harm_gcd);
			  }
			}
		}

	}

	static sqTiling(width, height, cmap, type){
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
				
				if(type == 0)
					tils.push(Tile.squareTile(j, i, width, height));
				else
					tils.push(Tile.squareTile2(j, i, width, height));
			}	
		}

		return new Tiling(pos, col, tils, cmap);
	}
}

function gcd(x, y) {
  if ((typeof x !== 'number') || (typeof y !== 'number')) 
    return false;
  x = Math.abs(x);
  y = Math.abs(y);
  while(y) {
    var t = y;
    y = x % y;
    x = t;
  }
  return x;
}
