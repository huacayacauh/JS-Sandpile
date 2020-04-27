// This code is part of JS-Sandpile (https://github.com/huacayacauh/JS-Sandpile/)
// CC-BY Valentin Darrigo, Jeremy Fersula, Kevin Perrot

//
// [0]
// Implementation of "Cut and Project" tiling generation via "Mutligrids"
// based on a python/sagemath code by Thomas Fernique, many thanks to him :-)
// TODO: add neighbors computation during tile creation instead of calling findNeighbors
//

// [1]
// construct the directions of the multigrid lines associated to the plane described by
// * G: the grassmannian coordinates of the tiling slope
function generators_to_grid(G){
  let n = G[0].length;
  let d = G.length;
  // this may for sure be compressed... original python is:
  // M=matrix([g[i] for i in range(d)]+[[1 if j==i else 0 for j in range(n)] for i in range(n-d)])
  let M = JSON.parse(JSON.stringify(G));
  for(let i=0; i<n-d; i++){
    let newline = [];
    for(let j=0; j<n; j++){
      if(j==i){ newline.push(1); }
      else{ newline.push(0); }
    }
    M.push(newline);
  }
  // compute Gram-Schmidt
  let gm = matrix_GramSchmidt(M);
  let H = gm[0];
  // this may for sure be compressed... original python is:
  // return matrix([[G[j,i]/norm(G[j]) for j in range(d)] for i in range(n)])
  let I = [];
  for(let i=0; i<n; i++){
    let newline = [];
    for(let j=0; j<d; j++){
      newline.push(H[j][i]/vector_norm(H[j]));
    }
    I.push(newline);
  }
  return I;
}

// [2]
// For d=2
// Construct tiling dual of the multigrid, with
// * V: a n times d matrix whose lines give the directions
// * S: an Array of length n giving the shifts
// * k: an integer bounding the absolute value of indices considered
//      for each family of hyperplane
// Returns the list of elements [[i,j],[k1,k2,...,kn]]
// with [i,j] the rhomb type and kl the index in the l-th direction
// i.e., number of lines of type l before the intersection
function dual2(V,S,k){
  var tiles_info = [];
  var n = V.length;
  var d = V[0].length;
  // prepare indices
  let index = [];
  for(let i=-k; i<=k; i++){
    index.push(i);
  }
  var indices = cartesian_product(Array(d).fill(index));
  // for each family of hyperplanes (type of tile)
  for(let t of combinations(Array.from(Array(n).keys()),d)){
    // select rows t and inverse, in order to compute intersection
    let M = matrix_inverse(matrix_from_rows(V,t));
    // for each tupple of d indices
    for(let ind of indices){
      // coordinate of intersection
      let v = [];
      for(let j=0; j<d; j++){
        v.push(S[t[j]]+ind[j]);
      }
      let intersec = matrix_mult_vector(M,v);
      // shift of prototile defined by hyperplan indices bounding the intersection
      let pos = [];
      for(let j=0; j<n; j++){
        pos.push(Math.ceil(vector_dot(intersec,V[j])-S[j]));
      }
      // avoid rounding errors for hyperplans containing the intersection
      for(let h=0; h<d; h++){
        pos[t[h]] = ind[h];
      }
      // add tile
      tiles_info.push([t,pos]);
    }
  }
  return tiles_info;
}

// [3]
// For d=2
// Construct Tile objects of the tiling (projected on the cutting plane) from
// * directions: an n times d matrix whose columns are 
//               the orthogonal projections of base vectors
// * tiles_info: provides by dual2
// tiles_info are used as Tile id as [id2key(t),pos] (for findNeighbors and decoration)
function draw2(directions,tiles_info){
  var tiles = [];
  for(let tile of tiles_info){
    let bounds = [];
    for(let a of [[0,0],[0,1],[1,1],[1,0]]){
      let q = JSON.parse(JSON.stringify(tile[1]));
      q[tile[0][0]] = q[tile[0][0]]+a[0];
      q[tile[0][1]] = q[tile[0][1]]+a[1];
      let coord = vector_mult_matrix(q,directions);
      bounds.push(coord[0]);
      bounds.push(coord[1]);
    }
    tiles.push(new Tile([id2key(tile[0]),tile[1]],[],bounds,4));
  }
  return tiles;
}

// [4]
// Crop tiling (as tiles_info) in order to keep only tiles "living"
// within the lines of index +-k
function cropn(tiles_info,k){
  tiles_info_croped = [];
  for(let tile of tiles_info){
    // note that coord are integers
    let outside = tile[1].filter(coord => Math.abs(coord+1/2)>k);
    if(outside.length==0){
      tiles_info_croped.push(tile);
    }
  }
  return tiles_info_croped;
}

//
// [5] Cut and project tilings :
// * Penrose,
// * Ammann-Beenker,
// * 12-fold,
// * Golden octagonal,
// * Rauzy
//

// [5.1] Penrose
Tiling.PenroseCutandproject = function({size}={}){
  console.log("Generating Penrose P3 cut and project via multigrid...");
  let phi=(1+Math.sqrt(5))/2;
  // use grassmannian coordinates
  // for each line: 2 coordinates of normal vector, shift, number of lines
  console.log("* set directions and shift");
  let penrose_dir = generators_to_grid([[phi,0,-phi,-1,1],[-1,1,phi,0,-phi]]);
  let penrose_shift = [1/5,1/5,1/5,1/5,1/5];
  let penrose_draw = [];
  for(let k=0; k<5; k++){
    penrose_draw.push([Math.cos(k*2*Math.PI/5),Math.sin(k*2*Math.PI/5)]);
  }
  // construct tiles information
  console.log("* compute tiles information as multigrid dual");
  let tiles_info = dual2(penrose_dir,penrose_shift,size);
  console.log("  "+tiles_info.length+" tiles");
  // crop to the projection of the hypercude +-size^5
  console.log("* crop to the projection of the hypercube +-size^5");
  let tiles_info_croped = cropn(tiles_info,size);
  console.log("  "+tiles_info_croped.length+" tiles");
  // construct tiles
  console.log("* compute 2d tiles");
  let tiles = draw2(penrose_draw,tiles_info_croped);
  // find neighbors with findNeighbors from SubstitutionAPI
  console.log("* find neighbors (using findNeighbors from SubstitutionAPI)");
  resetAllNeighbors(tiles);
  let tilesdict = new Map(tiles.map(i => [id2key(i.id), i]));
  let neighbors2bounds = new Map();
  for(let t of combinations(Array.from(Array(5).keys()),2)){
    neighbors2bounds.set(id2key(t),default_neighbors2bounds(4));
  }
  let fn=findNeighbors(tiles,tilesdict,neighbors2bounds);
  console.log("  found "+fn);
  // decorate tiles
  console.log("* decorate tiles");
  let idkey_colored = [[0,1],[1,2],[2,3],[3,4],[0,4]].map(t => id2key(t));
  tiles.forEach(tile => {
    if(idkey_colored.includes(tile.id[0])){
      tile.sand=1;
    }
  });
  // done
  console.log("done");
  return new Tiling(tiles);
}

// [5.2] Ammann-Beenker
Tiling.AmmannBeenkerCutandproject = function({size}={}){
  console.log("Generating Ammann-Beenker cut and project via multigrid...");
  let a=Math.sqrt(2);
  // use grassmannian coordinates
  // for each line: 2 coordinates of normal vector, shift, number of lines
  console.log("* set directions and shift");
  let ab_dir = generators_to_grid([[-1,0,1,a],[0,1,a,1]]);
  let ab_shift = [1/2,1/2,1/2,1/2];
  let ab_draw = ab_dir;
  // construct tiles information
  console.log("* compute tiles information as multigrid dual");
  let tiles_info = dual2(ab_dir,ab_shift,size);
  console.log("  "+tiles_info.length+" tiles");
  // crop to the projection of the hypercude +-size^4
  console.log("* crop to the projection of the hypercube +-size^4");
  let tiles_info_croped = cropn(tiles_info,size);
  console.log("  "+tiles_info_croped.length+" tiles");
  // construct tiles
  console.log("* compute 2d tiles");
  let tiles = draw2(ab_draw,tiles_info_croped);
  // find neighbors with findNeighbors from SubstitutionAPI
  console.log("* find neighbors (using findNeighbors from SubstitutionAPI)");
  resetAllNeighbors(tiles);
  let tilesdict = new Map(tiles.map(i => [id2key(i.id), i]));
  let neighbors2bounds = new Map();
  for(let t of combinations(Array.from(Array(4).keys()),2)){
    neighbors2bounds.set(id2key(t),default_neighbors2bounds(4));
  }
  let fn=findNeighbors(tiles,tilesdict,neighbors2bounds);
  console.log("  found "+fn);
  // decorate tiles
  console.log("* decorate tiles");
  let idkey_colored = [[0,2],[1,3]].map(t => id2key(t));
  tiles.forEach(tile => {
    if(idkey_colored.includes(tile.id[0])){
      tile.sand=1;
    }
  });
  // done
  console.log("done");
  return new Tiling(tiles);
}

// [5.3] 12-fold
Tiling.TwelveFoldCutandproject = function({size}={}){
  console.log("Generating 12-fold cut and project via multigrid...");
  let b=Math.sqrt(3);
  // use grassmannian coordinates
  // for each line: 2 coordinates of normal vector, shift, number of lines
  console.log("* set directions and shift");
  let tf_dir = generators_to_grid([[2,b,1,0,-1,-b],[0,1,b,2,b,1]]);
  let tf_shift = [1/3,1/3,1/3,1/3,1/3,1/3];
  let tf_draw = tf_dir;
  // construct tiles information
  console.log("* compute tiles information as multigrid dual");
  let tiles_info = dual2(tf_dir,tf_shift,size);
  console.log("  "+tiles_info.length+" tiles");
  // crop to the projection of the hypercude +-size^6
  console.log("* crop to the projection of the hypercube +-size^6");
  let tiles_info_croped = cropn(tiles_info,size);
  console.log("  "+tiles_info_croped.length+" tiles");
  // construct tiles
  console.log("* compute 2d tiles");
  let tiles = draw2(tf_draw,tiles_info_croped);
  // find neighbors with findNeighbors from SubstitutionAPI
  console.log("* find neighbors (using findNeighbors from SubstitutionAPI)");
  resetAllNeighbors(tiles);
  let tilesdict = new Map(tiles.map(i => [id2key(i.id), i]));
  let neighbors2bounds = new Map();
  for(let t of combinations(Array.from(Array(6).keys()),2)){
    neighbors2bounds.set(id2key(t),default_neighbors2bounds(4));
  }
  let fn=findNeighbors(tiles,tilesdict,neighbors2bounds);
  console.log("  found "+fn);
  // decorate tiles
  console.log("* decorate tiles");
  let idkey_colored1 = [[0,2],[1,3],[2,4],[3,5],[0,4],[1,5]].map(t => id2key(t));
  let idkey_colored2 = [[0,3],[1,4],[2,5]].map(t => id2key(t));
  tiles.forEach(tile => {
    if(idkey_colored1.includes(tile.id[0])){
      tile.sand=1;
    }
    else if(idkey_colored2.includes(tile.id[0])){
      tile.sand=2;
    }
  });
  // done
  console.log("done");
  return new Tiling(tiles);
}

// [5.4] Golden octogonal
Tiling.GoldenOctogonalCutandproject = function({size}={}){
  console.log("Generating Golden octogonal cut and project via multigrid...");  
  let phi=(1+Math.sqrt(5))/2;
  // use grassmannian coordinates
  // for each line: 2 coordinates of normal vector, shift, number of lines
  console.log("* set directions and shift");
  let go_dir = generators_to_grid([[-1,0,phi,phi],[0,1,phi,1]]);
  let go_shift = [];
  for(let i=0; i<4; i++){
    go_shift.push(Math.random());
  }
  let go_draw = go_dir;
  // construct tiles information
  console.log("* compute tiles information as multigrid dual");
  let tiles_info = dual2(go_dir,go_shift,size);
  console.log("  "+tiles_info.length+" tiles");
  // crop to the projection of the hypercude +-size^4
  console.log("* crop to the projection of the hypercube +-size^4");
  let tiles_info_croped = cropn(tiles_info,size);
  console.log("  "+tiles_info_croped.length+" tiles");
  // construct tiles
  console.log("* compute 2d tiles");
  let tiles = draw2(go_draw,tiles_info_croped);
  // find neighbors with findNeighbors from SubstitutionAPI
  console.log("* find neighbors (using findNeighbors from SubstitutionAPI)");
  resetAllNeighbors(tiles);
  let tilesdict = new Map(tiles.map(i => [id2key(i.id), i]));
  let neighbors2bounds = new Map();
  for(let t of combinations(Array.from(Array(4).keys()),2)){
    neighbors2bounds.set(id2key(t),default_neighbors2bounds(4));
  }
  let fn=findNeighbors(tiles,tilesdict,neighbors2bounds);
  console.log("  found "+fn);
  // decorate tiles
  console.log("* decorate tiles");
  let idkey_colored1 = [[0,2],[1,3]].map(t => id2key(t));
  let idkey_colored2 = [[1,2]].map(t => id2key(t));
  tiles.forEach(tile => {
    if(idkey_colored1.includes(tile.id[0])){
      tile.sand=1;
    }
    else if(idkey_colored2.includes(tile.id[0])){
      tile.sand=2;
    }
  });
  // done
  console.log("done");
  return new Tiling(tiles);
}

// [5.5] Rauzy
Tiling.RauzyCutandproject = function({size}={}){
  console.log("Generating Rauzy cut and project via multigrid...");  
  let c=1.839286755214161; // the unique real root of x^3-x^2-x-1
  // use grassmannian coordinates
  // for each line: 2 coordinates of normal vector, shift, number of lines
  console.log("* set directions and shift");

  // BUG: the line below gives an inexact result, maybe from the approximation on c?
  //let rauzy_dir = generators_to_grid([[c-1,-1,0],[c^2-c-1,0,-1]]);
  // PATCH: obtained from sagemath <3
  let rauzy_dir=[[ 0.6428717165532278, 0.2944757308436576],
                 [-0.7659738612093146, 0.2471495806290921],
                 [ 0,                 -0.9231474035813336]];

  console.log(rauzy_dir);
  let rauzy_shift = [];
  for(let i=0; i<3; i++){
    rauzy_shift.push(Math.random());
  }
  let rauzy_draw = rauzy_dir;
  // construct tiles information
  console.log("* compute tiles information as multigrid dual");
  let tiles_info = dual2(rauzy_dir,rauzy_shift,size);
  console.log("  "+tiles_info.length+" tiles");
  // crop to the projection of the hypercude +-size^3
  console.log("* crop to the projection of the hypercube +-size^3");
  let tiles_info_croped = cropn(tiles_info,size);
  console.log("  "+tiles_info_croped.length+" tiles");
  // construct tiles
  console.log("* compute 2d tiles");
  let tiles = draw2(rauzy_draw,tiles_info_croped);
  // find neighbors with findNeighbors from SubstitutionAPI
  console.log("* find neighbors (using findNeighbors from SubstitutionAPI)");
  resetAllNeighbors(tiles);
  let tilesdict = new Map(tiles.map(i => [id2key(i.id), i]));
  let neighbors2bounds = new Map();
  for(let t of combinations(Array.from(Array(3).keys()),2)){
    neighbors2bounds.set(id2key(t),default_neighbors2bounds(4));
  }
  let fn=findNeighbors(tiles,tilesdict,neighbors2bounds);
  console.log("  found "+fn);
  // decorate tiles
  console.log("* decorate tiles");
  let idkey_colored1 = [[0,1]].map(t => id2key(t));
  let idkey_colored2 = [[1,2]].map(t => id2key(t));
  tiles.forEach(tile => {
    if(idkey_colored1.includes(tile.id[0])){
      tile.sand=1;
    }
    else if(idkey_colored2.includes(tile.id[0])){
      tile.sand=2;
    }
  });
  // done
  console.log("done");
  return new Tiling(tiles);
}

