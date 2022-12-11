---
title: "Rust Rvcc 1"
date: 2022-11-26T16:03:09+08:00
draft: true
---

Recently I learned about an interesting project [*RVCC*](https://github.com/sunshaoce/rvcc.git), which originates from Rui's [*chibicc*](https://github.com/rui314/chibicc). Both projects are detailed tutorials about writing compilers, where each commit adds a new little feature to the previous one. The only difference is that *chibicc* is on x86 while *RVCC* is on RISC-V. By the time of writing this post, there are 279 commits in the main branch of *RVCC*.

And I am now rustifying it as an exercise to learn compiler and Rust. This is the first post of this *Rustifying RVCC Series*. In this series, I will discuss about the original codes in *RVCC* and then about how I rewrite them in Rust. At the beginning stage, I will only use the basic features in Rust and leave the "Rusty" optimization for future.

This post includes discussion about commits 1 ~ 9.

## Commit No. 1: echo a number

As the very first commit of this project, where we will build everything upon, commit 1 is farily simple. It is more about how to setup the environment: riscv toolchains, qemu emulator and so on.

The program takes a number as input and outputs a simple program whose `main` function directly returns that input number:

```C
int main(int Argc, char **Argv) {
  if (Argc != 2) {
	//...
  }

  printf("  .globl main\n");
  printf("main:\n");
  printf("  li a0, %d\n", atoi(Argv[1]));
  printf("  ret\n");

  return 0;
}

```

The only thing worth noting is that `li a0, [num]` loads the immediate number `num` into register `a0`, which is used to store return values in RISC-V.

## A simple tokenizer

Commit 2 is just about adding a positive/negative judgement, nothing interesting. Let's get to commit 3 directly.

Here we expect the input of the program to be an arithmetic expression with only plus/minus operations. For example, it may take something like this:
- 12-34+56
- -1 + 2 - 4

The output assembly is supposed to carry out the calculation with `addi` instructions and return the result.

We shall first deal with 