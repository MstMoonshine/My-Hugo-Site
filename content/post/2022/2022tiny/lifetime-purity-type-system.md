---
title: "What else can we do with type systems?"
date: 2022-12-14T19:39:51+08:00
categories: [Tiny, PL]
tags: [rust]
tiny: true
---

Recently I learned that the lifetimes and borrow checkers in Rust are implemented using its type systems. Details here: https://doc.rust-lang.org/nomicon/subtyping.html 

It makes me wonder what else we can do using a type system. For example, *purity* as part of the type of a function, which means all its side effects must be (explicitly or implicitly) declared. Actually, some people have already been working on it: the [**Koka**](https://koka-lang.github.io/koka/doc/index.html) programming language.
