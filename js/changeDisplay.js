function changeIPS(val){
	SPEED = val.value;
}

function changeDelay(val){
	delay = val.value;
}

function changeSeed(val){
	Math.seedrandom(val.value);
}

function refresh_zoom(){
	if(app)
		document.getElementById("zoomLevel").value = Math.round(app.camera.zoom * 100) / 100;
}

function set_zoom(val){
	if(app){
		app.camera.zoom = val.value;
		app.controls.zoomCamera();
		app.controls.object.updateProjectionMatrix();
	}
}

function hideComplex(val){
	if(val.value == "Rand") document.getElementById("seedMask").style.visibility = "visible";
	else document.getElementById("seedMask").style.visibility = "hidden";
	
	if(val.value == "Dual" || val.value == "MaxS" || val.value == "Iden") document.getElementById("complexTimesMask").style.visibility = "hidden";
	else document.getElementById("complexTimesMask").style.visibility = "visible";
}

function hideParams(val){
	if(val.value == "gridHex" || val.value == "gridSq") document.getElementById("squareParams").style.visibility = "visible";
	else document.getElementById("squareParams").style.visibility = "hidden";
	
	if(val.value == "gridPenHK" || val.value == "gridPenHD" || val.value == "gridPenSun" || val.value == "gridPenStar"){
		document.getElementById("penroseParams").style.visibility = "visible";
		document.getElementById("seedMask").style.visibility = "visible";
	} else {
		document.getElementById("penroseParams").style.visibility = "hidden";
		document.getElementById("seedMask").style.visibility = "visible";
	}
}

// Get the modal
var modal = document.getElementById('colors');

// Get the button that opens the modal
var btn = document.getElementById("colorButton");

// When the user clicks on the button, open the modal 
btn.onclick = function() {
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
	var colorTotal = cmap.length;
	
	var addColor = document.createElement("button");
	addColor.innerHTML = "Add color";
	addColor.classList.add("button");
	addColor.style = "bottom:20px;right:100px;position:absolute;";
	addColor.onclick = function() {
		var para = document.createElement("p");
		var node = document.createTextNode("Color " + colorTotal);
		colorTotal ++;
		var colElement = document.createElement("input");
		colElement.type = "color";
		colElement.style= "display:inline; margin-left:20px";
		
		colorInputs.push(colElement);
		
		para.appendChild(node);
		para.appendChild(colElement);
		modal.children[0].appendChild(para);
	}
	
	var validate = document.createElement("button");
	validate.classList.add("button");
	validate.innerHTML = "Save";
	validate.style = "bottom:20px; right:20px;position:absolute;";
	validate.onclick = function() {
		var newCmap = [];
		for(var i = 0; i < colorInputs.length; i++){
			var col = new THREE.Color(0x000000);
			col.set(colorInputs[i].value);
			newCmap.push(col);
		}
		cmap = newCmap;
		if(currentGrid){
			currentGrid.cmap = newCmap;
			currentGrid.colorTiles();
		}
		modal.style.display = "none";
	}
	
	modal.children[0].appendChild(addColor);
	
	modal.children[0].appendChild(validate);
    modal.style.display = "block";
}

function changeOneColor(){
	
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


// Using JQuerry to prevent breaking the inputs
$(document).on('keyup', 'input', function () {
    var _this = $(this);
    var min = parseInt(_this.attr('min')) || 1; // if min attribute is not defined, 1 is default
    var max = parseInt(_this.attr('max')) || 100; // if max attribute is not defined, 100 is default
    var val = parseInt(_this.val()) || (min - 1); // if input char is not a number the value will be (min - 1) so first condition will be true
    if(val < min)
        _this.val( min );
    if(val > max)
        _this.val( max );
});