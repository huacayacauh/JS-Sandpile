// This code is part of JS-Sandpile (https://github.com/huacayacauh/JS-Sandpile/)
// CC-BY Valentin Darrigo, Jeremy Fersula, Kevin Perrot

// Penrose: split P3 (rhombus) and P2 (kite-dart) to obtain P0 (triangles)
// https://tartarus.org/~simon/20110412-penrose/penrose.xhtml

// golden ratio
var phi = (1+Math.sqrt(5))/2;

// generate Penrose P3 tiles (rhombus) from sun substition
function P3tiles(iterations){
  // code copy from PenroseP3Substitution.js
  let tiles = [];
  // push base "sun" tiling
  for(let i=0; i<5; i++){
    // construct tiles
    let myfat = fat.myclone();
    myfat.id.push('basefat'+i); // unique!
    myfat.rotate(0,0,i*2*Math.PI/5);
    let mythin = thin.myclone();
    mythin.id.push('basethin'+i); // unique!
    mythin.rotate(0,0,Math.PI);
    mythin.shift(0,2*Math.cos(2*Math.PI/5)+1);
    mythin.rotate(0,0,(i*2+1)*Math.PI/5);
    // define neighbors with undefined on the boundary
    myfat.neighbors.push(['fat','basefat'+(i-1+5)%5]); // 0
    myfat.neighbors.push(['thin','basethin'+(i-1+5)%5]); // 1
    myfat.neighbors.push(['thin','basethin'+i]); // 2
    myfat.neighbors.push(['fat','basefat'+(i+1)%5]); // 3
    mythin.neighbors.push(undefined); // 0
    mythin.neighbors.push(['fat','basefat'+(i+1)%5]); // 1
    mythin.neighbors.push(['fat','basefat'+i]); // 2
    mythin.neighbors.push(undefined); // 3
    tiles.push(myfat);
    tiles.push(mythin);
  }
  // call the substitution
  tiles = substitute(
    iterations,
    tiles,
    phi,
    substitutionP3,
    duplicatedP3,
    duplicatedP3oriented,
    neighborsP3,
    neighbors2boundsP3,
    decorateP3
  );
  return tiles;
}

// split a set of P3 tiles (rhombus) into P0 tiles (triangles)
function P3split(tiles){
  console.log("* split tiles");
  let newtiles = [];
  tiles.forEach(tile => {
    // tile 1 : points 0,1,2
    let bounds1 = tile.bounds.slice(0,6);
    newtiles.push(new Tile(tile.id.concat("1"),[],bounds1,3));
    // tile 2 : points 2,3,0
    let bounds2 = tile.bounds.slice(4,8).concat(tile.bounds.slice(0,2));
    newtiles.push(new Tile(tile.id.concat("2"),[],bounds2,3));
  });
  return newtiles;
}

// find neighbors in P0 with findNeighbors from SubstitutionAPI
// by side effect on the Array of Tile
function P0fn(tiles){
  console.log("* find neighbors (using findNeighbors from SubstitutionAPI)");
  resetAllNeighbors(tiles);
  let tilesdict = new Map(tiles.map(i => [id2key(i.id), i]));
  let neighbors2bounds = new Map();
  neighbors2bounds.set('fat',default_neighbors2bounds(3));
  neighbors2bounds.set('thin',default_neighbors2bounds(3));
  let fn=findNeighbors(tiles,tilesdict,neighbors2bounds);
  console.log("  found "+fn);
}

// decorate P0 tiles
// by side effect on the Array of Tile
function P0decorate(tiles){
  console.log("* decorate tiles");
  tiles.forEach(tile => {
    if(tile.id[0]=="thin"){
      tile.sand=1;
    }
  });
}

// generate P0 from P3 sun substitution
Tiling.P0splitP3 = function({iterations}={}){
  console.log("Generating Penrose P0 from P3 sun substitution...");
  // generate P3 tiles
  tiles = P3tiles(iterations);
  // split tiles
  tiles = P3split(tiles);
  // find neighbors with findNeighbors from SubstitutionAPI
  P0fn(tiles);
  // decorate tiles
  P0decorate(tiles);
  // done
  console.log("done");
  return new Tiling(tiles);
}

// return new bounds for the tile (fat1,fat2,thin1,thin2), with knotches
function P0knotches_fat1(bounds,kwidth){
  newbounds = [];
  let Ax=bounds[0];
  let Ay=bounds[1];
  let Bx=bounds[2];
  let By=bounds[3];
  let Cx=bounds[4];
  let Cy=bounds[5];
  // long side (A--B) ratio
  let AA=scalePoint(Ax,Ay,Bx,By,phi/2);
  let BB=scalePoint(Ax,Ay,Bx,By,1-phi/2);
  let AAx=AA[0], AAy=AA[1];
  let BBx=BB[0], BBy=BB[1];
  // push new bounds with knotches
  newbounds.push(...knotchArrowM(1,Ax,Ay,Cx,Cy,kwidth));
  newbounds.push(...knotchArrowM(3,Cx,Cy,Bx,By,kwidth));
  newbounds.push(BBx,BBy);
  newbounds.push(...knotchArrowF(4,BBx,BBy,AAx,AAy,kwidth));
  newbounds.push(Ax,Ay);
  return newbounds;
}
function P0knotches_fat2(bounds,kwidth){
  newbounds = [];
  let Ax=bounds[0];
  let Ay=bounds[1];
  let Bx=bounds[2];
  let By=bounds[3];
  let Cx=bounds[4];
  let Cy=bounds[5];
  // long side (A--B) ratio : create intermediate points at distance 1
  let AA=scalePoint(Ax,Ay,Bx,By,phi/2);
  let BB=scalePoint(Ax,Ay,Bx,By,1-phi/2);
  let AAx=AA[0], AAy=AA[1];
  let BBx=BB[0], BBy=BB[1];
  // push new bounds with knotches
  newbounds.push(AAx,AAy);
  newbounds.push(...knotchArrowM(4,AAx,AAy,BBx,BBy,kwidth));
  newbounds.push(Bx,By);
  newbounds.push(...knotchArrowF(3,Bx,By,Cx,Cy,kwidth));
  newbounds.push(...knotchArrowF(1,Cx,Cy,Ax,Ay,kwidth));
  return newbounds;
}
function P0knotches_thin1(bounds,kwidth){
  newbounds = [];
  let Ax=bounds[0];
  let Ay=bounds[1];
  let Bx=bounds[2];
  let By=bounds[3];
  let Cx=bounds[4];
  let Cy=bounds[5];
  // short side (A--B) ratio
  let kwidthshort=kwidth*phi;
  // push new bounds with knotches
  newbounds.push(...knotchArrowF(3,Ax,Ay,Cx,Cy,kwidth));
  newbounds.push(...knotchArrowM(1,Cx,Cy,Bx,By,kwidth));
  newbounds.push(...knotchArrowF(2,Bx,By,Ax,Ay,kwidthshort));
  return newbounds;
}
function P0knotches_thin2(bounds,kwidth){
  newbounds = [];
  let Ax=bounds[0];
  let Ay=bounds[1];
  let Bx=bounds[2];
  let By=bounds[3];
  let Cx=bounds[4];
  let Cy=bounds[5];
  // short side (A--B) ratio
  let kwidthshort=kwidth*phi;
  // push new bounds with knotches
  newbounds.push(...knotchArrowM(2,Ax,Ay,Bx,By,kwidthshort));
  newbounds.push(...knotchArrowF(1,Bx,By,Cx,Cy,kwidth));
  newbounds.push(...knotchArrowM(3,Cx,Cy,Ax,Ay,kwidth));
  return newbounds;
}

// generate P0 from P3 sun substitution
Tiling.P0splitP3lasercut = function({width,height,iterations,knotchN,kwidth}={}){
  console.log("Generating Penrose P0 from P3 sun substitution...");
  // generate P3 tiles
  tiles = P3tiles(iterations);
  // crop to rectangle now on P3, in order to have pairs of triangles to be glued together
  console.log("laser cut: crop to rectangle width="+width+" height="+height);
  tiles = cropTilingToRectangle(tiles,width,height);
  // split tiles
  tiles = P3split(tiles);
  // before messing up tile sides:
  // find neighbors with findNeighbors from SubstitutionAPI
  P0fn(tiles);
  // add knotches+engravings
  console.log("laser cut: add knotches kwidth="+kwidth+" knotchN="+knotchN);
  tiles.forEach(tile => {
    let Ax=0;
    let Ay=0;
    let Bx=0;
    let By=0;
    let Cx=0;
    let Cy=0;
    let newbounds = tile.bounds;
    // reorder bounds and create knotches
    // caution : thin1 <-> thin2
    // * id[0] gives the tile type (fat or thin)
    // * id[len-1] gives the triangle type (1 or 2)
    switch(tile.id[0]+tile.id.slice(-1)[0]){
      case "fat1":
        tile.sand = 5; // deco
        Ax=tile.bounds[4];
        Ay=tile.bounds[5];
        Bx=tile.bounds[0];
        By=tile.bounds[1];
        Cx=tile.bounds[2];
        Cy=tile.bounds[3];
        switch(knotchN){
          case "teeth":
            newbounds = P0knotches_fat1([Ax,Ay,Bx,By,Cx,Cy],kwidth);
            break;
          default:
            break;
        }
        break;
      case "fat2":
        tile.sand = 4; // deco
        Ax=tile.bounds[0];
        Ay=tile.bounds[1];
        Bx=tile.bounds[4];
        By=tile.bounds[5];
        Cx=tile.bounds[2];
        Cy=tile.bounds[3];
        switch(knotchN){
          case "teeth":
            newbounds = P0knotches_fat2([Ax,Ay,Bx,By,Cx,Cy],kwidth);
            break;
          default:
            break;
        }
        break;
      case "thin1": // kevin: is my thin2
        tile.sand = 7; // deco
        Ax=tile.bounds[0];
        Ay=tile.bounds[1];
        Bx=tile.bounds[4];
        By=tile.bounds[5];
        Cx=tile.bounds[2];
        Cy=tile.bounds[3];
        switch(knotchN){
          case "teeth":
            newbounds = P0knotches_thin2([Ax,Ay,Bx,By,Cx,Cy],kwidth);
            break;
          default:
            break;
        }
        break;
      case "thin2": // kevin: is my thin1
        tile.sand = 8; // deco
        Ax=tile.bounds[4];
        Ay=tile.bounds[5];
        Bx=tile.bounds[0];
        By=tile.bounds[1];
        Cx=tile.bounds[2];
        Cy=tile.bounds[3];
        switch(knotchN){
          case "teeth":
            newbounds = P0knotches_thin1([Ax,Ay,Bx,By,Cx,Cy],kwidth);
            break;
          default:
            break;
        }
        break;
    /*
     * PREVIOUSLY from cut and project :
     * INCONSISTENT tile types 1 or 2 from orientations
     *
    let Ax=0;
    let Ay=0;
    let Bx=0;
    let By=0;
    let Cx=0;
    let Cy=0;
    let newbounds = [];
    // points A,B,C are ordered canonically (according to kevin's drawings...)
    // then newbounds are computed (via aux-functions above)
    // tiles are decorated (fat/thin and 1/2)
    switch(tile.id[0]+tile.id.slice(-1)[0]){
      case "[0,4]1":
        // fat 1
        tile.sand = 5;
        Ax=tile.bounds[4];
        Ay=tile.bounds[5];
        Bx=tile.bounds[0];
        By=tile.bounds[1];
        Cx=tile.bounds[2];
        Cy=tile.bounds[3];
        newbounds=P0knotches_fat1([Ax,Ay,Bx,By,Cx,Cy],kwidth);
        break;
      case "[0,1]2":
      case "[1,2]2":
      case "[2,3]2":
      case "[3,4]2":
        // fat 1
        tile.sand = 5;
        Ax=tile.bounds[0];
        Ay=tile.bounds[1];
        Bx=tile.bounds[4];
        By=tile.bounds[5];
        Cx=tile.bounds[2];
        Cy=tile.bounds[3];
        newbounds=P0knotches_fat1([Ax,Ay,Bx,By,Cx,Cy],kwidth);
        break;
      case "[0,1]1":
      case "[1,2]1":
      case "[2,3]1":
      case "[3,4]1":
        // fat 2
        tile.sand = 4;
        Ax=tile.bounds[4];
        Ay=tile.bounds[5];
        Bx=tile.bounds[0];
        By=tile.bounds[1];
        Cx=tile.bounds[2];
        Cy=tile.bounds[3];
        newbounds=P0knotches_fat2([Ax,Ay,Bx,By,Cx,Cy],kwidth);
        break;
      case "[0,4]2":
        // fat 2
        tile.sand = 4;
        Ax=tile.bounds[0];
        Ay=tile.bounds[1];
        Bx=tile.bounds[4];
        By=tile.bounds[5];
        Cx=tile.bounds[2];
        Cy=tile.bounds[3];
        newbounds=P0knotches_fat2([Ax,Ay,Bx,By,Cx,Cy],kwidth);
        break;
      case "[0,3]1":
      case "[1,4]1":
        // thin 1
        tile.sand = 7;
        Ax=tile.bounds[4];
        Ay=tile.bounds[5];
        Bx=tile.bounds[0];
        By=tile.bounds[1];
        Cx=tile.bounds[2];
        Cy=tile.bounds[3];
        newbounds=P0knotches_thin1([Ax,Ay,Bx,By,Cx,Cy],kwidth);
        break;
      case "[0,2]2":
      case "[1,3]2":
      case "[2,4]2":
        // thin 1
        tile.sand = 7;
        Ax=tile.bounds[0];
        Ay=tile.bounds[1];
        Bx=tile.bounds[4];
        By=tile.bounds[5];
        Cx=tile.bounds[2];
        Cy=tile.bounds[3];
        newbounds=P0knotches_thin1([Ax,Ay,Bx,By,Cx,Cy],kwidth);
        break;
      case "[0,2]1":
      case "[1,3]1":
      case "[2,4]1":
        // thin 2
        tile.sand = 8;
        Ax=tile.bounds[4];
        Ay=tile.bounds[5];
        Bx=tile.bounds[0];
        By=tile.bounds[1];
        Cx=tile.bounds[2];
        Cy=tile.bounds[3];
        newbounds=P0knotches_thin2([Ax,Ay,Bx,By,Cx,Cy],kwidth);
        break;
      case "[0,3]2":
      case "[1,4]2":
        // thin 2
        tile.sand = 8;
        Ax=tile.bounds[0];
        Ay=tile.bounds[1];
        Bx=tile.bounds[4];
        By=tile.bounds[5];
        Cx=tile.bounds[2];
        Cy=tile.bounds[3];
        newbounds=P0knotches_thin2([Ax,Ay,Bx,By,Cx,Cy],kwidth);
        break;
      */
      default:
        console.log("oups: unexpected tile id, found "+tile.id[0]+tile.id.slice(-1)[0]+".");
        break;
    }
    // update tile.bounds
    tile.bounds=newbounds;
  });
  // done: construct tiling
  console.log("done");
  return new Tiling(tiles);
}

