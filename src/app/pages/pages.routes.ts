import { Routes } from '@angular/router';

export const routesPages: Routes = [
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
        loadChildren: () =>
          import('./panel/productos.routes').then((m) => m.routes),
        data: {
          title: '',
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
        path: 'productos',
        loadChildren: () =>
          import('./producto/productos.routes').then((m) => m.routes),
        data: {
          title: 'Productos',
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
        path: 'clientes',
        loadChildren: () =>
          import('./cliente/clientes.routes').then((m) => m.routes),
        data: {
          title: 'Clientes',
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
        path: 'locales',
        loadChildren: () =>
          import('./local/local.routes').then((m) => m.routes),
        data: {
          title: 'Locales',
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
        path: 'roles',
        loadChildren: () => import('./rol/local.routes').then((m) => m.routes),
        data: {
          title: 'Roles',
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
        path: 'usuarios',
        loadChildren: () =>
          import('./usuario/usuario.routes').then((m) => m.routes),
        data: {
          title: 'Usuarios',
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
        path: 'empleados',
        loadChildren: () =>
          import('./empleado/empleado.routes').then((m) => m.routes),
        data: {
          title: 'Empleados',
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
        path: 'ventas',
        loadChildren: () =>
          import('./ventas-productos/ventas.routes').then((m) => m.routes),
        data: {
          title: 'Ventas',
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
        path: 'facturas',
        loadChildren: () =>
          import('./factura/facturas.routes').then((m) => m.routes),
        data: {
          title: 'Facturas',
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
        path: 'nominas',
        loadChildren: () =>
          import('./nomina/nominas.routes').then((m) => m.routes),
        data: {
          title: 'Nominas',
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
        path: 'gastos',
        loadChildren: () =>
          import('./gasto/gasto.routes').then((m) => m.routes),
        data: {
          title: 'Gastos',
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
        path: 'ajustes',
        loadChildren: () =>
          import('./configuracion/configuracion.routes').then((m) => m.routes),
        data: {
          title: 'Ajustes',
        },
      },
    ],
  },
];
