---
title: "AWS S3 as a Network Drive"
date: 2022-12-28T18:03:45+08:00
categories: [Utility]
tags: [serverless, utility, AWS, MacOS]
slug: [aws-s3-as-a-net-drive]
draft: true
---



- Why S3?

  - Why do I want a network drive?

  - Different choices of network drives

  - Compare them (price)

  - Why did I decide to try S3?

- What is S3?
  - object storage
    - differences from file systems
  - Lifecycle management
  - Intelligent-Tiering:
    - automatical classification
    - additional charges due to meta-data
- Usages of S3
  - Basic usage (webpage console)
  - rclone
    - Access with rclone
    - Mount with rclone
  - Potential usages
    - Customized FUSE to group small files
    - Automatic storage class transformation and *today in the past year*
    - Mac Time Machine
    - Mount with s3fs
    - NAS?
- Case Study: Photo Manager
  - Copy all old photos to S3
  - PhotoSync to sync new photos from iPhone to S3
  - PhotoPrism to view photos stored on S3
  

