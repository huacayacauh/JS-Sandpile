Tiling.hexTiling = function (height, width, cmap) {
	
	var xCoords = hexXCoords(height);
	var yCoords = hexYCoords(width);
	
	var pos = [];
	var col = [];
	var tils = [];

	var xMid = (xCoords[xCoords.length-1] - xCoords[0])/2;
	var yMid = (yCoords[yCoords.length-2] - yCoords[0])/2;

	
	for(var i = 0; i < width; i++){
		for(var j = 0; j < height; j++){
			makeHexCell(pos, col, i, j, xCoords, yCoords, xMid, yMid)
			tils.push(Tile.hexTile(i, j, width, height));
		}
	}
	
	
	return new Tiling(pos, col, tils, cmap);
}

Tile.hexTile = function(x, y, xMax, yMax){
	var id;
	var neighbours = [];
	id = x*yMax + y;
	
	if(y%2 == 0){
		if(x < xMax - 1) neighbours.push((x+1)*yMax + y);

		if(x > 0) neighbours.push((x-1)*yMax + y);

		if(y > 0) neighbours.push(x*yMax + y-1);

		if(x > 0 && y > 0) neighbours.push((x-1)*yMax + y-1);

		if(y < yMax - 1)  neighbours.push(x*yMax + y+1);

		if(y < yMax - 1 && x > 0) neighbours.push((x-1)*yMax + y+1);
	} else{
		if(x < xMax - 1) neighbours.push((x+1)*yMax + y);

		if(x > 0) neighbours.push((x-1)*yMax + y);
		
		if(y > 0) neighbours.push(x*yMax + y-1);

		if(y > 0 && x < xMax - 1)  neighbours.push((x+1)*yMax + y-1);

		if(y < yMax - 1) neighbours.push(x*yMax + y+1);

		if(y < yMax - 1 && x < xMax - 1) neighbours.push((x+1)*yMax + y+1);
	}
	
	var pointsIds = [];
	for(var i=0; i<12; i++){
		pointsIds.push(id*12 + i);
	}
	return new Tile(id, neighbours, pointsIds, 6);
}

function makeHexCell(positions, colors, i, j, xCoords, yCoords, xMid, yMid){

		var delta = j%2;

		var A = new THREE.Vector2();
		var B = new THREE.Vector2();
		var F = new THREE.Vector2();
		var C = new THREE.Vector2();
		var E = new THREE.Vector2();
		var D = new THREE.Vector2();

		A.x = xCoords[j*2+3] - xMid; A.y = yCoords[i*2+1+delta] - yMid;
		B.x = xCoords[j*2+2] - xMid; B.y = yCoords[i*2+  delta] - yMid;
		F.x = xCoords[j*2+2] - xMid; F.y = yCoords[i*2+2+delta] - yMid;
		C.x = xCoords[j*2+1] - xMid; C.y = yCoords[i*2+  delta] - yMid;
		E.x = xCoords[j*2+1] - xMid; E.y = yCoords[i*2+2+delta] - yMid;
		D.x = xCoords[j*2]   - xMid; D.y = yCoords[i*2+1+delta] - yMid;
		
		positions.push( A.x, A.y, 0 );  colors.push( 0, 1, 0 );
		positions.push( B.x, B.y , 0 ); colors.push( 0, 1, 0 );
		positions.push( F.x, F.y , 0 ); colors.push( 0, 1, 0 );

		positions.push( B.x, B.y, 0 );  colors.push( 1, 0, 0 );
		positions.push( E.x, E.y , 0 ); colors.push( 1, 0, 0 );
		positions.push( F.x, F.y , 0 ); colors.push( 1, 0, 0 );

		positions.push( B.x, B.y, 0 );  colors.push( 0, 1, 0 );
		positions.push( C.x, C.y , 0 ); colors.push( 0, 1, 0 );
		positions.push( E.x, E.y , 0 ); colors.push( 0, 1, 0 );

		positions.push( C.x, C.y, 0 );  colors.push( 1, 0, 0 );
		positions.push( D.x, D.y , 0 ); colors.push( 1, 0, 0 );
		positions.push( E.x, E.y , 0 ); colors.push( 1, 0, 0 );
	}

function hexXCoords(column){

	var xCoords = [];

	xCoords.push(-1);
	xCoords.push(-0.5);
	xCoords.push(0.5);
	xCoords.push(1);

	var top = 1;

	for(var i = 1; i < column; i++){
		xCoords.push(top+1);
		xCoords.push(top+1.5);
		top += 1.5
	}

	return xCoords;

}

function hexYCoords(line){

	var yCoords = [];
	var SP3 = -Math.sin(Math.PI/3);

	yCoords.push(-SP3);
	yCoords.push(0);
	yCoords.push(SP3);

	var top = SP3;

	for(var i = 1; i < line; i++){
		yCoords.push(top+SP3);
		yCoords.push(top+2*SP3);
		top += 2*SP3
	}

	yCoords.push(top+SP3);

	return yCoords;

}