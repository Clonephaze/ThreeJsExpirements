import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function startThree() {
    const canvas: HTMLCanvasElement = document.getElementById('threeCanvas') as HTMLCanvasElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const scene: THREE.Scene = new THREE.Scene();
    scene.background = null; // Transparent background

    // Camera
    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight);

    // Raise the camera's Y position above the floor (e.g., 2 units above the floor)
    const cameraHeight = 30;
    camera.position.set(0, cameraHeight, 0); // The camera is now higher in the room

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(0, 10, 10);
    scene.add(pointLight);

    // Renderer
    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });

    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio); // Ensure sharp rendering

    // GLTF Loader
    const loader: GLTFLoader = new GLTFLoader();

    loader.load('./src/Models/lowPolyLivingRoom.gltf', function (gltf) {
        scene.add(gltf.scene);

        // Adjust model's position and scale
        gltf.scene.position.set(0, -1, 0);
        gltf.scene.scale.set(0.25, 0.25, 0.25);

        // Optional: bounding box log to check the model's size
        const box = new THREE.Box3().setFromObject(gltf.scene);
    });

    // Variables for camera rotation
    let theta = 0; // horizontal rotation angle
    let phi = 0;   // vertical rotation angle
    const radius = 5; // distance from center to "look at" point (adjust as needed)

    // Add pointer support for both touch and mouse interactions
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    // Handle pointer down (works for both mouse and touch)
    function onPointerDown(event: PointerEvent) {
        isDragging = true;
        previousMousePosition = { x: event.clientX, y: event.clientY };
        console.log('Pointer down:', previousMousePosition); // Debugging
        event.preventDefault();
    }

    // Handle pointer move (works for both mouse and touch)
    function onPointerMove(event: PointerEvent) {
        if (!isDragging) return;

        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;

        console.log('Pointer move', deltaX, deltaY); // Debugging

        theta -= deltaX * 0.01; // Horizontal angle
        phi -= deltaY * 0.01;   // Vertical angle

        phi = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, phi));

        previousMousePosition = { x: event.clientX, y: event.clientY };
        event.preventDefault();
    }

    // Handle pointer up (works for both mouse and touch)
    function onPointerUp() {
        isDragging = false;
    }


    // Animation loop
    function animate() {
        const x = radius * Math.sin(theta) * Math.cos(phi);
        const y = radius * Math.sin(phi) + cameraHeight; // Adding camera height to y-axis
        const z = radius * Math.cos(theta) * Math.cos(phi);

        camera.lookAt(new THREE.Vector3(x, y, z));

        renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animate);

    // Update canvas size on window resize
    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    console.log('Loaded three.js');
}
