import {BaseObject, TypeEnum} from "@/models/base-object";

export class Plant extends BaseObject {
    private _actionRadius: number = 2;
    static sprite: string = "/src/assets/sprites/plant.png";

    constructor(_x: number, _y: number, _multiplicatorBonus = 1.1) {
        super(_x, _y);
        this.multiplicatorBonus = _multiplicatorBonus;
        this.type = TypeEnum.PLANT;
    }

    get actionRadius(): number {
        return this._actionRadius;
    }

    set actionRadius(value: number) {
        this._actionRadius = value;
    }
}
