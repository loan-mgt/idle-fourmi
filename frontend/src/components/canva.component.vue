<template>
    <div ref="canvasContainer"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Application, Assets, Sprite, Container, Graphics, Text } from 'pixi.js';
import { GameService } from '@/services/game.service.js';

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

        // Create a toolbar container and a sidebar container
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

        const sidebar = new Container();

        // Create a sidebar container
        sidebar.x = app.screen.width - 200; // Position at right
        sidebar.y = 0;
        sidebar.width = 200;
        sidebar.height = app.screen.height;

        sidebar.eventMode = 'static';
        sidebar.cursor = 'pointer';

        const sidebarBg = new Graphics();
        sidebarBg.rect(0, 0, 200, app.screen.height);
        sidebarBg.fill(0x333333, 0.7);
        sidebar.addChild(sidebarBg);




        // Écouteur pour suivre la position de la souris globalement
        app.stage.on('pointermove', (event) => {
            lastKnownMousePosition = event.global.clone();
        });


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

            clonedBtn.onpointerdown = (event) => {
                // Si le bouton est cliqué, on annule le mode placement
                finishPlacementMode(event);
            };

            placementObject = clonedBtn;
            app.stage.addChild(clonedBtn);
        }

        app.ticker.add(() => {
            if (placementMode && placementObject) {
                placementObject.x = lastKnownMousePosition.x - placementObject.width / 2;
                placementObject.y = lastKnownMousePosition.y - placementObject.height / 2;
            }
        });

        function cancelPlacementMode() {
            placementMode = false;
            if (placementObject) {
                app.stage.removeChild(placementObject);
                placementObject = null;
            }
        }

        function finishPlacementMode(event) {
            //if right click, cancel placement mode
            if (event.data.button === 2) {
                cancelPlacementMode();
                return;
            }

            // else finish placement mode
            placementMode = false;
            if (placementObject) {
                placementObject.onpointerdown = null; // Remove the pointerdown event
                placementObject.cursor = 'pointer'; // Change cursor back to pointer
                placementObject.interactive = false; // Make it non-interactive
                placementObject.clear();
                placementObject.rect(0, 0, 50, 50);
                placementObject.fill(0xFF0000); // Opacité complète

                //TODO: Add Antoine factory here !!!

                placementObject = null;
            }
            console.log('Placement finished at:', event.global.x, event.global.y);
        }

        // Add btn to toolbar
        toolbar.addChild(btn);

        // Add toolbar and sidebar to stage
        app.stage.addChild(toolbar);
        app.stage.addChild(sidebar);

      displayEventsInSidebar();

        // Ajouter un gestionnaire de touche Escape pour annuler le mode placement
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && placementMode) {
                cancelPlacementMode();
            }
        });

        // Handle window resize to keep toolbar at bottom and adjust sidebar
        window.addEventListener('resize', () => {
            toolbar.y = app.screen.height - 50;
            toolbarBg.clear();
            toolbarBg.rect(0, 0, app.screen.width, 50);
            toolbarBg.fill(0x333333, 0.7);

            // Mettre à jour la sidebar aussi
            sidebar.x = app.screen.width - 200;
            sidebarBg.clear();
            sidebarBg.rect(0, 0, 200, app.screen.height);
            sidebarBg.fill(0x333333, 0.7);

          displayEventsInSidebar();
        });


      function displayEventsInSidebar() {
        // Supprimer tous les enfants de la sidebar sauf le fond
        while (sidebar.children.length > 1) {
          sidebar.removeChildAt(1);
        }

        // Ajouter chaque événement à la sidebar
        GameService.GAME_BUFF.forEach((event, index) => {
          // Créer un conteneur pour l'événement
          const eventContainer = new Container();
          eventContainer.x = 10;
          eventContainer.y = 10 + index * 70;
          eventContainer.eventMode = 'static';
          eventContainer.cursor = 'pointer';

          // Ajouter un fond pour l'événement
          const eventBg = new Graphics();
          eventBg.rect(0, 0, 180, 60);
          eventBg.fill(0x555555);
          eventContainer.addChild(eventBg);

          // Chargement de l'image
          Assets.load(event.imageUrl).then(texture => {
            const eventImage = new Sprite(texture);
            eventImage.scale.set(0.4);
            eventImage.x = 5;
            eventImage.y = 5;
            eventContainer.addChild(eventImage);
          });

          // Ajouter le texte du titre
          const title = new Text(event.title, {
            fontSize: 14,
            fill: 0xffffff,
          });
          title.x = 60;
          title.y = 10;
          eventContainer.addChild(title);

          // Ajouter le tooltip comme texte plus petit
          const tooltip = new Text(event.tooltip, {
            fontSize: 10,
            fill: 0xcccccc,
          });
          tooltip.x = 60;
          tooltip.y = 30;
          eventContainer.addChild(tooltip);

          // Gérer le clic sur l'événement
          eventContainer.on('pointerdown', () => {
            console.log('Événement cliqué:', event);
            // Supprimer l'événement de la liste
            const index = GameService.GAME_BUFF.findIndex(e => e.id === event.id);
            if (index !== -1) {
              GameService.GAME_BUFF.splice(index, 1);
              // Rafraîchir l'affichage
              displayEventsInSidebar();
            }
          });

          sidebar.addChild(eventContainer);
        });
      }


    })();


});
</script>

<style scoped></style>
