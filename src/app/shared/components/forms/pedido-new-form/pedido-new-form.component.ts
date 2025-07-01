import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';

import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
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
import {
  agregarProductosArray,
  PedidoCrudFormBuilder,
  agregarMetodoPagoArray,
} from './utils/form';
import { CommonModule } from '@angular/common';
import { ValidMessagesFormComponent } from '../../valid-messages-form/valid-messages-form.component';
import {
  PedidoCrudErrorMessages,
  PedidoCrudValidators,
} from './utils/validations';
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
import { Producto } from '../../../../models/Producto.model';
import { ProductosService } from '../../../../services/productos.service';
import { MetodoPago } from '../../../../models/MetodoPago.model';
import { IconDirective } from '@coreui/icons-angular';
import { ClientesService } from '../../../../services/clientes.service';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Cliente } from '../../../../models/Cliente.model';
import { FacturaProductoService } from '../../../../services/factura_producto.service';
import { Servicios } from '../../../../models/Servicios.model';
import { FacturaDetalle } from '../../../../models/FacturaDetail';
import { FacturaPedidoService } from '../../../../services/factura_pedido.service';
import { FacturaDetalleService } from '../../../../services/factura_detalle.service';
import { LoginService } from '../../../../services/login.service';

@Component({
  selector: 'app-pedido-new-form',
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
  templateUrl: './pedido-new-form.component.html',
  styleUrl: './pedido-new-form.component.scss',
})
export class PedidoNewFormComponent {
  private destruir$: Subject<void> = new Subject<void>();
  readonly PedidoCrudErrorMessages = PedidoCrudErrorMessages;

  PedidoCrudForm = PedidoCrudFormBuilder();
  #colorModeService = inject(ColorModeService);
  _PedidoService = inject(PedidoService);
  _ClientesService = inject(ClientesService);
  _FacturaProductoService = inject(FacturaProductoService);
  _ProductosService = inject(ProductosService);
  _FacturaPedidoService = inject(FacturaPedidoService);
  _FacturaDetalleService = inject(FacturaDetalleService);
  _LoginService = inject(LoginService);

  @Input() PedidoDetail!: FacturaDetalle;
  @Input() Clientes: Cliente[] = [];
  @Input() MetodosPagos: MetodoPago[] = [];
  @Input() Productos: Producto[] = [];
  @Input() Servicios: Servicios[] = [];
  @Input() EmpleadoId!: number;

  @Output() FormsValues = new EventEmitter<any>();
  @Output() ActualizarProductos = new EventEmitter<any>();

  loadingServicios: boolean = false;
  loadingProductos: boolean = false;
  loadingMetodosPagos: boolean = false;

  // TotalFactura: number = 0;

  ngOnInit(): void {
    this.changeCantidad(this.PedidoCrudForm);

    // this.PedidoCrudForm.valueChanges.subscribe((value) => {
    //   // logger.log('value', value);
    //   // console.log('Total de precios:', totalPrecio);
    // });
    this.PedidoCrudForm.get('servicio_id')?.valueChanges.subscribe(() => {
      this.changeServices();
    });

    this.PedidoCrudForm.get('servicio_gratis')?.valueChanges.subscribe(() => {
      this.changeServices();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // logger.log('facturaDetalle', this._FacturaPedidoService.facturaDetalle());
    // logger.log('facturaDetalle', changes);

    if (this.EmpleadoId) {
      this._FacturaPedidoService.definirPosicion(
        Number(this.EmpleadoId),
        Number(this.PedidoDetail.id)
      );
    }

    if (this.PedidoDetail) this.setFormValues();
  }

  getControlError(name: string): ValidationErrors | null {
    const control = this.PedidoCrudForm.controls
      ? this.PedidoCrudForm.get(name)
      : null;

    return control && control.touched && control.invalid
      ? control.errors
      : null;
  }

  getProductoFormControlError(
    index: number,
    controlName: string
  ): ValidationErrors | null {
    const gastoFormGroup = this.ProductorFormArray.at(index) as FormGroup;
    const control = gastoFormGroup.get(controlName);
    return control && control.touched && control.invalid
      ? control.errors
      : null;
  }

  changeServices() {
    let isGratis = this.PedidoCrudForm.controls.servicio_gratis.value;
    let servicio_id = this.PedidoCrudForm.controls.servicio_id.value;
    let dataService = this.Servicios.find(
      (servicio) => servicio.id == servicio_id
    );

    let precioServicio = isGratis ? 0 : dataService?.precio;

    this._FacturaPedidoService.actualizarTotalServicio(
      Number(this.PedidoDetail.id),
      Number(precioServicio)
    );
  }

  getMetodoPagoFormControlError(
    index: number,
    controlName: string
  ): ValidationErrors | null {
    const gastoFormGroup = this.MetodosPagoFormArray.at(index) as FormGroup;
    const control = gastoFormGroup.get(controlName);
    return control && control.touched && control.invalid
      ? control.errors
      : null;
  }

  getControl(name: string): FormControl {
    return this.PedidoCrudForm.get(name) as FormControl;
  }

  setFormValues() {
    // logger.log('setFormValues', this.PedidoDetail);

    let cliente: any = this.Clientes.find(
      (cliente) => cliente.id === this.PedidoDetail.cliente_id
    );

    if (
      this.PedidoDetail.factura_producto &&
      this.PedidoDetail.factura_producto.length > 0
    ) {
      const productos = this.PedidoDetail.factura_producto.map(
        (item: any) =>
          // new FormGroup({
          //   producto_id: new FormControl(item.producto_id ?? null),
          //   cantidad: new FormControl(item.cantidad ?? 0),
          //   precio_unitario: new FormControl(item.precio_unitario ?? 0),
          //   precio: new FormControl(item.precio ?? 0),
          //   gratis: new FormControl(item.gratis ?? 0),
          //   pendiente: new FormControl(false),
          //   completado: new FormControl(false),
          //   editable: new FormControl(true),
          //   pendienteEliminado: new FormControl(false),
          // })
          new FormGroup(
            {
              producto_id: new FormControl(item.producto_id ?? null, [
                ...PedidoCrudValidators['producto_id'],
              ]),
              cantidad: new FormControl(item.cantidad ?? null, [
                ...PedidoCrudValidators['cantidad'],
              ]),
              precio_unitario: new FormControl(
                {
                  disabled: true,
                  value: item.gratis ? 0 : item.precio_unitario ?? null,
                },
                [...PedidoCrudValidators['precio_unitario']]
              ),
              precio: new FormControl(
                { disabled: true, value: item.precio ?? null },
                [...PedidoCrudValidators['precio']]
              ),
              gratis: new FormControl(item.gratis ?? null, [
                ...PedidoCrudValidators['gratis'],
              ]),
              facturtaProdutoId: new FormControl(item.id),
              pendiente: new FormControl(false),
              completado: new FormControl(false),
              editable: new FormControl(true),
              pendienteEliminado: new FormControl(false),
            },
            { updateOn: 'change' }
          )
      );

      // Reemplazar el FormArray con los nuevos valores
      this.PedidoCrudForm.setControl('productos', new FormArray(productos), {
        emitEvent: true,
      });
    }

    if (
      this.PedidoDetail.metodos_pago_detalle &&
      this.PedidoDetail.metodos_pago_detalle.length > 0
    ) {
      const MetodosPagos = this.PedidoDetail.metodos_pago_detalle.map(
        (item) =>
          // new FormGroup<PedidoMetodoPagoForm>({
          //   metodo_pago_id: new FormControl(null, [
          //     ...PedidoCrudValidators['metodo_pago_id'],
          //   ]),
          //   monto: new FormControl({ disabled: false, value: 0 }, [
          //     ...PedidoCrudValidators['precio'],
          //   ]),
          //   pendiente: new FormControl(false),
          //   completado: new FormControl(false),
          //   editable: new FormControl(false),
          //   pendienteEliminado: new FormControl(false),
          //   facturtaProdutoId: new FormControl(null),
          // })
          new FormGroup(
            {
              metodo_pago_id: new FormControl(
                Number(item.metodo_pago_id) ?? null,
                [...PedidoCrudValidators['metodo_pago_id']]
              ),
              monto: new FormControl(Number(item.monto) ?? null, [
                ...PedidoCrudValidators['precio'],
              ]),
              pendiente: new FormControl(false),
              completado: new FormControl(false),
              editable: new FormControl(true),
              pendienteEliminado: new FormControl(false),
              factura_detalle_metodo_pago_id: new FormControl(Number(item.id)),
            },
            { updateOn: 'change' }
          )
      );

      // Reemplazar el FormArray con los nuevos valores
      this.PedidoCrudForm.setControl(
        'metodos_pagos',
        new FormArray(MetodosPagos),
        {
          emitEvent: true,
        }
      );
    }
    this.PedidoCrudForm.patchValue({
      cliente_id: cliente,
      // metodo_pago_id: this.PedidoDetail.metodo_pago_id,
      servicio_id: this.PedidoDetail.servicio_id,
      servicio_gratis: this.PedidoDetail.gratis == 1 ? true : false,
      pendiente: false,
      completado: false,
      editable: true,
    });

    this.getValueFacturaTotal();

    let dataService = this.Servicios.find(
      (servicio) => servicio.id == this.PedidoCrudForm.get('servicio_id')?.value
    );
    this._FacturaPedidoService.actualizarTotalServicio(
      Number(this.PedidoDetail.id),
      this.PedidoDetail.gratis == 1 ? 0 : Number(dataService?.precio)
    );

    // logger.log('this.PedidoCrudForm', this.PedidoCrudForm.value);
  }

  getValueFacturaTotal() {
    const totalPrecio = this.ProductorFormArray.getRawValue().reduce(
      (acc, producto) => acc + (producto.precio || 0),
      0
    );
    // this.TotalFactura = totalPrecio;
    this._FacturaPedidoService.actualizarTotalProductos(
      Number(this.PedidoDetail.id),
      Number(totalPrecio)
    );
    // this.PedidoDetail.total = totalPrecio;
  }

  changeProducto(producGroup: any) {
    // logger.log('producGroup', producGroup);
    const producto_id = producGroup.get('producto_id');
    const cantidad = producGroup.get('cantidad');
    const gratis = producGroup.get('gratis');

    const DETALLE_PRODUCTO_SELECCIONADO = this.Productos.find(
      (producto) => producto.id === producto_id.value
    );
    // logger.log('DETALLE_PRODUCTO_SELECCIONADO', DETALLE_PRODUCTO_SELECCIONADO);

    cantidad.enable();
    gratis.enable();
    cantidad.reset();
    cantidad.clearValidators();
    cantidad.setValidators([
      Validators.required,
      Validators.maxLength(10),
      Validators.min(0),
      Validators.max(Number(DETALLE_PRODUCTO_SELECCIONADO?.cantidad)),
    ]);
    producGroup.patchValue({
      cantidad: Number(DETALLE_PRODUCTO_SELECCIONADO?.cantidad) >= 1 ? 1 : 0,
      precio_unitario: DETALLE_PRODUCTO_SELECCIONADO?.precio,
      precio: DETALLE_PRODUCTO_SELECCIONADO?.precio,
    });
  }

  changeCantidad(producGroup: any) {
    const cantidad = producGroup.get('cantidad');
    const precioUnitario = producGroup.get('precio_unitario');
    if (cantidad && precioUnitario) {
      let precio = precioUnitario.value * cantidad.value;

      producGroup.patchValue({
        // precio_unitario: DETALLE_PRODUCTO_SELECCIONADO?.precio,
        precio: precio,
      });
    }
  }

  get ProductorFormArray() {
    return this.PedidoCrudForm.get('productos') as FormArray;
  }

  agregarProducto() {
    agregarProductosArray(this.PedidoCrudForm);
  }

  get MetodosPagoFormArray() {
    // console.log(
    //   'MetodosPagoFormArray',
    //   this.PedidoCrudForm.get('metodos_pagos')
    // );

    return this.PedidoCrudForm.get('metodos_pagos') as FormArray;
  }

  agregarMetodoPago() {
    agregarMetodoPagoArray(this.PedidoCrudForm);
  }

  changeStatusGratis(producGroup: any) {
    // logger.log('producGroup', producGroup.value);
    const precioUnitario = producGroup.get('precio_unitario');
    const precio = producGroup.get('precio');

    if (producGroup.value.gratis) {
      precioUnitario.patchValue(0);
      precio.patchValue(0);
    } else {
      this.changeProducto(producGroup);
    }
    // agregarProductosArray(this.PedidoCrudForm);
  }

  guardarCambioFacturaDetalle() {
    logger.log(
      'guardarCambioFacturaDetalle',
      this.PedidoCrudForm.getRawValue()
    );
    // return false;
    this.PedidoCrudForm.patchValue({
      pendiente: true,
      completado: false,
      editable: false,
    });
    let values: any = this.PedidoCrudForm.getRawValue();
    // let cliente:any = values.cliente_id.id
    // agregarProductosArray(this.PedidoCrudForm);
    this._FacturaDetalleService
      .updateFactura(Number(this.PedidoDetail.id), {
        metodo_pago_id: values.metodo_pago_id,
        servicio_id: values.servicio_id,
        servicio_gratis: values.servicio_gratis,
        cliente_id: values.cliente_id.id,
      })
      .subscribe((data) => {
        this.PedidoCrudForm.patchValue({
          pendiente: false,
          completado: true,
          editable: false,
        });
        setTimeout(() => {
          this.PedidoCrudForm.patchValue({
            pendiente: false,
            completado: false,
            editable: true,
          });
        }, 1000);
      });
  }

  eliminarProducto(index: number, prod: any) {
    // logger.log('index', index);
    // logger.log('prod', prod);
    const PRODUCTO_ID = prod.get('facturtaProdutoId').value;

    if (!PRODUCTO_ID) {
      this.ProductorFormArray.removeAt(index);
      return;
    }

    Swal.fire({
      title: '¿Desea eliminar el producto?',
      text: 'Una vez que acepte se eliminará el producto',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No',
      customClass: {
        container: this.#colorModeService.getStoredTheme(
          environment.SabinosTheme
        ),
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.ProductorFormArray.at(index).patchValue({
          pendienteEliminado: true,
        });

        logger.log('PRODUCTO_ID', PRODUCTO_ID);
        this._FacturaProductoService
          .deleteFacturaProducto(PRODUCTO_ID)
          .subscribe((data) => {
            this.ProductorFormArray.at(index).patchValue({
              pendienteEliminado: false,
            });
            this.ProductorFormArray.removeAt(index);
            if (this.PedidoDetail.factura_producto) {
              this.PedidoDetail.factura_producto =
                this.PedidoDetail.factura_producto.filter(
                  (f_producto: any) => f_producto.id != PRODUCTO_ID
                );
            }
            this.getValueFacturaTotal();
          });

        // this.ActualizarProductos.emit(index);
      }
    });
  }

  guardarProducto(index: number, prod: any) {
    // logger.log('index', index);
    // logger.log('prod', prod.getRawValue());
    const ACCION = prod.get('editable').value;
    this.ProductorFormArray.at(index).patchValue({
      pendiente: true,
      completado: false,
      editable: false,
    });

    if (ACCION) {
      const PRODUCTO_ID = prod.get('facturtaProdutoId').value;
      // logger.log('PRODUCTO_ID', PRODUCTO_ID);
      // logger.log('ACCION', ACCION);

      this._FacturaProductoService
        .updateFacturaProducto(PRODUCTO_ID, {
          factura_detalle_id: this.PedidoDetail.id,
          producto_id: prod.get('producto_id').value,
          precio_unitario: prod.get('precio_unitario').value,
          precio: prod.get('precio').value,
          cantidad: prod.get('cantidad').value,
          gratis: prod.get('gratis').value,
        })
        .subscribe((data) => {
          this.ProductorFormArray.at(index).patchValue({
            pendiente: false,
            completado: true,
          });
          setTimeout(() => {
            this.ProductorFormArray.at(index).patchValue({
              pendiente: false,
              completado: false,
              editable: true,
            });
            this.getValueFacturaTotal();
          }, 1000);
        });
    } else {
      // logger.log('prod.get(editable).value', prod.get('editable').value);
      this._FacturaProductoService
        .createFacturaProducto({
          factura_detalle_id: this.PedidoDetail.id,
          producto_id: prod.get('producto_id').value,
          precio_unitario: prod.get('precio_unitario').value,
          precio: prod.get('precio').value,
          cantidad: prod.get('cantidad').value,
          gratis: prod.get('gratis').value,
        })
        .subscribe((data) => {
          this.ProductorFormArray.at(index).patchValue({
            pendiente: false,
            completado: true,
            facturtaProdutoId: data.id,
          });
          setTimeout(() => {
            this.ProductorFormArray.at(index).patchValue({
              pendiente: false,
              completado: false,
              editable: true,
            });
            this.getValueFacturaTotal();
          }, 1000);
        });
    }
  }

  eliminarMetodoPago(index: number, MetodoP: any) {
    // logger.log('index', index);

    Swal.fire({
      title: '¿Desea eliminar el metodo de pago?',
      text: 'Una vez que acepte se eliminará el producto',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, quedarme aquí',
      customClass: {
        container: this.#colorModeService.getStoredTheme(
          environment.SabinosTheme
        ),
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.MetodosPagoFormArray.at(index).patchValue({
          pendienteEliminado: true,
        });
        const FD_METODO_PAGO_ID = MetodoP.get(
          'factura_detalle_metodo_pago_id'
        ).value;
        logger.log('PRODUCTO_ID', FD_METODO_PAGO_ID);
        this._FacturaDetalleService
          .deleteMetodoPagoFactura(FD_METODO_PAGO_ID)
          .subscribe((data) => {
            this.MetodosPagoFormArray.at(index).patchValue({
              pendienteEliminado: false,
            });
            this.MetodosPagoFormArray.removeAt(index);
            if (this.PedidoDetail.factura_producto) {
              this.PedidoDetail.metodos_pago_detalle =
                this.PedidoDetail.metodos_pago_detalle?.filter(
                  (f_producto: any) => f_producto.id != FD_METODO_PAGO_ID
                );
            }
          });

        // this.ActualizarProductos.emit(index);
      }
    });
  }

  guardarMetodoPago(index: number, MetodoP: any) {
    // logger.log('index', index);
    const LOCAL_ID = this._LoginService.getUserData().local.id;
    const ACCION = MetodoP.get('editable').value;
    this.MetodosPagoFormArray.at(index).patchValue({
      pendiente: true,
      completado: false,
      editable: false,
    });

    if (ACCION) {
      const FD_METODO_PAGO_ID = MetodoP.get(
        'factura_detalle_metodo_pago_id'
      ).value;
      // logger.log('PRODUCTO_ID', PRODUCTO_ID);
      // logger.log('ACCION', ACCION);
      this._FacturaDetalleService
        .editarMetodoPagoFactura(
          {
            factura_detalle_id: Number(this.PedidoDetail.id),
            metodo_pago_id: MetodoP.get('metodo_pago_id').value,
            monto: MetodoP.get('monto').value,
            local_id: Number(LOCAL_ID),
          },
          FD_METODO_PAGO_ID
        )
        .subscribe((data) => {
          this.MetodosPagoFormArray.at(index).patchValue({
            pendiente: false,
            completado: true,
          });
          setTimeout(() => {
            this.MetodosPagoFormArray.at(index).patchValue({
              pendiente: false,
              completado: false,
              editable: true,
            });
          }, 1000);
        });
    } else {
      // logger.log('prod.get(editable).value', prod.get('editable').value);
      this._FacturaDetalleService
        .createMetodoPagoFactura({
          factura_detalle_id: Number(this.PedidoDetail.id),
          metodo_pago_id: MetodoP.get('metodo_pago_id').value,
          monto: MetodoP.get('monto').value,
          local_id: Number(LOCAL_ID),
        })
        .subscribe((data) => {
          this.MetodosPagoFormArray.at(index).patchValue({
            pendiente: false,
            completado: true,
            // facturtaProdutoId: data.id,
            metodo_pago_id: data.metodo_pago_id,
            factura_detalle_metodo_pago_id: data.id,
          });
          // logger.log('getRawValue', this.MetodosPagoFormArray.getRawValue());
          setTimeout(() => {
            this.MetodosPagoFormArray.at(index).patchValue({
              pendiente: false,
              completado: false,
              editable: true,
            });
          }, 1000);
        });
    }
  }

  formatterValue = (x: { nombre: string; apellido: string } | string) => {
    // logger.log('x', x);
    return typeof x === 'string' ? x : x.nombre || '' + ' ' + x.apellido || '';
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

    if (this.PedidoCrudForm.valid) {
      Swal.fire({
        title: '¿Desea continuar?',
        text: 'Una vez que acepte se guardará la información',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'No, quedarme aquí',
        customClass: {
          container: this.#colorModeService.getStoredTheme(
            environment.SabinosTheme
          ),
        },
      }).then((result) => {
        if (result.isConfirmed) {
          // this._Router.navigateByUrl(`/clientes/editar/${data.id}`);
          let valuesFrom: any = this.PedidoCrudForm.getRawValue();
          this.FormsValues.emit({
            ...valuesFrom,
            cliente_id:
              typeof valuesFrom.cliente_id == 'string'
                ? valuesFrom.cliente_id
                : Number(valuesFrom.cliente_id.id),
          });
        }
      });
    } else {
      Swal.mixin({
        customClass: {
          container: this.#colorModeService.getStoredTheme(
            environment.SabinosTheme
          ),
        },
      }).fire({
        text: 'Complete todos los campos obligatorios',
        icon: 'warning',
      });
    }
  }
}
