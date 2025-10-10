import Pagination from "../../../components/Pagination";
import type { Pagination as PaginationMeta } from "../../../modules/inventario-envios/local/types/pagination";

const FooterTable = ({
  page,
  pagination,
  limit,
  handlePageChange,
}: {
  page: number;
  pagination?: PaginationMeta;
  limit: number;
  handlePageChange: (page: number) => void;
}) => {
  if (!pagination) return null;
  return (
    <div className="w-full">
      <div className="flex justify-end items-center w-full mt-2">
        <span className="text-sm text-gray-500 mr-2">
          {pagination &&
            `Mostrando ${(pagination.page - 1) * limit + 1} - ${Math.min(pagination.page * limit, pagination.total)} de ${pagination.total} resultados`}
        </span>
      </div>
      <div className="flex justify-center mt-4 w-full">
        <Pagination
          currentPage={page}
          totalPages={pagination?.total_pages || 0}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default FooterTable;
