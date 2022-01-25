---
title: "Rv32_emu"
date: 2022-01-22T17:52:56+08:00
csp-script-src: unsafe-eval
---

There is a tiny 32-bit RISC-V emulator embedded in this page.

Using [this site](https://riscvasm.lucasteske.dev/#), you can easily translate your asm code into RISC-V binary instructions.
Paste the outputs here and click the run button to check the execution result:

<textarea id="rom_file" rows="10" cols="30">
3e800093
7d008113
c1810193
83018213
3e820293
</textarea>

<button id="run_button" type="button">Run</button>

<script src="index.js" type="module"></script>

<p id="emulate_output">
</p>