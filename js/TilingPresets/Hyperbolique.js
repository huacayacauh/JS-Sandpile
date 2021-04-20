// HyperbolicPavage
// Source : http://www.malinc.se/noneuclidean/en/poincaretiling.php
Tiling.Hyperbolique = function({height,width,iterations}={}) {
  var tiles = [];
	let p = parseInt(height,10); // nbrCoté
	let q = parseInt(width,10);  // nbrAdjacent
	iterations = parseInt(iterations,10);

	tiles.push(Tile.makeInitialPolygon(p,q))
	d = Math.sqrt((Math.tan(Math.PI/2 - Math.PI/q) - Math.tan(Math.PI/p))/((Math.tan(Math.PI/2 - Math.PI/q) + Math.tan(Math.PI/p))));
	makeFirstLayer(tiles)
	console.log("FirstLayerDone");
	
	iterate(tiles,p,q,iterations);
	var neighbors2boundsHyperbolique = new Map();
	neighbors2boundsHyperbolique.set("!", default_neighbors2bounds(p));
	
	resetAllNeighbors(tiles);
  let tilesdict = new Map(tiles.map(i => [id2key(i.id), i]));
	findNeighborsEnhanced(tiles,tilesdict,neighbors2boundsHyperbolique);
	for(let i = 0;i<tiles.length;i++)
	{
		tiles[i].limit = p;
	}
	//tiles[6].sand = 3;
	console.log(tiles);
  return new Tiling(tiles);
};

function iterate(tiles,p,q,iterations)
{
	end = 1;
	nbrPrevious = p;
	tmpPrevious = 0;
	for(let iteration = 2; iteration<iterations;iteration++)
	{
		for(let i = end; i<nbrPrevious+end;i++)
		{
			indexParent = Math.floor((i-1)/5);
			makePoly(tiles,tiles[i].bounds,indexParent);
			tmpPrevious +=p;
		}
		end = nbrPrevious+end;
		nbrPrevious = tmpPrevious;
		tmpPrevious = 0;
	}
	
}


Tile.makeInitialPolygon = function(p,q){
	d = Math.sqrt((Math.tan(Math.PI /2 - Math.PI/q) - Math.tan(Math.PI/p))/((Math.tan(Math.PI /2 - Math.PI/q) + Math.tan(Math.PI/p))));
	
	var bounds = [];
	angle = 0;
	for(let i = 0; i<p;i++)
	{
		bounds.push(Math.cos(angle)*d);
		bounds.push(Math.sin(angle)*d);
		angle += 2*Math.PI/p;
	}
	return new Tile(["!",0],["1"],bounds,p);
}

function makeFirstLayer(tiles)
{
	tabCenterPolygon = tiles[0].bounds
	for(let i = 0; i<tabCenterPolygon.length;i+=2)
	{
		nextPtsX = (i+2) %(tabCenterPolygon.length);
		nextPtsY = (i+3) %(tabCenterPolygon.length);
		centerInverseCircle = findCenterInverseCircle(tabCenterPolygon[i],tabCenterPolygon[i+1],
													tabCenterPolygon[nextPtsX],tabCenterPolygon[nextPtsY])
		rayonCircleInverseX = tabCenterPolygon[i] - centerInverseCircle[0];
		rayonCircleInverseY = tabCenterPolygon[i+1] - centerInverseCircle[1];
		rayonCircleInverse = rayonCircleInverseX*rayonCircleInverseX + rayonCircleInverseY*rayonCircleInverseY;
		tiles.push(inversePoly(centerInverseCircle[0],centerInverseCircle[1],tabCenterPolygon,rayonCircleInverse,tiles.length));
	}
}
function makePoly(tiles,tabPolygonBase,indexParent)
{
	nbrAdd = 0
	boundsParent = tiles[indexParent].bounds;
	
	for(let i = 0; i<tabPolygonBase.length;i+=2)
	{
		nextPtsX = (i+2) %(tabPolygonBase.length);
		nextPtsY = (i+3) %(tabPolygonBase.length);
		isCommonToParent = false;
		for(let j =0; j<boundsParent.length;j+=2)
		{
			if(((tabPolygonBase[i] < boundsParent[j] + p_error && tabPolygonBase[i] > boundsParent[j] -p_error) && 
			(tabPolygonBase[i+1] < boundsParent[j+1] + p_error && tabPolygonBase[i+1] > boundsParent[j+1] -p_error) && 
			(tabPolygonBase[nextPtsX] < boundsParent[(j+2) %(boundsParent.length)] + p_error && tabPolygonBase[nextPtsX] > boundsParent[(j+2) %(boundsParent.length)] -p_error) && 
			(tabPolygonBase[nextPtsY] < boundsParent[(j+3) %(boundsParent.length)] + p_error && tabPolygonBase[nextPtsY] > boundsParent[(j+3) %(boundsParent.length)] -p_error))
			|| ((tabPolygonBase[nextPtsX] < boundsParent[j] + p_error && tabPolygonBase[nextPtsX] > boundsParent[j] -p_error) && 
			(tabPolygonBase[nextPtsY] < boundsParent[j+1] + p_error && tabPolygonBase[nextPtsY] > boundsParent[j+1] -p_error) && 
			(tabPolygonBase[i] < boundsParent[(j+2) %(boundsParent.length)] + p_error && tabPolygonBase[i] > boundsParent[(j+2) %(boundsParent.length)] -p_error) && 
			(tabPolygonBase[i+1] < boundsParent[(j+3) %(boundsParent.length)] + p_error && tabPolygonBase[i+1] > boundsParent[(j+3) %(boundsParent.length)] -p_error)))
			{
				isCommonToParent = true;
				console.log("Parent Find");
			}
		}
		if(isCommonToParent)
		{
			isCommonToParent = false;
			continue;
		}
		nextPtsX = (i+2) %(tabPolygonBase.length);
		nextPtsY = (i+3) %(tabPolygonBase.length);
		centerInverseCircle = findCenterInverseCircle(tabPolygonBase[i],tabPolygonBase[i+1],
													tabPolygonBase[nextPtsX],tabPolygonBase[nextPtsY])
		rayonCircleInverseX = tabPolygonBase[i] - centerInverseCircle[0];
		rayonCircleInverseY = tabPolygonBase[i+1] - centerInverseCircle[1];
		rayonCircleInverse = rayonCircleInverseX*rayonCircleInverseX + rayonCircleInverseY*rayonCircleInverseY;
		tiles.push(inversePoly(centerInverseCircle[0],centerInverseCircle[1],tabPolygonBase,rayonCircleInverse,tiles.length));
		for(let k = 0; k<tiles.length-1;k++)
		{
			if(tiles[k].bounds == tiles[tiles.length-1].bounds)
			{
				tiles.pop();
				console.log("Pop");
			}
		}
		nbrAdd += 1;
	}
	console.log("NombreDePolyAjouté " + nbrAdd);
}



function inversePoly(xM,yM,tabPtsInitial,normCercleInvert,indexPoly)
{
	var bounds = []
	for(let i = 0; i<tabPtsInitial.length;i+=2)
	{
		xBaseM = tabPtsInitial[i] -xM;
		yBaseM = tabPtsInitial[i+1] -yM;
		normM = xBaseM*xBaseM  + yBaseM*yBaseM;
		xBaseMInvert = normCercleInvert*xBaseM/normM;
		yBaseMInvert = normCercleInvert*yBaseM/normM;
		xBaseO = xBaseMInvert +xM;
		yBaseO = yBaseMInvert +yM;
		bounds.push(xBaseO,yBaseO);
		
	}
	return new Tile(["!",indexPoly],["2"],bounds,tabPtsInitial.length/2)
}



function findMediatrice2(xA,yA,xB,yB)
{
	// yA diff yB
	midPtsX = (xA+xB)/2;
	midPtsY = (yA+yB)/2;
	
	if(xB == xA)
	{
		return [0,midPtsY];
	}
	slopeSegment = (yB-yA)/(xB-xA);
	slopeMediatrice =  -1/slopeSegment;
	b = midPtsY - slopeMediatrice*midPtsX;
	return [slopeMediatrice,b]
}
function findCenterInverseCircle(xA,yA,xB,yB)
{
	normA = xA*xA + yA*yA;
	if(yA == yB) //SegmentPoly Horizontal
	{
		x = (xA+xB)/2;
		mediaAAInvert = findMediatrice2(xA,yA,xA/normA,yA/normA);
		return [x,mediaAAInvert[0]*x + mediaAAInvert[1]];
	}
	else if (yA == yA/normA) //SegmentInverse Horizontal
	{
		x = (xA+(xA/normA))/2
		mediaAB = findMediatrice2(xA,yA,xB,yB);
		return [x,mediaAB[0]*x + mediaAB[1]];
	}
	else
	{
		mediaAB = findMediatrice2(xA,yA,xB,yB);
		normA = xA*xA + yA*yA;
		mediaAAInvert = findMediatrice2(xA,yA,xA/normA,yA/normA);
		x = (mediaAAInvert[1] - mediaAB[1])/(mediaAB[0] - mediaAAInvert[0]);
		return [x,mediaAB[0]*x+mediaAB[1]];
	}
}