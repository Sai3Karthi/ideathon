import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';
import TWEEN from 'https://cdnjs.cloudflare.com/ajax/libs/tween.js/18.6.4/tween.esm.min.js';
// Import GLTFLoader
import { GLTFLoader } from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, model, raycaster, mouse, hoveredSegment = null;

// Scene Setup
function init() {
    scene = new THREE.Scene();

    // Set background color for the sky
    scene.background = new THREE.Color(0x87CEEB); // Light sky blue color

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Ambient Lighting - Increase intensity for brighter lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    // Directional Lighting - Increase intensity and adjust position
    const light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(2, 6, 10).normalize();
    scene.add(light);

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Load 3D Model
    const loader = new GLTFLoader();
    loader.load('ideathonindia.glb', function(gltf) {
        model = gltf.scene;
        model.scale.set(4.4, 4.4, 4);
        model.position.set(4, 0.9, -1);
        model.rotation.set(13.8, 0, 0);

        scene.add(model);

        // Slight zoom in when the page loads
        camera.position.z = 20;
        camera.position.y=0;
        camera.position.x=100;
        let zoomInTween = new TWEEN.Tween(camera.position)
            .to({ x: 0, y:0, z: 15 }, 2000) // Zoom to z = 15 over 2 seconds
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();

        animate();
    }, undefined, function(error) {
        console.error('An error happened while loading the model:', error);
    });

    // Set initial camera position
    camera.position.z = 20;

}

function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    renderer.render(scene, camera);
}

// Handle mouse movement (for hovering)
function onMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const hoveredObject = intersects[0].object;

        if (hoveredObject !== hoveredSegment) {
            // Reset the scale of the previously hovered segment
            if (hoveredSegment) {
                new TWEEN.Tween(hoveredSegment.scale)
                    .to({ x: 1, y: 1, z: 1}, 300) // Smooth reset to original scale
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .start();
            }

            // Highlight the new hovered segment
            if (["1", "2", "3", "4", "5", "6"].includes(hoveredObject.name)) {
                new TWEEN.Tween(hoveredObject.scale)
                    .to({ x: 1.2, y: 1.2, z: 1.2 }, 300) // Smooth scale up by 20%
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .start();
                hoveredSegment = hoveredObject;
            }
        }
    } else {
        // Reset the scale when the mouse is not over any segment
        if (hoveredSegment) {
            new TWEEN.Tween(hoveredSegment.scale)
                .to({ x: 1, y: 1, z: 1 }, 300) // Smooth reset to original scale
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();
            hoveredSegment = null;
        }
    }
}

// Handle click interaction
function onDocumentClick(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;

        if (["1", "2", "3", "4", "5", "6"].includes(clickedObject.name)) {
            // Calculate the target position for the camera relative to the clicked object
            const clickedPosition = new THREE.Vector3().setFromMatrixPosition(clickedObject.matrixWorld);
            const direction = new THREE.Vector3().subVectors(camera.position, clickedPosition).normalize();
            const targetPosition = clickedPosition.add(direction.multiplyScalar(5)); // Adjust the scalar for zoom level

            // Tween to move the camera towards the clicked object
            new TWEEN.Tween(camera.position)
                .to({ x: targetPosition.x, y: targetPosition.y, z: targetPosition.z }, 1000) // 1 second zoom
                .easing(TWEEN.Easing.Quadratic.Out)
                .onComplete(function () {
                    // Redirect after animation completes
                    switch (clickedObject.name) {
                        case '1':
                            window.location.href = 'http://example.com/page1';
                            break;
                        case '2':
                            window.location.href = 'http://example.com/page2';
                            break;
                        case '3':
                            window.location.href = 'http://example.com/page3';
                            break;
                        case '4':
                            window.location.href = 'http://example.com/page4';
                            break;
                        case '5':
                            window.location.href = 'http://example.com/page5';
                            break;
                        case '6':
                            window.location.href = 'http://example.com/page6';
                            break;
                    }
                })
                .start();
        }
    }
}

window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('click', onDocumentClick, false);

// Handle window resize
window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

init();
