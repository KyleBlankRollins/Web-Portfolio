---
title: Enable virtualization in your PC's BIOS
excerpt: To use virtual machines, you'll need to set things up properly in your computer's
  BIOS. Many PCs are capable of virtualization, but ship without this feature turned
  on.
date: 2019-07-16T05:00:00Z
tags:
- Virtualization
- BIOS
categories:
- Set up a Linux web development environment with VirtualBox
thumbnail: "/uploads/bios.svg"

---
Before you can do any sort of virtualization, you need to:

1. See if your PC's processor supports virtualization (not all do).
2. Enable virtualization at the BIOS level.

### Checking if your PC's processor supports virtualization

Not all processors support virtualization. There's no workaround for PCs that don't support virtualization.

<div class="note">
  <p><strong>Note:</strong> AMD calls its virtualization tech AMD-V and Intel calls it Intel® VT.</p>
</div>

##### To see if your PC's processor supports virtualization

1. Press the Windows key, then search for and select "System Information."
2. On the System Information window, look for Processor, and note its model number.
3. Check the manufacturer's specifications for your model.

  **AMD's website:** <https://www.amd.com/en/products/specifications/processors>

  **Intel's website:** <https://ark.intel.com/content/www/us/en/ark.html#@Processors>
4. If your processor supports virtualization, move on to the next section. If it does not, you'll have to find a PC with a processor that does.

### Enabling virtualization at the BIOS level

For the next part, you'll need to restart your PC - possibly multiple times if it boots up quickly and you don't know which key you need to access your PC's BIOS. So, you might want to open this post on another device for reference.

<div class="note">
  <p><strong>Note:</strong> to boot into BIOS, you'll need to press the right key at the right time. The key you need to press varies depending on the motherboard manufacturer and the BIOS version. Your best bet is to restart once and look for the on-screen prompts or consult your motherboard's documentation.</p>
</div>

##### To enable virtualization at the BIOS level

1. Restart your PC.
2. On the BIOS screen, press the BIOS menu key (see note above).\
   Common keys are `delete`, `escape`, `F1`, or `F4`.
3. Locate and enable AMD-V or Intel® VT in your BIOS' menu.\
   This setting is often under Chipset or Processor menus, but could be in Security Settings or other menus.
4. Locate and enable Intel VTd or AMD IOMMU.
5. Select Save and Exit.
6. Restart your PC.