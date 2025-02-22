import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
      },
      {
        path: '',
        loadComponent: () =>
          import('./factura-listado/factura-listado.component').then(
            (m) => m.FacturaListadoComponent
          ),
        data: {
          title: 'Listado',
        },
      },
      {
        // Ruta de edición con el parámetro dinámico :id
        path: 'editar/:id',
        loadComponent: () =>
          import('./factura-editar/factura-editar.component').then(
            (m) => m.FacturaEditarComponent
          ),
        data: {
          title: 'Editar',
        },
      },
      {
        path: 'insertar',
        loadComponent: () =>
          import('./factura-insertar/factura-insertar.component').then(
            (m) => m.FacturaInsertarComponent
          ),
        data: {
          title: 'Agregar',
        },
      },
      {
        path: 'pedido',
        loadComponent: () =>
          import('./factura-pedido/factura-pedido.component').then(
            (m) => m.FacturaPedidoComponent
          ),
        data: {
          title: 'Pedido',
        },
      },
      {
        path: 'detalle/:id',
        loadComponent: () =>
          import('./factura-detalle/factura-detalle.component').then(
            (m) => m.FacturaDetalleComponent
          ),
        data: {
          title: 'Detalle',
        },
      },
    ],
  },
];
