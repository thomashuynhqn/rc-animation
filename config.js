// ============================================
// Easing Functions
// ============================================
const ease = {
  cubicInOut: (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  backOut: (t) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  expoOut: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  elasticOut: (t) => {
    if (t === 0 || t === 1) return t;
    return (
      Math.pow(2, -10 * t) * Math.sin(((t * 10 - 0.75) * (2 * Math.PI)) / 3) + 1
    );
  },
  expoInOut: (t) => {
    if (t === 0 || t === 1) return t;
    if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;
    return (2 - Math.pow(2, -20 * t + 10)) / 2;
  },
};

// Helper: Cubic bezier point
const cubicBezier = (p0, p1, p2, p3, t) => {
  const mt = 1 - t;
  return {
    x:
      mt * mt * mt * p0.x +
      3 * mt * mt * t * p1.x +
      3 * mt * t * t * p2.x +
      t * t * t * p3.x,
    y:
      mt * mt * mt * p0.y +
      3 * mt * mt * t * p1.y +
      3 * mt * t * t * p2.y +
      t * t * t * p3.y,
  };
};

function fit(value, inMin, inMax, outMin, outMax, easeFunc = null) {
  let t = Math.max(0, Math.min(1, (value - inMin) / (inMax - inMin)));
  if (easeFunc) t = easeFunc(t);
  return outMin + (outMax - outMin) * t;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

const LOGO_PATH_CONFIG = [
  // =========================================================
  // STROKE 0 (Blue) – Left "C" shape
  // =========================================================
  {
    strokeIndex: 0,
    segments: [
      {
        type: "cubic",
        segments: 10,
        c0: { x: 280.68, y: 493.55 },
        c1: { x: 271.39, y: 495.49 },
        c2: { x: 264.7, y: 496.18 },
        c3: { x: 252.5, y: 496.45 },
      },
      {
        type: "cubic",
        segments: 10,
        c0: { x: 252.5, y: 496.45 },
        c1: { x: 234.35, y: 496.85 },
        c2: { x: 232.49, y: 496.71 },
        c3: { x: 218.0, y: 493.9 },
      },
      {
        type: "cubic",
        segments: 10,
        c0: { x: 218.0, y: 493.9 },
        c1: { x: 156.62, y: 481.99 },
        c2: { x: 107.56, y: 434.17 },
        c3: { x: 93.44, y: 372.5 },
      },
      {
        type: "cubic",
        segments: 10,
        c0: { x: 93.44, y: 372.5 },
        c1: { x: 89.53, y: 355.43 },
        c2: { x: 88.84, y: 329.02 },
        c3: { x: 91.84, y: 311.41 },
      },
      {
        type: "cubic",
        segments: 10,
        c0: { x: 91.84, y: 311.41 },
        c1: { x: 103.11, y: 245.28 },
        c2: { x: 155.02, y: 192.92 },
        c3: { x: 221.12, y: 181.02 },
      },
      {
        type: "cubic",
        segments: 10,
        c0: { x: 221.12, y: 181.02 },
        c1: { x: 235.19, y: 178.49 },
        c2: { x: 261.28, y: 178.24 },
        c3: { x: 274.62, y: 180.51 },
      },
      {
        type: "cubic",
        segments: 10,
        c0: { x: 274.62, y: 180.51 },
        c1: { x: 294.88, y: 183.97 },
        c2: { x: 319.43, y: 193.09 },
        c3: { x: 326.15, y: 199.65 },
      },
      {
        type: "cubic",
        segments: 10,
        c0: { x: 326.15, y: 199.65 },
        c1: { x: 330.89, y: 204.27 },
        c2: { x: 332.35, y: 208.52 },
        c3: { x: 331.8, y: 216.09 },
      },
      {
        type: "cubic",
        segments: 10,
        c0: { x: 331.8, y: 216.09 },
        c1: { x: 331.29, y: 223.18 },
        c2: { x: 327.76, y: 228.29 },
        c3: { x: 320.98, y: 231.75 },
      },
      {
        type: "cubic",
        segments: 10,
        c0: { x: 320.98, y: 231.75 },
        c1: { x: 314.53, y: 235.04 },
        c2: { x: 310.34, y: 234.63 },
        c3: { x: 298.69, y: 229.57 },
      },
      {
        type: "cubic",
        segments: 10,
        c0: { x: 298.69, y: 229.57 },
        c1: { x: 273.87, y: 218.77 },
        c2: { x: 250.8, y: 215.92 },
        c3: { x: 226.01, y: 220.59 },
      },
      {
        type: "cubic",
        segments: 10,
        c0: { x: 226.01, y: 220.59 },
        c1: { x: 178.88, y: 229.45 },
        c2: { x: 141.79, y: 266.53 },
        c3: { x: 131.37, y: 315.2 },
      },
      {
        type: "cubic",
        segments: 10,
        c0: { x: 131.37, y: 315.2 },
        c1: { x: 129.17, y: 325.48 },
        c2: { x: 128.91, y: 348.54 },
        c3: { x: 130.88, y: 358.0 },
      },
      {
        type: "cubic",
        segments: 10,
        c0: { x: 130.88, y: 358.0 },
        c1: { x: 137.4, y: 389.24 },
        c2: { x: 152.75, y: 414.19 },
        c3: { x: 176.3, y: 431.83 },
      },
      {
        type: "cubic",
        segments: 10,
        c0: { x: 176.3, y: 431.83 },
        c1: { x: 199.15, y: 448.94 },
        c2: { x: 221.03, y: 456.36 },
        c3: { x: 248.5, y: 456.32 },
      },
      {
        type: "cubic",
        segments: 10,
        c0: { x: 248.5, y: 456.32 },
        c1: { x: 279.3, y: 456.28 },
        c2: { x: 306.7, y: 445.66 },
        c3: { x: 329.29, y: 425.02 },
      },
      {
        type: "cubic",
        c0: { x: 329.29, y: 425.02 },
        c1: { x: 337.97, y: 417.08 },
        c2: { x: 345.5, y: 415.09 },
        c3: { x: 353.77, y: 418.55 },
      },
      {
        type: "cubic",
        c0: { x: 353.77, y: 418.55 },
        c1: { x: 360.8, y: 421.49 },
        c2: { x: 364.3, y: 426.18 },
        c3: { x: 365.52, y: 434.31 },
      },
      {
        type: "cubic",
        c0: { x: 365.52, y: 434.31 },
        c1: { x: 366.75, y: 442.46 },
        c2: { x: 364.43, y: 446.55 },
        c3: { x: 352.47, y: 457.36 },
      },
      {
        type: "cubic",
        c0: { x: 352.47, y: 457.36 },
        c1: { x: 340.81, y: 467.91 },
        c2: { x: 334.73, y: 472.19 },
        c3: { x: 321.54, y: 479.13 },
      },
      {
        type: "cubic",
        c0: { x: 321.54, y: 479.13 },
        c1: { x: 309.28, y: 485.59 },
        c2: { x: 295.41, y: 490.48 },
        c3: { x: 280.68, y: 493.55 },
      },
    ],
  },

  // =========================================================
  // STROKE 1 (Blue) – Cloud + S-curve
  // =========================================================
  {
    strokeIndex: 1,
    segments: [
      {
        type: "cubic",
        c0: { x: 550.5, y: 431.65 },
        c1: { x: 546.66, y: 433.71 },
        c2: { x: 539.6, y: 435.28 },
        c3: { x: 537.5, y: 434.53 },
      },
      {
        type: "cubic",
        c0: { x: 537.5, y: 434.53 },
        c1: { x: 536.95, y: 434.34 },
        c2: { x: 535.25, y: 433.9 },
        c3: { x: 533.72, y: 433.56 },
      },
      {
        type: "cubic",
        c0: { x: 533.72, y: 433.56 },
        c1: { x: 529.76, y: 432.69 },
        c2: { x: 523.56, y: 426.71 },
        c3: { x: 519.82, y: 420.18 },
      },
      {
        type: "cubic",
        c0: { x: 519.82, y: 420.18 },
        c1: { x: 515.17, y: 412.06 },
        c2: { x: 503.09, y: 399.9 },
        c3: { x: 493.13, y: 393.33 },
      },
      {
        type: "cubic",
        c0: { x: 493.13, y: 393.33 },
        c1: { x: 477.31, y: 382.89 },
        c2: { x: 463.24, y: 376.74 },
        c3: { x: 444.4, y: 372.03 },
      },
      {
        type: "cubic",
        c0: { x: 444.4, y: 372.03 },
        c1: { x: 430.65, y: 368.59 },
        c2: { x: 423.58, y: 352.76 },
        c3: { x: 429.94, y: 339.63 },
      },
      {
        type: "cubic",
        c0: { x: 429.94, y: 339.63 },
        c1: { x: 433.21, y: 332.88 },
        c2: { x: 437.38, y: 330.2 },
        c3: { x: 450.79, y: 326.28 },
      },
      {
        type: "cubic",
        c0: { x: 450.79, y: 326.28 },
        c1: { x: 471.84, y: 320.12 },
        c2: { x: 484.51, y: 313.57 },
        c3: { x: 499.04, y: 301.37 },
      },
      {
        type: "cubic",
        c0: { x: 499.04, y: 301.37 },
        c1: { x: 519.33, y: 284.33 },
        c2: { x: 533.68, y: 260.12 },
        c3: { x: 539.02, y: 233.89 },
      },
      {
        type: "cubic",
        c0: { x: 539.02, y: 233.89 },
        c1: { x: 541.29, y: 222.76 },
        c2: { x: 541.77, y: 203.6 },
        c3: { x: 540.05, y: 192.84 },
      },
      {
        type: "cubic",
        c0: { x: 540.05, y: 192.84 },
        c1: { x: 532.57, y: 146.0 },
        c2: { x: 497.94, y: 107.92 },
        c3: { x: 451.29, y: 95.25 },
      },
      {
        type: "cubic",
        c0: { x: 451.29, y: 95.25 },
        c1: { x: 442.24, y: 92.79 },
        c2: { x: 440.03, y: 92.59 },
        c3: { x: 422.0, y: 92.61 },
      },
      {
        type: "cubic",
        c0: { x: 422.0, y: 92.61 },
        c1: { x: 404.19, y: 92.63 },
        c2: { x: 401.66, y: 92.86 },
        c3: { x: 392.87, y: 95.23 },
      },
      {
        type: "cubic",
        c0: { x: 392.87, y: 95.23 },
        c1: { x: 359.36, y: 104.26 },
        c2: { x: 331.39, y: 126.68 },
        c3: { x: 316.79, y: 156.21 },
      },
      {
        type: "cubic",
        c0: { x: 316.79, y: 156.21 },
        c1: { x: 313.04, y: 163.8 },
        c2: { x: 311.06, y: 166.79 },
        c3: { x: 310.0, y: 166.5 },
      },
      {
        type: "cubic",
        c0: { x: 310.0, y: 166.5 },
        c1: { x: 309.17, y: 166.27 },
        c2: { x: 303.95, y: 164.76 },
        c3: { x: 298.39, y: 163.13 },
      },
      {
        type: "cubic",
        c0: { x: 298.39, y: 163.13 },
        c1: { x: 292.84, y: 161.51 },
        c2: { x: 284.74, y: 159.61 },
        c3: { x: 280.39, y: 158.9 },
      },
      {
        type: "cubic",
        c0: { x: 280.39, y: 158.9 },
        c1: { x: 276.05, y: 158.2 },
        c2: { x: 272.39, y: 157.57 },
        c3: { x: 272.26, y: 157.49 },
      },
      {
        type: "cubic",
        c0: { x: 272.26, y: 157.49 },
        c1: { x: 271.61, y: 157.11 },
        c2: { x: 277.49, y: 143.75 },
        c3: { x: 282.08, y: 135.15 },
      },
      {
        type: "cubic",
        c0: { x: 282.08, y: 135.15 },
        c1: { x: 294.59, y: 111.69 },
        c2: { x: 312.28, y: 92.48 },
        c3: { x: 335.31, y: 77.34 },
      },
      {
        type: "cubic",
        c0: { x: 335.31, y: 77.34 },
        c1: { x: 396.76, y: 36.95 },
        c2: { x: 477.68, y: 44.23 },
        c3: { x: 531.21, y: 94.96 },
      },
      {
        type: "cubic",
        c0: { x: 531.21, y: 94.96 },
        c1: { x: 562.23, y: 124.35 },
        c2: { x: 578.9, y: 160.46 },
        c3: { x: 581.62, y: 204.16 },
      },
      {
        type: "cubic",
        c0: { x: 581.62, y: 204.16 },
        c1: { x: 582.99, y: 226.11 },
        c2: { x: 577.35, y: 255.04 },
        c3: { x: 567.54, y: 276.44 },
      },
      {
        type: "cubic",
        c0: { x: 567.54, y: 276.44 },
        c1: { x: 554.84, y: 304.16 },
        c2: { x: 532.1, y: 329.86 },
        c3: { x: 505.32, y: 346.77 },
      },
      {
        type: "cubic",
        c0: { x: 505.32, y: 346.77 },
        c1: { x: 502.94, y: 348.27 },
        c2: { x: 501.01, y: 349.73 },
        c3: { x: 501.02, y: 350.0 },
      },
      {
        type: "cubic",
        c0: { x: 501.02, y: 350.0 },
        c1: { x: 501.04, y: 350.27 },
        c2: { x: 504.57, y: 352.82 },
        c3: { x: 508.87, y: 355.65 },
      },
      {
        type: "cubic",
        c0: { x: 508.87, y: 355.65 },
        c1: { x: 520.01, y: 362.99 },
        c2: { x: 536.0, y: 376.07 },
        c3: { x: 542.03, y: 382.77 },
      },
      {
        type: "cubic",
        c0: { x: 542.03, y: 382.77 },
        c1: { x: 552.73, y: 394.66 },
        c2: { x: 559.97, y: 407.49 },
        c3: { x: 559.99, y: 414.57 },
      },
      {
        type: "cubic",
        c0: { x: 559.99, y: 414.57 },
        c1: { x: 560.01, y: 420.76 },
        c2: { x: 555.42, y: 429.0 },
        c3: { x: 550.5, y: 431.65 },
      },
    ],
  },

  // =========================================================
  // STROKE 2 (Dark) – Right "D" + bottom
  // =========================================================
  {
    strokeIndex: 2,
    segments: [
      {
        type: "cubic",
        c0: { x: 599.5, y: 494.2 },
        c1: { x: 654.95, y: 480.58 },
        c2: { x: 695.66, y: 445.71 },
        c3: { x: 716.07, y: 394.32 },
      },
      {
        type: "cubic",
        c0: { x: 716.07, y: 394.32 },
        c1: { x: 722.72, y: 377.58 },
        c2: { x: 726.08, y: 358.32 },
        c3: { x: 726.07, y: 337.0 },
      },
      {
        type: "cubic",
        c0: { x: 726.07, y: 337.0 },
        c1: { x: 726.02, y: 266.1 },
        c2: { x: 677.94, y: 203.25 },
        c3: { x: 609.12, y: 184.13 },
      },

      {
        type: "line",
        from: { x: 609.12, y: 184.13 },
        to: { x: 601.75, y: 182.08 },
      },
      {
        type: "line",
        from: { x: 601.75, y: 182.08 },
        to: { x: 602.37, y: 186.29 },
      },

      {
        type: "cubic",
        c0: { x: 602.37, y: 186.29 },
        c1: { x: 602.72, y: 188.61 },
        c2: { x: 603.29, y: 198.16 },
        c3: { x: 603.65, y: 207.52 },
      },

      {
        type: "line",
        from: { x: 603.65, y: 207.52 },
        to: { x: 604.3, y: 224.54 },
      },
      {
        type: "line",
        from: { x: 604.3, y: 224.54 },
        to: { x: 611.4, y: 227.38 },
      },

      {
        type: "cubic",
        c0: { x: 611.4, y: 227.38 },
        c1: { x: 641.81, y: 239.56 },
        c2: { x: 666.79, y: 265.29 },
        c3: { x: 678.57, y: 296.58 },
      },
      {
        type: "cubic",
        c0: { x: 678.57, y: 296.58 },
        c1: { x: 686.97, y: 318.91 },
        c2: { x: 688.21, y: 345.79 },
        c3: { x: 681.9, y: 368.72 },
      },
      {
        type: "cubic",
        c0: { x: 681.9, y: 368.72 },
        c1: { x: 676.08, y: 389.86 },
        c2: { x: 665.53, y: 407.48 },
        c3: { x: 649.35, y: 423.06 },
      },
      {
        type: "cubic",
        c0: { x: 649.35, y: 423.06 },
        c1: { x: 632.79, y: 439.02 },
        c2: { x: 616.56, y: 447.98 },
        c3: { x: 593.0, y: 454.18 },
      },
      {
        type: "cubic",
        c0: { x: 593.0, y: 454.18 },
        c1: { x: 584.52, y: 456.42 },
        c2: { x: 584.31, y: 456.42 },
        c3: { x: 485.28, y: 456.75 },
      },

      {
        type: "line",
        from: { x: 485.28, y: 456.75 },
        to: { x: 386.06, y: 457.07 },
      },
      {
        type: "line",
        from: { x: 386.06, y: 457.07 },
        to: { x: 373.46, y: 469.04 },
      },

      {
        type: "cubic",
        c0: { x: 373.46, y: 469.04 },
        c1: { x: 361.69, y: 480.21 },
        c2: { x: 348.29, y: 490.73 },
        c3: { x: 341.09, y: 494.45 },
      },
      {
        type: "cubic",
        c0: { x: 341.09, y: 494.45 },
        c1: { x: 339.39, y: 495.33 },
        c2: { x: 338.0, y: 496.28 },
        c3: { x: 338.0, y: 496.56 },
      },
      {
        type: "cubic",
        c0: { x: 338.0, y: 496.56 },
        c1: { x: 338.0, y: 496.83 },
        c2: { x: 394.81, y: 496.91 },
        c3: { x: 464.25, y: 496.73 },
      },

      {
        type: "line",
        from: { x: 464.25, y: 496.73 },
        to: { x: 590.5, y: 496.41 },
      },
      {
        type: "line",
        from: { x: 590.5, y: 496.41 },
        to: { x: 599.5, y: 494.2 },
      },
    ],
  },
];

const CLOUD_SHAPE = [
  {
    type: "cubic",
    c0: { x: 510.61, y: 302.12 },
    c1: { x: 511.85, y: 340.45 },
    c2: { x: 511.67, y: 330.27 },
    c3: { x: 510.46, y: 335.89 },
  },
  {
    type: "cubic",
    c0: { x: 510.46, y: 335.89 },
    c1: { x: 502.82, y: 371.1 },
    c2: { x: 477.35, y: 397.98 },
    c3: { x: 442.86, y: 407.22 },
  },
  {
    type: "cubic",
    segments: 20,
    c0: { x: 442.86, y: 407.22 },
    c1: { x: 142.94, y: 410.02 },
    c2: { x: 94.95, y: 409.8 },
    c3: { x: 88.04, y: 408.96 },
  },
  {
    type: "cubic",
    c0: { x: 88.04, y: 408.96 },
    c1: { x: 42.67, y: 403.42 },
    c2: { x: 6.27, y: 367.0 },
    c3: { x: 1.12, y: 322.0 },
  },
  {
    type: "cubic",
    c0: { x: 1.12, y: 322.0 },
    c1: { x: 0.97, y: 300.14 },
    c2: { x: 0.98, y: 300.09 },
    c3: { x: 0.99, y: 300.0 },
  },
  {
    type: "cubic",
    c0: { x: 0.99, y: 300.0 },
    c1: { x: 2.6, y: 285.17 },
    c2: { x: 8.4, y: 269.68 },
    c3: { x: 17.43, y: 256.1 },
  },
  {
    type: "cubic",
    c0: { x: 17.43, y: 256.1 },
    c1: { x: 26.21, y: 242.9 },
    c2: { x: 44.59, y: 227.8 },
    c3: { x: 59.7, y: 221.38 },
  },
  {
    type: "cubic",
    c0: { x: 59.7, y: 221.38 },
    c1: { x: 65.46, y: 218.93 },
    c2: { x: 66.01, y: 218.43 },
    c3: { x: 66.52, y: 215.11 },
  },
  {
    type: "cubic",
    c0: { x: 66.52, y: 215.11 },
    c1: { x: 71.31, y: 184.17 },
    c2: { x: 89.21, y: 162.44 },
    c3: { x: 117.0, y: 153.84 },
  },
  {
    type: "cubic",
    c0: { x: 117.0, y: 153.84 },
    c1: { x: 128.5, y: 150.28 },
    c2: { x: 144.44, y: 150.5 },
    c3: { x: 156.26, y: 154.37 },
  },
  {
    type: "cubic",
    c0: { x: 156.26, y: 154.37 },
    c1: { x: 173.72, y: 162.48 },
    c2: { x: 176.39, y: 164.0 },
    c3: { x: 176.56, y: 164.0 },
  },
  {
    type: "cubic",
    c0: { x: 176.56, y: 164.0 },
    c1: { x: 200.84, y: 123.29 },
    c2: { x: 230.53, y: 100.63 },
    c3: { x: 264.71, y: 91.86 },
  },
  {
    type: "cubic",
    c0: { x: 264.71, y: 91.86 },
    c1: { x: 285.33, y: 86.56 },
    c2: { x: 311.47, y: 86.7 },
    c3: { x: 331.91, y: 92.21 },
  },
  {
    type: "cubic",
    c0: { x: 331.91, y: 92.21 },
    c1: { x: 389.41, y: 107.71 },
    c2: { x: 429.55, y: 158.15 },
    c3: { x: 431.61, y: 217.5 },
  },

  // {
  //   type: "line",
  //   from: { x: 432.03, y: 229.5 },
  //   to: { x: 438.26, y: 230.76 },
  // },
  {
    type: "cubic",
    c0: { x: 438.26, y: 230.76 },
    c1: { x: 460.62, y: 235.28 },
    c2: { x: 479.01, y: 246.18 },
    c3: { x: 492.46, y: 262.88 },
  },
  {
    type: "cubic",
    c0: { x: 492.46, y: 262.88 },
    c1: { x: 501.73, y: 274.39 },
    c2: { x: 509.02, y: 290.16 },
    c3: { x: 510.61, y: 302.12 },
  },
];

const CLOUD_PATH_CONFIG = [
  {
    strokeIndex: 0,
    segments: [...CLOUD_SHAPE],
  },
  {
    strokeIndex: 1,
    segments: [...CLOUD_SHAPE],
  },
  {
    strokeIndex: 2,
    segments: [...CLOUD_SHAPE],
  },
];

const getBlueMaterialConfig = (lightPosition, size) => {
  return {
    uniforms: { u_lightPosition: { value: lightPosition } },
    side: size,
    vertexShader: `
                              varying vec3 v_worldPosition;
                              varying vec3 v_worldNormal;
                              varying vec3 v_viewNormal;
                              void main() {
                                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                                  v_viewNormal = normalMatrix * normal;
                                  v_worldNormal = normalize((vec4(v_viewNormal, 0.0) * viewMatrix).xyz);
                                  v_worldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
                              }
                          `,
    fragmentShader: `
                              uniform vec3 u_lightPosition;
                              varying vec3 v_worldPosition, v_worldNormal, v_viewNormal;
                              void main() {
                                  vec3 N = normalize(v_worldNormal);
                                  vec3 L = normalize(u_lightPosition - v_worldPosition);
                                  vec3 V = normalize(v_viewNormal);
                                  float shade1 = max(0.0, dot(N, L)) / (length(u_lightPosition - v_worldPosition) * 0.38);
                                  float shade2 = max(0.0, dot(V, vec3(0.5773)));
                                  float rim = pow(1.0 - abs(dot(V, N)), 2.0);
                                  float ambient = 0.25;
                                  float glow = 0.25 + rim * 0.4;
                                  float b = (ambient + shade1 * 1.2 + shade2 * 1.05 + glow);
                                  
                                  gl_FragColor = vec4(b * 0.45, b * 0.75, b * 1.05, 1.0);
                              }
                          `,
  };
};

const getDarkMaterialConfig = (lightPosition, size) => {
  return {
    uniforms: { u_lightPosition: { value: lightPosition } },
    side: size,
    vertexShader: `
                              varying vec3 v_worldPosition;
                              varying vec3 v_worldNormal;
                              varying vec3 v_viewNormal;
                              void main() {
                                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                                  v_viewNormal = normalMatrix * normal;
                                  v_worldNormal = normalize((vec4(v_viewNormal, 0.0) * viewMatrix).xyz);
                                  v_worldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
                              }
                          `,
    fragmentShader: `
                              uniform vec3 u_lightPosition;
                              varying vec3 v_worldPosition, v_worldNormal, v_viewNormal;
                              void main() {
                                  vec3 N = normalize(v_worldNormal);
                                  vec3 L = normalize(u_lightPosition - v_worldPosition);
                                  vec3 V = normalize(v_viewNormal);
                                  float shade1 = max(0.0, dot(N, L)) / (length(u_lightPosition - v_worldPosition) * 0.5);
                                  float shade2 = max(0.0, dot(V, vec3(0.5773)));
                                  float rim = pow(1.0 - abs(dot(V, N)), 2.0);
                                  float ambient = 0.22;
                                  float b = ambient + shade1 * 0.6 + shade2 * 0.6 + rim * 0.4;
                                  gl_FragColor = vec4(b * 0.35, b * 0.45, b * 0.65 + 0.1, 1.0);
                              }
                          `,
  };
};
const getRodMaterialConfig = (lightPosition) => {
  return {
    uniforms: {
      u_lightPosition: { value: lightPosition },
    },
    vertexShader: `
                        varying vec3 v_worldPosition;
                        varying vec3 v_worldNormal;
                        varying vec3 v_viewNormal;

                        void main() {
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                            v_viewNormal = normalMatrix * normal;
                            v_worldNormal = normalize((vec4(v_viewNormal, 0.0) * viewMatrix).xyz);
                            v_worldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
                        }
                    `,
    fragmentShader: `
                        uniform vec3 u_lightPosition;
                        varying vec3 v_worldPosition;
                        varying vec3 v_worldNormal;
                        varying vec3 v_viewNormal;

                        void main() {
                            vec3 VN = normalize(v_viewNormal);
                            vec3 N = normalize(v_worldNormal);
                            vec3 L = normalize(u_lightPosition - v_worldPosition);

                            float shade1 = max(0.0, dot(N, L)) / (length(u_lightPosition - v_worldPosition) * 0.25);
                            float shade2 = max(0.0, dot(VN, vec3(0.5773)));
                            float rim = pow(1.0 - abs(dot(VN, N)), 1.5);

                            // Much brighter glow effect - cyan/electric blue
                            float brightness = (1.2 + shade1 * 0.6 + shade2 * 0.5 + rim * 0.8) * 0.55;
                            
                            // Strong cyan/electric blue color
                            gl_FragColor = vec4(
                                brightness * 0.4,   // R - some warmth
                                brightness * 0.85,  // G - strong
                                brightness * 1.4,   // B - dominant blue
                                1.0
                            );
                        }
                    `,
  };
};
