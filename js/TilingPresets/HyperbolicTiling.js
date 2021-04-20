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
function Queue(){

  // initialise the queue and offset
  var queue  = [];
  var offset = 0;

  // Returns the length of the queue.
  this.getLength = function(){
    return (queue.length - offset);
  }

  // Returns true if the queue is empty, and false otherwise.
  this.isEmpty = function(){
    return (queue.length == 0);
  }

  /* Enqueues the specified item. The parameter is:
   *
   * item - the item to enqueue
   */
  this.enqueue = function(item){
    queue.push(item);
  }

  /* Dequeues an item and returns it. If the queue is empty, the value
   * 'undefined' is returned.
   */
  this.dequeue = function(){

    // if the queue is empty, return immediately
    if (queue.length == 0) return undefined;

    // store the item at the front of the queue
    var item = queue[offset];

    // increment the offset and remove the free space if necessary
    if (++ offset * 2 >= queue.length){
      queue  = queue.slice(offset);
      offset = 0;
    }

    // return the dequeued item
    return item;

  }

  /* Returns the item at the front of the queue (without dequeuing it). If the
   * queue is empty then undefined is returned.
   */
  this.peek = function(){
    return (queue.length > 0 ? queue[offset] : undefined);
  }
  
  this.getQueue = function(){
    return queue;
  }

}

function rotation(Px, Py, Cx, Cy, theta) {
    var delta_x = Px - Cx;
    var delta_y = Py - Cy;
    var C = Math.cos(theta);
    var S = Math.sin(theta);
    var new_delta_x = C * delta_x - S * delta_y;
    var new_delta_y = S * delta_x + C * delta_y;
    return [Cx + new_delta_x, Cy + new_delta_y];
}

function vect(src_x, src_y, dst_x, dst_y) {
	var x = dst_x - src_x;
    var y = dst_y - src_y;
    return [x, y];
}

function produit_scalaire(Ax, Ay, Bx, By) {
    return Ax * Bx + Ay * By;
}

function norm(x, y) {
    return Math.sqrt(produit_scalaire(x, y, x, y));
}

function dist(src_x, src_y, dst_x, dst_y) {
    var l = vect(src_x, src_y, dst_x, dst_y);
	var x = l[0];
	var y = l[1];
    return norm(l[0], l[1]);
}

function norm_square(x, y) {
    return produit_scalaire(x, y, x, y);
}

function dist_square(src_x, src_y, dst_x, dst_y) {
    var l = vect(src_x, src_y, dst_x, dst_y);
	var x = l[0];
	var y = l[1];
    return norm_square(x, y);
}

function milieu(Ax, Ay, Bx, By) {
    var x = (Ax + Bx) / 2;
    var y = (Ay + By) / 2;
    return [x, y];
}

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
    ret.Cx = ApBx / 2 + Math.sqrt((ret.r/AB)**2 - 1/4) * wx;
    ret.Cy = ApBy / 2 + Math.sqrt((ret.r/AB)**2 - 1/4) * wy;
    return ret;
}

function circle_inversion(Px, Py, Cx, Cy, r) {
    var l = vect(Cx, Cy, Px, Py);
	var x = l[0];
	var y = l[1];
    var new_norm = r*r / (x*x + y*y);
    return [Cx + new_norm * x, Cy + new_norm * y];
}

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

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1)
    arr.splice(index, 1);
  return arr;
}

function removeItemAll(arr, value) {
  var i = 0;
  while (i < arr.length) {
    if (arr[i] === value) {
      arr.splice(i, 1);
    } else {
      ++i;
	}
  }
  return arr;
}

function PoincareTilingPoint(a, b, c) {
  var p = {};
  p.x = a;
  p.y = b;
  p.adjacentTilesNum = c;
  return p;
}

function is_same_point(p_1, p_2) {
	//console.log(p_1.x, p_1.y, p_2.x, p_2.y);
	var d = dist_square(p_1.x, p_1.y, p_2.x, p_2.y);
	//console.log(d);
	return d < Math.pow(10, -10);
}

function arrContains(arr, p) {
	for (var p2 of arr) {
		if (is_same_point(p, p2)) {
			return true;
		}
	}
	return false;
}

function arrGetValue(arr, p) {
	for (var p2 of arr) {
		if (is_same_point(p, p2))
			return p2.adjacentTilesNum;
	}
	return undefined;
}

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
		//console.log("yes");
		return arrSetValue(arr, p, arrGetValue(arr, p) + 1);
	} else {
		//console.log("no");
		return arrAdd(arr, p, 1);
	}
}

function arrDelete(arr, p) {
	for (var p2 of arr) {
		if (is_same_point(p, p2)) {
			removeItemOnce(arr, p2);
			return;
		}
	}
}

function make_hyperbolic_tiling(p, q, star, iter_num, Ox, Oy, R) {
	var tiles = [];
	var tiles_queue = new Queue();
	var dict = [];
	
	// Verification des parametres
	if (1/p + 1/q >= 1/2) {
		console.log("Error: p and q must respect hyperbolic angular rule.");
		return;
	}

	// Initialisation
	var beta_2 = 2 * Math.PI / q;
	var alpha_1 = Math.PI / p;
	var gamma_1 = Math.PI / 2 - alpha_1;
	var OA = Math.sqrt(R * (R + Math.sin(beta_2 / 2)**2 / (Math.sin(gamma_1)**2 - Math.sin(beta_2 / 2)**2))) * Math.cos(beta_2 / 2) - R * Math.sin(beta_2 / 2) * Math.cos(gamma_1) / Math.sqrt(Math.sin(gamma_1)**2 - Math.sin(beta_2 / 2)**2);
	//console.log("OA:", OA);
	var Ax = OA;
	var Ay = 0;
	
	// Creation des tuiles de base
	if (!star) {
		var bounds = [];
		bounds.push(Ax, Ay);
		for (var i = 1; i < q; i++) {
			var l = rotation(Ax, Ay, Ox, Oy, i*beta_2);
			bounds.push(l[0], l[1]);
		}
		//console.log(bounds);
		var neighbour_by_side = [];
		for (var k = 0; k < bounds.length / 2; k++) {
			neighbour_by_side.push(undefined);
			var point = PoincareTilingPoint(bounds[k*2], bounds[k*2+1], 0);
			arrIncr(dict, point);
		}
		//console.log(dict);
		var tile = new Tile([0, 0], [], bounds, q);
		tile.neighbour_by_side = neighbour_by_side;
		tiles.push(tile);
		tiles_queue.enqueue(tile);
	}
	
	console.log("iteration");
	for (var iter = 1; iter <= iter_num; iter++) {
		console.log("iter:" + iter);
		var tile = tiles_queue.dequeue();
		var side_num = tile.bounds.length / 2;
		for (var side_no = 0; side_no < side_num; side_no++) {
			//console.log("side_no:" + side_no);
			if (tile.neighbour_by_side[side_no] == undefined) {
				var ret = get_orthogonal_circle_radius_and_center(
				tile.bounds[(2*side_no+0)%(side_num*2)],
				tile.bounds[(2*side_no+1)%(side_num*2)],
				tile.bounds[(2*side_no+2)%(side_num*2)],
				tile.bounds[(2*side_no+3)%(side_num*2)],
				Ox, Oy, R);
				//console.log(ret.r, ret.Cx, ret.Cy);
				var T_2_bounds = circle_inversion_polygon(tile.bounds, ret.Cx, ret.Cy, ret.r);
				//console.log(T_2_bounds);
				var neighbour_by_side = [];
				var T_2_side_num = T_2_bounds.length / 2;
				for (var T_2_side_no = 0; T_2_side_no < T_2_side_num; T_2_side_no++) {
					if (T_2_side_no == side_no) {
						neighbour_by_side.push(tile.id);
					} else {
						var new_point = PoincareTilingPoint(T_2_bounds[k*2], T_2_bounds[k*2+1], 0);
						var found = false;
						for (var T_3 of tiles_queue.getQueue()) {
							var T3_side_num = T_3.bounds.length / 2;
							for (var T_3_side_no = 0; T_3_side_no < T3_side_num; T_3_side_no++) {
								var T_3_x = PoincareTilingPoint(T_3.bounds[(2*T_3_side_no+0)%(T3_side_num*2)], T_3.bounds[(2*T_3_side_no+1)%(T3_side_num*2)], 0);
								var T_3_y = PoincareTilingPoint(T_3.bounds[(2*T_3_side_no+2)%(T3_side_num*2)], T_3.bounds[(2*T_3_side_no+3)%(T3_side_num*2)], 0);
								var T_2_x = PoincareTilingPoint(T_2_bounds[(2*T_2_side_no+0)%(T_2_side_num*2)], T_2_bounds[(2*T_2_side_no+1)%(T_2_side_num*2)], 0);
								var T_2_y = PoincareTilingPoint(T_2_bounds[(2*T_2_side_no+2)%(T3_side_num*2)], T_2_bounds[(2*T_2_side_no+3)%(T_2_side_num*2)], 0);
								if (is_same_point(T_2_x, T_3_x) && is_same_point(T_2_y, T_3_y)) {
									neighbour_by_side.push(T_3.id);
									var idx = tiles.indexOf(T_3);
									T_3.neighbors[T_3_side_no] = [iter, side_no];
									tiles[idx] = T_3;
									found = true;
								}
							}
						}
						if (!found) {
							neighbour_by_side.push(undefined);
						}
					}
				}
				var T_2 = new Tile([iter, side_no], neighbour_by_side, T_2_bounds, q);
				T_2.neighbour_by_side = neighbour_by_side;
				tile.neighbour_by_side[side_no] = [iter, side_no];
				
				
				for (var T_3 of tiles_queue.getQueue()) {
					var T3_side_num = T_3.bounds.length / 2;
					for (var T_3_side_no = 0; T_3_side_no < T3_side_num; T_3_side_no++) {
						var x = PoincareTilingPoint(T_3.bounds[(2*T_3_side_no+0)%(T3_side_num*2)], T_3.bounds[(2*T_3_side_no+1)%(T3_side_num*2)], 0);
						var val_x = arrGetValue(dict, x);
						var y = PoincareTilingPoint(T_3.bounds[(2*T_3_side_no+2)%(T3_side_num*2)], T_3.bounds[(2*T_3_side_no+3)%(T3_side_num*2)], 0);
						var val_y = arrGetValue(dict, y);
						if (val_x == q && val_y == q) {
							var idx = tiles.indexOf(T_3);
							T_3.neighbors[T_3_side_no] = [iter, side_no];
							tiles[idx] = T_3;
							var T_2_side_num = T_2.bounds.length / 2;
							for (var T_2_side_no = 0; T_2_side_no < T_2_side_num; T_2_side_no++) {
								var T_2_x = PoincareTilingPoint(T_2.bounds[(2*T_2_side_no+0)%(T_2_side_num*2)], T_2.bounds[(2*T_2_side_no+1)%(T_2_side_num*2)], 0);
								var T_2_y = PoincareTilingPoint(T_2.bounds[(2*T_2_side_no+2)%(T3_side_num*2)], T_2.bounds[(2*T_2_side_no+3)%(T_2_side_num*2)], 0);
								if (is_same_point(T_2_x, x) && is_same_point(T_2_y, y)) {
									T_2.neighbors[T_2_side_no] = T_3.id;
								}
							}
						}
					}
				}
				
				tiles.push(T_2);
				tiles_queue.enqueue(T_2);
			}
		}
	}
	console.log(dict);
	
	/*
	// Itération
	var ret = get_orthogonal_circle_radius_and_center(bounds[4], bounds[5], bounds[2], bounds[3], Ox, Oy, R);
    //console.log(ret.r, ret.Cx, ret.Cy);
    var bounds_2 = circle_inversion_polygon(bounds, ret.Cx, ret.Cy, ret.r);
	//console.log(bounds_2);
	tiles.push(new Tile("base_2", [], bounds_2, p));
	*/
	
	return tiles;
}

Tiling.hyperbolicTiling = function({iterations}={}) {
	var R = 1;
	var Ox = 0;
	var Oy = 0;
	var p = 6; // pour angle tangent
	var q = 5; // pour angle ouverture centrale
	var iter_num = iterations;
	return new Tiling(make_hyperbolic_tiling(p, q, false, iter_num, Ox, Oy, R));
};