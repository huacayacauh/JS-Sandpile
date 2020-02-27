// 	#############  PENROSETILING.JS  ###############
//	 		Authors : 	DARRIGO Valentin
// 	################################################
// 
// 	To help you dig into this code, the main parts
// 	in this file are indexed via comments.	
//
//		Ex:  [ 2.4 ] - Something
//
//	References to other parts of the app are linked
//	via indexes.
//
//		### indexes a section
//		--- indexes a sub-section
//
//	---
//
//	All relations between indexing in files can be
// 	found on our GitHub :
//
// 		https://github.com/huacayacauh/JS-Sandpile
//
// 	---
//
//  This file is under CC-BY.
//
//	Feel free to edit it as long as you provide 
// 	a link to its original source.
//
// 	################################################


// ################################################
//
// 	[ 1.0 ] 	Penrose generation main variables
//
// ################################################

var PHI = (1.0 + Math.sqrt(5)) / 2.0;

//compteur des faces/ arêtes / sommets
var tCount = 0;
var vCount = 0;
var eCount = 0;

//liste des triangles générés
var triangles = [];

var cCount = 0;
var cells = [];

// ################################################
//
// 	[ 2.0 ] 	Penrose generation main functions
//
// ################################################

//remet les variables golbales à zero
reset = function(){
	tCount = 0;
	vCount = 0;
	eCount = 0;
    cCount = 0;
	triangles = []
    cells = []
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

    if (edge.triangleA !== null && t.id === edge.triangleA.id){
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


//renvoi le triangle adjacent du triangle d'index tId
//par rapport à l'une de ses arêtes edge
getAdjByEdge = function(tId, edge){
    return (edge.triangleA !== null && tId === edge.triangleA.id)? edge.triangleB:
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


// ################################################
//
// 	[ 3.0 ] 	Penrose generation split functions
//
// ################################################

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

/*SPLIT RHOMBUS*/

splitHKR = function(t){


    var v0 = t.vertices[0];
    var v1 = t.vertices[1];
    var v2 = t.vertices[2];

    var p1 = null;

    if(t.edges02.length === 1){
        p1 = new Vertex(vCount++, interpolatePoints(v0, v2, 1.0 / PHI));
        splitEdge(t.edges02[0], p1);
    }

    if (p1 === null){
        p1 = guessVertex(v0, t.edges02);
    }

    var edge0p1 = guessEdge(v0, t.edges02);
    var edge2p1 = guessEdge(v2, t.edges02);

    var edge1p1 = new Edge(eCount++, v1, p1); 

    var edge12 = t.edges12[0];
    var edge01 = t.edges01[0];

    var t2 = new Triangle(tCount++, "hk", [v1, v2, p1]);

    t.vertices = [p1, v0, v1];

    t.type = "hd"

    
    t.edges01 = [edge0p1]; 
    t.edges02 = [edge1p1];
    t.edges12 = [edge01];

    t2.edges01 = [edge12]; 
    t2.edges02 = [edge1p1];
    t2.edges12 = [edge2p1];

    updateEdge(t, edge0p1, t, "01");
    updateEdge(t, edge01 , t, "12");

    updateEdge(t, edge2p1, t2, "12");
    updateEdge(t, edge12, t2, "01");

    edge1p1.triangleA = t2; edge1p1.typeEA = "02";
    edge1p1.triangleB = t; edge1p1.typeEB = "02";
    edge1p1.vertexA = p1; 
    edge1p1.vertexB = v1;
    console.log(p1.id == v1.id);

   

    triangles.push(t2);

}

splitHDR = function(t){

    
    var v0 = t.vertices[0];
    var v1 = t.vertices[1];
    var v2 = t.vertices[2];

    var p1 = null;

    

    if(t.edges12.length === 1){

        p1 = new Vertex(vCount++, interpolatePoints(v2, v1,1.0 / PHI));
        splitEdge(t.edges12[0], p1);
       
    }

    if (p1 === null){
        p1 = guessVertex(v1, t.edges12);
    }

    var p2 = null;

    if(t.edges02.length === 1){
        p2 = new Vertex(vCount++, interpolatePoints(v2, v0,1.0 / PHI));

        splitEdge(t.edges02[0], p2);

    }

    if (p2 === null){
        p2 = guessVertex(v2, t.edges02);
    }

    var edge01 = t.edges01[0];
    

    var edge0p2 = guessEdge(v0, t.edges02);


    var edge2p2 = guessEdge(v2, t.edges02);

    var edge1p1 = guessEdge(v1, t.edges12);
    var edge2p1 = guessEdge(v2, t.edges12);

    var edge0p1 = new Edge(eCount++, v0, p1);
    var edgep1p2 = new Edge(eCount++, p1, p2);


    
    var t2 = new Triangle(tCount++, "hk", [p1, v0, p2]);
    var t3 = new Triangle(tCount++, "hd", [p1, v0, v1]);

    t.vertices = [p2, v2, p1];
    t.type = "hd";

    t.edges01 = [edge2p2];
    t.edges02 = [edgep1p2];
    t.edges12 = [edge2p1];

    t2.edges01 = [edge0p1];
    t2.edges02 = [edgep1p2];
    t2.edges12 = [edge0p2];

    t3.edges01 = [edge0p1];
    t3.edges02 = [edge1p1];
    t3.edges12 = [edge01];


    updateEdge(t, edge2p2, t, "01");

    updateEdge(t, edge2p1, t, "12");

    updateEdge(t, edge0p2, t2, "12");

    updateEdge(t, edge01, t3, "12");
    updateEdge(t, edge1p1, t3, "02");

    edge0p1.triangleA = t2; edge0p1.typeEA = "01";
    edge0p1.triangleB = t3; edge0p1.typeEB = "01";
    edge0p1.vertexA = v0; 
    edge0p1.vertexB = p1;

    edgep1p2.triangleA = t2; edgep1p2.typeEA = "02";
    edgep1p2.triangleB = t; edgep1p2.typeEB = "02";
    edgep1p2.vertexA = p1; 
    edgep1p2.vertexB = p2;

    triangles.push(t2);
    triangles.push(t3);

    var r = Math.sqrt((p2.x-v0.x)*(p2.x-v0.x) + (p2.y-v0.y)*(p2.y-v0.y)) ;
    //console.log(r)
    if (isNaN(r)){
        console.log("problème");
        console.log(p2.x);
        console.log(p2.y);
        console.log(p2);
    }


}



//créer un gros triangle hk et le met dan la liste traingles
makeHK = function(size){

	var xMid = (size * Math.cos(Math.PI / 5.0))/3;
	console.log(xMid);
	var yMid = (size * Math.sin(Math.PI / 5.0))/4;
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

}

makeSun = function(size){
    
    var v0 = new Vertex(vCount++, {x: 0, y:0});
    var v1 = new Vertex(vCount++, {x: - size * Math.cos(Math.PI / 5.0) , y: size * Math.sin(Math.PI / 5.0)});
    var v2 = new Vertex(vCount++, {x: -size, y:0});
    var mem = v2;
    
    var edge01 = new Edge(eCount++, v0, v1);
    var edge09 = new Edge(eCount++, v0, v2);
    var edge0  = new Edge(eCount++, v1, v2);

    var t0 = new Triangle(tCount++, "hk", [v0, v1, v2]);

    t0.edges01 = [edge01];
    t0.edges02 = [edge09];
    t0.edges12 = [edge0];

    edge01.triangleA = t0; edge01.typeEA = "01";
    edge09.triangleA = t0; edge09.typeEA = "02";
    edge0.triangleA = t0; edge0.typeEA = "12";

    triangles.push(t0);
    /*****************************************************************/
    v2 = new Vertex(vCount++, {x: - size * Math.cos( (2*Math.PI) / 5.0) , y: size * Math.sin( (2*Math.PI) / 5.0)});

    var edge12 = new Edge(eCount++, v0, v2);
    var edge1  = new Edge(eCount++, v1, v2);


    var t1 = new Triangle(tCount++, "hk", [v0, v1, v2]);
    t1.edges01 = [edge01];
    t1.edges02 = [edge12];
    t1.edges12 = [edge1];


    edge01.triangleB = t1; edge01.typeEB = "01";
    edge12.triangleA = t1; edge12.typeEA = "02";
    edge1.triangleA = t1; edge1.typeEA = "12";

    triangles.push(t1);

    /*****************************************************************/
    v1 = new Vertex(vCount++, {x: - size * Math.cos( (3*Math.PI) / 5.0) , y: size * Math.sin( (3*Math.PI) / 5.0)});

    
    var edge23 = new Edge(eCount++, v0, v1);
    var edge2  = new Edge(eCount++, v1, v2);

    var t2 = new Triangle(tCount++, "hk", [v0, v1, v2]);
    t2.edges01 = [edge23];
    t2.edges02 = [edge12];
    t2.edges12 = [edge2];


    edge12.triangleB = t2; edge12.typeEB = "02";    
    edge23.triangleA = t2; edge23.typeEA = "01";
    edge2.triangleA = t2; edge2.typeEA = "12";

    triangles.push(t2);
    
    
    /*****************************************************************/
    v2 = new Vertex(vCount++, {x: - size * Math.cos( (4*Math.PI) / 5.0) , y: size * Math.sin( (4*Math.PI) / 5.0)});

    var edge34 = new Edge(eCount++, v0, v2);
    var edge3  = new Edge(eCount++, v1, v2);

    var t3 = new Triangle(tCount++, "hk", [v0, v1, v2]);
    t3.edges01 = [edge23];
    t3.edges02 = [edge34];
    t3.edges12 = [edge3];


    edge23.triangleB = t3; edge23.typeEB = "01";    
    edge34.triangleA = t3; edge34.typeEA = "02";
    edge3.triangleA = t3; edge3.typeEA = "12";

    triangles.push(t3);
   
   /*****************************************************************/
    v1 = new Vertex(vCount++, {x: - size * Math.cos( (5*Math.PI) / 5.0) , y: size * Math.sin( (5*Math.PI) / 5.0)});

    var edge45 = new Edge(eCount++, v0, v1);
    var edge4  = new Edge(eCount++, v1, v2);

    var t4 = new Triangle(tCount++, "hk", [v0, v1, v2]);
    t4.edges01 = [edge45];
    t4.edges02 = [edge34];
    t4.edges12 = [edge4];


    edge34.triangleB = t4; edge34.typeEB = "02";    
    edge45.triangleA = t4; edge45.typeEA = "01";
    edge4.triangleA = t4; edge4.typeEA = "12";

    triangles.push(t4);

    /*****************************************************************/
    v2 = new Vertex(vCount++, {x: - size * Math.cos( (6*Math.PI) / 5.0) , y: size * Math.sin( (6*Math.PI) / 5.0)});

    var edge56 = new Edge(eCount++, v0, v2);
    var edge5  = new Edge(eCount++, v1, v2);

    var t5 = new Triangle(tCount++, "hk", [v0, v1, v2]);
    t5.edges01 = [edge45];
    t5.edges02 = [edge56];
    t5.edges12 = [edge5];


    edge45.triangleB = t5; edge45.typeEB = "01";    
    edge56.triangleA = t5; edge56.typeEA = "02";
    edge5.triangleA = t5; edge5.typeEA = "12";

    triangles.push(t5);

    /*****************************************************************/
    v1 = new Vertex(vCount++, {x: - size * Math.cos( (7*Math.PI) / 5.0) , y: size * Math.sin( (7*Math.PI) / 5.0)});

    var edge67 = new Edge(eCount++, v0, v1);
    var edge6  = new Edge(eCount++, v1, v2);

    var t6 = new Triangle(tCount++, "hk", [v0, v1, v2]);
    t6.edges01 = [edge67];
    t6.edges02 = [edge56];
    t6.edges12 = [edge6];


    edge56.triangleB = t6; edge56.typeEB = "02";    
    edge67.triangleA = t6; edge67.typeEA = "01";
    edge6.triangleA = t6; edge6.typeEA = "12";

    triangles.push(t6);

    /*****************************************************************/
    v2 = new Vertex(vCount++, {x: - size * Math.cos( (8*Math.PI) / 5.0) , y: size * Math.sin( (8*Math.PI) / 5.0)});

    var edge78 = new Edge(eCount++, v0, v2);
    var edge7  = new Edge(eCount++, v1, v2);

    var t7 = new Triangle(tCount++, "hk", [v0, v1, v2]);
    t7.edges01 = [edge67];
    t7.edges02 = [edge78];
    t7.edges12 = [edge7];


    edge67.triangleB = t7; edge67.typeEB = "01";    
    edge78.triangleA = t7; edge78.typeEA = "02";
    edge7.triangleA = t7; edge7.typeEA = "12";

    triangles.push(t7);

    /*****************************************************************/
    v1 = new Vertex(vCount++, {x: - size * Math.cos( (9*Math.PI) / 5.0) , y: size * Math.sin( (9*Math.PI) / 5.0)});

    var edge89 = new Edge(eCount++, v0, v2);
    var edge8  = new Edge(eCount++, v1, v2);

    var t8 = new Triangle(tCount++, "hk", [v0, v1, v2]);
    t8.edges01 = [edge89];
    t8.edges02 = [edge78];
    t8.edges12 = [edge8];


    edge78.triangleB = t8; edge78.typeEB = "02";    
    edge89.triangleA = t8; edge89.typeEA = "01";
    edge8.triangleA = t8; edge8.typeEA = "12";

    triangles.push(t8);

    /*****************************************************************/
    v2 = mem;

    var edge9  = new Edge(eCount++, v1, v2);

    var t9 = new Triangle(tCount++, "hk", [v0, v1, v2]);
    t9.edges01 = [edge89];
    t9.edges02 = [edge09];
    t9.edges12 = [edge9];

    edge89.triangleB = t9; edge89.typeEB = "01";    
    edge09.triangleB = t9; edge09.typeEB = "02";
    edge9.triangleA = t9; edge9.typeEA = "12";

    triangles.push(t9);
}

//créer un gros triangle hd et le met dan la liste traingles
makeStar = function(size){

    var v1 = new Vertex(vCount++, {x: 0 , y: 0 });
    var v0 = new Vertex(vCount++, {x: -size , y: 0 });
    var v2 = new Vertex(vCount++, {x: -(size*PHI) * Math.cos(Math.PI / 5.0), y: (size*PHI) * Math.sin(Math.PI / 5.0)})
    var mem = v0;

    var edge09 = new Edge(eCount++, v0, v1);
    var edge0 = new Edge(eCount++, v0, v2);
    var edge01 = new Edge(eCount++, v1, v2);

    var t0 = new Triangle(tCount++, "hd", [v0, v1, v2]);

    t0.edges01 = [edge09];
    t0.edges02 = [edge0];
    t0.edges12 = [edge01];

    edge09.triangleA = t0; edge09.typeEA = "01";
    edge0.triangleA = t0; edge0.typeEA = "02";
    edge01.triangleA = t0; edge01.typeEA = "12";

    triangles.push(t0);

    /**************************************************/
    var v0 = new Vertex(vCount++, {x: -(size) * Math.cos( (Math.PI*2) / 5.0), y: (size) * Math.sin( (Math.PI*2) / 5.0)})

    var edge12 = new Edge(eCount++, v0, v1);
    var edge1 = new Edge(eCount++, v0, v2);

    var t1 = new Triangle(tCount++, "hd", [v0, v1, v2]);

    t1.edges01 = [edge12];
    t1.edges02 = [edge1];
    t1.edges12 = [edge01];

    edge12.triangleA = t1; edge12.typeEA = "01";
    edge1.triangleA = t1; edge1.typeEA = "02";
    edge01.triangleB = t1; edge01.typeEB = "12";

    triangles.push(t1);

    /**************************************************/
    var v2 = new Vertex(vCount++, {x: -(size*PHI) * Math.cos( (Math.PI*3) / 5.0), y: (size*PHI) * Math.sin( (Math.PI*3) / 5.0)})

    var edge23 = new Edge(eCount++, v1, v2);
    var edge2 = new Edge(eCount++, v0, v2);

    var t2 = new Triangle(tCount++, "hd", [v0, v1, v2]);

    t2.edges01 = [edge12];
    t2.edges02 = [edge2];
    t2.edges12 = [edge23];

    edge23.triangleA = t2; edge23.typeEA = "12";
    edge2.triangleA = t2; edge2.typeEA = "02";
    edge12.triangleB = t2; edge12.typeEB = "01";

    triangles.push(t2);

    /**************************************************/
    var v0 = new Vertex(vCount++, {x: -(size) * Math.cos( (Math.PI*4) / 5.0), y: (size) * Math.sin( (Math.PI*4) / 5.0)})

    var edge34 = new Edge(eCount++, v0, v1);
    var edge3 = new Edge(eCount++, v0, v2);

    var t3 = new Triangle(tCount++, "hd", [v0, v1, v2]);

    t3.edges01 = [edge34];
    t3.edges02 = [edge3];
    t3.edges12 = [edge23];

    edge34.triangleA = t3; edge34.typeEA = "01";
    edge3.triangleA = t3; edge3.typeEA = "02";
    edge23.triangleB = t3; edge23.typeEB = "12";

    triangles.push(t3);

    /**************************************************/
    var v2 = new Vertex(vCount++, {x: -(size*PHI) * Math.cos( (Math.PI*5) / 5.0), y: (size*PHI) * Math.sin( (Math.PI*5) / 5.0)})

    var edge45 = new Edge(eCount++, v1, v2);
    var edge4 = new Edge(eCount++, v0, v2);

    var t4 = new Triangle(tCount++, "hd", [v0, v1, v2]);

    t4.edges01 = [edge34];
    t4.edges02 = [edge4];
    t4.edges12 = [edge45];

    edge45.triangleA = t4; edge45.typeEA = "12";
    edge4.triangleA = t4; edge4.typeEA = "02";
    edge34.triangleB = t4; edge34.typeEB = "01";

    triangles.push(t4);

    /**************************************************/
    var v0 = new Vertex(vCount++, {x: -(size) * Math.cos( (Math.PI*6) / 5.0), y: (size) * Math.sin( (Math.PI*6) / 5.0)})

    var edge56 = new Edge(eCount++, v0, v1);
    var edge5 = new Edge(eCount++, v0, v2);

    var t5 = new Triangle(tCount++, "hd", [v0, v1, v2]);

    t5.edges01 = [edge56];
    t5.edges02 = [edge5];
    t5.edges12 = [edge45];

    edge56.triangleA = t5; edge56.typeEA = "01";
    edge5.triangleA = t5; edge5.typeEA = "02";
    edge45.triangleB = t5; edge45.typeEB = "12";

    triangles.push(t5);

    /**************************************************/
    var v2 = new Vertex(vCount++, {x: -(size*PHI) * Math.cos( (Math.PI*7) / 5.0), y: (size*PHI) * Math.sin( (Math.PI*7) / 5.0)})


    var edge67 = new Edge(eCount++, v1, v2);
    var edge6 = new Edge(eCount++, v0, v2);

    var t6 = new Triangle(tCount++, "hd", [v0, v1, v2]);

    t6.edges01 = [edge56];
    t6.edges02 = [edge6];
    t6.edges12 = [edge67];

    edge67.triangleA = t6; edge67.typeEA = "12";
    edge6.triangleA = t6; edge6.typeEA = "02";
    edge56.triangleB = t6; edge56.typeEB = "01";

    triangles.push(t6);

    /**************************************************/
    var v0 = new Vertex(vCount++, {x: -(size) * Math.cos( (Math.PI*8) / 5.0), y: (size) * Math.sin( (Math.PI*8) / 5.0)})


    var edge78 = new Edge(eCount++, v0, v1);
    var edge7 = new Edge(eCount++, v0, v2);

    var t7 = new Triangle(tCount++, "hd", [v0, v1, v2]);

    t7.edges01 = [edge78];
    t7.edges02 = [edge7];
    t7.edges12 = [edge67];

    edge78.triangleA = t7; edge78.typeEA = "01";
    edge7.triangleA = t7; edge7.typeEA = "02";
    edge67.triangleB = t7; edge67.typeEB = "12";

    triangles.push(t7);

    /**************************************************/
    var v2 = new Vertex(vCount++, {x: -(size*PHI) * Math.cos( (Math.PI*9) / 5.0), y: (size*PHI) * Math.sin( (Math.PI*9) / 5.0)})


    var edge89 = new Edge(eCount++, v1, v2);
    var edge8 = new Edge(eCount++, v0, v2);

    var t8 = new Triangle(tCount++, "hd", [v0, v1, v2]);

    t8.edges01 = [edge78];
    t8.edges02 = [edge8];
    t8.edges12 = [edge89];

    edge89.triangleA = t8; edge89.typeEA = "12";
    edge8.triangleA = t8; edge8.typeEA = "02";
    edge78.triangleB = t8; edge78.typeEB = "01";

    triangles.push(t8);
    
    /**************************************************/
    var v0 = mem;

    var edge9 = new Edge(eCount++, v0, v2);

    var t9 = new Triangle(tCount++, "hd", [v0, v1, v2]);

    t9.edges01 = [edge09];
    t9.edges02 = [edge9];
    t9.edges12 = [edge89];

    edge09.triangleB = t9; edge09.typeEB = "01";
    edge9.triangleA = t9; edge9.typeEA = "02";
    edge89.triangleB = t9; edge89.typeEB = "12";

    triangles.push(t9);

}

//divise tous les triangles contenus dans la liste triangles
iterate = function(){
	var fixedLength = triangles.length;
	for(var i = 0; i < fixedLength; i++){
		if(triangles[i].type === "hk")
			splitHK(triangles[i]);
		else if(triangles[i].type === "hd")
			splitHD(triangles[i]);
	}
}

iterateR = function(){
    var fixedLength = triangles.length;
    for(var i = 0; i < fixedLength; i++){
        if(triangles[i].type === "hk")
            splitHKR(triangles[i]);
        else if(triangles[i].type === "hd")
            splitHDR(triangles[i]);
    }
}

// ################################################
//
// 	[ 4.0 ] 	Penrose generation functions
//
// ################################################

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

generateHKTilingR = function(n){
    reset();
    var size = 300;
    makeHK(size);

    for(var i = 0; i < n; i++)
        iterateR();
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

generateHDTilingR = function(n){
    reset();
    var size = 300;
    makeHD(size);

    for(var i = 0; i < n; i++)
        iterateR();
}

generateSunTiling = function(n){
    reset();
    var size = 150;
    makeSun(size);

    for(var i = 0; i < n; i++)
        iterate();
}

generateSunTilingR = function(n){
    reset();
    var size = 150;
    makeSun(size);

    for(var i = 0; i < n; i++)
        iterateR();
}

generateStarTiling = function(n){
    reset();
    var size = 150;
    makeStar(size);

    for(var i = 0; i < n; i++)
        iterate();
}

generateStarTilingR = function(n){
    reset();
    var size = 150;
    makeStar(size);

    for(var i = 0; i < n; i++)
        iterateR();
}


// ################################################
//
// 	[ 5.0 ] 	Convert Penrose tilings to
//				Tiling objects.
//
// ################################################

//créer un tas de sable abélien à partir
//d'une liste de triangles
makePenroseSandpile = function(data){

    var tils = [];
    
    for(var i = 0; i < data.length; i++){ 


        var id = i;
        var neighbors = [];
		
		var bounds = [];
		
        bounds.push(data[i].vertices[0].x, data[i].vertices[0].y);
        bounds.push(data[i].vertices[1].x, data[i].vertices[1].y); 
        bounds.push(data[i].vertices[2].x, data[i].vertices[2].y); 

        neighbors = getAdj(data[i]);

        
        var s = 0;

        var tile = new Tile(id, neighbors, bounds, 3);
        
        tile.sand = s;

        tils.push(tile);

    }
    console.log("LENGTH TILS : ", tils.length);
    return new Tiling(tils);
    
}

Tiling.HKPenroseSandpile = function(iterations){
    generateHKTiling(iterations);
    return makePenroseSandpile(triangles);
}

Tiling.HKPenroseSandpileR = function(iterations){
    generateHKTilingR(iterations);
    return makePenroseSandpile(triangles);
}


Tiling.HDPenroseSandpile = function(iterations){
    generateHDTiling(iterations);
    return makePenroseSandpile(triangles);
}

Tiling.HDPenroseSandpileR = function(iterations){
    generateHDTilingR(iterations);
    return makePenroseSandpile(triangles);
}

Tiling.SunPenroseSandpile = function(iterations){
    generateSunTiling(iterations);
    return makePenroseSandpile(triangles);
}

Tiling.SunPenroseSandpileR = function(iterations){
    generateSunTilingR(iterations);
    return makePenroseSandpile(triangles);
}

Tiling.StarPenroseSandpile = function(iterations){
    generateStarTiling(iterations);
    return makePenroseSandpile(triangles);
}

Tiling.StarPenroseSandpileR = function(iterations){
    generateStarTilingR(iterations);
    return makePenroseSandpile(triangles);
}

/**************/

class Cell{
    constructor(id, type, vertices, edges, t1, t2){
        this.id = id;
        this.type = type; //= "kite" ou "dart"
        this.vertices = vertices;

        
        this.edges = edges;

        this.t1 = t1;
        this.t2 = t2;
    }
}

updateCellEdges = function(c){

    //console.log("c.t1.id", c.t1.id);
    //console.log("c.id", c.id);
    updateEdge(c.t1, c.edges[0], c, "cell");
    updateEdge(c.t1, c.edges[1], c, "cell");
    updateEdge(c.t2, c.edges[2], c, "cell");
    updateEdge(c.t2, c.edges[3], c, "cell");
}

makeKDCellWith2Triangles = function(t1, t2){

    if (t1.id< t2.id){
        var first = t1.id; var second = t2.id;
    }
    else{
        var first = t2.id; var second = t1.id;
    }

    var type = (t1.type === "hk")?"kite":"dart";

    if(t1.type !== t2.type) console.log("ALLLLLERRTE");

    var vertices = [t1.vertices[2], t1.vertices[0], t2.vertices[2], t1.vertices[1]];
    
    var edges = [t1.edges02[0], t1.edges12[0], t2.edges02[0], t2.edges12[0]];

    return new Cell(cCount++, type, vertices, edges, t1, t2);
}

makeRCellWith2Triangles = function(t1, t2){

    if (t1.id< t2.id){
        var first = t1.id; var second = t2.id;
    }
    else{
        var first = t2.id; var second = t1.id;
    }

    var type = (t1.type === "hk")?"thin":"thick";

    if(t1.type !== t2.type) console.log("ALLLLLERRTE");

    var vertices = [t1.vertices[0], t1.vertices[1], t2.vertices[0], t1.vertices[2]];
    
    var edges = [t1.edges01[0], t1.edges02[0], t2.edges01[0], t2.edges02[0]];

    return new Cell(cCount++, type, vertices, edges, t1, t2);
}

removeTriangleFromEdge = function(t, e){
    if(e.triangleA !== null && t.id === e.triangleA.id){
        e.triangleA = null;
        e.typeEA = null;
    }
    else{
        e.triangleB = null;
        e.typeEB = null;
    }
}

supressIncompleteKD = function(marqueT){
    for(var i = 0; i < triangles.length; i++){
        var adjT = getAdjByEdge(triangles[i].id, triangles[i].edges01[0]);

        if(adjT === null){

            marqueT[i] = true;
            //console.log("BOUGNAdèR");
            removeTriangleFromEdge (triangles[i], triangles[i].edges01[0])
            removeTriangleFromEdge (triangles[i], triangles[i].edges02[0])
            removeTriangleFromEdge (triangles[i], triangles[i].edges12[0])
        }
    }
    
}

supressIncompleteR = function(marqueT){
    for(var i = 0; i < triangles.length; i++){
        var adjT = getAdjByEdge(triangles[i].id, triangles[i].edges12[0]);

        if(adjT === null){

            marqueT[i] = true;
            //console.log("BOUGNAdèR");
            removeTriangleFromEdge (triangles[i], triangles[i].edges01[0])
            removeTriangleFromEdge (triangles[i], triangles[i].edges02[0])
            removeTriangleFromEdge (triangles[i], triangles[i].edges12[0])
        }
    }
    
}

trianglesToKDTiling = function(){
    var marqueT = []
    for(var i = 0; i < triangles.length; i++){
        marqueT.push(false);
    }

    supressIncompleteKD(marqueT);

    for(var i = 0; i < triangles.length; i++){
        if(marqueT[i]) continue;
        var adjT = getAdjByEdge(triangles[i].id, triangles[i].edges01[0]);
        marqueT[i] = true;
        marqueT[adjT.id] = true;

        
        var newCell = makeKDCellWith2Triangles(triangles[i], adjT)
        updateCellEdges(newCell);
        cells.push(newCell);

    }

    console.log(cells.length);
}

trianglesToRTiling = function(){
    var marqueT = []
    for(var i = 0; i < triangles.length; i++){
        marqueT.push(false);
    }

    supressIncompleteR(marqueT);

    for(var i = 0; i < triangles.length; i++){
        if(marqueT[i]) continue;
        var adjT = getAdjByEdge(triangles[i].id, triangles[i].edges12[0]);
        marqueT[i] = true;
        marqueT[adjT.id] = true;

        
        var newCell = makeRCellWith2Triangles(triangles[i], adjT)
        updateCellEdges(newCell);
        cells.push(newCell);

    }

    console.log(cells.length);
}

getAdjCell = function(c){
    var adj = []
    for(var i = 0; i < 4; i++){
        var adjCell = getAdjByEdge(c.id, c.edges[i])
        if (adjCell!==null) adj.push(adjCell.id);
    }

    return adj;
}

//make KD prenrose tiling abelian sandpile (KD = Kite and Dart)
//with a list of cells
makeKDPenroseSandpile = function(data){

    var tils = [];
    
    for(var i = 0; i < data.length; i++){ 


        var id = i;

		var bounds = [];
        bounds.push(data[i].vertices[0].x, data[i].vertices[0].y); 
        bounds.push(data[i].vertices[1].x, data[i].vertices[1].y);
        bounds.push(data[i].vertices[2].x, data[i].vertices[2].y);
        bounds.push(data[i].vertices[3].x, data[i].vertices[3].y); 


        var s = 0;
        var neighbors = getAdjCell(data[i]);

        var tile = new Tile(id, neighbors, bounds, 4);
        
        tile.sand = s;

        tils.push(tile);

    }

    console.log("LENGTH TILS : ", tils.length);
    var tiling = new Tiling(tils);
    reset();
    return tiling;
    
}


Tiling.HKKDPenrose = function({iterations}={}){
    generateHKTiling(iterations);
    trianglesToKDTiling();
    return makeKDPenroseSandpile(cells);
}

Tiling.HDKDPenrose = function({iterations}={}){
    generateHDTiling(iterations);
    trianglesToKDTiling();
    return makeKDPenroseSandpile(cells);
}

Tiling.SunKDPenrose = function({iterations}={}){
    generateSunTiling(iterations);
    trianglesToKDTiling();
    return makeKDPenroseSandpile(cells);
}

Tiling.StarKDPenrose = function({iterations}={}){
    generateStarTiling(iterations);
    trianglesToKDTiling();
    return makeKDPenroseSandpile(cells);
}

Tiling.HKRPenrose = function({iterations}={}){
    generateHKTilingR(iterations);
    trianglesToRTiling();
    return makeKDPenroseSandpile(cells);
}

Tiling.HDRPenrose = function({iterations}={}){
    generateHDTilingR(iterations);
    trianglesToRTiling();
    return makeKDPenroseSandpile(cells);
}

Tiling.SunRPenrose = function({iterations}={}){
    generateSunTilingR(iterations);
    trianglesToRTiling();
    return makeKDPenroseSandpile(cells);
}

Tiling.StarRPenrose = function({iterations}={}){
    generateStarTilingR(iterations);
    trianglesToRTiling();
    return makeKDPenroseSandpile(cells);
}

// ################################################
//
// 	EOF
//
// ################################################

