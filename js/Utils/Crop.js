// This code is part of JS-Sandpile (https://github.com/huacayacauh/JS-Sandpile/)
// CC-BY Valentin Darrigo, Jeremy Fersula, Kevin Perrot

// [1.0] crop Array of Tile to rectangle

function cropTilingToRectangle(tiles,width,height){
  newtiles = [];
  tiles.forEach(tile => {
    let allboundsinside = true;
    for(let i=0; i<tile.bounds.length; i=i+2){
      if(  -width/2 > tile.bounds[i]
        || tile.bounds[i] > width/2 
        || -height/2 > tile.bounds[i+1]
        || tile.bounds[i+1] > height/2 ){
        allboundsinside = false;
      }
    }
    if(allboundsinside){
      newtiles.push(tile);
    }
  });
  return newtiles;
}
