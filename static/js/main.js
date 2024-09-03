import * as THREE from 'three';

// Renderizador
const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

// Câmera
const fov = 45;  // Campo de visão
const aspect = w / h;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 200;

// Cena
const scene = new THREE.Scene();

// Terreno (dimensões em metros)
const terrenoLargura = 100;  // 100 metros de largura
const terrenoAltura = 100; // 100 metros de altura
const terrenoForma = new THREE.PlaneGeometry(terrenoLargura, terrenoAltura);
const terrenoMaterial = new THREE.MeshBasicMaterial({ color: 0x808080, side: THREE.DoubleSide });
const terreno = new THREE.Mesh(terrenoForma, terrenoMaterial);
scene.add(terreno);

// Recuos (também em metros)
const recuoFrontal = 5; // recuo frontal de 5 metros
const recuoLateral = 2; // recuo lateral de 2 metros

// Espaço disponível para a edificação após aplicar os recuos
const larguraDisponivel = terrenoLargura - 2 * recuoLateral;
const alturaDisponivel = terrenoAltura - recuoFrontal;

// Taxa de ocupação
let taxaOcupacao = 0.6; // Exemplo: 60% de taxa de ocupação

// Área disponível para edificação
const areaDisponivel = larguraDisponivel * alturaDisponivel;

// Área da edificação de acordo com a taxa de ocupação
const areaEdificacao = areaDisponivel * taxaOcupacao;

// Calculando as novas dimensões da edificação com base na taxa de ocupação
const scaleFactor = Math.sqrt(taxaOcupacao); // Fator de escala para ajustar as dimensões proporcionalmente
const edificacaoLargura = larguraDisponivel * scaleFactor;
const edificacaoAltura = alturaDisponivel * scaleFactor;

// Criando a edificação
const edificacaoForma = new THREE.PlaneGeometry(edificacaoLargura, edificacaoAltura);
const edificacaoMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
const edificacao = new THREE.Mesh(edificacaoForma, edificacaoMaterial);

// Posicionando a edificação dentro do terreno
edificacao.position.x = 0; // centralizado horizontalmente
edificacao.position.y = -((terrenoAltura - edificacaoAltura) / 2) + (recuoFrontal / 2); // ajustando para considerar o recuo frontal

scene.add(edificacao);

// Taxa de permeabilidade (25% do terreno)
const taxaPermeabilidade = 0.15;
const areaPermeavel = terrenoLargura * terrenoAltura * taxaPermeabilidade;

// Dimensões da área permeável
const larguraPermeavel = terrenoLargura; // A largura da área permeável será a largura total do terreno
const alturaPermeavel = terrenoAltura * taxaPermeabilidade; // A altura da área permeável é calculada com base na taxa de permeabilidade

// Função para criar a área permeável
function criarAreaPermeavel(x, y, largura, altura) {
    const permeavelForma = new THREE.PlaneGeometry(largura, altura);
    const permeavelMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
    const permeavel = new THREE.Mesh(permeavelForma, permeavelMaterial);
    permeavel.position.set(x, y, 0);
    return permeavel;
}

// Adicionando a área permeável em várias partes
const divisao = 5; // Número de partes em que a área permeável será dividida
const larguraDivisao = larguraPermeavel / divisao;
const alturaDivisao = alturaPermeavel;

// Adicionar as áreas permeáveis
for (let i = 0; i < divisao; i++) {
    let x = -terrenoLargura / 2 + larguraDivisao * i + larguraDivisao / 2;
    let y = -terrenoAltura / 2 + alturaDivisao / 2;

    // Ajustar a posição para evitar sobreposição com a edificação
    if (x + larguraDivisao / 2 > edificacao.position.x - edificacaoLargura / 2 &&
        x - larguraDivisao / 2 < edificacao.position.x + edificacaoLargura / 2 &&
        y + alturaDivisao / 2 > edificacao.position.y - edificacaoAltura / 2 &&
        y - alturaDivisao / 2 < edificacao.position.y + edificacaoAltura / 2) {
        // Ajustar a posição para evitar sobreposição com a edificação
        y = (edificacao.position.y + edificacaoAltura / 2 + alturaDivisao / 2 + recuoFrontal);
    }
    
    // Criar e adicionar a área permeável
    const permeavel = criarAreaPermeavel(x, y, larguraDivisao, alturaDivisao);
    scene.add(permeavel);
}

// Calculando e logando as áreas
const areaTerreno = terrenoAltura * terrenoLargura;

console.log(`Área do terreno: ${areaTerreno}`);
console.log(`Área ocupada pela edificação: ${areaEdificacao}`);
console.log(`Área permeável: ${areaPermeavel}`);
console.log(`Dimensões da edificação: ${edificacaoLargura} x ${edificacaoAltura}`);
console.log(`Dimensões da área permeável (total): ${larguraPermeavel} x ${alturaPermeavel}`);

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
