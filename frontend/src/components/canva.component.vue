<template>
    <div ref="canvasContainer"></div>
</template>

<script setup>
import { Employee } from "@/models/employee.js";
import { Plant } from "@/models/plant.js";
import { onMounted, ref } from 'vue';
import { Application, Assets, Container, Graphics, Sprite, Text } from 'pixi.js';
import { calculateTickMoney } from "@/services/game-utilities.service";
import { GameService } from "@/services/game.service.js";
import { Desk } from "@/models/desk.js";
import { createHUD, updateMoneyDisplay } from './hud';

const canvasContainer = ref(null);

// Helper to create fallback texture
function createFallbackTexture(width, height, alpha = 1) {
    const fallbackGraphic = new Graphics();
    fallbackGraphic.rect(0, 0, width, height);
    fallbackGraphic.fill({ color: 0xFF0000, alpha });
    return fallbackGraphic.generateCanvasTexture();
}

// Helper to create a sidebar (generalized)
function createSidebar({ x, y, width, height, populateContent }) {
    const sidebar = new Container();
    sidebar.x = x;
    sidebar.y = y;
    sidebar.width = width;
    sidebar.height = height;
    sidebar.eventMode = 'static';
    sidebar.cursor = 'pointer';

    const sidebarBg = new Graphics();
    sidebarBg.rect(0, 0, width, height);
    sidebarBg.fill({ color: 0x333333, alpha: 0.7 });
    sidebar.addChild(sidebarBg);

    if (populateContent) {
        populateContent(sidebar);
    }
    return { sidebar, sidebarBg };
}

onMounted(() => {
    (async () => {
        const app = new Application();
        let selectedObjectType = null;
        let placementMode = false;
        let placementObject = null;
        let lastKnownMousePosition = { x: 0, y: 0 };
        await app.init({ background: '#1099bb', resizeTo: window });
        app.stage.eventMode = 'static';
        app.stage.hitArea = app.screen;

        // HUD creation (moved to hud.ts)
        const { hudContainer, gameTitle, moneyDisplay } = createHUD(GameService.MONEY_AMOUNT);

        // Zoom and pan variables
        let isDragging = false;
        let dragStartPosition = { x: 0, y: 0 };
        let previousPosition = { x: 0, y: 0 };
        let zoomLevel = 1;
        const MIN_ZOOM = 0.5;
        const MAX_ZOOM = 3.0;
        const ZOOM_STEP = 0.15;

        // Append the application canvas to the container (once)
        app.canvas.className = 'pixi-canvas';
        app.canvas.style.width = '99%';
        app.canvas.style.height = '99%';
        canvasContainer.value.appendChild(app.canvas);
        const objectsContainer = new Container();

        window.addEventListener("beforeunload", () => {
            localStorage.setItem("MONEY_AMOUNT", GameService.MONEY_AMOUNT.toString());
            localStorage.setItem("GAME_OBJECTS", JSON.stringify(GameService.GAME_OBJECTS));
        });

        // Load game data from localStorage
        const oldMoney = localStorage.getItem("MONEY_AMOUNT");
        if (oldMoney) {
            GameService.MONEY_AMOUNT = isNaN(Number(oldMoney)) ? 20 : Number(oldMoney);
        }
        const oldObjects = localStorage.getItem("GAME_OBJECTS");
        if (oldObjects) {
            //loadSave(JSON.parse(oldObjects));
        }

        if (GameService.GAME_OBJECTS && !GameService.GAME_OBJECTS.length) {
            // initGame()
        }

        // Créer un conteneur pour la grille
        const gridContainer = new Container();
        app.stage.addChild(gridContainer);

        // Charger la texture de planches de chêne
        const oakTexture = await Assets.load('/src/assets/textures/oak_planks.png');

        // Définir la taille de chaque tuile
        const tileWidth = 32;
        const tileHeight = 32;

        // Créer une grille 10x20
        const gridWidth = 20;
        const gridHeight = 10;

        // Créer les tuiles et les ajouter au conteneur
        for (let y = 0; y < gridHeight; y++) {
            for (let x = 0; x < gridWidth; x++) {
                const tile = new Sprite(oakTexture);
                tile.width = tileWidth;
                tile.height = tileHeight;
                tile.x = x * tileWidth;
                tile.y = y * tileHeight;
                gridContainer.addChild(tile);
            }
        }

        function updateGridPosition() {
            // Calculate available area (exclude right sidebar and bottom bar)
            const availableWidth = app.screen.width - 200; // 200px for right sidebar
            const availableHeight = app.screen.height - 50; // 50px for bottom bar
            gridContainer.x = (availableWidth - gridWidth * tileWidth * zoomLevel) / 2;
            gridContainer.y = (availableHeight - gridHeight * tileHeight * zoomLevel) / 2;
            gridContainer.scale.set(zoomLevel);

            // Offset for bars
            gridContainer.x += 0; // left bar is gone, so no offset
            gridContainer.y += 0; // top bar is not present, so no offset

            // Synchronize the objects container with the grid
            objectsContainer.x = gridContainer.x;
            objectsContainer.y = gridContainer.y;
            objectsContainer.scale.set(zoomLevel);
        }

        // Positionner la grille initialement
        updateGridPosition();


        /*
        * Toolbar - now positioned at the bottom
        */

        // Make toolbar interactive
        // Add a visible background for the toolbar - using correct Graphics API
        const toolbarBg = new Graphics();
        toolbarBg.rect(0, 0, app.screen.width, 50);
        toolbarBg.fill({ color: 0x333333, alpha: 0.7 });
        toolbarBg.y = app.screen.height - 50; // Ensure it is at the bottom
        app.stage.addChild(toolbarBg);

        // --- Bottom Bar: Item Placement ---
        function populateBottomBar(toolbarContainer) {
            let objectTypes = [Desk, Employee, Plant];
            for (let i = 0; i < objectTypes.length; i++) {
                const btnContainer = new Container();
                btnContainer.x = 20 + i * 70;
                btnContainer.y = 5;
                btnContainer.width = 60;
                btnContainer.height = 40;
                btnContainer.eventMode = 'static';
                btnContainer.cursor = 'pointer';

                const btnBg = new Graphics();
                btnBg.rect(0, 0, 60, 40);
                btnBg.fill({ color: 0x444444 });
                btnContainer.addChild(btnBg);

                const objectType = objectTypes[i];
                if (objectType.sprite) {
                    Assets.load(objectType.sprite).then(texture => {
                        const sprite = new Sprite(texture);
                        sprite.width = 36;
                        sprite.height = 36;
                        sprite.x = 12;
                        sprite.y = 2;
                        btnContainer.addChild(sprite);
                    });
                } else {
                    // fallback visual
                    btnBg.fill({ color: 0xFF0000 });
                }

                btnContainer.on('pointerdown', (event) => {
                    selectedObjectType = objectType;
                    placementMode = true;
                    startPlacementMode(event);
                });
                toolbarContainer.addChild(btnContainer);
            }
        }

        // --- Right Sidebar: Events ---
        function populateRightSidebar(sidebar) {
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
                eventBg.fill({ color: 0x555555 });
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
                const title = new Text({
                    text: event.title,
                    style: {
                        fontSize: 14,
                        fill: 0xffffff,
                    }
                });
                title.x = 60;
                title.y = 10;
                eventContainer.addChild(title);

                // Ajouter le tooltip comme texte plus petit
                const tooltip = new Text({
                    text: event.tooltip,
                    style: {
                        fontSize: 10,
                        fill: 0xcccccc,
                    }
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

        // Only create right sidebar for events
        const { sidebar: rightSidebar, sidebarBg: rightSidebarBg } = createSidebar({
            x: app.screen.width - 200,
            y: 0,
            width: 200,
            height: app.screen.height,
            populateContent: populateRightSidebar
        });
        app.stage.addChild(rightSidebar);

        // Create toolbar container for bottom bar
        const toolbarContainer = new Container();
        toolbarContainer.x = 0;
        toolbarContainer.y = app.screen.height - 50;
        toolbarContainer.width = app.screen.width;
        toolbarContainer.height = 50;
        toolbarContainer.eventMode = 'static';
        toolbarContainer.cursor = 'pointer';
        populateBottomBar(toolbarContainer);
        app.stage.addChild(toolbarContainer);

        // Add containers in correct z-order: grid, objects, then UI (sidebar, toolbar, HUD)
        app.stage.addChild(gridContainer);
        app.stage.addChild(objectsContainer);
        app.stage.addChild(rightSidebar);
        app.stage.addChild(toolbarBg);
        app.stage.addChild(toolbarContainer);
        app.stage.addChild(hudContainer);

        // Écouteur pour suivre la position de la souris globalement
        app.stage.on('pointermove', (event) => {
            lastKnownMousePosition = event.global.clone();

            // Gestion du panoramique (pan)
            if (isDragging && !isOverUI(lastKnownMousePosition)) {
                const dx = event.global.x - dragStartPosition.x;
                const dy = event.global.y - dragStartPosition.y;

                gridContainer.x = previousPosition.x + dx;
                gridContainer.y = previousPosition.y + dy;

                // Synchroniser le conteneur d'objets
                objectsContainer.x = gridContainer.x;
                objectsContainer.y = gridContainer.y;
            }
        });

        // Fonction pour vérifier si la souris est au-dessus d'un élément d'interface
        function isOverUI(position) {
            return (
                position.x >= rightSidebar.x && position.x <= rightSidebar.x + rightSidebar.width &&
                position.y >= rightSidebar.y && position.y <= rightSidebar.y + rightSidebar.height
            );
        }

        // Gestion du zoom avec la molette de souris
        app.canvas.addEventListener('wheel', (event) => {
            event.preventDefault();
            if (!isOverUI(lastKnownMousePosition)) {
                // 1. Get world coordinates under mouse before zoom
                const worldX = (lastKnownMousePosition.x - gridContainer.x) / gridContainer.scale.x;
                const worldY = (lastKnownMousePosition.y - gridContainer.y) / gridContainer.scale.y;

                // 2. Calculate new zoom level
                const zoomDirection = event.deltaY < 0 ? 1 : -1;
                const newZoomLevel = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomLevel + (zoomDirection * ZOOM_STEP)));
                if (newZoomLevel === zoomLevel) return; // No change
                zoomLevel = newZoomLevel;

                // 3. Apply new zoom and adjust position so world coords under mouse stay fixed
                gridContainer.scale.set(zoomLevel);
                gridContainer.x = lastKnownMousePosition.x - worldX * zoomLevel;
                gridContainer.y = lastKnownMousePosition.y - worldY * zoomLevel;
                objectsContainer.scale.set(zoomLevel);
                objectsContainer.x = gridContainer.x;
                objectsContainer.y = gridContainer.y;
            }
        });

        // Gestionnaire pour commencer le panoramique
        app.stage.on('pointerdown', (event) => {
            if (event.data.button === 0 && !isOverUI(event.global) && !placementMode) {
                isDragging = true;
                dragStartPosition = event.global.clone();
                previousPosition = { x: gridContainer.x, y: gridContainer.y };
                app.canvas.style.cursor = 'grabbing';
            }
        });

        // Gestionnaire pour terminer le panoramique
        app.stage.on('pointerup', () => {
            if (isDragging) {
                isDragging = false;
                app.canvas.style.cursor = 'default';
            }
        });

        app.stage.on('pointerupoutside', () => {
            if (isDragging) {
                isDragging = false;
                app.canvas.style.cursor = 'default';
            }
        });

        // For Money calculation
        let elapsed = 0;
        app.ticker.add((time) => {
            elapsed += time.count;
            if (elapsed >= 600) {
                GameService.MONEY_AMOUNT += calculateTickMoney();
                updateMoneyDisplay(moneyDisplay, GameService.MONEY_AMOUNT);
                elapsed = 0;
            }
        });


        function cancelPlacementMode() {
            placementMode = false;
            if (placementObject) {
                app.stage.removeChild(placementObject);
                placementObject = null;
            }
        }

        // Fonction pour activer le mode placement
        function startPlacementMode(initialEvent) {
            if (!selectedObjectType) return;

            const startPlacement = (texture) => {
                // Créer un objet temporaire pour récupérer ses dimensions
                const tempObject = new selectedObjectType(0, 0);

                const clonedSprite = new Sprite(texture);
                // Ajuster la taille du sprite en fonction des dimensions de l'objet
                clonedSprite.width = tileWidth * tempObject.width;
                clonedSprite.height = tileHeight * tempObject.height;
                clonedSprite.alpha = 0.7;
                clonedSprite.eventMode = 'static';
                clonedSprite.cursor = 'grabbing';

                clonedSprite.x = initialEvent.global.x - clonedSprite.width / 2;
                clonedSprite.y = initialEvent.global.y - clonedSprite.height / 2;

                clonedSprite.onpointerdown = (event) => {
                    finishPlacementMode(event);
                };

                placementObject = clonedSprite;
                app.stage.addChild(clonedSprite);
            };

            if (selectedObjectType.sprite && selectedObjectType.sprite !== '') {
                Assets.load(selectedObjectType.sprite).then(texture => {
                    startPlacement(texture);
                }).catch(() => {
                    startPlacement(createFallbackTexture(tileWidth, tileHeight, 0.5));
                });
            } else {
                startPlacement(createFallbackTexture(tileWidth, tileHeight, 0.5));
            }
        }

        app.ticker.add(() => {
            if (placementMode && placementObject) {
                placementObject.x = lastKnownMousePosition.x - placementObject.width / 2;
                placementObject.y = lastKnownMousePosition.y - placementObject.height / 2;
            }
        });

        function finishPlacementMode(event) {
            if (event.data.button === 2) {
                cancelPlacementMode();
                return;
            }

            placementMode = false;
            if (placementObject && selectedObjectType) {
                const localPos = {
                    x: (event.global.x - gridContainer.x) / zoomLevel,
                    y: (event.global.y - gridContainer.y) / zoomLevel
                };

                const gridX = Math.floor(localPos.x / tileWidth);
                const gridY = Math.floor(localPos.y / tileHeight);

                if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
                    // Vérifier d'abord si le joueur a assez d'argent
                    const tempObject = new selectedObjectType(gridX, gridY);

                    if (GameService.MONEY_AMOUNT < tempObject.cost) {
                        // Pas assez d'argent, afficher un message et annuler le placement
                        console.log("Pas assez d'argent pour placer cet objet!");

                        // Option: créer une notification visuelle temporaire
                        const notificationText = new Text({
                            text: "Fonds insuffisants!",
                            style: {
                                fontSize: 20,
                                fill: 0xff0000,
                                align: 'center',
                            }
                        });
                        notificationText.x = app.screen.width / 2 - 100;
                        notificationText.y = app.screen.height / 2 - 50;
                        app.stage.addChild(notificationText);

                        // Faire disparaître la notification après 2 secondes
                        setTimeout(() => {
                            app.stage.removeChild(notificationText);
                        }, 2000);

                        app.stage.removeChild(placementObject);
                        placementObject = null;
                        return;
                    }

                    // Créer l'objet final avec le bon sprite
                    const createFinalObject = (texture) => {
                        // Créer l'instance de l'objet pour le jeu
                        const newGameObject = new selectedObjectType(gridX, gridY);
                        // Soustraire le coût de l'objet du montant d'argent
                        GameService.MONEY_AMOUNT -= newGameObject.cost;
                        updateMoneyDisplay(moneyDisplay, GameService.MONEY_AMOUNT);

                        const finalSprite = new Sprite(texture);
                        // Ajuster la taille du sprite en fonction de l'objet
                        finalSprite.width = tileWidth * newGameObject.width;
                        finalSprite.height = tileHeight * newGameObject.height;
                        finalSprite.x = gridX * tileWidth;
                        finalSprite.y = gridY * tileHeight;
                        // Only add to objectsContainer (which is a Container)
                        objectsContainer.addChild(finalSprite);

                        // Ajouter l'objet au jeu
                        GameService.GAME_OBJECTS.push(newGameObject);
                        console.log('Objet placé à la cellule:', gridX, gridY, newGameObject);
                    };

                    // Le reste de la fonction reste inchangé...
                    if (selectedObjectType.sprite && selectedObjectType.sprite !== '') {
                        Assets.load(selectedObjectType.sprite).then(texture => {
                            createFinalObject(texture);
                        }).catch(() => {
                            createFinalObject(createFallbackTexture(tileWidth, tileHeight));
                        });
                    } else {
                        createFinalObject(createFallbackTexture(tileWidth, tileHeight));
                    }
                }

                app.stage.removeChild(placementObject);
                placementObject = null;
            }
        }

        // Update on resize
        window.addEventListener('resize', () => {
            rightSidebar.x = app.screen.width - 200;
            rightSidebar.height = app.screen.height;
            rightSidebarBg.clear();
            rightSidebarBg.rect(0, 0, 200, app.screen.height);
            rightSidebarBg.fill({ color: 0x333333, alpha: 0.7 });

            toolbarBg.y = app.screen.height - 50;
            toolbarBg.clear();
            toolbarBg.rect(0, 0, app.screen.width, 50);
            toolbarBg.fill({ color: 0x333333, alpha: 0.7 });
            toolbarContainer.y = app.screen.height - 50;
            toolbarContainer.width = app.screen.width;

            updateGridPosition();
            displayEventsInSidebar();
        });

        // Update event sidebar content
        function displayEventsInSidebar() {
            // Supprimer tous les enfants de la sidebar sauf le fond
            while (rightSidebar.children.length > 1) {
                rightSidebar.removeChildAt(1);
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
                eventBg.fill({ color: 0x555555 });
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
                const title = new Text({
                    text: event.title,
                    style: {
                        fontSize: 14,
                        fill: 0xffffff,
                    }
                });
                title.x = 60;
                title.y = 10;
                eventContainer.addChild(title);

                // Ajouter le tooltip comme texte plus petit
                const tooltip = new Text({
                    text: event.tooltip,
                    style: {
                        fontSize: 10,
                        fill: 0xcccccc,
                    }
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

                rightSidebar.addChild(eventContainer);
            });
        }

        // Ajouter un gestionnaire de touche Escape pour annuler le mode placement
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && placementMode) {
                cancelPlacementMode();
            }
        });

        // Add toolbar and sidebar to stage
        app.stage.addChild(objectsContainer);

        displayEventsInSidebar();

        // Update grid position on resize
        window.addEventListener('resize', () => {
            toolbarBg.y = app.screen.height - 50; // Keep toolbar at the bottom
            toolbarBg.clear();
            toolbarBg.rect(0, 0, app.screen.width, 50);
            toolbarBg.fill({ color: 0x333333, alpha: 0.7 });

            updateGridPosition();
            displayEventsInSidebar();
        });
    })();
});
</script>

<style scoped></style>
