import type {Employee} from "@/models/employee.ts";

export class Desk {
    private _employee: Employee[] = [];
    private _maxNumberEmployee: number;

    private _multiplicatorBonus: number = 1;

    constructor(maxNumberEmployee = 1) {
        this._maxNumberEmployee = maxNumberEmployee;
    }


    get employee(): Employee[] {
        return this._employee;
    }

    set employee(value: Employee[]) {
        this._employee = value;
    }

    get multiplicatorBonus(): number {
        return this._multiplicatorBonus;
    }

    set multiplicatorBonus(value: number) {
        this._multiplicatorBonus = value;
    }
}

export class MaxiDesk extends Desk {
    constructor(maxNumberEmployee = 2) {
        super(maxNumberEmployee);
    }


}