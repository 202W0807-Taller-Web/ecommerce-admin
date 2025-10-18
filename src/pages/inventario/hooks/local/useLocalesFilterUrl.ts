import { useSearchParams } from "react-router-dom";

export const useLocalesFilterUrl = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const nombre = searchParams.get("nombre") ?? "";
  const departamento = searchParams.get("departamento") ?? "";
  const provincia = searchParams.get("provincia") ?? "";
  const distrito = searchParams.get("distrito") ?? "";

  const setParams = (newParams: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === "" || value === "0") params.delete(key);
      else params.set(key, String(value));
    });
    if (!("page" in newParams)) params.set("page", "1");
    setSearchParams(params);
  };

  const setPage = (p: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(p));
    setSearchParams(params);
  };

  return {
    page,
    nombre,
    departamento,
    provincia,
    distrito,
    setPage,
    setParams,
  };
};
