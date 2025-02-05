    // Configuración inicial de Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Función para crear texto flotante
    const createFloatingText = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 256;
        
        context.fillStyle = '#0f0';
        context.font = '12px monospace';
        const text = ['01001', 'ERROR', 'SYSTEM', 'DEBUG', '>>>', 'NULL', 'DATA'];
        context.fillText(text[Math.floor(Math.random() * text.length)], 
                       Math.random() * 200, Math.random() * 200);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(material);
        
        sprite.position.set(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20
        );
        sprite.scale.set(Math.random() * 2 + 1, Math.random() * 2 + 1, 1);
        
        return sprite;
    };

    // Crear líneas de matriz
    const createMatrixLine = () => {
        const points = [];
        const segmentCount = Math.floor(Math.random() * 5) + 2;
        
        for(let i = 0; i < segmentCount; i++) {
            points.push(new THREE.Vector3(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
            ));
        }
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ 
            color: 0x00ff00,
            transparent: true,
            opacity: Math.random() * 0.5 + 0.5
        });
        
        return new THREE.Line(geometry, material);
    };

    // Crear grid tridimensional
    const createGrid = () => {
        const geometry = new THREE.BoxGeometry(40, 40, 40);
        const material = new THREE.LineBasicMaterial({ 
            color: 0x00ff00,
            transparent: true,
            opacity: 0.1
        });
        const grid = new THREE.LineSegments(
            new THREE.WireframeGeometry(geometry),
            material
        );
        return grid;
    };

    // Agregar elementos a la escena
    const grid = createGrid();
    scene.add(grid);

    const matrixLines = [];
    for(let i = 0; i < 100; i++) {
        const line = createMatrixLine();
        matrixLines.push(line);
        scene.add(line);
    }

    const floatingTexts = [];
    for(let i = 0; i < 50; i++) {
        const text = createFloatingText();
        floatingTexts.push(text);
        scene.add(text);
    }

    camera.position.z = 15;

    // Variables para el control del mouse
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - window.innerWidth / 2) * 0.005;
        mouseY = (event.clientY - window.innerHeight / 2) * 0.005;
    });

    // Animación
    const animate = () => {
        requestAnimationFrame(animate);

        // Rotación de la escena basada en el mouse
        scene.rotation.y += (mouseX - scene.rotation.y) * 0.05;
        scene.rotation.x += (mouseY - scene.rotation.x) * 0.05;

        // Animación de líneas de matriz
        matrixLines.forEach((line, i) => {
            line.position.y -= 0.01 * (i % 3 + 1);
            if(line.position.y < -10) line.position.y = 10;
            line.material.opacity = Math.sin(Date.now() * 0.001 + i) * 0.5 + 0.5;
        });

        // Animación de textos flotantes
        floatingTexts.forEach((text, i) => {
            text.position.y -= 0.005 * (i % 2 + 1);
            if(text.position.y < -10) text.position.y = 10;
            text.material.opacity = Math.sin(Date.now() * 0.001 + i) * 0.5 + 0.5;
        });

        // Pulso del grid
        grid.material.opacity = Math.sin(Date.now() * 0.001) * 0.1 + 0.1;

        renderer.render(scene, camera);
    };

    animate();

    // Responsive
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });