import * as THREE from 'three';

// ── Sextant ────────────────────────────────────────────────────────────────
// An instrument of sighting: a graduated limb, an index arm, two mirrors, a
// telescope and shade glasses on a machined display post. Reading a position
// out of noise — measured, not guessed.

const RAD = (d) => (d * Math.PI) / 180;
const PX = (r, d) => Math.cos(RAD(d)) * r;
const PY = (r, d) => Math.sin(RAD(d)) * r;

const RO = 0.202;      // outer radius of the limb
const RI = 0.168;      // inner radius of the limb band
const A0 = -118;       // limb start angle (degrees, apex at origin)
const A1 = -62;        // limb end angle
const DEPTH = 0.014;   // frame thickness

function frameGeometry() {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.lineTo(PX(RO, A0), PY(RO, A0));
  s.absarc(0, 0, RO, RAD(A0), RAD(A1), false);
  s.lineTo(0, 0);

  const apexIn = [0, -0.03];
  const hole = (from, to) => {
    const p = new THREE.Path();
    p.moveTo(apexIn[0], apexIn[1]);
    p.lineTo(PX(RI, from), PY(RI, from));
    p.absarc(0, 0, RI, RAD(from), RAD(to), false);
    p.lineTo(apexIn[0], apexIn[1]);
    return p;
  };
  s.holes.push(hole(A0 + 6, -91.6), hole(-88.4, A1 - 6));

  const g = new THREE.ExtrudeGeometry(s, {
    depth: DEPTH,
    curveSegments: 64,
    bevelEnabled: true,
    bevelThickness: 0.0012,
    bevelSize: 0.0012,
    bevelSegments: 2,
  });
  g.translate(0, 0, -DEPTH / 2);
  return g;
}

export function buildSextant() {
  const root = new THREE.Group();
  root.name = 'sextant';

  const brass = new THREE.MeshStandardMaterial({
    name: 'laiton', color: 0xbfae86, roughness: 0.34, metalness: 0.4,
  });
  const platine = new THREE.MeshStandardMaterial({
    name: 'platine', color: 0xc9cdc6, roughness: 0.28, metalness: 0.4,
  });
  const ink = new THREE.MeshStandardMaterial({
    name: 'ebene', color: 0x131f19, roughness: 0.45, metalness: 0.12,
  });
  const mirror = new THREE.MeshStandardMaterial({
    name: 'miroir', color: 0xdfe6e1, roughness: 0.06, metalness: 0.42,
  });
  const glass = new THREE.MeshStandardMaterial({
    name: 'verre_signal', color: 0x4fa587, roughness: 0.12, metalness: 0.25,
    emissive: 0x1b4536, emissiveIntensity: 0.7,
  });

  // ── Instrument (built in the XY plane, extruded along Z) ──
  const inst = new THREE.Group();
  inst.name = 'instrument';

  const frame = new THREE.Mesh(frameGeometry(), brass);
  frame.name = 'frame';
  inst.add(frame);

  // Graduated limb: ticks every 2°, every fifth struck long and in signal.
  const ticks = new THREE.Group();
  ticks.name = 'graduations';
  for (let i = 0; i <= 28; i++) {
    const d = A0 + 2 + (i * (A1 - A0 - 4)) / 28;
    const major = i % 5 === 0;
    const len = major ? 0.019 : 0.0095;
    const t = new THREE.Mesh(
      new THREE.BoxGeometry(len, 0.0016, major ? 0.0075 : 0.0045),
      major ? platine : platine,
    );
    t.name = major ? `graduation_major_${i}` : `graduation_${i}`;
    const r = RO - len / 2 - 0.0015;
    t.position.set(PX(r, d), PY(r, d), DEPTH / 2 + 0.0012);
    t.rotation.z = RAD(d);
    ticks.add(t);
  }
  inst.add(ticks);

  // Arc rail the index arm rides on.
  const railShape = new THREE.Shape();
  railShape.absarc(0, 0, RO - 0.006, RAD(A0 + 1), RAD(A1 - 1), false);
  railShape.absarc(0, 0, RO - 0.0125, RAD(A1 - 1), RAD(A0 + 1), true);
  const rail = new THREE.Mesh(
    new THREE.ExtrudeGeometry(railShape, { depth: 0.006, curveSegments: 64, bevelEnabled: false }),
    platine,
  );
  rail.name = 'limb_rail';
  rail.position.z = -DEPTH / 2 - 0.006;
  inst.add(rail);

  // ── Index arm ──
  const armAngle = -79;
  const arm = new THREE.Group();
  arm.name = 'index_arm';

  const armShape = new THREE.Shape();
  armShape.moveTo(-0.014, 0.011);
  armShape.lineTo(RO - 0.004, 0.0085);
  armShape.lineTo(RO - 0.004, -0.0085);
  armShape.lineTo(-0.014, -0.011);
  armShape.lineTo(-0.02, 0);
  const armMesh = new THREE.Mesh(
    new THREE.ExtrudeGeometry(armShape, { depth: 0.009, bevelEnabled: false }),
    platine,
  );
  armMesh.name = 'index_arm_bar';
  armMesh.position.z = -0.0045;
  arm.add(armMesh);

  const pivot = new THREE.Mesh(new THREE.CylinderGeometry(0.019, 0.019, 0.02, 48), brass);
  pivot.name = 'index_pivot';
  pivot.rotation.x = Math.PI / 2;
  arm.add(pivot);
  const pivotCap = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.026, 32), platine);
  pivotCap.name = 'pivot_cap';
  pivotCap.rotation.x = Math.PI / 2;
  arm.add(pivotCap);

  // Micrometer drum + clamp at the limb end.
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.0165, 0.0165, 0.017, 44), brass);
  drum.name = 'micrometer_drum';
  drum.rotation.z = Math.PI / 2;
  drum.position.set(RO - 0.028, -0.019, 0);
  arm.add(drum);
  for (let i = 0; i < 24; i++) {
    const f = new THREE.Mesh(new THREE.BoxGeometry(0.0022, 0.017, 0.0034), platine);
    f.name = `drum_flute_${i}`;
    const a = (i / 24) * Math.PI * 2;
    f.position.set(RO - 0.028, -0.019 + Math.sin(a) * 0.0165, Math.cos(a) * 0.0165);
    f.rotation.x = -a;
    f.rotation.z = Math.PI / 2;
    arm.add(f);
  }
  const clampScrew = new THREE.Mesh(new THREE.CylinderGeometry(0.0055, 0.0055, 0.034, 24), platine);
  clampScrew.name = 'clamp_screw';
  clampScrew.rotation.x = Math.PI / 2;
  clampScrew.position.set(RO - 0.055, 0, 0);
  arm.add(clampScrew);

  const index = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.004, 0.0035), glass);
  index.name = 'index_mark';
  index.position.set(RO - 0.0085, 0, DEPTH / 2 + 0.002);
  arm.add(index);

  // Index mirror rides the arm, perpendicular to the frame plane.
  const mirrorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.052, 0.038), brass);
  mirrorFrame.name = 'index_mirror_frame';
  mirrorFrame.position.set(0, 0.006, 0);
  mirrorFrame.rotation.y = RAD(-18);
  arm.add(mirrorFrame);
  const indexMirror = new THREE.Mesh(new THREE.BoxGeometry(0.0022, 0.044, 0.03), mirror);
  indexMirror.name = 'index_mirror';
  indexMirror.position.set(0.0052, 0.006, 0);
  indexMirror.rotation.y = RAD(-18);
  arm.add(indexMirror);

  arm.rotation.z = RAD(armAngle);
  inst.add(arm);

  // ── Horizon mirror on the left leg ──
  const horizonAt = [PX(0.128, A0 + 3.5), PY(0.128, A0 + 3.5)];
  const hFrame = new THREE.Mesh(new THREE.BoxGeometry(0.0075, 0.04, 0.034), brass);
  hFrame.name = 'horizon_mirror_frame';
  hFrame.position.set(horizonAt[0], horizonAt[1], 0);
  hFrame.rotation.y = RAD(26);
  inst.add(hFrame);
  const hMirror = new THREE.Mesh(new THREE.BoxGeometry(0.002, 0.033, 0.027), mirror);
  hMirror.name = 'horizon_mirror';
  hMirror.position.set(horizonAt[0] + 0.005, horizonAt[1], 0.001);
  hMirror.rotation.y = RAD(26);
  inst.add(hMirror);

  // ── Shade glasses, on their own pivots between the mirrors ──
  const shades = new THREE.Group();
  shades.name = 'shades';
  for (let i = 0; i < 3; i++) {
    const g = new THREE.Group();
    g.name = `shade_${i}`;
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.0018, 0.03, 0.024), glass);
    plate.name = `shade_glass_${i}`;
    const ring = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.034, 0.028), brass);
    ring.name = `shade_frame_${i}`;
    g.add(ring, plate);
    plate.position.x = 0.0015;
    g.position.set(-0.036 - i * 0.013, -0.052 - i * 0.004, 0);
    g.rotation.y = RAD(30 - i * 22);
    shades.add(g);
  }
  inst.add(shades);

  // ── Telescope, sighting through the horizon mirror ──
  const scope = new THREE.Group();
  scope.name = 'telescope';
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.0115, 0.0135, 0.088, 40), brass);
  barrel.name = 'scope_barrel';
  barrel.rotation.z = Math.PI / 2;
  scope.add(barrel);
  const eyepiece = new THREE.Mesh(new THREE.CylinderGeometry(0.0095, 0.0095, 0.02, 32), ink);
  eyepiece.name = 'eyepiece';
  eyepiece.rotation.z = Math.PI / 2;
  eyepiece.position.x = 0.052;
  scope.add(eyepiece);
  const objective = new THREE.Mesh(new THREE.CylinderGeometry(0.0145, 0.0145, 0.009, 32), platine);
  objective.name = 'objective_ring';
  objective.rotation.z = Math.PI / 2;
  objective.position.x = -0.047;
  scope.add(objective);
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.0118, 0.0118, 0.0022, 32), glass);
  lens.name = 'objective_lens';
  lens.rotation.z = Math.PI / 2;
  lens.position.x = -0.0513;
  scope.add(lens);
  const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.03, 0.01), brass);
  bracket.name = 'scope_bracket';
  bracket.position.set(0.012, 0.018, 0);
  scope.add(bracket);
  scope.position.set(horizonAt[0] - 0.022, horizonAt[1] + 0.008, 0.034);
  scope.rotation.y = RAD(-6);
  inst.add(scope);

  const scopeRiser = new THREE.Mesh(new THREE.BoxGeometry(0.013, 0.03, 0.026), brass);
  scopeRiser.name = 'scope_riser';
  scopeRiser.position.set(horizonAt[0] - 0.004, horizonAt[1] - 0.004, 0.019);
  inst.add(scopeRiser);

  // ── Handle, on the back of the frame ──
  const profile = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    const y = -0.06 + t * 0.12;
    const r = 0.0135 + Math.sin(t * Math.PI) * 0.0065 - Math.pow(Math.abs(t - 0.5) * 2, 6) * 0.005;
    profile.push(new THREE.Vector2(Math.max(0.006, r), y));
  }
  const grip = new THREE.Mesh(new THREE.LatheGeometry(profile, 48), ink);
  grip.name = 'handle_grip';
  grip.position.set(-0.004, -0.1, -0.052);
  grip.rotation.x = RAD(8);
  inst.add(grip);
  const bracketYs = [-0.04, -0.162];
  for (let i = 0; i < 2; i++) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.012, 0.052), brass);
    b.name = `handle_bracket_${i}`;
    b.position.set(-0.004, bracketYs[i], -0.027);
    inst.add(b);
  }

  inst.position.y = 0.055;
  inst.rotation.x = RAD(-9);
  root.add(inst);

  // ── Display post + base ──
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.09, 0.014, 96), ink);
  base.name = 'base';
  base.position.y = -0.235;
  root.add(base);
  const baseRing = new THREE.Mesh(new THREE.TorusGeometry(0.0845, 0.0035, 16, 128), platine);
  baseRing.name = 'base_ring';
  baseRing.rotation.x = Math.PI / 2;
  baseRing.position.y = -0.229;
  root.add(baseRing);
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.0075, 0.0105, 0.115, 32), platine);
  post.name = 'post';
  post.position.set(0, -0.171, -0.012);
  root.add(post);
  const cradle = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.011, 0.03), platine);
  cradle.name = 'cradle';
  cradle.position.set(0, -0.114, -0.014);
  cradle.rotation.x = RAD(-9);
  root.add(cradle);

  // Rest the whole object on y = 0, centred in x/z.
  const box = new THREE.Box3().setFromObject(root);
  const c = box.getCenter(new THREE.Vector3());
  root.position.set(-c.x, -box.min.y, -c.z);

  const out = new THREE.Group();
  out.name = 'sextant_display';
  out.add(root);
  return out;
}
