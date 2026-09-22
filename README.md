# Big Walk Train Sounds

An interactive train sound board inspired by the Big Walk game, featuring a horn
and bell.

## Horn Synthesis: Evolutionary Approaches & Calibration

To replicate the "cute," warm, and energetic tonal quality of the reference
audio, multiple analytical and iterative algorithmic approaches were used.

### 1. Subjective description and online references

- AI was prompted to recreate the sounds based on a description. The result was
  moderately acceptable and tuned with suggestions to be higher/lower, etc.
  However, it was not approaching the game sound.

### 2. High-Resolution Reference Analysis

To improve, a new approach was requested to analyse a reference sound.

Detailed temporal RMS profiling (10ms windows) and multi-region FFT spectral
slicing revealed distinct acoustic stages:

- **Pneumatic Valve Shockwave (Attack Transient, 0–25ms)**: A rapid pressure
  crack / mouth pop with a sharp pitch descent before the pipes lock into
  resonance.
- **Aerodynamic Onset Burst (25–100ms)**: High air pressure creates an energetic
  puff peaking around 80–95ms at elevated amplitude.
- **Warm Whistle Sustain (100–1000ms)**: Transition from initial burst into a
  steady, quiet flute-like sustain. The spectrum is dominated by smooth sine and
  triangle tones; harsh sawtooth buzz or distortion clipping destroys the "cute"
  flute character.
- **Valve Exhaust Surge & Staggered Release (1000–1500ms)**:
  - When the valve is released, venting manifold pressure produces a distinct
    **pneumatic surge peak** around ~190ms after release.
  - Pipes cut out in **tiered dropouts**: higher-frequency chimes lose laminar
    flow earliest, while lower cavity and fundamental pipes sustain
    significantly longer.
  - Pitch drops (~2–5%) as line pressure discharges.

### 3. Optimization Methodology

Then an attempt was made to tune this model:

- **Harmonic Identification**: Extracted the core chord frequencies—an $A\flat$
  augmented triad ($846.25\text{ Hz}$, $1038.48\text{ Hz}$, $1286.24\text{ Hz}$)
  plus stabilizing air lock ($1109.24\text{ Hz}$) and chamber resonance
  ($644.40\text{ Hz}$).
- **Iterative Automated Tuning**: Built a weighted loss function comparing
  temporal RMS envelopes (prioritizing attack and release surge) and spectral
  FFT slices across critical regions.
- **Simulated Annealing Optimization**: Ran a 10,000-iteration simulated
  annealing pass across valve thump, envelope timings, harmonic mixtures,
  dynamic lowpass filtering, and per-pipe staggered release parameters to
  minimize distance to the reference profile.

---

### 4. Calibrated Parameter Configuration

The calibrated values incorporated into `startHorn()` and `stopHorn()` in
`index.html`:

<!-- markdownlint-disable MD013 -->

| Parameter                          | Calibrated Value                                               | Acoustic Role                                       |
| :--------------------------------- | :------------------------------------------------------------- | :-------------------------------------------------- |
| **Thump Freq / Gain**              | $144.57\text{ Hz} \rightarrow 38\text{ Hz}$ (0.307 gain, 20ms) | Initial valve click / pop shockwave                 |
| **Attack Ramp**                    | $92.9\text{ ms}$ (peaking at $0.696$ gain)                     | Energetic aerodynamic onset puff                    |
| **Sustain Settle**                 | $300\text{ ms}$ transition to $0.158$ gain                     | Warm, quiet flute-like whistling                    |
| **Acoustic Lowpass**               | $2,040\text{ Hz}$ cutoff                                       | Gentle high-frequency damping (prevents brassiness) |
| **Release Surge Delay**            | $192\text{ ms}$ after release                                  | Pneumatic pressure backwave puff                    |
| **Release Surge Gain**             | $0.512$ volume                                                 | Venting surge peak                                  |
| **Pipe Dropouts & Pitch Drops**    |                                                                |                                                     |
| - Mid Chime ($1038.48\text{ Hz}$)  | $0.126\text{ s}$ release, $2.6\%$ pitch drop                   | First to extinguish                                 |
| - High Chime ($1286.24\text{ Hz}$) | $0.140\text{ s}$ release, $4.0\%$ pitch drop                   | Second to extinguish                                |
| - Air Lock ($1109.24\text{ Hz}$)   | $0.318\text{ s}$ release, $1.6\%$ pitch drop                   | Stabilizing whistle mouth tail                      |
| - Root Pipe ($846.25\text{ Hz}$)   | $0.450\text{ s}$ release, $4.9\%$ pitch drop                   | Long-sustain fundamental body                       |
| - Cavity ($644.40\text{ Hz}$)      | $0.450\text{ s}$ release, $3.4\%$ pitch drop                   | Hollow resonance sustaining through exhaust         |

<!-- markdownlint-enable MD013 -->

> **Current Status**: Despite these automated calibration steps, we are still
> not satisfied with the horn sound. It does not match the reference yet and
> requires further refinement.
