---
layout: base.njk
title: GISC Optical Signature Protocol
order: 10
---

# GISC Optical Signature Protocol

**Protocol designation:** GOSP-1  
**Revision:** A  
**Status:** Draft  
**Owning department:** Research or Development Department  
**Associated product:** OSB-1 Optical Signature Beacon

## 1. Purpose

The GISC Optical Signature Protocol (GOSP) defines a compact infrared signalling method for assigning a persistent optical identity to an observable object.

GOSP-1 is intended primarily for autonomous systems that need to detect and distinguish simple infrared beacons without requiring bidirectional communication, network addressing or conventional message exchange.

The protocol is designed for very low transmitter complexity and for reception using standard demodulating infrared receiver modules.

## 2. Optical Signature Identification

Conventional infrared communication systems generally encode commands or data for transmission between devices. GOSP instead defines the repeated temporal emission pattern itself as the identity of the transmitting object.

An Optical Signature Beacon does not primarily transmit a numerical address or a message containing its identity. Its identity is represented directly by a deliberately selected sequence of infrared timing elements.

A receiving system observes and classifies that sequence in order to establish the presence of a known optical entity.

GISC designates this method **Optical Signature Identification (OSI)**.

## 3. Terminology

### 3.1 Carrier
The modulated infrared carrier emitted during an Optical Burst.

### 3.2 Optical Burst
A continuous interval during which the infrared carrier is emitted.

### 3.3 Optical Silence
An interval during which the infrared carrier is not emitted.

### 3.4 Signature Element
One Optical Burst followed by an Optical Silence whose duration represents one symbol of the Optical Signature.

GOSP-1 defines two Signature Elements: **S** (Short Signature Element) and **L** (Long Signature Element). The symbols S and L form the temporal alphabet of GOSP-1.

### 3.5 Optical Signature
An ordered sequence of Signature Elements representing the persistent identity of a beacon.

### 3.6 Signature Frame
One complete transmission of an Optical Signature.

### 3.7 Signature Boundary
A period of Optical Silence substantially longer than any element silence. A Signature Boundary separates consecutive Signature Frames and establishes the start position of the following signature.

### 3.8 Beacon Cycle
One Signature Frame followed by its Signature Boundary.

## 4. Physical Layer

GOSP-1 uses amplitude-modulated infrared radiation with a nominal carrier frequency of `Fc = 38 kHz`.

The protocol is intended for use with standard 38 kHz demodulating infrared receiver modules.

Emitter type, emitter count, optical power, driver topology, beam geometry, supply voltage and mechanical construction are implementation details and are not defined by GOSP-1.

A conforming transmitter SHALL generate carrier bursts and silence intervals that satisfy the timing requirements of this specification.

## 5. Signalling Model

All Signature Elements use a fixed Optical Burst duration. Element values are encoded exclusively by the duration of the Optical Silence following each burst.

The transmitter therefore emits a sequence of equal-length bursts separated by either short or long silence intervals. The use of constant burst duration intentionally separates carrier generation from identity encoding and permits a minimal transmitter implementation.

## 6. GOSP-1 Timing

Revision A defines the following nominal timing parameters:

| Parameter | Meaning | Nominal value |
| --- | --- | ---: |
| `Fc` | infrared carrier frequency | 38 kHz |
| `Tb` | Optical Burst duration | 600 us |
| `Ts` | S-element silence | 600 us |
| `Tl` | L-element silence | 1200 us |
| `Tf` | Signature Boundary silence | 10 ms |

A transmitter SHOULD remain close to the nominal values. A receiver SHALL use timing windows rather than exact numerical equality when classifying observed intervals.

The exact receiver tolerance windows are implementation-dependent in Revision A and SHALL be chosen so that S, L and Signature Boundary intervals remain unambiguous.

The timing values in Revision A are part of the draft protocol and may be revised before GOSP-1 Revision A is declared stable.

## 7. Signature Frame Format

A GOSP-1 Optical Signature consists of exactly **eight Signature Elements**.

A Signature Frame therefore consists of eight fixed-duration Optical Bursts, each followed by an S or L silence interval, followed by a Signature Boundary.

The Signature Boundary terminates the current frame and simultaneously establishes synchronization for the following frame.

No separate start burst, preamble, address field, length field or checksum is required by GOSP-1 Revision A.

A receiver SHALL NOT classify an arbitrary sequence of eight observed elements as an Optical Signature unless the sequence has been associated with a valid Signature Boundary.

## 8. Signature Representation

Optical Signatures SHALL be represented textually using the symbols `S` and `L`.

Example: `S S L S L L S L`

S and L MAY be represented internally as binary values by software performing storage, generation or mathematical analysis. Such representation is an implementation detail.

**Optical Signature values SHALL NOT be interpreted as binary integers.**

A numerical allocation identifier, such as `OSI-001`, identifies an entry in an allocation registry. It is not the value transmitted by the beacon.

## 9. Signature Code Space

Not every possible eight-element S/L sequence is necessarily a valid assigned Optical Signature.

GOSP-1 signatures are deliberately selected from the available code space to maintain distinguishability between independently observable optical entities.

Assigned signatures SHALL have a minimum Hamming distance of **three Signature Elements** from every other assigned signature within the same allocation space.

Additional code-space restrictions MAY be applied by the signature allocation process in order to avoid undesirable or weak temporal patterns.

Cyclic rotations of a signature are not required to be unique. Frame alignment is established by the Signature Boundary and receivers are required to respect that alignment.

The list of assigned signatures is maintained separately from this protocol so that new identities may be allocated without revising GOSP itself.

## 10. Beacon Identity

A beacon identity consists of its assigned Optical Signature.

The allocation number associated with that signature exists for human, documentation and registry purposes only.

Two conforming beacons intended to represent different optical entities SHALL NOT intentionally use the same assigned Optical Signature within the same operational identity space.

## 11. Repetition

An OSB transmitter repeatedly emits its assigned Signature Frame.

Repeated transmission allows a receiver to recover from temporary occlusion, interference, frame corruption or collisions without requiring retransmission requests or synchronization between devices.

The Signature Boundary provides a natural minimum inter-frame separation. Implementations MAY introduce additional delay between Beacon Cycles provided that receiver discovery latency remains acceptable for the intended application.

## 12. Receiver Behaviour

A GOSP-1 receiver conceptually performs the following operations:

1. detect the presence and absence of demodulated carrier;
2. measure burst and silence durations;
3. identify a valid Signature Boundary;
4. observe the following eight Signature Elements;
5. classify each element as S or L using timing windows;
6. compare the resulting Optical Signature with known assigned signatures; and
7. report the corresponding optical identity when classification is sufficiently reliable.

A receiver SHALL reject incomplete, malformed or temporally ambiguous frames. Carrier detection alone SHALL NOT establish beacon identity.

A receiver MAY require repeated matching observations before reporting an identity and MAY expose implementation-specific confidence information.

## 13. Collisions

GOSP-1 does not require synchronization between independent beacons. Two or more beacons may therefore transmit simultaneously. Overlapping optical bursts can produce an invalid or unclassifiable observation at a receiver.

A receiver SHOULD reject a collided frame rather than infer an identity from an ambiguous observation.

Repeated independent transmission provides eventual opportunities for uncollided observation. Implementations MAY use randomized or beacon-specific inter-cycle delays to reduce the probability of persistent collisions.

Collision avoidance is not required for transmitter conformance to GOSP-1 Revision A.

## 14. Interference

The 38 kHz infrared carrier used by GOSP-1 is also used by conventional infrared remote-control systems and other devices.

The presence of a compatible carrier therefore does not imply the presence of a GOSP beacon.

A receiver SHALL establish identity only after observing a valid framed Optical Signature. Unrecognized carrier activity, malformed timing sequences and partial signatures SHALL be treated as interference or unknown optical activity.

## 15. Design Principles

GOSP-1 is intentionally based on very low transmitter complexity, inexpensive conventional infrared components, deterministic beacon behaviour, low receiver processing requirements, no shared clock or network synchronization, no bidirectional communication requirement, recovery through repeated observation, and support for multiple independently observable optical identities.

## 16. Implementation Scope

GOSP-1 specifies the optical signalling behaviour required for interoperability. It does not prescribe microcontroller architecture, firmware implementation language, infrared LED type, transistor or driver topology, supply voltage, enclosure design, beam width, physical mounting, receiving processor or platform, or application-specific meaning assigned to a detected beacon.

The OSB-1 product may define additional implementation requirements separately from GOSP-1.

## 17. GISC-Specific Design Scope

GOSP builds on established techniques including modulated infrared transmission, timing-based signalling and demodulating infrared receiver modules.

The GISC-specific design concerns the use of a deliberately selected and repeated temporal infrared pattern as the persistent identity of an observable object, together with the associated signature representation, allocation rules, classification model and receiver behaviour.

This design concept is designated Optical Signature Identification.

## 18. Conformance

A transmitter conforms to GOSP-1 Revision A when it emits an assigned GOSP-1 Optical Signature using the framing, element representation and physical signalling rules defined by this specification.

A receiver conforms to GOSP-1 Revision A when it is capable of identifying valid framed GOSP-1 Optical Signatures while rejecting incomplete or invalid observations in accordance with the receiver requirements above.

Conformance to GOSP-1 does not by itself imply conformance to the OSB-1 product specification.

## 19. Revision History

| Revision | Status | Description |
| --- | --- | --- |
| A | Draft | Initial definition of Optical Signature Identification, GOSP-1 framing, timing model, eight-element signatures, allocation constraints and receiver behaviour. |
