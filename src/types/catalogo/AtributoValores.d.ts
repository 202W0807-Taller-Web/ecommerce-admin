export interface NuevoAtributoValor {
  valor: string;
}

export interface AtributoValor {
  id: number;
  atributoId: number;
  valor: string;
  nombreAtributo?: string | null;
}
