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

