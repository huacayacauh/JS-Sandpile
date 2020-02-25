Tiling.hexTiling = function ({size}={}) {
	
	var pos = [];
	var col = [];
	var tils = [];
	
	var wirePos = []

	var xMid = size*1.5;
	var yMid = size*1.5;

	var count = 0;
	for(var i = 0; i < size*2 -1; i++){
		for(var j = 0; j< hexHeightFromWidth(i, size); j++){
			var bounds = hexBounds(i, j, xMid, yMid, size);
			tils.push(Tile.hexTile(i, j, count, hexHeightFromWidth(i, size), size, bounds));
			count++;
		}
	}
	return new Tiling(tils);
}

function hexHeightFromWidth(size, hexLength){
	var hex = Number(hexLength);
	if(size < hex){
		return size + hex;	
	} else {
		return 2*hex - (size-hex +2);
	}
}

Tile.hexTile = function(x, y, id, yMax, size, bounds){
	var neighbors = [];

	if(y > 0)
		neighbors.push(id - 1);
	if(y < yMax - 1)
		neighbors.push(id + 1);
	if(x < size - 1){
		if(x>0){
			if(y > 0)
				neighbors.push(id - yMax);
			if(y < yMax - 1)
				neighbors.push(id - yMax +1);
		}
		neighbors.push(id + yMax);
		neighbors.push(id + yMax +1);
	} else if(x == size -1){
		if(y > 0)
			neighbors.push(id - yMax);
		if(y < yMax - 1)
			neighbors.push(id - yMax +1);
		if(y < yMax - 1)
			neighbors.push(id + yMax);
		if(y > 0)
			neighbors.push(id + yMax -1);
		
	} else {
		
		neighbors.push(id - yMax);
		neighbors.push(id - yMax -1);
		if(x < size * 2 -2){
			if(y < yMax - 1)
				neighbors.push(id + yMax);
			if(y > 0)
				neighbors.push(id + yMax -1);
		}
	}
	
	return new Tile(id, neighbors, bounds, 6);
}

function hexBounds(i, j, xMid, yMid, xMax){

	var A = new THREE.Vector2();
	var B = new THREE.Vector2();
	var F = new THREE.Vector2();
	var C = new THREE.Vector2();
	var E = new THREE.Vector2();
	var D = new THREE.Vector2();

	var delta = Math.abs(Number(xMax) - i - 1) * 0.866;

	A.x = i*1.5+2 - xMid; A.y = j*1.732+0.866 +delta - yMid;
	B.x = i*1.5+1.5 - xMid; B.y = j*1.732+  +delta - yMid;
	F.x = i*1.5+1.5 - xMid; F.y = j*1.732+1.732 +delta- yMid;
	C.x = i*1.5+0.5 - xMid; C.y = j*1.732+  +delta- yMid;
	E.x = i*1.5+0.5 - xMid; E.y = j*1.732+1.732 +delta- yMid;
	D.x = i*1.5  - xMid; D.y = j*1.732+0.866  +delta- yMid;
	
	return [A.x, A.y, B.x, B.y, C.x, C.y, D.x, D.y, E.x, E.y, F.x, F.y];
	
	
}
