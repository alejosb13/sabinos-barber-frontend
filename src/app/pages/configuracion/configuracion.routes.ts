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
        path: 'metodo-pago',
        loadChildren: () =>
          import('./metodo-pago/metodo-pago.routes').then((m) => m.routes),
        data: {
          title: 'Método Pago',
        },
      },
    ],
  },
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
      },
      {
        path: 'tipos-gasto',
        loadChildren: () =>
          import('./tipo-gasto/tipo-gasto.routes').then((m) => m.routes),
        data: {
          title: 'Tipos de gastos',
        },
      },
    ],
  },
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
      },
      {
        path: 'servicios',
        loadChildren: () =>
          import('./servicios/servicios.routes').then((m) => m.routes),
        data: {
          title: 'Servicios',
        },
      },
    ],
  },
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
      },
      {
        path: 'saldos',
        loadChildren: () =>
          import('./saldo/saldo.routes').then((m) => m.routes),
        data: {
          title: 'Saldo',
        },
      },
    ],
  },
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
      },
    ],
  },
];
