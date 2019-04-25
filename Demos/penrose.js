var PHI = (1.0 + Math.sqrt(5)) / 2.0;

var iterations = 3;

var tCount = 0;
var vCount = 0;
var eCount = 0;

var triangles = [];

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

        this.triangleA = null;
        this.triangleB = null;
        this.typeEA = null;
        this.typeEB = null;
    }
}

class Triangle{
    constructor(id, type, vertices){
        this.id = id;
        this.type = type;
        this.vertices = vertices;

        this.edges01 = [];
        this.edges02 = [];
        this.edges12 = [];
    }
}

makeHK = function(width, heigth){
    var v0 = new Vertex(vCount++, {x: -width, y: height});
    var v1 = new Vertex(vCount++, {x: width*2, y: height});
    var v2 = new Vertex(vCount++, {x: -width + 3 * width * Math.cos(Math.PI / 5.0), y: height - 3 * width * Math.sin(Math.PI / 5.0)});
    

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

guessEdge = function(v, edges){
    return (v.id === edges[0].vertexA.id ||
            v.id === edges[0].vertexB.id) ? edges[0] : edges[1];
}

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

guessVertex = function(v, edges){
	return (v.id === edges[0].vertexA.id) ? edges[0].vertexB : 
	                                       (v.id === edges[1].vertexA.id) ? edges[1].vertexB : 
	                                                                        edges[1].vertexA;
}

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
        //p1 = (v0.id === t.edges02[0].vertexA.id) ? t.edges02[0].vertexB : t.edges02[0].vertexA;
        p1 = guessVertex(v0, t.edges02);
    }

    if (p2 === null){
        //p2 = (v0.id === t.edges01[0].vertexA.id) ? t.edges01[0].vertexB : (v0.id === t.edges01[1].vertexA.id) ? t.edges01[1].vertexB : t.edges01[1].vertexA;
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
        //p1 = (v1.id === t.edges12[0].vertexA.id) ? t.edges12[0].vertexB : t.edges12[0].vertexA;
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




splitHKDebug = function(t){
	console.log("MMMEEERRRRRDe")
    var v0 = t.vertices[0];
    var v1 = t.vertices[1];
    var v2 = t.vertices[2];

    console.log(t.vertices[0].id, t.vertices[1].id, t.vertices[2].id)

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
        p1 = (v0.id === t.edges02[0].vertexA.id) ? t.edges02[0].vertexB : t.edges02[0].vertexA;
    }

    if (p2 === null){
        p2 = (v0.id === t.edges01[0].vertexA.id) ? t.edges01[0].vertexB : t.edges01[0].vertexA;
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

    console.log(t.vertices[0].id, t.vertices[1].id, t.vertices[2].id)

}


getAdjByEdge = function(tId, edge){
    return (tId === edge.triangleA.id)? edge.triangleB:
                                        edge.triangleA;
}

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




var width = 1000;
var height = 600;

var t = makeHK(width, height);


iterate = function(){
	var fixedLength = triangles.length;
	for(var i = 0; i < fixedLength; i++){
		if(triangles[i].type === "hk")
			splitHK(triangles[i]);
		else if(triangles[i].type === "hd")
			splitHD(triangles[i]);
	}
}

var n =11;
for(var i = 0; i < n; i++)
	iterate()

//splitHK(triangles[2]);
//splitHK(triangles[1]);
//splitHKDebug(triangles[2]);
//triangles.splice(2, 1);
//triangles.splice(4, 1);

for(var i = 0; i < triangles.length; i++){
	//console.log(triangles[i]);
}




makePenroseTiling = function(data){
    /*
    var cmap = [new THREE.Color(0x6666ff),
                new THREE.Color(0xff9900),
                new THREE.Color(0xff0000)];
    */
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

        //var s = (data[i].type == "hd")? 0 : 1;
        var s = 0;

        var tile = new Tile(id, neighboors, pointsIds);
        //console.log(data[i].points);
        tile.sand = s;

        tils.push(tile);

    }
    

    console.log("TAILLE TILS = ", tils.length);
    return new Tiling(pos, col, tils, 3, cmap);
    
}

class App{

    constructor(){
        this.WIDTH = window.innerWidth;
        this.HEIGHT = window.innerHeight;

        //this.WIDTH = 600;
        //this.HEIGHT = 500;


        this.scene = new THREE.Scene();
        this.ratio = this.WIDTH / this.HEIGHT;

        var left = -this.WIDTH ;
        var right = this.WIDTH ;
        var top_cam = this.HEIGHT ;
        var bottom = -this.HEIGHT;

        this.camera = new THREE.OrthographicCamera( left, right, top_cam, bottom, 0, 10 );
        this.camera.position.z = 5;

        this.renderer = new THREE.WebGLRenderer( );

        this.renderScene = document.createElement('div');
        this.renderScene.width = this.WIDTH;
        this.renderScene.height = this.HEIGHT;

        this.renderer.setSize(this.WIDTH, this.HEIGHT);
        //this.scene.background = new THREE.Color( 0x000066 );

        //this.renderer.setPixelRatio( window.devicePixelRatio );

        this.renderScene.appendChild( this.renderer.domElement );
        document.body.appendChild(this.renderScene);
    
        this.controls = new THREE.OrthographicTrackballControls( this.camera ); //OK
        
        this.controls.enablePan = true;
        this.controls.enableZoom = true;
        this.controls.enableRotate = false;


        //var obj3D = makeMatrixOfSquares();
    
        this.sandpile = makePenroseTiling(triangles);
        

        this.scene.add(this.sandpile.mesh);
    }
}

var app = new App();
app.sandpile.addEverywhere(3);

var render = function () {
  
requestAnimationFrame( render );
    app.controls.update();
    app.sandpile.iterate();
    app.sandpile.colorTiles();
    app.renderer.render( app.scene, app.camera );
      
};

render();

