Tiling.mooreSubset135 = function({width, height}={}){
  // subset of moore neighborhood on the grid
  var tils = [];
  for(var j = 0; j < width; j++){
    for(var i = 0; i < height; i++){
      tils.push(Tile.mooreSubset135Tile(j, i, width, height));
    }	
  }
  return new Tiling(tils);
}

Tile.mooreSubset135Tile = function(x, y, width, height){
  var id = [x, y];
  var neighbors = [];
  // neighbors
  neighbors.push([x, y+1]);
  neighbors.push([x+1, y+1]);
  neighbors.push([x-1, y-1]);
  neighbors.push([x+1, y-1]);
  // bounds
  var bounds = [];
  bounds.push(x - width/2, y - height/2);
  bounds.push(x+1 - width/2, y - height/2);
  bounds.push(x+1 - width/2, y+1 - height/2);
  bounds.push(x - width/2, y+1 - height/2);
  // done
  return new Tile(id, neighbors, bounds, 4);
}

Tiling.mooreSubset39 = function({width, height}={}){
  // subset of moore neighborhood on the grid
  var tils = [];
  for(var j = 0; j < width; j++){
    for(var i = 0; i < height; i++){
      tils.push(Tile.mooreSubset39Tile(j, i, width, height));
    } 
  }
  return new Tiling(tils);
}

Tile.mooreSubset39Tile = function(x, y, width, height){
  var id = [x, y];
  var neighbors = [];
  // neighbors
  neighbors.push([x+1, y+1]);
  neighbors.push([x-1, y-1]);
  neighbors.push([x, y-1]);
  neighbors.push([x+1, y-1]);
  // bounds
  var bounds = [];
  bounds.push(x - width/2, y - height/2);
  bounds.push(x+1 - width/2, y - height/2);
  bounds.push(x+1 - width/2, y+1 - height/2);
  bounds.push(x - width/2, y+1 - height/2);
  // done
  return new Tile(id, neighbors, bounds, 4);
}

