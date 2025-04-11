import {BaseObject} from "@/models/base-object.ts";
import type {Employee} from "@/models/employee.ts";

export class Desk extends BaseObject{
    private _employee: Employee[] = [];
    private _maxNumberEmployee: number;

    constructor(_x:number,_y:number, maxNumberEmployee = 1) {
        super(_x ,_y);
        this._maxNumberEmployee = maxNumberEmployee;
        this.width = 2;
        this.height = 1;
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
    constructor(_x:number,_y:number, maxNumberEmployee = 2) {
        super(_x ,_y, maxNumberEmployee);
        this.width = 4;
        this.height = 4;
    }
}