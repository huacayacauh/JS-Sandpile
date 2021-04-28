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


//these are used in Hyperbol2Tiling.js:

//return the coordinates of the AB vector
function vector(xA, yA, xB, yB) {
	var x = xB - xA;
    var y = yB - yA;
    return [x, y];
}

//computes the dot product between vectors A and B
function dotProduct(Ax, Ay, Bx, By) {
    return Ax * Bx + Ay * By;
}

//computes the norm of the vector (x, y)
function norm(x, y) {
    return Math.sqrt(dotProduct(x, y, x, y));
}

//returns the squared norm of the vector (x, y) (dot product with itself)
function normSquare(x, y) {
    return dotProduct(x, y, x, y);
}

// returns the distance squared between two points A and B
function distSquare(xA, yA, xB, yB) {
    var l = vector(xA, yA, xB, yB);
	var x = l[0];
	var y = l[1];
    return normSquare(x, y);
}

//returns the coordinates of the middle of the segment [AB]
function middle(Ax, Ay, Bx, By) {
    var x = (Ax + Bx) / 2;
    var y = (Ay + By) / 2;
    return [x, y];
}

function vectOrthogonalCentrifuge(Ax, Ay, Bx, By, Ox, Oy) {
    var l = vector(Ax, Ay, Bx, By);
	var x = l[0];
	var y = l[1];
    var l = middle(Ax, Ay, Bx, By);
	var Mx = l[0];
	var My = l[1];
    if (y * (Mx - Oy) == x * (My - Ox))
        return [y, -x];
    var s = (y * (Mx - Oy) - x * (My - Ox)) / Math.abs(y * (Mx - Oy) - x * (My - Ox));
    return [s * y, - s * x];
}


function getOrthogonalCircleRadiusAndCenter(Ax, Ay, Bx, By, Ox, Oy, R) {
    var AB = distance(Ax, Ay, Bx, By);
    var ApBx = Ax + Bx;
    var ApBy = Ay + By;
    var AmBx = Ax - Bx;
    var AmBy = Ay - By;
    var norm_ApB = norm(ApBx, ApBy);
    var norm_AmB = norm(AmBx, AmBy);
    var l = vectOrthogonalCentrifuge(Ax, Ay, Bx, By, Ox, Oy);
	var wx = l[0];
	var wy = l[1];
    var ps = dotProduct(ApBx, ApBy, wx, wy);
	var ret = {};
    ret.r = AB * Math.sqrt(1/4 + ((R**2 - 1/4*(norm_ApB**2 - norm_AmB**2)) / ps)**2);
    ret.r = Math.min(ret.r,1000000000)
    ret.Cx = ApBx / 2 + Math.sqrt((ret.r/AB)**2 - 1/4) * wx;
    ret.Cy = ApBy / 2 + Math.sqrt((ret.r/AB)**2 - 1/4) * wy;
    return ret;
}


function circleInversion(Px, Py, Cx, Cy, r) {
    var l = vector(Cx, Cy, Px, Py);
	var x = l[0];
	var y = l[1];
    var new_norm = r*r / (x*x + y*y);
    return [Cx + new_norm * x, Cy + new_norm * y];
}

function circleInversionPolygon(bounds, Cx, Cy, r) {
    var size = bounds.length;
    var res_bounds = [];
    for (var i = 0; i < size/2; i++) {
        var l = circleInversion(bounds[i*2], bounds[i*2+1], Cx, Cy, r)
		var x = l[0];
		var y = l[1];
        res_bounds.push(x, y);
	}
    return res_bounds;
}


function PoincareTilingPoint(a, b, c) {
  var p = {};
  p.x = a;
  p.y = b;
  p.adjacentTilesNum = c;
  return p;
}

function isSamePoint(p_1, p_2) {
	var d = distSquare(p_1.x, p_1.y, p_2.x, p_2.y);
	return d < Math.pow(10, -10);
}

function arrContains(arr, p) {
	for (var p2 of arr) {
		if (isSamePoint(p, p2)) {
			return true;
		}
	}
	return false;
}

function arrGetValue(arr, p) {
	for (var p2 of arr) {
		if (isSamePoint(p, p2))
			return p2.adjacentTilesNum;
	}
	return undefined;
}

function arrSetValue(arr, p, val) {
	for (var p2 of arr) {
		if (isSamePoint(p, p2)) {
			var idx = arr.indexOf(p2);
			p2.adjacentTilesNum = val;
			arr[idx] = p2;
			return val;
		}
	}
}

function arrAdd(arr, p, val) {
	if (arrContains(arr, p)) {
		return arrSetValue(arr, p, val);
	} else {
		p.adjacentTilesNum = val;
		arr.push(p);
		return val;
	}
}

function arrIncr(arr, p) {
	if (arrContains(arr, p)) {
		return arrSetValue(arr, p, arrGetValue(arr, p) + 1);
	} else {
		return arrAdd(arr, p, 1);
	}
}
