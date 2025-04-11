
export class Plant {
    private _actionRadius: number = 2;

    private _bonus: number;

    constructor(bonus = 1.1) {
        this._bonus = bonus;
    }

    get actionRadius(): number {
        return this._actionRadius;
    }

    set actionRadius(value: number) {
        this._actionRadius = value;
    }

    get bonus(): number {
        return this._bonus;
    }

    set bonus(value: number) {
        this._bonus = value;
    }
}