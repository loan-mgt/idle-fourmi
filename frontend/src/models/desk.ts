import {BaseObject} from "@/models/item.ts";
import type {Employee} from "@/models/employee.ts";

export class Desk extends  BaseObject{
    private _employee: Employee[] = [];
    private _maxNumberEmployee: number;

    constructor(maxNumberEmployee = 1) {
        super();
        this._maxNumberEmployee = maxNumberEmployee;
    }


    get employee(): Employee[] {
        return this._employee;
    }

    set employee(value: Employee[]) {
        this._employee = value;
    }

    get maxNumberEmployee(): number {
        return this._maxNumberEmployee;
    }

    set maxNumberEmployee(value: number) {
        this._maxNumberEmployee = value;
    }
}

export class MaxiDesk extends Desk {
    constructor(maxNumberEmployee = 2) {
        super(maxNumberEmployee);
    }
}