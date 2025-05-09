import * as THREE from "three"
import * as dat from "lil-gui"
import {OrbitControls} from "OrbitControls"

console.log(THREE)
console.log(dat)
console.log(OrbitControls)
/***********
 ** SETUP **
 ***********/
// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight
}

/***********
 ** SCENE **
 ***********/
// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('black')

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.aspectRatio,
    0.1,
    100
)
scene.add(camera)
camera.position.set(10, 2, 7.5)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

//controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/************
 ** MESHES **
 ************/

 // Cave
const caveGeometry = new THREE.PlaneGeometry(15.5, 7.5)
const caveMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('white'),
    side: THREE.DoubleSide
})
const cave = new THREE.Mesh(caveGeometry, caveMaterial)
cave.rotation.y = Math.PI*0.5
cave.receiveShadow = true
scene.add(cave)

// Tube 
class CustomSinCurve extends THREE.Curve {

	constructor( scale = 1 ) {
		super();
		this.scale = scale;
	}
    getPoint( t, optionalTarget = new THREE.Vector3() ) {

		const tx = t * 3 - 1.5;
		const ty = Math.sin(Math.PI *t);
		const tz = 0;

		return optionalTarget.set( tx, ty, tz ).multiplyScalar( this.scale );
	}
}
const path = new CustomSinCurve ( 1 )
const tubeGeometry = new THREE.TubeGeometry( path, 64, 0.2, 8, false)
const tubeMaterial = new THREE.MeshNormalMaterial()
const tube = new THREE.Mesh(tubeGeometry, tubeMaterial)
tube.position.set(6, -1, 0)
tube.rotation.y = Math.PI*0.5
tube.castShadow = true
scene.add(tube)

// Left Sphere
const leftsphereGeometry = new THREE.SphereGeometry(0.5)
const leftsphereMaterial = new THREE.MeshNormalMaterial()
const leftSphere = new THREE.Mesh(leftsphereGeometry, leftsphereMaterial)
leftSphere.position.set(6, 1.5, 1)
leftSphere.castShadow = true

scene.add(leftSphere)

// Right Sphere
const rightsphereGeometry = new THREE.SphereGeometry(0.5)
const rightsphereMaterial = new THREE.MeshNormalMaterial()
const rightSphere = new THREE.Mesh(rightsphereGeometry, rightsphereMaterial)
rightSphere.position.set(6, 1.5, -1)
rightSphere.castShadow = true

scene.add(rightSphere)

/************
 ** LIGHTS **
 ************/
// Ambient Lights 
//const ambientLight = new THREE. AmbientLight(0x404040)
//scene.add(ambientLight)

// Directional Light
const directionalLight = new THREE.DirectionalLight(
    new THREE.Color('white'),
    0.5
)
scene.add(directionalLight)
directionalLight.position.set(20, 4.1, 0)
directionalLight.target = cave
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024

// Directional Light Helper
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
//scene.add(directionalLightHelper)

/********
 ** UI **
*********/
// UI
const ui = new dat.GUI()

const lightPositionFolder = ui.addFolder('Light Position')

lightPositionFolder
    .add(directionalLight.position,'y')
    .min(-10)
    .max(10)
    .step(0.1)
    .name('Y')

lightPositionFolder
    .add(directionalLight.position,'z')
    .min(-10)
    .max(10)
    .step(0.1)
    .name('Z')
/********************
 ** ANIMATION LOOP **
 ********************/
const clock = new THREE.Clock()

const animation = () =>
{
    // Return elapsedTime
    const elapsedTime = clock.getElapsedTime()

    // Animate Objects

    // Update directionalLightHelper
    directionalLightHelper.update()

    // Update OrbitContols
    controls.update()

    // Renderer
    renderer.render(scene, camera)

    // Request next frame
    window.requestAnimationFrame(animation)
}

animation()