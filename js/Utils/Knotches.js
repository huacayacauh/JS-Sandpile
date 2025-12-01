// This code is part of JS-Sandpile (https://github.com/huacayacauh/JS-Sandpile/)
// CC-BY Valentin Darrigo, Jeremy Fersula, Kevin Perrot

var sqrttwo = 1.41421

// create a knotch from ("x","y") to ("xx","yy")
// centered at fraction "place" of the segment
// of width "width" (again a fraction of the segment)
// return a list of bounds, excluding [x,y]

// knotch1 male/female on (x,y)--(xx,yy) with fractions
function knotchClawM(x,y,xx,yy,place,width){
  let bounds = [];
  let startx = 0;
  let starty = 0;
  [startx,starty] = scalePoint(xx,yy,x,y,place-width/2);
  let endx = 0;
  let endy = 0;
  [endx,endy] = scalePoint(xx,yy,x,y,place+width/2);
  bounds.push(...knotchClaw(startx,starty,endx,endy));
  bounds.push(xx,yy);
  return bounds;
}
function knotchClawF(x,y,xx,yy,place,width){
  let bounds = [];
  let startx = 0;
  let starty = 0;
  [startx,starty] = scalePoint(xx,yy,x,y,(1-place)-width/2);
  let endx = 0;
  let endy = 0;
  [endx,endy] = scalePoint(xx,yy,x,y,(1-place)+width/2);
  bounds.push(...knotchClaw(startx,starty,endx,endy));
  bounds.push(xx,yy);
  return bounds;
}

// knotch1 alone (returned array includes x,y,xx,yy)
function knotchClaw(x,y,xx,yy){
  let bounds = [];
  let A=[x,y];
  let H=[xx,yy];
  let B=rotatePoint(...H,...A,Math.PI/2);
  let C=rotatePoint(...A,...B,Math.PI/2);
  let D=scalePoint(...C,...A,1/2);
  let G=rotatePoint(...A,...H,Math.PI/2);
  let F=rotatePoint(...H,...G,Math.PI/2);
  let E=scalePoint(...F,...H,1/2);
  bounds.push(...A,...B,...C,...D,...E,...F,...G,...H);
  return bounds;
}

// knotch2 male/female on (x,y)--(xx,yy) with fractions
function knotchTrapezoidM(x,y,xx,yy,place,width){
  let bounds = [];
  let startx = 0;
  let starty = 0;
  [startx,starty] = scalePoint(xx,yy,x,y,place-width/2);
  let endx = 0;
  let endy = 0;
  [endx,endy] = scalePoint(xx,yy,x,y,place+width/2);
  bounds.push(...knotchTrapezoid(startx,starty,endx,endy));
  bounds.push(xx,yy);
  return bounds;
}
function knotchTrapezoidF(x,y,xx,yy,place,width){
  let bounds = [];
  let startx = 0;
  let starty = 0;
  [startx,starty] = scalePoint(xx,yy,x,y,(1-place)-width/2);
  let endx = 0;
  let endy = 0;
  [endx,endy] = scalePoint(xx,yy,x,y,(1-place)+width/2);
  bounds.push(...knotchTrapezoid(startx,starty,endx,endy));
  bounds.push(xx,yy);
  return bounds;
}

// knotch2 alone (returned array includes x,y,xx,yy)
function knotchTrapezoid(x,y,xx,yy){
  let bounds = [];
  let A=[x,y];
  let F=[xx,yy];
  let M=scalePoint(...A,...F,1/2);
  let B=rotatePoint(...M,...A,3*Math.PI/5);
  let C=rotatePoint(...A,...M,-3*Math.PI/5);
  let D=rotatePoint(...F,...M,-3*Math.PI/5);
  let E=rotatePoint(...M,...F,3*Math.PI/5);
  bounds.push(...A,...B,...C,...D,...E,...F);
  return bounds;
}

// arrow knotch with "n" in {1,2,3,4} teeth:
// * male = left side along (x,y)--(xx,yy)
// * female = right side along (x,y)--(xx,yy)
function knotchArrowM(n,x,y,xx,yy,width){
  let bounds = [];
  let A=[x,y];
  let Z=[xx,yy];
  let P=[]; // list of points
  // compute P: the bounds along the (x,y)--(xx,yy) segment
  for(let i=n; i>0; i--){
    P.push(scalePoint(...A,...Z,1/2+(i-1+1/2)*width));
  }
  for(let i=1; i<=n; i++){
    P.push(scalePoint(...A,...Z,1/2-(i-1+1/2)*width));
  }
  // push first bound
  bounds.push(...P[0]);
  // first half-trapeze
  let BB=scalePoint(...A,...Z,1/2+(n-1+1/2+Math.sqrt(5/4))*width);
  let B=rotatePoint(...BB,...P[0],-Math.atan(2));
  bounds.push(...B);
  // U shapes for n>1
  for(let i=0; i<n-1; i++){
    let X=rotatePoint(...P[2+2*i],...P[1+2*i],Math.PI/2);
    let Y=rotatePoint(...P[1+2*i],...P[2+2*i],-Math.PI/2)
    bounds.push(...X,...P[1+2*i],...P[2+2*i],...Y);
  }
  // last half-trapeze
  let CC=scalePoint(...A,...Z,1/2-(n-1+1/2+Math.sqrt(5/4))*width);
  let C=rotatePoint(...CC,...P[2*n-1],Math.atan(2));
  bounds.push(...C);
  // push last bound
  bounds.push(...P[2*n-1]);
  // push end bound
  bounds.push(...Z);
  return bounds;
}
function knotchArrowF(n,x,y,xx,yy,width){
  let bounds = [];
  let A=[x,y];
  let Z=[xx,yy];
  let P=[]; // list of points
  // compute P: the bounds along the (x,y)--(xx,yy) segment
  for(let i=n; i>0; i--){
    P.push(scalePoint(...A,...Z,1/2+(i-1+1/2)*width));
  }
  for(let i=1; i<=n; i++){
    P.push(scalePoint(...A,...Z,1/2-(i-1+1/2)*width));
  }
  // push first bound
  bounds.push(...P[0]);
  // first half-trapeze
  let BB=scalePoint(...A,...Z,1/2+(n-1+1/2+Math.sqrt(5/4))*width);
  let B=rotatePoint(...BB,...P[0],Math.atan(2));
  bounds.push(...B);
  // U shapes for n>1
  for(let i=0; i<n-1; i++){
    let X=rotatePoint(...P[2+2*i],...P[1+2*i],-Math.PI/2);
    let Y=rotatePoint(...P[1+2*i],...P[2+2*i],Math.PI/2)
    bounds.push(...X,...P[1+2*i],...P[2+2*i],...Y);
  }
  // last half-trapeze
  let CC=scalePoint(...A,...Z,1/2-(n-1+1/2+Math.sqrt(5/4))*width);
  let C=rotatePoint(...CC,...P[2*n-1],-Math.atan(2));
  bounds.push(...C);
  // push last bound
  bounds.push(...P[2*n-1]);
  // push end bound
  bounds.push(...Z);
  return bounds;
}

