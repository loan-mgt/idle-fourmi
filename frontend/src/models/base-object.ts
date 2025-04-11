export class BaseObject {
    private _level: number;
    private _multiplicatorBonus: number;

    private _x: number;
    private _y: number;
    private _width: number;
    private _height: number;


    constructor(_x: number, _y: number) {
        this._level = 1;
        this._multiplicatorBonus = 1;
        this._width = 1;
        this._height = 1;
        this._x = _x;
        this._y = _y;
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


    get x(): number {
        return this._x;
    }

    set x(value: number) {
        this._x = value;
    }

    get y(): number {
        return this._y;
    }

    set y(value: number) {
        this._y = value;
    }

    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
    }

    get height(): number {
        return this._height;
    }

    set height(value: number) {
        this._height = value;
    }
}