
// Tipos literales en lugar de enums para compatibilidad con erasableSyntaxOnly
export const EstadoDevolucion = {
    SOLICITADO: 'SOLICITADO',
    APROBADO: 'APROBADO',
    RECHAZADO: 'RECHAZADO',
    PROCESANDO: 'PROCESANDO',
    COMPLETADO: 'COMPLETADO',
    CANCELADO: 'CANCELADO',
    ERROR_REEMBOLSO: 'ERROR_REEMBOLSO',
  } as const;
  
  export type EstadoDevolucion = typeof EstadoDevolucion[keyof typeof EstadoDevolucion];
  
  export const AccionItemDevolucion = {
    REEMBOLSO: 'REEMBOLSO',
    REEMPLAZO: 'REEMPLAZO',
    REPARACION: 'REPARACION',
  } as const;
  
  export type AccionItemDevolucion = typeof AccionItemDevolucion[keyof typeof AccionItemDevolucion];
  
  export const MetodoDevolucion = {
    CORREO: 'CORREO',
    RECOGIDA: 'RECOGIDA',
    TIENDA: 'TIENDA',
  } as const;
  
  export type MetodoDevolucion = typeof MetodoDevolucion[keyof typeof MetodoDevolucion];
  
  // Interfaces para Items de Devolución
  export interface ItemDevolucion {
    id: string;
    devolucion_id: string;
    tipo_accion: AccionItemDevolucion;
    producto_id_dev: number;
    cantidad_dev: number;
    precio_unitario_dev: number;
    producto_id_new?: number;
    cantidad_new?: number;
    precio_unitario_new?: number;
    motivo: string;
  }
  
  export interface CreateItemDevolucionDto {
    producto_id_dev: number;
    cantidad_dev: number;
    precio_unitario_dev: number;
    producto_id_new?: number;
    cantidad_new?: number;
    precio_unitario_new?: number;
    tipo_accion: AccionItemDevolucion;
    motivo: string;
  }
  
  // Interfaces para Devolución
  export interface Devolucion {
    id: string;
    orden_id: string;
    codDevolucion: string;
    correlativo: number;
    createdAt: string;
    estado: EstadoDevolucion;
    orden_reemplazo_id?: string;
    items: ItemDevolucion[];
    historial?: DevolucionHistorial[];
    reembolso?: Reembolso;
  }
  
  // Devolución enriquecida para la lista
  export interface DevolucionEnLista extends Devolucion {
    nombreCliente: string;
    codOrden: string;
    montoTotal: number;
    tipoDevolucion: 'Reembolso' | 'Reemplazo' | 'Mixta' | 'Solicitado';
  }
  
  // Devolución detallada con datos adicionales
  export interface DevolucionDetalle extends Devolucion {
    datosCliente: {
      nombres: string;
      telefono: string;
      idUsuario: string;
    };
    codOrden: string;
  }
  
  // Historial de cambios de estado
  export interface DevolucionHistorial {
    id: string;
    devolucion_id: string;
    estado_anterior: EstadoDevolucion;
    estado_nuevo: EstadoDevolucion;
    fecha_creacion: string;
    modificado_por_id: number;
  }
  
  // Reembolso
  export interface Reembolso {
    id: string;
    devolucion_id: string;
    monto: number;
    moneda: string;
    fecha_procesamiento: string;
    estado: string;
    transaccion_id: string;
  }
  
  // DTOs para operaciones
  export interface CreateDevolucionDto {
    orden_id: string;
    estado: EstadoDevolucion;
    items: CreateItemDevolucionDto[];
    orden_reemplazo_id?: string;
  }
  
  export interface UpdateDevolucionDto {
    estado?: EstadoDevolucion;
    orden_reemplazo_id?: string;
  }
  
  export interface AprobarDevolucionDto {
    adminId: number;
    metodoDevolucion: MetodoDevolucion;
  }
  
  export interface RechazarDevolucionDto {
    adminId: number;
    motivo: string;
    comentario?: string;
  }
  
  // Respuestas específicas
  export interface AprobarDevolucionResponse {
    devolucion: Devolucion;
    instrucciones: InstruccionesDevolucion;
  }
  
  export interface InstruccionesDevolucion {
    numeroAutorizacion: string;
    metodoDevolucion: MetodoDevolucion;
    direccion?: string;
    fechaLimite: string;
    instruccionesAdicionales: string;
  }
  