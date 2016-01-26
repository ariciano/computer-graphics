/**
 * obj loader
 * node script that converts obj files to points and 
 * vertices which can be easily read by my 
 * Decartes line drawing library
 * 
 * Written by Seth Kranzler
 */

var fs = require('fs');

var filename = "daya_edited_2_tris"


fs.readFile( __dirname + '/' + filename + '.obj', function (err, data) {
	if (err) {
		throw err; 
	}
	separateObjects(data);
});

/**
 * 
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function separateObjects(data){
	var lines = data.toString().split("\n");
	var objectMeshes = [];
	objectMeshes[0] = [];
	for(var max = lines.length, i = 0; i < max; i++){
		objectMeshes[0].push(lines[i].trim());
	}
	splitObjects(objectMeshes[0]);
}

/**
 * takes the object and parses the vertices and faces, turns faces into edges
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function splitObjects(data){
	var wireframe = {};
	wireframe.vertices = [];
	wireframe.edges = [];
	var vCount = 0;
	for(var max = data.length, i = 0; i < max; i ++){
		if(data[i].substring(0,2) == "v "){
			var coords = data[i].split(" ");
			wireframe.vertices[vCount] = coords.slice(1,5);
			wireframe.vertices[vCount].push(1);
			vCount ++;
		}
		if(data[i].substring(0,2) == "f "){
			var faceTemp = data[i].split(" "); 
			// console.log(faceTemp);
			var face = [];
			for(var j = 1; j < faceTemp.length; j ++){
				face.push(faceTemp[j].split("/")[0] - 1);
			}
			for(var k = 0; k < face.length -1; k ++){
				wireframe.edges.push([face[k], face[k + 1]]);
			}
			wireframe.edges.push([face[0], face[face.length - 1]]);
			// wireframe.edges.push([face[0], face[1]]);
			// wireframe.edges.push([face[0], face[2]]);
			// wireframe.edges.push([face[1], face[2]]);
		}
	}
	wireframe.vertices = normalizeVertices(wireframe.vertices);

	fs.writeFile(filename + '.json', JSON.stringify(wireframe), function (err) {
		if (err) throw err;
		console.log('It\'s saved!');
	});
}

function normalizeVertices(verts){
	var lNum = 0;
	for (var iMax = verts.length, i = 0; i < iMax; i ++){
		for(var jMax = verts[i].length, j = 0; j < jMax; j ++){
			if(Math.abs(verts[i][j]) > lNum){
				lNum = verts[i][j];
			}
		}
	}
	for (var iMax = verts.length, i = 0; i < iMax; i ++){
		for(var jMax = verts[i].length - 1, j = 0; j < jMax; j ++){
			verts[i][j] = verts[i][j]/lNum;
		}
	}
	// console.log(verts);
	return verts;
}