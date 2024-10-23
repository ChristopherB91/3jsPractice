import * as THREE from "three";
import { WebGL } from "three/examples/jsm/Addons.js";
import { GLTFLoader, OrbitControls } from "three/examples/jsm/Addons.js";
import { Text } from "troika-three-text";

//                                            Part 1

//                                       CREATING THE SCENE

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  // FOV(field of view) the extent of the scene that is on display.
  // This value is in degrees.
  75,
  // aspect ratio almost always use width divided by height.
  // otherwise the the image looks squished.
  window.innerWidth / window.innerHeight,
  // near clipping plane objects claser than near wont be rendered
  1,
  // far clipping plane objects further than far wont be renderedy
  500
);

const renderer = new THREE.WebGLRenderer();
// using the browser width and height as the size we want it to
// render our app
// for performance intesive apps you set smaller values like
// window.innerWidth/2
renderer.setSize(
  // Width
  window.innerWidth,
  // Height
  window.innerHeight
  // updateStyle the third argument. using it with false will
  // lower the resolution
);

// add renderer element to our HTML document
// canvas element the renderer uses to display the scene to us
document.body.appendChild(renderer.domElement);

//                                        CREATING THE CUBE

// needed to create a cube this object contains all the points(vertices) and fill(faces)
// of the cube
const geometry = new THREE.BoxGeometry(2, 2, 2);
// applies an ovject of properties which will be applied to them.
// colors work the same as in css can use hex colors
const material = new THREE.MeshBasicMaterial({ color: 0x87ceeb });
// object that takes a geometry and applies material to it
// we can then insert to our scene and move freely around
const cube = new THREE.Mesh(geometry, material);
// by default what we add will be added to coordinates (0, 0, 0)
scene.add(cube);
// to avoid camera and cube in side each other move the camera out a bit
camera.position.set(0, 5, 10);
camera.lookAt(0, 3.5, 1);

//                                        RENDERING THE SCENE

// create a loop that cause the render to draw the scene every time the screen is refreshed
// typically 60 times per second
// we could use setInterval but requestAnimationFrame which is internally used in
// WebGlRenderer has a number of advantages like pausing when the user navigates to another
// tab so we do not was processing power and battery life
function animate() {
  // this will run every frame and give the cube a nice rotation animation
  // anything you want to move or change while the app is running has to go through the
  // animation loop.

  // you can call other functions from there so that you don't end up with an animate
  // function that has hundreds of lines
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

// renderer.setAnimationLoop(animate);

cube.visible = false;

//                                            Part 2

//                                     WEBGL COMPATIBILITY CHECK
// some devices do not support WebGL 2 use the following method to check if it is supported
if (WebGL.isWebGL2Available()) {
  animate();
} else {
  const warning = WebGL.getWebGL2ErrorMessage();
  document.getElementById("container").appendChild(warning);
}

//                                         DRAWING LINES
// To draw a line or circle, not a wireframe mesh we have to define a material
// we have use LineBasicMaterial or LineDashedMaterial for lines

const lineMaterial = new THREE.LineBasicMaterial({ color: 0x7f00ff });

// next a goeometry with some vertices

const points = [];

points.push(new THREE.Vector3(-10, 0, 0));
points.push(new THREE.Vector3(0, 10, 0));
points.push(new THREE.Vector3(10, 0, 0));
points.push(new THREE.Vector3(-10, 0, 0));

const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

// lines are drawn between each pair of vertices, but not between the first and last

const line = new THREE.Line(lineGeometry, lineMaterial);

scene.add(line);

line.visible = false;

//                                            Part 3

//                                        LOADING 3D MODELS

// Recommended using glTF (GL Transmission Format) both GLB and GLTF of the format are well
// supported. glTF is focused on runtime asset delivery it is compact to transmit and fast to
// load
// includes meshes, materials, textures, skins, skeletons, morph targets, animations, lights, and cameras

// Link to sketchfab https://skfb.ly/prLB9
// credits to the creator https://www.facebook.com/p/GM25-100042237200164/
// credits - "2022 Porsche 911 GT3 Touring (992)" (https://skfb.ly/prLB9) by Ddiaz Design is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).

// eco house link - https://skfb.ly/prPsz

// import your loader (import { GLTFLoader } from "three/examples/jsm/Addons.js";)
// add a model to your scene syntax varies among different loaders -- when using another format

const loader = new GLTFLoader();
let model;

loader.load(
  `/eco_house_-_3_simple_props/scene.gltf`,
  // `/2022_porsche_911_gt3_touring_992/scene.gltf`,
  function (gltf) {
    model = gltf.scene;
    model.position.set(0, 0, 0);
    model.rotateY(5);
    model.scale.set(1, 1, 1);
    scene.add(model);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

// function ecoAnimate() {
//   if (model) {
//     model.rotation.y += 0.01;
//   }
//   renderer.render(scene, camera);
// }

// renderer.setAnimationLoop(ecoAnimate);

//                                            Part 4

//                                        ORBIT CONTROLS

// add-on OrbitControls allows the camera to orbit the target
// import ObitControls explicitly
const controls = new OrbitControls(camera, renderer.domElement);

// controls.update() must be called after any manual changes to the camera's
// transform

controls.update();

function ecoAnimate() {
  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();
  controls.autoRotate = true;

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(ecoAnimate);

//                                      PLUG-INS/LIBRARIES

// library be used is troika three text
// link - https://github.com/protectwise/troika/tree/main/packages/troika-three-text

// Use npm install troika-three-text to install
// Next import Text from "troika-three-text"

// Create a myText variable
const myText = new Text();
scene.add(myText);

// Set properties to configure

myText.text = "eco_house_model";
myText.fontSize = 0.2;
myText.position.z = 3;
myText.position.y = 4;
myText.position.x = 0;
myText.rotation.y = 0;
myText.fontWeight = "bold";
myText.color = 0x004d25;
myText.outlineColor = 0x9966ff;
