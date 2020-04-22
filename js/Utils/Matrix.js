// This code is part of JS-Sandpile (https://github.com/huacayacauh/JS-Sandpile/)
// CC-BY Valentin Darrigo, Jeremy Fersula, Kevin Perrot

//
// [0] Standard matrix/vector operations
// A matrix is an Array of Array
//

// 
// [1] Matrix operations
//

//
// [1.1]  Gram-Schmidt
// return [Q,R] the Gram-Schmidt orthogonalization of M
// (numerically stable version from page 58 of "Numerical Linear Algebra" by Trefethen and Bau)
//
function matrix_GramSchmidt(M){
  let n = M.length;
  // caution: M is expected to be a square matrix
  M.forEach(e => {if(e.length!=n){
    console.log("error: matrix_GramSchmidt expects a square matrix ("+n+" times "+e.length+" given).");
    return M;
  }});
  // start
  var V = [];
  var Q = [];
  var R = [];
  // loop i from 0 to n-1
  for(let i=0; i<n; i++) {
    // vi = ai
    V.push(JSON.parse(JSON.stringify(M[i])));
  }
  // loop i from 0 to n-1
  for(let i=0; i<n; i++) {
    // rii = ||vi||
    let rii = vector_norm(V[i]);
    if(rii == 0){
      console.log("error: matrix_GramSchmidt found row of norm 0.");
      return M;
    }
    // qi = vi / rii
    Q.push(V[i].map(e => e/rii));
    // init first elements of ri
    let ri = new Array(i).fill(0);
    ri.push(rii);
    // loop j from i+1 to n-1
    for(let j=i+1; j<n; j++){
      // rij = qi* vj
      let rij = vector_dot(Q[i],V[j]);
      ri.push(rij);
      // vj = vj - rij qi
      V[j] = vector_sub(V[j],vector_mult(rij,Q[i]));
    }
    // ri complete
    R.push(ri);
  }
  // wrap the result
  return [Q,R];
}

// [1.3] return the determinent of M
function matrix_det(M){
  // check if this is a square matrix
  if(M.length!=M[0].length){
    console.log("error: matrix_det works only one square matrices, "+M.length+" times "+M[0].length+" given.");
    return M;
  }
  // start
  // source Yevgen Gorbunkov: https://stackoverflow.com/a/57696101
  return M.length == 1 ? M[0][0] : M.length == 2 ? M[0][0]*M[1][1]-M[0][1]*M[1][0] : M[0].reduce((r,e,i) => r+(-1)**(i+2)*e*matrix_det(M.slice(1).map(c => c.filter((_,j) => i != j))),0);
}

// [1.3] return the inverse of M
function matrix_inverse(M){
  // check if this is a non-singular square matrix
  if(M.length!=M[0].length){
    console.log("error: matrix_inverse works only one square matrices, "+M.length+" times "+M[0].length+" given.");
    return M;
  }
  if(matrix_det(M)==0){
    console.log("error: matrix_inverse works only on non-singular matrices.");
    return M;
  }
  // start
  // source Andrew Ippoliti: http://blog.acipo.com/matrix-inversion-in-javascript/
  var i=0, ii=0, j=0, dim=M.length, e=0, t=0;
  var I = [], C = [];
  for(i=0; i<dim; i+=1){
    I[I.length]=[];
    C[C.length]=[];
    for(j=0; j<dim; j+=1){
      if(i==j){ I[i][j] = 1; }
      else{ I[i][j] = 0; }
      C[i][j] = M[i][j];
    }
  }
  for(i=0; i<dim; i+=1){
    e = C[i][i];
    if(e==0){
      for(ii=i+1; ii<dim; ii+=1){
        if(C[ii][i] != 0){
          for(j=0; j<dim; j++){
            e = C[i][j];
            C[i][j] = C[ii][j];
            C[ii][j] = e;
            e = I[i][j];
            I[i][j] = I[ii][j];
            I[ii][j] = e;
          }
          break;
        }
      }
      e = C[i][i];
      if(e==0){return}
    }
    for(j=0; j<dim; j++){
      C[i][j] = C[i][j]/e;
      I[i][j] = I[i][j]/e;
    }
    for(ii=0; ii<dim; ii++){
      if(ii==i){continue;}
      e = C[ii][i];
      for(j=0; j<dim; j++){
        C[ii][j] -= e*C[i][j];
        I[ii][j] -= e*I[i][j];
      }
    }
  }
  return I;
}

// [1.4] return the matrix M (Array of Array) croped to rows indices given by r (Array)
function matrix_from_rows(M,r){
  let rows = [];
  for(let i of r){
    rows.push(JSON.parse(JSON.stringify(M[i])));
  }
  return rows;
}

// [1.5] return the matrix M (Array of Array)
// multiplied by vector V (Array)
function matrix_mult_vector(M,V){
  // check lengths
  if(M[0].length!=V.length){
    console.log("error: matrix_mult_vector cannot multiply an "+M.length+" times "+M[0].length+" matrix by a vectors of size "+V.length+".");
    return M;
  }
  // start
  let mult = Array(M.length).fill(0);
  for(let i=0; i<M.length; i++){
    for(let j=0; j<V.length; j++){
      mult[i] += M[i][j]*V[j];
    }
  }
  return mult;
}

// [1.6] return the vector V (Array)
// multiplied by matrix M (Array of Array)
function vector_mult_matrix(V,M){
  // check lengths
  if(M.length!=V.length){
    console.log("error: vector_mult_matrix cannot multiply a vectors of size "+V.length+" by an "+M.length+" times "+M[0].length+" matrix.");
    return M;
  }
  // start
  let mult = Array(M[0].length).fill(0);
  for(let i=0; i<M[0].length; i++){
    for(let j=0; j<V.length; j++){
      mult[i] += V[j]*M[j][i];
    }
  }
  return mult;
}


//
// [2] vector operations
//

// [2.1] return the Euclidean norm of V
function vector_norm(V){
  var sum2 = 0;
  V.forEach(e => sum2 += e*e);
  return Math.sqrt(sum2);
}

// [2.2] return the dot product of V1 and V2
function vector_dot(V1,V2){
  // check lengths
  if(V1.length!=V2.length){
    console.log("error: vector_dot cannot make dot product of two vectors having different lengths "+V1+" "+V2);
    return 0;
  }
  // start
  var dot = 0;
  for(let i=0; i<V1.length; i++){
    dot += V1[i]*V2[i];
  }
  return dot;
}

// [2.3] return V1 + V2
function vector_add(V1,V2){
  // check lengths
  if(V1.length!=V2.length){
    console.log("error: vector_add cannot add two vectors having different lengths "+V1+" "+V2);
    return 0;
  }
  // start
  var add = [];
  for(let i=0; i<V1.length; i++){
    add.push(V1[i]+V2[i]);
  }
  return add;
}

// [2.4] return V1 - V2
function vector_sub(V1,V2){
  // check lengths
  if(V1.length!=V2.length){
    console.log("error: vector_sub cannot subtract two vectors having different lengths "+V1+" "+V2);
    return 0;
  }
  // start
  var sub = [];
  for(let i=0; i<V1.length; i++){
    sub.push(V1[i]-V2[i]);
  }
  return sub;
}

// [2.5] return V multiplied by scalar s
function vector_mult(s,V){
  return V.map(e => s * e);
}

