import {BaseObject, TypeEnum} from "@/models/base-object";

export class Desk extends BaseObject {
    private _euroPerTick: number = 1;
    static sprite: string = "/src/assets/sprites/desk.png";

    constructor(_x: number, _y: number, maxNumberEmployee = 1) {
        super(_x, _y);
        this.width = 2;
        this.height = 1;
        this.type = TypeEnum.DESK;
    }

    get euroPerTick(): number {
        return this._euroPerTick;
    }

    set euroPerTick(value: number) {
        this._euroPerTick = value;
    }
}

export class MaxiDesk extends Desk {
    constructor(_x: number, _y: number, maxNumberEmployee = 2) {
        super(_x, _y, maxNumberEmployee);
        this.width = 4;
        this.height = 4;
        this.euroPerTick = 4;
    }
}