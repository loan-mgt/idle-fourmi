<template>
    <div ref="canvasContainer"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Application, Assets, Sprite, Container, Graphics } from 'pixi.js';

const canvasContainer = ref(null);

onMounted(() => {
    (async () => {
        // Create a new application
        const app = new Application();

        // Initialize the application
        await app.init({ background: '#1099bb', resizeTo: window });
        app.stage.eventMode = 'static';
        app.stage.hitArea = app.screen;

        window.addEventListener('resize', () => {
            toolbar.y = app.screen.height - 50;
            toolbarBg.clear();
            toolbarBg.rect(0, 0, app.screen.width, 50);
            toolbarBg.fill(0x333333, 0.7);

            app.stage.hitArea = app.screen; // maj du hitArea aussi !
        });

        // Append the application canvas to the container
        app.canvas.className = 'pixi-canvas';
        app.canvas.style.width = '99%';
        app.canvas.style.height = '99%';
        canvasContainer.value.appendChild(app.canvas);

        // Load the bunny texture
        const texture = await Assets.load('https://pixijs.com/assets/bunny.png');

        // Create a bunny Sprite
        const bunny = new Sprite(texture);

        // Center the sprite's anchor point
        bunny.anchor.set(0.5);

        // Move the sprite to the center of the screen
        bunny.x = app.screen.width / 2;
        bunny.y = app.screen.height / 2;

        app.stage.addChild(bunny);

        // Listen for animate update
        app.ticker.add((time) => {
            // Just for fun, let's rotate mr rabbit a little.
            bunny.rotation += 0.1 * time.deltaTime;
        });


        /*
        * Toolbar - now positioned at the bottom
        */

        // Create a toolbar container
        const toolbar = new Container();
        toolbar.x = 0;
        toolbar.y = app.screen.height - 50; // Position at bottom
        toolbar.width = app.screen.width;
        toolbar.height = 50;

        // Make toolbar interactive
        toolbar.eventMode = 'static';
        toolbar.cursor = 'pointer';

        toolbar.on('pointerdown', (event) => {
            const mousePosition = event.global;
            console.log(`Toolbar clicked at: ${mousePosition.x}, ${mousePosition.y}`);
        });

        // Add a visible background for the toolbar - using correct Graphics API
        const toolbarBg = new Graphics();
        toolbarBg.rect(0, 0, app.screen.width, 50);
        toolbarBg.fill(0x333333, 0.7);
        toolbar.addChild(toolbarBg);

        // Add a button to the toolbar - using correct Graphics API
        const btn = new Graphics();
        btn.rect(0, 0, 50, 50);
        btn.fill(0xFF0000);
        btn.x = 10;
        btn.y = 0;

        // Make button interactive
        btn.eventMode = 'static';
        btn.cursor = 'pointer';

        // Variables pour le mode placement style Sims
        let placementMode = false;
        let placementObject = null;
        let lastKnownMousePosition = { x: 0, y: 0 };

        // Écouteur pour suivre la position de la souris globalement
        app.stage.on('pointermove', (event) => {
            lastKnownMousePosition = event.global.clone();
        });

        // Fonction pour activer le mode placement
        function startPlacementMode(initialEvent) {
            debugger
        }


        // Associer l'activation du mode placement au clic sur le bouton
        btn.on('pointerdown', (event) => {
            placementMode = true;
            startPlacementMode(event);
        });

        // Écouteur pour suivre la position de la souris globalement
        app.stage.on('pointermove', (event) => {
            lastKnownMousePosition = event.global.clone();
        });

        // Fonction pour activer le mode placement
        function startPlacementMode(initialEvent) {
            const clonedBtn = new Graphics();
            clonedBtn.rect(0, 0, 50, 50);
            clonedBtn.fill(0xFF0000, 0.5); // Rouge avec transparence
            clonedBtn.eventMode = 'static';
            clonedBtn.cursor = 'grabbing';

            clonedBtn.x = initialEvent.global.x - 25;
            clonedBtn.y = initialEvent.global.y - 25;

            placementObject = clonedBtn;
            app.stage.addChild(clonedBtn);
        }

        app.ticker.add(() => {
            if (placementMode && placementObject) {
                placementObject.x = lastKnownMousePosition.x - placementObject.width / 2;
                placementObject.y = lastKnownMousePosition.y - placementObject.height / 2;
            }
        });

        function endPlacementMode() {
            placementMode = false;
            if (placementObject) {
                app.stage.removeChild(placementObject);
                placementObject = null;
            }
        }

        // Add btn to toolbar
        toolbar.addChild(btn);

        // Add toolbar to stage
        app.stage.addChild(toolbar);

        // Ajouter un gestionnaire de touche Escape pour annuler le mode placement
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && placementMode) {
                endPlacementMode();
            }
        });

        // Handle window resize to keep toolbar at bottom
        window.addEventListener('resize', () => {
            toolbar.y = app.screen.height - 50;
            toolbarBg.clear();
            toolbarBg.rect(0, 0, app.screen.width, 50);
            toolbarBg.fill(0x333333, 0.7);
        });
    })();
});
</script>

<style scoped></style>