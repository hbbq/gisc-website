---
layout: product.njk
title: TinyConsole Gen 1 Design Specification
model: TinyConsole Gen 1
status: prototype
revision: A
departments:
  - rod
tags:
  - product
---

# TinyConsole™ Gen 1 Design Specification

**Platform Specification 1.0 / Reference Hardware Revision A**

This document describes the TinyConsole Gen 1 programming model, graphics architecture, memory model, controls, power interfaces, and current reference hardware implementation.

## 1. Core System

| Property | Specification |
| --- | --- |
| Processor | ATtiny85, 8-bit AVR |
| Clock frequency | **1 MHz** |
| Program memory | **8 KB Flash** |
| Physical system memory | **512 B SRAM** |
| Defined application state memory | **32 B** |
| Execution model | Resident launcher with one active title |

The processor operates at 1 MHz. Applications are expected to be designed for this operating frequency rather than treating it as a reduced-performance development mode.

## 2. Reference Motherboard

The TinyConsole Gen 1 reference motherboard integrates processor mounting, user input, reset control, power indication, system power input, and the external graphics connection.

### 2.1 Dual-Layer Processor Socket Architecture

The processor interface uses two stacked CPU sockets. The lower socket is permanently soldered to the motherboard. A second replaceable socket is inserted above it and receives the ATtiny85 processor.

The upper socket acts as a replaceable mechanical wear interface, allowing repeated processor insertion and removal without placing routine mechanical wear on the motherboard-mounted socket.

### 2.2 Integrated controls

The motherboard provides three surface-mounted application controls:

| Control | Function |
| --- | --- |
| UP | Application input |
| DOWN | Application input |
| ACTION | Application input |

A separate surface-mounted RESET control acts directly on the processor reset input.

### 2.3 Power Integrity Indicator

A dedicated LED and series resistor are connected to the motherboard supply rail immediately after the TC POWER input.

The **Power Integrity Indicator (PII)** provides direct visual confirmation that supply voltage is present at the motherboard power rail. It is implemented entirely in hardware and does not depend on processor execution or firmware state.

### 2.4 TC POWER interface

The reference motherboard receives system power through the **TC POWER** interface, implemented as a two-position screw terminal.

| Terminal | Function |
| --- | --- |
| + | Positive supply |
| − | Ground / return |

The interface is intentionally simple and permits the motherboard to be powered from the TinyConsole reference battery supply or a compatible external low-voltage source.

### 2.5 TGA system connector

The external graphics subsystem connects through the **TGA** interface, implemented on the reference motherboard as a five-position screw terminal carrying display signalling and power.

The connector permits the graphics assembly to remain physically separate and replaceable while sharing power with the TinyConsole motherboard.

Final signal naming and connector order should follow the reference schematic when published.

## 3. TGA-128™ Graphics System

TinyConsole Gen 1 implements the **GISC TGA-128™ (Tiny Graphics Array)** display architecture.

> **TGA-128 defines a 16 × 8, one-bit raster graphics architecture providing 128 individually addressable display elements and a 16-byte native framebuffer.**

The reference TGA-128 display assembly consists of two 8 × 8 LED matrix modules driven by two MAX7219 display controllers.

| Property | Specification |
| --- | --- |
| Resolution | **16 × 8 pixels** |
| Total display elements | **128 pixels** |
| Color depth | **1-bit monochrome** |
| Video memory | **16 B** |
| Physical display | 2 × 8 × 8 LED matrix |
| Display controllers | 2 × MAX7219 |
| Controller topology | Serial daisy-chain |
| Hardware intensity levels | 16 |

### 3.1 Dedicated display processing hardware

Display multiplexing and LED drive are handled by the MAX7219 controllers rather than directly by the ATtiny85. The CPU communicates with the display subsystem serially and is not required to continuously multiplex the 128 display elements in software.

### 3.2 Application-accessible video memory

The complete 16-byte TGA-128 framebuffer is directly readable and writable by applications.

Video memory is explicitly considered part of the defined application state memory. Applications may — and where appropriate **should** — use visible display state directly as application state rather than maintaining redundant representations in general-purpose memory.

This principle is designated the **Display-as-State Architecture**.

For example, a game world already represented by illuminated pixels need not maintain a second copy of that world solely for collision or state processing.

## 4. Memory Architecture

TinyConsole Gen 1 provides **512 bytes of physical SRAM**, but deliberately defines a much smaller application state environment.

```text
512 B PHYSICAL SYSTEM RAM

+----------------------------------+
| 16 B  TGA-128 Video Memory       |  Application state
+----------------------------------+
| 16 B  Application State Memory   |  Application state
+----------------------------------+
|       TinyConsole System State   |
+----------------------------------+
|       Runtime / Stack            |  Transient use permitted
+----------------------------------+
|       Reserved                   |
+----------------------------------+
```

### 4.1 Application State Memory

Each title is provided with **16 bytes of general-purpose Application State Memory**.

This memory is shared between titles and recycled when execution passes from one title to another. It is volatile and its contents are not guaranteed to survive a title change, reset, power loss, or system restart.

Applications use this memory for state that must be retained between application updates and cannot naturally be represented in the framebuffer.

Together with the framebuffer, a title therefore has **32 bytes of defined application state memory**:

- **16 B general-purpose Application State Memory**
- **16 B directly addressable TGA-128 video memory**

Applications are encouraged to pack state efficiently and to exploit the known dimensions and ranges of platform data. Coordinates, directions, flags and other small-domain values need not occupy independent machine words.

### 4.2 Static SRAM allocation rule

A conforming TinyConsole title **MUST NOT allocate additional static SRAM for application state**.

Application state that survives between calls or update cycles must reside in Application State Memory or TGA-128 Video Memory. Application-owned global variables, file-scope static variables, and function-local static variables that allocate SRAM for retained state are therefore not permitted.

Automatic local variables are permitted. Loop counters, function-local temporaries, function call state, compiler-generated temporaries and similar transient values may use AVR CPU registers and the system stack as required by the compiler.

The 32-byte application state limit therefore describes the state owned and retained by a title; it does not imply that execution of application code may never transiently use additional SRAM through the system stack.

Constants and immutable application data stored in program Flash do not count as application state SRAM.

This rule is normative in Platform Specification 1.0. Automated build-time enforcement is not required by the platform and may be provided by development tooling in a future revision.

## 5. Input System

TinyConsole Gen 1 provides three application controls and one dedicated system control.

### 5.1 Analog Control Interface

UP, DOWN and ACTION are encoded through a passive resistor network and read through a **single analog input channel**.

The interface supports simultaneous button presses and therefore exposes all eight possible application-input states, including the no-button state.

The reference implementation uses a VCC-referenced ADC arrangement so that encoded input levels remain proportional to supply voltage.

### 5.2 Hardware Reset

RESET is electrically independent of the Analog Control Interface and acts directly on the processor reset input.

It provides an unconditional hardware-level restart of the TinyConsole system and return to the resident launcher.

## 6. Software Execution Model

TinyConsole firmware consists of a resident runtime, launcher, and one or more compiled-in titles.

Only one title executes at a time. A title operates against the TinyConsole platform services and shared resources rather than owning a separate hardware environment.

A conforming title may:

- read the three application controls;
- read and write the complete TGA-128 framebuffer;
- use the 16-byte Application State Memory;
- use automatic local variables and transient stack storage;
- invoke TinyConsole runtime functions;
- maintain state directly in video memory where appropriate; and
- return control to the launcher through the platform execution model.

Common display, input and system functionality is implemented by the TinyConsole runtime and shared by all titles, reducing the incremental program-memory cost of additional games.

## 7. Display Intensity

Display intensity is controlled by the MAX7219 hardware and provides **16 programmable intensity levels** independent of framebuffer contents.

The minimum intensity setting is the recommended default for typical operation where sufficient visibility is available, reducing unnecessary LED power consumption.

Display shutdown is available independently of intensity control through the display controller hardware.

## 8. Power Architecture

TinyConsole Gen 1 is intended for low-voltage battery operation.

| Property | Specification |
| --- | --- |
| Nominal target supply | Approximately **3 V** |
| Target battery configuration | 2-cell AA or AAA |
| Development supply | 3.3 V or 5 V |

The reference **TC Power Supply** uses replaceable battery cells and a physical inline on/off switch in the positive supply conductor. In the off position the supply path to the motherboard is physically interrupted; no software-controlled standby mode is required.

Battery replenishment is performed by replacing the cells rather than charging them in-system.

The analog input architecture is supply-ratiometric when the ADC uses VCC as its reference, allowing the same input encoding to operate across supported supply conditions without voltage-specific application thresholds.

Final battery form factor is implementation-dependent and is not mandated by Platform Specification 1.0.

## 9. Platform Design Principles

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

## 10. Reference Implementation Status

The current reference implementation operates successfully at **1 MHz** and includes a resident launcher and multiple playable titles.

The architecture has demonstrated that shared runtime code allows additional small titles to be incorporated with comparatively low incremental Flash and SRAM requirements.

Reference Hardware Revision A is currently being assembled and validated.

## 11. Platform Summary

**TinyConsole™ Gen 1**

- ATtiny85 8-bit AVR at 1 MHz
- 8 KB program Flash
- 512 B physical SRAM
- 32 B defined application state memory
- 16 B general-purpose Application State Memory
- 16 B application-accessible TGA-128 video memory
- no additional static SRAM allocation for title-owned state
- transient local variables and compiler stack use permitted
- 16 × 8 / 128-pixel / 1-bit monochrome graphics
- dual MAX7219 dedicated display controllers
- 16 hardware display-intensity levels
- three simultaneous-capable application controls over one ADC channel
- dedicated hardware RESET
- Dual-Layer Processor Socket Architecture
- TC POWER two-wire power interface
- five-wire TGA graphics interface including power
- hardware Power Integrity Indicator
- replaceable-cell switched power supply
- resident launcher and shared runtime

**GISC TGA-128™ graphics. 128 pixels. No unnecessary ones.**
