---
title: "Rv32_emu"
date: 2022-01-22T17:52:56+08:00
---

There is a tiny 32-bit RISC-V emulator embedded in this page.

Check it out in the browser console.

<script type="module">
	import init, { emulate } from "./pkg/rv_emu_rs.js";
	init()
		.then(() => {
			emulate();
		});
</script>