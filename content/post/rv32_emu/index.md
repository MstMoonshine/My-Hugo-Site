---
title: "Rv32_emu"
date: 2022-01-22T17:52:56+08:00
---

There is a tiny 32-bit RISC-V emulator embedded in this page.

Check it out in the browser console.

The output results from the execution of the following codes:
```
0x00100093, // li	x1, 1
0x00200113, // li	x2, 2
0x002081b3, // add	x3, x1, x2
0x80000237, // li	x4, 0x80000000
0x00322023, // sw	x3, 0(x4)
0xdeadc2b7, // li	x5, 0xdeadbeef
0xeef28293, // (cont.)
0x00022303, // lw	x6, 0(x4)
0x006283b3, // add	x7, x5, x6
0x00722223, // sw	x7, 4(x4)
0x00721423, // sh	x7, 8(x4)
0x00720623, // sb	x7, 12(x4)
```

<script type="module">
	import init, { emulate } from "./pkg/rv_emu_rs.js";
	init()
		.then(() => {
			emulate();
		});
</script>