Tiling.SnubTrihexagonal = function ({size}={}) {
	var tils = [];

	for(var z=-size;z<=size;z++) {
		for(var k=-size;k<=size;k++) {
			for(var i=-size;i<=size;i++) {
				if(z+k+i==0) {
					var hexNeighbors = [];
					var triNei1 = [];
					var triNei2 = [];
					var triNei3 = [];
					var triNei4 = [];
					var triNei5 = [];
					var triNei6 = [];
					var triUp = [];
					var triDo = [];

					triNei1.push([(5/3)*i+k/3,-i-3*k,0]);
					triNei1.push([3*i+2*k-2,-2-i-3*k+3,"down"]);
					triNei1.push([-1+3*i+2*k,1-i-3*k,"down"]);

					triNei2.push([(5/3)*i+k/3,-i-3*k,0]);
					triNei2.push([3*i+2*k+2-3,-i-3*k-3+1,"down"]);
					triNei2.push([-1+3*i+2*k+2-3,1-i-3*k-3+1,"down"]);

					triNei3.push([(5/3)*i+k/3,-i-3*k,0]);
					triNei3.push([-2+3*i+2*k+3,-i-3*k-1,"down"]);
					triNei3.push([-1+3*i+2*k+2,1-i-3*k-3,"down"]);

					triNei4.push([(5/3)*i+k/3,-i-3*k,0]);
					triNei4.push([-1+3*i+2*k+3-2,-1-i-3*k-1+3,"up"]);
					triNei4.push([1+3*i+2*k,-i-3*k,"up"]);

					triNei5.push([(5/3)*i+k/3,-i-3*k,0]);
					triNei5.push([1+3*i+2*k-3,-1-i-3*k+1,"up"]);
					triNei5.push([1+3*i+2*k-3,-i-3*k+1,"up"]);

					triNei6.push([(5/3)*i+k/3,-i-3*k,0]);
					triNei6.push([3*i+2*k+2,2-i-3*k-3,"up"]);
					triNei6.push([1+3*i+2*k+2-3,-i-3*k-3+1,"up"]);

					triUp.push([3*i+2*k,-i-3*k,"down"])
					triUp.push([-2+3*i+2*k+3,-i-3*k-1,"down"])
					triUp.push([3*i+2*k-2+3,-2-i-3*k+3-1,"down"])

					triDo.push([3*i+2*k,2-i-3*k,"up"])
					triDo.push([1+3*i+2*k-2,-1-i-3*k+3,"up"])
					triDo.push([-1+3*i+2*k-2+3,-1-i-3*k+3-1,"up"])

					hexNeighbors.push([3*i+2*k,2-i-3*k,"up"]);
					hexNeighbors.push([-1+3*i+2*k,-1-i-3*k,"up"]);
					hexNeighbors.push([1+3*i+2*k,-1-i-3*k,"up"]);
					hexNeighbors.push([3*i+2*k,-i-3*k,"down"]);
					hexNeighbors.push([-2+3*i+2*k,-i-3*k,"down"]);
					hexNeighbors.push([3*i+2*k,-2-i-3*k,"down"]);
					
					tils.push(EuclideanTiling_upTriangle(3*i+2*k,2-i-3*k,3,triNei1));
					tils.push(EuclideanTiling_upTriangle(-1+3*i+2*k,-1-i-3*k,0,triNei2));
					tils.push(EuclideanTiling_upTriangle(1+3*i+2*k,-1-i-3*k,0,triNei3));
			
					tils.push(EuclideanTiling_downTriangle(3*i+2*k,-i-3*k,0,triNei4));
					tils.push(EuclideanTiling_downTriangle(-2+3*i+2*k,-i-3*k,0,triNei5));
					tils.push(EuclideanTiling_downTriangle(3*i+2*k,-2-i-3*k,0,triNei6));
		
					tils.push(EuclideanTiling_hexTile((5/3)*i+k/3,-i-3*k,0,hexNeighbors));
		
					tils.push(EuclideanTiling_upTriangle(1+3*i+2*k,-i-3*k,0,triUp));
					tils.push(EuclideanTiling_downTriangle(-1+3*i+2*k,1-i-3*k,0,triDo));
				}
			}
		}
	}
	return new Tiling(tils);
}
function EuclideanTiling_hexTile(x, y, z, neighbors){
	var id = [x, y, z];
	let sq3 = Math.sqrt(3)/2;
	var bounds = [];
	bounds.push(1.5*x-0.5, (y-z-1)*sq3);
	bounds.push(1.5*x-1, (y-z)*sq3);
	bounds.push(1.5*x-0.5, (y-z+1)*sq3);
	bounds.push(1.5*x+0.5, (y-z+1)*sq3);
	bounds.push(1.5*x+1, (y-z)*sq3);
	bounds.push(1.5*x+0.5, (y-z-1)*sq3);
	return new Tile(id, neighbors, bounds, 6);
}
function EuclideanTiling_upTriangle(x, y, n, neighbors){
	var id = [x, y, "up"];
	let sq3 = Math.sqrt(3);
	var bounds = [];
	bounds.push(x+ (y-n)/2, y*(sq3/2) - n*(sq3/6));
	bounds.push(x+ (y-n)/2 + 1, y*(sq3/2) - n*(sq3/6));
	bounds.push(x+ (y-n)/2 + 0.5, (y+1)*(sq3/2) - n*(sq3/6));
	return new Tile(id, neighbors, bounds, 3);
}
function EuclideanTiling_downTriangle(x, y, n, neighbors){
	var id = [x, y, "down"];
	let sq3 = Math.sqrt(3);
	var bounds = [];
	bounds.push(x+ (y-n)/2 + 0.5, (y+1)*(sq3/2) - n*(sq3/6));
	bounds.push(x+ (y-n)/2 + 1.5, (y+1)*(sq3/2) - n*(sq3/6));
	bounds.push(x+ (y-n)/2 + 1, y*(sq3/2) - n*(sq3/6));
	return new Tile(id, neighbors, bounds, 3);
}
