// Tipos para el módulo de catálogo de productos

export interface ProductoImagen {
    id: number;
    productoId: number;
    principal: boolean;
    imagen: string;
  }
  
  export interface VarianteImagen {
    id: number;
    varianteId: number;
    imagen: string;
  }
  
  export interface VarianteAtributo {
    id: number;
    varianteId: number;
    atributoValorId: number;
    atributoValor: AtributoValor;
  }
  
  export interface Variante {
    id: number;
    productoId: number;
    precio: number;
    sku: string;
    varianteImagenes: VarianteImagen[];
    varianteAtributos: VarianteAtributo[];
  }
  
  export interface AtributoValor {
    id: number;
    atributoId: number;
    valor: string;
    atributo: any | null;
  }
  
  export interface ProductoAtributo {
    id: number;
    productoId: number;
    atributoValorId: number;
    atributoValor: AtributoValor;
  }
  
  export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    idPromocion: number | null;
    productoImagenes: ProductoImagen[];
    variantes: Variante[];
    productoAtributos: ProductoAtributo[];
  }
  
  // Tipo simplificado para usar en formularios
  export interface ProductoSimplificado {
    id: number;
    nombre: string;
    descripcion: string;
    imagenPrincipal: string;
    precioBase: number;
    cantidadVariantes: number;
    variantes: Variante[];
  }