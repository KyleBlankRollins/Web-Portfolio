---
title: Installing Ubuntu on your VirtualBox VM
excerpt: >-
  After creating a VirtualBox VM, you still need to install the operating
  system. This article shows you how to install Ubuntu.
date: August 21st 2019
tags:
  - Ubuntu
  - VirtualBox
categories:
  - Set up a Linux web development environment with VirtualBox
thumbnail: /uploads/install_ubuntu_cover.jpg
---
So, you created a VirtualBox VM. Great! Now, you need to install an operating system to make it usable. In this article, we'll install Ubuntu v18.04.2.

#### Pre-requisits

* [A new VirtualBox VM](https://the-canney-valley.kyleblankrollins.com/posts/creating-a-base-virtual-machine-in-virtualbox)
* [Ubuntu 18.04.2 LTS virtual disc image](https://ubuntu.com/download/desktop)

##### To install Ubuntu on your VM

1. In VirtualBox Manager, on the left-hand side, double click the virtual machine you want to install Ubuntu on.
<img class="procedure-image" src="/uploads/start-up-disk.png" />
2. On the Select start-up disk window, click the folder icon to navigate to and select the Ubuntu Virtual Disk Image you downloaded earlier, then click Start.
3. On the Welcome window, select the language you want the OS to run in, then click Install Ubuntu.
4. On the next window, select your keyboard layout, then test it and click Continue.
5. On the next window, select "Minimal installation" and Download updates while installing Ubuntu, then click Continue.
<img class="procedure-image" src="/uploads/minimal_installation.png" />
6. On the next window, select "Erase disk and install Ubuntu," then click Install Now.
7. On the confirmation window, click Continue.
8. On the next window, select your time zone, then click Continue.
9. On the next window, fill out the information fields as appropriate, then click Continue.

#### Next steps

Install VirtualBox Guest Additions for your VM. (article pending)
