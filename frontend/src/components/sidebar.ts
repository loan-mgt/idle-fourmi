// sidebar.ts
import { Container, Graphics, Sprite, Text, Assets, Application } from 'pixi.js';
import { GameService } from '@/services/game.service.js';

interface SidebarOptions {
    x: number;
    y: number;
    width: number;
    height: number;
    populateContent?: (sidebar: Container) => void;
}

export function createSidebar({ x, y, width, height, populateContent }: SidebarOptions): { sidebar: Container; sidebarBg: Graphics } {
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

export function displayEventsInSidebar(
    rightSidebar: Container,
    rightSidebarBg: Graphics,
    app: Application,
    updateMoneyDisplay: (...args: any[]) => void
): void {
    // Remove all children except the background
    while (rightSidebar.children.length > 1) {
        rightSidebar.removeChildAt(1);
    }
    // Add each event to the sidebar
    GameService.GAME_BUFF.forEach((event, index) => {
        const eventContainer = new Container();
        eventContainer.x = 10;
        eventContainer.y = 10 + index * 70;
        eventContainer.eventMode = 'static';
        eventContainer.cursor = 'pointer';

        const eventBg = new Graphics();
        eventBg.rect(0, 0, 180, 60);
        eventBg.fill({ color: 0x555555 });
        eventContainer.addChild(eventBg);

        Assets.load(event.imageUrl).then(texture => {
            const eventImage = new Sprite(texture);
            eventImage.scale.set(0.4);
            eventImage.x = 5;
            eventImage.y = 5;
            eventContainer.addChild(eventImage);
        });

        const title = new Text({
            text: event.title,
            style: { fontSize: 14, fill: 0xffffff }
        });
        title.x = 60;
        title.y = 10;
        eventContainer.addChild(title);

        const tooltip = new Text({
            text: event.tooltip,
            style: { fontSize: 10, fill: 0xcccccc }
        });
        tooltip.x = 60;
        tooltip.y = 30;
        eventContainer.addChild(tooltip);

        eventContainer.on('pointerdown', () => {
            const idx = GameService.GAME_BUFF.findIndex(e => e.id === event.id);
            if (idx !== -1) {
                GameService.GAME_BUFF.splice(idx, 1);
                displayEventsInSidebar(rightSidebar, rightSidebarBg, app, updateMoneyDisplay);
            }
        });
        rightSidebar.addChild(eventContainer);
    });
}
