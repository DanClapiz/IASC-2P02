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
    width: window.innerWidth *0.4,
    height: window.innerHeight,
    aspectRatio: window.innerWidth *0.4/ window.innerHeight
}

/***********
 ** SCENE **
 ***********/
// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()
//scene.background = new THREE.Color('black')

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
    antialias: true,
    alpha: true,
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

// Left leg
const leftgeometry = new THREE.BoxGeometry( 0.5, 1.5, 0.5 ); 
const leftmaterial = new THREE.MeshNormalMaterial(); 
const leftLeg = new THREE.Mesh( leftgeometry, leftmaterial ); 
leftLeg.position.set(7, 0, 0.7)
leftLeg.castShadow = true
scene.add( leftLeg )

//Right leg
const rightGeometry = new THREE.BoxGeometry( 0.5, 1.5, 0.5 ); 
const rightMaterial = new THREE.MeshNormalMaterial(); 
const rightLeg = new THREE.Mesh( rightGeometry, rightMaterial ); 
rightLeg.position.set(7, 0, -1)
rightLeg.castShadow = true
scene.add( rightLeg )

// head
const headGeometry = new THREE.SphereGeometry(0.7)
const headMaterial = new THREE.MeshNormalMaterial()
const head = new THREE.Mesh(headGeometry, headMaterial)
head.position.set(7, 2, 1)
head.castShadow = true

scene.add(head)

// Body
const bodyGeometry = new THREE.CapsuleGeometry(1, 1, 4, 8 )
const bodyMaterial = new THREE.MeshNormalMaterial()
const body = new THREE.Mesh( bodyGeometry, bodyMaterial ) 
body.position.set(9, 1, 0)
body.rotation.x = Math.PI*0.5
body.castShadow = true

scene.add( body )

// Tail 
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
const tailGeometry = new THREE.TubeGeometry( path, 64, 0.2, 8, false)
const tailMaterial = new THREE.MeshNormalMaterial()
const tail = new THREE.Mesh(tailGeometry, tailMaterial)
tail.position.set(7, 0.3, -1.5)
tail.rotation.y = Math.PI*0.3
tail.castShadow = true
scene.add(tail)

// Group
const group = new THREE.Group()
group.add( head )
group.add( body )
group.add( leftLeg)
group.add( rightLeg) 
group.add( tail )

scene.add(group)

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

/********************* 
** DOM INTERACTIONS **
**********************/
const domObject ={
    part: 1,
    firstChange: false,
    secondChange: false,
    thirdChange: false,
    fourthChange: false
}

// part-one
document.querySelector('#part-one').onclick = function(){
    domObject.part = 1
}

// part-two
document.querySelector('#part-two').onclick = function(){
    domObject.part = 2
}

// first-change
document.querySelector('#first-change').onclick = function(){
    domObject.firstChange=true
}

// second-change
document.querySelector('#second-change').onclick = function(){
    domObject.secondChange = true
}

// third-change
document.querySelector('#third-change').onclick = function(){
    domObject.thirdChange = true
}

// fourth-change
document.querySelector('#fourth-change').onclick = function(){
    domObject.fourthChange = true
}

/********
 ** UI **
*********/
// UI
/*
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
    */

/********************
 ** ANIMATION LOOP **
 ********************/
const clock = new THREE.Clock()

const animation = () =>
{
    // Return elapsedTime
    const elapsedTime = clock.getElapsedTime()

    //console.log(camera.position)

    // part-one
    if(domObject.part===1){
        camera.position.set(6, 0, 0)
        camera.lookAt(0, 0, 0)
    }

    //part-two
    if(domObject.part===2){
        camera.position.set(25, 1, 0)
    }

    // first-change
    if(domObject.firstChange)
    {
        group.position.z= (Math.sin(elapsedTime) +0.5)
        
    }

    //second-change
    if(domObject.secondChange)
    {
        group.position.y= (Math.sin(elapsedTime) +0.5)
    }

    //third-change
    if(domObject.thirdChange)
    {
        leftLeg.rotation.z =(Math.sin(elapsedTime) + 1) *2
    }
    

    //fourth-change
    if(domObject.fourthChange)
    {
        head.position.x = elapsedTime
    }

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