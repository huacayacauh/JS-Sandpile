// This code is part of JS-Sandpile (https://github.com/huacayacauh/JS-Sandpile/)
// CC-BY Valentin Darrigo, Jeremy Fersula, Kevin Perrot

// TriTriangle
// substitution described at
// https://tilings.math.uni-bielefeld.de/substitution/tritriangle/
// https://sites.math.washington.edu/wxml/tilings/pdfs/TriTriangle-tiling.pdf
// https://sites.math.washington.edu/wxml/tilings/source/Tritriangle.py

//
// [1] define tile types TT
//

function pushVector(array, vector) {
  array.push(vector.x, vector.y);
}

function triangleVectorsToBounds(v1, v2, v3) {
  var bounds = [];
  pushVector(bounds, v1);
  pushVector(bounds, v2);
  pushVector(bounds, v3);
  return bounds;
}

function getTriBounds(size) {
  var bounds = [];
  bounds.push(0, 0);
  bounds.push(size, 0);
  bounds.push(size, size);
  return bounds;
}
var triA0 = new Tile(["triangle0"], [], getTriBounds(1), 3);
//var triA1 = new Tile(["triangle1"], [], getTriBounds(1), 3);
//var triA2 = new Tile(["triangle2"], [], getTriBounds(1), 3);

Tile.prototype.tri0to1 = function() {
  this.id[0] = "triangle1";
};
Tile.prototype.tri1to2 = function() {
  this.id[0] = "triangle2";
};
Tile.prototype.tri2to0 = function() {
  this.id[0] = "triangle0";
};

//
// [2] define substitution TT
//
function substitutionTT(tile) {
  console.log("substitutionTT: ", tile.id);
  switch (tile.id[0]) {
    case "triangle0":
      /*var newtiles = [];
      
      var new_tri1 = tile.myclone();
      new_tri1.tri0to1();
      new_tri1.id.push("fils_0to1");
      newtiles.push(new_tri1);
      
      return newtiles;*/
      tile.tri0to1();
      tile.id.push("fils_0to1");
      return tile;
      break;
    case "triangle1":
      /*var newtiles = [];
      
      var new_tri2 = tile.myclone();
      new_tri2.tri1to2();
      new_tri2.id.push("fils_1to2");
      newtiles.push(new_tri2);
      
      return newtiles;*/
      tile.tri1to2();
      tile.id.push("fils_1to2");
      return tile;
      break;
    case "triangle2":
      var newtiles = [];
      
      var A = new THREE.Vector2(tile.bounds[0], tile.bounds[1]);
      var B = new THREE.Vector2(tile.bounds[2], tile.bounds[3]);
      var C = new THREE.Vector2(tile.bounds[4], tile.bounds[5]);
      var AB_center = ((new THREE.Vector2()).addVectors(A, B)).divideScalar(2);
      var AC_center = ((new THREE.Vector2()).addVectors(A, C)).divideScalar(2);
      var BC_center = ((new THREE.Vector2()).addVectors(B, C)).divideScalar(2);
      var AC_quarter = ((((new THREE.Vector2()).add(A)).multiplyScalar(3)).add(C)).divideScalar(4);
      var ABC_center = ((new THREE.Vector2()).addVectors(AC_center, B)).divideScalar(2);
      
      var new_tri2 = tile.myclone();
      new_tri2.bounds = triangleVectorsToBounds(C, AC_center, B);
      new_tri2.id.push("fils0");
      new_tri2.sand = 0;
      newtiles.push(new_tri2);
      
      var new_tri0_0 = tile.myclone();
      new_tri0_0.tri2to0();
      new_tri0_0.id.push("fils1");
      new_tri0_0.bounds = triangleVectorsToBounds(AB_center, AC_quarter, A);
      new_tri0_0.sand = 1;
      console.log(new_tri0_0);
      newtiles.push(new_tri0_0);

      var new_tri0_1 = tile.myclone();
      new_tri0_1.tri2to0();
      new_tri0_1.id.push("fils2");
      new_tri0_1.bounds = triangleVectorsToBounds(B, ABC_center, AB_center);
      new_tri0_1.sand = 2;
      newtiles.push(new_tri0_1);
      
      var new_tri0_2 = tile.myclone();
      new_tri0_2.tri2to0();
      new_tri0_2.id.push("fils3");
      new_tri0_2.bounds = triangleVectorsToBounds(AC_center, AC_quarter, AB_center);
      new_tri0_2.sand = 3;
      newtiles.push(new_tri0_2);
      
      var new_tri0_3 = tile.myclone();
      new_tri0_3.tri2to0();
      new_tri0_3.id.push("fils4");
      new_tri0_3.bounds = triangleVectorsToBounds(AC_center, ABC_center, AB_center);
      new_tri0_3.sand = 4;
      newtiles.push(new_tri0_3);
      
      /*
      function getType(A, B, C) {
          if (A.x = C.x && A.y > C.y) {
              if (A.x > B.x)
                return 0;
              else
                return 1;
          else if (A.x > C.x) {
              if (Math.max(A.y, C.y) < B.y)
                return 0;
              else
                return 1;
          } else {
              if ((A.y, C.y)/2 > B.y)
                return 0;
              else
                return 1;
          }
      }
      console.log(getType(AC_center, AC_quarter, AB_center));
      console.log(getType(AC_center, ABC_center, AB_center));
      */
      
      return newtiles;
      break;
    default:
      console.log("caution: undefined tile type for substitutionTT, id = " + tile.id);
  }
}

//
// [3] no duplicated tiles
// [4] I am lazy
//

//
// [6] use default neighbors2bounds
//

var neighbors2boundsTT = new Map();
neighbors2boundsTT.set("triangle0", default_neighbors2bounds(3));
neighbors2boundsTT.set("triangle1", default_neighbors2bounds(3));
neighbors2boundsTT.set("triangle2", default_neighbors2bounds(3));

//
// [7] construct base tilings and call substitute
//

Tiling.TriTriangleBySubst = function({iterations}={}) {
  var tiles = [];
  var my_tri = triA0.myclone();
  tiles.push(my_tri);
  tiles = substitute(
    iterations,
    tiles,
    Math.sqrt(2),
    substitutionTT,
    [], // no duplicated tiles
    [], // no duplicated tiles
    "laziness", // myneighbors
    neighbors2boundsTT,
    false//decorateTT
  );
  return new Tiling(tiles);
};