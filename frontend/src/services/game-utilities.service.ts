import {GameService} from "@/services/game.service";
import {Desk} from "@/models/desk";
import {Employee} from "@/models/employee";
import {BaseObject} from "@/models/base-object";
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

        if (object instanceof Desk) {
            const desk: Desk = object;

            desk.employees.forEach(employee => {
                // Base argent généré par un employé
                let employeeMoney = employee.euroPerTick * employee.level * employee.multiplicatorBonus;

                // On multiplie par le level du DESK
                employeeMoney *= desk.level * desk.multiplicatorBonus;

                const plant = checkEmployeePlant(employee);
                if (plant) {
                    employeeMoney *= plant.multiplicatorBonus;
                }

                // On a finit pour l'employee, on add l'argent
                moneyToAdd += employeeMoney;
            });
        }

    })

    return moneyToAdd;
}

export function checkEmployeePlant(employee: Employee): Plant | undefined {
    GameService.GAME_OBJECTS.forEach(object => {
        if (object instanceof Plant) {
            const plant: Plant = object;
            const x = employee.x;
            const y = employee.y;
            if (((plant.x - plant.actionRadius) <= x && x < (plant.x + plant.width + plant.actionRadius) &&
                ((plant.y - plant.actionRadius) <= y && y < (plant.y + plant.height + plant.actionRadius)))) {
                return object;
            }
        }
    });
    return undefined;
}