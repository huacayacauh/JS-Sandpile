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
function Liste(){

  var list  = [];
  var offset = 0;

  this.getLength = function(){
    return (list.length - offset);
  }

  this.isEmpty = function(){
    return (list.length == 0);
  }


  this.push_back = function(item){
    list.push(item);
  }
  this.push_front = function(item){
    list.unshift(item);
  }

  this.pop_front = function(item){
    return list.shift(item);
  }


}

function reorder (bounds, B0x, B0y, B1x, B1y){
  var new_bounds = [];
  delta = 10**-6;


  for (var k = 0; k < bounds.length; k = k+2)
  {

    if ( Math.abs(bounds[k]-B0x)< delta  &&  Math.abs(bounds[k+1]-B0y)< delta)
    {

      if (k != 0){

        new_bounds = bounds.slice(k,bounds.length).concat(bounds.slice(0,k));
        break;

      } else if ( Math.abs(bounds[k+2]-B1x)< delta  &&  Math.abs(bounds[k+3]-B1y)< delta) {

        new_bounds = bounds.slice(k,bounds.length).concat(bounds.slice(0,k));
        break;

      } else {

        var new_bounds = [];
        new_bounds.push(bounds[0],bounds[1]);

        for (var i = bounds.length-2; i > 0; i = i-2)
        {
          new_bounds.push(bounds[i],bounds[i+1]);
        }
        break;
      }
    }
    if (Math.abs(bounds[k]-B1x)< delta  &&  Math.abs(bounds[k+1]-B1y)< delta)
    {

      if (k != 0){

        for (var i = k+2; i >= 0; i = i-2)
        {
          new_bounds.push(bounds[i],bounds[i+1]);
        }

        for (var i = bounds.length-2; i > k+2; i = i-2)
        {
          new_bounds.push(bounds[i],bounds[i+1]);
        }
        break;
      } else if ( Math.abs(bounds[k+2]-B0x)< delta  &&  Math.abs(bounds[k+3]-B0y)<delta) {

        for (var i = k+2; i >= 0; i = i-2)
        {
          new_bounds.push(bounds[i],bounds[i+1]);
        }

        for (var i = bounds.length-2; i > k+2; i = i-2)
        {
          new_bounds.push(bounds[i],bounds[i+1]);
        }
        break;
      } else {

        new_bounds = bounds.slice(bounds.length-2,bounds.length).concat(bounds.slice(0,bounds.length-2));
        break;

      }
    }
  }

  return new_bounds;
}



function make_hyperbol2tiling(p, q, star, iter_num, Ox, Oy, R) {
  var tiles = [];
  var tiles_liste = new Liste();
  var dict = [];
  var id = 0;

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
      var l = rotation(Ax, Ay, Ox, Oy, -i*beta_2);
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
    //  tile.neighbour_by_side = neighbour_by_side;
    tiles.push(tile);
    if (iter_num>0){
  //     tiles_liste.push_back([tile,0,p-3,1,0]);
 // tiles_liste.push_back([tile,0,['N','P','P'],1]);
 //  tiles_liste.push_back([tile,1,['N','P','P'],1]);

     for (var side = 0 ; side < q; side++){
       tiles_liste.push_back([tile,side,['N','P','P'],1]);
     }
    }
  }


  while ( !tiles_liste.isEmpty())
  {
    var tile ;
    var side_no;
    var pile;
    var iter ;
    var fill ;

    [tile,side_no,pile,iter,fill] = tiles_liste.pop_front();


    var side_num = tile.bounds.length / 2;

    var ret = get_orthogonal_circle_radius_and_center(
      tile.bounds[(2*side_no+0)%(side_num*2)],
      tile.bounds[(2*side_no+1)%(side_num*2)],
      tile.bounds[(2*side_no+2)%(side_num*2)],
      tile.bounds[(2*side_no+3)%(side_num*2)],
      Ox, Oy, R);

      var T_2_bounds = circle_inversion_polygon(tile.bounds, ret.Cx, ret.Cy, ret.r);
//      console.log(  tile.bounds[(2*side_no+0)%(side_num*2)],
//         tile.bounds[(2*side_no+1)%(side_num*2)],
//         tile.bounds[(2*side_no+2)%(side_num*2)],
//         tile.bounds[(2*side_no+3)%(side_num*2)]);



//console.log(T_2_bounds);

     T_2_bounds =  reorder(T_2_bounds,
        tile.bounds[(2*side_no+2)%(side_num*2)],
        tile.bounds[(2*side_no+3)%(side_num*2)],
        tile.bounds[(2*side_no+0)%(side_num*2)],
        tile.bounds[(2*side_no+1)%(side_num*2)]
      );
    //  console.log(T_2_bounds);


      var T_2 = new Tile([id], [], T_2_bounds, q);


      id = id+1;
      tiles.push(T_2);

    //  console.log("cpt: ",cpt, "  | iter: ",iter, " | d: ",d);
      console.log(pile);
      var fill = pile.shift();
      console.log(pile);

      if (pile.length > 0){
        // if (fill == 'N'){
          tiles_liste.push_front([T_2, q-1 ,pile,iter]);
        }

      if (iter < iter_num){
          if (fill == 'N'){
            tiles_liste.push_back([T_2, 2 ,['N','P'] ,iter+1]);
          }else{
            tiles_liste.push_back([T_2, 1  ,['N','P','P'] ,iter+1]);
            tiles_liste.push_back([T_2, 2  ,['N','P'] ,iter+1]);

          }
      }

  }


    return tiles;
  }

  Tiling.hyperbol2Tiling = function({iterations}={}) {
    var R = 1;
    var Ox = 0;
    var Oy = 0;
    var p = 5; // pour angle tangent
    var q = 4; // pour angle ouverture centrale
    var iter_num = iterations;

    return new Tiling(make_hyperbol2tiling(p, q, false, iter_num, Ox, Oy, R));
  };
