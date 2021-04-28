const countOccurrences = (arr, val) => arr.reduce((a, v) =>
(typeof v == 'string' ? v === val ? a + 1 : a : a+countOccurrences(v,val)), 0);

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


function calcul_voisin (p,q){

  var voisin_depart = ['N'];
  var voisin_n = [['N']];
  var voisin_p = [['N','P'],['N']];


  for (var h = 4; h <= p; h++){
    voisin_depart = voisin_depart.concat(['P'])
  }

  for (var i = 4; i < q; i++){
    voisin_n = [['N','P']].concat(voisin_n)
    voisin_p = [['N','P']].concat(voisin_p)
  }
  for (var j = 4; j < p; j++){
    for (var k = 0; k < voisin_n.length; k++){
      voisin_n[k] = voisin_n[k].concat('P');
    }
    for (var k = 0; k < voisin_p.length; k++){
      voisin_p[k] = voisin_p[k].concat('P');
    }
  }
  console.log([voisin_depart,voisin_n,voisin_p]);
  return [voisin_depart,voisin_n,voisin_p];

}



function make_hyperbolVertextiling(p, q, star, iter_num, Ox, Oy, R) {
  var tiles = [];
  var tiles_liste = [];
  var dict = [];
  var id = 0;
  var idmax = []
  var iter_cur = 0;
  var cpt_n = 0;
  var cpt_p = 0;

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
  // console.log("OA:", OA);
  var Ax = OA;
  var Ay = 0;


  var voisin_depart;
  var voisin_n ;
  var voisin_p ;
  [voisin_depart,voisin_n,voisin_p] = calcul_voisin(p,q)
  var nombre_n = q * countOccurrences(voisin_depart,'N');
  var nombre_p = q * countOccurrences(voisin_depart,'P');
  idmax.push(1);

  for (var k =1; k<= iter_num;k++){
    var nb_edge = nombre_n+nombre_p;
    idmax.push(nb_edge);
    [nombre_n,nombre_p] =
    [nombre_n*countOccurrences(voisin_n,'N')+nombre_p*countOccurrences(voisin_p,'N'),
    nombre_n*countOccurrences(voisin_n,'P')+nombre_p*countOccurrences(voisin_p,'P')];
  }
  console.log(idmax);

  // Creation des tuiles de base
  if (!star) {
    var bounds = [];
    bounds.push(Ax, Ay);
    for (var i = 1; i < q; i++) {
      var l = rotatePoint(Ax, Ay, Ox, Oy, -i*beta_2);
      bounds.push(l[0], l[1]);
    }
    //console.log(bounds);
    var neighbour_by_side = [];
    for (var k = 0; k < q; k++) {
      neighbour_by_side.push([k*voisin_depart.length,1]);
    }
    //console.log(dict);
    var tile = new Tile([0, 0], neighbour_by_side, bounds, q);
    //  tile.neighbour_by_side = neighbour_by_side;
    tiles.push(tile);
    if (iter_num>0){
      for (var side = 0 ; side < q; side++){
        tiles_liste.push([tile,side,[].concat(voisin_depart),1]);
      }
    }
  }


  while ( tiles_liste.length != 0 )
  {
    var tile ;
    var side_no;
    var pile;
    var iter ;

    [tile,side_no,pile,iter] = tiles_liste.shift();


    var side_num = tile.bounds.length / 2;

    var ret = get_orthogonal_circle_radius_and_center(
      tile.bounds[(2*side_no+0)%(side_num*2)],
      tile.bounds[(2*side_no+1)%(side_num*2)],
      tile.bounds[(2*side_no+2)%(side_num*2)],
      tile.bounds[(2*side_no+3)%(side_num*2)],
      Ox, Oy, R);


      var T_2_bounds = circle_inversion_polygon(tile.bounds, ret.Cx, ret.Cy, ret.r);

      // console.log(T_2_bounds);

      T_2_bounds =  reorder(T_2_bounds,
        tile.bounds[(2*side_no+2)%(side_num*2)],
        tile.bounds[(2*side_no+3)%(side_num*2)],
        tile.bounds[(2*side_no+0)%(side_num*2)],
        tile.bounds[(2*side_no+1)%(side_num*2)]
      );
      var fill = pile.shift();

      var neighbour_by_side = [];

      if (iter_cur != iter){
        id = 0;
        cpt_n=0;
        cpt_p=0;
        iter_cur = iter;
        neighbour_by_side.push([idmax[iter]-1,iter]);
      }else{
        neighbour_by_side.push([id-1,iter]);
      }
      if (id == idmax[iter_cur]-1 ){

        neighbour_by_side.push([0,iter]);
      }else{
        neighbour_by_side.push([id+1,iter]);
      }

      var id_fils = cpt_n*voisin_n.flat().length+cpt_p*voisin_p.flat().length;
      neighbour_by_side.push([id_fils,iter+1]);
      if (fill == 'N'){
        neighbour_by_side.push(tile.id);

        for (var k = 0; k < voisin_n.length-1; k++){
          id_fils = id_fils+ voisin_n[k].length;
          neighbour_by_side.push([id_fils,iter+1]);

        }
      }else{
        for (var k = 0; k < voisin_p.length-1; k++){
          id_fils = id_fils+ voisin_p[k].length;
          neighbour_by_side.push([id_fils,iter+1]);

        }
      }



      var T_2 = new Tile([id,iter_cur], neighbour_by_side, T_2_bounds, q);

      id = id+1;
      if (fill == 'N'){
        cpt_n = cpt_n+1;
      }else{
        cpt_p = cpt_p+1;
      }
      tiles.push(T_2);

      //  console.log("cpt: ",cpt, "  | iter: ",iter, " | d: ",d);
      // console.log(pile);
      // console.log(pile);

      if (pile.length > 0){
        // if (fill == 'N'){
        tiles_liste.unshift([T_2, q-1 ,pile,iter]);
      }

      if (iter < iter_num){
        if (fill == 'N'){
          for (var k = 0; k < voisin_n.length; k++){
            tiles_liste.push([T_2, 2 + k ,[].concat(voisin_n[k]) ,iter+1]);
          }
        }else{
          for (var k = 0; k < voisin_p.length; k++){
            tiles_liste.push([T_2, 1 + k ,[].concat(voisin_p[k]) ,iter+1]);
          }
        }
      }
    }

    tiles.forEach(tile => tile.scale(0,0,200))

    return tiles;
  }

  Tiling.hyperbolVertexTiling = function({iterations,cote,sommet}={}) {
    var R = 1;
    var Ox = 0;
    var Oy = 0;
    var iter_num = iterations;
    return new Tiling(make_hyperbolVertextiling(cote, sommet, false, iter_num, Ox, Oy, R));
  };








  function make_hyperbolEdgetiling(p, q, star, iter_num, Ox, Oy, R) {
    var tiles = [];
    var tiles_liste = [];
    var dict = [];
    var id = 1;
    var idmax = []
    var iter_cur = 0;
    var cpt_n = 0;
    var cpt_p = 0;

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
    var Ax = OA;
    var Ay = 0;

    if (!star) {
      var bounds = [];
      bounds.push(Ax, Ay);
      for (var i = 1; i < q; i++) {
        var l = rotatePoint(Ax, Ay, Ox, Oy, -i*beta_2);
        bounds.push(l[0], l[1]);
      }
      var neighbour_by_side = [];
      for (var k = 0; k < q; k++) {
        neighbour_by_side.push([k,1]);
      }
      var tile = new Tile([0,0],neighbour_by_side, bounds, q);
      tiles.push(tile);
      if (iter_num>0){
        for (var side = 0 ; side < q; side++){
          tiles_liste.push([tile,side, 'N',1]);
        }
      }
    }


    while ( tiles_liste.length != 0 )
    {
      var tile ;
      var side_no;
      var iter ;
      var fill ;
      var cpt;

      [tile,side_no,fill,iter,cpt] = tiles_liste.shift();


      var side_num = tile.bounds.length / 2;

      var ret = get_orthogonal_circle_radius_and_center(
        tile.bounds[(2*side_no+0)%(side_num*2)],
        tile.bounds[(2*side_no+1)%(side_num*2)],
        tile.bounds[(2*side_no+2)%(side_num*2)],
        tile.bounds[(2*side_no+3)%(side_num*2)],
        Ox, Oy, R);


        var T_2_bounds = circle_inversion_polygon(tile.bounds, ret.Cx, ret.Cy, ret.r);


        T_2_bounds =  reorder(T_2_bounds,
          tile.bounds[(2*side_no+2)%(side_num*2)],
          tile.bounds[(2*side_no+3)%(side_num*2)],
          tile.bounds[(2*side_no+0)%(side_num*2)],
          tile.bounds[(2*side_no+1)%(side_num*2)]
        );

        var neighbour_by_side = [];





        var T_2 = new Tile([id,iter], neighbour_by_side, T_2_bounds, q);

        id = id+1;

        tiles.push(T_2);

        if (iter < iter_num){
          if (fill == 'N'){
            for (var k = 0; k <q-3; k++){
              tiles_liste.push([T_2, 2 + k ,'N' ,iter+1]);
            }

            if (p > 4){
              tiles_liste.push([T_2, q-1 ,'PD',iter+1, (p-5)/2]);
            }
            tiles_liste.push([T_2, 1 ,'PG',iter+1, (p-4)/2]);
          }else if (fill == 'PG'){
            if (cpt >= 1 ){
              console.log(cpt);
              tiles_liste.push([T_2, 1 ,'PG' ,iter+1,cpt-1]);

            }


            for (var k = 0; k < q-2; k++){
              tiles_liste.push([T_2, 2 + k ,'N' ,iter+1,0]);
            }
          } else{
            if (cpt >= 1 ){
              console.log(cpt);

              tiles_liste.push([T_2, q-1 ,'PD' ,iter+1,cpt-1]);

            }

            for (var k = 0; k < q-2; k++){
              tiles_liste.push([T_2, q-2 - k ,'N' ,iter+1,0]);
            }
          }
        }
      }


      var findNeighbors_option = new Map();
      findNeighbors_option.set('polygon',default_neighbors2bounds(q));

      let tilesdict = new Map(tiles.map(i => [id2key(i.id), i]));
			let fn=findNeighbors(tiles,tilesdict,findNeighbors_option);
      tiles.forEach(tile => tile.scale(0,0,200))

      return tiles;
    }









  Tiling.hyperbolEdgeTiling = function({iterations,cote,sommet}={}) {
    var R = 1;
    var Ox = 0;
    var Oy = 0;
    var iter_num = iterations;

    return new Tiling(make_hyperbolEdgetiling(cote, sommet, false, iter_num, Ox, Oy, R));
  };
