import * as THREE from 'three';
  //Renderizador
  const w = window.innerWidth;
  const h = window.innerHeight;
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(w, h);
  document.body.appendChild(renderer.domElement);

  // Câmera
  const fov = 75;
  const aspect = w / h;
  const near = 0.1;
  const far = 10;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 4;

  // Cena
  const scene = new THREE.Scene();

  // Terreno
  const terrenoLargura = 3;  // largura
  const terrenoAltura = 2; // altura
  const terrenoForma = new THREE.PlaneGeometry(terrenoLargura, terrenoAltura);
  const terrenoMaterial = new THREE.MeshBasicMaterial({ color: 0x808080, side: THREE.DoubleSide });
  const terreno = new THREE.Mesh(terrenoForma, terrenoMaterial);
  scene.add(terreno);

  let taxaOcupacao = prompt("Digite a % da taxa de ocupação (apenas números)")/100;

  const areaTerreno = terrenoAltura * terrenoLargura;
  const areaEdificacao = areaTerreno * taxaOcupacao; // Calculando taxa de ocupação

  // Find new dimensions that give the desired flat area
  // We use square root to scale both dimensions equally
  const scaleFactor = Math.sqrt(taxaOcupacao); // Square root of 0.5
  const edificacaoLargura = terrenoLargura * scaleFactor;
  const edificacaoAltura = terrenoAltura * scaleFactor;

  const edificacaoForma = new THREE.PlaneGeometry(edificacaoLargura, edificacaoAltura);
  const edificacaoMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
  const edificacao = new THREE.Mesh(edificacaoForma, edificacaoMaterial);

  scene.add(edificacao);

  // Calculate and log the areas
  console.log(`Área do terreno: ${areaTerreno}`);
  console.log(`Área ocupada: ${edificacaoLargura * edificacaoAltura}`);

  // Animation loop
  function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
  }
  animate();

  // Handle window resize
  window.addEventListener('resize', () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
  });