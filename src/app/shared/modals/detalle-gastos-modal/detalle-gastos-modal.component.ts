import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HelpersService } from '../../../services/helpers.service';
import {
  AccordionButtonDirective,
  AccordionComponent,
  AccordionItemComponent,
  AccordionModule,
  ColorModeService,
  TemplateIdDirective,
} from '@coreui/angular';
import { LoginService } from '../../../services/login.service';
import { FacturaDetalleFormComponent } from '../../components/forms/factura-detalle-form/factura-detalle-form.component';
import logger from '../../utils/logger';
import { Gasto, MetodoPagoGasto } from '../../../models/Gasto.model';
import { stringValue } from '../../utils/constants/function-value';

@Component({
  selector: 'app-detalle-gastos-modal',
  standalone: true,
  imports: [
    CommonModule,
    FacturaDetalleFormComponent,
    AccordionComponent,
    AccordionItemComponent,
    TemplateIdDirective,
    AccordionButtonDirective,
    AccordionModule,
  ],
  templateUrl: './detalle-gastos-modal.component.html',
  styleUrl: './detalle-gastos-modal.component.scss',
})
export class DetalleGastosModalComponent {
  @Input() Gastos: Gasto[] = []; // antes era Gasto
  Total = 0;
  stringFuntion = stringValue;
  // @Output() ResponseFacturaCreate = new EventEmitter<string>();

  activeModal = inject(NgbActiveModal);
  _HelpersService = inject(HelpersService);
  #colorModeService = inject(ColorModeService);
  _LoginService = inject(LoginService);

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    logger.log('Gasto', this.Gastos);

    this.Total = this.sumarTodosLosMetodos(this.Gastos);
  }
  ngOnChanges(): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    // logger.log('Gasto', this.Gastos);
  }

  FormsValues(event: any) {
    logger.log('event', event);
    // this.ResponseFacturaCreate.emit(event);
  }

  sumarTodosLosDetalles(Gasto: Gasto): number {
    const total =
      Gasto.metodo_pago?.reduce(
        (total: number, metodo_pago: MetodoPagoGasto) => {
          const monto = Number(metodo_pago?.monto || '0');
          return total + monto;
        },
        0,
      ) || 0;
    return total;
  }

  sumarTodosLosMetodos(gastos: any): number {
    return gastos.reduce((acumulador: any, gasto: any) => {
      const subtotal = gasto.metodo_pago.reduce(
        (acc: any, mp: any) => acc + parseFloat(mp.monto),
        0,
      );
      return acumulador + subtotal;
    }, 0);
  }

  getLabelBySection(section: string): string {
    const labels: { [key: string]: string } = {
      gasto: 'Gasto',
      nomina: 'Nómina',
    };
    return labels[section] || 'Registro';
  }
}
