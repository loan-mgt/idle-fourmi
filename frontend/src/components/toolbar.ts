// toolbar.ts
import { Container, Graphics, Sprite, Assets } from 'pixi.js';

export function populateBottomBar(
    toolbarContainer: Container,
    objectTypes: any[],
    Assets: typeof import('pixi.js').Assets,
    selectedObjectTypeRef: { value: any },
    placementModeRef: { value: boolean },
    startPlacementMode: (event: any) => void
): void {
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
            btnBg.fill({ color: 0xFF0000 });
        }

        btnContainer.on('pointerdown', (event) => {
            selectedObjectTypeRef.value = objectType;
            placementModeRef.value = true;
            startPlacementMode(event);
        });
        toolbarContainer.addChild(btnContainer);
    }
}
