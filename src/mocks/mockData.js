export const mockRMARequests = [
  {
    id: '1',
    nombreEmpresa: 'Tech Solutions S.A.',
    direccion: 'Av. Reforma 123, Col. Centro',
    codigoPostal: '06000',
    servicio: 'Reparación de Equipos',
    status: 'RMA_SUBMITTED',
    numeroTracking: 'TRK001234567',
    cotizacion: {
      filename: 'cotizacion-001.pdf',
      url: '#'
    },
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-15T10:30:00')
  },
  {
    id: '2',
    nombreEmpresa: 'Innovar Corp.',
    direccion: 'Calle Revolución 456, Guadalajara',
    codigoPostal: '44100',
    servicio: 'Mantenimiento Preventivo',
    status: 'AWAITING_GOODS',
    numeroTracking: 'TRK001234568',
    ordenCompra: {
      filename: 'orden-compra-002.pdf',
      url: '#'
    },
    createdAt: new Date('2024-01-14T14:20:00'),
    updatedAt: new Date('2024-01-16T09:15:00')
  },
  {
    id: '3',
    nombreEmpresa: 'Desarrollo Digital Ltda.',
    direccion: 'Paseo de la Reforma 789, CDMX',
    codigoPostal: '11000',
    servicio: 'Consultoría Técnica',
    status: 'EVALUATING',
    numeroTracking: 'TRK001234569',
    cotizacion: {
      filename: 'cotizacion-003.pdf',
      url: '#'
    },
    ordenCompra: {
      filename: 'orden-compra-003.pdf',
      url: '#'
    },
    createdAt: new Date('2024-01-13T16:45:00'),
    updatedAt: new Date('2024-01-17T11:30:00')
  },
  {
    id: '4',
    nombreEmpresa: 'Sistemas Avanzados',
    direccion: 'Blvd. Miguel de Cervantes 321, Monterrey',
    codigoPostal: '64000',
    servicio: 'Instalación de Software',
    status: 'PROCESSING',
    numeroTracking: 'TRK001234570',
    createdAt: new Date('2024-01-12T08:15:00'),
    updatedAt: new Date('2024-01-18T14:20:00')
  },
  {
    id: '5',
    nombreEmpresa: 'Comercio Electrónico SA',
    direccion: 'Av. Universidad 654, Puebla',
    codigoPostal: '72000',
    servicio: 'Soporte Técnico',
    status: 'PAYMENT',
    numeroTracking: 'TRK001234571',
    cotizacion: {
      filename: 'cotizacion-005.pdf',
      url: '#'
    },
    createdAt: new Date('2024-01-11T12:00:00'),
    updatedAt: new Date('2024-01-19T10:45:00')
  },
  {
    id: '6',
    nombreEmpresa: 'Logística Global',
    direccion: 'Carretera Federal 987, Tijuana',
    codigoPostal: '22000',
    servicio: 'Implementación de Sistema',
    status: 'IN_SHIPPING',
    numeroTracking: 'TRK001234572',
    ordenCompra: {
      filename: 'orden-compra-006.pdf',
      url: '#'
    },
    createdAt: new Date('2024-01-10T15:30:00'),
    updatedAt: new Date('2024-01-20T16:10:00')
  },
  {
    id: '7',
    nombreEmpresa: 'Servicios Profesionales',
    direccion: 'Calle Principal 147, Mérida',
    codigoPostal: '97000',
    servicio: 'Auditoría de Sistemas',
    status: 'COMPLETE',
    numeroTracking: 'TRK001234573',
    cotizacion: {
      filename: 'cotizacion-007.pdf',
      url: '#'
    },
    ordenCompra: {
      filename: 'orden-compra-007.pdf',
      url: '#'
    },
    createdAt: new Date('2024-01-09T09:20:00'),
    updatedAt: new Date('2024-01-21T13:45:00')
  },
  {
    id: '8',
    nombreEmpresa: 'Industrias Manufactureras',
    direccion: 'Zona Industrial 258, León',
    codigoPostal: '37000',
    servicio: 'Reparación de Equipos',
    status: 'REJECTED',
    numeroTracking: 'TRK001234574',
    razonRechazo: 'Documentación incompleta. Falta información técnica detallada del equipo y especificaciones del problema reportado.',
    createdAt: new Date('2024-01-08T11:10:00'),
    updatedAt: new Date('2024-01-22T08:30:00')
  }
];