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

        toolbar.on('pointerup', (event) => {
            const mousePosition = event.global;
            console.log(`Toolbar released at: ${mousePosition.x}, ${mousePosition.y}`);
        });

        // Add a visible background for the toolbar
        const toolbarBg = new Graphics();
        toolbarBg.Graphics.beginFill(0x333333, 0.7);
        toolbarBg.Graphics.drawRect(0, 0, app.screen.width, 50);
        toolbarBg.Graphics.endFill();
        toolbar.addChild(toolbarBg);

        // Add a button to the toolbar
        const btn = new Graphics();
        btn.Graphics.beginFill(0xFF0000);
        btn.Graphics.drawRect(0, 0, 50, 50);
        btn.Graphics.endFill();
        btn.x = 10;
        btn.y = 0;

        // Make button interactive
        btn.eventMode = 'static';
        btn.cursor = 'pointer';

        btn.on('pointerdown', (event) => {
            console.log(`Button clicked!`);
            event.stopPropagation(); // Prevent event from bubbling to toolbar
        });

        // Add btn to toolbar
        toolbar.addChild(btn);

        // Add toolbar to stage
        app.stage.addChild(toolbar);

        // Handle window resize to keep toolbar at bottom
        window.addEventListener('resize', () => {
            toolbar.y = app.screen.height - 50;
            toolbarBg.clear();
            toolbarBg.Graphics.beginFill(0x333333, 0.7);
            toolbarBg.Graphics.drawRect(0, 0, app.screen.width, 50);
            toolbarBg.Graphics.endFill();
        });
    })();
});
</script>

<style scoped>
/* You can add some styling for the canvas container if needed */
</style>