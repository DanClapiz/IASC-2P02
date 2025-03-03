import * as THREE from "three"

/***********
 ** SCENE **
 ***********/
// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('rgb(255, 28, 191)')

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
)
scene.add(camera)
camera.position.set(0, 0, 5)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)

/************
 ** MESHES **
 ************/
// testSphere
const sphereGeometry = new THREE.SphereGeometry(1)
const sphereMaterial = new THREE.MeshNormalMaterial()
const testSphere = new THREE.Mesh(sphereGeometry, sphereMaterial)

scene.add(testSphere)
testSphere.position.set(0, 0, 0)

// testBox
const boxGeometry = new THREE.BoxGeometry(1)
const boxMaterial = new THREE.MeshNormalMaterial()
const testBox = new THREE.Mesh(boxGeometry, boxMaterial)

scene.add(testBox)
testBox.position.set(0, 0, 0)

/********************
 ** ANIMATION LOOP **
 ********************/
const clock = new THREE.Clock()

const animation = () =>
{
    // Return elapsedTime
    const elapsedTime = clock.getElapsedTime()

    // Animate testSphere
    testSphere.position.y = Math.sin(elapsedTime)

    //Scale Spheer
    //testSphere.scale.x=1
    //testSphere.scale.y=1
    //testSphere.scale.z=1

    // Animate testBox
    testBox.position.x = Math.sin(elapsedTime)
    testBox.position.z = Math.sin(2*elapsedTime)
    
    // Renderer
    renderer.render(scene, camera)

    // Request next frame
    window.requestAnimationFrame(animation)
}

animation()