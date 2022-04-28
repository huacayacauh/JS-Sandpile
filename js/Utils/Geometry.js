// This code is part of JS-Sandpile (https://github.com/huacayacauh/JS-Sandpile/)
// CC-BY Valentin Darrigo, Jeremy Fersula, Kevin Perrot

// [1.0] geometric transformations of points

// [1.1] scale point A towards point B by factor f (homothecy)
//       return the new coordinates for point A
function scalePoint(xA, yA, xB, yB, f){
  return [ xB+(xA-xB)*f, yB+(yA-yB)*f ];
}

// [1.2] shift point A by vector B
//       return the new coordinates for point A
function shiftPoint(xA, yA, xB, yB){
  return [ xA+xB, yA+yB ];
}

// [1.3] rotate point A around point B by angle a (in radian)
//       return the new coordinates for point A
//       caution: a positive = counterclockwise
//                a negative = clockwise
function rotatePoint(xA, yA, xB, yB, a){
  // source: https://www.euclideanspace.com/maths/geometry/affine/aroundPoint/matrix2d/index.htm
  cosa=Math.cos(a);
  sina=Math.sin(a);
  return [ cosa*xA - sina*yA + xB - cosa*xB + sina*yB,
           sina*xA + cosa*yA + yB - sina*xB - cosa*yB ];
}

// compute the Euclidean distance between two points
function distance(xA, yA, xB, yB){
  return Math.sqrt((xA-xB)*(xA-xB)+(yA-yB)*(yA-yB));
}

// compute if vectors AB and CD are collinear, with p_error tolerance

function collinear(xA, yA, xB, yB, xC, yC, xD, yD, p_error){
  return (Math.abs((xB - xA) * (yD - yC) - (yB - yA) * (xD - xC)) < p_error);
}

// compute if part of segment [A, B] overlaps [C, D] or vice-versa, accepting a p_error computing error
// First checks that the two vectors are collinear, and then that a point of the second vector is in the first one
function overlap(xA, yA, xB, yB, xC, yC, xD, yD, p_error){
  if (!collinear(xA, yA, xB, yB, xC, yC, xD, yD, p_error)){
    return false;
  }
  // compute equation of line between A and B : y = ax + b
  a = (yB - yA) / (xB - xA);
  b = yA - a * xA;
  if (xC < Math.max(xA, xB) && xC > Math.min(xA, xB)){
    return (Math.abs(a * xC + b - yC) < p_error);
  }
  else if (xD < Math.max(xA, xB) && xD > Math.min(xA, xB)){
    console.log(2);
    return (Math.abs(a * xD + b - yD) < p_error);
  }
  else{
    console.log(3);
    return false;
  }
}

// compute the Euclidean distance from a point to a segment
function distancePointSegment(x,y,xA,yA,xB,yB){
  //check if segment is a point
  let d=distance(xA,yA,xB,yB);
  if(d==0){
    return distance(x,y,xA,yA);
  }
  // source : https://stackoverflow.com/a/1501725
  let t = ((x-xA)*(xB-xA)+(y-yA)*(yB-yA))/(d*d);
  t = Math.max(0,Math.min(1,t));
  let res = distance(x,y,xA+t*(xB-xA),yA+t*(yB-yA));
  return res;
}

