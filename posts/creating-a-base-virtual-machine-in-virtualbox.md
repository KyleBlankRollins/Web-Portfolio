---
title: Creating a base Virtual Machine in VirtualBox
excerpt: >-
  Starting with a base VM gives you a lot of flexibility in the future through
  cloning. Learn how to create a new VM in VirtualBox and use it as a stable
  base for future projects.
date: July 18th 2019
tags:
  - VirtualBox
  - Virtual machine
categories:
  - Set up a Linux web development environment with VirtualBox
thumbnail: /uploads/virtualbox.png
---
When I create VMs in VirtualBox, I differentiate them as bases and builds. 

Bases serve as a stable VM configuration that you do _not_ make changes to. Builds are clones of bases that you customize for specific tech stacks.

This article covers creating your initial base Ubuntu VM that includes the VirtualBox Guest Additions.

<div class="note">  <p><strong>Note:</strong> These instructions apply to creating a Ubuntu 18.04.2 VM only. If you're using a different OS, adjust the steps as needed.</p></div>

##### To create a base Ubuntu VM
1. From the VirtualBox Manager Tools bar, select New.

<img class="procedure-image" src="/uploads/new-vm.png" />

2. Give the VM a name, often the OS name and version (e.g., Ubuntu v18.04.2).
3. Change the Type to Linux.
4. Change the Version to Ubuntu (64-bit), then select Next.

<img class="procedure-image" src="/uploads/name-and-os.png" />

5. On the "Memory size" window, select how much RAM you want to allocate to the machine while it's running, then select Next.
<div class="note">  <p><strong>Note:</strong> Allocating more RAM will reduce the amount of RAM available to other applications on your computer, but increase the VM's performance.</p></div>

6. On the Hard disk window, select "Create a virtual hard disk now," then click Create.
7. On the Hard disk file type window, use the initial selection (VDI), and click Next.
8. On the next window, select Fixed size, then click Next.
9. Give the virtual hard disk a name and select how much storage space to allocate to it, then click Create.
<div class="note">  <p><strong>Note:</strong> For most projects, 10 - 20GB should be plenty of space. You cannot change this later.</p></div>

10.  Install Ubuntu on your virtual machine (article pending).
11.  Install VirtualBox v6.0.8 Guest Additions on your guest machine (article pending).
