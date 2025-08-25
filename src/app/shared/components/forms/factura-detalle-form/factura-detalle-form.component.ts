import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import {
  ButtonDirective,
  ColComponent,
  ColorModeService,
  FormFloatingDirective,
  FormModule,
  ModalModule,
  RowComponent,
  SpinnerComponent,
} from '@coreui/angular';
import { FacturaDetalleCrudFormBuilder } from './utils/form';
import { CommonModule } from '@angular/common';
import { ValidMessagesFormComponent } from '../../valid-messages-form/valid-messages-form.component';
import { PedidoCrudErrorMessages } from './utils/validations';
import Swal from 'sweetalert2';
import logger from 'src/app/shared/utils/logger';
import { environment } from 'src/environments/environment';
import { DirectivesModule } from '../../../directivas/directives.module';
import { PedidoService } from '../../../../services/pedido.service';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  OperatorFunction,
  Subject,
} from 'rxjs';
import { MetodoPago } from '../../../../models/MetodoPago.model';
import { IconDirective } from '@coreui/icons-angular';
import { ClientesService } from '../../../../services/clientes.service';
import { NgbActiveModal, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Cliente } from '../../../../models/Cliente.model';
import { LoginService } from '../../../../services/login.service';
import { FacturaDetalleService } from '../../../../services/factura_detalle.service';
import { Servicios } from '../../../../models/Servicios.model';
import { HelpersService } from '../../../../services/helpers.service';

@Component({
  selector: 'app-factura-detalle-form',
  standalone: true,
  imports: [
    CommonModule,
    RowComponent,
    ColComponent,
    ButtonDirective,
    FormFloatingDirective,
    FormModule,
    ReactiveFormsModule,
    ValidMessagesFormComponent,
    ModalModule,
    DirectivesModule,
    SpinnerComponent,
    IconDirective,
    NgbTypeaheadModule,
  ],
  templateUrl: './factura-detalle-form.component.html',
  styleUrl: './factura-detalle-form.component.scss',
})
export class FacturaDetalleFormComponent {
  private destruir$: Subject<void> = new Subject<void>();
  readonly PedidoCrudErrorMessages = PedidoCrudErrorMessages;

  PedidoCrudForm = FacturaDetalleCrudFormBuilder();
  #colorModeService = inject(ColorModeService);
  _PedidoService = inject(PedidoService);
  _ClientesService = inject(ClientesService);
  _LoginService = inject(LoginService);
  activeModal = inject(NgbActiveModal);
  _FacturaDetalleService = inject(FacturaDetalleService);
  _HelpersService = inject(HelpersService);

  @Input() Clientes: Cliente[] = [];
  @Input() MetodosPagos: MetodoPago[] = [];
  @Input() Servicios: Servicios[] = [];
  @Input() empleado_id!: number;

  @Output() FormsValues = new EventEmitter<any>();

  Pedidos: any[] = [];
  gastos: any[] = [];
  TotalFactura: number = 0;
  User_id: number;
  Local_id!: number;

  constructor() {
    let datoUsuario = this._LoginService.userData().user;
    this.User_id = datoUsuario.id;
    this.Local_id = Number(datoUsuario.local.id);
  }

  ngOnInit(): void {}

  ngOnChanges(): void {}

  getControlError(name: string): ValidationErrors | null {
    const control = this.PedidoCrudForm.controls
      ? this.PedidoCrudForm.get(name)
      : null;

    return control && control.touched && control.invalid
      ? control.errors
      : null;
  }

  getControl(name: string): FormControl {
    return this.PedidoCrudForm.get(name) as FormControl;
  }

  setFormValues() {
    // this.PedidoCrudForm.patchValue({
    //   nombre: this.Pedido.nombre,
    //   // apellido: this.Pedido.nombre,
    // });
  }

  formatterValue = (x: { nombre: string; apellido: string } | string) => {
    // logger.log('x', x);
    return typeof x === 'string' ? x : x.nombre + ' ' + x.apellido;
  };

  searchClient: OperatorFunction<string, Cliente[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((valorInput) => valorInput.length > 2), // Solo busca si hay más de 2 caracteres
      // tap(() => logger.log('Buscando clientes', this.Clientes)),
      map((valorInput) => {
        const clientesFiltrados = this.Clientes.filter(
          (cliente) =>
            cliente.nombre.toLowerCase().includes(valorInput.toLowerCase()) // Filtra por nombre
        );
        // logger.log('Clientes filtrados:', clientesFiltrados);
        return clientesFiltrados;
      })
    );

  sendValueFom() {
    logger.log('sendValueFom', this.PedidoCrudForm);
    logger.log('this.PedidoCrudForm.valid', this.PedidoCrudForm.valid);
    const LOCAL_ID = this._LoginService.getUserData().local_id;

    if (this.PedidoCrudForm.valid) {
      // Swal.fire({
      //   title: '¿Desea continuar?',
      //   text: 'Esta acción creara una factura.',
      //   icon: 'info',
      //   showCancelButton: true,
      //   confirmButtonText: 'Sí, continuar',
      //   cancelButtonText: 'No, quedarme aquí',
      //   customClass: {
      //     container: this.#colorModeService.getStoredTheme(
      //       environment.SabinosTheme
      //     ),
      //   },
      // }).then((result) => {
      //   if (result.isConfirmed) {
      // this._Router.navigateByUrl(`/clientes/editar/${data.id}`);
      let valuesFrom: any = this.PedidoCrudForm.getRawValue();
      let payloadFactura = {
        ...valuesFrom,
        cliente_id:
          typeof valuesFrom.cliente_id == 'string'
            ? valuesFrom.cliente_id
            : Number(valuesFrom.cliente_id.id),
        empleado_id: this.empleado_id,
        user_id: this.User_id,
        local_id: this.Local_id,
      };

      this._HelpersService.loaderSweetAlert({
        title: 'Creando Factura',
        text: 'Esto puede demorar un momento.',
      });

      // agregar logica de llamado a la api
      this._FacturaDetalleService
        .createFactura(payloadFactura)
        .subscribe((data) => {
          // logger.log('resukltado factura creada', data);
          this.FormsValues.emit(data);
          Swal.fire({
            // title: ',
            text: '!Agregado con éxito!',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            customClass: {
              container: this.#colorModeService.getStoredTheme(
                environment.SabinosTheme
              ),
            },
          });
          this.activeModal.close();
        });
    }
    // });
    // } else {
    //   Swal.mixin({
    //     customClass: {
    //       container: this.#colorModeService.getStoredTheme(
    //         environment.SabinosTheme
    //       ),
    //     },
    //   }).fire({
    //     text: 'Complete todos los campos obligatorios',
    //     icon: 'warning',
    //   });
    // }
  }
}
