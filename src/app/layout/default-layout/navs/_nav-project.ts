import { INavData } from '@coreui/angular';

export const navItemsProject: INavData[] = [
  {
    name: 'Inicio',
    url: '/',
    iconComponent: { name: 'cil-home' },
    attributes: {
      roles: ['administrador', 'encargado'],
      seccion: 'Inicio',
    },
  },
  {
    name: 'Productos',
    url: '/productos',
    iconComponent: { name: 'cil-cut' },
    attributes: {
      roles: ['administrador', 'encargado'],
    },
  },
  {
    name: 'Clientes',
    url: '/clientes',
    iconComponent: { name: 'cil-user' },
    attributes: {
      roles: ['administrador', 'encargado'],
    },
  },
  {
    name: 'Locales',
    url: '/locales',
    iconComponent: { name: 'cil-factory' },
    attributes: {
      roles: ['administrador'],
    },
  },
  // {
  //   name: 'Roles',
  //   url: '/roles',
  //   iconComponent: { name: 'cil-lan' },
  // },
  {
    name: 'Usuarios',
    url: '/usuarios',
    iconComponent: { name: 'cil-user' },
    attributes: {
      roles: ['administrador'],
    },
  },
  {
    name: 'Empleados',
    url: '/empleados',
    iconComponent: { name: 'cil-user' },
    attributes: {
      roles: ['administrador', 'encargado'],
    },
  },
  {
    name: 'Facturas',
    url: '/facturas',
    iconComponent: { name: 'faFileInvoiceDollar' },
    attributes: {
      roles: ['administrador', 'encargado'],
    },
  },
  {
    name: 'Nominas',
    url: '/nominas',
    iconComponent: { name: 'faPersonCircleCheck' },
    attributes: {
      roles: ['administrador'],
    },
  },
  {
    name: 'Gastos',
    url: '/gastos',
    iconComponent: { name: 'faHandHoldingDollar' },
    attributes: {
      roles: ['administrador', 'encargado'],
    },
  },
  {
    name: 'Ajustes',
    iconComponent: { name: 'cil-settings' },
    children: [
      {
        name: 'Método de pago',
        url: '/ajustes/metodo-pago',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Tipo de gasto',
        url: '/ajustes/tipos-gasto',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Servicios',
        url: '/ajustes/servicios',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Saldos',
        url: '/ajustes/saldos',
        icon: 'nav-icon-bullet',
      },
    ],
    attributes: {
      roles: ['administrador'],
    },
  },
];
