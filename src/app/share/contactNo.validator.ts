import {AbstractControl, ValidatorFn} from '@angular/forms';

export function contactNoValidator(control: AbstractControl):{[key:string]:any}| null{
    const contactNoTemplate = /[0-9]{10}/.test(control.value) && control.value.length === 10;
    return contactNoTemplate ? null : {'contactNoError':{value: control.value}};
}