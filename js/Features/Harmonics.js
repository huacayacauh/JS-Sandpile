Tiling.apply_harmonic = function(){
	
	var grid_width = Number(document.getElementById("cW").value);
	var grid_height = Number(document.getElementById("cH").value);
	var identifier = document.getElementById("harmonicValue").value;
	
	var harmonic = new Array( grid_width + 2);

	for (var i = 0; i <  grid_width + 2; i++) {
	  harmonic[i] = new Array( grid_height + 2);
	}
	var harm_min = 0;
	for (var i = 0; i <  grid_width + 2; i++) {
	  for (var j = 0; j <  grid_height + 2; j++) {
		  if((i == 0 && j == 0) || (i ==  grid_width + 1 && j == 0) ||
		  (i ==  grid_width + 1 && j ==  grid_height + 1) ||(i == 0 && j ==  grid_height + 1)){
			continue;
		  }
		  var x = i - Math.floor( grid_width/2) - 1;
		  var y = j - Math.floor( grid_height/2) - 1;
		  switch(identifier){
			  case "1A":
			  harmonic[i][j] = x;
			  break;
			  
			  case "1B":
			  harmonic[i][j] = y;
			  break;
			  
			  case "2A":
			  harmonic[i][j] = x * y;
			  break;
			  
			  case "2B":
			  harmonic[i][j] = x*x - y*y;
			  break;
			  
			  case "3A":
			  harmonic[i][j] = x*x*x - 3*x*y*y;
			  break;
			  
			  case "3B":
			  harmonic[i][j] = y*y*y - 3*y*x*x;
			  break;
			  
			  case "4A":
			  harmonic[i][j] = x*x*x*x - 6*x*x*y*y + y*y*y*y - x*x - y*y;
			  break;
			  
			  case "4B":
			  harmonic[i][j] = x*x*x*y - x*y*y*y;
			  break;
		  }
		  if(harm_min > harmonic[i][j]){
			harm_min = harmonic[i][j];
		  }
		}
	}
	
	for (var i = 0; i <  grid_width + 2; i++) {
	  for (var j = 0; j <  grid_height + 2; j++) {
		  harmonic[i][j] -= harm_min;
		}
	}
	var harm_gcd = harmonic[0][0];
	for (var i = 0; i <  grid_width + 2; i++) {
	  for (var j = 0; j <  grid_height + 2; j++) {
		  harm_gcd = gcd(harm_gcd, harmonic[i][j]);
		}
	}
	for (var i = 0; i <  grid_width; i++) {
	  for (var j = 0; j <  grid_height; j++) {
		  if(i == 0){
			  this.add(i* grid_height + j, harmonic[i][j+1] / harm_gcd);
		  }
		  if(i ==  grid_width - 1){
			  this.add(i* grid_height + j, harmonic[i+2][j+1] / harm_gcd);
		  }
		  if(j == 0){
			  this.add(i* grid_height + j, harmonic[i+1][j] / harm_gcd);
		  }
		  if(j ==  grid_height - 1){
			  this.add(i* grid_height + j, harmonic[i+1][j+2] / harm_gcd);
		  }
		}
	}

}

function gcd(x, y) {
  if ((typeof x !== 'number') || (typeof y !== 'number')) 
    return false;
  x = Math.abs(x);
  y = Math.abs(y);
  while(y) {
    var t = y;
    y = x % y;
    x = t;
  }
  return x;
}
