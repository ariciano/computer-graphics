//------------------DOC READY-------------------//



var synth = new Tone.PolySynth(6, Tone.FMSynth).toMaster();
synth.set("attack") = 1;


window.onload = function() {
	synth.triggerAttackRelease(["C3", "E3", "G3"], "1n");
	console.log("function loaded");
};

console.log("script loaded");