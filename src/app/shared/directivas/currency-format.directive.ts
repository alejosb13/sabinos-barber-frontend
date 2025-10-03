import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[appCurrencyFormat]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencyFormatDirective),
      multi: true,
    },
  ],
})
export class CurrencyFormatDirective implements ControlValueAccessor {
  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: any): void {
    const input = event.target;
    let value = input.value;

    // Remover todo excepto números y comas
    value = value.replace(/[^\d,]/g, '');

    // Permitir solo una coma decimal
    const parts = value.split(',');
    if (parts.length > 2) {
      value = parts[0] + ',' + parts.slice(1).join('').substring(0, 2);
    }

    // Limitar decimales a 2 dígitos
    if (parts.length === 2 && parts[1].length > 2) {
      parts[1] = parts[1].substring(0, 2);
      value = parts.join(',');
    }

    // Formatear con puntos como separadores de miles
    const formatted = this.formatNumber(value);

    // Actualizar el valor en el input
    if (input.value !== formatted) {
      input.value = formatted;

      // Mantener la posición del cursor
      const cursorPosition = input.selectionStart;
      setTimeout(() => {
        input.setSelectionRange(cursorPosition, cursorPosition);
      });
    }

    // Convertir a número para el form control (usando punto como decimal)
    const numericValue = this.parseNumber(formatted);
    this.onChange(numericValue);
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
  }

  @HostListener('focus', ['$event'])
  onFocus(event: any): void {
    // Opcional: comportamiento especial al hacer foco
  }

  private formatNumber(value: string): string {
    if (!value) return '';

    const parts = value.split(',');
    let integerPart = parts[0];
    const decimalPart = parts[1];

    // Formatear la parte entera con puntos como separadores de miles
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Reunir las partes
    return decimalPart !== undefined
      ? `${integerPart},${decimalPart}`
      : integerPart;
  }

  private parseNumber(formattedValue: string): number {
    if (!formattedValue) return 0;

    // Remover puntos (separadores de miles) y reemplazar coma por punto para parseFloat
    const numericString = formattedValue.replace(/\./g, '').replace(',', '.');
    return parseFloat(numericString) || 0;
  }

  // ControlValueAccessor methods
  writeValue(value: any): void {
    if (value !== null && value !== undefined) {
      const formatted = this.formatValueFromControl(value);
      this.el.nativeElement.value = formatted;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled;
  }

  private formatValueFromControl(value: number): string {
    if (value === null || value === undefined || isNaN(value)) return '';

    // Convertir número a string con formato argentino
    const parts = value.toString().split('.');
    let integerPart = parts[0];
    const decimalPart = parts[1];

    // Formatear parte entera con puntos
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Reunir con coma como separador decimal
    return decimalPart ? `${integerPart},${decimalPart}` : integerPart;
  }
}
