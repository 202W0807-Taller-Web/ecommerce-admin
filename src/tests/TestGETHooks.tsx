import React, { useEffect } from "react";
import {
  useAtributos,
  useAtributoById,
} from "../hooks/catalogo/useAtributos";
import {
  useAtributoValores,
  useValoresByAtributoId,
  useValorById,
} from "../hooks/catalogo/useAtributoValores";
import {
  useProductos,
  useProductoById,
} from "../hooks/catalogo/useProductos";
import {
  useVariantesByProducto,
} from "../hooks/catalogo/useVariantes";

const TestHooks: React.FC = () => {
  // --- Hooks generales ---
  const { data: atributos, loading: loadingAtributos } = useAtributos();
  const { data: valoresAtributo, loading: loadingValores } = useAtributoValores();
  const { data: productos, loading: loadingProductos } = useProductos();

  // --- IDs dinámicos (cuando haya datos) ---
  const atributoId = atributos?.[0]?.id;
  const productoId = productos?.[0]?.id;
  const valorId = valoresAtributo?.[0]?.id;

  // --- Hooks dependientes ---
  const { data: atributoById } = useAtributoById(atributoId || 0);
  const { data: valoresPorAtributo } = useValoresByAtributoId(atributoId || 0);
  const { data: valorAtributoById } = useValorById(
    atributoId || 0,
    valorId || 0
  );
  const { data: producto } = useProductoById(productoId || 0);
  const { data: variantes } = useVariantesByProducto(productoId || 0);

  // --- Logs automáticos ---
  useEffect(() => {
    if (!loadingAtributos && atributos)
      console.log("✅ Atributos:", atributos);
  }, [atributos, loadingAtributos]);

  useEffect(() => {
    if (atributoById)
      console.log(`✅ Atributo ${atributoId}:`, atributoById);
  }, [atributoById, atributoId]);

  useEffect(() => {
    if (!loadingValores && valoresAtributo)
      console.log("✅ Todos los valores de atributos:", valoresAtributo);
  }, [valoresAtributo, loadingValores]);

  useEffect(() => {
    if (valoresPorAtributo?.length)
      console.log(`✅ Valores del atributo ${atributoId}:`, valoresPorAtributo);
  }, [valoresPorAtributo, atributoId]);

  useEffect(() => {
    if (valorAtributoById)
      console.log(`✅ Valor ${valorId} del atributo ${atributoId}:`, valorAtributoById);
  }, [valorAtributoById, atributoId, valorId]);

  useEffect(() => {
    if (!loadingProductos && productos)
      console.log("✅ Productos:", productos);
  }, [productos, loadingProductos]);

  useEffect(() => {
    if (producto)
      console.log(`✅ Producto ${productoId}:`, producto);
  }, [producto, productoId]);

  useEffect(() => {
    if (variantes?.length)
      console.log(`✅ Variantes del producto ${productoId}:`, variantes);
  }, [variantes, productoId]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">🧪 Prueba de Hooks (GET)</h1>
      <p>Abre la consola para ver los resultados de todos los endpoints GET.</p>
      <ul className="list-disc ml-6 text-gray-700">
        <li>Atributos: {loadingAtributos ? "Cargando..." : "OK"}</li>
        <li>Atributo por ID: {atributoById ? "OK" : "Esperando..."}</li>
        <li>Valores de atributos: {loadingValores ? "Cargando..." : "OK"}</li>
        <li>Valores por atributo: {valoresPorAtributo ? "OK" : "Esperando..."}</li>
        <li>Valor atributo por ID: {valorAtributoById ? "OK" : "Esperando..."}</li>
        <li>Productos: {loadingProductos ? "Cargando..." : "OK"}</li>
        <li>Producto por ID: {producto ? "OK" : "Esperando..."}</li>
        <li>Variantes: {variantes ? "OK" : "Esperando..."}</li>
      </ul>
    </div>
  );
};

export default TestHooks;