import { inject, Injectable, Signal, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Empleado } from '../models/Empleado.model';
import { Listado } from '../models/Listados.model';
import { HelpersService } from './helpers.service';
import logger from '../shared/utils/logger';

export type EmpleadoResponse = Empleado[] | Listado<Empleado>;

@Injectable({
  providedIn: 'root',
})
export class FacturaPedidoService {
  // Signal que almacena el arreglo con los valores requeridos
  private _facturaDetalle = signal<
    {
      total_productos: number;
      total_servicio: number;
      id_factura_detalle: number;
      empleado_id: number; // Nuevo campo agregado
    }[]
  >([]);

  // Método para obtener el Signal (solo lectura para otros componentes)
  get facturaDetalle(): Signal<
    {
      total_productos: number;
      total_servicio: number;
      id_factura_detalle: number;
      empleado_id: number;
    }[]
  > {
    return this._facturaDetalle;
  }

  // Método para definir una posición en el array con id_empleado y id_factura_detalle
  definirPosicion(empleado_id: number, id_factura_detalle: number) {
    let detalles = this._facturaDetalle();

    // Verificamos si la combinación ya existe
    let existe = detalles.some(
      (detalle) =>
        detalle.empleado_id === empleado_id &&
        detalle.id_factura_detalle === id_factura_detalle
    );

    if (!existe) {
      // Si no existe, la agregamos con totales en 0
      detalles.push({
        empleado_id,
        id_factura_detalle,
        total_servicio: 0,
        total_productos: 0,
      });
      this._facturaDetalle.set([...detalles]);
    }

    // logger.log('definirPosicion', this._facturaDetalle());
  }

  // Método para eliminar una posición en el array con  id_factura_detalle
  eliminarPorFacturaDetalleId(id_factura_detalle: number) {
    let detalles = this._facturaDetalle();

    // Filtramos los que no tengan el id_factura_detalle indicado
    let nuevosDetalles = detalles.filter(
      (detalle) => detalle.id_factura_detalle !== id_factura_detalle
    );

    // Actualizamos el signal con el nuevo array
    this._facturaDetalle.set(nuevosDetalles);

    // logger.log('eliminarPorFacturaDetalleId', this._facturaDetalle());
  }

  // Método para actualizar total_servicio sin modificar los IDs
  actualizarTotalServicio(id_factura_detalle: number, nuevoTotal: number) {
    let detalles = this._facturaDetalle().map((detalle) =>
      detalle.id_factura_detalle === id_factura_detalle
        ? { ...detalle, total_servicio: nuevoTotal }
        : detalle
    );

    this._facturaDetalle.set(detalles);
    // logger.log('actualizarTotalServicio', this._facturaDetalle());
  }

  // Método para actualizar total_productos sin modificar los IDs
  actualizarTotalProductos(id_factura_detalle: number, nuevoTotal: number) {
    let detalles = this._facturaDetalle().map((detalle) =>
      detalle.id_factura_detalle === id_factura_detalle
        ? { ...detalle, total_productos: nuevoTotal }
        : detalle
    );

    this._facturaDetalle.set(detalles);
    // logger.log('actualizarTotalProductos', this._facturaDetalle());
  }

  // Método para sumar total_servicio + total_productos por EMPLEADO
  sumarTotalesPorEmpleado(id_empleado: any): number {
    return this._facturaDetalle()
      .filter((detalle) => detalle.empleado_id === id_empleado)
      .reduce(
        (suma, detalle) =>
          suma + detalle.total_servicio + detalle.total_productos,
        0
      );
  }

  // Método para sumar total_servicio + total_productos por FACTURA DETALLE
  sumarTotalesPorFactura(id_factura_detalle: any): number {
    return this._facturaDetalle()
      .filter((detalle) => detalle.id_factura_detalle === id_factura_detalle)
      .reduce(
        (suma, detalle) =>
          suma + detalle.total_servicio + detalle.total_productos,
        0
      );
  }
}
