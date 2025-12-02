// This code is part of JS-Sandpile (https://github.com/huacayacauh/JS-Sandpile/)
// Contributors : Coline Besson, Victor Lutfalla

// Stampfli's 12-fold 1
// substitution described at
// https://tilings.math.uni-bielefeld.de/substitution/stampflis-12-fold-1/

//
// [1] define tile types St
//
// equi : equilateral triangle
var bounds = [];
bounds.push(-0.5,-Math.cos(Math.PI/3)*(0.5/Math.sin(Math.PI /3))); 
bounds.push(0.5,-Math.cos(Math.PI/3)*(0.5/Math.sin(Math.PI /3))); 
bounds.push(0,0.5/Math.sin(Math.PI /3)); 
var equi = new Tile(['equi'],[],bounds,3);

// los : losenge, rhombus with angels π/6 and 5π/6
var bounds = [];
bounds.push(0,-Math.cos(Math.PI/12)); 
bounds.push(Math.sin(Math.PI/12),0); 
bounds.push(0,Math.cos(Math.PI/12)); 
bounds.push(-Math.sin(Math.PI/12),0); 
var los = new Tile(['los'],[],bounds,4);

// car : square (carré)
var bounds = [];
bounds.push(-0.5,-0.5); 
bounds.push(0.5,-0.5); 
bounds.push(0.5,0.5); 
bounds.push(-0.5,0.5); 
var car = new Tile(['car'],[],bounds,4);


// convert car to equi
Tile.prototype.car2equi = function(){
    this.id[0]='equi';
    let c4 = (this.bounds[2]-this.bounds[0]) * Math.cos(Math.PI/3) - (this.bounds[3]-this.bounds[1]) * Math.sin(Math.PI/3) +this.bounds[0];
    let c5 = (this.bounds[3]-this.bounds[1]) * Math.cos(Math.PI/3) + (this.bounds[2]-this.bounds[0]) * Math.sin(Math.PI/3) +this.bounds[1];
    this.bounds[4] = c4;
    this.bounds[5] = c5;
    this.bounds.splice(6,7);
    this.limit = 3;
}

// convert car to los
Tile.prototype.car2los = function(){
    this.id[0]='los';
    let c2 = (this.bounds[7]-this.bounds[1]) * Math.sin(Math.PI/12) - (this.bounds[0]-this.bounds[6]) * Math.cos(Math.PI/12) + this.bounds[0];
    let c3 = (this.bounds[7]-this.bounds[1]) * Math.cos(Math.PI/12) + (this.bounds[0]-this.bounds[6]) * Math.sin(Math.PI/12) + this.bounds[1];
    let c4 = (-1) * (this.bounds[0]-this.bounds[6]) * 2 * Math.cos(Math.PI/12) + this.bounds[0];
    let c5 = (this.bounds[7]-this.bounds[1]) * 2 * Math.cos(Math.PI/12) + this.bounds[1];
    let c6 = (-1) * (this.bounds[7]-this.bounds[1]) * Math.sin(Math.PI/12) - (this.bounds[0]-this.bounds[6]) * Math.cos(Math.PI/12) + this.bounds[0];
    let c7 = (this.bounds[7]-this.bounds[1]) * Math.cos(Math.PI/12) - (this.bounds[0]-this.bounds[6]) * Math.sin(Math.PI/12) + this.bounds[1];
    this.bounds[2] = c2;
    this.bounds[3] = c3;
    this.bounds[4] = c4;
    this.bounds[5] = c5;
    this.bounds[6] = c6;
    this.bounds[7] = c7;
}

// convert equi to los
Tile.prototype.equi2los = function(){
    this.id[0]='los';
    let c2 = (-1) * (this.bounds[0]-this.bounds[4]) * Math.cos(Math.PI/12) - (this.bounds[5]-this.bounds[1]) * Math.sin(Math.PI/12) + this.bounds[0];
    let c3 = (this.bounds[5]-this.bounds[1]) * Math.cos(Math.PI/12) - (this.bounds[0]-this.bounds[4]) * Math.sin(Math.PI/12) + this.bounds[1];
    let c4 = (-2)*Math.cos(Math.PI/12) * ((this.bounds[0]-this.bounds[4]) * Math.cos(Math.PI/6) + (this.bounds[5]-this.bounds[1]) * Math.sin(Math.PI/6)) + this.bounds[0];
    let c5 = 2*Math.cos(Math.PI/12) * ((this.bounds[5]-this.bounds[1]) * Math.cos(Math.PI/6) - (this.bounds[0]-this.bounds[4]) * Math.sin(Math.PI/6)) + this.bounds[1];
    let c6 = (-1) * (this.bounds[0]-this.bounds[4]) * Math.cos(Math.PI/4) - (this.bounds[5]-this.bounds[1]) * Math.sin(Math.PI/4) + this.bounds[0];
    let c7 = (this.bounds[5]-this.bounds[1]) * Math.cos(Math.PI/4) - (this.bounds[0]-this.bounds[4]) * Math.sin(Math.PI/4) + this.bounds[1];
    this.bounds[2] = c2;
    this.bounds[3] = c3;
    this.bounds[4] = c4;
    this.bounds[5] = c5;
    this.bounds[6] = c6;
    this.bounds[7] = c7;
    this.limit = 4;
}

// convert los to car
Tile.prototype.los2car = function(){
    this.id[0]='car';
    let c2 = Math.cos(19*Math.PI/12) * (this.bounds[2]-this.bounds[0]) + Math.sin(19*Math.PI/12) * (this.bounds[1]-this.bounds[3]) + this.bounds[0];
    let c3 = Math.sin(19*Math.PI/12) * (this.bounds[2]-this.bounds[0]) - Math.cos(19*Math.PI/12) * (this.bounds[1]-this.bounds[3]) + this.bounds[1];	
    let c6 = (this.bounds[4]-this.bounds[0]) / (2 * Math.cos(Math.PI/12)) + this.bounds[0];
    let c7 = (this.bounds[5]-this.bounds[1]) / (2 * Math.cos(Math.PI/12)) + this.bounds[1];
    let c4 = c6 + (c2-this.bounds[0]);
    let c5 = c7 + (c3-this.bounds[1]);
    this.bounds[2] = c2;
    this.bounds[3] = c3;
    this.bounds[4] = c4;
    this.bounds[5] = c5;
    this.bounds[6] = c6;
    this.bounds[7] = c7;
}

// convert los to equi
Tile.prototype.los2equi = function(){
    this.id[0]='equi';
    let c2 = Math.cos(5*Math.PI/12) * (this.bounds[0]-this.bounds[6]) + Math.sin(5*Math.PI/12) * (this.bounds[7]-this.bounds[1]) + this.bounds[0];
    let c3 = Math.sin(5*Math.PI/12) * (this.bounds[0]-this.bounds[6]) - Math.cos(5*Math.PI/12) * (this.bounds[7]-this.bounds[1]) + this.bounds[1];
    let c4 = Math.cos(3*Math.PI/4) * (this.bounds[0]-this.bounds[6]) + Math.sin(3*Math.PI/4) * (this.bounds[7]-this.bounds[1]) + this.bounds[0];
    let c5 = Math.sin(3*Math.PI/4) * (this.bounds[0]-this.bounds[6]) - Math.cos(3*Math.PI/4) * (this.bounds[7]-this.bounds[1]) + this.bounds[1];
    this.bounds[2] = c2;
    this.bounds[3] = c3;
    this.bounds[4] = c4;
    this.bounds[5] = c5;
    this.bounds.splice(6,7);
    this.limit = 3;
}

//
// [2] define substitution P2
//
function substitutionSt(tile){
    switch(tile.id[0]){
    case 'car':
	// substitution σ : square -> 1 square , 12 rhombuses and 20 squares
	// NOTE the order of tiles is somewhat dictacted by connectivity from the starting corner
	var newtiles = [];
	var newlos1 = tile.myclone();
	newlos1.car2los();
	newlos1.id.push('los1');
	newlos1.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newlos1.rotate(tile.bounds[0],tile.bounds[1],-Math.PI/12);
	newtiles.push(newlos1);
	var newlos2 = tile.myclone();
	newlos2.car2los();
	newlos2.id.push('los2');
	newlos2.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newlos2.rotate(tile.bounds[0],tile.bounds[1],-Math.PI/4);
	newtiles.push(newlos2);
	var newlos3 = tile.myclone();
	newlos3.car2los();
	newlos3.id.push('los3');
	newlos3.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newlos3.rotate(tile.bounds[0],tile.bounds[1],-5*Math.PI/12);
	newtiles.push(newlos3);
	var newequi1 = tile.myclone();
	newequi1.car2equi();
	newequi1.id.push('equi1');
	newequi1.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi1.rotate(tile.bounds[0],tile.bounds[1],Math.PI/3);
	newequi1.shift(newlos1.bounds[6]-newlos1.bounds[0],newlos1.bounds[7]-newlos1.bounds[1]);
	newtiles.push(newequi1);
	var newequi2 = tile.myclone();
	newequi2.car2equi();
	newequi2.id.push('equi2');
	newequi2.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi2.rotate(tile.bounds[0],tile.bounds[1],Math.PI/6);
	newequi2.shift(newlos2.bounds[6]-newlos2.bounds[0],newlos2.bounds[7]-newlos2.bounds[1]);
	newtiles.push(newequi2);
	var newequi3 = tile.myclone();
	newequi3.car2equi();
	newequi3.id.push('equi3');
	newequi3.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi3.shift(newlos2.bounds[2]-newlos2.bounds[0],newlos2.bounds[3]-newlos2.bounds[1]);
	newtiles.push(newequi3);
	var newequi4 = tile.myclone();
	newequi4.car2equi();
	newequi4.id.push('equi4');
	newequi4.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi4.rotate(tile.bounds[0],tile.bounds[1],-Math.PI/6);
	newequi4.shift(newlos3.bounds[2]-newlos3.bounds[0],newlos3.bounds[3]-newlos3.bounds[1]);
	newtiles.push(newequi4);
	var newcar1 = tile.myclone();
	newcar1.id.push('car1');
	newcar1.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newcar1.shift(newlos2.bounds[4]-newlos2.bounds[0],newlos2.bounds[5]-newlos2.bounds[1]);
	newtiles.push(newcar1);
	var newequi5 = tile.myclone();
	newequi5.car2equi();
	newequi5.id.push('equi5');
	newequi5.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi5.rotate(tile.bounds[0],tile.bounds[1],Math.PI/3);
	newequi5.shift(newequi3.bounds[2]-newlos1.bounds[0],newequi3.bounds[3]-newlos1.bounds[1]);
	newtiles.push(newequi5);
	var newequi6 = tile.myclone();
	newequi6.car2equi();
	newequi6.id.push('equi6');
	newequi6.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi6.rotate(tile.bounds[0],tile.bounds[1],Math.PI/6);
	newequi6.shift(newcar1.bounds[2]-newlos2.bounds[0],newcar1.bounds[3]-newlos2.bounds[1]);
	newtiles.push(newequi6);
	var newequi7 = tile.myclone();
	newequi7.car2equi();
	newequi7.id.push('equi7');
	newequi7.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi7.shift(newcar1.bounds[6]-newlos2.bounds[0],newcar1.bounds[7]-newlos2.bounds[1]);
	newtiles.push(newequi7);
	var newequi8 = tile.myclone();
	newequi8.car2equi();
	newequi8.id.push('equi8');
	newequi8.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi8.rotate(tile.bounds[0],tile.bounds[1],-Math.PI/6);
	newequi8.shift(newequi2.bounds[4]-newlos3.bounds[0],newequi2.bounds[5]-newlos3.bounds[1]);
	newtiles.push(newequi8);
	var newlos4 = tile.myclone();
	newlos4.car2los();
	newlos4.id.push('los4');
	newlos4.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newlos4.rotate(tile.bounds[0],tile.bounds[1],13*Math.PI/12);
	newlos4.shift(newequi6.bounds[2]-newlos1.bounds[0],newequi6.bounds[3]-newlos1.bounds[1]);
	newtiles.push(newlos4);
	var newlos5 = tile.myclone();
	newlos5.car2los();
	newlos5.id.push('los5');
	newlos5.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newlos5.rotate(tile.bounds[0],tile.bounds[1],Math.PI/4);
	newlos5.shift(newlos4.bounds[4]-newlos1.bounds[0],newlos4.bounds[5]-newlos1.bounds[1]);
	newtiles.push(newlos5);
	var newlos6 = tile.myclone();
	newlos6.car2los();
	newlos6.id.push('los6');
	newlos6.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newlos6.rotate(tile.bounds[0],tile.bounds[1],5*Math.PI/12);
	newlos6.shift(newlos4.bounds[4]-newlos1.bounds[0],newlos4.bounds[5]-newlos1.bounds[1]);
	newtiles.push(newlos6);
	var newequi9 = tile.myclone();
	newequi9.car2equi();
	newequi9.id.push('equi9');
	newequi9.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi9.rotate(tile.bounds[0],tile.bounds[1],Math.PI/3);
	newequi9.shift(newlos4.bounds[6]-newlos1.bounds[0],newlos4.bounds[7]-newlos1.bounds[1]);
	newtiles.push(newequi9);
	var newequi10 = tile.myclone();
	newequi10.car2equi();
	newequi10.id.push('equi10');
	newequi10.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi10.rotate(tile.bounds[0],tile.bounds[1],-Math.PI/6);
	newequi10.shift(newcar1.bounds[2]-newlos2.bounds[0],newcar1.bounds[3]-newlos2.bounds[1]);
	newtiles.push(newequi10);
	var newequi11 = tile.myclone();
	newequi11.car2equi();
	newequi11.id.push('equi11');
	newequi11.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi11.shift(newlos3.bounds[4]-newlos2.bounds[0],newlos3.bounds[5]-newlos2.bounds[1]);
	newtiles.push(newequi11);
	var newequi12 = tile.myclone();
	newequi12.car2equi();
	newequi12.id.push('equi12');
	newequi12.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi12.rotate(tile.bounds[0],tile.bounds[1],Math.PI/6);
	newequi12.shift(newequi4.bounds[2]-newlos3.bounds[0],newequi4.bounds[3]-newlos3.bounds[1]);
	newtiles.push(newequi12);
	var newlos7 = tile.myclone();
	newlos7.car2los();
	newlos7.id.push('los7');
	newlos7.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newlos7.rotate(tile.bounds[0],tile.bounds[1],5*Math.PI/12);
	newlos7.shift(newequi7.bounds[4]-newlos1.bounds[0],newequi7.bounds[5]-newlos1.bounds[1]);
	newtiles.push(newlos7);
	var newlos8 = tile.myclone();
	newlos8.car2los();
	newlos8.id.push('los8');
	newlos8.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newlos8.rotate(tile.bounds[0],tile.bounds[1],-3*Math.PI/4);
	newlos8.shift(newlos7.bounds[4]-newlos1.bounds[0],newlos7.bounds[5]-newlos1.bounds[1]);
	newtiles.push(newlos8);
	var newlos9 = tile.myclone();
	newlos9.car2los();
	newlos9.id.push('los9');
	newlos9.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newlos9.rotate(tile.bounds[0],tile.bounds[1],13*Math.PI/12);
	newlos9.shift(newlos7.bounds[4]-newlos1.bounds[0],newlos7.bounds[5]-newlos1.bounds[1]);
	newtiles.push(newlos9);
	var newequi13 = tile.myclone();
	newequi13.car2equi();
	newequi13.id.push('equi13');
	newequi13.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi13.rotate(tile.bounds[0],tile.bounds[1],-Math.PI/6);
	newequi13.shift(newlos7.bounds[2]-newlos1.bounds[0],newlos7.bounds[3]-newlos1.bounds[1]);
	newtiles.push(newequi13);
	var newequi14 = tile.myclone();
	newequi14.car2equi();
	newequi14.id.push('equi14');
	newequi14.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi14.rotate(tile.bounds[0],tile.bounds[1],Math.PI/3);
	newequi14.shift(newcar1.bounds[6]-newlos2.bounds[0],newcar1.bounds[7]-newlos2.bounds[1]);
	newtiles.push(newequi14);
	var newequi15 = tile.myclone();
	newequi15.car2equi();
	newequi15.id.push('equi15');
	newequi15.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi15.rotate(tile.bounds[0],tile.bounds[1],Math.PI/6);
	newequi15.shift(newlos1.bounds[4]-newlos2.bounds[0],newlos1.bounds[5]-newlos2.bounds[1]);
	newtiles.push(newequi15);	
	var newequi16 = tile.myclone();
	newequi16.car2equi();
	newequi16.id.push('equi16');
	newequi16.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi16.shift(newequi1.bounds[4]-newlos3.bounds[0],newequi1.bounds[5]-newlos3.bounds[1]);
	newtiles.push(newequi16);
	var newlos10 = tile.myclone();
	newlos10.car2los();
	newlos10.id.push('los10');
	newlos10.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newlos10.rotate(tile.bounds[0],tile.bounds[1],-5*Math.PI/12);
	newlos10.shift(newequi7.bounds[4]-newlos1.bounds[0],newequi7.bounds[5]-newlos1.bounds[1]);
	newtiles.push(newlos10);
	var newlos11 = tile.myclone();
	newlos11.car2los();
	newlos11.id.push('los11');
	newlos11.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newlos11.rotate(tile.bounds[0],tile.bounds[1],3*Math.PI/4);
	newlos11.shift(newlos10.bounds[4]-newlos1.bounds[0],newlos10.bounds[5]-newlos1.bounds[1]);
	newtiles.push(newlos11);
	var newlos12 = tile.myclone();
	newlos12.car2los();
	newlos12.id.push('los12');
	newlos12.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newlos12.rotate(tile.bounds[0],tile.bounds[1],-13*Math.PI/12);
	newlos12.shift(newlos10.bounds[4]-newlos1.bounds[0],newlos10.bounds[5]-newlos1.bounds[1]);
	newtiles.push(newlos12);
	var newequi17 = tile.myclone();
	newequi17.car2equi();
	newequi17.id.push('equi17');
	newequi17.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi17.rotate(tile.bounds[0],tile.bounds[1],Math.PI/6);
	newequi17.shift(newlos10.bounds[0]-newlos1.bounds[0],newlos10.bounds[1]-newlos1.bounds[1]);
	newtiles.push(newequi17);
	var newequi18 = tile.myclone();
	newequi18.car2equi();
	newequi18.id.push('equi18');
	newequi18.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi18.rotate(tile.bounds[0],tile.bounds[1],Math.PI/3);
	newequi18.shift(newcar1.bounds[4]-newlos2.bounds[0],newcar1.bounds[5]-newlos2.bounds[1]);
	newtiles.push(newequi18);
	var newequi19 = tile.myclone();
	newequi19.car2equi();
	newequi19.id.push('equi19');
	newequi19.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi19.rotate(tile.bounds[0],tile.bounds[1],-Math.PI/6);
	newequi19.shift(newcar1.bounds[4]-newlos2.bounds[0],newcar1.bounds[5]-newlos2.bounds[1]);
	newtiles.push(newequi19);
	var newequi20 = tile.myclone();
	newequi20.car2equi();
	newequi20.id.push('equi20');
	newequi20.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi20.shift(newequi9.bounds[4]-newlos3.bounds[0],newequi9.bounds[5]-newlos3.bounds[1]);
	newtiles.push(newequi20);
	return newtiles;
	break;
	
    case 'los': // substitution σ : rhombus -> 2 squares, 3 rhombuses and 12 triangles
	var newtiles = [];
	var newlos1 = tile.myclone();
	newlos1.id.push('los1');
	newlos1.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newtiles.push(newlos1);
	var newequi1 = tile.myclone();
	newequi1.los2equi();
	newequi1.id.push('equi1');
	newequi1.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi1.rotate(tile.bounds[0],tile.bounds[1],5*Math.PI/12);
	newequi1.shift(newlos1.bounds[6]-newlos1.bounds[0],newlos1.bounds[7]-newlos1.bounds[1]);
	newtiles.push(newequi1);
	var newequi2 = tile.myclone();
	newequi2.los2equi();
	newequi2.id.push('equi2');
	newequi2.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi2.rotate(tile.bounds[0],tile.bounds[1],3*Math.PI/12);
	newequi2.shift(newlos1.bounds[2]-newlos1.bounds[0],newlos1.bounds[3]-newlos1.bounds[1]);
	newtiles.push(newequi2);
	var newequi3 = tile.myclone();
	newequi3.los2equi();
	newequi3.id.push('equi3');
	newequi3.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi3.rotate(tile.bounds[0],tile.bounds[1],9*Math.PI/12);
	newequi3.shift(newlos1.bounds[4]-newlos1.bounds[0],newlos1.bounds[5]-newlos1.bounds[1]);
	newtiles.push(newequi3);
	var newequi4 = tile.myclone();
	newequi4.los2equi();
	newequi4.id.push('equi4');
	newequi4.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi4.rotate(tile.bounds[0],tile.bounds[1],-1*Math.PI/12);
	newequi4.shift(newlos1.bounds[4]-newlos1.bounds[0],newlos1.bounds[5]-newlos1.bounds[1]);
	newtiles.push(newequi4);
	var newcar1 = tile.myclone();
	newcar1.los2car();
	newcar1.id.push('car1');
	newcar1.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newcar1.rotate(tile.bounds[0],tile.bounds[1],Math.PI/4);
	newcar1.shift(newlos1.bounds[4]-newlos1.bounds[0],newlos1.bounds[5]-newlos1.bounds[1]);
	newtiles.push(newcar1);
	var newequi5 = tile.myclone();
	newequi5.los2equi();
	newequi5.id.push('equi5');
	newequi5.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi5.rotate(tile.bounds[0],tile.bounds[1],3*Math.PI/12);
	newequi5.shift(newcar1.bounds[6]-newlos1.bounds[0],newcar1.bounds[7]-newlos1.bounds[1]);
	newtiles.push(newequi5);
	var newequi6 = tile.myclone();
	newequi6.los2equi();
	newequi6.id.push('equi6');
	newequi6.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi6.rotate(tile.bounds[0],tile.bounds[1],-3*Math.PI/12);
	newequi6.shift(newcar1.bounds[4]-newlos1.bounds[0],newcar1.bounds[5]-newlos1.bounds[1]);
	newtiles.push(newequi6);
	var newlos2 = tile.myclone();
	newlos2.id.push('los2');
	newlos2.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newlos2.rotate(tile.bounds[0],tile.bounds[1],Math.PI/2);
	newlos2.shift(newequi6.bounds[4]-newlos1.bounds[0],newequi6.bounds[5]-newlos1.bounds[1]);
	newtiles.push(newlos2);
	var newequi7 = tile.myclone();
	newequi7.los2equi();
	newequi7.id.push('equi7');
	newequi7.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi7.rotate(tile.bounds[0],tile.bounds[1],Math.PI/12);
	newequi7.shift(newlos2.bounds[4]-newlos1.bounds[0],newlos2.bounds[5]-newlos1.bounds[1]);
	newtiles.push(newequi7);
	var newequi8 = tile.myclone();
	newequi8.los2equi();
	newequi8.id.push('equi8');
	newequi8.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi8.rotate(tile.bounds[0],tile.bounds[1],-1*Math.PI/12);
	newequi8.shift(newlos2.bounds[2]-newlos1.bounds[0],newlos2.bounds[3]-newlos1.bounds[1]);
	newtiles.push(newequi8);
	var newcar2 = tile.myclone();
	newcar2.los2car();
	newcar2.id.push('car2');
	newcar2.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newcar2.rotate(tile.bounds[0],tile.bounds[1],Math.PI/4);
	newcar2.shift(newlos2.bounds[2]-newlos1.bounds[0],newlos2.bounds[3]-newlos1.bounds[1]);
	newtiles.push(newcar2);
	var newequi9 = tile.myclone();
	newequi9.los2equi();
	newequi9.id.push('equi9');
	newequi9.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi9.rotate(tile.bounds[0],tile.bounds[1],3*Math.PI/12);
	newequi9.shift(newcar2.bounds[6]-newlos1.bounds[0],newcar2.bounds[7]-newlos1.bounds[1]);
	newtiles.push(newequi9);
	var newequi10 = tile.myclone();
	newequi10.los2equi();
	newequi10.id.push('equi10');
	newequi10.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi10.rotate(tile.bounds[0],tile.bounds[1],-3*Math.PI/12);
	newequi10.shift(newcar2.bounds[4]-newlos1.bounds[0],newcar2.bounds[5]-newlos1.bounds[1]);
	newtiles.push(newequi10);
	var newequi11 = tile.myclone();
	newequi11.los2equi();
	newequi11.id.push('equi11');
	newequi11.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi11.rotate(tile.bounds[0],tile.bounds[1],-1*Math.PI/12);
	newequi11.shift(newequi9.bounds[4]-newlos1.bounds[0],newequi9.bounds[5]-newlos1.bounds[1]);
	newtiles.push(newequi11);
	var newequi12 = tile.myclone();
	newequi12.los2equi();
	newequi12.id.push('equi12');
	newequi12.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi12.rotate(tile.bounds[0],tile.bounds[1],Math.PI/12);
	newequi12.shift(newequi10.bounds[0]-newlos1.bounds[0],newequi10.bounds[1]-newlos1.bounds[1]);
	newtiles.push(newequi12);
	var newlos3 = tile.myclone();
	newlos3.id.push('los3');
	newlos3.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newlos3.shift(newequi10.bounds[0]-newlos1.bounds[0],newequi10.bounds[1]-newlos1.bounds[1]);
	newtiles.push(newlos3);
	return newtiles;
	break;
	
    case 'equi': // substitution σ : triangle -> 6 rhombuses and 10 triangles
	var newtiles = [];
	var newlos1 = tile.myclone();
	newlos1.equi2los();
	newlos1.id.push('los1');
	newlos1.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newlos1.rotate(tile.bounds[0],tile.bounds[1],-3*Math.PI/12);
	newtiles.push(newlos1);
	var newlos2 = tile.myclone();
	newlos2.equi2los();
	newlos2.id.push('los2');
	newlos2.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newlos2.rotate(tile.bounds[0],tile.bounds[1],-5*Math.PI/12);
	newtiles.push(newlos2);
	var newequi1 = tile.myclone();
	newequi1.id.push('equi1');
	newequi1.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi1.rotate(tile.bounds[0],tile.bounds[1],2*Math.PI/12);
	newequi1.shift(newlos1.bounds[6]-newlos1.bounds[0],newlos1.bounds[7]-newlos1.bounds[1]);
	newtiles.push(newequi1);
	var newequi2 = tile.myclone();
	newequi2.id.push('equi2');
	newequi2.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi2.rotate(tile.bounds[0],tile.bounds[1],-2*Math.PI/12);
	newequi2.shift(newlos2.bounds[2]-newlos1.bounds[0],newlos2.bounds[3]-newlos1.bounds[1]);
	newtiles.push(newequi2);      
	var newequi3 = tile.myclone();
	newequi3.id.push('equi3');
	newequi3.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi3.shift(newlos2.bounds[6]-newlos1.bounds[0],newlos2.bounds[7]-newlos1.bounds[1]);
	newtiles.push(newequi3);
	var newequi4 = tile.myclone();
	newequi4.id.push('equi4');
	newequi4.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi4.shift(newequi3.bounds[2]-newlos1.bounds[0],newequi3.bounds[3]-newlos1.bounds[1]);
	newtiles.push(newequi4);
	var newequi5 = tile.myclone();
	newequi5.id.push('equi5');
	newequi5.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi5.rotate(tile.bounds[0],tile.bounds[1],4*Math.PI/12);
	newequi5.shift(newequi3.bounds[2]-newlos1.bounds[0],newequi3.bounds[3]-newlos1.bounds[1]);
	newtiles.push(newequi5);
	var newequi6 = tile.myclone();
	newequi6.id.push('equi6');
	newequi6.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi6.shift(newequi3.bounds[4]-newlos1.bounds[0],newequi3.bounds[5]-newlos1.bounds[1]);
	newtiles.push(newequi6);
	var newequi7 = tile.myclone();
	newequi7.id.push('equi7');
	newequi7.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi7.rotate(tile.bounds[0],tile.bounds[1],-2*Math.PI/12);
	newequi7.shift(newequi1.bounds[4]-newlos1.bounds[0],newequi1.bounds[5]-newlos1.bounds[1]);
	newtiles.push(newequi7);
	var newlos3 = tile.myclone();
	newlos3.equi2los();
	newlos3.id.push('los3');
	newlos3.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newlos3.rotate(tile.bounds[0],tile.bounds[1],-1*Math.PI/12);
	newlos3.shift(newequi7.bounds[2]-newlos1.bounds[0],newequi7.bounds[3]-newlos1.bounds[1]);
	newtiles.push(newlos3);
	var newlos4 = tile.myclone();
	newlos4.equi2los();
	newlos4.id.push('los4');
	newlos4.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newlos4.rotate(tile.bounds[0],tile.bounds[1],Math.PI/12);
	newlos4.shift(newequi6.bounds[2]-newlos1.bounds[0],newequi6.bounds[3]-newlos1.bounds[1]);
	newtiles.push(newlos4);
	var newequi8 = tile.myclone();
	newequi8.id.push('equi8');
	newequi8.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi8.rotate(tile.bounds[0],tile.bounds[1],2*Math.PI/12);
	newequi8.shift(newlos4.bounds[0]-newlos1.bounds[0],newlos4.bounds[1]-newlos1.bounds[1]);
	newtiles.push(newequi8);
	var newequi9 = tile.myclone();
	newequi9.id.push('equi9');
	newequi9.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi9.rotate(tile.bounds[0],tile.bounds[1],-2*Math.PI/12);
	newequi9.shift(newlos4.bounds[0]-newlos1.bounds[0],newlos4.bounds[1]-newlos1.bounds[1]);
	newtiles.push(newequi9);
	var newlos5 = tile.myclone();
	newlos5.equi2los();
	newlos5.id.push('los5');
	newlos5.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newlos5.rotate(tile.bounds[0],tile.bounds[1],-9*Math.PI/12);
	newlos5.shift(newequi6.bounds[2]-newlos1.bounds[0],newequi6.bounds[3]-newlos1.bounds[1]);
	newtiles.push(newlos5);
	var newlos6 = tile.myclone();
	newlos6.equi2los();
	newlos6.id.push('los6');
	newlos6.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newlos6.rotate(tile.bounds[0],tile.bounds[1],-7*Math.PI/12);
	newlos6.shift(newlos2.bounds[4]-newlos1.bounds[0],newlos2.bounds[5]-newlos1.bounds[1]);
	newtiles.push(newlos6);
	var newequi10 = tile.myclone();
	newequi10.id.push('equi10');
	newequi10.scale(tile.bounds[0],tile.bounds[1],1/(2+2*Math.sin(Math.PI/3)));
	newequi10.rotate(tile.bounds[0],tile.bounds[1],2*Math.PI/12);
	newequi10.shift(newequi2.bounds[2]-newlos1.bounds[0],newequi2.bounds[3]-newlos1.bounds[1]);
	newtiles.push(newequi10);
	return newtiles;
	break;	

    default:
	// all tiles should be square, triangle or rhombus
	console.log("caution: undefined tile type for substitutionSt, id="+tile.id);
    }
}

//
// [3] defined duplicated tile informations St
//

var duplicatedSt = [];
// Overlapping tiles from the Square supertile
duplicatedSt.push(new DupInfo('car','equi','equi1',3,'equi','equi2'));
duplicatedSt.push(new DupInfo('car','equi','equi1',3,'equi','equi7'));
duplicatedSt.push(new DupInfo('car','equi','equi1',3,'equi','equi9'));
duplicatedSt.push(new DupInfo('car','equi','equi4',0,'equi','equi1'));
duplicatedSt.push(new DupInfo('car','equi','equi4',0,'equi','equi8'));
duplicatedSt.push(new DupInfo('car','equi','equi4',0,'equi','equi10'));
duplicatedSt.push(new DupInfo('car','equi','equi9',1,'equi','equi1'));
duplicatedSt.push(new DupInfo('car','equi','equi9',1,'equi','equi8'));
duplicatedSt.push(new DupInfo('car','equi','equi9',1,'equi','equi10'));
duplicatedSt.push(new DupInfo('car','equi','equi12',0,'equi','equi2'));
duplicatedSt.push(new DupInfo('car','equi','equi12',0,'equi','equi7'));
duplicatedSt.push(new DupInfo('car','equi','equi12',0,'equi','equi9'));
duplicatedSt.push(new DupInfo('car','equi','equi13',2,'equi','equi2'));
duplicatedSt.push(new DupInfo('car','equi','equi13',2,'equi','equi7'));
duplicatedSt.push(new DupInfo('car','equi','equi13',2,'equi','equi9'));
duplicatedSt.push(new DupInfo('car','equi','equi16',3,'equi','equi1'));
duplicatedSt.push(new DupInfo('car','equi','equi16',3,'equi','equi8'));
duplicatedSt.push(new DupInfo('car','equi','equi16',3,'equi','equi10'));
duplicatedSt.push(new DupInfo('car','equi','equi17',2,'equi','equi1'));
duplicatedSt.push(new DupInfo('car','equi','equi17',2,'equi','equi8'));
duplicatedSt.push(new DupInfo('car','equi','equi17',2,'equi','equi10'));
duplicatedSt.push(new DupInfo('car','equi','equi20',1,'equi','equi2'));
duplicatedSt.push(new DupInfo('car','equi','equi20',1,'equi','equi7'));
duplicatedSt.push(new DupInfo('car','equi','equi20',1,'equi','equi9'));

// Overlapping tiles from the Triangle supertile
duplicatedSt.push(new DupInfo('equi','equi','equi1',2,'los','equi2'));
duplicatedSt.push(new DupInfo('equi','equi','equi1',2,'los','equi3'));
duplicatedSt.push(new DupInfo('equi','equi','equi1',2,'los','equi10'));
duplicatedSt.push(new DupInfo('equi','equi','equi1',2,'los','equi11'));
duplicatedSt.push(new DupInfo('equi','equi','equi2',0,'equi','equi8'));
duplicatedSt.push(new DupInfo('equi','equi','equi2',0,'equi','equi10'));
duplicatedSt.push(new DupInfo('equi','equi','equi2',0,'los','equi1'));
duplicatedSt.push(new DupInfo('equi','equi','equi2',0,'los','equi4'));
duplicatedSt.push(new DupInfo('equi','equi','equi2',0,'los','equi9'));
duplicatedSt.push(new DupInfo('equi','equi','equi2',0,'los','equi12'));
duplicatedSt.push(new DupInfo('equi','equi','equi7',2,'equi','equi8'));
duplicatedSt.push(new DupInfo('equi','equi','equi7',2,'equi','equi10'));
duplicatedSt.push(new DupInfo('equi','equi','equi7',2,'los','equi1'));
duplicatedSt.push(new DupInfo('equi','equi','equi7',2,'los','equi4'));
duplicatedSt.push(new DupInfo('equi','equi','equi7',2,'los','equi9'));
duplicatedSt.push(new DupInfo('equi','equi','equi7',2,'los','equi12'));
duplicatedSt.push(new DupInfo('equi','equi','equi8',1,'los','equi2'));
duplicatedSt.push(new DupInfo('equi','equi','equi8',1,'los','equi3'));
duplicatedSt.push(new DupInfo('equi','equi','equi8',1,'los','equi10'));
duplicatedSt.push(new DupInfo('equi','equi','equi8',1,'los','equi11'));
duplicatedSt.push(new DupInfo('equi','equi','equi9',1,'equi','equi10'));
duplicatedSt.push(new DupInfo('equi','equi','equi9',1,'los','equi1'));
duplicatedSt.push(new DupInfo('equi','equi','equi9',1,'los','equi4'));
duplicatedSt.push(new DupInfo('equi','equi','equi9',1,'los','equi9'));
duplicatedSt.push(new DupInfo('equi','equi','equi9',1,'los','equi12'));
duplicatedSt.push(new DupInfo('equi','equi','equi10',0,'los','equi2'));
duplicatedSt.push(new DupInfo('equi','equi','equi10',0,'los','equi3'));
duplicatedSt.push(new DupInfo('equi','equi','equi10',0,'los','equi10'));
duplicatedSt.push(new DupInfo('equi','equi','equi10',0,'los','equi11'));

// Overlapping tiles from the Rhombus supertile
duplicatedSt.push(new DupInfo('los','equi','equi1',3,'los','equi2'));
duplicatedSt.push(new DupInfo('los','equi','equi1',3,'los','equi3'));
duplicatedSt.push(new DupInfo('los','equi','equi1',3,'los','equi10'));
duplicatedSt.push(new DupInfo('los','equi','equi1',3,'los','equi11'));
duplicatedSt.push(new DupInfo('los','equi','equi3',3,'los','equi4'));
duplicatedSt.push(new DupInfo('los','equi','equi3',3,'los','equi9'));
duplicatedSt.push(new DupInfo('los','equi','equi3',3,'los','equi12'));
duplicatedSt.push(new DupInfo('los','equi','equi10',1,'los','equi12'));
duplicatedSt.push(new DupInfo('los','equi','equi12',1,'los','equi10'));
var duplicatedStoriented = [];

//
// [4] fill neighbors informations in St newtiles (by side effect)
//

//
// [6] use default neighbors2bounds
// 
var neighbors2boundsSt = new Map();
neighbors2boundsSt.set('car',default_neighbors2bounds(4));
neighbors2boundsSt.set('equi',default_neighbors2bounds(3));
neighbors2boundsSt.set('los',default_neighbors2bounds(4));

//
// [7] construct base tilings and call substitute
//
// prepare decoration
decorateSt = new Map();
decorateSt.set('car',0);
decorateSt.set('equi',1);
decorateSt.set('los',2);

//
// [7.1] construct "Stampfli's" tiling by substitution
// 
Tiling.stampflisSubstitution = function({iterations}={}){
    var tiles = [];
    // construct initial tile
    var mycar = car.myclone();
    mycar.id.push(0);
    tiles.push(mycar);
    // call the substitution
    tiles = substitute(
	iterations,
	tiles,
	2+2*Math.sin(Math.PI/3),
	substitutionSt,
	duplicatedSt,
	duplicatedStoriented,
	"I am lazy",
	neighbors2boundsSt,
	decorateSt
    );
    // construct tiling
    return new Tiling(tiles);
}
