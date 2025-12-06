import { useSearchParams } from "react-router-dom";

export function useStockFilterUrl() {
  const [params, setParams] = useSearchParams();

  const page = parseInt(params.get("page") || "1", 10);
  const categoria = params.get("categoria") || "";

  const setPage = (newPage: number) => {
    params.set("page", newPage.toString());
    setParams(params);
  };

  const setCategoria = (newCategoria: string) => {
    if (newCategoria) params.set("categoria", newCategoria);
    else params.delete("categoria");
    params.set("page", "1"); // reset a primera página al filtrar
    setParams(params);
  };

  return {
    page,
    categoria,
    setPage,
    setCategoria,
  };
}
