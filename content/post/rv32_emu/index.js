import init, { emulate } from "./pkg/rv_emu_rs.js";

var romArray;

init()
	.then(main);

function main() {
	setupFileSelector();
	document.getElementById("run_button").onclick = run;	
}

function displayRunButton() {
	document.getElementById("run_button").style.display = "block";
}

function setupFileSelector() {
	const fileSelector = document.getElementById("file_selector");
	fileSelector.addEventListener("change", (event) => {
		const file = event.target.files.item(0);
		if (file) {
			readFile(file);
		}
		displayRunButton();
	});
}

function readFile(file) {
	let reader = new FileReader();
	reader.onload = function() {
		romArray = new Uint8Array(this.result);
	};
	reader.readAsArrayBuffer(file);
}

function run() {
	let output = emulate(romArray, 0x1000);
	document.getElementById("output").innerText = output;
}

// document.getElementById("run_button").onclick = run;
// function read_file() {
// 	const fileSelector = document.getElementById('file-selector');
// 	fileSelector.addEventListener('change', (event) => {
// 		const file = event.target.files.item(0);
// 		console.log(file);
// 		execute_file(file);
// 		document.getElementById("run_button").style.display = "block";
// 	});
// }

// function execute_file(file) {
// 	if(file) {
// 		let reader = new FileReader();
// 		reader.onload = function() {
// 			document.getElementById('result').innerHTML = this.result;
// 		};
// 		reader.readAsText(file);
// 	}
// }

// function run() {
// 	let rom_file = document.getElementById("rom_file").value;
// 	console.log(rom_file);

// 	let output = emulate(rom_file);
// 	let split = output.split('\n');

// 	let paragraph = document.getElementById('emulate_output');
// 	// paragraph.innerText = output;

// 	for (const line of split) {
// 		console.log(line);
// 		paragraph.innerHTML += line;
// 		paragraph.innerHTML += '\n';
// 	}

// }
