import s from './styles.module.css';
import React from 'react';
import {Component} from 'react';
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
var style = {
    height: "100vh",
    width: "100vw",
    padding: 0,
    margin: 0// set height to the height of the window
};

class App extends Component {
    componentDidMount() {
        this.sceneSetup();
        this.addCustomSceneObjects();
        this.startAnimationLoop();
        window.addEventListener('resize', this.handleWindowResize);
    }

    

    // Standard scene setup in Three.js. Check "Creating a scene" manual for more information
    // https://threejs.org/docs/#manual/en/introduction/Creating-a-scene
    sceneSetup = () => {
        // get container dimensions and use them for scene sizing
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        this.scene = new THREE.Scene({ antialias: true});
        this.scene.background = new THREE.Color( 'black' );
        this.camera = new THREE.PerspectiveCamera(
            45, // fov = field of view
            width / height, // aspect ratio
            0.1, // near plane
            10000 // far plane
        );
        this.camera.position.set( 0, 10, 20 ); // is used here to set some distance from a cube that is located at z = 0
        // OrbitControls allow a camera to orbit around the object
        // https://threejs.org/docs/#examples/controls/OrbitControls
        this.controls = new OrbitControls( this.camera, this.mount );
        this.controls.target.set( 0, 5, 0 );
	    this.controls.update();
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( width, height );
        this.mount.appendChild( this.renderer.domElement ); // mount using React ref
    };

    // Here should come custom code.
    // Code below is taken from Three.js BoxGeometry example
    // https://threejs.org/docs/#api/en/geometries/BoxGeometry
    addCustomSceneObjects = () => {
        const planeSize = 40;

		// const loader = new THREE.TextureLoader();
		// const texture = loader.load( 'https://threejs.org/manual/examples/resources/images/checker.png' );
		// texture.wrapS = THREE.RepeatWrapping;
		// texture.wrapT = THREE.RepeatWrapping;
		// texture.magFilter = THREE.NearestFilter;
		// texture.colorSpace = THREE.SRGBColorSpace;
		// const repeats = planeSize / 2;
		// texture.repeat.set( repeats, repeats );

		// const planeGeo = new THREE.PlaneGeometry( planeSize, planeSize );
		// const planeMat = new THREE.MeshPhongMaterial( {
		// 	map: texture,
		// 	side: THREE.DoubleSide,
		// } );
		// const mesh = new THREE.Mesh( planeGeo, planeMat );
		// mesh.rotation.x = Math.PI * - .5;
		// this.scene.add( mesh );

        const skyColor = 0xB1E1FF; // light blue
		const groundColor = 0xB97A20; // brownish orange
		const intensity = 2;
		const light = new THREE.HemisphereLight( skyColor, groundColor, intensity );
		this.scene.add( light );
        {
        const color = 0xFFFFFF;
		const intensity = 2.5;
		const light = new THREE.DirectionalLight( color, intensity );
		light.position.set( 5, 10, 2 );
		this.scene.add( light );
		this.scene.add( light.target );
        }
        {
            const gltfLoader = new GLTFLoader();
		    gltfLoader.load( './1_2.glb', ( gltf ) => {

			const root = gltf.scene;
			this.scene.add( root );

			// compute the box that contains all the stuff
			// from root and below
			const box = new THREE.Box3().setFromObject( root );

			const boxSize = box.getSize( new THREE.Vector3() ).length();
			const boxCenter = box.getCenter( new THREE.Vector3() );

			// set the camera to frame the box
			//frameArea( boxSize * 0.5, boxSize, boxCenter, this.camera );

			// update the Trackball controls to handle the new size
			this.controls.maxDistance = boxSize * 10;
			this.controls.target.copy( boxCenter );
			this.controls.update();

		} );
        }

    };

    startAnimationLoop = () => {
        //this.cube.rotation.x += 0.01;
        //this.cube.rotation.y += 0.01;

        this.renderer.render( this.scene, this.camera );

        // The window.requestAnimationFrame() method tells the browser that you wish to perform
        // an animation and requests that the browser call a specified function
        // to update an animation before the next repaint
        this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
    };

    handleWindowResize = () => {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;
        
        this.renderer.setSize( width, height );
        this.camera.aspect = width / height;

        // Note that after making changes to most of camera properties you have to call
        // .updateProjectionMatrix for the changes to take effect.
        this.camera.updateProjectionMatrix();
    };

    render() {
        return <div style={style} ref={ref => (this.mount = ref)} />;
    }
}

class Container extends React.Component {

    render() {
        return (
            <>
                <App />
            </>
        )
    }
}

export default Container;
