/*

Queue.js

A function to represent a queue

Created by Kate Morley - http://code.iamkate.com/ - and released under the terms
of the CC0 1.0 Universal legal code:

http://creativecommons.org/publicdomain/zero/1.0/legalcode

*/

/* Creates a new queue. A queue is a first-in-first-out (FIFO) data structure -
 * items are added to the end of the queue and removed from the front.
 */

//keep
function rotation(Px, Py, Cx, Cy, theta) {
    var delta_x = Px - Cx;
    var delta_y = Py - Cy;
    var C = Math.cos(theta);
    var S = Math.sin(theta);
    var new_delta_x = C * delta_x - S * delta_y;
    var new_delta_y = S * delta_x + C * delta_y;
    return [Cx + new_delta_x, Cy + new_delta_y];
}
//keep
function vect(src_x, src_y, dst_x, dst_y) {
	var x = dst_x - src_x;
    var y = dst_y - src_y;
    return [x, y];
}
//keep
function produit_scalaire(Ax, Ay, Bx, By) {
    return Ax * Bx + Ay * By;
}
//keep
function norm(x, y) {
    return Math.sqrt(produit_scalaire(x, y, x, y));
}
//keep
function dist(src_x, src_y, dst_x, dst_y) {
    var l = vect(src_x, src_y, dst_x, dst_y);
	var x = l[0];
	var y = l[1];
    return norm(l[0], l[1]);
}
//keep
function norm_square(x, y) {
    return produit_scalaire(x, y, x, y);
}
//keep
function dist_square(src_x, src_y, dst_x, dst_y) {
    var l = vect(src_x, src_y, dst_x, dst_y);
	var x = l[0];
	var y = l[1];
    return norm_square(x, y);
}
//keep
function milieu(Ax, Ay, Bx, By) {
    var x = (Ax + Bx) / 2;
    var y = (Ay + By) / 2;
    return [x, y];
}
//keep
function vect_orthogonal_centrifuge(Ax, Ay, Bx, By, Ox, Oy) {
    var l = vect(Ax, Ay, Bx, By);
	var x = l[0];
	var y = l[1];
    var l = milieu(Ax, Ay, Bx, By);
	var Mx = l[0];
	var My = l[1];
    if (y * (Mx - Oy) == x * (My - Ox))
        return [y, -x];
    var s = (y * (Mx - Oy) - x * (My - Ox)) / Math.abs(y * (Mx - Oy) - x * (My - Ox));
    return [s * y, - s * x];
}
//keep
function get_orthogonal_circle_radius_and_center(Ax, Ay, Bx, By, Ox, Oy, R) {
    var AB = dist(Ax, Ay, Bx, By);
    var ApBx = Ax + Bx;
    var ApBy = Ay + By;
    var AmBx = Ax - Bx;
    var AmBy = Ay - By;
    var norm_ApB = norm(ApBx, ApBy);
    var norm_AmB = norm(AmBx, AmBy);
    var l = vect_orthogonal_centrifuge(Ax, Ay, Bx, By, Ox, Oy);
	var wx = l[0];
	var wy = l[1];
    var ps = produit_scalaire(ApBx, ApBy, wx, wy);
	var ret = {};
    ret.r = AB * Math.sqrt(1/4 + ((R**2 - 1/4*(norm_ApB**2 - norm_AmB**2)) / ps)**2);
    ret.r = Math.min(ret.r,1000000000)
    ret.Cx = ApBx / 2 + Math.sqrt((ret.r/AB)**2 - 1/4) * wx;
    ret.Cy = ApBy / 2 + Math.sqrt((ret.r/AB)**2 - 1/4) * wy;
    return ret;
}
//keep
function circle_inversion(Px, Py, Cx, Cy, r) {
    var l = vect(Cx, Cy, Px, Py);
	var x = l[0];
	var y = l[1];
    var new_norm = r*r / (x*x + y*y);
    return [Cx + new_norm * x, Cy + new_norm * y];
}
//keep
function circle_inversion_polygon(bounds, Cx, Cy, r) {
    var size = bounds.length;
    var res_bounds = [];
    for (var i = 0; i < size/2; i++) {
        var l = circle_inversion(bounds[i*2], bounds[i*2+1], Cx, Cy, r)
		var x = l[0];
		var y = l[1];
        res_bounds.push(x, y);
	}
    return res_bounds;
}


//keep
function PoincareTilingPoint(a, b, c) {
  var p = {};
  p.x = a;
  p.y = b;
  p.adjacentTilesNum = c;
  return p;
}
//keep
function is_same_point(p_1, p_2) {
	//console.log(p_1.x, p_1.y, p_2.x, p_2.y);
	var d = dist_square(p_1.x, p_1.y, p_2.x, p_2.y);
	//console.log(d);
	return d < Math.pow(10, -10);
}
//keep
function arrContains(arr, p) {
	for (var p2 of arr) {
		if (is_same_point(p, p2)) {
			return true;
		}
	}
	return false;
}
//keep
function arrGetValue(arr, p) {
	for (var p2 of arr) {
		if (is_same_point(p, p2))
			return p2.adjacentTilesNum;
	}
	return undefined;
}
///keep
function arrSetValue(arr, p, val) {
	for (var p2 of arr) {
		if (is_same_point(p, p2)) {
			var idx = arr.indexOf(p2);
			p2.adjacentTilesNum = val;
			arr[idx] = p2;
			return val;
		}
	}
}
//keep
function arrAdd(arr, p, val) {
	if (arrContains(arr, p)) {
		return arrSetValue(arr, p, val);
	} else {
		p.adjacentTilesNum = val;
		arr.push(p);
		return val;
	}
}
//keep
function arrIncr(arr, p) {
	if (arrContains(arr, p)) {
		//console.log("yes");
		return arrSetValue(arr, p, arrGetValue(arr, p) + 1);
	} else {
		//console.log("no");
		return arrAdd(arr, p, 1);
	}
}
