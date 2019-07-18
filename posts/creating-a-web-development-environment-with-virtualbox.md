---
title: Creating a web development environment with VirtualBox
excerpt: >-
  Getting started with virtualization can be tricky. This guide will show you
  how to get up and running with VirtualBox.
date: July 18th 2019
tags:
  - VirtualBox
  - Web development
  - Virtual machine
categories:
  - Set up a Linux web development environment with VirtualBox
thumbnail: /uploads/webdev.png
---
Web devlopment can get messy. With so many modules and tools, it's easy to bloat your operating system with applications and files that might conflict with each other.

That's why you should use virtual machines. They isolate your development environments (tools, files, etc.) in containers that aren't directly embedded in your computer's operating system. They also allow you to run completely different operating systems without needing to boot to a different disk on your computer.

Let's take a look at setting up some virtual machines with VirtualBox, an open-source virtualization tool.

### Assumptions

* You're running a Windows 10 PC. While all of this should work with other operating systems, the individual steps will vary.

### Pre-requisites

This should be everything you need to get virtualization working on your PC.

#### Host machine

You'll need to download these at a minimum:

* Virtualization-enabled computer ([Enable Virtualization in Your PC's BIOS](https://the-canney-valley.kyleblankrollins.com/posts/enable-virtualization-in-your-pcs-bios))
* VirtualBox v6.0.8 (<http://download.virtualbox.org/virtualbox/6.0.8/>)
* VirtualBox v6.0.8 Guest Additions (<http://download.virtualbox.org/virtualbox/6.0.8/>)
* Ubuntu 18.04.2 LTS virtual disc image (<https://ubuntu.com/download/desktop>)

#### Virtual machine

All of these are optional based on your development needs, but I've included these because they're what I cover in this guide.

* Visual Studio Code
* Node.js (includes NPM)
* Git
* Git Kraken
* Updated FireFox

### Setting up your development VM with VirtualBox

While the initial work involved is substantial, it's easy to build off of later on.

##### To set up your development VM

1. [Enable virtualization for your computer](https://the-canney-valley.kyleblankrollins.com/posts/enable-virtualization-in-your-pcs-bios) if it isn't already enabled.
2. Download and install VirtualBox v6.0.8 (<http://download.virtualbox.org/virtualbox/6.0.8/>).
   Look for the "**VirtualBox-6.0.8-130520-Win.exe**" link.
<img class="procedure-image" src="/uploads/windows-download.png" />

1. Download VirtualBox Guest Additions v6.0.8 (<http://download.virtualbox.org/virtualbox/6.0.8/>).
   Look for the "**VBoxGuestAdditions_6.0.8.iso**" link.
<img class="procedure-image" src="/uploads/windows-guest-additions.png" />

1. Download Ubuntu 18.04.2 virtual disk image (<https://ubuntu.com/download/desktop>).
2. Create a base virtual machine in VirtualBox (article pending).
3. Set up your base Ubuntu VM (article pending).
4. Clone your base VM (article pending).
5. Set up your cloned VM for your web development project (article pending).
