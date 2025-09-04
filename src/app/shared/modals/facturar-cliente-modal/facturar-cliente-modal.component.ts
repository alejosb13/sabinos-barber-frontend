import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HelpersService } from '../../../services/helpers.service';
import { ColorModeService } from '@coreui/angular';
import { LoginService } from '../../../services/login.service';
import { FacturaDetalleFormComponent } from '../../components/forms/factura-detalle-form/factura-detalle-form.component';
import { Cliente } from '../../../models/Cliente.model';
import { MetodoPago } from '../../../models/MetodoPago.model';
import logger from '../../utils/logger';
import { Servicios } from '../../../models/Servicios.model';

@Component({
  selector: 'app-facturar-cliente-modal',
  standalone: true,
  imports: [CommonModule, FacturaDetalleFormComponent],
  templateUrl: './facturar-cliente-modal.component.html',
  styleUrl: './facturar-cliente-modal.component.scss',
})
export class FacturarClienteModalComponent {
  @Input() Clientes: Cliente[] = [];
  @Input() MetodosPagos: MetodoPago[] = [];
  @Input() Servicios: Servicios[] = [];
  @Input() empleado_id!: number;

  @Output() ResponseFacturaCreate = new EventEmitter<string>();

  activeModal = inject(NgbActiveModal);
  _HelpersService = inject(HelpersService);
  _LoginService = inject(LoginService);

  FormsValues(event: any) {
    logger.log('event', event);
    this.ResponseFacturaCreate.emit(event);
  }

  ngOnDestroy(): void {
    this.ResponseFacturaCreate.complete();
  }
}
