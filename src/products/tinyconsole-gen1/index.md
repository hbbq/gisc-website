---
layout: product.njk
id: tinyconsole-gen1
title: TinyConsole Gen 1
model: TinyConsole Gen 1
status: prototype
revision: A
departments:
  - rod
tags:
  - product
---

# TinyConsole™ Gen 1

TinyConsole Gen 1 is a deliberately constrained 8-bit entertainment platform built around the principle that small resources are not merely a hardware limitation, but part of the experience.

> **1 MHz. 128 pixels. 32 bytes. 3 buttons.**

Built around the ATtiny85, TinyConsole combines a resident launcher, multiple compiled-in titles, dedicated TGA-128 display hardware, integrated controls, and a compact application memory model designed specifically for tiny games.

## Platform highlights

- **1 MHz 8-bit AVR processing**
- **8 KB program Flash**
- **512 B physical SRAM**
- **32 B defined application state memory**
- **TGA-128™ 16 × 8 graphics** with 128 individually addressable display elements
- **Dedicated display processing hardware** using dual MAX7219 controllers
- **Three integrated application controls** with simultaneous input support
- **Dedicated hardware reset**
- **Dual-Layer Processor Socket Architecture** with replaceable mechanical wear interface
- **TC POWER™ system power interface**
- **TGA™ modular graphics connector** including display power
- **Real-time Power Integrity Indicator** implemented entirely in hardware
- **True-off switched power architecture** with replaceable battery cells

## TGA-128™ graphics

The GISC TGA-128 graphics subsystem provides a native 16 × 8 one-bit raster display with a 16-byte framebuffer and 16 hardware-controlled intensity levels.

Display multiplexing is handled by dedicated controller hardware, leaving the TinyConsole processor free to spend its 1 MHz on more important work.

TinyConsole applications can access video memory directly and are encouraged to use visible display state as application state where appropriate — the platform's **Display-as-State Architecture**.

## Designed to be small

TinyConsole does not attempt to hide its constraints.

Titles share a resident runtime and are designed around only 32 bytes of defined retained state: 16 bytes of general-purpose application memory and the 16-byte TGA-128 framebuffer.

The result is a platform built around compact state, shared services, direct framebuffer manipulation, bit packing, and software written explicitly for an 8-bit 1 MHz machine.

## Reference hardware

Reference Hardware Revision A integrates the ATtiny85 processor interface, surface-mounted controls, hardware reset, power indication, TC POWER input, and the external TGA graphics interface on the TinyConsole motherboard.

The processor is mounted through a stacked dual-socket arrangement so the upper socket can act as a replaceable wear component rather than repeatedly stressing the socket soldered to the motherboard.

The reference TC Power Supply uses replaceable battery cells and a physical inline power switch. When the batteries are depleted, replacement provides effectively zero-minute energy replenishment.

## Technical documentation

For the full programming model, memory rules, graphics architecture, motherboard implementation, power system, and reference hardware specification, see the **[TinyConsole Gen 1 Design Specification](./design/)**.

**GISC TGA-128™ graphics. 128 pixels. No unnecessary ones.**
