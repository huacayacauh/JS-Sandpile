
function findNeighborsEnhanced(tiles,tilesdict,n2b){
  // construct
  // * segments = list of segments (Array of 4 coordinates + tile idkey + neighbor index)
  //   for undefined neighbors
  // * segmentsMap = segmentkey -> tile id, neighbors' index
  var segments = [];
  var segmentsMap = new Map();
  tiles.forEach(function(tile){
    for(let i=0; i<tile.neighbors.length; i++){
      if(tile.neighbors[i] == undefined){
        // found an undefined neighbor
        // caution: segment points need to be ordered (up to p_error)
        //          so that [x,y,x',y']=[x',y',x,y].
        //          smallest x first, and if x ~equal then smallest y first
        //          
        let segment = [];
        let x1 = tile.bounds[n2b.get(tile.id[0])[i][0]];
        let y1 = tile.bounds[n2b.get(tile.id[0])[i][1]];
        let x2 = tile.bounds[n2b.get(tile.id[0])[i][2]];
        let y2 = tile.bounds[n2b.get(tile.id[0])[i][3]];
        if( x2-x1>=p_error || (Math.abs(x2-x1)<p_error && y2-y1>=p_error) ){
          // normal order
          segment.push(x1);
          segment.push(y1);
          segment.push(x2);
          segment.push(y2);
        }
        else{
          // reverse order
          segment.push(x2);
          segment.push(y2);
          segment.push(x1);
          segment.push(y1);
        }
        // something unique for segment2key...
        segment.push(id2key(tile.id));
        segment.push(i);
        // add to datastructures
        segments.push(segment);
        segmentsMap.set(segment2key(segment),new TileSegment(tile.id,i));
      }
    }
  });
  // sort the list of segments lexicographicaly
  // takes into account rounding errors (up to p_error)
  segments.sort(function(s1,s2){
    for(let i=0; i<s1.length-2; i++){ // -2 to exclude idkey and index
      if(Math.abs(s1[i]-s2[i])>=p_error){return s1[i]-s2[i];}
    }
    return 0;
  });
  var fn = 0;
  for(let i=0; i<segments.length-1; i++){
	  
	if(segments[i][0] == segments[i][2]) // not an affine function
	{
		minY = 0
		maxY = 0
		if(segments[i][1] > segments[i][3])
		{
			maxY = segments[i][1]
			minY = segments[i][3]
		}
		else
		{
			maxY = segments[i][3]
			minY = segments[i][1]
		}
		for(let j=i+1; j<segments.length;j++)
		{
			if(segments[i][2] < segments[j][0]) // We already pass the segment i
			{
				break;
			}
			minYj = 0
			maxYj = 0
			if(segments[j][1] > segments[j][3])
			{
				maxYj = segments[j][1]
				minYj = segments[j][3]
			}
			else
			{
				maxYj = segments[j][3]
				minYj = segments[j][1]
			}
			if(maxY - p_error< minYj) // They have more than one point in common
			{
				continue;
			}
			
			if((segments[j][0] == segments[j][2]) && (((segments[j][1] < maxY + p_error) && (segments[j][1] > minY -p_error))||
			((segments[j][3] < maxY + p_error) && (segments[j][3] > minY -p_error))))
			{ // It's a vertical segment and one of the point in on the segment
				fn++;
				let ts1=segmentsMap.get(segment2key(segments[i]));
				let ts2=segmentsMap.get(segment2key(segments[j]));
				
				if(!containElt(tilesdict.get(id2key(ts1.id)).neighbors,ts2.id)) // On ajoute si il y est pas déjà
				{
					tilesdict.get(id2key(ts1.id)).neighbors.push(ts2.id);
				}
				if(!containElt(tilesdict.get(id2key(ts2.id)).neighbors,ts1.id))
				{
					tilesdict.get(id2key(ts2.id)).neighbors.push(ts1.id);
				}
			}
		}
		continue;
	}		
	
	a = (segments[i][3] - segments[i][1])/(segments[i][2] - segments[i][0]); // (yB - yA)/(xB-xA)
	b = segments[i][1] - a*segments[i][0]; // yA - a*xA = b
	for(let j=i+1; j<segments.length; j++)
	{ 
		if(segments[j][0] > segments[i][2] - p_error) // We already pass the segment i
		{
			break;
		}
		// The segments j have an x value in the good range :
		if( ((a*segments[j][0]+b < segments[j][1] +p_error) && (a*segments[j][0]+b > segments[j][1] - p_error))
			&& ((segments[j][3] - segments[j][1])/(segments[j][2] - segments[j][0]) < a + p_error && 
			(segments[j][3] - segments[j][1])/(segments[j][2] - segments[j][0]) > a -p_error))
			// a*xJ + b is a pts on our segment and the j segment have the same slope as i segment
		{
			fn++;
			let ts1=segmentsMap.get(segment2key(segments[i]));
			let ts2=segmentsMap.get(segment2key(segments[j]));
			
			if(!containElt(tilesdict.get(id2key(ts1.id)).neighbors,ts2.id)) // Only add if he isn't already here
			{
				tilesdict.get(id2key(ts1.id)).neighbors.push(ts2.id);
			}
			if(!containElt(tilesdict.get(id2key(ts2.id)).neighbors,ts1.id))
			{
				tilesdict.get(id2key(ts2.id)).neighbors.push(ts1.id);
			}
		}
	}		
  }
 for(let i=0; i<tiles.length;i++) // Do not work, somethings else modify the segment value ( probably add value )
  {
	/*newLimit = 0
	for(let j=0; j<tiles[i].neighbors.length;j++)
	{
		if(tiles[i].neighbors[j] != undefined)
		{
		  newLimit++
		}
	}
	if(newLimit > tiles[i].limit)
	{
		tiles[i].limit = newLimit
	}*/
	tiles[i].limit = tiles[i].neighbors.length
  }
  return fn; // side effect
}

function containElt(tab,elt){
	for(let i = 0; i<tab.length;i++)
	{
		if(tab[i] == elt)
		{
			return true;
		}
	}
	return false;
}