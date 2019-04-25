var SPEED = 10;

var PHI = (1.0 + Math.sqrt(5)) / 2.0;

//compteur des faces/ arêtes / sommets
var tCount = 0;
var vCount = 0;
var eCount = 0;

//liste des traingles générés
var triangles = [];

//remet les variables golbales à zero
reset = function(){
	tCount = 0;
	vCount = 0;
	eCount = 0;
	trinagles = []
}

//retourne un point entre deux points selon un ratio
interpolatePoints = function (p1, p2, ratio) {
    var x = p1.x * (1.0 - ratio) + p2.x * (ratio);
    var y = p1.y * (1.0 - ratio) + p2.y * (ratio);
    return {x: x, y: y};
    
};


class Vertex{
    constructor(id, v){
        this.id = id;
        this.x = v.x;
        this.y = v.y;
    }
}

class Edge{
    constructor(id, vertexA, vertexB){
        this.id = id;
        this.vertexA = vertexA;
        this.vertexB = vertexB;

        this.triangleA = null; //triangle adjacent A
        this.triangleB = null; //triangle adjacent B

        // type = "01" ou "02" ou "12"
        this.typeEA = null;  //spéficie quelle est le type d'arrêtes selon le triangle A
        this.typeEB = null;  //spéficie quelle est le type d'arrêtes selon le triangle B

        //si cette arête constitue l'arête passant par les sommets 0 et 1 du triangle A, alors 
        //son type sera "01"
    }
}

class Triangle{
    constructor(id, type, vertices){
        this.id = id;
        this.type = type; //= "hd"(half-kite) ou "hd"(half-dart)
        this.vertices = vertices;

        //au cours de la génération du pavage de penrose, une arrète
        //peut être divisée en deux au plus
        this.edges01 = []; //arête passant par les sommets 0 et 1
        this.edges02 = []; //arête passant par les sommets 0 et 2
        this.edges12 = []; //arête passant par les sommets 1 et 2
    }
}

//divise l'arête e passant par le sommet v
//met à jours les triangles incidents du changement
splitEdge = function(e, v){
    var memVB = e.vertexB;

    var tA = e.triangleA; var tEA = e.typeEA;
    var tB = e.triangleB; var tEA = e.typeEB;

    e.vertexB = v;
    var newE = new Edge(eCount++, v, memVB);

    newE.triangleA = e.triangleA;
    newE.triangleB = e.triangleB;
    newE.typeEA = e.typeEA;
    newE.typeEB = e.typeEB;
    
    if(tA !== null){
    	
        switch(e.typeEA){
            case "01" : tA.edges01 = [e, newE]; break;
            case "02" : tA.edges02 = [e, newE]; break;
            case "12" : tA.edges12 = [e, newE]; break;
            
        }
    }

    if(tB !== null){
    	
        switch(e.typeEB){
            case "01" : tB.edges01 = [e, newE]; break;
            case "02" : tB.edges02 = [e, newE]; break;
            case "12" : tB.edges12 = [e, newE]; break;
            
        }
    }
    
}

//à partir du couples de sous arête d'une arête constituant un côté de triangle
//renvoi la sous arête possédant le sommet v
guessEdge = function(v, edges){
    return (v.id === edges[0].vertexA.id ||
            v.id === edges[0].vertexB.id) ? edges[0] : edges[1];
}

//met à jour l'arête du changement d'un de ses triangles incidents
updateEdge = function(t, edge, newT, newTypeE){

    if (t.id === edge.triangleA.id){
        edge.triangleA = newT;
        edge.typeEA = newTypeE;
    }

    else{
        edge.triangleB = newT;
        edge.typeEB = newTypeE;
    }
}

//renvoi le sommet du milieu de larête
//procède par élimination avec le couple se sous arêtes edges 
//et d'un sommet du triangle appartenant à l'arête v
guessVertex = function(v, edges){
	return (v.id === edges[0].vertexA.id) ? edges[0].vertexB : 
	                                       (v.id === edges[1].vertexA.id) ? edges[1].vertexB : 
	                                                                        edges[1].vertexA;
}

//divise un triangle de type "hk"
// en 3 triangles
// lors de la division on modifie les paramète du triangle t
// pour qu'il correspondent à un des triagles générés
splitHK = function(t){
    var v0 = t.vertices[0];
    var v1 = t.vertices[1];
    var v2 = t.vertices[2];

    var p2 = null;

    if(t.edges01.length === 1){
        p2 = new Vertex(vCount++, interpolatePoints(v0, v1, 1.0 / PHI));
        splitEdge(t.edges01[0], p2);
    }

    var p1 = null;

    if(t.edges02.length === 1){
        p1 = new Vertex(vCount++, interpolatePoints(v0, v2,1.0 - 1.0 / PHI));
        
        splitEdge(t.edges02[0], p1);
       
    }

    if (p1 === null){
        p1 = guessVertex(v0, t.edges02);
    }

    if (p2 === null){
        p2 = guessVertex(v0, t.edges01);
    }

    var edge0p2 = guessEdge(v0, t.edges01);
    var edge1p2 = guessEdge(v1, t.edges01);

    var edge0p1 = guessEdge(v0, t.edges02);
    

    var edge2p1 = guessEdge(v2, t.edges02);

    var edgep1p2 = new Edge(eCount++, p1, p2); 
    var edge2p2 = new Edge(eCount++, 2, p2); 

    var edge12 = t.edges12[0];

    var t2 = new Triangle(tCount++, "hk", [v2, p2, p1]);
    var t3 = new Triangle(tCount++, "hk", [v2, p2, v1]);

    t.vertices = [p1, v0, p2];
    t.type = "hd"

    t.edges01 = [edge0p1]; 
    t.edges02 = [edgep1p2];
    t.edges12 = [edge0p2];

    t2.edges01 = [edge2p2]; 
    t2.edges02 = [edge2p1];
    t2.edges12 = [edgep1p2];

    t3.edges01 = [edge2p2]; 
    t3.edges02 = [edge12];
    t3.edges12 = [edge1p2];

    updateEdge(t, edge0p2, t, "12");
    updateEdge(t, edge1p2, t3, "12");

    updateEdge(t, edge0p1, t, "01");
    updateEdge(t, edge2p1, t2, "02");

    updateEdge(t, edge12, t3, "02");

    edgep1p2.triangleA = t; edgep1p2.typeEA = "02";
    edgep1p2.triangleB = t2; edgep1p2.typeEB = "12";
    edgep1p2.vertexA = p1; 
    edgep1p2.vertexA = p2;

    edge2p2.triangleA = t2; edge2p2.typeEA = "01";
    edge2p2.triangleB = t3; edge2p2.typeEB = "01";
    edge2p2.vertexA = v2; 
    edge2p2.vertexA = p2;

    triangles.push(t2);
    triangles.push(t3);

}

// divise un triangle de type "hd"
// en 2 triangles
// lors de la division on modifie les paramète du triangle t
// pour qu'il correspondent à un des triagles générés
splitHD = function(t){

	var v0 = t.vertices[0];
    var v1 = t.vertices[1];
    var v2 = t.vertices[2];

    var p1 = null;

    if(t.edges12.length === 1){
        p1 = new Vertex(vCount++, interpolatePoints(v1, v2,1.0 / PHI));
        splitEdge(t.edges12[0], p1);
    }

    if (p1 === null){
        p1 = guessVertex(v1, t.edges12);
    }

    var edge01 = t.edges01[0];
    var edge02 = t.edges02[0];

    var edge1p1 = guessEdge(v1, t.edges12);
    var edge2p1 = guessEdge(v2, t.edges12);

    var edge0p1 = new Edge(eCount++, v0, p1);
    
    var t2 = new Triangle(tCount++, "hd", [p1, v2, v0]);

    t.vertices = [v1, v0, p1];
    t.type = "hk";

    t.edges01 = [edge01];
    t.edges02 = [edge1p1];
    t.edges12 = [edge0p1];

    t2.edges01 = [edge2p1];
    t2.edges02 = [edge0p1];
    t2.edges12 = [edge02];

    updateEdge(t, edge1p1, t, "02");
    updateEdge(t, edge01, t, "01");

    updateEdge(t, edge2p1, t2, "01");
    updateEdge(t, edge02, t2, "12");

    edge0p1.triangleA = t; edge0p1.typeEA = "12";
    edge0p1.triangleB = t2; edge0p1.typeEB = "02";
    edge0p1.vertexA = v0; 
    edge0p1.vertexA = p1;

    triangles.push(t2);

}

//renvoi le triangle adjacent du triangle d'index tId
//par rapport à l'une de ses arêtes edge
getAdjByEdge = function(tId, edge){
    return (tId === edge.triangleA.id)? edge.triangleB:
                                        edge.triangleA;
}

//renvoi une liste d'index des triangles adjacents au triangle t
getAdj = function(t){
    var adj = []

    var t1 = getAdjByEdge(t.id, t.edges01[0]);
    if (t1 !== null) adj.push(t1.id)

    var t2 = getAdjByEdge(t.id, t.edges02[0]);
    if (t2 !== null) adj.push(t2.id)

    var t3 = getAdjByEdge(t.id, t.edges12[0]);
    if (t3 !== null) adj.push(t3.id)

    return adj;

}

//créer un gros triangle hk et le met dan la liste traingles
makeHK = function(size){

	//var xMid = ( (size+1) * Math.cos(Math.PI / 5.0))/3
	var yMid = (size * Math.sin(Math.PI / 5.0))/2;

    var v0 = new Vertex(vCount++, {x: 0 - size/2, y: 0 + yMid});
    var v1 = new Vertex(vCount++, {x: size - size/2, y: 0+ yMid});
    var v2 = new Vertex(vCount++, {x: size * Math.cos(Math.PI / 5.0) - size/2, y: -size * Math.sin(Math.PI / 5.0)+ yMid});
    

    var edge01 = new Edge(eCount++, v0, v1);
    var edge02 = new Edge(eCount++, v0, v2);
    var edge12 = new Edge(eCount++, v1, v2);

    var t = new Triangle(tCount++, "hk", [v0, v1, v2]);

    t.edges01 = [edge01];
    t.edges02 = [edge02];
    t.edges12 = [edge12];

    edge01.triangleA = t; edge01.typeEA = "01";
    edge02.triangleA = t; edge02.typeEA = "02";
    edge12.triangleA = t; edge12.typeEA = "12";

    triangles.push(t);

    return t;
}

//créer un gros triangle hd et le met dan la liste traingles
makeHD = function(size){

	//var xMid = ( (size+1) * Math.cos(Math.PI / 5.0))/3
	var yMid = (size * Math.sin( (3*Math.PI) / 5.0))/2;

    var v0 = new Vertex(vCount++, {x: 0 - size/2, y: 0 + yMid});
    var v1 = new Vertex(vCount++, {x: size - size/2, y: 0+ yMid});
    var v2 = new Vertex(vCount++, {x: size * Math.cos((3*Math.PI) / 5.0) - size/2, y: -size * Math.sin((3*Math.PI) / 5.0)+ yMid});
    

    var edge01 = new Edge(eCount++, v0, v1);
    var edge02 = new Edge(eCount++, v0, v2);
    var edge12 = new Edge(eCount++, v1, v2);

    var t = new Triangle(tCount++, "hd", [v0, v1, v2]);

    t.edges01 = [edge01];
    t.edges02 = [edge02];
    t.edges12 = [edge12];

    edge01.triangleA = t; edge01.typeEA = "01";
    edge02.triangleA = t; edge02.typeEA = "02";
    edge12.triangleA = t; edge12.typeEA = "12";

    triangles.push(t);

    return t;
}

//divise tous les traingles contenus dans la liste traingles
iterate = function(){
	var fixedLength = triangles.length;
	for(var i = 0; i < fixedLength; i++){
		if(triangles[i].type === "hk")
			splitHK(triangles[i]);
		else if(triangles[i].type === "hd")
			splitHD(triangles[i]);
	}
}

//créer un pavage de penrose diviser n fois
//les triangles générés son dans la liste triangles
//la première itération se fait sur un triangle hk
generateHKTiling = function(n){
	reset();
	var size = 300;
	makeHK(size);

	for(var i = 0; i < n; i++)
		iterate();
}

//créer un pavage de penrose diviser n fois
//les triangles générés son dans la liste triangles
//la première itération se fait sur un triangle hd
generateHDTiling = function(n){
	reset();
	var size = 300;
	makeHD(size);

	for(var i = 0; i < n; i++)
		iterate();
}

//créer un tas de sable abélien à partir
//d'une liste de triangles
makePenroseSandpile = function(data){

    var cmap = [new THREE.Color(0xffffff),
                new THREE.Color(0xaaaaaa),
                new THREE.Color(0x555555),
                new THREE.Color(0xff9900),
                new THREE.Color(0xff0000)];

    var pos = [];
    var col = [];
    var tils = [];
    
    for(var i = 0; i < data.length; i++){ 


        var id = i;
        var neighboors = [];
        var pointsIds = [];

        for(var j=0; j<3; j++){
            pointsIds.push(id*3 + j);
        }
        
        pos.push(data[i].vertices[0].x, data[i].vertices[0].y, 0); col.push(0, 0, 0);
        pos.push(data[i].vertices[1].x, data[i].vertices[1].y, 0); col.push(0, 0, 0);
        pos.push(data[i].vertices[2].x, data[i].vertices[2].y, 0); col.push(0, 0, 0);

        neighboors = getAdj(data[i]);

        
        var s = 0;

        var tile = new Tile(id, neighboors, pointsIds);
        
        tile.sand = s;

        tils.push(tile);

    }
    
    return new Tiling(pos, col, tils, 3, cmap);
    
}




