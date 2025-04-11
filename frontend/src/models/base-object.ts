export class BaseObject {
    private _level: number;
    private _multiplicatorBonus: number;

    private _position?: Position;
    private _width: number;
    private _height: number;


    constructor(_level = 1, _multiplicatorBonus = 1, _width: number = 1, _height: number = 1) {
        this._level = _level;
        this._multiplicatorBonus = _multiplicatorBonus;
        this._width = _width;
        this._height = _height;
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


    get position(): Position | undefined {
        return this._position;
    }

    set position(value: Position | undefined) {
        this._position = value;
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

export class Position {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}