// This code is part of JS-Sandpile (https://github.com/huacayacauh/JS-Sandpile/)
// CC-BY Valentin Darrigo, Jeremy Fersula, Kevin Perrot

//
// [0] Combinatorics stuff
//
 
// [1] Cartesian product of an Array of Array
function cartesian_product(arr){
  // source: https://stackoverflow.com/a/36234242
  return arr.reduce(function(a,b){
    return a.map(function(x){
      return b.map(function(y){
        return x.concat([y]);
      })
    }).reduce(function(a,b){ return a.concat(b) },[])
  }, [[]]);
}

// [2] Combinations (no order) of k items among an Array N
function combinations(N,k){
  // source: https://github.com/trekhleb/javascript-algorithms/blob/master/src/algorithms/sets/combinations/combineWithoutRepetitions.js
  if (k === 1) {
    return N.map(n => [n]);
  }
  const combos = [];
  N.forEach((n, i) => {
    const scombos = combinations(N.slice(i+1),k-1);
    scombos.forEach((sc) => {
      combos.push([n].concat(sc));
    });
  });
  return combos;
}

