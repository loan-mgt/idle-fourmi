export class Employee {
    private _euroPerTick: number;
    private _level: number = 1;

    private _multiplicatorBonus: number = 1;

    constructor(euroPerTick = 1) {
        this._euroPerTick = euroPerTick;
    }


    get euroPerTick(): number {
        return this._euroPerTick;
    }

    set euroPerTick(value: number) {
        this._euroPerTick = value;
    }

    get level(): number {
        return this._level;
    }

    set level(value: number) {
        this._level = value;
    }

    get multiplicatorBonus(): number {
        return this._multiplicatorBonus;
    }

    set multiplicatorBonus(value: number) {
        this._multiplicatorBonus = value;
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