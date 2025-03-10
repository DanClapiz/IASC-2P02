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

// Resizing
window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.aspectRatio = window.innerWidth / window.innerHeight

    // Update Camera
    camera.aspect = sizes.aspectRatio
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/***********
 ** SCENE **
 ***********/
// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('rgb(111, 87, 155)')

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.aspectRatio,
    0.1,
    100
)
scene.add(camera)
camera.position.set(0, 12, -20)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)

//controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/************
 ** LIGHTS **
 ************/
// Directional Light
const directionalLight = new THREE.DirectionalLight(0x404040, 100)
scene.add(directionalLight)

/************
 ** MESHES **
 ************/
// Cube Geometry
const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

const drawCube = (height, color) =>
{
    // create cube material
    const cubeMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(color)
    })

    //Create Cube
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

    // Position Cube
    cube.position.x = (Math.random() - 0.5)*10
    cube.position.z = (Math.random() - 0.5)*10
    cube.position.y = height -10

    // randomize cube rotation
    cube.rotation.x = Math.random() *2 * Math.PI
    cube.rotation.z = Math.random() *2 * Math.PI
    cube.rotation.y = Math.random() *2 * Math.PI

    //add cube to scene
    scene.add(cube)
}

//drawCube(0, 'red')
//drawCube(1, 'green')
//drawCube(2, 'yellow')
//drawCube(3, 'blue')

/********
 ** UI **
*********/
// UI
const ui = new dat.GUI()

/********************
 ** TEXT ANALSYSIS **
 ********************/
// Source text
const sourceText = "This is the story of a little ragdoll cat named Jasmine. When Jasmine was a little kitten she lived in a house filled with other cats that were to be adopted into loving families, she watched cats come and go all the time. One day, a Family of four came into the house looking to buy a cat, the little girl wondered upstairs and as she passed by the cat tree Jasmine was sitting on, she felt a little paw touch her shoulder. From that day on, the little cat and the little girl were inseparable best friends, growing up and growing old along each other's side. The end."

// Variables
let parsedText, tokenizedText

// Parse and Tokenized source text
const tokenizedSourceText = () =>
{
    // strip periods and downcase source text
    parsedText = sourceText.replaceAll(".", "").toLowerCase()

    //tokenized text
    tokenizedText = parsedText.split(/[^\w']+/)
}

// Find SearchTerm in tokenizedText
const findSearchTermInTokenizedText = (term, color) =>
{
    // use a for loop to go through the tokenizedText Array
    for (let i = 0; i<tokenizedText.length; i++)
    {
        // if tokenizedText[i] matches our searchTerm, then draw a cube
        if (tokenizedText[i]=== term){
            // convert i to height, which is between 0 and 20
            const height = (100/tokenizedText.length)*i*0.2

            // call drawCube function 100 times using converted height value
            for(let a =0; a<100; a++)
            {
                drawCube(height, color)
            }
        }
    }
}

tokenizedSourceText()
findSearchTermInTokenizedText("little", "white")
findSearchTermInTokenizedText("jasmine", "pink")
findSearchTermInTokenizedText("cat", "black")

/********************
 ** ANIMATION LOOP **
 ********************/
const clock = new THREE.Clock()

const animation = () =>
{
    // Return elapsedTime
    const elapsedTime = clock.getElapsedTime()

    // Update OrbitContols
    controls.update()

    // Renderer
    renderer.render(scene, camera)

    // Request next frame
    window.requestAnimationFrame(animation)
}

animation()