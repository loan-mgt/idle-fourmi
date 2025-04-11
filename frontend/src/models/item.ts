export class BaseObject {
    private _level: number;
    private _multiplicatorBonus: number;

    constructor(_level = 1, _multiplicatorBonus = 1) {
        this._level = _level;
        this._multiplicatorBonus = _multiplicatorBonus;
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