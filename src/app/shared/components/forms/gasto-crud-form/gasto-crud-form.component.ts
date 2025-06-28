import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  AbstractControl,
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
  SpinnerModule,
} from '@coreui/angular';
import {
  agregarGasto,
  crearMetodosForm,
  GastoCrudFormBuilder,
  MontoItemForm,
} from './utils/form';
import { CommonModule } from '@angular/common';
import { GastoCrudErrorMessages } from './utils/validations';
import Swal from 'sweetalert2';
import logger from 'src/app/shared/utils/logger';
import { environment } from 'src/environments/environment';
import { DirectivesModule } from '../../../directivas/directives.module';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { Empleado } from 'src/app/models/Empleado.model';
import { Local } from '../../../../models/Local.model';
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
import { Nomina } from '../../../../models/Nomina.model';
import { Usuario } from '../../../../models/Usuario.model';
import { UsuarioesService } from '../../../../services/usuarios.service';
import { ValidMessagesFormComponent } from '../../valid-messages-form/valid-messages-form.component';
import { IconDirective } from '@coreui/icons-angular';
import { ParametersUrl } from '../../../../models/Parameter.model';
import { ProductosService } from '../../../../services/productos.service';
import { Producto } from '../../../../models/Producto.model';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { TipoGasto } from '../../../../models/TipoGasto.model';
import { TipoGastoService } from '../../../../services/tipo_gasto.service';
import { MetodoPago } from '../../../../models/MetodoPago.model';
import { MetodoPagoService } from '../../../../services/metodos_pago.service';

@Component({
  selector: 'app-gasto-crud-form',
  standalone: true,
  imports: [
    CommonModule,
    RowComponent,
    ColComponent,
    ButtonDirective,
    FormFloatingDirective,
    FormModule,
    ReactiveFormsModule,
    ModalModule,
    DirectivesModule,
    SpinnerModule,
    ValidMessagesFormComponent,
    IconDirective,
    NgbTypeaheadModule,
  ],
  templateUrl: './gasto-crud-form.component.html',
  styleUrl: './gasto-crud-form.component.scss',
})
export class GastoCrudFormComponent {
  GastoCrudForm = GastoCrudFormBuilder();
  readonly GastoCrudErrorMessages = GastoCrudErrorMessages;

  private destruir$: Subject<void> = new Subject<void>();

  LoadingSearchClient: boolean = false;

  loadingEmpleados: boolean = false;
  Empleados: Empleado[] = [];

  loadingUsuarios: boolean = false;
  Usuarios: Usuario[] = [];

  loadingTipoGasto: boolean = false;
  TiposGasto: TipoGasto[] = [];

  loadingMetodosPagos: boolean = false;
  MetodosPagos: MetodoPago[] = [];

  #colorModeService = inject(ColorModeService);
  private _EmpleadosService = inject(EmpleadosService);
  private _ProductosService = inject(ProductosService);
  private _UsuarioService = inject(UsuarioesService);
  private _TipoGastoService = inject(TipoGastoService);
  private _MetodoPagoService = inject(MetodoPagoService);

  @Input() Nomina!: Nomina;
  @Output() FormsValues = new EventEmitter<any>();

  loadingLocales = false;
  Locales: Local[] = [];

  ngOnInit(): void {
    this.getEmpleados();
    this.getUsuarios();
    this.getTipoGasto();
    this.getMetodosPagos();

    // this.GastoCrudForm.valueChanges.subscribe((data) => {
    //   logger.log('data', data);
    //   logger.log('GastoCrudForm.', this.GastoCrudForm.controls.gastos);
    // });

    this.GastoCrudForm.controls.tipo_usuario.valueChanges.subscribe((value) => {
      if (value) {
        this.GastoCrudForm.controls.empleado_id.enable();
      } else {
        this.GastoCrudForm.controls.empleado_id.disable();
      }
    });
  }

  ngOnChanges(): void {
    if (this.Nomina) this.setFormValues();
  }

  formatterValue = (x: { marca: string } | string) =>
    typeof x === 'string' ? x : x.marca;

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
        return this._ProductosService.getProductos(listadoFilter).pipe(
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

  eventInputTypeHead({ item }: { item: Producto }, posicion: number) {
    setTimeout(() => {
      logger.log('item', item);
      // this.clienteModel = `${item.nombre} ${item.apellido}`;
      // this.clienteId = Number(item.id);
      // const controlInversion = this.getControlFormArray();

      this.gastos.controls[posicion].patchValue({
        // producto_id: item.id,
        // cantidad: item.cantidad,
        precio_unitario: item.precio,
      });
      this.gastos.controls[posicion].clearValidators();
      this.gastos.controls[posicion].get('cantidad')?.addValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(item.cantidad),
        // Validators.maxLength(item.cantidad),
        Validators.pattern(/^[0-9]+$/),
      ]);
      // this.gastos.controls[posicion].
    }, 10);
  }

  // Getter para acceder al FormArray de gastos
  get gastos() {
    return this.GastoCrudForm.get('gastos') as FormArray;
  }

  getControlError(name: string): ValidationErrors | null {
    const control = this.GastoCrudForm.get(name);
    return control && control.touched && control.invalid
      ? control.errors
      : null;
  }

  // Obtener errores de controles dentro del FormArray
  getGastoControlError(
    index: number,
    controlName: string
  ): ValidationErrors | null {
    const gastoFormGroup = this.gastos.at(index) as FormGroup;
    const control = gastoFormGroup.get(controlName);
    return control && control.touched && control.invalid
      ? control.errors
      : null;
  }

  getControl(name: string): FormControl {
    return this.GastoCrudForm.get(name) as FormControl;
  }

  agregarNuevoGasto() {
    agregarGasto(this.GastoCrudForm);
  }

  setFormValues() {
    // Implementar lógica para cargar valores si es necesario
    logger.log(this.Nomina);
  }

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

  getMetodosPagoControls(gasto: AbstractControl): AbstractControl[] {
    const metodos = gasto.get('metodos_pagos') as FormArray;
    return metodos?.controls ?? [];
  }

  getMetodosPagosForm(i: number): FormArray<FormGroup<MontoItemForm>> {
    return this.gastos.at(i).get('metodos_pagos') as FormArray<
      FormGroup<MontoItemForm>
    >;
  }

  getMetodoPagoError(i: number, j: number, campo: keyof MontoItemForm) {
    return this.getMetodosPagosForm(i).at(j).get(campo)?.errors;
  }

  agregarMetodoPago(i: number): void {
    this.getMetodosPagosForm(i).push(crearMetodosForm());
  }

  eliminarMetodoPago(i: number, j: number): void {
    this.getMetodosPagosForm(i).removeAt(j);
  }

  getEmpleados() {
    this.loadingEmpleados = true;
    this._EmpleadosService
      .getEmpleadoes({
        estado: 1,
        disablePaginate: '1',
        link: null,
      })
      .pipe(takeUntil(this.destruir$))
      .subscribe((data: Empleado[]) => {
        this.loadingEmpleados = false;
        this.Empleados = [...data];
      });
  }

  getTipoGasto() {
    this.loadingTipoGasto = true;
    this._TipoGastoService
      .getTipoGasto({
        estado: 1,
        disablePaginate: '1',
        link: null,
      })
      .pipe(takeUntil(this.destruir$))
      .subscribe((data: TipoGasto[]) => {
        this.loadingTipoGasto = false;
        this.TiposGasto = [...data];
      });
  }

  getUsuarios() {
    this.loadingUsuarios = true;
    this._UsuarioService
      .getUsuarioes({
        estado: 1,
        disablePaginate: '1',
        link: null,
      })
      .pipe(takeUntil(this.destruir$))
      .subscribe((data: Usuario[]) => {
        this.loadingUsuarios = false;
        this.Usuarios = [...data];
      });
  }

  chageTypeUser(input: any) {
    logger.log('input', input);

    if (input.checked) {
      this.GastoCrudForm.controls.empleado_id.disable();
    } else {
      this.GastoCrudForm.controls.empleado_id.enable();
    }
  }
  chageTypeGasto(gasto: any) {
    const tipoGastoControl = gasto.get('tipo_gasto_id');
    const productoIdControl = gasto.get('producto_id');
    const cantidadControl = gasto.get('cantidad');
    // const precioUnitarioControl = gasto.get('precio_unitario');
    const precioControl = gasto.get('precio');

    if (tipoGastoControl) {
      if (this.isProducto(gasto.value)) {
        productoIdControl.enable(); // Habilita el control
        cantidadControl.enable(); // Habilita el control
        // precioUnitarioControl.enable(); // Habilita el control
        precioControl.disable(); // Deshabilita el control
        gasto.patchValue({
          producto_id: '',
          cantidad: 0,
          // precio_unitario: 0,
        });
      } else {
        gasto.patchValue({
          precio: 0,
        });
        productoIdControl.disable(); // Deshabilita el control
        cantidadControl.disable(); // Deshabilita el control
        // precioUnitarioControl.disable(); // Deshabilita el control
        precioControl.enable(); // Deshabilita el control
      }
    }
  }

  changeCantidad(gasto: any) {
    const cantidad = gasto.get('cantidad').value;
    const precioUnitario = gasto.get('precio_unitario').value;
    let precio = precioUnitario * cantidad;

    gasto.patchValue({
      precio: precio,
    });
  }

  sendValueFom() {
    if (this.GastoCrudForm.valid) {
      // let gastos = this.GastoCrudForm.value.gastos || [];
      let gastos = this.GastoCrudForm.controls.gastos.getRawValue() || [];
      gastos = gastos.map((g: any) => {
        console.log(g);

        return {
          tipo_gasto_id: Number(g.tipo_gasto_id),
          precio: Number(g.precio),
          cantidad: g.cantidad ? Number(g.cantidad) : 0,
          precio_unitario: g.precio_unitario ? Number(g.precio_unitario) : 0,
          producto_id: g.producto_id ? g.producto_id.id : null,
          // metodo_pago_id: g.metodo_pago_id,
          metodos_pagos: g.metodos_pagos.map((m: any) => {
            return {
              metodo_pago_id: m.metodo_pago_id,
              monto: m.monto ? Number(m.monto) : 0,
            };
          }),
        };
      });

      const FORM_DATA = {
        ...this.GastoCrudForm.getRawValue(),
        // ...this.GastoCrudForm.value,
        gastos: gastos,
        empleado_id:
          this.GastoCrudForm.value.empleado_id == 0
            ? null
            : this.GastoCrudForm.value.empleado_id,
      };
      logger.log('FORM_DATA', FORM_DATA);
      this.FormsValues.emit(FORM_DATA);
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

  ValidarBtnForm() {
    if (this.GastoCrudForm.valid) {
      return true;
    } else {
      return false;
    }
  }

  eliminarGasto(index: number) {
    logger.log('index', index);
    if (this.gastos.length > 0 && index >= 0 && index < this.gastos.length) {
      this.gastos.removeAt(index);
    }
  }

  isProducto(value: any) {
    // logger.log('value', value.tipo_gasto);
    if (this.TiposGasto.length > 0) {
      let TGastos = this.TiposGasto.find(
        (tgasto) => tgasto.descripcion.toLowerCase() == 'producto'
      );
      return TGastos?.id == value.tipo_gasto_id;
    }
    return false;
  }

  ngOnDestroy(): void {
    this.destruir$.next();
    this.destruir$.complete();
  }
}
