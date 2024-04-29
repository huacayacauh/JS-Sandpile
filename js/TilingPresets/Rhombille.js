Tiling.rhombille = function({size}={}){
	var tils = [];
    var count = 0;

	for(var i = 0; i < size; i = i + 2/Math.sqrt(3) + (2/Math.sqrt(3))/2){
		for(var j = 0; j < size; j = j+2){
            if(count%2==0){
                tils.push(rombille_upFace(j,i, size, count));
                tils.push(rombille_leftFace(j,i,size,count));
                tils.push(rombille_rightFace(j,i,size,count));
            }
            else{
                tils.push(rombille_upFace(j+1,i, size,count));
                tils.push(rombille_leftFace(j+1,i,size,count));
                tils.push(rombille_rightFace(j+1,i,size,count));
            }
			
		}	
        count++
	}
    console.log(tils);
	return new Tiling(tils);
}

function rombille_upFace(x, y, size, count){
    var id =  [x, count, "up"]
    var neighbors = [];
    neighbors.push([x, count, "left"]);
    neighbors.push([x, count, "right"]);
    neighbors.push([x-1, count-1, "right"]);
    neighbors.push([x+1, count-1, "left"]);
    
    var bounds = [];

    let sqrt3 = Math.sqrt(3);
    bounds.push(x - size/2, y - size/2);
    bounds.push(x  - size/2 + 2/sqrt3 * sqrt3/2 , y  - size/2 + 2/sqrt3 * 0.5);
    bounds.push(x+2 - size/2 , y - size/2);
    bounds.push(x+ 2/sqrt3 * sqrt3/2  - size/2, y + 2/sqrt3 * (-0.5) - size/2);

    return new Tile(id, neighbors, bounds, 4)
}

function rombille_leftFace(x, y, size,count){
    var id =  [x, count, "left"]
    var neighbors = [];
    neighbors.push([x, count, "up"]);
    neighbors.push([x-1, count+1, "up"]);
    neighbors.push([x, count, "right"]);
    neighbors.push([x-2, count, "right"]);

    var bounds = [];
    let sqrt3 = Math.sqrt(3);
    bounds.push(x - size/2, y - size/2);
    bounds.push(x - size/2, y - size/2 + 2/sqrt3);
    bounds.push(x  - size/2 + 2/sqrt3 * sqrt3/2 , y  - size/2 + 2/sqrt3 * 0.5 + 2/sqrt3);
    bounds.push(x  - size/2 + 2/sqrt3 * sqrt3/2 , y  - size/2 + 2/sqrt3 * 0.5);
    
    return new Tile(id, neighbors, bounds, 4)
}

function rombille_rightFace(x, y, size,count){
    var id =  [x, count, "right"]
    var neighbors = [];
    neighbors.push([x, count, "up"]);
    neighbors.push([x+1, count+1, "up"]);
    neighbors.push([x, count, "left"]);
    neighbors.push([x+2, count, "left"]);

    var bounds = [];
    let sqrt3 = Math.sqrt(3);
    bounds.push(x  - size/2 + 2/sqrt3 * sqrt3/2 , y  - size/2 + 2/sqrt3 * 0.5);
    bounds.push(x  - size/2 + 2/sqrt3 * sqrt3/2 , y  - size/2 + 2/sqrt3 * 0.5 + 2/sqrt3);
    bounds.push(x+2 - size/2 , y - size/2+ 2/sqrt3);
    bounds.push(x+2 - size/2 , y - size/2);

    return new Tile(id, neighbors, bounds, 4)
}
