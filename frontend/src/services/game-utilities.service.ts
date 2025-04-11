import {GameService} from "@/services/game.service";
import {Desk} from "@/models/desk";
import {BaseObject, TypeEnum} from "@/models/base-object";
import {Plant} from "@/models/plant";


export function getObjectAtPosition(x: number, y: number): BaseObject | undefined {
    for (let object of GameService.GAME_OBJECTS) {
        if ((object.x <= x && x < (object.x + object.width) && (object.y <= y && y < (object.y + object.height)))) {
            return object;
        }
    }
    return undefined;
}



export function calculateTickMoney(): number {
    let moneyToAdd: number = 0;


    GameService.GAME_OBJECTS.forEach(object => {
        // On prend les bureaux

        if (object.type === TypeEnum.DESK) {
            const desk = object as Desk;

            // Base argent généré par un employé
            let employeeMoney = desk.euroPerTick * desk.level * desk.multiplicatorBonus;

            // On multiplie par le level du DESK
            employeeMoney *= desk.level * desk.multiplicatorBonus;

            const plant = checkDeskPlant(desk);
            if (plant) {
                employeeMoney *= plant.multiplicatorBonus;
            }

            // On a finit pour l'employee, on add l'argent
            moneyToAdd += employeeMoney;
        }

    })

    return moneyToAdd;
}

export function checkDeskPlant(desk: Desk): Plant | undefined {
    GameService.GAME_OBJECTS.forEach(object => {
        if (object.type === TypeEnum.PLANT) {
            const plant = object as Plant;
            const x = desk.x;
            const y = desk.y;
            if (((plant.x - plant.actionRadius) <= x && x < (plant.x + plant.width + plant.actionRadius) &&
                ((plant.y - plant.actionRadius) <= y && y < (plant.y + plant.height + plant.actionRadius)))) {
                return object;
            }
        }
    });
    return undefined;
}

export function initGame(): void {
    const bureau = new Desk(1, 1);

    GameService.GAME_OBJECTS.push(bureau);
}

export function loadSave(): void {

}