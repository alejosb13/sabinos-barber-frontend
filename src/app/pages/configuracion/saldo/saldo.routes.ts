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
          import('./saldo-list/saldo-list.component').then(
            (m) => m.SaldoListComponent
          ),
        data: {
          title: 'Listado',
        },
      },
      {
        // Ruta de edición con el parámetro dinámico :id
        path: 'editar/:id',
        loadComponent: () =>
          import('./saldo-editar/saldo-editar.component').then(
            (m) => m.SaldoEditarComponent
          ),
        data: {
          title: 'Editar',
        },
      },
      {
        path: 'insertar',
        loadComponent: () =>
          import('./saldo-insertar/saldo-insertar.component').then(
            (m) => m.SaldoInsertarComponent
          ),
        data: {
          title: 'Agregar',
        },
      },
    ],
  },
];
