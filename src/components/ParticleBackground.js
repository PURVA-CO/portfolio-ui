import { useEffect, useRef } from "react";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────
// ✅ CONFIGURATION — Tweak these to change the effect
// ─────────────────────────────────────────────────────────────
const CONFIG = {
  particleCount: 220, // number of floating dots
  spread: 12, // how spread out particles are (bigger = wider)
  particleSize: 0.04, // dot size
  rotationSpeed: {
    // auto-rotation speed
    y: 0.0004,
    x: 0.0002,
  },
  mouseInfluence: 0.4, // how much camera follows mouse (bigger = more)
  lerpSpeed: 0.05, // smoothness of mouse follow (smaller = smoother)
  colorLight: 0x60a5fa, // particle color in light mode (blue-400)
  colorDark: 0x93c5fd, // particle color in dark mode (blue-300)
};

function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Dimensions ──────────────────────────────────────────
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;

    // ─────────────────────────────────────────────────────────
    // ✅ STEP 1 — The 3 pillars of every Three.js scene
    // ─────────────────────────────────────────────────────────

    // SCENE: the empty 3D world
    const scene = new THREE.Scene();

    // CAMERA: PerspectiveCamera(fov, aspect, near, far)
    // fov=75 → field of view in degrees (human eye ≈ 60-90)
    // aspect → width/height ratio (must match canvas)
    // near/far → only render objects between 0.1 and 1000 units away
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 4; // pull camera back so we can see the scene

    // RENDERER: converts 3D scene → 2D pixels
    // alpha: true → transparent background (so Hero content shows through)
    // antialias: true → smoother edges
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // cap at 2x for perf

    // ─────────────────────────────────────────────────────────
    // ✅ STEP 2 — Build particle system with BufferGeometry
    // One geometry holds ALL particles — much faster than 200 objects
    // ─────────────────────────────────────────────────────────

    const geometry = new THREE.BufferGeometry();

    // Float32Array: typed array for GPU — 3 values per particle (x, y, z)
    const positions = new Float32Array(CONFIG.particleCount * 3);

    for (let i = 0; i < CONFIG.particleCount; i++) {
      // Math.random() - 0.5 → -0.5 to +0.5 → * spread → centered around origin
      positions[i * 3] = (Math.random() - 0.5) * CONFIG.spread; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * CONFIG.spread; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * (CONFIG.spread / 2); // z (shallower)
    }

    // Tell geometry where the positions are
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Detect current theme for particle color
    const isDark = document.documentElement.classList.contains("dark");

    // PointsMaterial: special material just for particle clouds
    const material = new THREE.PointsMaterial({
      color: isDark ? CONFIG.colorDark : CONFIG.colorLight,
      size: CONFIG.particleSize,
      sizeAttenuation: true, // particles farther away appear smaller (realistic)
      transparent: true,
      opacity: 0.75,
    });

    // Points = geometry + material combined into renderable object
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // ─────────────────────────────────────────────────────────
    // ✅ STEP 4 — Mouse tracking (normalized to -1 → +1)
    // ─────────────────────────────────────────────────────────
    const mouse = { x: 0, y: 0 };

    const onMouseMove = (e) => {
      // Convert raw pixel coords to -1/+1 range
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", onMouseMove);

    // ─────────────────────────────────────────────────────────
    // ✅ STEP 3 — Animation loop (render loop)
    // requestAnimationFrame = ~60fps, synced to screen refresh
    // ─────────────────────────────────────────────────────────
    let animationId;

    const animate = () => {
      animationId = requestAnimationFrame(animate); // self-calling loop

      // Auto-rotate the entire particle cloud slowly
      particles.rotation.y += CONFIG.rotationSpeed.y;
      particles.rotation.x += CONFIG.rotationSpeed.x;

      // ✅ LERP — smooth camera follow toward mouse position
      // Formula: current += (target - current) * speed
      // * 0.05 = moves 5% of remaining distance each frame = smooth lag
      camera.position.x +=
        (mouse.x * CONFIG.mouseInfluence - camera.position.x) *
        CONFIG.lerpSpeed;
      camera.position.y +=
        (-mouse.y * CONFIG.mouseInfluence - camera.position.y) *
        CONFIG.lerpSpeed;

      // Always look at scene center
      camera.lookAt(scene.position);

      // Draw current frame
      renderer.render(scene, camera);
    };

    animate(); // kick off the loop

    // ─────────────────────────────────────────────────────────
    // Handle window resize — update camera + renderer dimensions
    // ─────────────────────────────────────────────────────────
    const onResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix(); // must call after changing camera props

      renderer.setSize(width, height);
    };

    window.addEventListener("resize", onResize);

    // ─────────────────────────────────────────────────────────
    // ✅ STEP 5 — CLEANUP (critical for GPU memory)
    // Runs when component unmounts or effect re-runs
    // Without this: GPU memory leak every remount
    // ─────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animationId); // stop render loop
      renderer.dispose(); // free GPU renderer memory
      geometry.dispose(); // free geometry memory
      material.dispose(); // free material memory
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
    };
  }, []); // ← empty = run once on mount only

  // ─────────────────────────────────────────────────────────
  // The canvas sits absolutely behind all Hero content
  // pointer-events: none → mouse clicks pass through to buttons below
  // ─────────────────────────────────────────────────────────
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true" // screen readers ignore decorative canvas
    />
  );
}

export default ParticleBackground;
