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

# TinyConsole™ Gen 1 Platform Specification

**Platform Specification 1.0**

TinyConsole Gen 1 is a deliberately constrained embedded game platform built around an 8-bit AVR processor, a 128-pixel monochrome display, three application controls, and an intentionally small application memory model.

The platform is designed around a simple principle: small resources are not merely a hardware limitation, but part of the programming model.

> **1 MHz. 128 pixels. 32 bytes. 3 buttons.**

## 1. Core System

| Property | Specification |
| --- | --- |
| Processor | ATtiny85, 8-bit AVR |
| Clock frequency | **1 MHz** |
| Program memory | **8 KB Flash** |
| Physical system memory | **512 B SRAM** |
| Application-visible memory | **32 B** |
| Execution model | Resident launcher with one active title |

The processor operates at 1 MHz. Applications are expected to be designed for this operating frequency rather than treating it as a reduced-performance development mode.

## 2. TGA-128™ Graphics System

TinyConsole Gen 1 implements the **GISC TGA-128™ (Tiny Graphics Array)** display architecture.

> **TGA-128 defines a 16 × 8, one-bit raster graphics architecture providing 128 individually addressable display elements and a 16-byte native framebuffer.**

| Property | Specification |
| --- | --- |
| Resolution | **16 × 8 pixels** |
| Total display elements | **128 pixels** |
| Color depth | **1-bit monochrome** |
| Video memory | **16 B** |
| Display controllers | 2 × MAX7219 |
| Controller topology | Serial daisy-chain |
| Hardware intensity levels | 16 |

### 2.1 Application-accessible video memory

The complete 16-byte TGA-128 framebuffer is directly readable and writable by applications.

Video memory is explicitly considered part of the application-visible memory model. Applications may — and where appropriate **should** — use visible display state directly as application state rather than maintaining redundant representations in general-purpose memory.

This principle is designated the **Display-as-State Architecture**.

For example, a game world already represented by illuminated pixels need not maintain a second copy of that world solely for collision or state processing.

## 3. Memory Architecture

TinyConsole Gen 1 provides **512 bytes of physical SRAM**, but deliberately exposes a much smaller defined application environment.

```text
512 B PHYSICAL SYSTEM RAM

+----------------------------------+
| 16 B  TGA-128 Video Memory       |  Application accessible
+----------------------------------+
| 16 B  Application Workspace      |  Application accessible
+----------------------------------+
|       TinyConsole System State   |
+----------------------------------+
|       Runtime / Stack            |
+----------------------------------+
|       Reserved                   |
+----------------------------------+
```

### 3.1 Application Workspace

Each title is provided with a **16-byte general-purpose application workspace**.

The workspace is shared between titles and recycled when execution passes from one title to another. Applications should use this memory for state that cannot naturally be represented in the framebuffer.

Together with the framebuffer, an application therefore has **32 bytes of defined application-visible memory**:

- **16 B general-purpose application workspace**
- **16 B directly addressable TGA-128 video memory**

Applications are encouraged to pack state efficiently and to exploit the known dimensions and ranges of platform data. Coordinates, directions, flags and other small-domain values need not occupy independent machine words.

## 4. Input System

TinyConsole Gen 1 provides three application controls and one dedicated system control.

| Control | Function |
| --- | --- |
| UP | Application input |
| DOWN | Application input |
| ACTION | Application input |
| RESET | Dedicated hardware system control |

### 4.1 Analog Control Interface

UP, DOWN and ACTION are encoded through a passive resistor network and read through a **single analog input channel**.

The interface supports simultaneous button presses and therefore exposes all eight possible application-input states, including the no-button state.

The reference implementation uses a VCC-referenced ADC arrangement so that encoded input levels remain proportional to supply voltage.

### 4.2 Hardware Reset

RESET is electrically independent of the Analog Control Interface and acts directly on the processor reset input.

It provides an unconditional hardware-level restart of the TinyConsole system and return to the resident launcher.

## 5. Software Execution Model

TinyConsole firmware consists of a resident runtime, launcher, and one or more compiled-in titles.

Only one title executes at a time. A title operates against the TinyConsole platform services and shared resources rather than owning a separate hardware environment.

A conforming title may:

- read the three application controls;
- read and write the complete TGA-128 framebuffer;
- use the 16-byte Application Workspace;
- invoke TinyConsole runtime functions;
- maintain state directly in video memory where appropriate; and
- return control to the launcher through the platform execution model.

Common display, input and system functionality is implemented by the TinyConsole runtime and shared by all titles, reducing the incremental program-memory cost of additional games.

## 6. Display Intensity

Display intensity is controlled by the MAX7219 hardware and provides **16 programmable intensity levels** independent of framebuffer contents.

The minimum intensity setting is the recommended default for typical operation where sufficient visibility is available, reducing unnecessary LED power consumption.

Display shutdown is available independently of intensity control through the display controller hardware.

## 7. Power Architecture

TinyConsole Gen 1 is intended for low-voltage battery operation.

| Property | Specification |
| --- | --- |
| Nominal target supply | Approximately **3 V** |
| Target battery configuration | 2-cell AA or AAA |
| Development supply | 3.3 V or 5 V |

The analog input architecture is supply-ratiometric when the ADC uses VCC as its reference, allowing the same input encoding to operate across supported supply conditions without voltage-specific application thresholds.

Final battery form factor is implementation-dependent and is not mandated by Platform Specification 1.0.

## 8. Platform Design Principles

TinyConsole Gen 1 applications should be designed around the capabilities of the platform rather than attempting to conceal them.

The platform therefore favors:

- direct manipulation of display memory;
- shared runtime services;
- compact state representation;
- bit packing where useful;
- deterministic, small application state;
- minimal duplication between visual and logical state; and
- software designed explicitly for a 1 MHz, 8-bit execution environment.

Resource constraints are considered part of the application interface.

## 9. Reference Implementation Status

The current reference implementation operates successfully at **1 MHz** and includes a resident launcher and multiple playable titles.

The architecture has demonstrated that shared runtime code allows additional small titles to be incorporated with comparatively low incremental Flash and SRAM requirements.

## 10. Platform Summary

**TinyConsole™ Gen 1**

- 1 MHz 8-bit AVR processor
- 8 KB program Flash
- 512 B physical SRAM
- 32 B defined application-visible memory
- 16 B general-purpose Application Workspace
- 16 B application-accessible TGA-128 video memory
- 16 × 8 / 128-pixel / 1-bit monochrome graphics
- 16 hardware display-intensity levels
- three simultaneous-capable application controls over one ADC channel
- dedicated hardware RESET
- resident launcher and shared runtime
- nominal 3 V battery operation

**GISC TGA-128™ graphics. 128 pixels. No unnecessary ones.**
