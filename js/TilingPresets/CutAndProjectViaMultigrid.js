// This code is part of JS-Sandpile (https://github.com/huacayacauh/JS-Sandpile/)
// CC-BY Valentin Darrigo, Jeremy Fersula, Kevin Perrot

//
// [0]
// Implementation of "Cut and Project" tiling generation via "Mutligrids"
// based on a python/sagemath code by Thomas Fernique, many thanks to him :-)
// TODO: add neighbors computation during tile creation instead of calling findNeighbors
//

// note that function id2key(a) is defined in SubstitutionAPI.js as return JSON.stringify(a);

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
      newline.push(round_to_zero(H[j][i]/vector_norm(H[j])));
    }
    I.push(newline);
  }
  return I;
}
// due to the high sensibility of the inverse function to zero VS non-zero (even if very small) values we have had to add a round to zero function that rounds to zero the values below some precision
function round_to_zero(x) {
  precision = 1e-14;
  if (Math.abs(x) < precision) {
    return 0;
  } else {
    return x;
  }
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
      let q = JSON.parse(JSON.stringify(tile[1])); // q = coordinate of the vertices in RR^n
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
// Crop tiling (as tiles_info), three available methods for cropping
//    maxCoord : keep only tiles whose maximum abs value of the coordinates of the vertices is at most k
//    sumCoord : keep only tiles whose maximum sum of the abs value of the coordinates of the vertices is at most k
//    euclideanNorm : keep only tiles whose maximum euclidean norm of the vertices is at most k
function cropn(tiles_info,k, crop_method = "maxCoord"){
  tiles_info_croped = [];
  switch( crop_method)
  {
    case "maxCoord":
      for(let tile of tiles_info){
        let pos = tile[1];
        let m_abs = 0; // max absolute value
        // compute the maximum absolute values of the coordinates of the position of the tile
        for (let i=0; i< pos.length; i++) {
          m_abs = Math.max(m_abs, Math.abs(pos[i]));
        }
        // compute the absolute value of the other coordinates of the other vertices of the tiles
        // note that we simply have to compute the coordinates that differ from the original position, not the maximum again
        let modifier_10 = Math.abs(pos[tile[0][0]] + 1);
        let modifier_01 = Math.abs(pos[tile[0][1]] + 1);
        // compute the max of these
        let m_abs_vertices = Math.max(m_abs, modifier_01, modifier_10);
        if(m_abs_vertices <= k){
          tiles_info_croped.push(tile);
        }
      }
    break;

    case "sumCoord":
      for(let tile of tiles_info){
        let sum_coord = 0;
        let pos = tile[1];
        // compute the sum of the absolute values of coordinates of the position of the tile
        for (let i=0; i<pos.length; i++){
          sum_coord += Math.abs(pos[i]);
        }
        // compute the sum of the coordinates of the other vertices of the tiles
        //    first we compute modifiers corresponding to the two edge directions of the tiles
        let modifier_10 = Math.abs(pos[tile[0][0]]+1) - Math.abs(pos[tile[0][0]]);
        let modifier_01 = Math.abs(pos[tile[0][1]]+1) - Math.abs(pos[tile[0][1]]);
        //    then we compute the other sums
        let sum_coord_01 = sum_coord + modifier_01;
        let sum_coord_11 = sum_coord + modifier_01 + modifier_10;
        let sum_coord_10 = sum_coord + modifier_10;
        //    finaly take the max
        let max_sum_coord = Math.max(sum_coord, sum_coord_01, sum_coord_11, sum_coord_10);
        if (max_sum_coord <= k){
          tiles_info_croped.push(tile);
        }
      }
    break;

    case "euclideanNorm":
      for(let tile of tiles_info){
        let sum_square = 0;
        let pos = tile[1];
        // compute the sum of the square of the coordinates of the position of the tile
        for (let i=0; i<pos.length; i++){
          sum_square += Math.pow(pos[i],2);
        }
        // compute the sum of the square of the coordinates for the other vertices of the tile
        //     first compute modifiers corresponding to the two edge directions of the tile
        let modifier_10 = Math.pow(pos[tile[0][0]]+1, 2) - Math.pow(pos[tile[0][0]],2);
        let modifier_01 = Math.pow(pos[tile[0][1]]+1, 2) - Math.pow(pos[tile[0][1]],2);
        //     use the modifiers to compute the new sums
        let sum_square_01 = sum_square + modifier_01;
        let sum_square_11 = sum_square + modifier_01 + modifier_10;
        let sum_square_10 = sum_square + modifier_10;
        //     compute the square root of the maximum sum to obtain the maximum euclidean norm
        max_euclidean_norm = Math.sqrt(Math.max(sum_square, sum_square_01, sum_square_11, sum_square_10));
        if (max_euclidean_norm <= k){
          tiles_info_croped.push(tile);
        }
      }
    break;

    default:
      console.log("Crop method not implemented");
    break;

  }
  return tiles_info_croped;
}

// compute the maximum absolute value of the coordinates of the vertices of the tiles in RR^n
function max_abs_coord_vertices_rn(tile){
  let pos = tile[1];
  let m_abs = 0; // max absolute value
  for (let i=0; i< pos.length; i++) {
    m_abs = Math.max(m_abs, Math.abs(pos[i]));
  }
  for (let a of[[0,0],[0,1],[1,1],[1,0]]) {
    m_abs = Math.max(m_abs, Math.abs(pos[tile[0][0]]+a[0]));
    m_abs = Math.max(m_abs, Math.abs(pos[tile[0][1]]+a[1]));
  }
  return m_abs
}

//
// [5] Cut and project tilings :
// * Penrose,
// * Ammann-Beenker,
// * 12-fold,
// * n-fold_simple,
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
  let tf_shift = [1/2,1/2,1/2,1/2,1/2,1/2];
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

// [5.4] n-fold simple : computes a tiling with global n-fold rotational symmetry
Tiling.nfold_simple = function({size, order, cropMethod}={}){
  console.log("Generating a simple multigrid tiling with global n-fold rotational symmetry");
  // if the order n is odd we compute the n-fold multigrid with offset 1/n, othewise we compute the n/2-fold multigrid with offset 1/2
  order = parseInt(order);
  console.log("Crop method : "+ cropMethod);
  if (order % 2 == 1){
    dim = order;
    offset = 1 / dim;
    theta = 2 * Math.PI / order;
  }
  else {
    dim = order / 2;
    offset = 1 / 2 ;
    theta = 2 * Math.PI / order;
  }
  console.log("dim : "+dim+" ; offset: "+offset+" ; theta : "+theta);
  console.log("* set directions and shift *");
  dir_one = [];
  dir_two = [];
  //nfold_draw = [];
  for (let i = 0; i< dim; i++){
    dir_one.push(Math.cos(i*theta));
    dir_two.push(Math.sin(i*theta));
    //nfold_draw.push([Math.cos(i*theta), Math.sin(i*theta)]);
  }
  let nfold_dir = generators_to_grid([dir_one, dir_two]);
  let nfold_shift = Array(dim).fill(offset);
  let nfold_draw = nfold_dir;
  //construct tiles information
  console.log("* compute tiles inforamtion as multigrid dual*");
  let tiles_info = dual2(nfold_dir, nfold_shift, size);
  console.log(" "+tiles_info.length+" tiles");
  // crop to the hypercupe size^n
  let tiles_info_croped = cropn(tiles_info, size, cropMethod);
  console.log(" "+tiles_info_croped.length+" tiles");
  console.log("* compute 2d tiles *");
  let tiles = draw2(nfold_draw, tiles_info_croped);
  // find neighbors with findNeighbors from SubstitutionAPI
  console.log("* find neighbors (using findNeighbors from SubstitutionAPI)");
  resetAllNeighbors(tiles);
  let tilesdict = new Map(tiles.map(i => [id2key(i.id), i]));
  let neighbors2bounds = new Map();
  for(let t of combinations(Array.from(Array(dim).keys()),2)){
    neighbors2bounds.set(id2key(t),default_neighbors2bounds(4));
  }
  let fn=findNeighbors(tiles,tilesdict,neighbors2bounds);
  console.log("  found "+fn);
  // decorate tiles
  console.log("* decorate tiles");
  let nb_losanges = Math.floor(dim/2);
  let nb_losanges_color = Math.min(nb_losanges, 4);
  let color_dict = {} ;
  // we have to differentiate depending on the parity of the dimension
  // indeed depending on the parity of the dimension a tile of directing vectors [0,1] is not necessarily a tile with angle pi/dimension
  if (dim % 2 == 0){
    for (let k = 0; k<nb_losanges_color; k++){
      for (let i = 0; i<dim; i++) {
        j = (i+k+1)%dim;
        color_dict[id2key([Math.min(i,j),Math.max(i,j)])] = nb_losanges_color - 1 - k ;
      }
    }
  } else {
    for (let k = 0; k<nb_losanges_color; k++){
      for (let i = 0; i<dim; i++) {
        j = (i+ (k+1)*((dim+1)/2))%dim;
        color_dict[id2key([Math.min(i,j),Math.max(i,j)])] = nb_losanges_color - 1 - k ;
      }
    }
  }
  tiles.forEach( tile => {
    let tile_color = color_dict[tile.id[0]];
    if (tile_color == undefined) {
      tile.sand = 0;
    } else {
      tile.sand = parseInt(tile_color);
    }
  });
  console.log("done");
  return new Tiling(tiles);
}


// [5.5] Golden octogonal
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

// [5.6] Rauzy
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

