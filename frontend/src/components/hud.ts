import { Text, Container } from 'pixi.js';

export function createHUD(initialMoney: number) {
    const hudContainer = new Container();

    const gameTitle = new Text({
        text: 'IdleFourmi',
        style: {
            fontSize: 30,
            fill: 0xbb7ee0,
            align: 'left',
        }
    });
    gameTitle.x = 10;
    gameTitle.y = 10;
    hudContainer.addChild(gameTitle);

    const moneyDisplay = new Text({
        text: `Argent: ${initialMoney}`,
        style: {
            fontSize: 20,
            fill: 0x00ff00,
            align: 'left',
        }
    });
    moneyDisplay.x = 10;
    moneyDisplay.y = 50;
    hudContainer.addChild(moneyDisplay);

    return { hudContainer, gameTitle, moneyDisplay };
}

export function updateMoneyDisplay(moneyDisplay: Text, newAmount: number) {
    moneyDisplay.text = `Argent: ${newAmount}`;
}
