import { CommonModule } from '@angular/common';
import {
  ButtonModule,
  CardModule,
  ColorModeService,
  GridModule,
  ModalModule,
  SpinnerComponent,
  Tabs2Module,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { FormModule } from '@coreui/angular';
import { Component, inject, HostListener, effect } from '@angular/core';
import { NgbModal, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { ClientesService } from '../../../services/clientes.service';
import { EmpleadosService } from '../../../services/empleados.service';
import { ParametersUrl } from '../../../models/Parameter.model';
import logger from '../../../shared/utils/logger';
import { Cliente } from '../../../models/Cliente.model';
import { Empleado } from '../../../models/Empleado.model';
import { Producto } from '../../../models/Producto.model';
import { MetodoPagoService } from '../../../services/metodos_pago.service';
import { MetodoPago } from '../../../models/MetodoPago.model';
import { DirectivesModule } from '../../../shared/directivas/directives.module';
import { HelpersService } from '../../../services/helpers.service';
import { PedidoNewFormComponent } from '../../../shared/components/forms/pedido-new-form/pedido-new-form.component';
import { ProductosService } from '../../../services/productos.service';
import { LocalesService } from '../../../services/locales.service';
import { Local } from '../../../models/Local.model';
import { FacturarClienteModalComponent } from '../../../shared/modals/facturar-cliente-modal/facturar-cliente-modal.component';
import { NOW } from '../../../shared/utils/constants/filtro';
import { ServicioService } from '../../../services/servicios.service';
import { Servicios } from '../../../models/Servicios.model';
import { LoginService } from '../../../services/login.service';
import { ActivatedRoute } from '@angular/router';
import { FacturasService } from '../../../services/facturas.service';
import { Factura } from '../../../models/Factura.model';
import { FacturaPedidoService } from '../../../services/factura_pedido.service';
import Swal from 'sweetalert2';
import { FacturaDetalle } from '../../../models/FacturaDetail';
import { environment } from '../../../../environments/environment';
import { FacturaDetalleService } from '../../../services/factura_detalle.service';
import { numberValue } from '../../../shared/utils/constants/function-value';

@Component({
  selector: 'app-factura-editar',
  standalone: true,
  imports: [
    CardModule,
    GridModule,
    FormModule,
    IconDirective,
    CommonModule,
    NgbTypeaheadModule,
    FormsModule,
    ModalModule,
    ButtonModule,
    DirectivesModule,
    PedidoNewFormComponent,
    Tabs2Module,
    FacturarClienteModalComponent,
    SpinnerComponent,
  ],
  templateUrl: './factura-editar.component.html',
  styleUrl: './factura-editar.component.scss',
})
export class FacturaEditarComponent {
  private destruir$: Subject<void> = new Subject<void>();
  public numberValue = numberValue;

  #colorModeService = inject(ColorModeService);
  private _HelpersService = inject(HelpersService);
  private _ClientesService = inject(ClientesService);
  private _EmpleadosService = inject(EmpleadosService);
  private _ServicioService = inject(ServicioService);
  private _ProductosService = inject(ProductosService);
  private _MetodoPagoService = inject(MetodoPagoService);
  private _LoginService = inject(LoginService);
  private _ModalServiceNgB = inject(NgbModal);
  private _ActivatedRoute = inject(ActivatedRoute);
  _FacturaPedidoService = inject(FacturaPedidoService);
  private _FacturasService = inject(FacturasService);
  private _FacturaDetalleService = inject(FacturaDetalleService);

  // Empleado: Empleado = {
  //   nombre_completo: '',
  //   dni: '',
  //   local_id: 1,
  // };
  Servicios: Servicios[] = [];
  Productos: Producto[] = [];
  MetodosPagos: MetodoPago[] = [];
  Clientes: Cliente[] = [];
  Factura: Factura = {} as Factura;

  FacturasDetalles: any[] = [];

  private ParametrosURL: ParametersUrl = {
    allDates: false,
    link: null,
    disablePaginate: '1',
  };

  loaderEmpleados: boolean = false;
  loadingServicios: boolean = false;
  loadingProductos: boolean = false;
  loadingMetodosPagos: boolean = false;
  loaderClientes: boolean = true;
  loaderFacturas: boolean = true;
  Id!: number;
  EmpleadoId!: number;

  scrollPosition = 0;

  estadosPagos: boolean[] = [];

  constructor() {
    effect(() => {
      this._LoginService.getUserData();
      this.Id = Number(this._ActivatedRoute.snapshot.paramMap.get('id'));
      this.EmpleadoId = Number(
        this._ActivatedRoute.snapshot.paramMap.get('empleado_id')
      );

      // this.getEmpleados();
      this.getServicios();
      this.getProductos();
      this.getMetodosPagos();
      this.getClientes();
      this.getFacturas();
    });
  }
  ngOnInit(): void {
    // this.getEmpleados();
    // this.getServicios();
    // this.getProductos();
    // this.getMetodosPagos();
    // this.getClientes();
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.scrollPosition = window.scrollY || document.documentElement.scrollTop;
  }

  tabChange(event: any) {
    // logger.log(event);
  }

  ActualizarProductos(index: number) {
    // logger.log('index', index);
    this.getProductos();
  }

  // getEmpleados() {
  //   this.loaderEmpleados = true;

  //   this._EmpleadosService
  //     .getEmpleadoById(this.EmpleadoId)
  //     .pipe(takeUntil(this.destruir$))
  //     .subscribe((data: Empleado) => {
  //       this.loaderEmpleados = false;
  //       this.Empleado.nombre_completo = data.nombre_completo;
  //       this.Empleado.id = data.id;
  //       this.Empleado.dni = data.dni;
  //       this.Empleado.local_id = data.local_id;
  //       this.Empleado.estado = data.estado;

  //       logger.log(data);
  //     });
  // }

  getFacturas() {
    this.loaderFacturas = true;

    this._FacturasService
      .getFacturaById(this.Id, {
        ...this.ParametrosURL,
        // factura_model: '1',
        // factura_detalle_model: '1',
        // factura_producto_model: '1',
        // empleado_model: '1',
        user_model: '1',
        empleado_model: '1',
        factura_detalle_model: '1',
        estado: '1',
        disablePaginate: '1',
        // local_id: this._LoginService.getUserData().local.id,
      })
      .pipe(takeUntil(this.destruir$))
      .subscribe((data: Factura) => {
        this.loaderFacturas = false;
        this.Factura = { ...data };

        data.factura_detalle?.forEach((fdetalle) => {
          this._FacturaPedidoService.definirPosicion(
            Number(this.EmpleadoId),
            Number(fdetalle.id)
          );
        });

        // logger.log(this._FacturaPedidoService.facturaDetalle());
      });
  }

  actualizarEstadoPago(valor: boolean, index: number) {
    logger.log('Valor del pago:', valor, 'Index:', index);
    this.estadosPagos[index] = valor;
  }

  getServicios() {
    this.loadingServicios = true;

    this._ServicioService
      .getServicios({
        link: null,
        disablePaginate: '1',
      })
      // .pipe(delay(3000))
      .pipe(takeUntil(this.destruir$))
      .subscribe((data: Servicios[]) => {
        this.loadingServicios = false;
        this.Servicios = [...data];
        // logger.log(data);
      });
  }

  getProductos() {
    this.loadingProductos = true;

    this._ProductosService
      .getProductos({
        link: null,
        disablePaginate: '1',
      })
      // .pipe(delay(3000))
      .pipe(takeUntil(this.destruir$))
      .subscribe((data: Producto[]) => {
        this.loadingProductos = false;
        this.Productos = [...data];
        // logger.log(data);
      });
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

  getClientes() {
    this.loaderClientes = true;

    this._ClientesService
      .getClientes(this.ParametrosURL)
      // .pipe(delay(3000))
      .pipe(takeUntil(this.destruir$))
      .subscribe((data: Cliente[]) => {
        this.loaderClientes = false;
        this.Clientes = [...data];
        // logger.log(data);
      });
  }

  agregarFactura(empleadiId: any) {
    const modalRef = this._ModalServiceNgB.open(FacturarClienteModalComponent);
    modalRef.componentInstance.Clientes = this.Clientes;
    modalRef.componentInstance.MetodosPagos = this.MetodosPagos;
    modalRef.componentInstance.Servicios = this.Servicios;
    modalRef.componentInstance.empleado_id = empleadiId;

    // modalRef.componentInstance.ResponseFacturaCreate.subscribe((data: any) => {
    //   const EmpleadoResponse = [...data];
    //   const empleadoIndex = this.EmpleadoList.findIndex(
    //     (empleado) => empleado.id === EmpleadoResponse[0].empleado_id
    //   );

    //   if (
    //     empleadoIndex !== -1 &&
    //     (!this.EmpleadoList[empleadoIndex].facturas ||
    //       this.EmpleadoList[empleadoIndex].facturas.length === 0)
    //   ) {
    //     // Actualizamos solo la propiedad 'factura' para el empleado encontrado

    //     this.EmpleadoList[empleadoIndex].facturas = [...EmpleadoResponse];
    //     this.getClientes();
    //   }
    // });
  }

  async eliminarFacturaDetalle(
    facturaDetalle: FacturaDetalle,
    empleado_id: number
  ) {
    const { value: formValues } = await Swal.fire({
      title: 'Confirmación',
      html: `
        <div class="mb-3">
          <div class="mb-3 text-start">
            <label for="swal-password" class="form-label">Contraseña</label>
            <input
              id="swal-password"
              type="password"
              class="swal2-input form-control form-control-sm m-0"
              placeholder="Contraseña"
              maxlength="10"
            />
          </div>
          <div class="mb-3 text-start">
            <label for="swal-textarea" class="form-label">Motivo de eliminación</label>
            <textarea
              id="swal-textarea"
              class="swal2-textarea form-control form-control-sm m-0"
              placeholder="Escribe un motivo..."
            ></textarea>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar',
      customClass: {
        container: this.#colorModeService.getStoredTheme(
          environment.SabinosTheme
        ),
      },
      preConfirm: () => {
        const password = (
          document.getElementById('swal-password') as HTMLInputElement
        ).value;
        const comentario = (
          document.getElementById('swal-textarea') as HTMLTextAreaElement
        ).value;

        if (!password || !comentario) {
          Swal.showValidationMessage('Ambos campos son obligatorios');
          return;
        }

        return { password, comentario };
      },
    });

    if (formValues) {
      this._HelpersService.loaderSweetAlert({
        title: 'Eliminando',
        text: 'Esto puede demorar un momento.',
      });
      this._FacturaDetalleService
        .deleteFactura(Number(facturaDetalle.id), {
          password: formValues.password,
          comentario: formValues.comentario,
        })
        // .pipe(delay(3000))
        .pipe(takeUntil(this.destruir$))
        .subscribe((data: any) => {
          Swal.mixin({
            customClass: {
              container: this.#colorModeService.getStoredTheme(
                environment.SabinosTheme
              ),
            },
          }).fire({
            text: 'Factura eliminada',
            icon: 'success',
          });
          this.Factura.factura_detalle = this.Factura.factura_detalle?.filter(
            (facturaDFilter) => facturaDFilter.id !== facturaDetalle.id
          );
          // this.Clientes = [...data];
          // logger.log(data);
        });
      // Swal.fire({
      //   icon: 'success',
      //   title: 'Datos recibidos',
      //   html: `<p><strong>Contraseña:</strong> ${formValues.password}</p>
      //        <p><strong>Comentario:</strong> ${formValues.comentario}</p>`,
      // });
    }
    // Swal.fire({
    //   title: '¿Desea eliminar la factura?',
    //   text: 'Una vez que acepte se eliminará la factura',
    //   icon: 'info',
    //   showCancelButton: true,
    //   confirmButtonText: 'Sí, eliminar',
    //   cancelButtonText: 'No, quedarme aquí',
    //   customClass: {
    //     container: this.#colorModeService.getStoredTheme(
    //       environment.SabinosTheme
    //     ),
    //   },
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     this._HelpersService.loaderSweetAlert({
    //       title: 'Eliminando',
    //       text: 'Esto puede demorar un momento.',
    //     });
    //     this._FacturaDetalleService
    //       .deleteFactura(Number(facturaDetalle.id))
    //       // .pipe(delay(3000))
    //       .pipe(takeUntil(this.destruir$))
    //       .subscribe((data: any) => {
    //         Swal.mixin({
    //           customClass: {
    //             container: this.#colorModeService.getStoredTheme(
    //               environment.SabinosTheme
    //             ),
    //           },
    //         }).fire({
    //           text: 'Factura eliminada',
    //           icon: 'success',
    //         });
    //         this.Factura.factura_detalle = this.Factura.factura_detalle?.filter(
    //           (facturaDFilter) => facturaDFilter.id !== facturaDetalle.id
    //         );

    //         // let EmpleadoId = this.EmpleadoList.findIndex(
    //         //   (empleadoFind) => empleadoFind.id === empleado_id
    //         // );
    //         // if (this.EmpleadoList[EmpleadoId].facturas) {
    //         //   this.EmpleadoList[EmpleadoId].facturas[0].factura_detalle =
    //         //     this.EmpleadoList[
    //         //       EmpleadoId
    //         //     ].facturas[0].factura_detalle?.filter(
    //         //       (facturaDFilter) => facturaDFilter.id !== facturaDetalle.id
    //         //     );
    //         // }
    //         // this.Clientes = [...data];
    //         // logger.log(data);
    //       });
    //   }
    // });
  }

  FormsValues(Cliente: Cliente) {
    // logger.log(Cliente);

    this._HelpersService.loaderSweetAlert({
      title: 'Cargando',
      text: 'Esto puede demorar un momento.',
    });
    // this._ClientesService
    //   .createCliente(Cliente)
    //   .pipe(takeUntil(this.destruir$))
    //   .subscribe((data) => {
    //     this.loader = false;
    //     logger.log(data);
    //     Swal.mixin({
    //       customClass: {
    //         container: this.#colorModeService.getStoredTheme(
    //           environment.SabinosTheme
    //         ),
    //       },
    //     })
    //       .fire({
    //         text: 'Cliente agregado con éxito',
    //         icon: 'success',
    //       })
    //       .then((result) => {
    //         this._Router.navigateByUrl(`/clientes/editar/${data.id}`);
    //       });
    //   });
  }
}
