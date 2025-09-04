import {
  Component,
  effect,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import {
  FormGroup,
  FormArray,
  ValidationErrors,
  FormControl,
  Validators,
} from '@angular/forms';
import {
  VentasProductosCrudFormBuilder,
  agregarVentaArray,
  agregarMetodoPagoArray,
} from './utils/form';
import {
  VentasCrudValidators,
  VentasProductosCrudErrorMessages,
} from './utils/validations';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import {
  ButtonDirective,
  ColComponent,
  ColorModeService,
  FormFloatingDirective,
  FormModule,
  FormSelectDirective,
  ModalModule,
  RowComponent,
  SpinnerComponent,
} from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MetodoPago } from '../../../../models/MetodoPago.model';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  OperatorFunction,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { MetodoPagoService } from '../../../../services/metodos_pago.service';
import { Venta } from '../../../../models/Venta.model';
import { ValidMessagesFormComponent } from '../../valid-messages-form/valid-messages-form.component';
import { DirectivesModule } from '../../../directivas/directives.module';
import { Cliente } from '../../../../models/Cliente.model';
import { Producto } from '../../../../models/Producto.model';
import { ProductosService } from '../../../../services/productos.service';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import logger from '../../../utils/logger';
import { ParametersUrl } from '../../../../models/Parameter.model';
import { ClientesService } from '../../../../services/clientes.service';
import { IconDirective } from '@coreui/icons-angular';
import { LoginService } from '../../../../services/login.service';

@Component({
  selector: 'app-ventas-productos-crud-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CommonModule,
    RowComponent,
    ColComponent,
    FormFloatingDirective,
    FormSelectDirective,
    FormModule,
    ReactiveFormsModule,
    ValidMessagesFormComponent,
    ModalModule,
    DirectivesModule,
    NgbTypeaheadModule,
    ButtonDirective,
    IconDirective,
    SpinnerComponent,
  ],
  templateUrl: './ventas-productos-crud-form.component.html',
  styleUrl: './ventas-productos-crud-form.component.scss',
})
export class VentasProductosCrudFormComponent {
  #colorModeService = inject(ColorModeService);
  _MetodoPagoService = inject(MetodoPagoService);
  _ProductosService = inject(ProductosService);
  _LoginService = inject(LoginService);
  _ClientesService = inject(ClientesService);
  private destruir$: Subject<void> = new Subject<void>();

  @Output() FormsValues = new EventEmitter<any>();
  readonly ErrorMessages = VentasProductosCrudErrorMessages;
  VentasForm: FormGroup = VentasProductosCrudFormBuilder();
  @Input() Venta!: Venta;

  loadingMetodosPagos: boolean = false;
  MetodosPagos: MetodoPago[] = [];

  loadingProductos: boolean = false;
  Productos: Producto[] = [];

  LoadingSearchClient: boolean = false;
  Clientes: Cliente[] = [];

  Local_id!: number;
  User_id!: number;

  constructor() {
    effect((a) => {
      this.eventChangeLocal();
    });
  }

  ngOnInit(): void {
    this.getMetodosPagos();
    this.getProductos();
    this.VentasForm.valueChanges.subscribe((val) => {
      logger.log('control', this.VentasForm.controls);
      // logger.log('val', val);
    });

    if (this.Venta) {
      this.setDataFormVentas();
    }
  }

  eventChangeLocal() {
    const USER_DATA = this._LoginService.getUserData();
    // logger.log('USER_DATA', USER_DATA);
    this.Local_id = Number(USER_DATA.local.id);
    this.User_id = Number(USER_DATA.id);

    // logger.log('Local_id', this.Local_id);
    // logger.log('User_id', this.User_id);

    this.VentasForm.patchValue({
      local_id: this.Local_id,
      user_id: this.User_id,
    });
  }

  setDataFormVentas() {
    logger.log('this.Venta', this.Venta);
    this.VentasForm.patchValue({
      cliente_id: this.Venta.cliente,
    });

    const productos =
      this.Venta.venta_detalle?.map(
        (item: any) =>
          new FormGroup({
            producto_id: new FormControl(item.producto_id, [
              ...VentasCrudValidators['user_id'],
            ]),
            cantidad: new FormControl(item.cantidad, [
              ...VentasCrudValidators['cantidad'],
            ]),
            precio_unitario: new FormControl(item.precio_unitario, [
              ...VentasCrudValidators['precio_unitario'],
            ]),
            precio: new FormControl(item.precio, [
              ...VentasCrudValidators['precio'],
            ]),
            id: new FormControl(item.id),
          })
      ) ?? [];

    // Reemplazar el FormArray con los nuevos valores
    this.VentasForm.setControl('ventas', new FormArray(productos), {
      emitEvent: true,
    });

    const metodo_pago =
      this.Venta.metodo_pago?.map(
        (item: any) =>
          new FormGroup(
            {
              metodo_pago_id: new FormControl(item.metodo_pago_id, [
                ...VentasCrudValidators['metodo_pago_id'],
              ]),
              monto: new FormControl(item.monto, [
                ...VentasCrudValidators['monto'],
              ]),
              id: new FormControl(item.id),
            },
            { updateOn: 'change' }
          )
      ) ?? [];
    logger.log('metodo_pago', metodo_pago);

    // Reemplazar el FormArray con los nuevos valores
    this.VentasForm.setControl('metodos_pago', new FormArray(metodo_pago), {
      emitEvent: true,
    });
  }

  // Getters para los form arrays
  get VentasFormArray(): FormArray {
    return this.VentasForm.get('ventas') as FormArray;
  }

  get MetodosPagoFormArray(): FormArray {
    return this.VentasForm.get('metodos_pago') as FormArray;
  }

  agregarVenta() {
    agregarVentaArray(this.VentasForm);
  }

  eliminarVenta(index: number) {
    logger.log('index', index);
    this.VentasFormArray.removeAt(index);
  }

  agregarMetodoPago() {
    agregarMetodoPagoArray(this.VentasForm);
  }

  eliminarMetodoPago(index: number) {
    logger.log('index', index);
    this.MetodosPagoFormArray.removeAt(index);
  }

  getControl(name: string): FormControl {
    return this.VentasForm.get(name) as FormControl;
  }

  // Utilidad para mostrar errores en controles simples
  getControlError(name: string): ValidationErrors | null {
    const control = this.VentasForm.get(name);
    return control && control.touched && control.invalid
      ? control.errors
      : null;
  }

  // Utilidad para mostrar errores en ventas
  getVentaFormControlError(
    index: number,
    controlName: string
  ): ValidationErrors | null {
    const ventaGroup = this.VentasFormArray.at(index) as FormGroup;
    const control = ventaGroup.get(controlName);
    return control && control.touched && control.invalid
      ? control.errors
      : null;
  }

  // Utilidad para mostrar errores en métodos de pago
  getMetodoPagoFormControlError(
    index: number,
    controlName: string
  ): ValidationErrors | null {
    const mpGroup = this.MetodosPagoFormArray.at(index) as FormGroup;
    const control = mpGroup.get(controlName);
    return control && control.touched && control.invalid
      ? control.errors
      : null;
  }

  formatterValue = (x: { nombre: string; apellido: string } | string) => {
    // logger.log('x', x);
    return typeof x === 'string' ? x : x.nombre || '' + ' ' + x.apellido || '';
  };

  searchClient: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      tap(() => (this.LoadingSearchClient = true)),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((valorInput) => {
        let listadoFilter: ParametersUrl = {
          estado: 1,
          disablePaginate: '1',
          filtro: valorInput,
          link: null,
        };
        // logger.log('aa', valorInput);
        return this._ClientesService.getClientes(listadoFilter).pipe(
          catchError(() => {
            this.LoadingSearchClient = true;
            return of([]);
          }),
          map((value) => {
            this.LoadingSearchClient = false;

            logger.log('value', value);

            return value;
          })
        );
      })
    );

  getMetodosPagos() {
    this.loadingMetodosPagos = true;
    this._MetodoPagoService
      .getMetodoPago({
        estado: 1,
        disablePaginate: '1',
        link: null,
      })
      // .pipe(delay(3000))
      .pipe(takeUntil(this.destruir$))
      .subscribe((data: MetodoPago[]) => {
        this.loadingMetodosPagos = false;
        this.MetodosPagos = [...data];
      });
  }

  getProductos() {
    this.loadingProductos = true;
    this._ProductosService
      .getProductos({
        estado: 1,
        disablePaginate: '1',
        link: null,
        local_id: this.Local_id,
      })
      // .pipe(delay(3000))
      .pipe(takeUntil(this.destruir$))
      .subscribe((data: Producto[]) => {
        this.loadingProductos = false;
        this.Productos = [...data];
      });
  }

  changeCantidad(ventasGroup: any) {
    const cantidad = ventasGroup.get('cantidad');
    const precioUnitario = ventasGroup.get('precio_unitario');
    if (cantidad && precioUnitario) {
      let precio = precioUnitario.value * cantidad.value;

      ventasGroup.patchValue({
        // precio_unitario: DETALLE_PRODUCTO_SELECCIONADO?.precio,
        precio: precio,
      });
    }
  }

  changeProducto(producGroup: any) {
    logger.log('producGroup', producGroup);
    const producto_id = producGroup.get('producto_id');
    const cantidad = producGroup.get('cantidad');
    const gratis = producGroup.get('gratis');

    const DETALLE_PRODUCTO_SELECCIONADO = this.Productos.find(
      (producto) => producto.id === producto_id.value
    );
    logger.log('DETALLE_PRODUCTO_SELECCIONADO', DETALLE_PRODUCTO_SELECCIONADO);

    cantidad.enable();
    // gratis.enable();
    cantidad.reset();
    cantidad.clearValidators();
    cantidad.setValidators([
      Validators.required,
      Validators.maxLength(10),
      Validators.min(1),
      Validators.max(Number(DETALLE_PRODUCTO_SELECCIONADO?.cantidad)),
    ]);

    producGroup.patchValue({
      cantidad: Number(DETALLE_PRODUCTO_SELECCIONADO?.cantidad) >= 1 ? 1 : 0,
      precio_unitario: DETALLE_PRODUCTO_SELECCIONADO?.precio,
      precio: DETALLE_PRODUCTO_SELECCIONADO?.precio,
    });

    // Forzar validación y mostrar errores si existen
    cantidad.updateValueAndValidity();
    cantidad.markAsTouched();
  }

  sendValueFom() {
    logger.log('this.VentasForm.controls ', this.VentasForm.controls);
    if (this.VentasForm.valid) {
      const VALUES_RESPONSE = this.VentasForm.getRawValue();
      logger.log('VALUES_RESPONSE', VALUES_RESPONSE);

      this.FormsValues.emit({
        ...VALUES_RESPONSE,
        // cliente_id: VALUES_RESPONSE.cliente_id.id,
        cliente_id:
          typeof VALUES_RESPONSE.cliente_id === 'string'
            ? VALUES_RESPONSE.cliente_id
            : VALUES_RESPONSE.cliente_id.id,
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

  ngOnDestroy(): void {
    // Completa el Subject para cancelar todas las suscripciones activas
    this.destruir$.next();
    this.destruir$.complete();
  }
}
