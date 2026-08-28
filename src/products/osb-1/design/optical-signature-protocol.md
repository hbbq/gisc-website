---
layout: base.njk
title: Optical Signature Protocol
order: 10
---

# Optical Signature Protocol

The OSB-1 uses conventional modulated infrared signalling to transmit a
beacon-specific optical signature.

The current design assumes a 38 kHz infrared carrier suitable for use with
standard demodulating infrared receiver modules.

Each beacon transmits a periodically repeated timing pattern representing its
identity. The receiver classifies the observed timing sequence and associates
it with a known beacon.

The signalling method is based on established infrared communication
techniques. The GISC-specific portion of the design concerns the beacon
identification format, timing scheme and receiver behaviour.