import {AbstractControl, ValidatorFn} from '@angular/forms';

export function emailValidator(control: AbstractControl):{[key:string]:any}| null{
    const emailTemplate = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(control.value);
    return emailTemplate ? null : {'emailError':{value: control.value}};
}