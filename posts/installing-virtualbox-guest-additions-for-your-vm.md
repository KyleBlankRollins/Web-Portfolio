---
title: Installing VirtualBox Guest Additions for your VM
excerpt: >-
  With Ubuntu installed on your VM, we're ready to add the VirtualBox Guest
  Additions functionality. You'll want it.
date: August 21st 2019
tags:
  - VirtualBox
  - Guest Additions
categories:
  - Set up a Linux web development environment with VirtualBox
thumbnail: ''
---
Once you have a VirtualBox VM with Ubuntu installed, it's time to add VirtualBox's Guest Additions functionality. This gives you a bunch of useful features like better input integration and a shared clipboard for copy and pasting from your host machine into your virtual machine.

#### Pre-requisits
+ [A VirtualBox VM with Ubuntu](https://the-canney-valley.kyleblankrollins.com/posts/installing-ubuntu-on-your-virtualbox-vm)
+ [VirtualBox v6.0.8 Guest Additions](http://download.virtualbox.org/virtualbox/6.0.8/)

##### To install VirtualBox Guest Additions
1. Update your Ubuntu operating system from the terminal.
  ```
  sudo apt update
  sudo apt upgrade
  ```
  The upgrade could take a while, depending on your internet connection.
  <div class="note"><p><strong>Note:</strong> If prompted for a y/n response, press y to install the upgrades.</p></div>

2. Reboot your guest operating system (Ubuntu).
3. Install required packages.
  ```
  sudo apt install build-essential dkms linux-headers-$(uname -r)
  ```
4. From the VirtualBox VM window's menu bar, select Devices, then select "Insert Guest Additions CD image."
<img class="procedure-image" src="/uploads/mount_guest_additions.png" />
5. When prompted by the auto-run window, select Run.
<img class="procedure-image" src="/uploads/run_guest_additions.png" />
6. After installation is complete, in the Terminal window, press Return.
<img class="procedure-image" src="/uploads/finish_guest_additions.png" />
7. Turn off your VM by selecting Machine > ACPI shutodwn.

#### Next steps
Create a shared folder for your VM and host machine. (article pending)
