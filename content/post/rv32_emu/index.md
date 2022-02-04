---
title: "A 32-bit RISC-V Emulator Written in Rust"
date: 2022-01-22T17:52:56+08:00
categories: [OS]
tags: [hardware, emulator, RISC-V]
slug: rv32-emu
csp-script-src: unsafe-eval
---

A few months ago I occasionally saw a [video series](https://www.youtube.com/watch?v=ER7h4ZTe19A&list=PLP29wDx6QmW4sXTvFYgbHrLygqH8_oNEH) by Francis Stokes. It was about to implement a RISC-V CPU in Typescript. The series has not been finished yet but what has been done so far is awesome. After watching one episode or two, I was thinking to myself, *hey, why not try to do it in rust?*

So I quickly built a baby version, basically translating Francis's code into Rust. In the beginning, each stage of the pipeline passed the tests. However, when I tried to chain them together, things just went crazy. I just cannot pass the compilation due to problems in ownerships, lifetimes and things like that. One reason was the extensive usage of closures in the TS project. In Rust every closure has its own type, which makes closures harder to use so that a naive translation failed to compile.

Two months later, I gave it another try and this time it worked out. The main challenge I met this time was the famous self-reference problem in Rust. To avoid too many `Arc`s in my code, I redesigned the architecture to avoid self-references and cyclic references in advance.

The emulator is compiled into a WASM package and embeded into this webpage (at the end of this page). You can try it out here!

To run a customized C program, perform the following steps:
1. `git clone git@github.com:MstMoonshine/rv_emu_rs.git`
2. Copy your C file to `test_payloads/src/[filename].c`
3. Run `make payloads`
4. Upload `test_payloads/build/[filename].bin` to this page, and a `Run` button will be shown
5. Click `Run`

Note:
- The only output method is using register/memory dump. Currently no privileged level is supported so no syscall can be handled, which means functions like `printf` are not allowed.
- Memory starts at `0x8000_0000`

To-do:
- [ ] Support CSR instructions
- [ ] Support privileged levels (M-mode, for example)
- [ ] Add more peripheral devices, using TileLink or AXI4
- [ ] Translate the emulator into HDL (automatically or manually) and burn it into an FPGA.

---

## Emulator

Upload your binary file here:

<input type="file" id="file_selector">

<button id="run_button" type="button" style="display: none">Run</button>

<code style="background:rgba(0, 0, 0, 0.0);">
<p id="output"></p>
</code>

<script src="index.js" type="module"></script>