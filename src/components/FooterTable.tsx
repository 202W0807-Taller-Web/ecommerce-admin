import Pagination from "./Pagination";

export const FooterTable = ({
  page, // pagina actual
  limit, // elementos por pagina
  total_pages, // total de paginas
  total, // total de elementos
  handlePageChange,
}: {
  page: number;
  limit: number;
  total_pages: number;
  total: number;
  handlePageChange: (page: number) => void;
}) => {
  if (!total_pages || total_pages <= 0) return null;
  return (
    <div className="w-full">
      <div className="flex justify-end items-center w-full mt-2">
        <span className="text-sm text-gray-500 mr-2">
          {`Mostrando ${(page - 1) * limit + 1} - ${Math.min(page * limit, total)} de ${total} resultados`}
        </span>
      </div>
      <div className="flex justify-center mt-4 w-full">
        <Pagination
          currentPage={page}
          totalPages={total_pages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default FooterTable;
