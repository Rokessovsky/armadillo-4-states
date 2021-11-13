// Setup the renderer
// You should look into js/setup.js to see what exactly is done here.
const { renderer, canvas } = setup();

// Uniforms - Pass these into the appropriate vertex and fragment shader files
const spherePosition = { type: 'v3', value: new THREE.Vector3(0.0, 0.0, 0.0) };
const tangentDirection = { type: 'v3', value: new THREE.Vector3(0.5, 0.0, 1.0) };

const ambientColor = { type: 'c', value: new THREE.Color(0.0, 0.0, 1.0) };
const diffuseColor = { type: 'c', value: new THREE.Color(0.0, 1.0, 1.0) };
const specularColor = { type: 'c', value: new THREE.Color(1.0, 1.0, 1.0) };
const lightColor = { type: 'c', value: new THREE.Color(1.0, 1.0, 1.0) };
const toonColor = { type: 'c', value: new THREE.Color(1.0, 0.8, 0.4) };
const toonColor2 = { type: 'c', value: new THREE.Color(0.8, 0.1, 0.35) };
const outlineColor = { type: 'c', value: new THREE.Color(0.0, 0.0, 0.0) };

const kAmbient = { type: "f", value: 0.3 };
const kDiffuse = { type: "f", value: 0.6 };
const kSpecular = { type: "f", value: 1.0 };
const shininess = { type: "f", value: 10.0 };
const ticks = { type: "f", value: 0.0 };

const sphereLight = new THREE.PointLight(0xffffff, 1, 300);


// Shader materials
const sphereMaterial = new THREE.ShaderMaterial({
  uniforms: {
    spherePosition: spherePosition
  }
});

const phongMaterial = new THREE.ShaderMaterial({
  uniforms: {
    spherePosition: spherePosition,
    ambientColor: ambientColor,
    diffuseColor: diffuseColor,
    specularColor: specularColor,
    kAmbient: kAmbient,
    kDiffuse: kDiffuse,
    kSpecular: kSpecular,
    shininess: shininess,
  }
});

const toonMaterial = new THREE.ShaderMaterial({
  uniforms: {
    spherePosition: spherePosition,
    toonColor: toonColor,
    toonColor2: toonColor2,
    outlineColor: outlineColor
  }
});

const dotsMaterial = new THREE.ShaderMaterial({
  uniforms: {
    ticks: ticks
  }
});


//Load the chest's various textures using THREE.TextureLoader().load
const chestAlbedo = new THREE.TextureLoader().load("texture/chest_albedo.png");
const chestMetalness = new THREE.TextureLoader().load("texture/chest_metallic.png");
const chestNormal = new THREE.TextureLoader().load("texture/chest_normal.png");
const chestRoughness = new THREE.TextureLoader().load("texture/chest_roughness.png");

//Three.JS's implementation of PBR. Supports various types of texture mapping.
const chestMaterialPbr = new THREE.MeshStandardMaterial({
  color: 0xFFFFFF,
  map: chestAlbedo,  //The chests albedo map. Replace null with the correct texture 
  metalnessMap: chestMetalness,//The chests metallic map. Replace null with the correct texture 
  normalMap: chestNormal,//The chests normal map.  Replace null with the correct texture 
  roughnessMap: chestRoughness, // The chests roughness map.  Replace null with the correct texture 
  metalness: 1 //Enables metallic-ness which is defaulted to 0.0
});

// Load shaders
const shaderFiles = [
  'glsl/sphere.vs.glsl',
  'glsl/sphere.fs.glsl',
  'glsl/phong.vs.glsl',
  'glsl/phong.fs.glsl',
  'glsl/toon.vs.glsl',
  'glsl/toon.fs.glsl',
  'glsl/dots.vs.glsl',
  'glsl/dots.fs.glsl',
];

new THREE.SourceLoader().load(shaderFiles, function (shaders) {
  sphereMaterial.vertexShader = shaders['glsl/sphere.vs.glsl'];
  sphereMaterial.fragmentShader = shaders['glsl/sphere.fs.glsl'];

  phongMaterial.vertexShader = shaders['glsl/phong.vs.glsl'];
  phongMaterial.fragmentShader = shaders['glsl/phong.fs.glsl'];

  toonMaterial.vertexShader = shaders['glsl/toon.vs.glsl'];
  toonMaterial.fragmentShader = shaders['glsl/toon.fs.glsl'];

  dotsMaterial.vertexShader = shaders['glsl/dots.vs.glsl'];
  dotsMaterial.fragmentShader = shaders['glsl/dots.fs.glsl'];
});

// Define the shader modes
const shaders = {
  PHONG: { key: 0, material: phongMaterial },
  TOON: { key: 1, material: toonMaterial },
  DOTS: { key: 2, material: dotsMaterial },
  PBR: { key: 3, material: chestMaterialPbr },
};

let mode = shaders.DOTS.key; // Default

// Set up scenes
let scenes = [];
for (let shader of Object.values(shaders)) {
  // Create the scene
  const { scene, camera, worldFrame } = createScene(canvas);

  // Create the main sphere geometry (light source)
  // https://threejs.org/docs/#api/en/geometries/SphereGeometry
  const sphereGeometry = new THREE.SphereGeometry(1.0, 32.0, 32.0);
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.set(0.0, 1.5, 0.0);
  sphere.parent = worldFrame;
  scene.add(sphere);

  if (shader.material == chestMaterialPbr) {//Load a chest instead of the armadillo for this scene
    loadAndPlaceOBJ('obj/Chest.obj', chestMaterialPbr, function (chest) {
      chest.position.set(0, -8, -14);
      chest.rotation.y = 0;
      chest.scale.set(20, 20, 20);
      scene.add(chest);
    });

    loadAndPlaceOBJ('obj/armadillo.obj', shaders.PHONG.material, function (armadillo) {
      armadillo.position.set(0.0, 0.0, -20.0);
      armadillo.rotation.y = Math.PI;
      armadillo.scale.set(10, 10, 10);
      armadillo.parent = worldFrame;
      scene.add(armadillo);
    });
    
    scene.add(sphereLight);
  }else{
    loadAndPlaceOBJ('obj/armadillo.obj', shader.material, function (armadillo) {
      armadillo.position.set(0.0, 0.0, -10.0);
      armadillo.rotation.y = Math.PI;
      armadillo.scale.set(10, 10, 10);
      armadillo.parent = worldFrame;
      scene.add(armadillo);
    });
  }


  scenes.push({ scene, camera });
}



// Listen to keyboard events.
const keyboard = new THREEx.KeyboardState();
function checkKeyboard() {
  if (keyboard.pressed("1"))
    mode = shaders.PHONG.key;
  else if (keyboard.pressed("2"))
    mode = shaders.TOON.key;
  else if (keyboard.pressed("3"))
    mode = shaders.DOTS.key;
  else if (keyboard.pressed("4"))
      mode = shaders.PBR.key;

  if (keyboard.pressed("W"))
    spherePosition.value.z -= 0.3;
  else if (keyboard.pressed("S"))
    spherePosition.value.z += 0.3;

  if (keyboard.pressed("A"))
    spherePosition.value.x -= 0.3;
  else if (keyboard.pressed("D"))
    spherePosition.value.x += 0.3;

  if (keyboard.pressed("E"))
    spherePosition.value.y -= 0.3;
  else if (keyboard.pressed("Q"))
    spherePosition.value.y += 0.3;

    
  sphereLight.position.set(spherePosition.value.x, spherePosition.value.y, spherePosition.value.z);

  // The following tells three.js that some uniforms might have changed
  sphereMaterial.needsUpdate = true;
  phongMaterial.needsUpdate = true;
  chestMaterialPbr.needsUpdate = true;
  toonMaterial.needsUpdate = true;
  dotsMaterial.needsUpdate = true;
}

// clock = THREE.Clock;

// Setup update callback
function update() {
  checkKeyboard();
  ticks.value += 1 / 100.0;

  // Requests the next update call, this creates a loop
  requestAnimationFrame(update);
  const { scene, camera } = scenes[mode];
  renderer.render(scene, camera);
}

// Start the animation loop.
update();
