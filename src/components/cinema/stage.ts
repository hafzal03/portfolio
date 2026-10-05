import * as THREE from "three";

/**
 * The opening sequence, in six acts driven entirely by scroll position.
 *
 *   I    the machine holds in the dark
 *   II   it separates — head, shoulders, then the chest plate swinging aside
 *   III  the camera moves through the gap the chest left and reads the core
 *   IV   components thin into particles; the network forms around them
 *   V    the network flattens into a computational grid
 *   VI   the grid condenses into a GPU, which opens: cores, memory, interconnect
 *
 * Two rules the choreography is built on:
 *
 *   Nothing is ever hidden by moving the camera away from it. Components
 *   vacate the camera's path before the camera travels down it, so the move
 *   reads as deliberate rather than as collision avoidance.
 *
 *   The camera is never inside a solid. Its distance from the origin has a
 *   floor while any body geometry is still at scale, and the interior act
 *   approaches from above-front, through the opening the chest plate made.
 *
 * Built from primitives on purpose: a model good enough to justify its file
 * size would outweigh the whole rest of the page.
 */

export interface StageQuality {
  low: boolean;
  reduce: boolean;
}

export interface Stage {
  render(progress: number, elapsed: number): void;
  resize(width: number, height: number, dpr: number): void;
  dispose(): void;
}

interface Part {
  object: THREE.Object3D;
  rest: THREE.Vector3;
  drift: THREE.Vector3;
  spin: THREE.Vector3;
  /** 0 = releases first (head), 1 = releases last (pelvis). */
  order: number;
}

const smooth = (t: number) => t * t * (3 - 2 * t);
const span = (v: number, a: number, b: number) => Math.min(1, Math.max(0, (v - a) / (b - a)));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export function createStage(canvas: HTMLCanvasElement, quality: StageQuality): Stage | null {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !quality.low,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x04060b, 0.085);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 120);

  const disposables: { dispose(): void }[] = [];
  const track = <T extends { dispose(): void }>(x: T): T => {
    disposables.push(x);
    return x;
  };

  // ── Materials ────────────────────────────────────────────────────────────
  const shell = track(
    new THREE.MeshStandardMaterial({ color: 0x0e1218, metalness: 0.96, roughness: 0.33 })
  );
  const shellDark = track(
    new THREE.MeshStandardMaterial({ color: 0x070a0f, metalness: 0.9, roughness: 0.5 })
  );
  const accent = track(
    new THREE.MeshStandardMaterial({
      color: 0x0a0f16,
      emissive: 0x5ad1ff,
      emissiveIntensity: 1.5,
      metalness: 0.6,
      roughness: 0.25,
    })
  );
  const coreMat = track(new THREE.MeshBasicMaterial({ color: 0xbdefff }));
  const silicon = track(
    new THREE.MeshStandardMaterial({ color: 0x0b1017, metalness: 0.85, roughness: 0.42 })
  );
  const dieMat = track(
    new THREE.MeshStandardMaterial({
      color: 0x0d141d,
      metalness: 0.7,
      roughness: 0.3,
      emissive: 0x18496b,
      emissiveIntensity: 0.6,
    })
  );
  const memMat = track(
    new THREE.MeshStandardMaterial({ color: 0x121922, metalness: 0.8, roughness: 0.45 })
  );

  // ── Light ────────────────────────────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0x0b1119, 0.55));

  const key = new THREE.DirectionalLight(0x9cc4ff, 0.85);
  key.position.set(-3.4, 3.0, 4.2);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0xffc98a, 3.6);
  rim.position.set(3.8, 1.6, -3.2);
  scene.add(rim);

  const rimCool = new THREE.DirectionalLight(0x7fb4ff, 1.6);
  rimCool.position.set(-3.6, 0.8, -2.6);
  scene.add(rimCool);

  const corePoint = new THREE.PointLight(0x5ad1ff, 2.4, 6.5, 2);
  corePoint.position.set(0, 0.95, 0.1);
  scene.add(corePoint);

  // ── Act I–III: the machine ───────────────────────────────────────────────
  const body = new THREE.Group();
  body.scale.setScalar(1.35);
  scene.add(body);

  const parts: Part[] = [];
  const add = (
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    position: [number, number, number],
    drift: [number, number, number],
    order: number,
    rotation?: [number, number, number]
  ) => {
    track(geometry);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    if (rotation) mesh.rotation.set(...rotation);
    body.add(mesh);
    parts.push({
      object: mesh,
      rest: mesh.position.clone(),
      drift: new THREE.Vector3(...drift),
      spin: new THREE.Vector3(
        (Math.random() - 0.5) * 1.3,
        (Math.random() - 0.5) * 1.3,
        (Math.random() - 0.5) * 1.3
      ),
      order,
    });
    return mesh;
  };

  const seg = quality.low ? 1 : 2;

  // Head group releases first, straight up and back.
  add(new THREE.IcosahedronGeometry(0.26, seg), shell, [0, 1.4, 0], [0.15, 1.15, -0.5], 0);
  add(new THREE.BoxGeometry(0.3, 0.028, 0.02), accent, [0, 1.42, 0.232], [0.2, 1.25, -0.3], 0.03);
  add(new THREE.CylinderGeometry(0.07, 0.09, 0.16, 12), shellDark, [0, 1.19, 0], [0, 0.9, -0.7], 0.08);

  // Shoulders and arms: outward, clearing the sides of the frame.
  for (const side of [-1, 1]) {
    add(new THREE.SphereGeometry(0.17, 14, 12), shell, [side * 0.56, 0.95, 0], [side * 1.7, 0.35, -0.2], 0.2);
    add(
      new THREE.CapsuleGeometry(0.085, 0.42, 4, 10),
      shellDark,
      [side * 0.62, 0.56, 0],
      [side * 2.0, 0.0, -0.45],
      0.3,
      [0, 0, side * 0.12]
    );
    add(
      new THREE.CapsuleGeometry(0.07, 0.4, 4, 10),
      shell,
      [side * 0.69, 0.06, 0.02],
      [side * 2.3, -0.3, -0.2],
      0.4,
      [0, 0, side * 0.2]
    );
    add(new THREE.BoxGeometry(0.1, 0.1, 0.1), accent, [side * 0.58, 0.95, 0.12], [side * 1.9, 0.6, 0.1], 0.24);
  }

  // The chest plate swings DOWN and to the side rather than toward the viewer:
  // the camera travels through the space it vacates, so it can never occlude.
  const chestPlate = add(
    new THREE.BoxGeometry(0.86, 0.72, 0.1),
    shell,
    [0, 0.72, 0.21],
    [-1.25, -0.72, 0.55],
    0.12
  );
  add(new THREE.BoxGeometry(0.78, 0.88, 0.42), shellDark, [0, 0.66, -0.02], [0.25, -0.1, -1.35], 0.45);
  add(new THREE.IcosahedronGeometry(0.1, seg), coreMat, [0, 0.72, 0.02], [0, 0.12, 0.08], 0.95);
  add(new THREE.TorusGeometry(0.21, 0.015, 8, 32), accent, [0, 0.72, 0.06], [0.1, 0.25, 0.5], 0.8);

  // Internal computation, only visible once the plate is away: a stack of
  // boards behind the core that reads as the inside of the machine.
  for (let i = 0; i < 3; i++) {
    add(
      new THREE.BoxGeometry(0.5 - i * 0.08, 0.02, 0.26),
      dieMat,
      [0, 0.92 - i * 0.2, -0.04],
      [0.1 + i * 0.3, -0.2, -0.8],
      0.6 + i * 0.05
    );
  }

  for (let i = 0; i < 3; i++) {
    add(
      new THREE.TorusGeometry(0.17 - i * 0.012, 0.022, 7, 20),
      shellDark,
      [0, 0.2 - i * 0.17, -0.05],
      [0.15, -0.95 - i * 0.25, -0.55],
      0.75 + i * 0.05,
      [Math.PI / 2, 0, 0]
    );
  }
  add(new THREE.BoxGeometry(0.62, 0.26, 0.38), shellDark, [0, -0.28, 0], [0, -1.5, -0.5], 1);

  // ── Ambient motes ────────────────────────────────────────────────────────
  const motes = quality.low ? 450 : 1300;
  const motePos = new Float32Array(motes * 3);
  for (let i = 0; i < motes; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 0.9 + Math.random() * 3.6;
    motePos[i * 3] = Math.cos(a) * r;
    motePos[i * 3 + 1] = (Math.random() - 0.3) * 3.8;
    motePos[i * 3 + 2] = Math.sin(a) * r * 0.7;
  }
  const moteGeo = track(new THREE.BufferGeometry());
  moteGeo.setAttribute("position", new THREE.BufferAttribute(motePos, 3));
  const moteMat = track(
    new THREE.PointsMaterial({
      color: 0x7fb4e6,
      size: 0.018,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  const moteField = new THREE.Points(moteGeo, moteMat);
  scene.add(moteField);

  // ── Act IV–V: network, which then flattens into a grid ───────────────────
  // Every node holds two positions: where it sits in the network, and where it
  // sits once the network becomes a regular computational lattice. Act V is a
  // straight interpolation between them, so the grid is visibly the same
  // material reorganised rather than a different object fading in.
  const cols = quality.low ? 10 : 14;
  const rows = quality.low ? 5 : 7;
  const nodeCount = cols * rows;
  const netPos = new Float32Array(nodeCount * 3);
  const gridPos = new Float32Array(nodeCount * 3);
  const live = new Float32Array(nodeCount * 3);

  for (let i = 0; i < nodeCount; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);
    const layer = Math.floor((c / cols) * 6);
    const a = (i / nodeCount) * Math.PI * 11;
    netPos[i * 3] = -1.9 + layer * 0.76 + (Math.random() - 0.5) * 0.22;
    netPos[i * 3 + 1] = 0.75 + Math.sin(a) * (0.45 + Math.random() * 0.6);
    netPos[i * 3 + 2] = Math.cos(a) * (0.4 + Math.random() * 0.5);

    gridPos[i * 3] = (c / (cols - 1) - 0.5) * 4.6;
    gridPos[i * 3 + 1] = 0.55;
    gridPos[i * 3 + 2] = (r / (rows - 1) - 0.5) * 2.6;
  }
  live.set(netPos);

  const nodeGeo = track(new THREE.BufferGeometry());
  nodeGeo.setAttribute("position", new THREE.BufferAttribute(live, 3));
  const nodeMat = track(
    new THREE.PointsMaterial({
      color: 0xa8e8ff,
      size: 0.05,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  const nodeCloud = new THREE.Points(nodeGeo, nodeMat);
  scene.add(nodeCloud);

  // Links are rebuilt from the live positions each frame they are visible, so
  // they follow the nodes through the network → grid change.
  const pairs: [number, number][] = [];
  for (let i = 0; i < nodeCount; i++) {
    const c = i % cols;
    if (c < cols - 1) pairs.push([i, i + 1]);
    if (i + cols < nodeCount && Math.random() > 0.45) pairs.push([i, i + cols]);
    if (c < cols - 1 && i + cols + 1 < nodeCount && Math.random() > 0.72) pairs.push([i, i + cols + 1]);
  }
  const linkArr = new Float32Array(pairs.length * 6);
  const linkGeo = track(new THREE.BufferGeometry());
  linkGeo.setAttribute("position", new THREE.BufferAttribute(linkArr, 3));
  const linkMat = track(
    new THREE.LineBasicMaterial({
      color: 0x4e9fd8,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  const links = new THREE.LineSegments(linkGeo, linkMat);
  scene.add(links);

  // ── Act VI: the GPU ──────────────────────────────────────────────────────
  // A package that opens into the three things that actually matter in one:
  // the die and its compute cores, the memory beside it, and the interconnect
  // carrying data between them.
  const gpu = new THREE.Group();
  gpu.position.set(0, 0.55, 0);
  gpu.visible = false;
  scene.add(gpu);

  const substrate = new THREE.Mesh(track(new THREE.BoxGeometry(3.3, 0.08, 1.9)), silicon);
  gpu.add(substrate);

  const dieGroup = new THREE.Group();
  gpu.add(dieGroup);
  const die = new THREE.Mesh(track(new THREE.BoxGeometry(1.5, 0.1, 1.1)), dieMat);
  dieGroup.add(die);

  // Compute cores: a regular array on the die, which lights in sweeps.
  const coreCols = quality.low ? 6 : 9;
  const coreRows = quality.low ? 4 : 6;
  const coreGeo = track(new THREE.BoxGeometry(0.11, 0.03, 0.11));
  const coreMesh = new THREE.InstancedMesh(coreGeo, accent, coreCols * coreRows);
  coreMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const dummy = new THREE.Object3D();
  const coreCells: { x: number; z: number; phase: number }[] = [];
  for (let i = 0; i < coreCols * coreRows; i++) {
    const c = i % coreCols;
    const r = Math.floor(i / coreCols);
    const x = (c / (coreCols - 1) - 0.5) * 1.24;
    const z = (r / (coreRows - 1) - 0.5) * 0.86;
    coreCells.push({ x, z, phase: c / coreCols });
    dummy.position.set(x, 0.07, z);
    dummy.updateMatrix();
    coreMesh.setMatrixAt(i, dummy.matrix);
  }
  dieGroup.add(coreMesh);

  // Memory stacks either side of the die.
  const memGroups: THREE.Group[] = [];
  for (const side of [-1, 1]) {
    const g = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const m = new THREE.Mesh(track(new THREE.BoxGeometry(0.34, 0.12, 0.42)), memMat);
      m.position.set(side * 1.08, 0.08, (i - 1) * 0.52);
      g.add(m);
    }
    gpu.add(g);
    memGroups.push(g);
  }

  // Interconnect: traces from the die out to each memory stack.
  const tracePts: number[] = [];
  for (const side of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      tracePts.push(side * 0.75, 0.06, (i - 1) * 0.3, side * 1.0, 0.06, (i - 1) * 0.52);
    }
  }
  const traceGeo = track(new THREE.BufferGeometry());
  traceGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(tracePts), 3));
  const traceMat = track(
    new THREE.LineBasicMaterial({ color: 0x5ad1ff, transparent: true, opacity: 0.5 })
  );
  gpu.add(new THREE.LineSegments(traceGeo, traceMat));

  const gpuLight = new THREE.PointLight(0x5ad1ff, 0, 7, 2);
  gpuLight.position.set(0, 1.2, 0);
  scene.add(gpuLight);

  // ── Act VII: computation becomes systems ─────────────────────────────────
  // The interconnect keeps going past the edge of the package: long horizontal
  // runs with short ticks along them, which read as data paths, API routes and
  // the lines of a system rather than as circuitry. They arrive as the GPU
  // settles and stay as the ambient backdrop the written content sits on.
  const pathPts: number[] = [];
  const runs = quality.low ? 14 : 26;
  for (let i = 0; i < runs; i++) {
    const y = 0.2 + (i / runs) * 2.4 + (Math.random() - 0.5) * 0.12;
    const z = -1.6 + Math.random() * 3.2;
    const x0 = -5.5 - Math.random() * 2;
    const x1 = 5.5 + Math.random() * 2;
    pathPts.push(x0, y, z, x1, y, z);

    // Ticks: the short marks that make a line read as carrying something.
    const ticks = 2 + Math.floor(Math.random() * 3);
    for (let t = 0; t < ticks; t++) {
      const tx = x0 + (x1 - x0) * (0.15 + Math.random() * 0.7);
      pathPts.push(tx, y, z, tx + 0.22, y, z + 0.16);
    }
  }
  const pathGeo = track(new THREE.BufferGeometry());
  pathGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pathPts), 3));
  const pathMat = track(
    new THREE.LineBasicMaterial({
      color: 0x4e9fd8,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  const paths = new THREE.LineSegments(pathGeo, pathMat);
  paths.visible = false;
  scene.add(paths);

  // ── Frame ────────────────────────────────────────────────────────────────
  const lookAt = new THREE.Vector3();
  const camPos = new THREE.Vector3(0, 0.95, 5.0);
  const linkPositions = linkGeo.getAttribute("position") as THREE.BufferAttribute;
  const nodePositions = nodeGeo.getAttribute("position") as THREE.BufferAttribute;

  const render = (progress: number, elapsed: number) => {
    const p = quality.reduce ? 0.04 : Math.min(1, Math.max(0, progress));

    // Act weights. They overlap: each act is well under way before the one
    // before it has finished, which is what keeps it reading as one move.
    const apart = smooth(span(p, 0.14, 0.44)); // II  separation
    const interior = smooth(span(p, 0.36, 0.56)); // III the camera goes in
    const dissolve = smooth(span(p, 0.5, 0.66)); // IV  parts become particles
    const netIn = smooth(span(p, 0.44, 0.64)); // IV  network appears
    const toGrid = smooth(span(p, 0.64, 0.78)); // V   network flattens
    const gpuIn = smooth(span(p, 0.78, 0.9)); // VI  the GPU condenses
    const gpuOpen = smooth(span(p, 0.88, 1.0)); // VI  and opens

    const breath = quality.reduce ? 0 : Math.sin(elapsed * 0.9) * 0.012;

    // Components: stagger by release order, then thin out rather than cut.
    for (const part of parts) {
      const local = Math.min(1, Math.max(0, (apart - part.order * 0.3) / (1 - part.order * 0.3)));
      const eased = smooth(local);
      part.object.position.set(
        part.rest.x + part.drift.x * eased,
        part.rest.y + part.drift.y * eased + breath * (1 - eased),
        part.rest.z + part.drift.z * eased
      );
      part.object.rotation.x += part.spin.x * 0.0012 * eased;
      part.object.rotation.y += part.spin.y * 0.0012 * eased;
      part.object.rotation.z += part.spin.z * 0.0012 * eased;
      const s = Math.max(0.0001, 1 - dissolve * 0.95);
      part.object.scale.setScalar(s);
      part.object.visible = dissolve < 0.985;
    }
    // The plate also swings as it leaves, so it reads as hinged rather than
    // detached and slid.
    chestPlate.rotation.z = -apart * 0.9;
    chestPlate.rotation.x = apart * 0.35;

    body.rotation.y = quality.reduce
      ? -0.22
      : -0.22 + Math.sin(elapsed * 0.16) * 0.05 + apart * 0.35;
    body.visible = dissolve < 0.985;

    corePoint.intensity = 2.4 + apart * 4.5 + interior * 3.0 - dissolve * 7.5;
    moteField.rotation.y = elapsed * 0.012 + p * 0.5;
    moteMat.opacity = 0.5 + apart * 0.35 - gpuIn * 0.35;

    // Network → grid: one set of points moving between two arrangements.
    const showNet = Math.max(0, netIn - gpuIn);
    if (showNet > 0.001) {
      for (let i = 0; i < nodeCount; i++) {
        const k = i * 3;
        live[k] = mix(netPos[k], gridPos[k], toGrid);
        live[k + 1] = mix(netPos[k + 1], gridPos[k + 1], toGrid);
        live[k + 2] = mix(netPos[k + 2], gridPos[k + 2], toGrid);
      }
      nodePositions.needsUpdate = true;

      for (let i = 0; i < pairs.length; i++) {
        const [a, b] = pairs[i];
        const o = i * 6;
        linkArr[o] = live[a * 3];
        linkArr[o + 1] = live[a * 3 + 1];
        linkArr[o + 2] = live[a * 3 + 2];
        linkArr[o + 3] = live[b * 3];
        linkArr[o + 4] = live[b * 3 + 1];
        linkArr[o + 5] = live[b * 3 + 2];
      }
      linkPositions.needsUpdate = true;
    }
    nodeMat.opacity = showNet * 0.95;
    linkMat.opacity = showNet * 0.45;
    nodeCloud.visible = links.visible = showNet > 0.001;
    nodeCloud.rotation.y = links.rotation.y = mix(-0.1 + p * 0.5, 0, toGrid);

    // GPU: rises out of the grid, then opens.
    gpu.visible = gpuIn > 0.001;
    if (gpu.visible) {
      gpu.scale.setScalar(mix(0.2, 1, gpuIn));
      gpu.rotation.y = mix(0.9, 0.34, gpuIn) - gpuOpen * 0.22;
      gpu.rotation.x = mix(0.5, 0.16, gpuIn);
      // The package separates: die lifts, memory moves outward.
      dieGroup.position.y = gpuOpen * 0.78;
      memGroups[0].position.x = -gpuOpen * 0.62;
      memGroups[1].position.x = gpuOpen * 0.62;
      memGroups.forEach((g, i) => {
        g.position.y = gpuOpen * 0.12 * (i + 1);
      });
      traceMat.opacity = 0.2 + gpuOpen * 0.65;
      gpuLight.intensity = gpuIn * 2.2 + gpuOpen * 2.5;

      // Compute cores light in sweeps across the die — the one place in the
      // sequence that should read as work being done.
      const wave = (elapsed * 0.35) % 1;
      for (let i = 0; i < coreCells.length; i++) {
        const cell = coreCells[i];
        let d = cell.phase - wave;
        d -= Math.floor(d + 0.5);
        const lit = Math.exp(-d * d * 60);
        dummy.position.set(cell.x, 0.07 + lit * 0.03, cell.z);
        dummy.scale.setScalar(0.85 + lit * 0.5);
        dummy.updateMatrix();
        coreMesh.setMatrixAt(i, dummy.matrix);
      }
      coreMesh.instanceMatrix.needsUpdate = true;
    } else {
      gpuLight.intensity = 0;
    }

    // Act VII: the system lines arrive as the hardware recedes, and drift
    // slowly afterwards so the backdrop is never completely still.
    const toSystems = smooth(span(p, 0.9, 1.0));
    paths.visible = toSystems > 0.001;
    if (paths.visible) {
      pathMat.opacity = toSystems * 0.4;
      paths.position.x = ((elapsed * 0.05) % 2) - 1;
      paths.rotation.y = -0.12;
      // The package dims as the software layer takes over from it.
      traceMat.opacity *= 1 - toSystems * 0.5;
      gpuLight.intensity *= 1 - toSystems * 0.45;
    }

    // ── Camera ─────────────────────────────────────────────────────────────
    // Authored as positions per act and blended, with a floor on how close it
    // may come to the body while the body is still solid.
    let x: number, y: number, z: number;
    let lx = 0;
    let ly = 0.8;
    const lz = 0;

    if (quality.reduce) {
      x = 0;
      y = 0.95;
      z = 5.0;
      lx = -0.6;
    } else {
      // I → II: push in and arc to the side so the separation is read in
      // three-quarter view rather than flat on.
      const arc = apart * 0.8;
      x = mix(0, Math.sin(arc) * 2.6, 1) - 0.1;
      y = mix(0.95, 1.35, apart);
      z = mix(5.0, 3.0, apart);
      lx = mix(-0.78, 0, apart);

      // III: in through the opening the chest left, from above-front.
      x = mix(x, 0.35, interior);
      y = mix(y, 1.25, interior);
      z = mix(z, 1.55, interior);
      ly = mix(0.8, 0.95, interior);

      // IV → V: back out to see the network, then rise over the grid.
      x = mix(x, 0.2, netIn);
      y = mix(y, 1.1, netIn);
      z = mix(z, 4.6, netIn);
      y = mix(y, 2.4, toGrid);
      z = mix(z, 4.2, toGrid);
      ly = mix(ly, 0.55, toGrid);

      // VI: settle in front of the package, then drop to its level as it opens
      // so the camera looks between the layers rather than down on them.
      x = mix(x, 0.0, gpuIn);
      y = mix(y, 1.9, gpuIn);
      z = mix(z, 3.6, gpuIn);
      x = mix(x, -0.5, gpuOpen);
      y = mix(y, 0.95, gpuOpen);
      z = mix(z, 2.5, gpuOpen);
      ly = mix(ly, 0.75, gpuIn);

      // Never closer to the body than this while the body is still solid.
      const solid = 1 - dissolve;
      const floor = mix(1.1, 1.75, solid);
      const planar = Math.hypot(x, z);
      if (solid > 0.02 && planar < floor) {
        const k = floor / Math.max(planar, 0.0001);
        x *= k;
        z *= k;
      }

      x += Math.sin(elapsed * 0.08) * 0.07 * (1 - gpuOpen);
      y += Math.sin(elapsed * 0.11) * 0.04 * (1 - gpuOpen);
    }

    camPos.set(x, y, z);
    camera.position.copy(camPos);
    lookAt.set(lx, ly, lz);
    camera.lookAt(lookAt);

    renderer.render(scene, camera);
  };

  const resize = (width: number, height: number, dpr: number) => {
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(1, height);
    camera.updateProjectionMatrix();
  };

  const dispose = () => {
    coreMesh.dispose();
    disposables.forEach((d) => d.dispose());
    scene.clear();
    renderer.dispose();
  };

  return { render, resize, dispose };
}
