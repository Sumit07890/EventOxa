// EventOxa 3D Rotating Vendor Icons Globe (Three.js)

export function initThreeGlobe(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const devicePixelRatio = window.devicePixelRatio || 1;
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(devicePixelRatio);
  container.appendChild(renderer.domElement);

  const points = [];
  const pointCount = 12;
  const icons = ['📷', '🍽', '🎵', '🎤', '💄', '🎉', '🏛', '🎥', '💼', '🎈', '🍰', '💍'];

  const group = new THREE.Group();
  scene.add(group);

  for (let i = 0; i < pointCount; i++) {
    const phi = Math.acos(-1 + (2 * i) / pointCount);
    const theta = Math.sqrt(pointCount * Math.PI) * phi;
    
    const x = 2.5 * Math.cos(theta) * Math.sin(phi);
    const y = 2.5 * Math.sin(theta) * Math.sin(phi);
    const z = 2.5 * Math.cos(phi);
    
    // Create text sprite for icons
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.font = '80px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icons[i % icons.length], 64, 64);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    sprite.position.set(x, y, z);
    sprite.scale.set(0.8, 0.8, 1);
    
    group.add(sprite);
    points.push(sprite.position);
  }

  // Create connection lines
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.3 });
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      if (points[i].distanceTo(points[j]) < 4.0) {
        const geometry = new THREE.BufferGeometry().setFromPoints([points[i], points[j]]);
        const line = new THREE.Line(geometry, lineMaterial);
        group.add(line);
      }
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    group.rotation.y += 0.002;
    group.rotation.x += 0.001;
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', () => {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  animate();
}
