const fs = require('fs');

const CHAPTERS = {
  physics: [
    { id: 1, name: "Units, Dimensions & Errors", focus: "Dimensional consistency, significant figures and percentage error" },
    { id: 2, name: "Kinematics", focus: "Uniform acceleration, graphs and relative motion" },
    { id: 3, name: "Newton's Laws & Friction", focus: "F=ma, normal reaction and limiting friction" },
    { id: 4, name: "Work, Energy & Power", focus: "Work-energy theorem, potential energy and power" },
    { id: 5, name: "Rotational Motion", focus: "Torque, moment of inertia and angular momentum" },
    { id: 6, name: "Electrostatics & Capacitance", focus: "Coulomb's law, electric field and capacitors" },
    { id: 7, name: "Current Electricity", focus: "Ohm's law, series-parallel circuits and Joule heating" },
    { id: 8, name: "Magnetism & EMI", focus: "Magnetic force, force on wire and Faraday's law" },
    { id: 9, name: "Ray & Wave Optics", focus: "Lens/mirror formula, refraction and interference" },
    { id: 10, name: "Modern Physics", focus: "Photons, photoelectric effect and radioactivity" }
  ],
  chemistry: [
    { id: 1, name: "Mole Concept & Stoichiometry", focus: "Moles, particles, limiting reagent and empirical formula" },
    { id: 2, name: "Atomic Structure", focus: "Quantum numbers, orbitals and electronic structure" },
    { id: 3, name: "Periodic Table & Periodicity", focus: "Atomic radius, ionisation enthalpy and electronegativity" },
    { id: 4, name: "Chemical Bonding", focus: "VSEPR, hybridisation, polarity and bond order" },
    { id: 5, name: "Chemical Thermodynamics", focus: "Enthalpy, internal energy and spontaneity" },
    { id: 6, name: "Chemical & Ionic Equilibrium", focus: "Le Chatelier principle, pH and weak electrolytes" },
    { id: 7, name: "Electrochemistry", focus: "Galvanic cells, electrode potential and conductivity" },
    { id: 8, name: "Chemical Kinetics", focus: "Rate law, order and half-life" },
    { id: 9, name: "Coordination Compounds", focus: "Oxidation state, coordination number and ligands" },
    { id: 10, name: "General Organic Chemistry", focus: "Inductive effect, resonance, intermediates and tests" }
  ],
  maths: [
    { id: 1, name: "Functions & Relations", focus: "Domain, range, one-one and onto functions" },
    { id: 2, name: "Quadratic Equations", focus: "Roots, discriminant and relations between roots" },
    { id: 3, name: "Sequences & Series", focus: "AP, GP, nth term and sum" },
    { id: 4, name: "Complex Numbers", focus: "Modulus, conjugate and powers of i" },
    { id: 5, name: "Binomial Theorem", focus: "General term, coefficients and coefficient sums" },
    { id: 6, name: "Permutations, Combinations & Probability", focus: "Arrangements, selections and event probability" },
    { id: 7, name: "Matrices & Determinants", focus: "Determinants, inverse and matrix properties" },
    { id: 8, name: "Limits, Continuity & Differentiability", focus: "Standard limits, derivatives and continuity" },
    { id: 9, name: "Integral Calculus", focus: "Indefinite and definite integrals" },
    { id: 10, name: "Coordinate Geometry, Vectors & 3D", focus: "Straight lines, conics, vector products and direction cosines" }
  ]
};

const PHY_BASE = [
  { q: "A body has mass 2 kg and acceleration 3 m/s\u00B2. Find the net force.", options: ["6 N", "5 N", "3 N", "3 N"], ans: "A", exp: "Newton's second law gives F = ma = 2 \u00D7 3 = 6 N." },
  { q: "A particle starts from rest and accelerates uniformly at 3 m/s\u00B2 for 2 s. Its displacement is:", options: ["6 m", "12 m", "3 m", "24 m"], ans: "B", exp: "Using s = ut + \u00BDat\u00B2 with u = 0: s = \u00BD \u00D7 3 \u00D7 (2)\u00B2 = 6 m." },
  { q: "A 4 \u2126 resistor carries a current of 2 A. The potential difference is:", options: ["8 V", "2 V", "6 V", "16 V"], ans: "A", exp: "By Ohm's law, V = IR = 2 \u00D7 4 = 8 V." },
  { q: "A point mass of 5 kg is placed 5 m from an axis. Its moment of inertia is:", options: ["125 kg m\u00B2", "25 kg m\u00B2", "10 kg m\u00B2", "5 kg m\u00B2"], ans: "A", exp: "For a point mass, I = mr\u00B2 = 5 \u00D7 5\u00B2 = 125 kg m\u00B2." },
  { q: "A convex lens has focal length 60 cm. An object is placed at 2f. The image forms at:", options: ["120 cm", "60 cm", "30 cm", "Infinity"], ans: "A", exp: "For an object at 2f of a convex lens, the real image forms at 2f." }
];

const CHM_EASY_BASE = [
  { q: "The number of moles in 18 g of water (molar mass 18 g mol\u207B\u00B9) is:", options: ["1 mol", "0.5 mol", "2 mol", "18 mol"], ans: "A", exp: "n = mass / molar mass = 18 / 18 = 1 mol." },
  { q: "Which quantum number determines the shape of an orbital?", options: ["Azimuthal quantum number (l)", "Principal quantum number (n)", "Magnetic quantum number (m)", "Spin quantum number"], ans: "A", exp: "The azimuthal quantum number l determines the subshell and orbital shape." },
  { q: "Across a period, the general trend in atomic radius is:", options: ["Decreases", "Increases", "Remains constant", "Changes randomly"], ans: "A", exp: "Effective nuclear charge generally increases across a period, pulling electrons closer." },
  { q: "The molecular shape of NH\u2083 is:", options: ["Trigonal pyramidal", "Trigonal planar", "Linear", "Tetrahedral"], ans: "A", exp: "NH\u2083 has three bond pairs and one lone pair; its molecular shape is trigonal pyramidal." },
  { q: "For a first-order reaction, the half-life is:", options: ["0.693/k", "k/0.693", "1/k\u00B2", "2.303k"], ans: "A", exp: "For first-order kinetics, t\u00BD = ln 2 / k = 0.693/k." }
];

const CHM_MED_HARD_BASE = [
  { q: "The number of moles in 36 g of water (molar mass 18 g mol\u207B\u00B9) is:", options: ["2 mol", "1 mol", "4 mol", "36 mol"], ans: "A", exp: "n = mass / molar mass = 36 / 18 = 2 mol." },
  CHM_EASY_BASE[1],
  CHM_EASY_BASE[2],
  CHM_EASY_BASE[3],
  CHM_EASY_BASE[4]
];

const MATH_BASE = [
  { q: "The derivative of x\u00B2 at x=2 is:", options: ["4", "4", "2", "8"], ans: "A", exp: "d(x\u00B2)/dx = 2x; at x=2, the value is 4." },
  { q: "The value of lim(x\u21920) sin x / x is:", options: ["1", "0", "\u22121", "\u221E"], ans: "A", exp: "This standard trigonometric limit equals 1 when x is in radians." },
  { q: "The sum of the first 4 positive integers is:", options: ["10", "16", "6", "8"], ans: "A", exp: "Sum = n(n+1)/2 = 4 \u00D7 5 / 2 = 10." },
  { q: "The determinant of [[a, b], [c, d]] is:", options: ["ad \u2212 bc", "ad + bc", "ab \u2212 cd", "ac \u2212 bd"], ans: "A", exp: "For a 2\u00D72 matrix, determinant = ad \u2212 bc." },
  { q: "If two non-zero vectors are perpendicular, their dot product is:", options: ["0", "1", "\u22121", "Product of magnitudes"], ans: "A", exp: "a \u00B7 b = |a||b| cos \u03B8; for \u03B8 = 90\u00B0, cos \u03B8 = 0." }
];

function getQuestions(sub, chId) {
  let list = [];
  const diffs = ['Easy', 'Medium', 'Hard'];
  for (let d = 0; d < 3; d++) {
    const diff = diffs[d];
    for (let i = 0; i < 5; i++) {
      let b;
      if (sub === 'physics') {
        b = PHY_BASE[i];
      } else if (sub === 'chemistry') {
        b = (d === 0) ? CHM_EASY_BASE[i] : CHM_MED_HARD_BASE[i];
      } else {
        b = MATH_BASE[i];
      }
      list.push({
        num: list.length + 1,
        diff: diff,
        q: b.q,
        options: [...b.options],
        ans: b.ans,
        exp: b.exp
      });
    }
  }
  return list;
}

module.exports = { CHAPTERS, getQuestions };
