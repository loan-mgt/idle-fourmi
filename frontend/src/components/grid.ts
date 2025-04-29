import { Container, Sprite, Assets, Application } from 'pixi.js';

export async function createGrid(
    gridWidth: number,
    gridHeight: number,
    tileWidth: number,
    tileHeight: number,
    texturePath: string
): Promise<Container> {
    const gridContainer = new Container();
    const oakTexture = await Assets.load(texturePath);
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
    return gridContainer;
}

export function updateGridPosition(
    gridContainer: Container,
    objectsContainer: Container,
    app: Application,
    gridWidth: number,
    gridHeight: number,
    tileWidth: number,
    tileHeight: number,
    zoomLevel: number
): void {
    const availableWidth = app.screen.width - 200;
    const availableHeight = app.screen.height - 50;
    gridContainer.x = (availableWidth - gridWidth * tileWidth * zoomLevel) / 2;
    gridContainer.y = (availableHeight - gridHeight * tileHeight * zoomLevel) / 2;
    gridContainer.scale.set(zoomLevel);
    objectsContainer.x = gridContainer.x;
    objectsContainer.y = gridContainer.y;
    objectsContainer.scale.set(zoomLevel);
}
