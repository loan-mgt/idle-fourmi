import {BaseObject} from "@/models/base-object.ts";

export class Employee extends BaseObject {
    private _euroPerTick: number;

    constructor(euroPerTick = 1) {
        super();
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
    constructor(euroPerTick = 1) {
        super(euroPerTick);
    }
}


export class Alternant extends Employee {
    constructor(euroPerTick = 2) {
        super(euroPerTick);
    }
}

export class Developer extends Employee {
    constructor(euroPerTick = 3) {
        super(euroPerTick);
    }
}