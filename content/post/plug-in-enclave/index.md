---
title: "[论文分享] Confidential Serverless Made Efficient with Plug-In Enclaves"
date: 2022-02-28T16:03:16+08:00
categories: [OS, Security]
tags: [SGX, TEE, serverless, paper sharing]
---

今天分享的是发表在 ISCA'21 的 *Confidential Serverless Made Efficient with Plug-In Enclaves*。此前跟同学的讨论中想到了用 TEE 保护 serverless computating 的 idea。在调查相关工作时发现了这一篇文章，看到作者发现又是熟悉的 IPADS 课题组。在自己还在怀疑自己想到的 idea 的合理性的时候，就发现 IPADS 已经有相关的工作成果了，这种事情已经发生了好几次了。此外，IPADS 的 Penglai TEE 也提到了在 serverless 领域的应用。

这篇 ISCA 在 SGX 基础上进行硬件改动，为 SGX 增加了一些为 serverless 特定设计的指令，并对设计进行 cycle-accurate 的 emulation 进行实验验证。这篇 paper 的 idea 还是相对很 straightforward 的，所以这里就相对简短地来介绍一下。

## Motivation

Serverless 意思是不直接出售 servers 给用户，而是只让用户提供自己需要运行的功能和函数，把运维、部署相关的任务留给厂商自动完成。Serverless 应用一般需要极高的响应速度。现有的 serverless 框架一般使用 container 和 VM 来运行用户提供的函数。而一些涉及用户隐私的 serverless 应用，可以考虑使用 TEE 来保护，不让厂商本身、或者入侵者得到用户的数据，比如认证服务、脸部识别等。

Intel SGX 是现有的最成熟的 TEE 架构之一，其为需要保护的程序提供了一个隔离环境 enclave 来保护用户隐私。那么能否将 serverless 的 function 直接放入一个 SGX 的 enclave 运行是一个很直接的问题。答案是可以运行，但是没有实用价值。因为 SGX enclave 的 start-up time 过长，包含逐页设置 EPC（受保护的 page），进行远程验证等。作者们直接将 serverless 应用移植入 SGX enclave 后，发现运行速度降低了 5.6 到 422.6 倍，这显然是无法实际应用的。而整个运行中，有 92.3% 到 99.6% 的时间被用于硬件创建 enclave 以及对 enclave 的 integrity 验证。此外，对于相互调用的 serverless function，直接使用 SGX 的效率也很低，因为 one function per enclave，而 enclave 之间不可以进行数据共享。

因此，如果要使用 SGX 来 host serverless 服务，就需要提高三个方面的效率：

- enclave 创建时间
- enclave integrity check 时间
- function chain 中数据共享的时间

## PIE (Plug-In Enclave)

为了解决这些问题，作者 propose 了在 SGX 中加入 PIE (Plug-In Enclave) 的功能。首先作者观察到目前的效率低，主要是受 enclave 之间不能 share 内存这一限制，于是一个可以思考的问题是：如何在保证安全的情况下，允许 enclave 之间共享一部分内存？作者 claim PIE 可以解决这个问题。

首先，作者将所有的 enclave 分成 Plug-in 和 Host 两种。Host enclave 跟传统的 enclave 没有太大区别，互相绝对隔离，用于存放用户的机密数据。而 PIE 是一类特殊的 enclave，可以被 immutably map（plug-in）到 host enclave 中，用于存放运行函数所需要的环境，比如 Language runtime、运行初始状态 等。对 PIE 的写入指令会被硬件强制触发 Copy-on-Write 机制。

为了支持 PIE，作者为 SGX 中加入了两条 Uesr-mode 新指令，EMAP 和 EUNMAP。其中 EMAP 用于将一个已经初始化的 PIE 加入现有 host enclave 的 meta-data 中，使得硬件允许 host enclave 访问该 PIE。EUNMAP 则是 EMAP 的逆操作。

原先给 enclave 分配 EPC 是 OS kernel 逐页进行的，因此无法一次性创建大量 enclaves。而 PIE 的 EPC 可以一次性设置一个范围，从而解决了创建 enclave 过慢的问题。

通过在 PIE 中储存初始状态，serverless 使用的 Host enclave 可以极大地缩短时间，因为大部分繁杂的部分已经在 PIE 本身创建时处理过了。而这种 PIE 使用的 EPC 全部是 immutably mapped，因此多个 enclave 需要使用一个 PIE 时，只需要创建一次 PIE。通过这种方式，解决了第二个问题。

而解决第三个问题，即 function chain 中的效率问题，作者的设计是保持 data 不动，让代码围绕着 data 动。比如 `func1` 调用了 `func2`，那么可以先将 `func1` 的 PIE map 到 host enclave 中，运行过后，将其 unmap，再将 `funct2` map 进来，这样就解决了跨 enclave data share 的问题。

通过PIE设计，作者实现了降低 serverless enclave 94.74% 到 99.57% 的创建时间，并将 autoscaling throughput 提高了 19 到 179倍。

## PIE 的不足处

PIE 的实验结果确实 impressive，但是 idea 本身实际上很容易想到，并且实现实际上依附于 SGX 现有设计。这样的设计存在一些问题：

首先，PIE 的设计使得 host serverless 的隔离环境 share 了更多的东西，这是与当前潮流相背的：share 同一个 kernel、甚至同一个 language runtime。这样的 share 使得 PIE 更容易遭受 side channel 等攻击。比如对 runtime 而言，share 同一个代码段，意味着有可能通过 cache 来 trace PIE 的 control flow，从而 leak enclave 的机密信息。PIE 在 paper 中 argue 他们并不考虑 side channel 问题，但是这种设计确实使得 side channel 更容易实施。

其次，论文并没有讨论将应用 port 至 PIE 的 engineering effort 大小。很多时候不同的用户需要不同版本的 language runtime，这是否意味着需要将每个版本逐一 port 一次？以及不同的版本是否也降低了 enclave sharing 的效率？

不过将 TEE 用于 serverless 领域的确是个有意思的话题。这里面临的 threat model 以及系统架构都是和传统情况不同的，也许我们可以彻底抛弃现有的 TEE 架构，重新从零开始构建一个专门为 serverless 服务的 TEE 框架。

