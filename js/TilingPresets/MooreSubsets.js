/*
Let n,ne,e,se,s,sw,w,nw denote the eight cardinal coordinates of the Moore
neighborhood, starting with north and clowkwise. Now we can denote a subset
of Moore neighborhood as an 8-bits string, where the i-th bit encodes whether
the i-th coordinate in the list n,e,s,w,nw,ne,se,sw, is part of the neighborhood
(bit 1), or not (bit 0). We can interpret 8-bits strings as numbers
(converted to decimal) with the least significant bit to the right.

The parameter *subneighborhood* is the decimal representation of the Moore
subneighborhood we want to use.

Examples:

subneighborhood 87 (binary: 01010111):
  _______
  |□|□|■|
  |■|□|■|
  |■|□|■|
  ‾‾‾‾‾‾‾
subneighborhood 199 (binary: 11000111):
  _______
  |□|■|■|
  |□|□|■|
  |■|□|■|
  ‾‾‾‾‾‾‾
"■" means the cell belongs to the neighborhood.
*/
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