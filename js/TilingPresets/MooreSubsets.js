Tiling.mooreSubset = function({width, height, subneighborhood}={}){
  // subset of moore neighborhood on the grid
  var tils = [];
  for(var j = 0; j < width; j++){
    for(var i = 0; i < height; i++){
      tils.push(Tile.mooreSubsetTile(j, i, width, height, subneighborhood));
    } 
  }
  return new Tiling(tils);
}

Tile.mooreSubsetTile = function(x, y, width, height, subneighborhood){
  var id = [x, y];
  var neighbors = [];
  var lim = 0
  var binSn = subneighborhood.toString(2).padStart(8, "0");
  
  // neighbors
  if (binSn[0] == 1){
    neighbors.push([x, y+1]);
    lim++;
  }
  if (binSn[1] == 1){
    neighbors.push([x+1, y]);
    lim++;
  }
  if (binSn[2] == 1){
    neighbors.push([x, y-1]);
    lim++;
  }
  if (binSn[3] == 1){
    neighbors.push([x-1, y]);
    lim++;
  }
  if (binSn[4] == 1){
    neighbors.push([x-1, y+1]);
    lim++;
  }
  if (binSn[5] == 1){
    neighbors.push([x+1, y+1]);
    lim++;
  }
  if (binSn[6] == 1){
    neighbors.push([x+1, y-1]);
    lim++;
  }
  if (binSn[7] == 1){
    neighbors.push([x-1, y-1]);
    lim++;
  }

  
  // bounds
  var bounds = [];
  bounds.push(x - width/2, y - height/2);
  bounds.push(x+1 - width/2, y - height/2);
  bounds.push(x+1 - width/2, y+1 - height/2);
  bounds.push(x - width/2, y+1 - height/2);
  // done
  return new Tile(id, neighbors, bounds, lim);
}