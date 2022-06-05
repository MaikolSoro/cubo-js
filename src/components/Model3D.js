import { useRef, useEffect } from 'react';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Model3D = () => {
    const mountRef = useRef(null);

    
    useEffect(() => {
        const currentRef = mountRef.current;
        const {clientWidth: width, clientHeight: height} = currentRef;

        const scene = new THREE.Scene();
        // cambiar el color del fondo
        scene.background = new THREE.Color(0x5b00ff);
        const camera = new THREE.PerspectiveCamera(25,width / height, 0.01, 1000);
        scene.add(camera);
        camera.position.z = 6;
        camera.position.x = 6;

        const renderer = new THREE.WebGLRenderer()
        renderer.setSize(width, height)
        currentRef.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enablePan = true;
        // controles
        controls.keys = {
            LEFT: 'ArrowLeft', //left arrow
            UP: 'ArrowUp', // up arrow
            RIGHT: 'ArrowRight', // right arrow
            BOTTOM: 'ArrowDown' // down arrow
        }
        

        const geometry = new THREE.BoxGeometry(1,1,1)
        const material = new THREE.MeshPhongMaterial({color: 0x0f2c64});
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        camera.lookAt(cube.position);

        // Add luces
        const ambietalLight = new THREE.AmbientLight( 0x404040,5 ); // soft white light
        scene.add( ambietalLight );

        const pointlight = new THREE.PointLight( 0xff0000, 10);
        pointlight.position.set( 8, 8, 8 );
        scene.add( pointlight );

        const clock = new THREE.Clock()

        // Add animated the cube
        const animate = () => {
            const elapsedTime = clock.getElapsedTime();
            cube.rotation.y = elapsedTime;
            cube.rotation.x = elapsedTime;
            cube.position.y = Math.sin(elapsedTime);

            controls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }
        // EL resize es que vaya ajustando a la pantalla depediendo su tamaño
        const resize = () => {
            const updateWidth = currentRef.clientWidth;
            const updatedHeight= currentRef.clientHeight;
            renderer.setSize(updateWidth, updatedHeight);
            camera.aspect = updateWidth /updatedHeight;
            camera.updateProjectionMatrix(); 
        };
    
        window.addEventListener('resize',resize);
        animate();
        return () => {
            currentRef.removeChild(renderer.domElement);
        };
    }, []);

    return ( 
        <div ref={ mountRef } style= {{ width: '100%', height: '100vh'}}>
        </div>
     );
}
 
export default Model3D;