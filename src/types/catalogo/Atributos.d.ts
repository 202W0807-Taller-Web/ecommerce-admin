import { AtributoValor } from "./AtributoValores";
export interface Atributo {
  id: number;
  nombre: string;
  atributo: string;
  tipo: string;
  valor: string;
  atributoValores: AtributoValor[];
  atributoValor?:AtributoValor
}