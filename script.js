// Configuración básica de Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Luz ambiental
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Luz direccional
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Crear cubos para representar proyectos
const projects = [
  { name: "Proyecto 1", color: 0xff5733 },
  { name: "Proyecto 2", color: 0x33ff57 },
  { name: "Proyecto 3", color: 0x3357ff },
];

projects.forEach((project, index) => {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: project.color });
  const cube = new THREE.Mesh(geometry, material);

  // Posicionar los cubos en círculo
  const angle = (index / projects.length) * Math.PI * 2;
  cube.position.x = Math.cos(angle) * 5;
  cube.position.z = Math.sin(angle) * 5;

  cube.name = project.name; // Asignar nombre al cubo
  scene.add(cube);
});

// Posición inicial de la cámara
camera.position.z = 10;

// Animación y rotación
function animate() {
  requestAnimationFrame(animate);

  // Rotar los cubos
  scene.children.forEach((child) => {
    if (child instanceof THREE.Mesh) {
      child.rotation.x += 0.01;
      child.rotation.y += 0.01;
    }
  });

  renderer.render(scene, camera);
}

// Detectar clics en los cubos
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click", (event) => {
  // Normalizar coordenadas del ratón
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Calcular intersecciones
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;
    alert(`Haz clic en: ${clickedObject.name}`);
  }
});

// Manejar redimensionamiento de la ventana
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Iniciar animación
animate();