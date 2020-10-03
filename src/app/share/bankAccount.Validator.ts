import {AbstractControl, ValidatorFn} from '@angular/forms';

export function bankAccountValidator(control: AbstractControl):{[key:string]:any}| null{
    //const bankAccountTemplate = /[0-9]{9,18}/.test(control.value) && /^[0-9]+$/.test(control.value);
    const bankAccountTemplate = /\d{9,18}/.test(control.value)  && control.value.length < 18;
    return bankAccountTemplate ? null : {'bankAccountNoError':{value: control.value}};
}