// This code is part of JS-Sandpile (https://github.com/huacayacauh/JS-Sandpile/)
// CC-BY Valentin Darrigo, Jeremy Fersula, Kevin Perrot

// [1.0] geometric transformations of points

// [1.1] scale point A towards point B by factor f (homothecy, f=1 no move, f=0 full move A to B)
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

// [1.4] reflect point A with respect with the line going through point B with direction vector C
function reflectPoint(xA, yA, xB, yB, xC, yC){
    // based on Householder equation https://en.wikipedia.org/wiki/Householder_transformation
    // formula reflect(A,B,C) = A - 2<(A-B)|iC> / <C|C> iC where iC = (-yC, xC) is the orthonogal vector to C, and <C|C> is the squared norm of C
    // compute the squared norm of C, and householder coefficient  2<(A-B)|iC> / <C|C>
    var nC2 = (xC*xC + yC*yC); // square of the norm of C
    var houseCoeff= 2*((yA-yB)*xC -(xA - xB)*yC)/nC2;// the coefficient in the Householder equation
    return [xA + houseCoeff*yC, yA - houseCoeff*xC];	 
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

function segmentSlope(segment){
  let deltaX1 = segment[2] - segment[0];
  let deltaY1 = segment[3] - segment[1];

  if (Math.abs(deltaX1) < p_error)
    return Number.POSITIVE_INFINITY;
  else if (Math.abs(deltaY1) < p_error)
    return 0;
  else
    return deltaY1 / deltaX1;
}

// If two segments [AB] and [CD] share just one extremity or nothing => not neighbors
function badCondition(xA, yA, xB, yB, xC, yC, xD, yD){
  let distBToCD = distancePointSegment(xB, yB, xC, yC, xD, yD);
  let distAToCD = distancePointSegment(xA, yA, xC, yC, xD, yD);
  let distCToAB = distancePointSegment(xC, yC, xA, yA, xB, yB);
  let distDToAB = distancePointSegment(xD, yD, xA, yA, xB, yB);
  let shareOneExtremity =  distBToCD < p_error && 
    distance(xB, yB, xC, yC) < p_error &&  
    distDToAB >= p_error && 
    distAToCD >= p_error;

  let shareNothing = distAToCD >= p_error &&
    distBToCD >= p_error &&
    distCToAB >= p_error &&
    distDToAB >= p_error;

  return shareOneExtremity || shareNothing;
}

// Except sharing just on point (an extremity)
function segmentOnAnother(xA1, yA1, xB1, yB1, xA2, yA2, xB2, yB2){
  // same segments
  if(distance(xA1, yA1, xA2, yA2)<p_error && distance(xB1, yB1,xB2, yB2)<p_error)
    return true;
  return !badCondition(xA1, yA1, xB1, yB1, xA2, yA2, xB2, yB2) && !badCondition(xA2, yA2, xB2, yB2, xA1, yA1, xB1, yB1);
}

