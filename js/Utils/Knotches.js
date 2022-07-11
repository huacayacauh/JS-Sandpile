// This code is part of JS-Sandpile (https://github.com/huacayacauh/JS-Sandpile/)
// CC-BY Valentin Darrigo, Jeremy Fersula, Kevin Perrot

// create a knotch from ("x","y") to ("xx","yy")
// centered at fraction "place" of the segment
// of width "width" (again a fraction of the segment)
// return a list of bounds, excluding [x,y]

// knotch1 male/female on (x,y)--(xx,yy) with fractions
function knotch1m(x,y,xx,yy,place,width){
  let bounds = [];
  let startx = 0;
  let starty = 0;
  [startx,starty] = scalePoint(xx,yy,x,y,place-width/2);
  let endx = 0;
  let endy = 0;
  [endx,endy] = scalePoint(xx,yy,x,y,place+width/2);
  bounds.push(...knotch1(startx,starty,endx,endy));
  bounds.push(xx,yy);
  return bounds;
}
function knotch1f(x,y,xx,yy,place,width){
  let bounds = [];
  let startx = 0;
  let starty = 0;
  [startx,starty] = scalePoint(xx,yy,x,y,(1-place)-width/2);
  let endx = 0;
  let endy = 0;
  [endx,endy] = scalePoint(xx,yy,x,y,(1-place)+width/2);
  bounds.push(...knotch1(startx,starty,endx,endy));
  bounds.push(xx,yy);
  return bounds;
}

// knotch1 alone (returned array includes x,y,xx,yy)
function knotch1(x,y,xx,yy){
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

