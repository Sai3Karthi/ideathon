import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';
import TWEEN from 'https://cdnjs.cloudflare.com/ajax/libs/tween.js/18.6.4/tween.esm.min.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, model, raycaster, mouse, hoveredSegment = null;

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(2, 6, 10).normalize();
    scene.add(light);

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    const loader = new GLTFLoader();
    loader.load('PLAIN.glb', function(gltf) {
        model = gltf.scene;
        model.scale.set(4.4, 4.4, 4);
        model.position.set(4, 0.9, -1);
        model.rotation.set(13.8, 0, 0);
        scene.add(model);

        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            document.getElementById('header').style.display = 'flex';
        }, 3000);

        camera.position.z = 20;
        camera.position.y = 0;
        camera.position.x = 100;
        let zoomInTween = new TWEEN.Tween(camera.position)
            .to({ x: 0, y: 0, z: 15 }, 2000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();

        animate();
    }, undefined, function(error) {
        console.error('An error happened while loading the model:', error);
    });

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

    const infoContainer = document.getElementById('info-container');

    if (intersects.length > 0) {
        const hoveredObject = intersects[0].object;

        if (hoveredObject !== hoveredSegment) {
            if (hoveredSegment) {
                new TWEEN.Tween(hoveredSegment.scale)
                    .to({ x: 1, y: 1, z: 1 }, 300)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .start();

                document.getElementById(`text-${hoveredSegment.name}`).classList.remove('show');
            }

            if (["1", "2", "3", "4", "5", "6"].includes(hoveredObject.name)) {
                new TWEEN.Tween(hoveredObject.scale)
                    .to({ x: 1.2, y: 1.2, z: 1.2 }, 300)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .start();
                hoveredSegment = hoveredObject;

                const textElement = document.getElementById(`text-${hoveredSegment.name}`);
                textElement.style.left = `${event.clientX}px`;
                textElement.style.top = `${event.clientY}px`;
                textElement.classList.add('show');

                // Update info container text based on the hovered segment
                switch (hoveredSegment.name) {
                    case '1':
                        infoContainer.innerHTML = 'Region: North<br><br>Current Population: 173 million<br><br>The Birthplace of Civilization and Empires: Uncover the ancient roots of the Indian subcontinent in the fertile plains of the North. Explore the history of the Indus Valley Civilization, the Mauryan and Gupta Empires, and the rich cultural heritage that shaped early Indian history';
                        break;
                    case '2':
                        infoContainer.innerHTML = "Region: West<br><br>Current Population: 123 million<br><br>Trade and Conquest: The Western Gateway: Delve into the history of ancient trade routes, maritime powers, and the rise of formidable kingdoms like the Marathas. This region has seen the interplay of various cultures, from ancient traders to colonial forces, leaving a profound impact on India's history.";
                        break;
                    case '3':
                        infoContainer.innerHTML = "Region: Central<br><br>Current Population: 85 million<br><br>The Heartland of Dynasties: Journey through the heart of India, where mighty empires like the Mughals and the Rajputs ruled. Discover the blend of architectural marvels, spiritual traditions, and the rich tapestry of cultures that flourished in this central hub.";
                        break;
                    case '4':
                        infoContainer.innerHTML = "Region: East<br><br>Current Population: 102 million<br><br>Cradle of Eastern Wisdom: Step into the eastern lands, where spirituality and knowledge blossomed. From the ancient university of Nalanda to the spread of Buddhism, this region has been a center of learning and cultural exchange for centuries";
                        break;
                    case '5':
                        infoContainer.innerHTML = "Region: South<br><br>Current Population: 143 million<br><br>The Southern Kingdoms: A Legacy of Arts and Temples: Explore the rich  culture, the grandeur of the Chola and Vijayanagara empires, and the intricate temple architecture that dots the southern landscape. This region is a treasure trove of classical music, dance, and ancient traditions.";
                        break;
                    case '6':
                        infoContainer.innerHTML = "Region: North-East<br><br>Current Population: 45 million<br><br>The Mystical Northeast: A Blend of Cultures and Nature: Discover the rich and diverse heritage of the northeastern states, where unique tribal traditions, ancient kingdoms, and untouched natural beauty converge. This region's history is as vibrant as its landscapes, with a blend of cultures that is truly unique.";
                        break;
                }
                infoContainer.style.opacity = '1';
            }
        }
    } else {
        if (hoveredSegment) {
            new TWEEN.Tween(hoveredSegment.scale)
                .to({ x: 1, y: 1, z: 1 }, 300)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();

            document.getElementById(`text-${hoveredSegment.name}`).classList.remove('show');
            hoveredSegment = null;
        }

        // Hide info container when not hovering over a region
        infoContainer.style.opacity = '0';
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
            const targetPosition = clickedPosition.add(direction.multiplyScalar(2)); // Adjust the scalar for zoom level

            // Define target rotation angles (for example)
            const targetRotationX = Math.PI / 4; // Rotate around X-axis (change as needed) // Rotate around Y-axis (change as needed)

            // Tween to move the camera towards the clicked object and rotate it
            new TWEEN.Tween(camera.position)
                .to({ x: targetPosition.x, y: targetPosition.y, z: targetPosition.z }, 1000) // 1 second zoom
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();

            new TWEEN.Tween(camera.rotation)
                .to({  x: targetRotationX}, 1000) // 1 second rotation
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();

            // Redirect after animation completes
            new TWEEN.Tween(camera.position).to({}, 1000).onComplete(function () {
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
                        window.location.href = 'public/segments/south/south.html';
                        break;
                    case '6':
                        window.location.href = 'http://example.com/page6';
                        break;
                }
            }).start();
        }
    }
}


window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('click', onDocumentClick, false);
window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

init();
