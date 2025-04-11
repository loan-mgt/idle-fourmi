import {BaseObject} from "@/models/base-object.ts";

export class Plant extends BaseObject {
    private _actionRadius: number = 2;

    constructor(_multiplicatorBonus = 1.1) {
        super(_multiplicatorBonus);
    }

    get actionRadius(): number {
        return this._actionRadius;
    }

    set actionRadius(value: number) {
        this._actionRadius = value;
    }
}