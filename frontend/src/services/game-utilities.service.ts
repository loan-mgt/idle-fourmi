import type {BaseObject} from "@/models/base-object.ts";
import {GameService} from "@/services/game.service.ts";


export function getObjectAtPosition(x: number, y: number): BaseObject | undefined {
    for (let object of GameService.GAME_OBJECTS) {
        if ((object.x <= x && x <= (object.x + object.width) && (object.y <= y && y <= (object.y + object.height)))) {
            return object;
        }
    }
    return undefined;
}

export function calculateTickMoney(): number {
    let moneyToAdd: number = 0;



    return moneyToAdd;
}