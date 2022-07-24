// This code is part of JS-Sandpile (https://github.com/huacayacauh/JS-Sandpile/)
// CC-BY Valentin Darrigo, Jeremy Fersula, Kevin Perrot

// ################################################
//
// 	[ 1.0 ] 	GUI Functions
//
//		Used directly by JS-Sandpile.html
//
// ################################################
function changeIPS(val){
	it_per_frame = val.value;
}

function changeDelay(val){
	delay = val.value;
}

function changeSeed(val){
	Math.seedrandom(val.value);
}

function set_zoom(val){
	if(app){
		app.camera.zoom = val.value / 100;
		app.controls.zoomCamera();
		app.controls.object.updateProjectionMatrix();
	}
}

// Using JQuerry to prevent breaking the inputs
$(document).on('keyup', 'input', function () {
    var _this = $(this);
    var min = parseInt(_this.attr('min')) || 0; // if min attribute is not defined, 1 is default
	var max = parseInt(_this.attr('max')) || 999; // if max attribute is not defined, 100 is default
    var val = parseInt(_this.val()) || (min - 1); // if input char is not a number the value will be (min - 1) so first condition will be true
	if(val < min)
        _this.val( min );
    if(val > max)
        _this.val( max );
});



// ################################################
//
// 	[ 2.0 ] 	Color picking window
//
//		See Tiling.js [ 2.0 ] and [ 2.6 ]
//		for the use of colormaps.
//
// ################################################

// Color selection modal
var modal = document.getElementById('colors');

// Button that opens the modal
var btn = document.getElementById("colorButton");

var current_preset = "default";

// When the user clicks on the button, open the modal 
btn.onclick = function() {
	
	// ------------------------------------------------
	// 	[ 2.1 ] 	Re-build the content of the
	//				modal every-time we open it
	// ------------------------------------------------
	while (modal.children[0].firstChild) {
		modal.children[0].removeChild(modal.children[0].firstChild);
	}
	var exitModal = document.createElement("span");
	exitModal.classList.add('close');
	exitModal.innerHTML = "&times;";
	exitModal.onclick = function() {
	  modal.style.display = "none";
	}
	
	
	modal.children[0].appendChild(exitModal);
	
	var colorInputs = []
	
	var default_para;
	
	for(var i = 0; i<cmap.length; i++){
		var para = document.createElement("p");
		var node = document.createTextNode("Color " + i);
		
		var colElement = document.createElement("input");
		colElement.type = "color";
		colElement.style= "display:inline; margin-left:20px";
		colElement.value = "#" + cmap[i].getHexString();
		
		colorInputs.push(colElement);
		
		para.appendChild(node);
		para.appendChild(colElement);
		modal.children[0].appendChild(para);
	}
	
	// The modal is fully built, now we add buttons to add or remove colors
	
	var colorTotal = cmap.length;
	
	var addColor = document.createElement("button");
	addColor.innerHTML = "Add color";
	addColor.classList.add("btn");
	addColor.classList.add("btn-default");
	addColor.style = "bottom:20px;right:100px;position:absolute;";
	addColor.onclick = function() {
		var para = document.createElement("p");
		var node = document.createTextNode("Color " + colorTotal);
		colorTotal ++;
		
		var colElement = document.createElement("input");
		colElement.type = "color";
		colElement.style= "display:inline; margin-left:20px";
		if(colorInputs.length > 0)
			colElement.value = colorInputs[colorInputs.length - 1].value;
		else
			colElement.value = "#000000";
		colorInputs.push(colElement);
		
		para.appendChild(node);
		para.appendChild(colElement);
		modal.children[0].appendChild(para);
	}
	
	var validate = document.createElement("button");
	validate.classList.add("btn");
	validate.classList.add("btn-default");
	validate.innerHTML = "Save";
	validate.style = "bottom:20px; right:20px;position:absolute;";
	validate.onclick = function() {
		current_preset = preset_choice.value;
		var newCmap = [];
		if(preset_choice.value != "default"){
			for(var i = 0; i < colorInputs.length; i++){
				var col = new THREE.Color(0x000000);
				col.set(colorInputs[i].value);
				newCmap.push(col);
			}
		}
		cmap = newCmap;
		if(currentTiling){
			currentTiling.cmap = newCmap;
			currentTiling.colorTiles();
		}
		modal.style.display = "none";
	}
	
	// ------------------------------------------------
	// 	[ 2.2 ] 	Manages presets
	//
	//		This section could be improved.
	// ------------------------------------------------
	
	var preset_span = document.createElement("span");
	preset_span.innerHTML = "Preset : ";
	var preset_choice = document.createElement("select");
	preset_span.style = "top:60px; right:20px;position:absolute;";
	preset_choice.style = "display:inline";
	preset_choice.id ="preset_choice";
	preset_span.appendChild(preset_choice);
	preset_choice.oninput = function() {
		
		if(this.value == "default" || this.value ==""){
			// default 
			var para = document.createElement("p");
			var node = document.createTextNode("Greyscale while stable, flashy colors if not.");
			para.style = "height:80px; margin-top:80px;";
			
			para.appendChild(node);
			default_para = para;
			modal.children[0].appendChild(para);
			addColor.style = "display:none";
		} else {
			if(default_para){
				modal.children[0].removeChild(default_para);
				addColor.style = "bottom:20px;right:100px;position:absolute;";
				default_para = null;
			}
		}
		var black4_array = ["#ffffff", "#cccccc", "#666666", "#000000", "#ff1a1a", "#ff751a", "#ffbb33", "#ffff4d", "#99ff66", "#44ff11", "#22ffaa", "#00ffff", "#0077ff",  "#0000ff"];
		var black3_array = ["#ffffff", "#aaaaaa", "#000000", "#ff1a1a", "#ff9933", "#ffff4d", "#99ff66", "#44ff11", "#22ffaa", "#00ffff", "#0077ff",  "#0000ff"];
		var grey_array = ["#ffffff", "#dddddd", "#bbbbbb", "#999999", "#777777", "#555555", "#eeee00"];
		var lava_array = ["#cccccc", "#888888", "#444444", "#553333", "#772222", "#aa1111", "#ff1100", "#ff8800", "#eeee00"];
		var blue_array = ["#000055", "#000088", "#0022aa", "#0044ff", "#0099ff", "#00ccff", "#00ffff", "#aaffff", "#ffffff"];
		var green_array = ["#ffffff", "#ffffcc", "#ddffaa", "#aaff77", "#66ff33", "#33cc33", "#009933"];
		
		var selected_array;
		
		switch(preset_choice.value){
			case "black4":
			selected_array = black4_array;
			break;

			case "black3":
			selected_array = black3_array;
			break;

			case "grey":
			selected_array = grey_array;
			break;
			
			case "lava":
			selected_array = lava_array;
			break;
			
			case "blue":
			selected_array = blue_array;
			break;
			
			case "green":
			selected_array = green_array;
			break;
			
			default:
			selected_array = [];
			break;
		}
		
		for(var i = 0; i < selected_array.length; i++){
			if(colorInputs[i]){
				colorInputs[i].value = selected_array[i];
			} else {
				addColor.onclick();
				colorInputs[i].value = selected_array[i];
			}
		}
		if(selected_array.length < colorInputs.length){
			for(var i = selected_array.length; i < colorInputs.length; i++){
				colorInputs[i].parentNode.parentNode.removeChild(colorInputs[i].parentNode);
				colorTotal --;
			}
			
			colorInputs.splice(selected_array.length, colorInputs.length - selected_array.length);
		}
	}
	
	// Create element for each preset we defined
	
	var p0 = document.createElement("option");
	p0.value = "default";
	p0.innerHTML = "Default";
	preset_choice.appendChild(p0);
	
	var p1 = document.createElement("option");
	p1.value = "black4";
	p1.innerHTML = "Greyscale 4";
	preset_choice.appendChild(p1);
	
	var p2 = document.createElement("option");
	p2.value = "black3";
	p2.innerHTML = "Greyscale 3";
	preset_choice.appendChild(p2);
	
	var p3 = document.createElement("option");
	p3.value = "grey";
	p3.innerHTML = "Gold Dust";
	preset_choice.appendChild(p3);
	
	var p4 = document.createElement("option");
	p4.value = "lava";
	p4.innerHTML = "Lava red";
	preset_choice.appendChild(p4);
	
	var p5 = document.createElement("option");
	p5.value = "blue";
	p5.innerHTML = "Deep blue";
	preset_choice.appendChild(p5);
	
	var p6 = document.createElement("option");
	p6.value = "green";
	p6.innerHTML = "Lime green";
	preset_choice.appendChild(p6);
	
	
	// We append the controls created to the modal and display it on screen
	
	modal.children[0].appendChild(addColor);
	modal.children[0].appendChild(validate);
	modal.children[0].appendChild(preset_span);
    modal.style.display = "block";
	
	document.getElementById("preset_choice").value = current_preset;
	preset_choice.oninput();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


function toSphere(){
	if(currentTiling){
		var tils = currentTiling.tiles;
		var maxi=0;
		for(var i =0; i<tils.length; i++){
			for(var j=0; j<tils[i].bounds.length; j++){
				if(tils[i].bounds[j] > maxi){
					maxi = tils[i].bounds[j];
				}
			}
		}
		maxi = maxi/10;
		for(var i =0; i<tils.length; i++){
			for(var j=0; j<tils[i].bounds.length; j+=2){
				var x = tils[i].bounds[j] - currentTiling.center[0];
				var y = tils[i].bounds[j+1] - currentTiling.center[1];
				var r = Math.atan(Math.sqrt(x*x + y*y)/maxi) +0.00000001;
				var theta = Math.atan2(y+0.000000001, x);
				tils[i].bounds[j] = 20*r * Math.cos(theta);
				tils[i].bounds[j+1] = 20*r * Math.sin(theta);
			}
		}
	}

}


// ################################################
//
// 	[ 3.0 ] 	Misc display Functions
//
//		Used directly by JS-Sandpile.html
//
// ################################################

function hideParams(){
	var func = document.getElementById("TilingSelect").value;
	func = "Tiling." + func +".toString()";
	var func_str = eval(func);
	
	var params = ["height", "width", "iterations", "size", "order", "cropMethod", "kwidth", "knotchA", "knotchB", "lineplace", "linespace", "kposi", "kposlist"];
	for(var i=0; i<params.length; i++){
		if(func_str.includes(params[i])){
			document.getElementById("p_" + params[i]).style="display:contents";
		} else {
			document.getElementById("p_" + params[i]).style="display:none";
		}
	}
		
}

// Prevents wireFrameToggle from being automatcally set to true
//$('input[id="wireFrameToggle"]').removeAttr('checked');

