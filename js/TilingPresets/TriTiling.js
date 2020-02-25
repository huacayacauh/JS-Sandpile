Tiling.triTiling = function ({size}={}) {
	
	var pos = [];
	var col = [];
	var tils = [];
	
	var wireFramePos = [];

	var xMid = size/2;
	var yMid = (size*Math.sin(Math.PI/3))/2;

	
	for(var i = 0; i < size; i++){
		var length = 2*size-1 - i*2;
		for(var j = 0; j < length; j++){
			var bounds = boundsTri(i, j, xMid, yMid);
			tils.push(Tile.triTile(i, j, size, length, bounds));
		}
	}
	
	
	return new Tiling(tils);
}

Tile.triTile = function(x, y, size, length, bounds){
	var id;
	var neighbors = [];

	id = 0;
	for(var i = 0; i < x; i++){
		id += 2*size-1 - i*2;
	}
	id += y;
	
	if (y > 0) neighbors.push(id-1);
	if (y < length-1) neighbors.push(id+1);


	if(y%2 == 0){
		if (i > 0) neighbors.push(id - (length+1));
	} else{
		if (i < size-1) neighbors.push(id + (length-1));
	}
	
	return new Tile(id, neighbors, bounds, 3);
}

function boundsTri(i, j, xMid, yMid){

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
		

		return [A.x, A.y, B.x, B.y, C.x, C.y];

}