---
title: "The Floating Point Context"
date: 2022-12-14T23:32:12+08:00
categories: [Tiny, Architecture, OS]
tags: [RISC-V, kernel]
tiny: true
---

Context switches are important in OS kernels, hypervisors, and firmware like RISC-V OpenSBI or Arm Trusted Firmware. In most cases, context switches happen between two privilege levels when one gets trapped into the other. (There are exceptions as *horizontal traps*.) During a context switch, the privileged software must first save the context for two reasons:

1. it needs to use the general purpose registers (GPRs) itself;
2. the system might be switching to another thread, so contexts of the current thread shall be saved for future restore.

The saving procedure is usually done in assembly before calling any function since no register is available at the moment.

**However, what about the floating point registers (FPRs)?**

FPRs are used to support floating point operations, which require different hardware circuits from the GPRs. So they are a separate group of registers. Unlike the GPRs, the FPRs are not used by most privileged softwares since they are not computation-intensive. **So Reason 1 does not hold for FPRs.**

And we are left with Reason 2. Obviously, if the premise does not hold, i.e. the system is not switching to another thread, then the context save/restore is unnecessary. Therefore, the kernel should make a decision upon every context switch.

In RISC-V, there is a bit field `FS` in `sstatus` and `mstatus` CSRs. The bit field is 2-bit long, representing 4 states:

- 00: Off
- 01: Initial
- 10: Clean
- 11: Dirty

The bit field is used to indicate whether the FPRs are modified since the last context switch. Here is how Linux uses it: When a thread is created, `FS` is set to initial. When switching to another thread, the kernel only needs to save the context if `FS`is dirty. In this case, it first saves the context and then sets the bit field to clean. Restore is always performed when switching to a different thread. (The initial state is used to avoid memory copy during the first restore, where immediate numbers can be used.)

Other implementations might be possible. For example: use a CSR to enable/disable the FPU and then save/restore contexts in exceptions. This is called lazy context switch and is used in some Arm systems (https://stackoverflow.com/questions/62029562/arm-vfp-floating-point-lazy-context-switching). Lazy context switch was used by Linux but it seems to have led to vulnerabilities. As a result, Linux is now using the method mentioned above (https://stackoverflow.com/questions/50104289/why-arent-the-fpu-registers-saved-and-recovered-in-a-context-switch).





