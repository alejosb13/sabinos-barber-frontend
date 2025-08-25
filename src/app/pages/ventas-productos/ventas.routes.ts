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
          import(
            './ventas-productos-listado/ventas-productos-listado.component'
          ).then((m) => m.VentasProductosListadoComponent),
        data: {
          title: 'Listado',
        },
      },
      {
        // Ruta de edición con el parámetro dinámico :id
        path: 'editar/:id',
        loadComponent: () =>
          import(
            './ventas-productos-editar/ventas-productos-editar.component'
          ).then((m) => m.VentasProductosEditarComponent),
        data: {
          title: 'Editar',
        },
      },
      {
        path: 'insertar',
        loadComponent: () =>
          import(
            './ventas-productos-insertar/ventas-productos-insertar.component'
          ).then((m) => m.VentasProductosInsertarComponent),
        data: {
          title: 'Agregar',
        },
      },
    ],
  },
];
