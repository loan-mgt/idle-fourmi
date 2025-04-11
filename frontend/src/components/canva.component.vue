<template>
    <div ref="canvasContainer"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Application, Assets, Sprite } from 'pixi.js';

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
    })();
});
</script>

<style scoped></style>