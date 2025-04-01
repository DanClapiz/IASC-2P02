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
camera.position.set(0, 12, -40)

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
// geometries
const drawShape = (height, params, geometryType) =>{
    let geometry
    switch (geometryType) {
        case "sphere":
            geometry = new THREE.SphereGeometry(0.5, 16, 16)
            break;
        case "tetrahedron":
            geometry = new THREE.TetrahedronGeometry(0.5)
            break;
        default:
            geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
    }

    // create material
    let material
    if(params.lerp){
    const baseColor = new THREE.Color(params.color)
    const targetColor = new THREE.Color(0x888888)
    baseColor.lerp(targetColor, Math.min(height * 0.05, 1))

    material = new THREE.MeshStandardMaterial({
        color: baseColor
    })
    }else{
        material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(params.color)
    })
    }

    //Create mesh
    const mesh = new THREE.Mesh(geometry, material)

    //scale cube
    mesh.scale.x = params.scale
    mesh.scale.y = params.scale
    mesh.scale.z = params.scale

    if(params.dynamicScale)
    {
        mesh.scale.x = height*-0.09
        mesh.scale.z = height*-0.09
        mesh.scale.y = height*-0.09
    }

    // Position Cube
    mesh.position.x = (Math.random() - 0.5)*params.diameter
    mesh.position.z = (Math.random() - 0.5)*params.diameter
    mesh.position.y = height -10

    // randomize cube 
    if( params.randomized==true){
        mesh.rotation.x = Math.random() *2 * Math.PI
        mesh.rotation.z = Math.random() *2 * Math.PI
        mesh.rotation.y = Math.random() *2 * Math.PI
    }

    //add cube to scene
    params.group.add(mesh)  
}


/********
 ** UI **
*********/
// UI
const ui = new dat.GUI()

let preset = {}

// groups 
const group1= new THREE.Group()
scene.add(group1)
const group2= new THREE.Group()
scene.add(group2)
const group3= new THREE.Group()
scene.add(group3)

const uiObj = {
    sourceText: "here is my source text",
    saveSourceText(){
        saveSourceText()
    },
    term1:{
        term:'beauty',
        color: '#ffffff',
        lerp: false,
        dynamicScale: true,
        group: group1,
        diameter: 10,
        nCubes: 50,
        randomized: true,
        scale: 1,
    },
    term2:{
        term:'black',
        color: '#000000',
        lerp: true,
        dynamicScale: false,
        group: group2,
        diameter: 10,
        nCubes: 50,
        randomized: true,
        scale: 1.5,
    },
    term3:{
        term:'knees',
        color: '#ff0000',
        lerp: false,
        dynamicScale: false,
        group: group3,
        diameter: 10,
        nCubes: 50,
        randomized: true,
        scale: 4,
    },
    saveTerms() {
        saveTerms()
    },
    rotateCamera: false
}

// ui funct
const saveSourceText = () =>
{
    //UI
    preset = ui.save()
    textFolder.hide()
    termsFolder.show()
    visualizeFolder.show()

    // text analysis
    tokenizedSourceText(uiObj.sourceText)
}

const saveTerms = () =>
{
    // ui
    preset = ui.save()
    visualizeFolder.hide()
    cameraFolder.show()

    //Text analysis
    findSearchTermInTokenizedText(uiObj.term1, "sphere")
    findSearchTermInTokenizedText(uiObj.term2, "cube")
    findSearchTermInTokenizedText(uiObj.term3, "tetrahedron")
}

//Text Folder
const textFolder = ui.addFolder("Source Text")

textFolder
    .add(uiObj, 'sourceText')
    .name("Source Text")

textFolder
    .add(uiObj, 'saveSourceText')
    .name("save")

// terms and vis and camera folder
const termsFolder = ui.addFolder("Search Terms")
const visualizeFolder = ui.addFolder("Visualize")
const cameraFolder = ui.addFolder("Camera")

termsFolder
    .add(uiObj.term1, 'term')
    .name("Term 1")

termsFolder
    .add(group1, 'visible')
    .name("Term 1 Visibility")

termsFolder
    .addColor(uiObj.term1, 'color')
    .name("Term 1 Color")

termsFolder
    .add(uiObj.term2, 'term')
    .name("Term 2")

termsFolder
    .add(group2, 'visible')
    .name("Term 2 Visability")

termsFolder
    .addColor(uiObj.term2, 'color')
    .name("Term 2 Color")

termsFolder
    .add(uiObj.term3, 'term')
    .name("Term 3")

termsFolder
    .add(group3, 'visible')
    .name("Term 3 Visability")

termsFolder
    .addColor(uiObj.term3, 'color')
    .name("Term 3 Color")


visualizeFolder
    .add(uiObj, 'saveTerms')
    .name("Visualize")

cameraFolder
    .add(uiObj, 'rotateCamera')
    .name("Turntable")
//terms and vis are hidden
termsFolder.hide()
visualizeFolder.hide()
cameraFolder.hide()

/********************
 ** TEXT ANALSYSIS **
 ********************/

// Variables
let parsedText, tokenizedText

// Parse and Tokenized source text
const tokenizedSourceText = (sourceText) =>
{
    // strip periods and downcase source text
    parsedText = sourceText.replaceAll(".", "").toLowerCase()

    //tokenized text
    tokenizedText = parsedText.split(/[^\w']+/)
}

// Find SearchTerm in tokenizedText
const findSearchTermInTokenizedText = (params, geometryType) =>
{
    // use a for loop to go through the tokenizedText Array
    for (let i = 0; i<tokenizedText.length; i++)
    {
        // if tokenizedText[i] matches our searchTerm, then draw a shape
        if (tokenizedText[i]=== params.term){
            // convert i to height, which is between 0 and 20
            const height = (50/ tokenizedText.length) *i*0.5

            // call drawshape function 100 times using converted height value
            for(let a =0; a< params.nCubes; a++)
            {
                drawShape(height, params, geometryType)
            }
        }
    }
}


//findSearchTermInTokenizedText("little", "white")
//findSearchTermInTokenizedText("jasmine", "pink")
//findSearchTermInTokenizedText("cat", "black")

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

    // rotate cam
    if(uiObj.rotateCamera)
    {
        camera.position.x = Math.sin(elapsedTime*0.1)*20
        camera.position.z = Math.sin(elapsedTime*0.1)*20
        camera.position.y = 5
        camera.lookAt(0,0,0)
    }

    // grow and shrink group 3
    group3.children.forEach(mesh => {
    const scaleFactor = 1+0.5 *Math.sin(elapsedTime * 2) 
    mesh.scale.set(scaleFactor, scaleFactor, scaleFactor)
    })

    // Renderer
    renderer.render(scene, camera)

    // Request next frame
    window.requestAnimationFrame(animation)
}

animation()