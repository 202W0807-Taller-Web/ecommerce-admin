import { EstadoDevolucion, AccionItemDevolucion } from '../types/devolucion';
import type { ItemDevolucion, DevolucionEnLista } from '../types/devolucion';

/**
 * Obtiene el color CSS para un estado de devolución
 */
export const getEstadoColor = (estado: EstadoDevolucion): string => {
  const colorMap: Record<EstadoDevolucion, string> = {
    [EstadoDevolucion.SOLICITADO]: 'bg-yellow-100 text-yellow-800',
    [EstadoDevolucion.APROBADO]: 'bg-blue-100 text-blue-800',
    [EstadoDevolucion.RECHAZADO]: 'bg-red-100 text-red-800',
    [EstadoDevolucion.PROCESANDO]: 'bg-purple-100 text-purple-800',
    [EstadoDevolucion.COMPLETADO]: 'bg-green-100 text-green-800',
    [EstadoDevolucion.CANCELADO]: 'bg-gray-100 text-gray-800',
    [EstadoDevolucion.ERROR_REEMBOLSO]: 'bg-red-200 text-red-900',
  };
  return colorMap[estado] || 'bg-gray-100 text-gray-800';
};

/**
 * Obtiene el texto legible para un estado de devolución
 */
export const getEstadoTexto = (estado: EstadoDevolucion): string => {
  const textoMap: Record<EstadoDevolucion, string> = {
    [EstadoDevolucion.SOLICITADO]: 'Solicitado',
    [EstadoDevolucion.APROBADO]: 'Aprobado',
    [EstadoDevolucion.RECHAZADO]: 'Rechazado',
    [EstadoDevolucion.PROCESANDO]: 'Procesando',
    [EstadoDevolucion.COMPLETADO]: 'Completado',
    [EstadoDevolucion.CANCELADO]: 'Cancelado',
    [EstadoDevolucion.ERROR_REEMBOLSO]: 'Error en Reembolso',
  };
  return textoMap[estado] || estado;
};

/**
 * Obtiene el color CSS para un tipo de acción
 */
export const getAccionColor = (accion: AccionItemDevolucion): string => {
  const colorMap: Record<AccionItemDevolucion, string> = {
    [AccionItemDevolucion.REEMBOLSO]: 'bg-green-100 text-green-800',
    [AccionItemDevolucion.REEMPLAZO]: 'bg-blue-100 text-blue-800',
    [AccionItemDevolucion.REPARACION]: 'bg-orange-100 text-orange-800',
  };
  return colorMap[accion] || 'bg-gray-100 text-gray-800';
};

/**
 * Calcula el monto total de una devolución
 */
export const calcularMontoTotal = (items: ItemDevolucion[]): number => {
  return items.reduce((total, item) => {
    return total + item.precio_unitario_dev * item.cantidad_dev;
  }, 0);
};

/**
 * Determina el tipo de devolución basado en los items
 */
export const determinarTipoDevolucion = (
  items: ItemDevolucion[]
): 'Reembolso' | 'Reemplazo' | 'Mixta' | 'Reparación' => {
  const tieneReembolso = items.some(
    (item) => item.tipo_accion === AccionItemDevolucion.REEMBOLSO
  );
  const tieneReemplazo = items.some(
    (item) => item.tipo_accion === AccionItemDevolucion.REEMPLAZO
  );
  const tieneReparacion = items.some(
    (item) => item.tipo_accion === AccionItemDevolucion.REPARACION
  );

  if ((tieneReembolso && tieneReemplazo) || (tieneReembolso && tieneReparacion) || (tieneReemplazo && tieneReparacion)) {
    return 'Mixta';
  }
  if (tieneReembolso) return 'Reembolso';
  if (tieneReemplazo) return 'Reemplazo';
  if (tieneReparacion) return 'Reparación';
  
  return 'Reembolso';
};

/**
 * Formatea una fecha ISO a formato legible
 */
export const formatearFecha = (fecha: string): string => {
  return new Date(fecha).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Formatea una fecha ISO a formato corto
 */
export const formatearFechaCorta = (fecha: string): string => {
  return new Date(fecha).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

/**
 * Formatea un monto en moneda peruana
 */
export const formatearMonto = (monto: number, moneda: string = 'PEN'): string => {
  const simbolo = moneda === 'PEN' ? 'S/.' : '$';
  return `${simbolo} ${monto.toFixed(2)}`;
};

/**
 * Verifica si una devolución puede ser aprobada
 */
export const puedeSerAprobada = (estado: EstadoDevolucion): boolean => {
  return estado === EstadoDevolucion.SOLICITADO;
};

/**
 * Verifica si una devolución puede ser rechazada
 */
export const puedeSerRechazada = (estado: EstadoDevolucion): boolean => {
  return estado === EstadoDevolucion.SOLICITADO;
};

/**
 * Verifica si una devolución puede ejecutar reembolso
 */
export const puedeEjecutarReembolso = (estado: EstadoDevolucion): boolean => {
  return estado === EstadoDevolucion.APROBADO || estado === EstadoDevolucion.PROCESANDO;
};

/**
 * Filtra devoluciones por estado
 */
export const filtrarPorEstado = (
  devoluciones: DevolucionEnLista[],
  estado?: EstadoDevolucion
): DevolucionEnLista[] => {
  if (!estado) return devoluciones;
  return devoluciones.filter((dev) => dev.estado === estado);
};

/**
 * Ordena devoluciones por fecha (más recientes primero)
 */
export const ordenarPorFecha = (
  devoluciones: DevolucionEnLista[],
  ascendente: boolean = false
): DevolucionEnLista[] => {
  return [...devoluciones].sort((a, b) => {
    const fechaA = new Date(a.createdAt).getTime();
    const fechaB = new Date(b.createdAt).getTime();
    return ascendente ? fechaA - fechaB : fechaB - fechaA;
  });
};
