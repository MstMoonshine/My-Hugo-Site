import init, { emulate } from "./pkg/rv_emu_rs.js";

init()
	.then(() => {
		document.getElementById("run_button").onclick = run;
	});

function run() {
	let rom_file = document.getElementById("rom_file").value;
	console.log(rom_file);

	let output = emulate(rom_file);
	console.log(output);
	let paragraph = document.getElementById('emulate_output');
	paragraph.innerText = output;
}
