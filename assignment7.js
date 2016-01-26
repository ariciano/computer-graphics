/**
 * Decartes is a 3d drawing library for Ken Perlin's Computer Graphics Course.
 * @type {Object}
 */
var Decartes = {};

/**
 * borrowed from tonejs/underscore
 * @param  {[type]}  val [description]
 * @return {Boolean}     [description]
 */
function isUndef(val) {
	return val === void 0;
}

/**
 * Have a child inherit all the parent's prototypes. Borrowed from Tonejs/Closure
 * @param  {function} child  [description]
 * @param  {[type]} parent [description]
 * @return {[type]}        [description]
 */
var extend = function (child, parent) {
	if (isUndef(parent)) {
		parent = Decartes;
	}
	function TempConstructor() {
	}
	TempConstructor.prototype = parent.prototype;
	child.prototype = new TempConstructor();
	/** @override */
	child.prototype.constructor = child;
	child._super = parent;
};



/**
 * multplies two vectors together 
 * borrowed from http://stackoverflow.com/questions/27205018/multiply-2-matrices-in-javascript
 * @param  {matrix} a left side matrix
 * @param  {matrix} b right side matrix
 * @return {matrix}   resultant matrix
 */
function multiply(a, b) {
	var aNumRows = a.length, aNumCols = a[0].length,
		bNumRows = b.length, bNumCols = b[0].length,
		m = new Array(aNumRows);
	// console.log("aNumCols = " + aNumCols);
	// console.log("aNumRows = " + aNumRows);
	// console.log("bNumCols = " + bNumCols);
	// console.log("bNumRows = " + bNumRows);
	// console.log(a);
	// console.log(b);

	// if(aNumCols === undefined){
	// 	aNumCols = aNumRows;
	// 	aNumRows = 1;
	// }
	// if(bNumCols === undefined){
	// 	bNumCols = bNumRows;
	// 	bNumRows = 1;
	// }
	// console.log("aNumCols = " + aNumCols);
	// console.log("aNumRows = " + aNumRows);
	// console.log("bNumCols = " + bNumCols);
	// console.log("bNumRows = " + bNumRows);

	if(aNumCols != bNumRows) {
		throw new Error("Dimensionality error: cannot multiply matrices of unequal width a and height b");
	}

	for (var r = 0; r < aNumRows; ++r) {
		m[r] = new Array(bNumCols);
		for (var c = 0; c < bNumCols; ++c) {
			m[r][c] = 0;
			for (var i = 0; i < aNumCols; ++i) {
				m[r][c] += a[r][i] * b[i][c];
			}
		}
	}
	return m;
}

/**
 * takes the dot product of two vectors of equal length
 * @param  {array} a first vector
 * @param  {array} b second vector
 * @return {number}   result
 */
function dot(a, b){
	var aLen = a.length,
	bLen = b.length,
	d = 0;

	if(aLen != bLen){
		throw new Error("Dimensionality error: cannot take dot product of vectors with unequal length");
	}

	for(var i = 0; i < aLen; i++) {
		d += a[i] * b[i];
	}
	return d;
}
/**
 *  Borrowed from Tone.js
 *  Makes an xhr reqest for the selected url.Invokes
 *  the callback once the file loads.
 *  @param {string} url The url of the buffer to load.
 *                      filetype support depends on the
 *                      browser.
 *  @param {function} callback The function to invoke when the url is loaded. 
 *  @returns {XMLHttpRequest} returns the XHR
 */
Decartes.load = function(url, callback){
	var request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.responseType = "arraybuffer";
	// decode asynchronously
	request.onload = function() {
		callback();
	};
	//send the request
	request.send();
	return request;
};

/**
 * A matrix class with transformation methods
 * Made by Seth Kranzler 
 */
Decartes.Matrix = function() {
	this.matrix = [[1, 0, 0 ,0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];

	return this;
};

/**
 * Used to set the identity matrix for new shapes
 * @return {this}
 */
Decartes.Matrix.identity = function() {
	this.identityMatrix = [[1, 0, 0 ,0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];

	return this.identityMatrix;
};

/**
 * translates the matrix by some x, y, and z factor
 * @param  {number} x x offset
 * @param  {number} y y offset
 * @param  {number} z z offset
 * @return {this}
 */
Decartes.Matrix.prototype.translate = function(x, y, z) {
	this._translationMatrix = [[1, 0, 0, x], [0, 1, 0, y], [0, 0, 1, z], [0, 0, 0, 1]];
	this.matrix = multiply(this.matrix, this._translationMatrix);

	return this;
};

/**
 * Takes an argument theta in radians and rotates the matrix
 * about the X axis by it.
 * @param  {radians} theta rotation angle in radians
 * @return {this}
 */
Decartes.Matrix.prototype.rotateX = function(theta) {
	var cos = Math.cos(theta);
	var sin = Math.sin(theta);

	this._rotationMatrix = [[1, 0, 0, 0], [0, cos, -sin, 0], [0, sin, cos, 0], [0, 0, 0, 1]];
	this.matrix = multiply(this.matrix, this._rotationMatrix);

	return this;
};

/**
 * Takes an argument theta in radians and rotates the matrix
 * about the Y axis by it.
 * @param  {radians} theta rotation angle in radians
 * @return {this}
 */
Decartes.Matrix.prototype.rotateY = function(theta) {
	var cos = Math.cos(theta);
	var sin = Math.sin(theta);

	this._rotationMatrix = [[cos, 0, sin, 0], [0, 1, 0, 0], [-sin, 0, cos, 0], [0, 0, 0, 1]];
	this.matrix = multiply(this.matrix, this._rotationMatrix);

	return this;
};

/**
 * Takes an argument theta in radians and rotates the matrix
 * about the Z axis by it.
 * @param  {radians} theta rotation angle in radians
 * @return {this}
 */
Decartes.Matrix.prototype.rotateZ = function(theta) {
	var cos = Math.cos(theta);
	var sin = Math.sin(theta);

	this._rotationMatrix = [[cos, -sin, 0, 0], [sin, cos, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
	this.matrix = multiply(this.matrix, this._rotationMatrix);

	return this;
};

/**
 * scales the matrix 
 * @param  {number} x x scale factor
 * @param  {number} y y scale factor
 * @param  {number} z z scale factor
 * @return {this}
 */
Decartes.Matrix.prototype.scale = function(x, y, z) {
	this._scaleMatrix = [[x, 0, 0, 0], [0, y, 0, 0], [0, 0, 0, z], [0, 0, 0, 1]];
	this.matrix = multiply(this.matrix, this._scaleMatrix);

	return this;
};

/**
 * transforms a vector with the matrix
 * @param  {matrix} src source vertex array
 * @param  {matrix} dst destination vertex array
 * @return {this}
 */
Decartes.Matrix.prototype.transform = function() {
	for(var i = 0, max = this.vertices.length; i < max; i++){
		var numRows = this.matrix.length;
		for(var j = 0; j < numRows; j ++) {
			this.transformedVerts[i][j] = dot(this.matrix[j], this.vertices[i]);
		}
	}
	return this;
};

/**
 * transforms the coordinates from model space (-1 .. 1)
 * to canvas space (0 .. height, 0 .. width)
 * @param  {array} p      array of x y points
 * @param  {pixels} width  canvas width
 * @param  {pixels} height canvas height
 * @return {array}        array of transformed height/width
 */
function modelToCanvas (p, width, height) {
	return [(width  / 2) + p[0] * (width / 2), (height / 2) - p[1] * (width / 2)];
}

function canvasToModel (p, width, height) {
	return [(2*p[0]/width)-1, (p[1] -(height/2))*(1/width)];
}

/**
 * creates an empty array to hold vertices
 * @param {matrix} vert vertex matrix to copy
 */
Decartes.VertContainer = function(vert) {
	var container = new Array(vert.length);
	for(var i = 0; i < vert.length; i++){
		container[i] = new Array(4);
	}
	return container;
};

Decartes.ControlPoint = function(x, y){
	this.x = x;
	this.y = y;
};

Decartes.ControlPoint.prototype.draw = function(g, width, height){
	g.beginPath();
	g.strokeStyle = "red";
	this.canvasCoord = modelToCanvas([this.x, this.y], width, height);
	g.arc(this.canvasCoord[0], this.canvasCoord[1], 3, 0, 2*Math.PI);
	g.stroke();
};

Decartes.ControlPoint.prototype.update = function(x, y){
	this.x = x;
	this.y = y;
};

Decartes.Control = function(x, y){
	this.x = x;
	this.y = y;
	this.tx = x + 0.1;
	this.ty = y + 0.1;
	// this.delta = this.ty/this.tx;

	this.positionPoint = new Decartes.ControlPoint(this.x, this.y);
	this.tangentPoint = new Decartes.ControlPoint(this.tx, this.ty);
};

Decartes.Control.prototype.updatePosition = function(x,y){
	this.x = x;
	this.y = y;
	this.positionPoint.update(x, y);
};

Decartes.Control.prototype.updateTangent = function(x,y){
	this.tx = x;
	this.ty = y;

	this.tangentPoint.update(x, y);
};

Decartes.Control.prototype.draw = function(g, width, height){
	// debugger;
	this.positionPoint.draw(g, width, height);
	this.tangentPoint.draw(g, width, height);
	g.moveTo(this.positionPoint.canvasCoord[0], this.positionPoint.canvasCoord[1]);
	g.lineTo(this.tangentPoint.canvasCoord[0], this.tangentPoint.canvasCoord[1]);
	g.stroke();
};


/**
 * Hermite spline
 */
Decartes.Hermite = function(){
	// this.matrix = [[2, -2, 1, 1], [-3, 3, -2, -1], [0, 0, 1, 0], [1, 0, 0, 0]];
	this.yParameters = [];//[-0.5, 0.5, 1, 1];
	this.xParameters = [];//[-0.5, 0.5, 1, 1];

	return this;
};

extend(Decartes.Hermite, Decartes.Matrix);

Decartes.Hermite.prototype.setPoints = function(sPoint, ePoint){
	this.scale = 4;
	this.yParameters[0] = sPoint.y;
	this.yParameters[2] = this.scale * (-sPoint.ty + sPoint.y);
	this.xParameters[0] = sPoint.x;
	this.xParameters[2] = this.scale * (-sPoint.tx + sPoint.x);

	this.yParameters[1] = ePoint.y;
	this.yParameters[3] = this.scale * (ePoint.ty - ePoint.y);
	this.xParameters[1] = ePoint.x;
	this.xParameters[3] = this.scale * (ePoint.tx - ePoint.x);
};

Decartes.Hermite.prototype.render = function(res){
	this.yPosition = new Array(res);
	this.xPosition = new Array(res);
	for (var i = 0; i < res; i ++){
		var t = i/(res - 1);
		var p0 = this.yParameters[0];
		var p1 = this.yParameters[1];
		var m0 = this.yParameters[2];
		var m1 = this.yParameters[3];
		this.yPosition[i] = (2.0*t*t*t - 3.0*t*t + 1.0) * p0 
						+ (t*t*t - 2.0*t*t + t) * m0 
						+ (-2.0*t*t*t + 3.0*t*t) * p1 
						+ (t*t*t - t*t) * m1;
	}
	for (var i = 0; i < res; i ++){
		var t = i/(res - 1);
		var p0 = this.xParameters[0];
		var p1 = this.xParameters[1];
		var m0 = this.xParameters[2];
		var m1 = this.xParameters[3];
		this.xPosition[i] = (2.0*t*t*t - 3.0*t*t + 1.0) * p0 
						+ (t*t*t - 2.0*t*t + t) * m0 
						+ (-2.0*t*t*t + 3.0*t*t) * p1 
						+ (t*t*t - t*t) * m1;
	}

	return this;
};

/**
 * draw the hermite
 * @param  {[type]} g      [description]
 * @param  {[type]} width  [description]
 * @param  {[type]} height [description]
 * @return {[type]}        [description]
 */
Decartes.Hermite.prototype.draw = function(g, width, height){
	var point = modelToCanvas([this.xPosition[0], this.yPosition[0]], width, height);

	g.moveTo(this.xPosition[0], this.yPosition[0]);
	g.beginPath();
	for(var i = 0, iMax = this.xPosition.length; i < iMax; i++){
		point = modelToCanvas([this.xPosition[i], this.yPosition[i]], width, height);
		g.lineTo(point[0], point[1]);
	}
	g.stroke();
	// g.closePath();
};

/**
 * Bezier spline
 */
Decartes.Bezier = function(){
	this.matrix = [[-1, 3, -3, 1], [3, -6, 3, 0], [-3, 3, 0, 0], [1, 0, 0, 0]];
};

extend(Decartes.Bezier, Decartes.Matrix);

/**
 * [Shape description]
 */
Decartes.Shape = function(){
};

extend(Decartes.Shape, Decartes.Matrix);

/**
 * draws a shape based on vertices and edges
 * @param  {context} g      canvas context
 * @param  {array} verts  vertex array
 * @param  {array} edges  edge array
 * @param  {pixels} width  canvas width
 * @param  {pixels} height canvas height
 */
Decartes.Shape.prototype.draw = function(g, width, height) {
	this.transform();
	var numVert = this.transformedVerts.length,
		numEdge = this.edges.length,
		pointA = [],
		pointB = [];

	g.beginPath();
	for(var e = 0; e < numEdge; e++){
		pointA = this.transformedVerts[this.edges[e][0]];
		pointB = this.transformedVerts[this.edges[e][1]];

		pointA = modelToCanvas(pointA, width, height);
		pointB = modelToCanvas(pointB, width, height);
		//pointA[1, 0] 
		g.moveTo(pointA[0], pointA[1]);
		g.lineTo(pointB[0], pointB[1]);
	}
	g.stroke();
	g.closePath();
};

/**
 * Holds the edges and vertices for a cube
 */
Decartes.Cube = function(){
	this.edges = [[0, 1], [1, 3], [3, 2], [2, 0], [0, 4], [1, 5], [3, 7], [2, 6], [4, 5], [5, 7], [7, 6], [6, 4]];
	this.vertices = [[-1, -1, -1, 1], [1, -1, -1, 1], [-1, 1, -1, 1], [1, 1, -1, 1], [-1, -1, 1, 1], [1, -1, 1, 1], [-1, 1, 1, 1], [1, 1, 1, 1]];
	this.matrix = Decartes.Matrix.identity();
	this.transformedVerts = new Decartes.VertContainer(this.vertices);

	return this;
};

extend(Decartes.Cube, Decartes.Shape);

Decartes.Triangle = function(){
	this.edges = [[0, 1], [1, 3], [3, 2], [2, 0], [0, 4], [1, 4], [2, 4], [3, 4]];
	this.vertices = [[-1, -1, -1, 1], [1, -1, -1, 1], [-1, 1, -1, 1], [1, 1, -1, 1], [0, 0, 1, 1]];
	this.matrix = Decartes.Matrix.identity();
	this.transformedVerts = new Decartes.VertContainer(this.vertices);

	return this;
};

/**
 * Generates the edges and vertices of a cylinder
 */
Decartes.Cylinder = function() {
	var res = 20;

	this.edges = [];
	this.vertices = [];

	for(var i = 0; i < res; i ++){
		for(var j = 0; j < res; j ++){
			var v = i/res;
			var u = j / res;
			var theta = 2*Math.PI*u;
			var count = i*res + j;

			var y = Math.cos(theta);
			var x = Math.sin(theta);
			var z = 2*v - 1;

			this.vertices[count] = [x, y, z, 1];
			if(j < res-1){
				this.edges.push([i*res + j, i*res + j + 1]);
			} else {
				this.edges.push([i*res + j, i*res]);
			}
			if(i < res-1){
				this.edges.push([i*res + j, (i+1)*res + j]);
			}
		}

	}
	this.matrix = Decartes.Matrix.identity();
	this.transformedVerts = new Decartes.VertContainer(this.vertices);
	return this;
};

extend(Decartes.Cylinder, Decartes.Shape);

/**
 * Sphere
 */
Decartes.Sphere = function(){
	var res = 20;

	this.edges = [];
	this.vertices = [];

	for(var i = 0; i < res; i ++){
		for(var j = 0; j < res; j ++){
			var v = i / (res - 1);
			var u = j / res;
			var theta = 2*Math.PI*u;
			var phi = Math.PI*(v-0.5);
			var count = i*res + j;

			var y = Math.cos(phi)*Math.cos(theta);
			var x = Math.cos(phi)*Math.sin(theta);
			var z = Math.sin(phi);

			this.vertices[i*res + j] = [x, y, z, 1];
			if(j < res-1){
				this.edges.push([i*res + j, i*res + j + 1]);
			} else {
				this.edges.push([i*res + j, i*res]);
			}
			if(i < res-1){
				this.edges.push([i*res + j, (i+1)*res + j]);
			} else {
			}
		}
	}
	this.matrix = Decartes.Matrix.identity();
	this.transformedVerts = new Decartes.VertContainer(this.vertices);
	return this;
};

extend(Decartes.Sphere, Decartes.Shape);

/**
 * Fancy name for a donut
 */
Decartes.Torus = function(){
	var res = 20;
	var r = 0.5;

	this.edges = [];
	this.vertices = [];

	for(var i = 0; i < res; i ++){
		for(var j = 0; j < res; j ++){
			var v = i / res;
			var u = j / res;
			var theta = 2*Math.PI*u;
			var phi = 2*Math.PI*v;
			var count = i*res + j;

			var y = (1+r*Math.cos(phi))*Math.cos(theta);
			var x = (1+r*Math.cos(phi))*Math.sin(theta);
			var z = r*Math.sin(phi);

			this.vertices[i*res + j] = [x, y, z, 1];
			if(j < res-1){
				this.edges.push([i*res + j, i*res + j + 1]);
			} else {
				this.edges.push([i*res + j, i*res]);
			}
			if(i < res-1){
				this.edges.push([i*res + j, (i+1)*res + j]);
			} else {
				this.edges.push([j, i*res + j]);
			}
		}
	}
	this.matrix = Decartes.Matrix.identity();
	this.transformedVerts = new Decartes.VertContainer(this.vertices);
	return this;
};

extend(Decartes.Torus, Decartes.Shape);

Decartes.Obj = function(obj){
	this.vertices = obj.vertices;
	this.edges = obj.edges;
	this.matrix = Decartes.Matrix.identity();
	this.transformedVerts = new Decartes.VertContainer(this.vertices);
};

extend(Decartes.Obj, Decartes.Shape);

Decartes.Obj.prototype.loadObj = function(url){

};

//below is from Ken
function Vector3(x, y, z) {
	this.x = 0;
	this.y = 0;
	this.z = 0;
}
Vector3.prototype = {
	set: function(x, y, z) {
		if (x !== undefined) {
			this.x = x;
		}
		if (y !== undefined) {
			this.y = y;
		}
		if (z !== undefined) {
			this.z = z;
		}
	},
};

var startTime = (new Date()).getTime() / 1000,
	time = startTime;
var canvases = [];

function initCanvas(id) {

	var canvas = document.getElementById(id);
	// canvas.width = window.innerWidth;
	// canvas.height = window.innerHeight;
	canvas.setCursor = function(x, y, z) {
		var r = this.getBoundingClientRect();
		this.cursor.set(x - r.left, y - r.top, z);
	};
	canvas.cursor = new Vector3(0, 0, 0);
	canvas.onmousedown = function(e) {
		this.setCursor(e.clientX, e.clientY, 1);
	};
	canvas.onmousemove = function(e) {
		this.setCursor(e.clientX, e.clientY);
	};
	canvas.onmouseup = function(e) {
		this.setCursor(e.clientX, e.clientY, 0);
	};
	canvases.push(canvas);
	return canvas;
}

function tick() {
	time = (new Date()).getTime() / 1000 - startTime;
	for (var i = 0; i < canvases.length; i++) {
		if (canvases[i].update !== undefined) {
			var canvas = canvases[i];
			var g = canvas.getContext('2d');
			g.clearRect(0, 0, canvas.width, canvas.height);
			canvas.update(g);
		}
	}
	setTimeout(tick, 1000 / 60);
}
tick();