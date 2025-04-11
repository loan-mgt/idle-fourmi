import { BaseObject } from "@/models/base-object";

export class Employee extends BaseObject {
    private _euroPerTick: number;
    //static sprite: string = "/src/assets/sprites/employee.png";

    constructor(_x: number, _y: number, euroPerTick = 1) {
        super(_x, _y);
        this._euroPerTick = euroPerTick;
    }


    get euroPerTick(): number {
        return this._euroPerTick;
    }

    set euroPerTick(value: number) {
        this._euroPerTick = value;
    }
}

export class Stagiaire extends Employee {
    constructor(_x: number, _y: number, euroPerTick = 1) {
        super(_x, _y, euroPerTick);
    }
}


export class Alternant extends Employee {
    constructor(_x: number, _y: number, euroPerTick = 2) {
        super(_x, _y, euroPerTick);
    }
}

export class Developer extends Employee {
    constructor(_x: number, _y: number, euroPerTick = 3) {
        super(_x, _y, euroPerTick);
    }
}
