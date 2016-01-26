/**
 * A matrix class with transformation methods
 * Made by Seth Kranzler 
 */
var Matrix = function() {
	this.matrix = [[1, 0, 0 ,0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];

	return this;
};

/**
 * I'm not entirely sure the purpose of having an identity method 
 * @return {this}
 */
Matrix.prototype.identity = function() {
	this.identityMatrix = [[1, 0, 0 ,0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];

	return this;
};

/**
 * translates the matrix by some x, y, and z factor
 * @param  {number} x x offset
 * @param  {number} y y offset
 * @param  {number} z z offset
 * @return {this}
 */
Matrix.prototype.translate = function(x, y, z) {
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
Matrix.prototype.rotateX = function(theta) {
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
Matrix.prototype.rotateY = function(theta) {
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
Matrix.prototype.rotateZ = function(theta) {
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
Matrix.prototype.scale = function(x, y, z) {
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
Matrix.prototype.transform = function(src, dst) {
	for(var i = 0, max = src.length; i < max; i++){
		var numRows = this.matrix.length;
		for(var j = 0; j < numRows; j ++) {
			dst[i][j] = dot(this.matrix[j], src[i]);
		}
	}
	return this;
};

//borrowed from http://stackoverflow.com/questions/27205018/multiply-2-matrices-in-javascript
/**
 * multplies two vectors together 
 * @param  {matrix} a left side matrix
 * @param  {matrix} b right side matrix
 * @return {matrix}   resultant matrix
 */
function multiply(a, b) {
	var aNumRows = a.length, aNumCols = a[0].length,
		bNumRows = b.length, bNumCols = b[0].length,
		m = new Array(aNumRows);

	if(aNumCols != aNumRows) {
		throw new Error("cannot multiply matrices of unequal width a and height b");
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
		throw new Error("cannot take dot product of vectors with unequal length");
	}

	for(var i = 0; i < aLen; i++) {
		d += a[i] * b[i];
	}
	return d;
}
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
		parent = Tone;
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
 * draws a shape based on vertices and edges
 * @param  {context} g      canvas context
 * @param  {array} verts  vertex array
 * @param  {array} edges  edge array
 * @param  {pixels} width  canvas width
 * @param  {pixels} height canvas height
 */
function drawShape(g, verts, edges, width, height) {
	var numVert = verts.length,
		numEdge = edges.length,
		pointA = [],
		pointB = [];

	g.beginPath();
	for(var e = 0; e < numEdge; e++){
		pointA = verts[edges[e][0]];
		pointB = verts[edges[e][1]];

		pointA = transCord(pointA, width, height);
		pointB = transCord(pointB, width, height);
		//pointA[1, 0] 
		g.moveTo(pointA[0], pointA[1]);
		g.lineTo(pointB[0], pointB[1]);
	}
	g.stroke();
	g.closePath();
}

/**
 * transforms the coordinates from model space (-1 .. 1)
 * to canvas space (0 .. height, 0 .. width)
 * @param  {array} p      array of x y points
 * @param  {pixels} width  canvas width
 * @param  {pixels} height canvas height
 * @return {array}        array of transformed height/width
 */
function transCord (p, width, height) {
	return [(width  / 2) + p[0] * (width / 2), (height / 2) - p[1] * (width / 2)];
}

/**
 * creates an empty array to hold vertices
 * @param {matrix} vert vertex matrix to copy
 */
function VertContainer (vert) {
	var container = new Array(vert.length);
	for(var i = 0; i < vert.length; i++){
		container[i] = new Array(4);
	}
	return container;
}

var squareVertices = [[-1,-1, 0, 1], [ 1,-1, 0, 1], [-1, 1, 0, 1], [ 1, 1, 0, 1]];
var squareEdges = [[0,1], [1,3], [3,2], [2,0]];

var Shape = function() {

};

extend(Shape, Matrix);

Shape.prototype.update = function(){

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