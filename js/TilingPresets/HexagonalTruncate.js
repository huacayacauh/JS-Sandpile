Tiling.hexTruncate = function ({size}={}) {

	var tils = [];
	
	for(var x=0; x<size; x++){
		for(var y=0; y<size; y++){
			tils.push(hexTile(x, y));
			tils.push(tri_W(x, y));
			tils.push(tri_NW(x, y));
			tils.push(tri_SW(x, y));
			tils.push(tri_E(x, y));
			tils.push(tri_NE(x, y));
			tils.push(tri_SE(x, y));
		}
	}
	
	console.log(new Tiling(tils));
	return new Tiling(tils);
}
function tri_W(x,y){
	
	var id = [x,y,"w"]
	
	var neighbors =  [];
	neighbors.push([x, y,"hx"]);
	neighbors.push([x-1, y,"hx"]);
	neighbors.push([x-1, y+1,"hx"]);
	
	let angle = Math.PI/12;
	var bounds = [];
	bounds.push(x+Math.cos(11*angle), y+Math.sin(11*angle));
	bounds.push(x+Math.cos(13*angle), y+Math.sin(13*angle));
	bounds.push(x+0.5,y+0.5);

	
	return new Tile(id, neighbors, bounds, 3);
}
function tri_NW(x,y){
	
	var id = [x,y,"nw"]
	
	var neighbors =  [];
	neighbors.push([x, y,"hx"]);
	neighbors.push([x-1, y,"hx"]);
	neighbors.push([x, y-1,"hx"]);
	
	let angle = Math.PI/12;
	var bounds = [];
	bounds.push(x+Math.cos(7*angle), y+Math.sin(7*angle));
	bounds.push(x+Math.cos(9*angle), y+Math.sin(9*angle));
	bounds.push(x+0.5,y+0.5);
	
	return new Tile(id, neighbors, bounds, 3);
}
function tri_NE(x,y){
	
	var id = [x,y,"ne"]
	
	var neighbors =  [];
	neighbors.push([x, y,"hx"]);
	neighbors.push([x+1, y-1,"hx"]);
	neighbors.push([x, y-1,"hx"]);
	
	let angle = Math.PI/12;
	var bounds = [];
	bounds.push(x+Math.cos(3*angle), y+Math.sin(3*angle));
	bounds.push(x+Math.cos(5*angle), y+Math.sin(5*angle));
	bounds.push(x+0.5,y+0.5);
	
	return new Tile(id, neighbors, bounds, 3);
}
function tri_E(x,y){
	
	var id = [x,y,"e"]
	
	var neighbors =  [];
	neighbors.push([x, y,"hx"]);
	neighbors.push([x+1, y-1,"hx"]);
	neighbors.push([x+1, y,"hx"]);
	
	let angle = Math.PI/12;
	var bounds = [];
	bounds.push(x+Math.cos(1*angle), y+Math.sin(1*angle));
	bounds.push(x+Math.cos(23*angle), y+Math.sin(23*angle));
	bounds.push(x+0.5,y+0.5);
	
	return new Tile(id, neighbors, bounds, 3);
}
function tri_SE(x,y){
	
	var id = [x,y,"se"]
	
	var neighbors =  [];
	neighbors.push([x, y,"hx"]);
	neighbors.push([x+1, y,"hx"]);
	neighbors.push([x, y+1,"hx"]);
	
	let angle = Math.PI/12;
	var bounds = [];
	bounds.push(x+Math.cos(19*angle), y+Math.sin(19*angle));
	bounds.push(x+Math.cos(21*angle), y+Math.sin(21*angle));
	bounds.push(x+0.5,y+0.5);

	
	return new Tile(id, neighbors, bounds, 3);
}
function tri_SW(x,y){
	
	var id = [x,y,"sw"]
	
	var neighbors =  [];
	neighbors.push([x, y,"hx"]);
	neighbors.push([x-1, y+1,"hx"]);
	neighbors.push([x, y+1,"hx"]);
	
	let angle = Math.PI/12;
	var bounds = [];
	bounds.push(x+Math.cos(15*angle), y+Math.sin(15*angle));
	bounds.push(x+Math.cos(17*angle), y+Math.sin(17*angle));
	bounds.push(x+0.5,y+0.5);

	
	return new Tile(id, neighbors, bounds, 3);
}

function hexTile(x, y){
	var id = [x, y,"hx"];
	
	var neighbors =  [];

	neighbors.push([x,y,"w"])
	neighbors.push([x,y,"sw"])
	neighbors.push([x,y,"se"])
	neighbors.push([x,y,"e"])
	neighbors.push([x,y,"ne"])
	neighbors.push([x,y,"nw"])
	
	neighbors.push([x-1, y,"hx"]);
	neighbors.push([x+1, y,"hx"]);
	neighbors.push([x, y-1,"hx"]);
	neighbors.push([x, y+1,"hx"]);
	neighbors.push([x+1, y-1,"hx"]);
	neighbors.push([x-1, y+1,"hx"]);
	
	let angle = Math.PI/12;
	var bounds = [];
	
	bounds.push(x+0.5,y+0.5);
	bounds.push(x+0.5,y-0.5);
	bounds.push(x-0.5,y-0.5);
	bounds.push(x+0.5,y+0.5);
	bounds.push(x+0.5,y-0.5);
	
	

	bounds.push(x+Math.cos(1*angle), y+Math.sin(1*angle));
	bounds.push(x+Math.cos(3*angle), y+Math.sin(3*angle));
	bounds.push(x+Math.cos(5*angle), y+Math.sin(5*angle));
	bounds.push(x+Math.cos(7*angle), y+Math.sin(7*angle));
	bounds.push(x+Math.cos(9*angle), y+Math.sin(9*angle));
	bounds.push(x+Math.cos(11*angle), y+Math.sin(11*angle));
	bounds.push(x+Math.cos(13*angle), y+Math.sin(13*angle));
	bounds.push(x+Math.cos(15*angle), y+Math.sin(15*angle));
	bounds.push(x+Math.cos(17*angle), y+Math.sin(17*angle));
	bounds.push(x+Math.cos(19*angle), y+Math.sin(19*angle));
	bounds.push(x+Math.cos(21*angle), y+Math.sin(21*angle));
	bounds.push(x+Math.cos(23*angle), y+Math.sin(23*angle));
	
	return new Tile(id, neighbors, bounds, 12);
}



