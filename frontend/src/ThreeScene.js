import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useSelector } from 'react-redux';
import { selectSphereRadius } from './features/counterSlice';

const ThreeScene = () => {
    // Initilizing the reference for the Three.js scene
    // Documentation: https://react.dev/reference/react/hooks
    const sceneRef = useRef(null);
    // Checking if the reference is properly initialized
    console.log('Initial sceneRef', sceneRef.current);
    // Using the Redux Hook to get the initial radius stored in the Redux store
    // Documentation: https://react-redux.js.org/api/hooks
    const radius = useSelector(selectSphereRadius);

    useEffect(() => {
        // Setting up the Three.js scene
        // Documentation: https://threejs.org/docs/#manual/en/introduction/Creating-a-scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0xE7E5E4);

        // Storing the current referenced value (the 'div' element)
        const currentSceneRef = sceneRef.current; 
        // Checking if the reference was properly stored
        console.log('CurrentSceneRef', currentSceneRef);

        // A function that updates the size of the renderer and aspect ratio of the camera whenever it's called
        // Created to handle window resizing events for the purpose of responsive design
        const handleResize = () => {
            const width = currentSceneRef.clientWidth;
            const height = currentSceneRef.clientHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };
        // Initial call that ensures that the renderer and camera are correctly sized and configured on mounting
        handleResize();
        // Adding event listener to track when the window is resized and call the 'handleResize' function
        window.addEventListener('resize', handleResize);
        // Appending the renderer's canvas element to the 'div' element
        sceneRef.current.appendChild(renderer.domElement);

        // Adding lighting to the Three.js scene for the PhongMaterial to be properly displayed and visible
        const ambientLight = new THREE.AmbientLight(0xfed85d, 0.5);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        scene.add(directionalLight);

        // Creating the Sphere inside the scene and adding meterial to it
        // Documentation: https://threejs.org/docs/#api/en/geometries/SphereGeometry
        // Using the 'radius' variable value as the radius of the Sphere
        const geometry = new THREE.SphereGeometry(radius, 32, 32);
        // Choosing the 'MeshPhongMaterial' instead of 'MeshBasicMaterial' for the less 'flat' shading
        const material = new THREE.MeshPhongMaterial({ color: 0x00bfff, specular: 0xffffff, shininess: 100 });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        // Setting up the camera position
        camera.position.z = 5;

        // A function to animate the sphere
        const animate = () => {
            // Using the 'requestAnimationFrame' method which ensures smooth animation loop
            // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
            requestAnimationFrame(animate);
            sphere.rotation.x += 0.01;
            sphere.rotation.y += 0.01;
            renderer.render(scene, camera); // Draws the updated scene
        };

        // Initializing the animation loop
        animate();

        // useEffect cleanup function
        return () => {
            // Prevents memory leaks and unexpected behaviour
            window.removeEventListener('resize', handleResize);
            // Ensures that there are no lingering elements in the DOM after the component unmounts
            currentSceneRef.removeChild(renderer.domElement);
        };
    }, [radius]); // useEffect hook runs when the 'radius' changes updating the radius of the rendered sphere

    return <div ref={sceneRef} style={{ width: '100%', height: '50vh' }} />; // Referencing the 'div' element
};

export default ThreeScene;