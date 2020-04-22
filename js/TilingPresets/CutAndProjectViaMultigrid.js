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
// Returns the list of elements [[i,j],[k1,k2,...,kp]]
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
// Crop tiling (as tiles_info) in order to keep only tiles living
// within the hypercube +-xmax^n
function cropn(tiles_info,xmax){
  tiles_info_croped = [];
  for(let tile of tiles_info){
    let outside = tile[1].filter(coord => Math.abs(coord)>xmax);
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
// * golden octagonal,
// * 12-fold,
// * Rauzy
//

// [5.1] Penrose
Tiling.Penrosecutandproject = function({size}={}){
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
  let neighbors2boundsPenrose = new Map();
  for(let t of combinations(Array.from(Array(5).keys()),2)){
    neighbors2boundsPenrose.set(id2key(t),default_neighbors2bounds(4));
  }
  let fn=findNeighbors(tiles,tilesdict,neighbors2boundsPenrose);
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

//TODO

//# définit la couleur d'un losange de côtés vi et vj
//#def couleur(i,j): return '#9999ff' if (i,j) in [(0,1),(0,2),(1,3),(2,3)] else '#ffffff'
//
//# carrés bleus, losanges blancs
//#def couleur(i,j): return '#ffffff' if (i,j) in [(0,1),(1,2),(2,3),(0,3)] else '#9999ff'
//
//# dodeca
//#def couleur(i,j): return '#9999ff' if (i,j) in [(0,2),(1,3),(2,4),(3,5),(0,4),(1,5)] else '#ffffff'
//
//# rauzy
//#couleur=lambda i,j: '#9999ff' if (i,j)==(0,1) else '#ccccff' if (i,j)==(1,2) else '#ffffff'
//

//# golden octagonal
//o=AA((1+sqrt(5))/2)
//golden_dir=generators_to_grid([[-1,0,o,o],[0,1,o,1]])
//golden_shift=[random() for i in range(4)]
//
//# beenker
//a=AA(sqrt(2))
//beenker_dir=generators_to_grid([[-1,0,1,a],[0,1,a,1]])
//beenker_shift=[0.5,0.5,0.5,0.5]
//
//# 12-fold
//o=AA(sqrt(3))
//dodeca_dir=generators_to_grid([[2,o,1,0,-1,-o],[0,1,o,2,o,1]])
//dodeca_shift=[1/3,1/3,1/3,1/3,1/3,1/3]
//
//# Rauzy
//a=PolynomialRing(QQ,x)(x^3-x^2-x-1).roots(AA)[0][0]
//rauzy_dir=generators_to_grid([[a-1,-1,0],[a^2-a-1,0,-1]])
//rauzy_shift=[random() for i in range(3)]
//
