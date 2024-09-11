import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

/**
 * Initializes the Three.js scene, setting up the camera, lights, and model,
 * and starts the animation loop. Also handles resizing events.
 */
export function initThreeJS() {
    const { scene, camera, renderer } = setupScene(); // Set up the basic Three.js scene
    setupLights(scene); // Add lighting to the scene
    loadModel(scene); // Load the 3D model into the scene
    const controls = setupCameraControls(camera); // Configure controls for user interaction
    
    // Create and start the animation loop
    const animate = createAnimationLoop(scene, camera, renderer, controls);
    renderer.setAnimationLoop(animate); 

    // Handle browser window resizing
    handleWindowResize(camera, renderer);
}

/**
 * Sets up the basic scene, including the canvas, camera, and renderer.
 * @returns An object containing the Three.js scene, camera, and renderer.
 */
function setupScene(): { scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer }  {
    const canvas: HTMLCanvasElement = document.getElementById('threeCanvas') as HTMLCanvasElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const scene: THREE.Scene = new THREE.Scene(); // Create a new Three.js scene
    scene.background = null; // Set the scene background to transparent

    // Create a perspective camera with a field of view of 75 degrees
    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight);
    camera.position.set(0, 30, 0); // Position the camera above the origin, looking down

    // Set up the renderer with antialiasing and alpha transparency enabled
    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
        canvas, // Sets the canvas to the canvas element, since they're the same name it doesn't need to be specified
        antialias: true, // Enables antialiasing, for smoother rendering
        alpha: true, // Enables alpha transparency for the renderer
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight); // Set renderer size to canvas size
    renderer.setPixelRatio(window.devicePixelRatio); // Adjust rendering for high-DPI displays

    return { scene, camera, renderer }; // Return the scene, camera, and renderer
}

/**
 * Adds ambient, directional, and point lights to the scene.
 * @param scene - The Three.js scene to add lights to.
 * @returns void
 */
function setupLights(scene: THREE.Scene): void {
    const ambientLight: THREE.AmbientLight = new THREE.AmbientLight(0xffffff, 1); // Soft light from all directions
    const directionalLight: THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // Light from one direction
    const pointLight: THREE.PointLight = new THREE.PointLight(0xffffff, 0.5); // Light from a specific point

    // Position the directional and point lights
    directionalLight.position.set(0, 10, 10);
    pointLight.position.set(0, 50, 0);

    // Add the lights to the scene
    scene.add(ambientLight, directionalLight, pointLight);
    return;
}

/**
 * Loads a GLTF 3D model and adds it to the scene.
 * @param scene - The Three.js scene to add the model to.
 * @returns void
 */
function loadModel(scene: THREE.Scene): void {
    const loader: GLTFLoader = new GLTFLoader(); // Create a new GLTF loader

    // Load the GLTF model from the specified path
    loader.load('./src/Models/lowPolyLivingRoom.gltf', (gltf) => {
        gltf.scene.position.set(0, -1, 0); // Adjust the model's position in the scene
        gltf.scene.scale.set(0.25, 0.25, 0.25); // Scale the model to a quarter of its original size
        scene.add(gltf.scene); // Add the loaded model to the scene
    });

    return;
}

/**
 * Defines the controls for rotating the camera by dragging the mouse or touch events.
 * @param camera - The Three.js camera to control.
 * @returns A CameraControls object to track camera rotation and user input state.
 */
interface CameraControls {
    theta: number; // Horizontal angle (rotation around the Y-axis)
    phi: number; // Vertical angle (rotation around the X-axis)
    radius: number; // Distance from the center of rotation
    isDragging: boolean; // Whether the user is dragging the camera
    previousMousePosition: { x: number; y: number }; // Tracks previous mouse position
}

/**
 * Sets up camera controls to rotate based on user input (mouse or touch events).
 * @param camera - The camera to apply the controls to.
 * @returns An object containing the control parameters and event listeners.
 */
function setupCameraControls(camera: THREE.PerspectiveCamera): CameraControls {
    const controls: CameraControls = {
        theta: 0, // Initial horizontal angle
        phi: 0, // Initial vertical angle
        radius: 5, // Distance from the camera's target
        isDragging: false, // Whether the user is currently dragging
        previousMousePosition: { x: 0, y: 0 } // Track previous mouse or touch position
    };

    /**
     * Starts tracking the pointer when the user begins dragging.
     * @param event - The pointer or touch event that starts the drag.
     */
    const onPointerDown = (event: PointerEvent | TouchEvent) => {
        controls.isDragging = true; // Set dragging state to true
        const clientPos = getClientPosition(event); // Get the initial pointer position
        controls.previousMousePosition = { x: clientPos.x, y: clientPos.y }; // Store the initial pointer position
    };

    /**
     * Updates the camera's rotation as the user drags.
     * @param event - The pointer or touch event as the user moves the pointer.
     */
    const onPointerMove = (event: PointerEvent | TouchEvent) => {
        if (!controls.isDragging) return; // If not dragging, ignore the move event
        const clientPos = getClientPosition(event); // Get the current pointer position
        const deltaX = clientPos.x - controls.previousMousePosition.x; // Calculate horizontal movement
        const deltaY = clientPos.y - controls.previousMousePosition.y; // Calculate vertical movement

        // Update theta (horizontal rotation) and phi (vertical rotation) based on movement
        controls.theta -= deltaX * 0.01;
        controls.phi = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, controls.phi - deltaY * 0.01));

        // Store the current pointer position for the next move event
        controls.previousMousePosition = { x: clientPos.x, y: clientPos.y };
    };

    /**
     * Ends the dragging state when the pointer is released.
     */
    const onPointerUp = () => {
        controls.isDragging = false; // Set dragging state to false
    };

    // Add event listeners for mouse and touch input
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('touchstart', onPointerDown, { passive: false });
    document.addEventListener('touchmove', onPointerMove, { passive: false });
    document.addEventListener('touchend', onPointerUp);

    return controls; // Return the controls object
}

/**
 * Helper function to get the client position (x, y) from a pointer or touch event.
 * @param event - The pointer or touch event.
 * @returns An object with the x and y coordinates of the event.
 */
function getClientPosition(event: PointerEvent | TouchEvent): { x: number; y: number } {
    if (event instanceof TouchEvent) {
        return { x: event.touches[0].clientX, y: event.touches[0].clientY }; // For touch events, get the first touch position
    }
    return { x: event.clientX, y: event.clientY }; // For pointer events, get the mouse position
}

/**
 * Creates the animation loop for rendering the scene and updating the camera's view.
 * @param scene - The Three.js scene to render.
 * @param camera - The camera to update.
 * @param renderer - The renderer to use for rendering the scene.
 * @param controls - The camera controls to apply.
 * @returns The animation loop function to be called on each frame.
 */
function createAnimationLoop(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    controls: CameraControls
) {
    return function animate() {
        // Calculate the camera's new position based on theta and phi angles
        const x = controls.radius * Math.sin(controls.theta) * Math.cos(controls.phi);
        const y = controls.radius * Math.sin(controls.phi) + camera.position.y;
        const z = controls.radius * Math.cos(controls.theta) * Math.cos(controls.phi);

        // Make the camera look at the calculated position
        camera.lookAt(new THREE.Vector3(x, y, z));

        // Render the scene from the camera's perspective
        renderer.render(scene, camera);
    };
}

/**
 * Handles window resize events to adjust the renderer and camera aspect ratio.
 * @param camera - The camera to adjust.
 * @param renderer - The renderer to resize.
 */
function handleWindowResize(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) {
    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height); // Update the renderer size
        camera.aspect = width / height; // Update the camera aspect ratio
        camera.updateProjectionMatrix(); // Apply the changes to the camera's projection
    });
}
