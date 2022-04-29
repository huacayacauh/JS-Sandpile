//Create the dual tiling of th given tiling

//il reste encore à obtimiser l'algorithme:
//- suprimer l'utilistion de parcouru et non parcouru en selectionnant à la ligne 20
//les sommet que l'on parcour plus efficacement (liste à récuprer dans create id)

//- chercher les sommets dans idProche plus efficacment (recherche dans les neighbor plutot que dans la liste des sommet parcouru) 

function dualTiling(tiling){
	let newTils = [];
	//margeErreur sert à éviter les erreurs d'arrondi entre les bordures du pavage initiale
  let margeErreur = dualDistance(coordVertex(tiling, 0, 0), coordVertex(tiling, 0, 1))/30;
  
  let newBounds = createNewBounds(tiling);
	//positionToId est un dictionnaire qui renvoie les sommet de chaque tuile à l'id qui est associé(tout les sommts qui se touchent ont le meme id)
	let positionToId = new Map();
	createId(tiling, margeErreur, positionToId);
	
  let parcouru = [];
  for(var i=0; i<tiling.tiles.length; i++){
    for(var j=0; j<tiling.tiles[i].bounds.length/2; j++){
    	if (nonParcouru(i, j, parcouru, tiling, margeErreur)){
	      let lastTile = -1;
	      let currentTile = i;
	      let nextTile = 0;
				let currentVertexIndex = j;
	      let bounds = [];
	      let currentNeighbor = -1;
	      let neighbors = [];

				//on cherche a faire le tour du sommet j de la tuile i en retenant les tuiles traversés
				searchCompleted = findNextTile(tiling, newBounds, i, currentTile, currentVertexIndex, lastTile, nextTile, bounds, neighbors, currentNeighbor, margeErreur, positionToId);
									
				// si on a bien fait le tour
				if (searchCompleted){
					parcouru.push(coordVertex(tiling, i, j));
	  		  newTils.push(new Tile(positionToId.get(i.toString()+","+ j.toString()), neighbors, bounds, neighbors.length));
				}
      }
    }
  }
  console.log("END construct the dual Tiling");
  console.log("INFO the current Tiling has "+newTils.length+" tiles");
  return new Tiling(newTils);
}

//findNextTile est une fonction récurssive qui cherche le voisin de la tuile currentTile qui contient le sommet initiale et le dernir voisin que l'on ai trouvé (c'est à dire le voisin qui partage cette arrète)
function findNextTile(tiling, newBounds, initiale, currentTile, currentVertexIndex, lastTile, nextTile, bounds, neighbors, currentNeighbor, margeErreur, positionToId){
	//d'abord on prend un voisin si c'est le premier ou on prend le suivant si on en a deja un
	if (currentNeighbor == -1){
		currentNeighbor = coordVertex(tiling, currentTile, neighborVertex(tiling, currentTile, currentVertexIndex, 1));
		neighbors.push(positionToId.get(currentTile.toString()+","+ neighborVertex(tiling, currentTile, currentVertexIndex, 1).toString()));
	}
	else{
		if (dualDistance(coordVertex(tiling, currentTile, neighborVertex(tiling, currentTile, currentVertexIndex, -1)),currentNeighbor)<margeErreur){
			currentNeighbor = coordVertex(tiling, currentTile, neighborVertex(tiling, currentTile, currentVertexIndex, 1));
			neighbors.push(positionToId.get(currentTile.toString()+","+ neighborVertex(tiling, currentTile, currentVertexIndex, 1).toString()));
		}
		else if (dualDistance(coordVertex(tiling, currentTile, neighborVertex(tiling, currentTile, currentVertexIndex, 1)),currentNeighbor)<margeErreur){
			currentNeighbor = coordVertex(tiling, currentTile, neighborVertex(tiling, currentTile, currentVertexIndex, -1));
			neighbors.push(positionToId.get(currentTile.toString()+","+ neighborVertex(tiling, currentTile, currentVertexIndex, -1).toString()));
		}
	}
	
	//on cherche la tuile contenant les deux sommet
	for(var k=0; k<tiling.tiles[currentTile].neighbors.length; k++){
		nextTile = tiling.tiles[tiling.tiles[currentTile].neighbors[k]].id;
			
		//on vérifie que la nouvell tuile n'est pas celle d'ou l'on vient
		if (lastTile != -1){
			if (lastTile == nextTile){continue;}
		}
				
		//si on trouve le sommet dans cette tuile on le retient et on cherche la tuile suivante
		for(var l=0; l<tiling.tiles[nextTile].bounds.length/2; l++){
			if (dualDistance(coordVertex(tiling, currentTile, currentVertexIndex),coordVertex(tiling, nextTile, l))<margeErreur){
				if (dualDistance(coordVertex(tiling, nextTile, neighborVertex(tiling, nextTile, l, -1)),currentNeighbor)<margeErreur
			||dualDistance(coordVertex(tiling, nextTile, neighborVertex(tiling, nextTile, l, 1)),currentNeighbor)<margeErreur){
					bounds.push(newBounds[2*nextTile], newBounds[2*nextTile + 1]);
					lastTile = currentTile;
					currentTile = nextTile;
					currentVertexIndex = l;
					//si on a fait un tour complet par rapport au sommt on sort de la recursion
					if (currentTile == initiale){
						return true
					}
					return findNextTile(tiling, newBounds, initiale, currentTile, currentVertexIndex, lastTile, nextTile, bounds, neighbors, currentNeighbor, margeErreur, positionToId)
				}
			}
		}
	}
	return false
}

//calcule les centres de chaques tuile qui serviront de sommet pour les nouvelles tuiles
function createNewBounds(tiling){
	let newBounds =[];
	for(var i=0; i<tiling.tiles.length; i++){
		let meanX = 0;
		let meanY = 0;
		let count =0;
    for(var j=0; j<tiling.tiles[i].bounds.length/2; j++){
			meanX += tiling.tiles[i].bounds[2*j];
			meanY += tiling.tiles[i].bounds[2*j + 1];
			count+= 1
		}
    newBounds.push(meanX/count, meanY/count);
  }
	return newBounds
}

//rempli le dictionnaire positionToId avec les id correspondant
function createId(tiling, margeErreur, dico){
	let newId = [];
	let count = 0;
	
	for(var i=0; i<tiling.tiles.length; i++){
		for(var j=0; j<tiling.tiles[i].bounds.length/2; j++){
			let id = idProche(i, j, newId, tiling, margeErreur, dico);
			if (!id){
				newId.push([i,j]);
				dico.set(i.toString()+","+j.toString(), count);
				count += 1;
			}
			else{
				dico.set(i.toString()+","+j.toString(), id);
			}
		}
	}
	return
}

//renvoiele sommet voisin a vertex dans tile en tournant d un ou -1 pas en fonction de différence
function neighborVertex(tiling, tile, vertex, difference){
	return (vertex + difference + tiling.tiles[tile].bounds.length/2)%(tiling.tiles[tile].bounds.length/2);
}

//vérifie si un sommt à deja été exploité (a deja une tuile dans le nouveau pavage)
function nonParcouru(i,j, parcouru, tiling, margeErreur){
	for(var k=0; k<parcouru.length; k++){
		if (dualDistance(coordVertex(tiling, i, j),parcouru[k])<margeErreur){
			return false
		}
	}
	return true
}

//vérifie si un sommt à deja été identifié si oui renvoie son id sinon false
function idProche(i,j, listeId, tiling, margeErreur, dico){
	for(var k=0; k<listeId.length; k++){
		if (dualDistance(coordVertex(tiling, i, j),coordVertex(tiling, listeId[k][0], listeId[k][1]))<margeErreur){
			return dico.get(listeId[k][0].toString()+","+listeId[k][1].toString());
		}
	}
	return false
}

//renvoie les coordoné du sommt j de la tuile i
function coordVertex(tiling, i, j){
	return [tiling.tiles[i].bounds[2*j], tiling.tiles[i].bounds[2*j +1]];
}

//calcule la distance entre deux sommets en norme infini (elle s'appelle dual seulement pour eviter ls conflit de variable)
function dualDistance(coord1, coord2){
  let sq = 0;
  for(var i=0; i<coord1.length; i++){
    sq += Math.abs(coord1[i] - coord2[i]);
  }
  return sq
}
