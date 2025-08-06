import { CommonModule } from '@angular/common';
import {
  AccordionModule,
  ButtonModule,
  CardModule,
  ColorModeService,
  GridModule,
  ModalModule,
  SpinnerComponent,
  Tabs2Module,
  TemplateIdDirective,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { FormModule } from '@coreui/angular';
import { Component, inject, HostListener, effect } from '@angular/core';
import { NgbModal, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { of, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
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
import { FacturarClienteModalComponent } from '../../../shared/modals/facturar-cliente-modal/facturar-cliente-modal.component';
import { NOW } from '../../../shared/utils/constants/filtro';
import { ServicioService } from '../../../services/servicios.service';
import { Servicios } from '../../../models/Servicios.model';
import { LoginService } from '../../../services/login.service';
import { FacturaPedidoService } from '../../../services/factura_pedido.service';
import { FacturaDetalle } from '../../../models/FacturaDetail';
import { FacturaDetalleService } from '../../../services/factura_detalle.service';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';
import { numberValue } from '../../../shared/utils/constants/function-value';

@Component({
  selector: 'app-factura-insertar2',
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
    AccordionModule,
    SpinnerComponent,
    AccordionModule,
    TemplateIdDirective,
  ],
  templateUrl: './factura-insertar2.component.html',
  styleUrl: './factura-insertar2.component.scss',
})
export class FacturaInsertar2Component {
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
  public _FacturaPedidoService = inject(FacturaPedidoService);
  public _FacturaDetalleService = inject(FacturaDetalleService);

  EmpleadoList: Empleado[] = [];
  Servicios: Servicios[] = [];
  Productos: Producto[] = [];
  MetodosPagos: MetodoPago[] = [];
  Clientes: Cliente[] = [];

  FacturasDetalles: any[] = [];
  estadosPagos: any[] = [];

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

  scrollPosition = 0;

  constructor() {
    effect(() => {
      this._LoginService.getUserData();
      this.getEmpleados();
      this.getServicios();
      this.getProductos();
      this.getMetodosPagos();
      this.getClientes();
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

  actualizarEstadoPago(item: any, index: number) {
    const indiceExistente = this.estadosPagos.findIndex(
      (elemento) =>
        elemento.empleado_id === item.empleado_id && elemento.index === index
    );

    if (indiceExistente !== -1) {
      // Ya existe, actualizamos
      this.estadosPagos[indiceExistente] = { ...item, index };
    } else {
      // No existe, lo agregamos
      this.estadosPagos.push({ ...item, index });
    }

    // logger.log('Estados de pago actualizados:', this.estadosPagos);
  }

  validarEstadoPago(index: number, empleado_id: number): boolean | null {
    const item = this.estadosPagos.find(
      (elemento) =>
        elemento.index === index && elemento.empleado_id === empleado_id
    );

    return item ? item.validacion : null; // o false por defecto si preferís
  }

  getEmpleados() {
    this.loaderEmpleados = true;

    this._EmpleadosService
      .getEmpleadoes({
        ...this.ParametrosURL,
        factura_model: '1',
        factura_detalle_model: '1',
        factura_producto_model: '1',
        fecha_creacion_factura: NOW.format('YYYY-MM-DD'),
        total_facturado: '1',
        local_id: this._LoginService.getUserData().local.id,
        estado_detalle: 1,
      })
      .pipe(takeUntil(this.destruir$))
      .subscribe((data: Empleado[]) => {
        this.loaderEmpleados = false;
        this.EmpleadoList = [...data];
        data.forEach((empleado) => {
          empleado.facturas?.forEach((factura) => {
            let empleadoId = empleado.id;
            factura.factura_detalle?.forEach((fdetalle) => {
              this._FacturaPedidoService.definirPosicion(
                Number(empleadoId),
                Number(fdetalle.id)
              );
            });
          });
        });
        // logger.log(data);
      });
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
          motivo: formValues.comentario,
        })
        // .pipe(delay(3000))
        .pipe(
          takeUntil(this.destruir$),
          catchError((err) => {
            if (err.status === 401) {
              Swal.mixin({
                customClass: {
                  container: this.#colorModeService.getStoredTheme(
                    environment.SabinosTheme
                  ),
                },
              }).fire({
                title: 'No autorizado',
                text: 'Contraseña incorrecta o sesión expirada.',
                icon: 'error',
              });
            } else {
              Swal.mixin({
                customClass: {
                  container: this.#colorModeService.getStoredTheme(
                    environment.SabinosTheme
                  ),
                },
              }).fire({
                title: 'Error',
                text: 'Ocurrió un error al eliminar la factura.',
                icon: 'error',
              });
              console.error('Error:', err);
            }

            // Detenemos el flujo devolviendo un observable vacío
            return of(null);
          })
        )
        .subscribe((data: any) => {
          if (!data) return; // Si ocurrió un error, salimos
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

          let EmpleadoId = this.EmpleadoList.findIndex(
            (empleadoFind) => empleadoFind.id === empleado_id
          );

          this._FacturaPedidoService.eliminarPorFacturaDetalleId(
            Number(facturaDetalle.id)
          );

          if (this.EmpleadoList[EmpleadoId].facturas) {
            this.EmpleadoList[EmpleadoId].facturas[0].factura_detalle =
              this.EmpleadoList[EmpleadoId].facturas[0].factura_detalle?.filter(
                (facturaDFilter) => facturaDFilter.id !== facturaDetalle.id
              );
          }
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

    //   }
    // });
  }

  agregarFactura(empleadiId: any) {
    const modalRef = this._ModalServiceNgB.open(FacturarClienteModalComponent);
    modalRef.componentInstance.Clientes = this.Clientes;
    modalRef.componentInstance.MetodosPagos = this.MetodosPagos;
    modalRef.componentInstance.Servicios = this.Servicios;
    modalRef.componentInstance.empleado_id = empleadiId;

    modalRef.componentInstance.ResponseFacturaCreate.subscribe((data: any) => {
      // logger.log('datacreateFactura', data);
      const EmpleadoResponse = [...data];
      const empleadoIndex = this.EmpleadoList.findIndex(
        (empleado) => empleado.id === EmpleadoResponse[0].empleado_id
      );
      // logger.log('empleadoIndex', empleadoIndex);
      // logger.log(
      //   'this.EmpleadoList[empleadoIndex].',
      //   this.EmpleadoList[empleadoIndex]
      // );
      // logger.log(
      //   'this.EmpleadoList[empleadoIndex].facturas',
      //   this.EmpleadoList[empleadoIndex].facturas
      // );
      if (empleadoIndex !== -1 && this.EmpleadoList[empleadoIndex].facturas) {
        // Actualizamos solo la propiedad 'factura' para el empleado encontrado

        // EmpleadoResponse[0].factura_detalle.forEach((factura: Factura) => {
        //   let empleadoId = factura.empleado_id;
        //   factura.factura_detalle?.forEach((fdetalle) => {
        //     this._FacturaPedidoService.definirPosicion(
        //       Number(empleadoId),
        //       Number(fdetalle.id)
        //     );
        //   });
        // });

        this.EmpleadoList[empleadoIndex].facturas = [...EmpleadoResponse];
        this.getClientes();
      }
    });
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
